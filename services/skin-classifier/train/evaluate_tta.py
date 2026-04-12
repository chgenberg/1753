"""
Evaluate with Test-Time Augmentation (TTA).

Runs each test image through multiple augmentations and averages
the predictions for more robust classification.

Usage:
    python evaluate_tta.py [--model ../model/v3_vit_large_384] [--tta-passes 8]
"""

import argparse
import json
import sys
from pathlib import Path

import numpy as np
import torch
import torchvision.transforms as T
from PIL import Image
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
            return [id2label[str(i)] for i in range(n)]
    return FALLBACK_LABELS


def build_tta_transforms(image_size: int):
    """Build a list of TTA transforms."""
    return [
        T.Compose([T.Resize((image_size, image_size)), T.ToTensor()]),
        T.Compose([T.Resize((image_size, image_size)), T.RandomHorizontalFlip(p=1.0), T.ToTensor()]),
        T.Compose([T.Resize((image_size, image_size)), T.RandomVerticalFlip(p=1.0), T.ToTensor()]),
        T.Compose([T.Resize((int(image_size * 1.15), int(image_size * 1.15))),
                    T.CenterCrop(image_size), T.ToTensor()]),
        T.Compose([T.Resize((int(image_size * 1.15), int(image_size * 1.15))),
                    T.FiveCrop(image_size),
                    T.Lambda(lambda crops: crops[0]), T.ToTensor()]),
        T.Compose([T.Resize((image_size, image_size)),
                    T.RandomRotation(degrees=10, fill=0), T.ToTensor()]),
        T.Compose([T.Resize((image_size, image_size)),
                    T.ColorJitter(brightness=0.15, contrast=0.15), T.ToTensor()]),
        T.Compose([T.Resize((image_size, image_size)),
                    T.RandomAffine(degrees=0, translate=(0.05, 0.05)), T.ToTensor()]),
    ]


def predict_tta(model, processor, image: Image.Image, device: str, tta_transforms, n_passes: int):
    """Run TTA and return averaged softmax probabilities."""
    all_probs = []

    inputs = processor(images=image, return_tensors="pt")
    inputs = {k: v.to(device) for k, v in inputs.items()}
    with torch.no_grad():
        logits = model(**inputs).logits
        probs = torch.nn.functional.softmax(logits, dim=-1)[0].cpu().numpy()
    all_probs.append(probs)

    for i, tfm in enumerate(tta_transforms[:n_passes - 1]):
        try:
            aug_tensor = tfm(image.copy())
            if aug_tensor.dim() == 3:
                aug_tensor = aug_tensor.unsqueeze(0)
            aug_tensor = aug_tensor.to(device)
            with torch.no_grad():
                logits = model(pixel_values=aug_tensor).logits
                probs = torch.nn.functional.softmax(logits, dim=-1)[0].cpu().numpy()
            all_probs.append(probs)
        except Exception:
            continue

    return np.mean(all_probs, axis=0)


def load_test_images(test_dir: Path, label2id: dict):
    samples = []
    for class_dir in sorted(test_dir.iterdir()):
        if not class_dir.is_dir():
            continue
        label = class_dir.name
        if label not in label2id:
            continue
        label_id = label2id[label]
        for img_path in sorted(class_dir.iterdir()):
            if img_path.suffix.lower() in (".jpg", ".jpeg", ".png"):
                samples.append((img_path, label_id))
    return samples


def main():
    parser = argparse.ArgumentParser(description="Evaluate with TTA")
    parser.add_argument("--model", type=str, default=str(SCRIPT_DIR / ".." / "model" / "best_model"))
    parser.add_argument("--test", type=str, default=str(SCRIPT_DIR / ".." / "data" / "processed_384" / "test"))
    parser.add_argument("--tta-passes", type=int, default=8)
    args = parser.parse_args()

    model_path = Path(args.model).resolve()
    test_dir = Path(args.test).resolve()

    has_cuda = torch.cuda.is_available()
    has_mps = hasattr(torch.backends, "mps") and torch.backends.mps.is_available()
    device = "cuda" if has_cuda else ("mps" if has_mps else "cpu")

    print(f"[TTA-eval] Device: {device}")
    print(f"[TTA-eval] Model: {model_path}")
    print(f"[TTA-eval] TTA passes: {args.tta_passes}")

    unified_labels = get_model_labels(model_path)
    label2id = {label: i for i, label in enumerate(unified_labels)}
    print(f"[TTA-eval] Labels ({len(unified_labels)}): {', '.join(unified_labels)}")

    processor = AutoImageProcessor.from_pretrained(str(model_path))
    model = AutoModelForImageClassification.from_pretrained(str(model_path))
    model.to(device)
    model.eval()

    labels_file = model_path / "skin_labels.json"
    image_size = 384
    if labels_file.exists():
        with open(labels_file) as f:
            info = json.load(f)
            image_size = info.get("image_size", 384)

    tta_transforms = build_tta_transforms(image_size)
    samples = load_test_images(test_dir, label2id)
    print(f"[TTA-eval] Test samples: {len(samples)}")

    y_true = []
    y_pred = []
    all_probs = []

    for i, (path, label_id) in enumerate(samples):
        try:
            img = Image.open(path).convert("RGB")
            probs = predict_tta(model, processor, img, device, tta_transforms, args.tta_passes)
            pred = int(np.argmax(probs))
            y_true.append(label_id)
            y_pred.append(pred)
            all_probs.append(probs)
        except Exception as e:
            if i < 5:
                print(f"[TTA-eval] Error on {path}: {e}")
            continue

        if (i + 1) % 100 == 0:
            acc_so_far = sum(1 for t, p in zip(y_true, y_pred) if t == p) / len(y_true)
            print(f"[TTA-eval] {i + 1}/{len(samples)} -- running acc: {acc_so_far:.4f}")

    accuracy = sum(1 for t, p in zip(y_true, y_pred) if t == p) / len(y_true) if y_true else 0
    print(f"\n[TTA-eval] Overall accuracy (TTA x{args.tta_passes}): {accuracy:.4f}")

    print(f"\n{'Class':20s} {'Precision':>10s} {'Recall':>10s} {'F1':>10s} {'Support':>10s}")
    print("-" * 62)
    for i, label in enumerate(unified_labels):
        tp = sum(1 for t, p in zip(y_true, y_pred) if t == i and p == i)
        fp = sum(1 for t, p in zip(y_true, y_pred) if t != i and p == i)
        fn = sum(1 for t, p in zip(y_true, y_pred) if t == i and p != i)
        prec = tp / (tp + fp) if (tp + fp) > 0 else 0.0
        rec = tp / (tp + fn) if (tp + fn) > 0 else 0.0
        f1 = 2 * prec * rec / (prec + rec) if (prec + rec) > 0 else 0.0
        support = sum(1 for t in y_true if t == i)
        print(f"{label:20s} {prec:10.4f} {rec:10.4f} {f1:10.4f} {support:10d}")

    results_dir = SCRIPT_DIR / "results"
    results_dir.mkdir(exist_ok=True)
    np.save(str(results_dir / "tta_probs.npy"), np.array(all_probs))
    np.save(str(results_dir / "tta_labels.npy"), np.array(y_true))
    print(f"\n[TTA-eval] Probabilities saved for calibration/ensemble use")


if __name__ == "__main__":
    main()
