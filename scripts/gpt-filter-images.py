"""
GPT Vision image filter for training dataset.
Sends every image to GPT-4o-mini Vision and removes:
  - Illustrations, drawings, diagrams
  - Images with text/watermarks/labels
  - Images where the condition is on the body (not the face)
  - Low-quality, blurry, or irrelevant images
  - Stock photos with no visible skin condition (for disease classes)

Batches 10 images per API call for cost efficiency.
Estimated cost: ~$0.30-0.50 for 15,000 images.
"""

import os
import sys
import json
import time
import base64
import shutil
from pathlib import Path
from concurrent.futures import ThreadPoolExecutor

import requests

# ── Config ──────────────────────────────────────────────────
DATASET_DIR = Path(__file__).resolve().parent.parent / "data" / "training-dataset"
BATCH_SIZE = 10
MODEL = "gpt-4o-mini"
MAX_RETRIES = 3
RETRY_DELAY = 5

from dotenv import load_dotenv
load_dotenv(Path(__file__).resolve().parent.parent / ".env", override=True)
API_KEY = os.environ.get("OPENAI_API_KEY", "")

if not API_KEY:
    print("ERROR: OPENAI_API_KEY not set")
    sys.exit(1)

API_URL = "https://api.openai.com/v1/chat/completions"
HEADERS = {
    "Authorization": f"Bearer {API_KEY}",
    "Content-Type": "application/json",
}

CLASSES = [
    "acne", "dermatitis", "dryness", "eczema",
    "hyperpigmentation", "psoriasis", "rosacea", "sun_damage", "normal",
]

# ── Helpers ─────────────────────────────────────────────────
def encode_image(path: Path) -> str | None:
    try:
        with open(path, "rb") as f:
            data = f.read()
        if len(data) < 1000:
            return None
        return base64.b64encode(data).decode("utf-8")
    except Exception:
        return None


def build_prompt(cls: str, count: int) -> str:
    if cls == "normal":
        return f"""You are a training-data quality filter for a skin analysis AI model.

I am showing you {count} images that should contain REAL PHOTOGRAPHS of HUMAN FACES with NORMAL/HEALTHY/CLEAR SKIN.

For EACH image (1 to {count}), answer KEEP or REMOVE based on these rules:

REMOVE if ANY of these are true:
- It is an illustration, drawing, painting, diagram, or medical atlas plate (not a real photo)
- There is no human face clearly visible
- The face is heavily obscured, blurry, or too small to see skin detail
- It is a collage or comparison image (before/after, side-by-side)

Note: text, watermarks, or labels in the image are OK — do NOT remove just because of those.

KEEP only if ALL of these are true:
- It is a real photograph
- A human face is clearly visible and in focus
- The skin appears normal/healthy/clear

Answer as a JSON array of {count} strings, e.g. ["KEEP","REMOVE","KEEP",...]. Nothing else."""
    else:
        condition_desc = {
            "acne": "acne (pimples, pustules, comedones, cystic lesions)",
            "dermatitis": "dermatitis (red, inflamed, irritated skin patches)",
            "dryness": "dry skin (flaky, cracked, rough texture)",
            "eczema": "eczema (red, itchy, inflamed patches)",
            "hyperpigmentation": "hyperpigmentation (dark spots, melasma, uneven pigmentation)",
            "psoriasis": "psoriasis (thick, scaly, red plaques)",
            "rosacea": "rosacea (facial redness, visible blood vessels, flushing)",
            "sun_damage": "sun damage (age spots, photoaging, solar keratosis)",
        }.get(cls, cls)

        return f"""You are a training-data quality filter for a skin analysis AI model.

I am showing you {count} images that should contain REAL PHOTOGRAPHS of HUMAN FACES showing {condition_desc}.

For EACH image (1 to {count}), answer KEEP or REMOVE based on these rules:

REMOVE if ANY of these are true:
- It is an illustration, drawing, painting, diagram, or medical atlas plate (not a real photo)
- There is no human face clearly visible
- The skin condition is only visible on the body/arms/legs/hands (NOT on the face)
- The face is heavily obscured, blurry, or too small to see skin detail
- It is a collage or comparison image (before/after, side-by-side)
- The image shows a completely different condition than {cls}

Note: text, watermarks, or labels in the image are OK — do NOT remove just because of those.

KEEP only if ALL of these are true:
- It is a real photograph
- A human face is clearly visible and in focus
- The {cls} condition is visible ON THE FACE

Answer as a JSON array of {count} strings, e.g. ["KEEP","REMOVE","KEEP",...]. Nothing else."""


