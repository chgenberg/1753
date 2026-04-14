#!/usr/bin/env python3
"""
train_skin_classifier.py

Trains a skin condition classifier with optional multi-task severity head.
Uses PyTorch + EfficientNet-B3 and exports to ONNX.

Dataset structure (ImageFolder format):
  data/training-dataset/
    acne/          *.jpg
    dermatitis/    *.jpg
    ...
    normal/        *.jpg

Severity annotations (optional):
  data/training-dataset/_severity_annotations.json

Usage:
  python scripts/train_skin_classifier.py
  python scripts/train_skin_classifier.py --epochs 30 --batch-size 32
  python scripts/train_skin_classifier.py --model b0  (lighter model)
  python scripts/train_skin_classifier.py --model b3  (default, better accuracy)
  python scripts/train_skin_classifier.py --resume checkpoints/best_model.pth
"""

import argparse
import json
import os
import sys
import ssl
ssl._create_default_https_context = ssl._create_unverified_context

import torch
import torch.nn as nn
import torch.optim as optim
from torch.utils.data import DataLoader, Dataset, random_split
from torchvision import datasets, transforms, models
from PIL import Image

SCRIPT_DIR = os.path.dirname(os.path.abspath(__file__))
PROJECT_ROOT = os.path.dirname(SCRIPT_DIR)
DATASET_DIR = os.path.join(PROJECT_ROOT, "data", "training-dataset")
OUTPUT_DIR = os.path.join(PROJECT_ROOT, "checkpoints")
ONNX_OUTPUT = os.path.join(PROJECT_ROOT, "frontend", "public", "models", "skin_classifier_q8.onnx")
META_OUTPUT = os.path.join(PROJECT_ROOT, "frontend", "public", "models", "model_meta.json")
SEVERITY_FILE = os.path.join(DATASET_DIR, "_severity_annotations.json")

IMAGE_SIZE = 224
IMAGENET_MEAN = [0.485, 0.456, 0.406]
IMAGENET_STD = [0.229, 0.224, 0.225]

SEVERITY_CLASSES = ["none", "mild", "moderate", "severe"]


def get_transforms(training=True):
    if training:
        return transforms.Compose([
            transforms.RandomResizedCrop(IMAGE_SIZE, scale=(0.7, 1.0)),
            transforms.RandomHorizontalFlip(),
            transforms.RandomRotation(20),
            transforms.ColorJitter(brightness=0.25, contrast=0.25, saturation=0.15, hue=0.05),
            transforms.RandomGrayscale(p=0.05),
            transforms.ToTensor(),
            transforms.Normalize(IMAGENET_MEAN, IMAGENET_STD),
            transforms.RandomErasing(p=0.15, scale=(0.02, 0.15)),
        ])
    return transforms.Compose([
        transforms.Resize(IMAGE_SIZE + 32),
        transforms.CenterCrop(IMAGE_SIZE),
        transforms.ToTensor(),
        transforms.Normalize(IMAGENET_MEAN, IMAGENET_STD),
    ])


class SkinDatasetMultiTask(Dataset):
    """ImageFolder-like dataset that also returns severity labels when available."""

    def __init__(self, root, transform=None, severity_map=None):
        self.dataset = datasets.ImageFolder(root, transform=transform)
        self.classes = self.dataset.classes
        self.severity_map = severity_map or {}

    def __len__(self):
        return len(self.dataset)

    def __getitem__(self, idx):
        img, condition_label = self.dataset[idx]
        path, _ = self.dataset.samples[idx]

        class_name = self.classes[condition_label]
        filename = os.path.basename(path)
        key = f"{class_name}/{filename}"

        severity_label = -1
        if key in self.severity_map:
            sev = self.severity_map[key].get("severity", "moderate")
            if sev in SEVERITY_CLASSES:
                severity_label = SEVERITY_CLASSES.index(sev)

        return img, condition_label, severity_label


