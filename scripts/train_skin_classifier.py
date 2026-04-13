#!/usr/bin/env python3
"""
train_skin_classifier.py

Retrains the skin condition classifier with a 'normal' class.
Uses PyTorch + EfficientNet-B0 and exports to ONNX.

Prerequisites:
  pip install torch torchvision onnx onnxruntime pillow

Dataset structure (ImageFolder format):
  data/training-dataset/
    acne/          *.jpg
    dermatitis/    *.jpg
    dryness/       *.jpg
    eczema/        *.jpg
    hyperpigmentation/ *.jpg
    normal/        *.jpg
    psoriasis/     *.jpg
    rosacea/       *.jpg
    sun_damage/    *.jpg

Usage:
  python scripts/train_skin_classifier.py
  python scripts/train_skin_classifier.py --epochs 30 --batch-size 32
  python scripts/train_skin_classifier.py --resume checkpoints/best_model.pth
"""

import argparse
import json
import os
import sys

import torch
import torch.nn as nn
import torch.optim as optim
from torch.utils.data import DataLoader, random_split
from torchvision import datasets, transforms, models

SCRIPT_DIR = os.path.dirname(os.path.abspath(__file__))
PROJECT_ROOT = os.path.dirname(SCRIPT_DIR)
DATASET_DIR = os.path.join(PROJECT_ROOT, "data", "training-dataset")
OUTPUT_DIR = os.path.join(PROJECT_ROOT, "checkpoints")
ONNX_OUTPUT = os.path.join(PROJECT_ROOT, "frontend", "public", "models", "skin_classifier_q8.onnx")
META_OUTPUT = os.path.join(PROJECT_ROOT, "frontend", "public", "models", "model_meta.json")

IMAGE_SIZE = 224
IMAGENET_MEAN = [0.485, 0.456, 0.406]
IMAGENET_STD = [0.229, 0.224, 0.225]


def get_transforms(training=True):
    if training:
        return transforms.Compose([
            transforms.RandomResizedCrop(IMAGE_SIZE, scale=(0.8, 1.0)),
            transforms.RandomHorizontalFlip(),
            transforms.RandomRotation(15),
            transforms.ColorJitter(brightness=0.2, contrast=0.2, saturation=0.1),
            transforms.ToTensor(),
            transforms.Normalize(IMAGENET_MEAN, IMAGENET_STD),
        ])
    return transforms.Compose([
        transforms.Resize(IMAGE_SIZE + 32),
        transforms.CenterCrop(IMAGE_SIZE),
        transforms.ToTensor(),
        transforms.Normalize(IMAGENET_MEAN, IMAGENET_STD),
    ])


def build_model(num_classes):
    model = models.efficientnet_b0(weights=models.EfficientNet_B0_Weights.DEFAULT)
    model.classifier[1] = nn.Linear(model.classifier[1].in_features, num_classes)
    return model


def train_epoch(model, loader, criterion, optimizer, device):
    model.train()
    total_loss, correct, total = 0, 0, 0
    for images, labels in loader:
        images, labels = images.to(device), labels.to(device)
        optimizer.zero_grad()
        outputs = model(images)
        loss = criterion(outputs, labels)
        loss.backward()
        optimizer.step()
        total_loss += loss.item() * images.size(0)
        correct += (outputs.argmax(1) == labels).sum().item()
        total += images.size(0)
    return total_loss / total, correct / total


def validate(model, loader, criterion, device):
    model.eval()
    total_loss, correct, total = 0, 0, 0
    with torch.no_grad():
        for images, labels in loader:
            images, labels = images.to(device), labels.to(device)
            outputs = model(images)
            loss = criterion(outputs, labels)
            total_loss += loss.item() * images.size(0)
            correct += (outputs.argmax(1) == labels).sum().item()
            total += images.size(0)
    return total_loss / total, correct / total


