"""
Aggressive face-only image scraper v4.
Searches the entire web via DuckDuckGo Images + Wikimedia + Open-i.
Every single image is validated with OpenCV DNN face detector before saving.
"""

import os
import sys
import time
import hashlib
from pathlib import Path
from io import BytesIO

import cv2
import numpy as np
import requests
from requests.adapters import HTTPAdapter
from urllib3.util.retry import Retry
from PIL import Image

try:
    from ddgs import DDGS
except ImportError:
    try:
        from duckduckgo_search import DDGS
    except ImportError:
        print("pip3 install ddgs")
        sys.exit(1)

# ── Config ──────────────────────────────────────────────────
DATASET_DIR = Path(__file__).resolve().parent.parent / "data" / "training-dataset"
MODEL_DIR = Path(__file__).resolve().parent / "_face_model"
TARGET_PER_CLASS = 1500
NORMAL_TARGET = 3000

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
SESSION.headers.update({"User-Agent": "Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/537.36"})
retry = Retry(total=2, backoff_factor=0.5, status_forcelist=[429, 500, 502, 503])
SESSION.mount("https://", HTTPAdapter(max_retries=retry))
SESSION.mount("http://", HTTPAdapter(max_retries=retry))

# ── Helpers ─────────────────────────────────────────────────
SEEN_HASHES: set[str] = set()

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
        r = SESSION.get(url, timeout=12, stream=True)
        if r.status_code != 200:
            return False
        data = r.content
        return save_image(cls, prefix, data)
    except Exception:
        return False

# ── DuckDuckGo Images ───────────────────────────────────────
DDG_DELAY = 4.0  # seconds between DDG searches to avoid ratelimit

def search_ddg(query: str, cls: str, max_results: int = 150) -> int:
    saved = 0
    for attempt in range(3):
        try:
            results = DDGS().images(query, max_results=max_results)
            result_list = list(results)
            break
        except Exception as e:
            if "Ratelimit" in str(e) or "403" in str(e):
                wait = DDG_DELAY * (attempt + 2)
                print(f" [rate-limited, waiting {wait:.0f}s]", end="", flush=True)
                time.sleep(wait)
                continue
            print(f" [DDG err: {type(e).__name__}]", end="", flush=True)
            return 0
    else:
        return 0

    for r in result_list:
        if is_full(cls):
            break
        url = r.get("image", "")
        if not url:
            continue
        if download_url(url, cls, "ddg_"):
            saved += 1

    time.sleep(DDG_DELAY)
    return saved

# ── Flickr (public, no API key) ────────────────────────────
def search_flickr(query: str, cls: str, max_pages: int = 3) -> int:
    saved = 0
    for page in range(1, max_pages + 1):
        if is_full(cls):
            break
        try:
            r = SESSION.get(
                "https://www.flickr.com/search/",
                params={"text": query, "media": "photos", "page": page},
                timeout=15,
            )
            from bs4 import BeautifulSoup
            soup = BeautifulSoup(r.text, "html.parser")
            for img in soup.find_all("img"):
                if is_full(cls):
                    break
                src = img.get("src", "")
                if "live.staticflickr.com" not in src:
                    continue
                src = src.replace("_m.jpg", "_z.jpg").replace("_s.jpg", "_z.jpg").replace("_q.jpg", "_z.jpg")
                if not src.startswith("http"):
                    src = "https:" + src
                if download_url(src, cls, "flickr_"):
                    saved += 1
        except Exception:
            pass
    return saved

# ── Wikimedia Commons ───────────────────────────────────────
def search_wikimedia(query: str, cls: str, max_results: int = 200) -> int:
    saved = 0
    params = {
        "action": "query", "format": "json", "generator": "search",
        "gsrnamespace": 6, "gsrsearch": query, "gsrlimit": 50,
        "prop": "imageinfo", "iiprop": "url|mime", "iiurlwidth": MAX_SAVE_DIM,
    }
    cont = {}
    seen = 0

    while seen < max_results and not is_full(cls):
        try:
            r = SESSION.get("https://commons.wikimedia.org/w/api.php", params={**params, **cont}, timeout=15)
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
                if "image" not in ii.get("mime", ""):
                    continue
                url = ii.get("thumburl") or ii.get("url", "")
                if url and download_url(url, cls, "wiki_"):
                    saved += 1

        cont = data.get("continue", {})
        if not cont:
            break

    return saved

