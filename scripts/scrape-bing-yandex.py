"""
Supplementary face scraper v5 – Bing Images + Yandex Images.
Runs AFTER the main scraper to fill gaps in weak classes.
Every image validated with DNN face detector before saving.
"""

import os
import re
import sys
import time
import json
import hashlib
from pathlib import Path
from io import BytesIO
from urllib.parse import quote_plus, unquote

import cv2
import numpy as np
import requests
from requests.adapters import HTTPAdapter
from urllib3.util.retry import Retry
from PIL import Image

# ── Config ──────────────────────────────────────────────────
DATASET_DIR = Path(__file__).resolve().parent.parent / "data" / "training-dataset"
MODEL_DIR = Path(__file__).resolve().parent / "_face_model"

TARGET_PER_CLASS = 2000
NORMAL_TARGET = 5000

MIN_IMAGE_BYTES = 5_000
MIN_IMAGE_DIM = 150
MAX_SAVE_DIM = 512
JPEG_QUALITY = 90

DNN_CONFIDENCE = 0.45
MIN_FACE_RATIO = 0.07

# ── Face detector (DNN) ────────────────────────────────────
NET = cv2.dnn.readNetFromCaffe(
    str(MODEL_DIR / "deploy.prototxt"),
    str(MODEL_DIR / "res10_300x300_ssd_iter_140000.caffemodel"),
)

def has_face(img_bytes: bytes) -> bool:
    try:
        arr = np.frombuffer(img_bytes, np.uint8)
        img = cv2.imdecode(arr, cv2.IMREAD_COLOR)
        if img is None:
            return False
        h, w = img.shape[:2]
        blob = cv2.dnn.blobFromImage(cv2.resize(img, (300, 300)), 1.0, (300, 300), (104, 177, 123))
        NET.setInput(blob)
        det = NET.forward()
        for i in range(det.shape[2]):
            if det[0, 0, i, 2] < DNN_CONFIDENCE:
                continue
            box = det[0, 0, i, 3:7] * np.array([w, h, w, h])
            x1, y1, x2, y2 = box.astype(int)
            if (max(0, x2 - x1) * max(0, y2 - y1)) / (h * w) >= MIN_FACE_RATIO:
                return True
        return False
    except Exception:
        return False

# ── Session ─────────────────────────────────────────────────
SESSION = requests.Session()
retry = Retry(total=2, backoff_factor=0.5, status_forcelist=[429, 500, 502, 503])
SESSION.mount("https://", HTTPAdapter(max_retries=retry))
SESSION.mount("http://", HTTPAdapter(max_retries=retry))

SEEN_HASHES: set[str] = set()

# ── Helpers ─────────────────────────────────────────────────
def count_images(cls: str) -> int:
    d = DATASET_DIR / cls
    return len([f for f in d.iterdir() if f.is_file() and f.suffix.lower() in (".jpg", ".jpeg", ".png")]) if d.exists() else 0

def target_for(cls: str) -> int:
    return NORMAL_TARGET if cls == "normal" else TARGET_PER_CLASS

def is_full(cls: str) -> bool:
    return count_images(cls) >= target_for(cls)

def save_image(cls: str, prefix: str, img_data: bytes) -> bool:
    if len(img_data) < MIN_IMAGE_BYTES:
        return False
    h = hashlib.md5(img_data).hexdigest()
    if h in SEEN_HASHES:
        return False
    if not has_face(img_data):
        return False
    try:
        img = Image.open(BytesIO(img_data)).convert("RGB")
        if min(img.size) < MIN_IMAGE_DIM:
            return False
        if max(img.size) > MAX_SAVE_DIM:
            img.thumbnail((MAX_SAVE_DIM, MAX_SAVE_DIM), Image.LANCZOS)
        out_dir = DATASET_DIR / cls
        out_dir.mkdir(parents=True, exist_ok=True)
        uid = h[:14]
        out_path = out_dir / f"{prefix}{uid}.jpg"
        if out_path.exists():
            return False
        img.save(out_path, "JPEG", quality=JPEG_QUALITY)
        SEEN_HASHES.add(h)
        return True
    except Exception:
        return False

