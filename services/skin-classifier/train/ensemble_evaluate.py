"""
Ensemble evaluation: average predictions from multiple models.

Usage:
    python ensemble_evaluate.py \
        --models ../model/v3_vit_large_384 ../model/v3_swin_384 ../model/v3_vit_base_384 \
        --test ../data/processed_384/test \
        [--tta-passes 4]
"""

import argparse
import json
import sys
from pathlib import Path

import numpy as np
import torch
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


def load_model(model_path: str, device: str):
    path = Path(model_path).resolve()
    processor = AutoImageProcessor.from_pretrained(str(path))
    model = AutoModelForImageClassification.from_pretrained(str(path))
    model.to(device)
    model.eval()

    cal_file = path / "calibration.json"
    temperature = 1.0
    if cal_file.exists():
        with open(cal_file) as f:
            cal = json.load(f)
            temperature = cal.get("temperature", 1.0)
        print(f"  Calibration temp: {temperature:.4f}")

    return model, processor, temperature


def predict_single(model, processor, image: Image.Image, device: str, temperature: float):
    inputs = processor(images=image, return_tensors="pt")
    inputs = {k: v.to(device) for k, v in inputs.items()}
    with torch.no_grad():
        logits = model(**inputs).logits / temperature
        probs = torch.nn.functional.softmax(logits, dim=-1)[0].cpu().numpy()
    return probs


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
    parser = argparse.ArgumentParser(description="Ensemble evaluation")
    parser.add_argument("--models", nargs="+", required=True)
    parser.add_argument("--test", type=str, default=str(SCRIPT_DIR / ".." / "data" / "processed_384" / "test"))
    args = parser.parse_args()

    test_dir = Path(args.test).resolve()

    has_cuda = torch.cuda.is_available()
    has_mps = hasattr(torch.backends, "mps") and torch.backends.mps.is_available()
    device = "cuda" if has_cuda else ("mps" if has_mps else "cpu")

    print(f"[ensemble] Device: {device}")
    print(f"[ensemble] Loading {len(args.models)} models...")

    # Determine labels from first model
    unified_labels = get_model_labels(Path(args.models[0]))
    label2id = {label: i for i, label in enumerate(unified_labels)}
    num_classes = len(unified_labels)
    print(f"[ensemble] Labels ({num_classes}): {', '.join(unified_labels)}")

    models = []
    for mp in args.models:
        print(f"  Loading: {mp}")
        m, p, t = load_model(mp, device)
        models.append((m, p, t))

    samples = load_test_images(test_dir, label2id)
    print(f"[ensemble] Test samples: {len(samples)}")

    y_true = []
    y_pred = []

    for i, (path, label_id) in enumerate(samples):
        try:
            img = Image.open(path).convert("RGB")
            ensemble_probs = np.zeros(num_classes)

            for model, processor, temperature in models:
                probs = predict_single(model, processor, img, device, temperature)
                if len(probs) != num_classes:
                    continue
                ensemble_probs += probs

            ensemble_probs /= len(models)
            pred = int(np.argmax(ensemble_probs))

            y_true.append(label_id)
            y_pred.append(pred)
        except Exception as e:
            if i < 5:
                print(f"[ensemble] Error: {e}")
            continue

        if (i + 1) % 200 == 0:
            acc = sum(1 for t, p in zip(y_true, y_pred) if t == p) / len(y_true)
            print(f"[ensemble] {i + 1}/{len(samples)} -- running acc: {acc:.4f}")

    accuracy = sum(1 for t, p in zip(y_true, y_pred) if t == p) / len(y_true) if y_true else 0
    print(f"\n[ensemble] Overall accuracy: {accuracy:.4f} ({sum(1 for t, p in zip(y_true, y_pred) if t == p)}/{len(y_true)})")

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
    with open(results_dir / "ensemble_evaluation.json", "w") as f:
        json.dump({
            "accuracy": round(accuracy, 4),
            "total_samples": len(y_true),
            "models": args.models,
            "num_models": len(args.models),
            "labels": unified_labels,
        }, f, indent=2)
    print(f"\n[ensemble] Results saved to {results_dir}")


if __name__ == "__main__":
    main()