class SkinClassifierMultiTask(nn.Module):
    """MobileNetV3 with dual heads: condition classification + severity."""

    def __init__(self, num_conditions, num_severities=4, backbone="mobilenet_v3"):
        super().__init__()
        if backbone == "b3":
            base = models.efficientnet_b3(weights=models.EfficientNet_B3_Weights.DEFAULT)
            feat_dim = base.classifier[1].in_features
            self.features = base.features
            self.avgpool = base.avgpool
        else:
            base = models.mobilenet_v3_large(weights=models.MobileNet_V3_Large_Weights.DEFAULT)
            feat_dim = base.classifier[0].in_features
            self.features = base.features
            self.avgpool = base.avgpool

        self.dropout = nn.Dropout(p=0.3)
        self.condition_head = nn.Linear(feat_dim, num_conditions)
        self.severity_head = nn.Linear(feat_dim, num_severities)

    def forward(self, x):
        x = self.features(x)
        x = self.avgpool(x)
        x = torch.flatten(x, 1)
        x = self.dropout(x)

        condition_logits = self.condition_head(x)
        severity_logits = self.severity_head(x)

        return condition_logits, severity_logits


def train_epoch(model, loader, cond_criterion, sev_criterion, optimizer, device):
    model.train()
    total_loss, correct, total = 0, 0, 0
    num_batches = len(loader)
    for batch_idx, (images, cond_labels, sev_labels) in enumerate(loader):
        images = images.to(device)
        cond_labels = cond_labels.to(device)
        sev_labels = sev_labels.to(device)

        optimizer.zero_grad()
        cond_logits, sev_logits = model(images)

        loss_cond = cond_criterion(cond_logits, cond_labels)

        has_sev = sev_labels >= 0
        if has_sev.any():
            loss_sev = sev_criterion(sev_logits[has_sev], sev_labels[has_sev])
            loss = loss_cond + 0.3 * loss_sev
        else:
            loss = loss_cond

        loss.backward()
        optimizer.step()

        total_loss += loss.item() * images.size(0)
        correct += (cond_logits.argmax(1) == cond_labels).sum().item()
        total += images.size(0)
        if (batch_idx + 1) % 200 == 0:
            print(f"    batch {batch_idx+1}/{num_batches} | loss: {total_loss/total:.4f} | acc: {correct/total:.3f}", flush=True)
    return total_loss / total, correct / total


def validate(model, loader, cond_criterion, device):
    model.eval()
    total_loss, correct, total = 0, 0, 0
    with torch.no_grad():
        for images, cond_labels, _ in loader:
            images = images.to(device)
            cond_labels = cond_labels.to(device)
            cond_logits, _ = model(images)
            loss = cond_criterion(cond_logits, cond_labels)
            total_loss += loss.item() * images.size(0)
            correct += (cond_logits.argmax(1) == cond_labels).sum().item()
            total += images.size(0)
    return total_loss / total, correct / total


def export_onnx(model, labels, device, backbone):
    model.eval()
    dummy = torch.randn(1, 3, IMAGE_SIZE, IMAGE_SIZE).to(device)
    os.makedirs(os.path.dirname(ONNX_OUTPUT), exist_ok=True)

    class ExportWrapper(nn.Module):
        """Wraps multi-task model to output concatenated logits for ONNX."""
        def __init__(self, m):
            super().__init__()
            self.m = m
        def forward(self, x):
            cond, sev = self.m(x)
            return torch.cat([cond, sev], dim=1)

    wrapper = ExportWrapper(model)
    wrapper.eval()

    torch.onnx.export(
        wrapper, dummy, ONNX_OUTPUT,
        input_names=["pixel_values"],
        output_names=["logits"],
        dynamic_axes={"pixel_values": {0: "batch"}, "logits": {0: "batch"}},
        opset_version=17,
    )
    print(f"  ONNX model saved: {ONNX_OUTPUT}")

    meta = {
        "image_size": IMAGE_SIZE,
        "labels": labels,
        "severity_labels": SEVERITY_CLASSES,
        "num_condition_classes": len(labels),
        "num_severity_classes": len(SEVERITY_CLASSES),
        "mean": IMAGENET_MEAN,
        "std": IMAGENET_STD,
        "source_model": f"{backbone}_multitask",
    }
    with open(META_OUTPUT, "w") as f:
        json.dump(meta, f, indent=2)
    print(f"  Model meta saved: {META_OUTPUT}")