# ── Open-i / PubMed ────────────────────────────────────────
def search_openi(query: str, cls: str, max_results: int = 150) -> int:
    saved = 0
    offset = 0

    while offset < max_results and not is_full(cls):
        try:
            r = SESSION.get("https://openi.nlm.nih.gov/api/search",
                            params={"query": query, "m": offset + 1, "n": min(offset + 30, max_results)},
                            timeout=15)
            items = r.json().get("list", [])
        except Exception:
            break

        if not items:
            break

        for item in items:
            if is_full(cls):
                break
            url = item.get("imgLarge") or item.get("imgGrid") or ""
            if not url:
                continue
            if not url.startswith("http"):
                url = "https://openi.nlm.nih.gov" + url
            if download_url(url, cls, "openi_"):
                saved += 1

        offset += 30
        if len(items) < 30:
            break

    return saved

# ── Search terms ────────────────────────────────────────────
SEARCH_TERMS: dict[str, list[str]] = {
    "acne": [
        "acne face close up photo", "facial acne photograph", "acne vulgaris face patient",
        "cystic acne face", "teenage acne face photo", "adult acne face woman",
        "acne face man", "acne breakout face real photo", "severe acne face",
        "mild acne face", "acne face before treatment", "acne scarring face",
        "acne forehead cheeks", "hormonal acne face", "acne face dermatology",
        "pustular acne face", "acne face no makeup", "chin acne face",
        "back to camera acne face", "face pimples real person",
        "ansiktsakne foto", "acne visage photo", "Akne Gesicht Foto",
    ],
    "dermatitis": [
        "dermatitis face photo", "facial dermatitis close up", "atopic dermatitis face",
        "seborrheic dermatitis face", "contact dermatitis face", "perioral dermatitis face photo",
        "dermatitis face patient", "dermatitis cheeks forehead", "dermatitis face red patches",
        "dermatitis face flaky skin", "face dermatitis eczema", "dermatitis around mouth face",
        "dermatitis face woman", "dermatitis face man", "dermatitis face child",
        "facial dermatitis rash", "dermatitis face treatment before after",
        "ansiktsdermatit foto", "dermatite visage photo", "Dermatitis Gesicht",
    ],
    "dryness": [
        "dry skin face photo", "dry face skin close up", "dehydrated skin face",
        "dry flaky skin face", "xerosis face photo", "dry patches face skin",
        "dry skin face woman", "dry skin face man", "dry skin face winter",
        "extremely dry face skin", "dry cracked skin face", "dry skin face peeling",
        "dry face no makeup", "dehydrated face skin texture",
        "torr hud ansikte", "peau seche visage", "trockene Haut Gesicht",
    ],
    "eczema": [
        "eczema face photo", "facial eczema close up", "eczema face adult",
        "eczema face child photo", "atopic eczema face", "eczema cheeks photo",
        "eczema around eyes face", "eczema forehead photo", "eczema face flare up",
        "eczema face red inflamed", "eczema face dry patches", "eczema face treatment",
        "facial eczema patient", "eczema face real photo",
        "eksem ansikte foto", "eczema visage photo", "Ekzem Gesicht",
    ],
    "hyperpigmentation": [
        "hyperpigmentation face photo", "melasma face photo", "dark spots face close up",
        "facial hyperpigmentation", "melasma cheeks forehead", "sun spots face photo",
        "post inflammatory hyperpigmentation face", "PIH face photo",
        "uneven skin tone face", "dark patches face", "melasma woman face",
        "melasma face before after", "hyperpigmentation face dark skin",
        "hyperpigmentation face treatment", "age spots face photo",
        "hyperpigmentering ansikte", "hyperpigmentation visage", "Hyperpigmentierung Gesicht",
    ],
    "psoriasis": [
        "psoriasis face photo", "facial psoriasis close up", "psoriasis forehead photo",
        "psoriasis face patient", "psoriasis scalp face", "psoriasis cheeks nose",
        "psoriasis face red plaques", "psoriasis around nose eyes",
        "psoriasis eyebrows face", "psoriasis face flare",
        "psoriasis ansikte foto", "psoriasis visage photo", "Psoriasis Gesicht",
    ],
    "rosacea": [
        "rosacea face photo", "facial rosacea close up", "rosacea cheeks nose photo",
        "rosacea face woman", "rosacea face man", "rosacea redness face",
        "papulopustular rosacea face", "erythematotelangiectatic rosacea face",
        "rosacea face before after", "mild rosacea face photo", "severe rosacea face",
        "rosacea nose face close up", "rosacea face flushing",
        "rosacea face real person", "ocular rosacea face",
        "rosacea ansikte foto", "rosacee visage photo", "Rosacea Gesicht",
    ],
    "sun_damage": [
        "sun damaged face photo", "sun damage face skin", "photoaging face close up",
        "sun damaged skin face woman", "sun damaged skin face man",
        "sun spots face photo", "actinic keratosis face", "solar elastosis face",
        "photodamage face wrinkles", "UV damage face photo", "sun damage face freckles",
        "sun damage face age spots", "sun damaged face before after",
        "solskadad hud ansikte", "dommages solaires visage", "Sonnenschaden Gesicht",
    ],
    "normal": [
        "clear skin face portrait", "healthy skin face no makeup",
        "normal skin face close up", "natural face portrait photograph",
        "clear complexion face photo", "bare face no filter",
        "face portrait natural light", "human face portrait diverse",
        "face portrait young woman no makeup", "face portrait young man natural",
        "face portrait middle aged woman", "face portrait middle aged man",
        "face portrait elderly woman", "face portrait elderly man",
        "face portrait asian woman", "face portrait african woman",
        "face portrait hispanic woman", "face portrait nordic woman",
        "headshot natural skin", "portrait face outdoor light",
        "passport photo face", "face portrait documentary photography",
        "natural beauty face real", "face portrait studio lighting",
        "face portrait freckles natural", "face close up skin texture normal",
        "face portrait indian woman", "face portrait black man natural",
        "street portrait face", "face photograph editorial",
        "naturligt ansikte portratt", "visage portrait naturel", "Gesicht Portrait natuerlich",
    ],
}

