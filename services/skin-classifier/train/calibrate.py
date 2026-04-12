"""
Temperature scaling calibration for skin condition classifier.

Learns a single temperature parameter T that maps raw logits to
calibrated probabilities: p = softmax(logits / T).

Usage:
    python calibrate.py --model ../model/v3_vit_large_384 [--val ../data/processed_384/val]
"""

import argparse
import json
import sys
from pathlib import Path

import numpy as np
import torch
import torch.nn as nn
from PIL import Image
from torch.utils.data import DataLoader, Dataset
from transformers import AutoImageProcessor, AutoModelForImageClassification

SCRIPT_DIR = Path(__file__).resolve().parent

FALLBACK_LABELS = [
    "acne", "dermatitis", "dryness", "eczema", "fungal",
    "hyperpigmentation", "psoriasis", "rosacea", "sun_damage",
]


def get_model_labels(model_path: Path):
    """Read labels from the model's config.json id2label mapping."""
    config_file = model_path / "config.json"
    if config_file.exists():
        with open(config_file) as f:
            cfg = json.load(f)
        id2label = cfg.get("id2label", {})
        if id2label:
            n = len(id2label)
            labels = [id2label[str(i)] for i in range(n)]
            return labels
    return FALLBACK_LABELS


class ValDataset(Dataset):
    def __init__(self, root: Path, processor, label2id: dict):
        self.processor = processor
        self.samples = []
        for class_dir in sorted(root.iterdir()):
            if not class_dir.is_dir():
                continue
            label = class_dir.name
            if label not in label2id:
                continue
            label_id = label2id[label]
            for img_path in sorted(class_dir.iterdir()):
                if img_path.suffix.lower() in (".jpg", ".jpeg", ".png"):
                    self.samples.append((img_path, label_id))

    def __len__(self):
        return len(self.samples)

    def __getitem__(self, idx):
        path, label = self.samples[idx]
        image = Image.open(path).convert("RGB")
        inputs = self.processor(images=image, return_tensors="pt")
        return inputs["pixel_values"].squeeze(0), label


class TemperatureScaler(nn.Module):
    def __init__(self):
        super().__init__()
        self.temperature = nn.Parameter(torch.ones(1) * 1.5)

    def forward(self, logits):
        temp = self.temperature.clamp(min=0.1, max=10.0)
        return logits / temp


def main():
    parser = argparse.ArgumentParser(description="Calibrate skin classifier")
    parser.add_argument("--model", type=str, required=True)
    parser.add_argument("--val", type=str, default=str(SCRIPT_DIR / ".." / "data" / "processed_384" / "val"))
    parser.add_argument("--lr", type=float, default=0.01)
    parser.add_argument("--max-iter", type=int, default=100)
    args = parser.parse_args()

    model_path = Path(args.model).resolve()
    val_dir = Path(args.val).resolve()

    has_cuda = torch.cuda.is_available()
    has_mps = hasattr(torch.backends, "mps") and torch.backends.mps.is_available()
    device = "cuda" if has_cuda else ("mps" if has_mps else "cpu")

    print(f"[calibrate] Device: {device}")
    print(f"[calibrate] Model: {model_path}")

    labels = get_model_labels(model_path)
    label2id = {label: i for i, label in enumerate(labels)}
    print(f"[calibrate] Labels ({len(labels)}): {', '.join(labels)}")

    processor = AutoImageProcessor.from_pretrained(str(model_path))
    model = AutoModelForImageClassification.from_pretrained(str(model_path))
    model.to(device)
    model.eval()

    dataset = ValDataset(val_dir, processor, label2id)
    loader = DataLoader(dataset, batch_size=32, shuffle=False, num_workers=0)
    print(f"[calibrate] Validation samples: {len(dataset)}")

    all_logits = []
    all_labels = []

    print("[calibrate] Collecting logits...")
    with torch.no_grad():
        for pixel_values, labels in loader:
            pixel_values = pixel_values.to(device)
            outputs = model(pixel_values=pixel_values)
            all_logits.append(outputs.logits.cpu())
            all_labels.append(labels)

    logits = torch.cat(all_logits, dim=0)
    labels = torch.cat(all_labels, dim=0)

    preds_before = logits.argmax(dim=-1)
    acc_before = (preds_before == labels).float().mean().item()

    probs_before = torch.nn.functional.softmax(logits, dim=-1)
    nll_before = nn.CrossEntropyLoss()(logits, labels).item()

    print(f"[calibrate] Before calibration: acc={acc_before:.4f}, NLL={nll_before:.4f}")

    scaler = TemperatureScaler()
    optimizer = torch.optim.LBFGS([scaler.temperature], lr=args.lr, max_iter=args.max_iter)
    nll_criterion = nn.CrossEntropyLoss()

    def closure():
        optimizer.zero_grad()
        loss = nll_criterion(scaler(logits), labels)
        loss.backward()
        return loss

    optimizer.step(closure)

    temp = scaler.temperature.item()
    calibrated_logits = logits / temp
    nll_after = nn.CrossEntropyLoss()(calibrated_logits, labels).item()

    print(f"[calibrate] Optimal temperature: {temp:.4f}")
    print(f"[calibrate] After calibration: NLL={nll_after:.4f} (was {nll_before:.4f})")

    cal_file = model_path / "calibration.json"
    with open(cal_file, "w") as f:
        json.dump({
            "temperature": round(temp, 6),
            "nll_before": round(nll_before, 6),
            "nll_after": round(nll_after, 6),
            "val_accuracy": round(acc_before, 6),
        }, f, indent=2)

    print(f"[calibrate] Saved to {cal_file}")


if __name__ == "__main__":
    main()