def download_url(url: str, cls: str, prefix: str) -> bool:
    try:
        r = SESSION.get(url, timeout=12, stream=True, headers={
            "User-Agent": "Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/125.0.0.0 Safari/537.36",
            "Accept": "image/webp,image/apng,image/*,*/*;q=0.8",
        })
        if r.status_code != 200:
            return False
        return save_image(cls, prefix, r.content)
    except Exception:
        return False


# ── Bing Images ─────────────────────────────────────────────
def search_bing(query: str, cls: str, max_pages: int = 5) -> int:
    saved = 0
    headers = {
        "User-Agent": "Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/125.0.0.0 Safari/537.36",
        "Accept": "text/html,application/xhtml+xml,application/xml;q=0.9,*/*;q=0.8",
        "Accept-Language": "en-US,en;q=0.9",
    }

    for page in range(max_pages):
        if is_full(cls):
            break
        offset = page * 35
        url = f"https://www.bing.com/images/search?q={quote_plus(query)}&first={offset}&count=35&qft=+filterui:photo-photo"

        try:
            r = SESSION.get(url, headers=headers, timeout=15)
            if r.status_code != 200:
                continue

            # Extract murl (media URL) from Bing's HTML
            murls = re.findall(r'murl&quot;:&quot;(https?://[^&]+?)&quot;', r.text)
            if not murls:
                murls = re.findall(r'"murl":"(https?://[^"]+?)"', r.text)

            for img_url in murls:
                if is_full(cls):
                    break
                img_url = unquote(img_url)
                if download_url(img_url, cls, "bing_"):
                    saved += 1

            time.sleep(1.5)

        except Exception:
            continue

    return saved


# ── Yandex Images ───────────────────────────────────────────
def search_yandex(query: str, cls: str, max_pages: int = 5) -> int:
    saved = 0
    headers = {
        "User-Agent": "Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/125.0.0.0 Safari/537.36",
        "Accept": "text/html,application/xhtml+xml,application/xml;q=0.9,*/*;q=0.8",
        "Accept-Language": "en-US,en;q=0.9,ru;q=0.8",
    }

    for page in range(max_pages):
        if is_full(cls):
            break

        url = f"https://yandex.com/images/search?text={quote_plus(query)}&p={page}&itype=photo"

        try:
            r = SESSION.get(url, headers=headers, timeout=15)
            if r.status_code != 200:
                continue

            # Yandex embeds image data in JSON blocks in the HTML
            # Method 1: extract from data-bem attributes
            img_urls = re.findall(r'"url":"(https?://[^"]+?\.(?:jpg|jpeg|png)(?:\?[^"]*)?)"', r.text)

            # Method 2: look for origUrl in serialized data
            orig_urls = re.findall(r'"origUrl":"(https?://[^"]+?)"', r.text)
            img_urls.extend(orig_urls)

            # Method 3: img-src in preview data
            preview_urls = re.findall(r'"img_href":"(https?://[^"]+?)"', r.text)
            img_urls.extend(preview_urls)

            seen_in_page = set()
            for img_url in img_urls:
                if is_full(cls):
                    break
                img_url = unquote(img_url)
                if img_url in seen_in_page:
                    continue
                seen_in_page.add(img_url)
                if download_url(img_url, cls, "yandex_"):
                    saved += 1

            time.sleep(2.0)

        except Exception:
            continue

    return saved


# ── DermNet NZ ──────────────────────────────────────────────
DERMNET_TOPICS: dict[str, list[str]] = {
    "acne": ["/topics/acne", "/topics/acne-images", "/topics/acne-vulgaris-face-images"],
    "dermatitis": ["/topics/dermatitis-images", "/topics/atopic-dermatitis-face-images", "/topics/seborrhoeic-dermatitis-images", "/topics/perioral-dermatitis-images"],
    "dryness": ["/topics/dry-skin-images", "/topics/xerosis"],
    "eczema": ["/topics/eczema-images", "/topics/atopic-eczema-images", "/topics/hand-dermatitis-images"],
    "hyperpigmentation": ["/topics/melasma-images", "/topics/post-inflammatory-hyperpigmentation-images", "/topics/solar-lentigo-images"],
    "psoriasis": ["/topics/psoriasis-images", "/topics/facial-psoriasis-images", "/topics/scalp-psoriasis-images"],
    "rosacea": ["/topics/rosacea-images", "/topics/papulopustular-rosacea-images", "/topics/erythematotelangiectatic-rosacea-images"],
    "sun_damage": ["/topics/solar-damage-images", "/topics/actinic-keratosis-images", "/topics/photoageing-images"],
}

