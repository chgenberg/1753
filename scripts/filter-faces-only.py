"""
Filter training dataset: keep ONLY images containing a clearly visible face.
Uses OpenCV's Haar Cascade face detector (bundled with OpenCV, no download needed).
Non-face images are moved to a _rejected/ subfolder for review.
"""

import os
import sys
import shutil
from pathlib import Path
from concurrent.futures import ThreadPoolExecutor, as_completed

import cv2
import numpy as np

DATASET_DIR = Path(__file__).resolve().parent.parent / "data" / "training-dataset"

MIN_FACE_RATIO = 0.06  # face bounding box >= 6% of image area
MIN_FACE_SIZE = (60, 60)  # minimum face pixel size


def load_detector():
    """Load Haar cascade face detector (bundled with OpenCV)."""
    cascade_path = cv2.data.haarcascades + "haarcascade_frontalface_default.xml"
    detector = cv2.CascadeClassifier(cascade_path)
    if detector.empty():
        raise RuntimeError(f"Could not load cascade from {cascade_path}")
    return detector


def has_face(img_path: str, detector: cv2.CascadeClassifier) -> bool:
    """Return True if image contains at least one clearly visible face."""
    try:
        img = cv2.imread(img_path)
        if img is None:
            return False

        h, w = img.shape[:2]
        img_area = h * w

        gray = cv2.cvtColor(img, cv2.COLOR_BGR2GRAY)
        gray = cv2.equalizeHist(gray)

        faces = detector.detectMultiScale(
            gray,
            scaleFactor=1.1,
            minNeighbors=4,
            minSize=MIN_FACE_SIZE,
            flags=cv2.CASCADE_SCALE_IMAGE,
        )

        if len(faces) == 0:
            return False

        for (x, y, fw, fh) in faces:
            face_area = fw * fh
            face_ratio = face_area / img_area if img_area > 0 else 0
            if face_ratio >= MIN_FACE_RATIO:
                return True

        return False

    except Exception:
        return False


def filter_class(class_dir: Path, detector: cv2.CascadeClassifier) -> dict:
    """Filter a single class directory. Returns stats."""
    rejected_dir = class_dir / "_rejected"
    rejected_dir.mkdir(exist_ok=True)

    files = [f for f in class_dir.iterdir()
             if f.is_file() and f.suffix.lower() in (".jpg", ".jpeg", ".png", ".webp")]

    kept = 0
    removed = 0

    for i, f in enumerate(files):
        if has_face(str(f), detector):
            kept += 1
        else:
            shutil.move(str(f), str(rejected_dir / f.name))
            removed += 1

        if (i + 1) % 200 == 0:
            print(f"    ... {i + 1}/{len(files)} processed ({kept} kept, {removed} removed)")

    return {"kept": kept, "removed": removed, "total": len(files)}


def main():
    print("=" * 60)
    print("  FACE FILTER — Removing non-face images")
    print("=" * 60)

    detector = load_detector()
    print("  Haar cascade face detector loaded.\n")

    classes = sorted([d for d in DATASET_DIR.iterdir()
                      if d.is_dir() and not d.name.startswith("_")])

    total_kept = 0
    total_removed = 0

    for cls_dir in classes:
        cls_name = cls_dir.name
        file_count = len([f for f in cls_dir.iterdir()
                          if f.is_file() and f.suffix.lower() in (".jpg", ".jpeg", ".png", ".webp")])
        print(f"  [{cls_name}] Scanning {file_count} images...", flush=True)
        stats = filter_class(cls_dir, detector)
        total_kept += stats["kept"]
        total_removed += stats["removed"]
        pct = (stats["removed"] / stats["total"] * 100) if stats["total"] > 0 else 0
        print(f"    => kept {stats['kept']}, removed {stats['removed']} ({pct:.0f}% rejected)\n")

    print(f"{'=' * 60}")
    print(f"  TOTAL: kept {total_kept}, removed {total_removed}")
    print(f"  Rejected images moved to _rejected/ subfolders")
    print(f"{'=' * 60}")

    print(f"\n  Post-filter counts:")
    for cls_dir in classes:
        count = len([f for f in cls_dir.iterdir()
                     if f.is_file() and f.suffix.lower() in (".jpg", ".jpeg", ".png", ".webp")])
        print(f"    {cls_dir.name}: {count}")


if __name__ == "__main__":
    main()
