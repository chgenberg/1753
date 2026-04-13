"""
Scrape FACE-ONLY images for skin condition training.
Uses targeted search terms with "face" qualifier and validates every image
with OpenCV face detection before saving.

Sources:
- Wikimedia Commons (search + category)
- DermNet NZ
- Open-i / PubMed Central
- Google (via requests, public images)
"""

import os
import sys
import time
import hashlib
import ssl
import certifi
from pathlib import Path
from io import BytesIO
from concurrent.futures import ThreadPoolExecutor

import cv2
import numpy as np
import requests
from requests.adapters import HTTPAdapter
from urllib3.util.retry import Retry
from PIL import Image

# ── Config ──────────────────────────────────────────────────
DATASET_DIR = Path(__file__).resolve().parent.parent / "data" / "training-dataset"
TARGET_PER_CLASS = 800
NORMAL_TARGET = 2000

MIN_IMAGE_BYTES = 8_000
MIN_IMAGE_DIM = 200
MAX_SAVE_DIM = 512
JPEG_QUALITY = 90

MIN_FACE_CONFIDENCE = 0.06  # face area ratio

# Targeted face-specific search terms per condition
FACE_SEARCHES: dict[str, list[str]] = {
    "acne": [
        "acne face", "acne vulgaris face", "facial acne", "acne cheeks forehead",
        "cystic acne face", "teenage acne face", "adult acne face",
        "acne face close up", "pimples face", "acne breakout face",
        "acne face woman", "acne face man", "acne skin face photograph",
        "facial acne patient", "acne face before after",
    ],
    "dermatitis": [
        "dermatitis face", "facial dermatitis", "atopic dermatitis face",
        "seborrheic dermatitis face", "contact dermatitis face",
        "perioral dermatitis face", "dermatitis cheeks", "dermatitis forehead",
        "facial eczema dermatitis", "dermatitis face patient",
    ],
    "dryness": [
        "dry skin face", "dry face skin", "dehydrated skin face",
        "xerosis face", "flaky skin face", "dry patches face",
        "dry skin face woman", "dry skin face man", "cracked skin face",
        "peeling skin face", "dry face close up",
    ],
    "eczema": [
        "eczema face", "facial eczema", "eczema face adult",
        "eczema face child", "atopic eczema face", "eczema cheeks",
        "eczema around eyes", "eczema forehead", "eczema face patient",
        "eczema face photograph", "facial eczema rash",
    ],
    "hyperpigmentation": [
        "hyperpigmentation face", "facial hyperpigmentation", "melasma face",
        "dark spots face", "sun spots face", "age spots face",
        "hyperpigmentation cheeks", "melasma forehead", "PIH face",
        "post inflammatory hyperpigmentation face", "uneven skin tone face",
        "dark patches face", "melasma woman face",
    ],
    "psoriasis": [
        "psoriasis face", "facial psoriasis", "psoriasis forehead",
        "psoriasis scalp face", "psoriasis cheeks", "psoriasis face patient",
        "psoriasis around nose", "psoriasis eyebrows", "psoriasis face close up",
    ],
    "rosacea": [
        "rosacea face", "facial rosacea", "rosacea cheeks nose",
        "rosacea face woman", "rosacea face man", "rosacea close up face",
        "rosacea redness face", "rosacea papules face", "erythematotelangiectatic rosacea face",
        "rosacea before after face", "rosacea face patient photograph",
        "rosacea nose cheeks", "mild rosacea face", "severe rosacea face",
    ],
    "sun_damage": [
        "sun damaged face", "sun damage face skin", "photoaging face",
        "solar damage face", "sun spots face", "sun damaged skin face",
        "UV damage face", "sun damage face woman", "sun damage face man",
        "photodamage face", "actinic keratosis face",
    ],
    "normal": [
        "clear skin face", "healthy skin face", "normal skin face portrait",
        "clear complexion face", "beautiful skin face no makeup",
        "natural face portrait", "human face portrait photograph",
        "face portrait natural light", "face close up portrait",
        "young face portrait", "middle aged face portrait",
        "face portrait diverse", "face portrait woman no makeup",
        "face portrait man natural", "face natural skin",
        "face portrait documentary", "headshot portrait natural",
        "face portrait outdoor light", "face portrait studio",
        "healthy face glow", "face portrait asian",
        "face portrait african", "face portrait latin",
        "face portrait nordic", "passport photo face",
    ],
}