def call_gpt(cls: str, image_paths: list[Path]) -> list[str]:
    encoded = []
    valid_paths = []
    for p in image_paths:
        b64 = encode_image(p)
        if b64:
            encoded.append(b64)
            valid_paths.append(p)

    if not encoded:
        return []

    content = [{"type": "text", "text": build_prompt(cls, len(encoded))}]
    for b64 in encoded:
        ext = "jpeg"
        content.append({
            "type": "image_url",
            "image_url": {"url": f"data:image/{ext};base64,{b64}", "detail": "low"},
        })

    payload = {
        "model": MODEL,
        "messages": [{"role": "user", "content": content}],
        "max_tokens": 200,
        "temperature": 0,
    }

    for attempt in range(MAX_RETRIES):
        try:
            r = requests.post(API_URL, headers=HEADERS, json=payload, timeout=30)
            if r.status_code == 429:
                wait = RETRY_DELAY * (attempt + 2)
                print(f" [rate-limited {wait}s]", end="", flush=True)
                time.sleep(wait)
                continue
            r.raise_for_status()
            text = r.json()["choices"][0]["message"]["content"].strip()

            text = text.replace("```json", "").replace("```", "").strip()
            verdicts = json.loads(text)

            if len(verdicts) != len(valid_paths):
                print(f" [mismatch: got {len(verdicts)} verdicts for {len(valid_paths)} images]", end="", flush=True)
                return ["KEEP"] * len(valid_paths)

            return verdicts

        except json.JSONDecodeError:
            print(f" [JSON parse error: {text[:80]}]", end="", flush=True)
            return ["KEEP"] * len(valid_paths)
        except Exception as e:
            if attempt < MAX_RETRIES - 1:
                time.sleep(RETRY_DELAY)
                continue
            print(f" [API error: {e}]", end="", flush=True)
            return ["KEEP"] * len(valid_paths)

    return ["KEEP"] * len(valid_paths)


def filter_class(cls: str) -> tuple[int, int]:
    cls_dir = DATASET_DIR / cls
    if not cls_dir.exists():
        print(f"  [{cls}] Directory not found")
        return 0, 0

    rej_dir = cls_dir / "_gpt_rejected"
    rej_dir.mkdir(exist_ok=True)

    images = sorted([
        f for f in cls_dir.iterdir()
        if f.is_file() and f.suffix.lower() in (".jpg", ".jpeg", ".png")
    ])

    if not images:
        print(f"  [{cls}] No images found")
        return 0, 0

    total = len(images)
    kept = 0
    removed = 0

    batches = [images[i:i + BATCH_SIZE] for i in range(0, len(images), BATCH_SIZE)]
    print(f"  [{cls}] {total} images, {len(batches)} batches")

    for bi, batch in enumerate(batches):
        print(f"    batch {bi+1}/{len(batches)}", end="", flush=True)

        verdicts = call_gpt(cls, batch)

        valid_idx = 0
        for p in batch:
            b64 = encode_image(p)
            if b64 is None:
                shutil.move(str(p), str(rej_dir / p.name))
                removed += 1
                continue

            if valid_idx < len(verdicts) and verdicts[valid_idx].strip().upper() == "REMOVE":
                shutil.move(str(p), str(rej_dir / p.name))
                removed += 1
            else:
                kept += 1
            valid_idx += 1

        print(f"  kept={kept} removed={removed}")
        time.sleep(0.3)

    print(f"  [{cls}] DONE: {kept} kept, {removed} removed out of {total}")
    return kept, removed


def main():
    print("=" * 60)
    print("  GPT VISION IMAGE FILTER")
    print(f"  Model: {MODEL}")
    print(f"  Batch size: {BATCH_SIZE}")
    print("  Criteria: real face photo, condition on face,")
    print("            no text/watermarks, no illustrations")
    print("=" * 60)

    print("\n  Image counts before filtering:")
    for cls in CLASSES:
        cls_dir = DATASET_DIR / cls
        if cls_dir.exists():
            n = len([f for f in cls_dir.iterdir() if f.is_file() and f.suffix.lower() in (".jpg", ".jpeg", ".png")])
            print(f"    {cls:24s} {n}")

    print()
    total_kept = 0
    total_removed = 0

    for cls in CLASSES:
        k, r = filter_class(cls)
        total_kept += k
        total_removed += r
        print()

    print("=" * 60)
    print(f"  FINAL: {total_kept} kept, {total_removed} removed")
    print(f"  Removed images saved in _gpt_rejected/ folders")
    print("=" * 60)

    print("\n  Final counts:")
    for cls in CLASSES:
        cls_dir = DATASET_DIR / cls
        if cls_dir.exists():
            n = len([f for f in cls_dir.iterdir() if f.is_file() and f.suffix.lower() in (".jpg", ".jpeg", ".png")])
            print(f"    {cls:24s} {n}")


if __name__ == "__main__":
    main()
