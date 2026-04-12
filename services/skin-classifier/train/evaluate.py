"""
Evaluate a fine-tuned skin condition classifier on the test set.

Usage:
    python evaluate.py [--model ../model/best_model] [--test ../data/processed/test]

Outputs:
  - Per-class precision, recall, F1
  - Confusion matrix (printed + saved as PNG if matplotlib available)
  - Overall accuracy
"""

import argparse
import json
import sys
from collections import Counter
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
            import json as _json
            cfg = _json.load(f)
        id2label = cfg.get("id2label", {})
        if id2label:
            n = len(id2label)
            return [id2label[str(i)] for i in range(n)]
    return FALLBACK_LABELS


def load_test_images(test_dir: Path, label2id: dict):
    """Load all test images and their ground truth labels."""
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


def predict_batch(model, processor, images: list[Image.Image], device: str):
    """Run inference on a batch of PIL images."""
    inputs = processor(images=images, return_tensors="pt", padding=True)
    inputs = {k: v.to(device) for k, v in inputs.items()}

    with torch.no_grad():
        outputs = model(**inputs)
        logits = outputs.logits
        preds = torch.argmax(logits, dim=-1)

    return preds.cpu().numpy()


def compute_classification_report(y_true, y_pred, labels):
    """Compute per-class precision, recall, F1 without sklearn."""
    report = {}
    for i, label in enumerate(labels):
        tp = sum(1 for t, p in zip(y_true, y_pred) if t == i and p == i)
        fp = sum(1 for t, p in zip(y_true, y_pred) if t != i and p == i)
        fn = sum(1 for t, p in zip(y_true, y_pred) if t == i and p != i)

        precision = tp / (tp + fp) if (tp + fp) > 0 else 0.0
        recall = tp / (tp + fn) if (tp + fn) > 0 else 0.0
        f1 = (2 * precision * recall / (precision + recall)) if (precision + recall) > 0 else 0.0
        support = sum(1 for t in y_true if t == i)

        report[label] = {
            "precision": round(precision, 4),
            "recall": round(recall, 4),
            "f1": round(f1, 4),
            "support": support,
        }

    return report


def compute_confusion_matrix(y_true, y_pred, n_classes):
    """Compute NxN confusion matrix."""
    cm = np.zeros((n_classes, n_classes), dtype=int)
    for t, p in zip(y_true, y_pred):
        cm[t][p] += 1
    return cm


def print_report(report, labels):
    """Pretty-print the classification report."""
    print(f"\n{'Class':20s} {'Precision':>10s} {'Recall':>10s} {'F1':>10s} {'Support':>10s}")
    print("-" * 62)
    for label in labels:
        r = report.get(label, {})
        print(
            f"{label:20s} {r.get('precision', 0):10.4f} {r.get('recall', 0):10.4f} "
            f"{r.get('f1', 0):10.4f} {r.get('support', 0):10d}"
        )


def save_confusion_matrix_plot(cm, labels, output_path: Path):
    """Save confusion matrix as PNG (requires matplotlib)."""
    try:
        import matplotlib
        matplotlib.use("Agg")
        import matplotlib.pyplot as plt
    except ImportError:
        print("[evaluate] matplotlib not installed, skipping confusion matrix plot")
        return

    fig, ax = plt.subplots(figsize=(10, 8))
    ax.imshow(cm, interpolation="nearest", cmap="Blues")
    ax.set_title("Confusion Matrix")

    tick_marks = range(len(labels))
    ax.set_xticks(tick_marks)
    ax.set_xticklabels(labels, rotation=45, ha="right", fontsize=8)
    ax.set_yticks(tick_marks)
    ax.set_yticklabels(labels, fontsize=8)

    for i in range(len(labels)):
        for j in range(len(labels)):
            color = "white" if cm[i, j] > cm.max() / 2 else "black"
            ax.text(j, i, str(cm[i, j]), ha="center", va="center", color=color, fontsize=7)

    ax.set_ylabel("True label")
    ax.set_xlabel("Predicted label")
    plt.tight_layout()
    plt.savefig(output_path, dpi=150)
    print(f"[evaluate] Confusion matrix saved to {output_path}")


def main():
    parser = argparse.ArgumentParser(description="Evaluate skin classifier")
    parser.add_argument("--model", type=str, default=str(SCRIPT_DIR / ".." / "model" / "best_model"))
    parser.add_argument("--test", type=str, default=str(SCRIPT_DIR / ".." / "data" / "processed" / "test"))
    parser.add_argument("--batch-size", type=int, default=16)
    args = parser.parse_args()

    model_path = Path(args.model).resolve()
    test_dir = Path(args.test).resolve()

    if not model_path.exists():
        print(f"[evaluate] Model not found at {model_path}")
        sys.exit(1)

    if not test_dir.exists():
        print(f"[evaluate] Test directory not found at {test_dir}")
        sys.exit(1)

    has_cuda = torch.cuda.is_available()
    has_mps = hasattr(torch.backends, "mps") and torch.backends.mps.is_available()
    device = "cuda" if has_cuda else ("mps" if has_mps else "cpu")
    print(f"[evaluate] Device: {device}")
    print(f"[evaluate] Model: {model_path}")
    print(f"[evaluate] Test dir: {test_dir}")

    unified_labels = get_model_labels(model_path)
    label2id = {label: i for i, label in enumerate(unified_labels)}
    print(f"[evaluate] Labels ({len(unified_labels)}): {', '.join(unified_labels)}")

    processor = AutoImageProcessor.from_pretrained(str(model_path))
    model = AutoModelForImageClassification.from_pretrained(str(model_path))
    model.to(device)
    model.eval()

    samples = load_test_images(test_dir, label2id)
    print(f"[evaluate] Test samples: {len(samples)}")

    if not samples:
        print("[evaluate] No test images found.")
        sys.exit(1)

    y_true = []
    y_pred = []
    batch_size = args.batch_size

    for i in range(0, len(samples), batch_size):
        batch = samples[i : i + batch_size]
        images = []
        labels = []
        for path, label_id in batch:
            try:
                img = Image.open(path).convert("RGB")
                images.append(img)
                labels.append(label_id)
            except Exception:
                continue

        if images:
            preds = predict_batch(model, processor, images, device)
            y_true.extend(labels)
            y_pred.extend(preds.tolist())

        if (i // batch_size) % 10 == 0:
            print(f"[evaluate] Processed {min(i + batch_size, len(samples))}/{len(samples)}")

    accuracy = sum(1 for t, p in zip(y_true, y_pred) if t == p) / len(y_true) if y_true else 0
    print(f"\n[evaluate] Overall accuracy: {accuracy:.4f} ({sum(1 for t, p in zip(y_true, y_pred) if t == p)}/{len(y_true)})")

    report = compute_classification_report(y_true, y_pred, unified_labels)
    print_report(report, unified_labels)

    cm = compute_confusion_matrix(y_true, y_pred, len(unified_labels))

    results_dir = SCRIPT_DIR / "results"
    results_dir.mkdir(exist_ok=True)

    with open(results_dir / "evaluation.json", "w") as f:
        json.dump({
            "accuracy": round(accuracy, 4),
            "total_samples": len(y_true),
            "per_class": report,
        }, f, indent=2)

    save_confusion_matrix_plot(cm, unified_labels, results_dir / "confusion_matrix.png")

    print(f"\n[evaluate] Results saved to {results_dir}")


if __name__ == "__main__":
    main()
