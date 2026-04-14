#!/usr/bin/env python3
"""
annotate-severity.py

Uses GPT-4o-mini to annotate skin condition images with severity levels.
Creates a JSON mapping: filename -> { severity: "mild"|"moderate"|"severe", confidence: 0-1 }

This data is used by the multi-task training head.

Usage:
  python scripts/annotate-severity.py
  python scripts/annotate-severity.py --class acne
  python scripts/annotate-severity.py --dry-run
"""

import argparse
import base64
import io
import json
import os
import sys
import time
from pathlib import Path

import requests
from PIL import Image

DATASET_DIR = Path(__file__).resolve().parent.parent / "data" / "training-dataset"
ANNOTATIONS_FILE = DATASET_DIR / "_severity_annotations.json"

OPENAI_API_KEY = os.environ.get("OPENAI_API_KEY", "")
if not OPENAI_API_KEY:
    from dotenv import load_dotenv
    load_dotenv(Path(__file__).resolve().parent.parent / ".env")
    OPENAI_API_KEY = os.environ.get("OPENAI_API_KEY", "")

API_URL = "https://api.openai.com/v1/chat/completions"
MODEL = "gpt-5.4-mini"
MAX_RETRIES = 3
RATE_LIMIT_SLEEP = 2

CLASSES_TO_ANNOTATE = [
    "acne", "dermatitis", "dryness", "eczema",
    "hyperpigmentation", "psoriasis", "rosacea", "sun_damage",
]

SYSTEM_PROMPT = """You are a dermatology severity classifier. Given an image of a facial skin condition, classify its severity.

Respond with ONLY a JSON object:
{"severity": "mild", "confidence": 0.85}

Severity levels:
- "mild": Slight, barely noticeable. Minor redness, few spots, minimal texture change.
- "moderate": Clearly visible. Multiple affected areas, noticeable redness/spots/dryness.
- "severe": Widespread, significant. Large affected areas, intense redness/inflammation/scaling.

For "normal" skin images, respond: {"severity": "none", "confidence": 0.95}

Be consistent. When in doubt between two levels, choose the lower severity."""


def encode_image_b64(path: str, max_size: int = 384) -> str:
    img = Image.open(path).convert("RGB")
    img.thumbnail((max_size, max_size), Image.LANCZOS)
    buf = io.BytesIO()
    img.save(buf, format="JPEG", quality=75)
    return base64.b64encode(buf.getvalue()).decode("utf-8")


def annotate_image(img_path: str, condition: str) -> dict:
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
                                    "text": f"This image shows {condition}. Classify the severity.",
                                },
                            ],
                        },
                    ],
                    "max_tokens": 40,
                    "temperature": 0,
                },
                timeout=30,
            )

            if resp.status_code == 429:
                time.sleep(RATE_LIMIT_SLEEP * (attempt + 1))
                continue

            if resp.status_code != 200:
                return {"severity": "moderate", "confidence": 0.5, "error": f"API {resp.status_code}"}

            content = resp.json()["choices"][0]["message"]["content"].strip()
            if content.startswith("```"):
                content = content.split("```")[1]
                if content.startswith("json"):
                    content = content[4:]

            result = json.loads(content)
            return result

        except json.JSONDecodeError:
            if "mild" in content.lower():
                return {"severity": "mild", "confidence": 0.6}
            elif "severe" in content.lower():
                return {"severity": "severe", "confidence": 0.6}
            return {"severity": "moderate", "confidence": 0.5, "error": "parse_error"}
        except Exception as e:
            if attempt < MAX_RETRIES - 1:
                time.sleep(RATE_LIMIT_SLEEP)
                continue
            return {"severity": "moderate", "confidence": 0.5, "error": str(e)}

    return {"severity": "moderate", "confidence": 0.5, "error": "max_retries"}


def load_annotations() -> dict:
    if ANNOTATIONS_FILE.exists():
        return json.loads(ANNOTATIONS_FILE.read_text())
    return {}


def save_annotations(annotations: dict):
    ANNOTATIONS_FILE.write_text(json.dumps(annotations, indent=2))


def annotate_class(class_name: str, annotations: dict, dry_run: bool = False) -> int:
    class_dir = DATASET_DIR / class_name
    if not class_dir.exists():
        return 0

    images = sorted([
        f for f in class_dir.iterdir()
        if f.is_file()
        and f.suffix.lower() in (".jpg", ".jpeg", ".png")
        and not f.name.startswith("aug_")
        and not f.name.startswith("_")
        and not f.name.startswith(".")
    ])

    key_prefix = f"{class_name}/"
    already_done = sum(1 for img in images if f"{key_prefix}{img.name}" in annotations)
    to_process = [img for img in images if f"{key_prefix}{img.name}" not in annotations]

    print(f"  [{class_name}] {len(images)} originals, {already_done} already annotated, {len(to_process)} to do")

    if dry_run:
        return len(to_process)

    annotated = 0
    for i, img_path in enumerate(to_process):
        key = f"{key_prefix}{img_path.name}"
        result = annotate_image(str(img_path), class_name)
        annotations[key] = result
        annotated += 1

        if (i + 1) % 10 == 0:
            save_annotations(annotations)
            errs = sum(1 for v in annotations.values() if "error" in v)
            print(f"    [{class_name}] {i+1}/{len(to_process)} — "
                  f"mild: {sum(1 for v in annotations.values() if v.get('severity') == 'mild')}, "
                  f"moderate: {sum(1 for v in annotations.values() if v.get('severity') == 'moderate')}, "
                  f"severe: {sum(1 for v in annotations.values() if v.get('severity') == 'severe')}, "
                  f"errors: {errs}")

    save_annotations(annotations)
    return annotated


def main():
    parser = argparse.ArgumentParser(description="Annotate severity with GPT Vision")
    parser.add_argument("--class", dest="class_name", type=str, default=None)
    parser.add_argument("--dry-run", action="store_true")
    args = parser.parse_args()

    if not OPENAI_API_KEY:
        print("Error: OPENAI_API_KEY not set")
        sys.exit(1)

    print("=" * 60)
    print("  SEVERITY ANNOTATION (GPT-4o-mini)")
    print(f"  Dataset: {DATASET_DIR}")
    print(f"  Dry run: {args.dry_run}")
    print("=" * 60)

    annotations = load_annotations()
    classes = [args.class_name] if args.class_name else CLASSES_TO_ANNOTATE

    total = 0
    for cls in classes:
        count = annotate_class(cls, annotations, args.dry_run)
        total += count

    severity_counts = {"mild": 0, "moderate": 0, "severe": 0, "none": 0}
    for v in annotations.values():
        s = v.get("severity", "moderate")
        severity_counts[s] = severity_counts.get(s, 0) + 1

    print(f"\n{'=' * 60}")
    print(f"  TOTAL: {total} newly annotated, {len(annotations)} total")
    print(f"  Distribution: {json.dumps(severity_counts)}")
    print(f"{'=' * 60}")


if __name__ == "__main__":
    main()