def scrape_dermnet(cls: str) -> int:
    saved = 0
    topics = DERMNET_TOPICS.get(cls, [])
    headers = {
        "User-Agent": "Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/537.36",
    }

    for topic_path in topics:
        if is_full(cls):
            break
        try:
            url = f"https://dermnetnz.org{topic_path}"
            r = SESSION.get(url, headers=headers, timeout=15)
            if r.status_code != 200:
                continue

            img_urls = re.findall(r'<img[^>]+src="(https://[^"]*dermnetnz[^"]*\.(?:jpg|jpeg|png))"', r.text, re.IGNORECASE)
            img_urls += re.findall(r'<img[^>]+data-src="(https://[^"]*dermnetnz[^"]*\.(?:jpg|jpeg|png))"', r.text, re.IGNORECASE)

            for img_url in img_urls:
                if is_full(cls):
                    break
                if download_url(img_url, cls, "dermnet_"):
                    saved += 1

            time.sleep(1.0)
        except Exception:
            continue

    return saved


# ── Unsplash (for normal class) ─────────────────────────────
def search_unsplash(query: str, cls: str, max_pages: int = 5) -> int:
    saved = 0
    headers = {
        "User-Agent": "Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/537.36",
        "Accept": "text/html,application/xhtml+xml",
    }

    for page in range(1, max_pages + 1):
        if is_full(cls):
            break
        try:
            url = f"https://unsplash.com/s/photos/{quote_plus(query)}?page={page}"
            r = SESSION.get(url, headers=headers, timeout=15)
            if r.status_code != 200:
                continue

            img_urls = re.findall(r'"(https://images\.unsplash\.com/photo-[^"]+?)"', r.text)
            seen = set()
            for img_url in img_urls:
                if is_full(cls):
                    break
                base = img_url.split("?")[0]
                if base in seen:
                    continue
                seen.add(base)
                dl_url = f"{base}?w={MAX_SAVE_DIM}&q=80&fm=jpg"
                if download_url(dl_url, cls, "unsplash_"):
                    saved += 1

            time.sleep(1.5)
        except Exception:
            continue

    return saved


# ── Pexels (for normal class) ───────────────────────────────
def search_pexels(query: str, cls: str, max_pages: int = 3) -> int:
    saved = 0
    headers = {
        "User-Agent": "Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/537.36",
    }

    for page in range(1, max_pages + 1):
        if is_full(cls):
            break
        try:
            url = f"https://www.pexels.com/search/{quote_plus(query)}/?page={page}"
            r = SESSION.get(url, headers=headers, timeout=15)
            if r.status_code != 200:
                continue

            img_urls = re.findall(r'"(https://images\.pexels\.com/photos/[^"]+?)"', r.text)
            seen = set()
            for img_url in img_urls:
                if is_full(cls):
                    break
                base = img_url.split("?")[0]
                if base in seen:
                    continue
                seen.add(base)
                dl_url = f"{base}?auto=compress&cs=tinysrgb&w={MAX_SAVE_DIM}"
                if download_url(dl_url, cls, "pexels_"):
                    saved += 1

            time.sleep(1.5)
        except Exception:
            continue

    return saved


