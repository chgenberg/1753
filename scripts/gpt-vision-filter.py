"""
GPT Vision filter for training dataset.
Uses GPT-4o-mini to evaluate each image and reject:
  - Non-face images (body, hands, feet, scalp-only)
  - Illustrations, drawings, diagrams
  - Collages or multi-image composites
  - Extremely low quality / blurry images
  - Irrelevant stock photos (products, logos, text-only)

Keeps:
  - Clear face photos showing the skin condition
  - Images with watermarks/text overlays (still useful for training)
  - Close-up face crops

Usage:
  python scripts/gpt-vision-filter.py [--class acne] [--dry-run]
"""

import os
import sys
import json
import time
import shutil
import base64
import argparse
from pathlib import Path
from concurrent.futures import ThreadPoolExecutor, as_completed

import requests

DATASET_DIR = Path(__file__).resolve().parent.parent / "data" / "training-dataset"
PROGRESS_FILE = DATASET_DIR / "_gpt_filter_progress.json"

OPENAI_API_KEY = os.environ.get("OPENAI_API_KEY", "")
if not OPENAI_API_KEY:
    from dotenv import load_dotenv
    load_dotenv(Path(__file__).resolve().parent.parent / ".env")
    OPENAI_API_KEY = os.environ.get("OPENAI_API_KEY", "")

API_URL = "https://api.openai.com/v1/chat/completions"
MODEL = "gpt-4o-mini"
MAX_RETRIES = 3
RATE_LIMIT_SLEEP = 2
BATCH_SIZE = 10


SYSTEM_PROMPT = """You are a medical image quality filter for a skin condition training dataset.
Your job is to decide if an image is VALID for training a facial skin condition classifier.

VALID images:
- Show a human face (full or partial) with visible skin
- The face can be any angle, any ethnicity, any age
- Watermarks and text overlays are OK
- Close-up crops of facial skin are OK
- Clinical photos of faces are OK
- Selfies showing skin conditions are OK

INVALID images:
- Show body parts that are NOT the face (hands, feet, legs, arms, back, torso, scalp without face)
- Are illustrations, drawings, diagrams, or cartoons
- Are collages or grids of multiple images
- Show only products, logos, or text without a face
- Are completely blurry/unrecognizable
- Show microscopy, histology, or lab images

Respond with ONLY a JSON object: {"valid": true} or {"valid": false, "reason": "brief reason"}"""


def encode_image_b64(path: str, max_size: int = 512) -> str:
    """Read and base64-encode an image, resizing if needed for cost efficiency."""
    from PIL import Image
    import io

    img = Image.open(path)
    img.thumbnail((max_size, max_size), Image.LANCZOS)

    if img.mode == "RGBA":
        img = img.convert("RGB")

    buf = io.BytesIO()
    img.save(buf, format="JPEG", quality=80)
    return base64.b64encode(buf.getvalue()).decode("utf-8")


def evaluate_image(img_path: str) -> dict:
    """Ask GPT Vision if the image is valid for training."""
    for attempt in range(MAX_RETRIES):
        try:
            b64 = encode_image_b64(img_path)

            resp = requests.post(
                API_URL,
                headers={
                    "Authorization": f"Bearer {OPENAI_API_KEY}",
                    "Content-Type": "application/json",
                },
                json={
                    "model": MODEL,
                    "messages": [
                        {"role": "system", "content": SYSTEM_PROMPT},
                        {
                            "role": "user",
                            "content": [
                                {
                                    "type": "image_url",
                                    "image_url": {
                                        "url": f"data:image/jpeg;base64,{b64}",
                                        "detail": "low",
                                    },
                                },
                                {
                                    "type": "text",
                                    "text": "Is this image valid for training a facial skin condition classifier?",
                                },
                            ],
                        },
                    ],
                    "max_tokens": 60,
                    "temperature": 0,
                },
                timeout=30,
            )

            if resp.status_code == 429:
                wait = RATE_LIMIT_SLEEP * (attempt + 1)
                time.sleep(wait)
                continue

            if resp.status_code != 200:
                return {"valid": True, "error": f"API {resp.status_code}"}

            content = resp.json()["choices"][0]["message"]["content"].strip()

            if content.startswith("```"):
                content = content.split("```")[1]
                if content.startswith("json"):
                    content = content[4:]

            result = json.loads(content)
            return result

        except json.JSONDecodeError:
            if "true" in content.lower():
                return {"valid": True}
            elif "false" in content.lower():
                return {"valid": False, "reason": "parse error but likely invalid"}
            return {"valid": True, "error": "parse_error"}
        except Exception as e:
            if attempt < MAX_RETRIES - 1:
                time.sleep(RATE_LIMIT_SLEEP)
                continue
            return {"valid": True, "error": str(e)}

    return {"valid": True, "error": "max_retries"}