def main():
    parser = argparse.ArgumentParser(description="Train skin classifier")
    parser.add_argument("--epochs", type=int, default=15)
    parser.add_argument("--batch-size", type=int, default=128)
    parser.add_argument("--lr", type=float, default=1e-4)
    parser.add_argument("--model", type=str, default="mobilenet_v3", choices=["b0", "b3", "b4", "mobilenet_v3"])
    parser.add_argument("--resume", type=str, default=None)
    parser.add_argument("--export-only", action="store_true")
    args = parser.parse_args()

    if not os.path.isdir(DATASET_DIR):
        print(f"Error: Dataset directory not found: {DATASET_DIR}")
        sys.exit(1)

    device = torch.device("mps" if torch.backends.mps.is_available() else "cuda" if torch.cuda.is_available() else "cpu")
    print(f"Device: {device}")
    model_name = "MobileNetV3-Large" if args.model == "mobilenet_v3" else f"EfficientNet-{args.model.upper()}"
    print(f"Model: {model_name}")

    severity_map = {}
    if os.path.exists(SEVERITY_FILE):
        severity_map = json.loads(open(SEVERITY_FILE).read())
        print(f"Loaded {len(severity_map)} severity annotations")

    full_dataset = SkinDatasetMultiTask(
        DATASET_DIR,
        transform=get_transforms(training=True),
        severity_map=severity_map,
    )
    labels = full_dataset.classes
    num_classes = len(labels)
    print(f"Classes ({num_classes}): {labels}")

    class_counts = {}
    for _, label_idx in full_dataset.dataset.samples:
        name = labels[label_idx]
        class_counts[name] = class_counts.get(name, 0) + 1
    print("Class distribution:")
    for name in sorted(class_counts):
        print(f"  {name}: {class_counts[name]}")

    if "normal" not in labels:
        print("\nWARNING: 'normal' class not found in dataset!")

    model = SkinClassifierMultiTask(
        num_conditions=num_classes,
        num_severities=len(SEVERITY_CLASSES),
        backbone=args.model,
    ).to(device)

    total_params = sum(p.numel() for p in model.parameters())
    trainable = sum(p.numel() for p in model.parameters() if p.requires_grad)
    print(f"Parameters: {total_params:,} total, {trainable:,} trainable")

    if args.resume:
        model.load_state_dict(torch.load(args.resume, map_location=device))
        print(f"Resumed from: {args.resume}")

    if args.export_only:
        export_onnx(model, labels, device, args.model)
        return

    val_size = max(1, int(len(full_dataset) * 0.15))
    train_size = len(full_dataset) - val_size
    train_dataset, val_dataset = random_split(full_dataset, [train_size, val_size])

    val_dataset.dataset.dataset.transform = get_transforms(training=False)

    nw = 0 if sys.platform == "darwin" else 4
    train_loader = DataLoader(train_dataset, batch_size=args.batch_size, shuffle=True, num_workers=nw, pin_memory=False)
    val_loader = DataLoader(val_dataset, batch_size=args.batch_size, shuffle=False, num_workers=nw, pin_memory=False)

    class_weights = []
    total_samples = sum(class_counts.values())
    for name in labels:
        count = class_counts.get(name, 1)
        class_weights.append(total_samples / (num_classes * count))
    weights_tensor = torch.FloatTensor(class_weights).to(device)

    cond_criterion = nn.CrossEntropyLoss(weight=weights_tensor)
    sev_criterion = nn.CrossEntropyLoss()
    optimizer = optim.AdamW(model.parameters(), lr=args.lr, weight_decay=1e-4)
    scheduler = optim.lr_scheduler.CosineAnnealingWarmRestarts(optimizer, T_0=5, T_mult=2)

    os.makedirs(OUTPUT_DIR, exist_ok=True)
    best_val_acc = 0

    print(f"\nTraining for {args.epochs} epochs...")
    for epoch in range(1, args.epochs + 1):
        train_loss, train_acc = train_epoch(model, train_loader, cond_criterion, sev_criterion, optimizer, device)
        val_loss, val_acc = validate(model, val_loader, cond_criterion, device)
        scheduler.step()

        print(f"  Epoch {epoch:3d}/{args.epochs} | "
              f"Train loss: {train_loss:.4f} acc: {train_acc:.3f} | "
              f"Val loss: {val_loss:.4f} acc: {val_acc:.3f}")

        if val_acc > best_val_acc:
            best_val_acc = val_acc
            torch.save(model.state_dict(), os.path.join(OUTPUT_DIR, "best_model.pth"))
            print(f"         -> New best val accuracy: {val_acc:.3f}")

    print(f"\nBest validation accuracy: {best_val_acc:.3f}")
    model.load_state_dict(torch.load(os.path.join(OUTPUT_DIR, "best_model.pth"), map_location=device))
    export_onnx(model, labels, device, args.model)
    print("\nDone! New ONNX model exported.")
    print("Restart the frontend to use the updated model.")


if __name__ == "__main__":
    main()