# ── Search terms (expanded, focused on weak classes) ────────
SEARCH_TERMS: dict[str, list[str]] = {
    "psoriasis": [
        "psoriasis face photo", "facial psoriasis patient", "psoriasis forehead photo",
        "psoriasis cheeks nose", "scalp psoriasis face", "psoriasis eyebrows",
        "plaque psoriasis face", "psoriasis face close up", "psoriasis face woman",
        "psoriasis face man", "psoriasis face child", "psoriasis around eyes",
        "psoriasis nose face", "facial psoriasis dermatology", "psoriasis face flare up",
        "psoriasis face red patches", "guttate psoriasis face", "inverse psoriasis face",
        "psoriasis face treatment before after", "psoriasis face mild",
        "psoriasis ansikte", "psoriasis visage", "Psoriasis Gesicht Foto",
        "псориаз лицо фото", "псориаз на лице", "псориаз лицо лечение",
    ],
    "sun_damage": [
        "sun damage face photo", "photoaging face close up", "sun damaged skin face",
        "actinic keratosis face photo", "solar elastosis face", "sun spots face photo",
        "sun damage wrinkles face", "UV damage skin face", "photodamage face",
        "sun damaged face woman over 50", "sun damaged face man", "premature aging face sun",
        "sun damage face freckles spots", "sun damage forehead photo", "sun damage cheeks nose",
        "chronic sun exposure face", "sailor skin face", "farmer face sun damage",
        "solskadad hud ansikte foto", "dommages solaires visage photo",
        "фотостарение лица фото", "солнечное повреждение кожи лицо",
    ],
    "dryness": [
        "dry skin face photo", "dry flaky face skin", "dehydrated face close up",
        "xerosis face", "dry patches face", "dry cracked skin face",
        "dry skin face woman", "dry skin face man", "dry skin face winter",
        "extremely dry face peeling", "dry skin around nose mouth",
        "dry skin cheeks forehead", "dehydrated skin texture face",
        "dry face no makeup natural", "dry skin face redness",
        "torr hud ansikte foto", "peau seche visage photo",
        "сухая кожа лица фото", "сухость кожи лицо",
    ],
    "eczema": [
        "eczema face photo", "facial eczema close up", "atopic eczema face adult",
        "eczema face child", "eczema cheeks photo", "eczema around eyes",
        "eczema forehead photo", "eczema face flare up", "eczema face red patches",
        "eczema face dry cracked", "nummular eczema face", "eczema eyelids face",
        "eczema face treatment", "facial eczema patient dermatology",
        "eksem ansikte foto", "eczema visage photo",
        "экзема лица фото", "атопический дерматит лицо",
    ],
    "rosacea": [
        "rosacea face photo", "facial rosacea close up", "rosacea cheeks nose",
        "rosacea face woman photo", "rosacea face man photo", "rosacea redness face",
        "papulopustular rosacea face", "erythematotelangiectatic rosacea face photo",
        "rosacea nose rhinophyma", "mild rosacea face", "severe rosacea face",
        "rosacea flushing face", "rosacea face before after treatment",
        "rosacea face natural light", "ocular rosacea face photo",
        "rosacea ansikte foto", "rosacee visage photo",
        "розацеа лицо фото", "розацеа на лице лечение фото",
    ],
    "hyperpigmentation": [
        "hyperpigmentation face photo", "melasma face close up", "dark spots face",
        "melasma cheeks forehead", "post inflammatory hyperpigmentation face",
        "PIH face photo", "sun spots face", "uneven skin tone face photo",
        "melasma woman face", "melasma man face", "dark patches face skin",
        "hyperpigmentation face dark skin", "age spots face photo",
        "melasma pregnancy face", "hyperpigmentation forehead cheeks",
        "hyperpigmentering ansikte", "hyperpigmentation visage",
        "гиперпигментация лица фото", "мелазма лицо фото",
    ],
    "dermatitis": [
        "dermatitis face photo", "facial dermatitis close up", "atopic dermatitis face",
        "seborrheic dermatitis face", "contact dermatitis face photo",
        "perioral dermatitis face", "dermatitis cheeks forehead",
        "dermatitis face red patches flaky", "dermatitis around mouth",
        "dermatitis face woman", "dermatitis face man", "dermatitis face child",
        "facial dermatitis rash close up", "dermatitis nose eyebrows",
        "дерматит лица фото", "атопический дерматит лицо фото",
    ],
    "acne": [
        "acne face photo real", "cystic acne face close up", "hormonal acne face woman",
        "teenage acne face boy", "adult acne face", "acne jawline face photo",
        "acne forehead photo", "acne cheeks face", "severe acne face patient",
        "moderate acne face", "acne face natural light no filter",
        "акне лицо фото", "прыщи на лице фото", "угревая сыпь лицо",
    ],
    "normal": [
        "face portrait natural light", "clear skin face no makeup photo",
        "headshot portrait diverse", "face portrait young woman natural",
        "face portrait man natural skin", "face portrait elderly woman",
        "face portrait middle aged", "face portrait african american",
        "face portrait asian woman", "face portrait indian woman",
        "face portrait hispanic", "face portrait nordic natural",
        "passport photo face", "street portrait face natural",
        "portrait face freckles natural", "face portrait studio natural",
        "лицо портрет фото", "чистая кожа лицо",
    ],
}