# ── Session ─────────────────────────────────────────────────
SESSION = requests.Session()
SESSION.headers.update({
    "User-Agent": "1753SkinResearch/2.0 (training data collection; contact@1753skincare.com)",
})
retry = Retry(total=3, backoff_factor=1, status_forcelist=[429, 500, 502, 503, 504])
SESSION.mount("https://", HTTPAdapter(max_retries=retry))
SESSION.mount("http://", HTTPAdapter(max_retries=retry))

# ── Face detector ───────────────────────────────────────────
FACE_DETECTOR = cv2.CascadeClassifier(
    cv2.data.haarcascades + "haarcascade_frontalface_default.xml"
)


def has_face(img_bytes: bytes) -> bool:
    """Check if image contains a face."""
    try:
        arr = np.frombuffer(img_bytes, np.uint8)
        img = cv2.imdecode(arr, cv2.IMREAD_COLOR)
        if img is None:
            return False

        h, w = img.shape[:2]
        img_area = h * w

        gray = cv2.cvtColor(img, cv2.COLOR_BGR2GRAY)
        gray = cv2.equalizeHist(gray)

        faces = FACE_DETECTOR.detectMultiScale(
            gray, scaleFactor=1.1, minNeighbors=4,
            minSize=(60, 60), flags=cv2.CASCADE_SCALE_IMAGE,
        )

        for (x, y, fw, fh) in faces:
            if (fw * fh) / img_area >= MIN_FACE_CONFIDENCE:
                return True
        return False
    except Exception:
        return False


def count_images(cls: str) -> int:
    d = DATASET_DIR / cls
    if not d.exists():
        return 0
    return len([f for f in d.iterdir() if f.is_file() and f.suffix.lower() in (".jpg", ".jpeg", ".png")])


def is_full(cls: str) -> bool:
    target = NORMAL_TARGET if cls == "normal" else TARGET_PER_CLASS
    return count_images(cls) >= target


def save_image(cls: str, prefix: str, img_data: bytes) -> bool:
    """Validate face, resize, and save."""
    if len(img_data) < MIN_IMAGE_BYTES:
        return False
    if not has_face(img_data):
        return False

    try:
        img = Image.open(BytesIO(img_data)).convert("RGB")
        if min(img.size) < MIN_IMAGE_DIM:
            return False

        if max(img.size) > MAX_SAVE_DIM:
            img.thumbnail((MAX_SAVE_DIM, MAX_SAVE_DIM), Image.LANCZOS)

        uid = hashlib.md5(img_data).hexdigest()[:12]
        out_dir = DATASET_DIR / cls
        out_dir.mkdir(parents=True, exist_ok=True)
        out_path = out_dir / f"{prefix}{uid}.jpg"

        if out_path.exists():
            return False

        img.save(out_path, "JPEG", quality=JPEG_QUALITY)
        return True
    except Exception:
        return False


def download_and_save(url: str, cls: str, prefix: str) -> bool:
    """Download image URL, validate face, save."""
    try:
        resp = SESSION.get(url, timeout=15)
        if resp.status_code != 200:
            return False
        return save_image(cls, prefix, resp.content)
    except Exception:
        return False


# ── Sources ─────────────────────────────────────────────────

def scrape_wikimedia(term: str, cls: str, max_results: int = 300) -> int:
    """Search Wikimedia Commons for face images."""
    saved = 0
    params = {
        "action": "query",
        "format": "json",
        "generator": "search",
        "gsrnamespace": 6,
        "gsrsearch": term,
        "gsrlimit": 50,
        "prop": "imageinfo",
        "iiprop": "url|mime",
        "iiurlwidth": MAX_SAVE_DIM,
    }
    seen = 0
    cont = {}

    while seen < max_results and not is_full(cls):
        try:
            r = SESSION.get("https://commons.wikimedia.org/w/api.php", params={**params, **cont}, timeout=20)
            data = r.json()
        except Exception:
            break

        pages = data.get("query", {}).get("pages", {})
        if not pages:
            break

        for page in pages.values():
            if is_full(cls):
                break
            seen += 1
            for ii in page.get("imageinfo", []):
                mime = ii.get("mime", "")
                if "image" not in mime:
                    continue
                url = ii.get("thumburl") or ii.get("url", "")
                if url and download_and_save(url, cls, "wiki_"):
                    saved += 1

        if "continue" in data:
            cont = data["continue"]
        else:
            break

    return saved