def export_onnx(model, labels, device):
    model.eval()
    dummy = torch.randn(1, 3, IMAGE_SIZE, IMAGE_SIZE).to(device)
    os.makedirs(os.path.dirname(ONNX_OUTPUT), exist_ok=True)

    torch.onnx.export(
        model, dummy, ONNX_OUTPUT,
        input_names=["pixel_values"],
        output_names=["logits"],
        dynamic_axes={"pixel_values": {0: "batch"}, "logits": {0: "batch"}},
        opset_version=17,
    )
    print(f"  ONNX model saved: {ONNX_OUTPUT}")

    meta = {
        "image_size": IMAGE_SIZE,
        "labels": labels,
        "mean": IMAGENET_MEAN,
        "std": IMAGENET_STD,
        "source_model": "efficientnet_b0_retrained",
    }
    with open(META_OUTPUT, "w") as f:
        json.dump(meta, f, indent=2)
    print(f"  Model meta saved: {META_OUTPUT}")


def main():
    parser = argparse.ArgumentParser(description="Train skin classifier")
    parser.add_argument("--epochs", type=int, default=20)
    parser.add_argument("--batch-size", type=int, default=32)
    parser.add_argument("--lr", type=float, default=1e-4)
    parser.add_argument("--resume", type=str, default=None)
    parser.add_argument("--export-only", action="store_true")
    args = parser.parse_args()

    if not os.path.isdir(DATASET_DIR):
        print(f"Error: Dataset directory not found: {DATASET_DIR}")
        print("Run 'node scripts/prepare-training-dataset.js' first.")
        sys.exit(1)

    device = torch.device("mps" if torch.backends.mps.is_available() else "cuda" if torch.cuda.is_available() else "cpu")
    print(f"Device: {device}")

    full_dataset = datasets.ImageFolder(DATASET_DIR, transform=get_transforms(training=True))
    labels = full_dataset.classes
    num_classes = len(labels)
    print(f"Classes ({num_classes}): {labels}")

    class_counts = {}
    for _, label_idx in full_dataset.samples:
        name = labels[label_idx]
        class_counts[name] = class_counts.get(name, 0) + 1
    print("Class distribution:")
    for name in sorted(class_counts):
        print(f"  {name}: {class_counts[name]}")

    if "normal" not in labels:
        print("\nWARNING: 'normal' class not found in dataset!")
        print(f"Add normal skin images to: {os.path.join(DATASET_DIR, 'normal')}/")

    model = build_model(num_classes).to(device)

    if args.resume:
        model.load_state_dict(torch.load(args.resume, map_location=device))
        print(f"Resumed from: {args.resume}")

    if args.export_only:
        export_onnx(model, labels, device)
        return

    val_size = max(1, int(len(full_dataset) * 0.2))
    train_size = len(full_dataset) - val_size
    train_dataset, val_dataset = random_split(full_dataset, [train_size, val_size])

    val_dataset.dataset.transform = get_transforms(training=False)

    train_loader = DataLoader(train_dataset, batch_size=args.batch_size, shuffle=True, num_workers=2, pin_memory=True)
    val_loader = DataLoader(val_dataset, batch_size=args.batch_size, shuffle=False, num_workers=2, pin_memory=True)

    criterion = nn.CrossEntropyLoss()
    optimizer = optim.AdamW(model.parameters(), lr=args.lr, weight_decay=1e-4)
    scheduler = optim.lr_scheduler.CosineAnnealingLR(optimizer, T_max=args.epochs)

    os.makedirs(OUTPUT_DIR, exist_ok=True)
    best_val_acc = 0

    print(f"\nTraining for {args.epochs} epochs...")
    for epoch in range(1, args.epochs + 1):
        train_loss, train_acc = train_epoch(model, train_loader, criterion, optimizer, device)
        val_loss, val_acc = validate(model, val_loader, criterion, device)
        scheduler.step()

        print(f"  Epoch {epoch:3d}/{args.epochs} | Train loss: {train_loss:.4f} acc: {train_acc:.3f} | Val loss: {val_loss:.4f} acc: {val_acc:.3f}")

        if val_acc > best_val_acc:
            best_val_acc = val_acc
            torch.save(model.state_dict(), os.path.join(OUTPUT_DIR, "best_model.pth"))
            print(f"         -> New best val accuracy: {val_acc:.3f}")

    print(f"\nBest validation accuracy: {best_val_acc:.3f}")
    model.load_state_dict(torch.load(os.path.join(OUTPUT_DIR, "best_model.pth"), map_location=device))
    export_onnx(model, labels, device)
    print("\nDone! New ONNX model exported.")
    print("Restart the frontend to use the updated model.")


if __name__ == "__main__":
    main()
