#!/usr/bin/env python3
"""
augment-dataset.py

Offline data augmentation for the skin condition training dataset.
Creates augmented copies alongside originals to ~8x the dataset size.

Augmentations per image:
  1. Horizontal flip
  2. Brightness increase (+20%)
  3. Brightness decrease (-20%)
  4. Contrast increase (+30%)
  5. Slight rotation (+12 deg)
  6. Slight rotation (-12 deg)
  7. Combined: flip + brightness + rotation

Usage:
  python scripts/augment-dataset.py
  python scripts/augment-dataset.py --class acne
  python scripts/augment-dataset.py --dry-run
"""

import argparse
import os
import sys
from pathlib import Path
from concurrent.futures import ProcessPoolExecutor, as_completed

from PIL import Image, ImageEnhance, ImageFilter

DATASET_DIR = Path(__file__).resolve().parent.parent / "data" / "training-dataset"
AUG_PREFIX = "aug_"

CLASSES = [
    "acne", "dermatitis", "dryness", "eczema",
    "hyperpigmentation", "normal", "psoriasis",
    "rosacea", "sun_damage",
]

def is_original(filename: str) -> bool:
    return not filename.startswith(AUG_PREFIX)

def augment_image(img_path: Path, dry_run: bool = False) -> int:
    """Create augmented versions of a single image. Returns count created."""
    try:
        img = Image.open(img_path).convert("RGB")
    except Exception:
        return 0

    stem = img_path.stem
    suffix = img_path.suffix
    parent = img_path.parent
    created = 0

    augmentations = {
        "flip": lambda i: i.transpose(Image.FLIP_LEFT_RIGHT),
        "bright_up": lambda i: ImageEnhance.Brightness(i).enhance(1.2),
        "bright_dn": lambda i: ImageEnhance.Brightness(i).enhance(0.8),
        "contrast": lambda i: ImageEnhance.Contrast(i).enhance(1.3),
        "rot_pos": lambda i: i.rotate(12, resample=Image.BICUBIC, expand=False, fillcolor=(0, 0, 0)),
        "rot_neg": lambda i: i.rotate(-12, resample=Image.BICUBIC, expand=False, fillcolor=(0, 0, 0)),
        "combo": lambda i: ImageEnhance.Brightness(
            i.transpose(Image.FLIP_LEFT_RIGHT).rotate(8, resample=Image.BICUBIC, expand=False, fillcolor=(0, 0, 0))
        ).enhance(1.15),
    }

    for aug_name, aug_fn in augmentations.items():
        out_path = parent / f"{AUG_PREFIX}{aug_name}_{stem}{suffix}"
        if out_path.exists():
            continue
        if dry_run:
            created += 1
            continue
        try:
            aug_img = aug_fn(img)
            aug_img.save(out_path, quality=90)
            created += 1
        except Exception:
            pass

    return created


def augment_class(class_name: str, dry_run: bool = False) -> dict:
    class_dir = DATASET_DIR / class_name
    if not class_dir.exists():
        return {"class": class_name, "originals": 0, "created": 0, "skipped": 0}

    originals = [
        f for f in class_dir.iterdir()
        if f.is_file()
        and f.suffix.lower() in (".jpg", ".jpeg", ".png")
        and is_original(f.name)
        and not f.name.startswith("_")
        and not f.name.startswith(".")
    ]

    total_created = 0
    for i, img_path in enumerate(originals):
        created = augment_image(img_path, dry_run)
        total_created += created
        if (i + 1) % 100 == 0:
            print(f"    [{class_name}] {i+1}/{len(originals)} processed, {total_created} augmented images created")

    existing_aug = len([
        f for f in class_dir.iterdir()
        if f.is_file() and f.name.startswith(AUG_PREFIX)
    ])

    return {
        "class": class_name,
        "originals": len(originals),
        "created": total_created,
        "existing_aug": existing_aug if not dry_run else 0,
    }


def main():
    parser = argparse.ArgumentParser(description="Augment training dataset")
    parser.add_argument("--class", dest="class_name", type=str, default=None,
                        help="Only augment a specific class")
    parser.add_argument("--dry-run", action="store_true",
                        help="Count what would be created without writing")
    args = parser.parse_args()

    print("=" * 60)
    print("  DATA AUGMENTATION PIPELINE")
    print(f"  Dataset: {DATASET_DIR}")
    print(f"  Dry run: {args.dry_run}")
    print("=" * 60)

    classes = [args.class_name] if args.class_name else CLASSES
    total_originals = 0
    total_created = 0

    for cls in classes:
        print(f"\n  [{cls}] Augmenting...")
        result = augment_class(cls, args.dry_run)
        total_originals += result["originals"]
        total_created += result["created"]
        total_in_dir = result["originals"] + result.get("existing_aug", 0) + result["created"]
        print(f"    => {result['originals']} originals, {result['created']} new augmented, ~{total_in_dir} total")

    print("\n" + "=" * 60)
    print(f"  TOTAL: {total_originals} originals, {total_created} augmented images created")
    print(f"  Expected total dataset size: ~{total_originals + total_created + total_originals * 7} images")
    print("=" * 60)


if __name__ == "__main__":
    main()