# ── Main ────────────────────────────────────────────────────
def scrape_class(cls: str):
    target = target_for(cls)
    start = count_images(cls)
    terms = SEARCH_TERMS.get(cls, [])
    print(f"\n{'='*50}")
    print(f"  [{cls}] {start}/{target} — {len(terms)} search terms")
    print(f"{'='*50}")

    total = 0

    for i, term in enumerate(terms):
        if is_full(cls):
            print(f"    FULL!")
            break

        current = count_images(cls)
        print(f"  [{i+1}/{len(terms)}] \"{term}\" (at {current}/{target})")

        s1 = search_ddg(term, cls, max_results=250)
        print(f"    DDG: +{s1}", end="", flush=True)

        s2 = 0
        if not is_full(cls):
            s2 = search_wikimedia(term, cls, max_results=200)
            print(f"  Wiki: +{s2}", end="", flush=True)

        s3 = 0
        if not is_full(cls):
            s3 = search_openi(term, cls, max_results=100)
            print(f"  Open-i: +{s3}", end="", flush=True)

        s4 = 0
        if not is_full(cls):
            s4 = search_flickr(term, cls, max_pages=2)
            print(f"  Flickr: +{s4}", end="", flush=True)

        batch = s1 + s2 + s3 + s4
        total += batch
        print(f"  => +{batch} (now: {count_images(cls)}/{target})")

        time.sleep(1.5)

    final = count_images(cls)
    print(f"\n  [{cls}] FINISHED: {start} -> {final} (+{final - start})")


def main():
    print("=" * 60)
    print("  WEB FACE SCRAPER v4")
    print("  DuckDuckGo + Wikimedia + Open-i")
    print("  DNN face detection on every image")
    print("=" * 60)

    print("\n  Starting counts:")
    all_cls = list(SEARCH_TERMS.keys())
    for cls in all_cls:
        t = target_for(cls)
        c = count_images(cls)
        print(f"    {cls:24s} {c:5d} / {t}")

    for cls in all_cls:
        if is_full(cls):
            print(f"\n  [{cls}] Already full")
            continue
        scrape_class(cls)

    print(f"\n{'='*60}")
    print("  FINAL RESULTS:")
    total = 0
    for cls in all_cls:
        t = target_for(cls)
        c = count_images(cls)
        total += c
        pct = c / t * 100
        bar = "#" * int(pct / 2.5) + " " * (40 - int(pct / 2.5))
        print(f"    {cls:24s} {c:5d} / {t:5d}  [{bar}] {pct:.0f}%")
    print(f"    {'TOTAL':24s} {total:5d}")
    print(f"{'='*60}")


if __name__ == "__main__":
    main()