def load_progress() -> dict:
    if PROGRESS_FILE.exists():
        return json.loads(PROGRESS_FILE.read_text())
    return {}


def save_progress(progress: dict):
    PROGRESS_FILE.write_text(json.dumps(progress, indent=2))


def filter_class(class_name: str, dry_run: bool = False) -> dict:
    class_dir = DATASET_DIR / class_name
    if not class_dir.exists():
        print(f"  [!] Class directory not found: {class_dir}")
        return {"kept": 0, "removed": 0, "errors": 0}

    rejected_dir = class_dir / "_rejected_gpt"
    if not dry_run:
        rejected_dir.mkdir(exist_ok=True)

    progress = load_progress()
    processed_key = f"{class_name}_processed"
    already_processed = set(progress.get(processed_key, []))

    files = sorted([
        f for f in class_dir.iterdir()
        if f.is_file() and f.suffix.lower() in (".jpg", ".jpeg", ".png", ".webp")
        and not f.name.startswith("aug_")
        and f.name not in already_processed
    ])

    total = len(files)
    if total == 0:
        print(f"  [{class_name}] All images already processed or none found.")
        return {"kept": 0, "removed": 0, "errors": 0}

    print(f"  [{class_name}] Filtering {total} images ({len(already_processed)} already done)...")

    kept = 0
    removed = 0
    errors = 0
    batch_processed = []

    for i, f in enumerate(files):
        result = evaluate_image(str(f))

        if result.get("valid", True):
            kept += 1
        else:
            removed += 1
            reason = result.get("reason", "unknown")
            if not dry_run:
                shutil.move(str(f), str(rejected_dir / f.name))

        if result.get("error"):
            errors += 1

        batch_processed.append(f.name)

        if (i + 1) % BATCH_SIZE == 0:
            progress[processed_key] = list(already_processed | set(batch_processed))
            save_progress(progress)

            elapsed_pct = (i + 1) / total * 100
            print(f"    [{class_name}] {i+1}/{total} ({elapsed_pct:.0f}%) — kept: {kept}, removed: {removed}", flush=True)

        time.sleep(0.1)

    progress[processed_key] = list(already_processed | set(batch_processed))
    save_progress(progress)

    return {"kept": kept, "removed": removed, "errors": errors, "total": total}


def main():
    parser = argparse.ArgumentParser(description="GPT Vision filter for training dataset")
    parser.add_argument("--class", dest="cls", help="Filter only this class (e.g. acne)")
    parser.add_argument("--dry-run", action="store_true", help="Don't move files, just report")
    parser.add_argument("--reset", action="store_true", help="Reset progress for specified class")
    args = parser.parse_args()

    if not OPENAI_API_KEY:
        print("ERROR: OPENAI_API_KEY not set. Add it to .env or export it.")
        sys.exit(1)

    print("=" * 60)
    print("  GPT VISION FILTER")
    print(f"  Model: {MODEL}")
    print(f"  Dataset: {DATASET_DIR}")
    print(f"  Dry run: {args.dry_run}")
    print("=" * 60)

    if args.cls:
        classes = [args.cls]
    else:
        classes = sorted([
            d.name for d in DATASET_DIR.iterdir()
            if d.is_dir() and not d.name.startswith("_")
        ])

    if args.reset:
        progress = load_progress()
        for cls in classes:
            key = f"{cls}_processed"
            if key in progress:
                del progress[key]
                print(f"  Reset progress for {cls}")
        save_progress(progress)

    print(f"\n  Classes to filter: {', '.join(classes)}\n")

    total_kept = 0
    total_removed = 0
    total_errors = 0

    for cls in classes:
        stats = filter_class(cls, dry_run=args.dry_run)
        total_kept += stats["kept"]
        total_removed += stats["removed"]
        total_errors += stats["errors"]
        pct = (stats["removed"] / stats["total"] * 100) if stats.get("total", 0) > 0 else 0
        print(f"    => kept {stats['kept']}, removed {stats['removed']} ({pct:.0f}% rejected), errors: {stats['errors']}\n")

    print("=" * 60)
    print(f"  TOTAL: kept {total_kept}, removed {total_removed}, errors {total_errors}")
    print("=" * 60)

    print(f"\n  Post-filter counts:")
    for cls in classes:
        cls_dir = DATASET_DIR / cls
        count = len([
            f for f in cls_dir.iterdir()
            if f.is_file() and f.suffix.lower() in (".jpg", ".jpeg", ".png", ".webp")
            and not f.name.startswith("aug_")
        ]) if cls_dir.exists() else 0
        print(f"    {cls}: {count}")


if __name__ == "__main__":
    main()