# ── Main ────────────────────────────────────────────────────
def scrape_class(cls: str):
    target = target_for(cls)
    start = count_images(cls)
    terms = SEARCH_TERMS.get(cls, [])

    print(f"\n{'='*55}")
    print(f"  [{cls}] {start}/{target} — {len(terms)} terms  (Bing + Yandex + DermNet)")
    print(f"{'='*55}")

    if start >= target:
        print(f"    Already full!")
        return

    total_new = 0

    # DermNet first (high quality medical images)
    if cls != "normal" and not is_full(cls):
        dn = scrape_dermnet(cls)
        print(f"  DermNet: +{dn}")
        total_new += dn

    for i, term in enumerate(terms):
        if is_full(cls):
            print(f"    FULL at {count_images(cls)}/{target}")
            break

        current = count_images(cls)
        print(f"  [{i+1}/{len(terms)}] \"{term}\" (at {current}/{target})")

        s1 = search_bing(term, cls, max_pages=4)
        print(f"    Bing: +{s1}", end="", flush=True)

        s2 = 0
        if not is_full(cls):
            s2 = search_yandex(term, cls, max_pages=4)
            print(f"  Yandex: +{s2}", end="", flush=True)

        # Unsplash/Pexels only for normal class
        s3 = 0
        if cls == "normal" and not is_full(cls):
            s3 = search_unsplash(term, cls, max_pages=3)
            print(f"  Unsplash: +{s3}", end="", flush=True)

        s4 = 0
        if cls == "normal" and not is_full(cls):
            s4 = search_pexels(term, cls, max_pages=2)
            print(f"  Pexels: +{s4}", end="", flush=True)

        batch = s1 + s2 + s3 + s4
        total_new += batch
        print(f"  => +{batch} (now: {count_images(cls)}/{target})")
        time.sleep(1.0)

    final = count_images(cls)
    print(f"\n  [{cls}] DONE: {start} -> {final} (+{final - start})")


def main():
    print("=" * 60)
    print("  BING + YANDEX + DERMNET SCRAPER v5")
    print("  Supplementary scraper for weak classes")
    print("  DNN face detection on every image")
    print("=" * 60)

    print("\n  Current counts:")
    all_cls = list(SEARCH_TERMS.keys())
    for cls in all_cls:
        t = target_for(cls)
        c = count_images(cls)
        status = "FULL" if c >= t else f"need +{t - c}"
        print(f"    {cls:24s} {c:5d} / {t:5d}  ({status})")

    # Scrape weakest classes first
    priority = sorted(
        [c for c in all_cls if not is_full(c)],
        key=lambda c: count_images(c)
    )

    print(f"\n  Priority order: {', '.join(priority)}")

    for cls in priority:
        scrape_class(cls)

    print(f"\n{'='*60}")
    print("  FINAL RESULTS:")
    total = 0
    for cls in all_cls:
        t = target_for(cls)
        c = count_images(cls)
        total += c
        pct = c / t * 100
        bar = "#" * int(pct / 2.5) + "." * (40 - int(pct / 2.5))
        print(f"    {cls:24s} {c:5d} / {t:5d}  [{bar}] {pct:.0f}%")
    print(f"    {'TOTAL':24s} {total:5d}")
    print(f"{'='*60}")


if __name__ == "__main__":
    main()