def scrape_openi(term: str, cls: str, max_results: int = 200) -> int:
    """Search Open-i (PubMed Central images)."""
    saved = 0
    offset = 0

    while offset < max_results and not is_full(cls):
        try:
            r = SESSION.get(
                "https://openi.nlm.nih.gov/api/search",
                params={"query": term, "m": offset + 1, "n": min(offset + 30, max_results)},
                timeout=20,
            )
            data = r.json()
        except Exception:
            break

        items = data.get("list", [])
        if not items:
            break

        for item in items:
            if is_full(cls):
                break
            img_url = item.get("imgLarge") or item.get("imgGrid") or ""
            if not img_url:
                continue
            if not img_url.startswith("http"):
                img_url = "https://openi.nlm.nih.gov" + img_url
            if download_and_save(img_url, cls, "openi_"):
                saved += 1

        offset += 30
        if len(items) < 30:
            break

    return saved


def scrape_dermnet(term: str, cls: str) -> int:
    """Search DermNet NZ for face images."""
    saved = 0
    try:
        from bs4 import BeautifulSoup
    except ImportError:
        return 0

    search_url = f"https://dermnetnz.org/search?query={requests.utils.quote(term)}"
    try:
        r = SESSION.get(search_url, timeout=20)
        soup = BeautifulSoup(r.text, "html.parser")
    except Exception:
        return 0

    for img_tag in soup.find_all("img"):
        if is_full(cls):
            break
        src = img_tag.get("src", "")
        if not src or "logo" in src.lower() or "icon" in src.lower():
            continue
        if not src.startswith("http"):
            src = "https://dermnetnz.org" + src
        if download_and_save(src, cls, "dn_"):
            saved += 1

    return saved


def scrape_class(cls: str):
    """Scrape all sources for one condition class."""
    target = NORMAL_TARGET if cls == "normal" else TARGET_PER_CLASS
    start_count = count_images(cls)
    print(f"\n  [{cls}] Starting at {start_count}/{target}")

    terms = FACE_SEARCHES.get(cls, [])
    total_saved = 0

    for i, term in enumerate(terms):
        if is_full(cls):
            break

        print(f"    [{i+1}/{len(terms)}] \"{term}\"", end="", flush=True)

        s1 = scrape_wikimedia(term, cls)
        s2 = scrape_openi(term, cls) if not is_full(cls) else 0
        s3 = scrape_dermnet(term, cls) if not is_full(cls) else 0

        batch = s1 + s2 + s3
        total_saved += batch
        current = count_images(cls)
        print(f" => +{batch} (total: {current}/{target})")

        time.sleep(0.5)

    final = count_images(cls)
    print(f"  [{cls}] DONE: {start_count} -> {final} (+{final - start_count})")


def main():
    print("=" * 60)
    print("  FACE-ONLY SCRAPER v3")
    print("  Every image validated with face detection before saving")
    print("=" * 60)

    print("\n  Current counts:")
    all_classes = list(FACE_SEARCHES.keys())
    for cls in all_classes:
        target = NORMAL_TARGET if cls == "normal" else TARGET_PER_CLASS
        print(f"    {cls}: {count_images(cls)}/{target}")

    for cls in all_classes:
        if is_full(cls):
            print(f"\n  [{cls}] Already full, skipping")
            continue
        scrape_class(cls)

    print(f"\n{'=' * 60}")
    print("  FINAL COUNTS:")
    for cls in all_classes:
        target = NORMAL_TARGET if cls == "normal" else TARGET_PER_CLASS
        c = count_images(cls)
        bar_len = int(c / target * 40)
        bar = "#" * bar_len + " " * (40 - bar_len)
        print(f"    {cls:24s} {c:5d} / {target:5d}  [{bar}]  {c/target*100:.0f}%")
    print(f"{'=' * 60}")


if __name__ == "__main__":
    main()
