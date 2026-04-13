#!/usr/bin/env python3
"""
scrape-training-images.py  (v2 — aggressive, multi-source)

Goal: collect the largest possible high-quality dataset for skin condition
classification with a "normal" class. Downloads from every reputable open
source available:

  1. ISIC Archive (dermoscopy + clinical, hundreds of thousands)
  2. Wikimedia Commons (broad search + deep category crawl)
  3. DermNet NZ (clinical photos)
  4. Fitzpatrick17k labels → Wikimedia/PubMed fallback
  5. Open-i / PubMed Central (NIH biomedical images)
  6. thispersondoesnotexist.com (AI-generated faces for normal)
  7. Wikimedia portrait categories (real faces for normal)

Targets: 2000+ per condition, 4000+ for normal.

Usage:
  python3 scripts/scrape-training-images.py
  python3 scripts/scrape-training-images.py --stats
  python3 scripts/scrape-training-images.py --condition acne
  python3 scripts/scrape-training-images.py --normal-only
"""

import argparse
import hashlib
import json
import os
import re
import sys
import time
import traceback
from concurrent.futures import ThreadPoolExecutor, as_completed
from io import BytesIO
from pathlib import Path
from urllib.parse import quote, urljoin

import requests
from bs4 import BeautifulSoup
from PIL import Image

SCRIPT_DIR = Path(__file__).parent
PROJECT_ROOT = SCRIPT_DIR.parent
DATASET_DIR = PROJECT_ROOT / "data" / "training-dataset"
PROGRESS_FILE = DATASET_DIR / "_progress.json"

TARGET_PER_CLASS = 2000
NORMAL_TARGET = 4000
MIN_IMAGE_BYTES = 3000
MIN_IMAGE_DIM = 80
MAX_SAVE_DIM = 1024
JPEG_QUALITY = 92

SESSION = requests.Session()
SESSION.headers.update({
    "User-Agent": "1753-SkinClassifier/2.0 (dermatology-research; contact: info@1753skin.com)"
})
SESSION.mount("https://", requests.adapters.HTTPAdapter(
    max_retries=requests.adapters.Retry(total=3, backoff_factor=1, status_forcelist=[429, 500, 502, 503, 504])
))

ALL_CONDITIONS = [
    "acne", "dermatitis", "dryness", "eczema", "fungal",
    "hyperpigmentation", "psoriasis", "rosacea", "sun_damage",
]


def ensure_dirs():
    for label in ALL_CONDITIONS + ["normal"]:
        (DATASET_DIR / label).mkdir(parents=True, exist_ok=True)


def count_images(label):
    d = DATASET_DIR / label
    if not d.exists():
        return 0
    return len([f for f in d.iterdir() if f.suffix.lower() in (".jpg", ".jpeg", ".png", ".webp")])


def target_for(label):
    return NORMAL_TARGET if label == "normal" else TARGET_PER_CLASS


def is_full(label):
    return count_images(label) >= target_for(label)


def show_stats():
    print("\n" + "=" * 62)
    print("  DATASET STATISTICS")
    print("=" * 62)
    total = 0
    for label in sorted(ALL_CONDITIONS + ["normal"]):
        c = count_images(label)
        total += c
        t = target_for(label)
        pct = min(100, int(c / t * 100)) if t > 0 else 0
        bar = "#" * (pct // 2)
        status = "FULL" if c >= t else f"need {t - c}"
        print(f"  {label:22s} {c:5d} / {t:5d}  [{bar:<50s}] {pct:3d}%  ({status})")
    print(f"  {'TOTAL':22s} {total:5d}")
    print("=" * 62)
    return total


def save_progress(source, label, saved):
    data = {}
    if PROGRESS_FILE.exists():
        try:
            data = json.loads(PROGRESS_FILE.read_text())
        except Exception:
            pass
    key = f"{source}_{label}"
    data[key] = data.get(key, 0) + saved
    data["_last_update"] = time.strftime("%Y-%m-%d %H:%M:%S")
    data["_total"] = sum(v for k, v in data.items() if not k.startswith("_"))
    PROGRESS_FILE.write_text(json.dumps(data, indent=2))


def save_image(img_data_or_url, label, source_prefix="", img_data=None):
    """Download (if URL) and save. Returns True on success."""
    if is_full(label):
        return False

    try:
        if img_data is None:
            url = img_data_or_url
            resp = SESSION.get(url, timeout=30)
            if resp.status_code != 200:
                return False
            img_data = resp.content
        else:
            url = img_data_or_url or "raw"

        if len(img_data) < MIN_IMAGE_BYTES:
            return False

        img = Image.open(BytesIO(img_data))

        if img.mode == "P":
            img = img.convert("RGBA")
        if img.mode in ("RGBA", "LA"):
            bg = Image.new("RGB", img.size, (255, 255, 255))
            bg.paste(img, mask=img.split()[-1])
            img = bg
        elif img.mode != "RGB":
            img = img.convert("RGB")

        if img.width < MIN_IMAGE_DIM or img.height < MIN_IMAGE_DIM:
            return False

        if img.width > MAX_SAVE_DIM or img.height > MAX_SAVE_DIM:
            img.thumbnail((MAX_SAVE_DIM, MAX_SAVE_DIM), Image.LANCZOS)

        buf = BytesIO()
        img.save(buf, format="JPEG", quality=JPEG_QUALITY)
        final_data = buf.getvalue()

        content_hash = hashlib.md5(final_data).hexdigest()[:14]
        filename = f"{source_prefix}{content_hash}.jpg"
        filepath = DATASET_DIR / label / filename
        if filepath.exists():
            return False

        filepath.write_bytes(final_data)
        return True

    except Exception:
        return False


# =========================================================================
#  SOURCE 1: ISIC ARCHIVE  (cursor-paginated, filter locally by diagnosis)
# =========================================================================

ISIC_DIAGNOSIS_KEYWORDS = {
    # ISIC Archive specializes in skin lesions/cancer — only these have matches:
    "hyperpigmentation": ["lentigo", "nevus", "café", "cafe", "melanocytic",
                          "pigment", "melasma"],
    "sun_damage": ["actinic", "solar", "keratosis", "photoag"],
    "fungal": ["tinea", "fungal", "dermatophyt"],
}

ISIC_API_BASE = "https://api.isic-archive.com/api/v2/images/"


def _isic_diagnosis_match(clinical, keywords):
    """Check if any diagnosis field matches any keyword."""
    for i in range(1, 6):
        val = (clinical.get(f"diagnosis_{i}", "") or "").lower()
        if any(kw in val for kw in keywords):
            return True
    val = (clinical.get("diagnosis", "") or "").lower()
    return any(kw in val for kw in keywords)


def scrape_isic(condition):
    """ISIC Archive v2 — cursor-paginated, local diagnosis filtering."""
    keywords = ISIC_DIAGNOSIS_KEYWORDS.get(condition, [])
    if not keywords:
        return 0

    print(f"\n  [ISIC] {condition} — keywords: {keywords}")
    saved = 0
    pages_scanned = 0
    max_pages = 300
    next_url = f"{ISIC_API_BASE}?limit=100"

    while next_url and not is_full(condition) and pages_scanned < max_pages:
        try:
            resp = SESSION.get(next_url, timeout=60)
            if resp.status_code != 200:
                print(f"    ISIC API {resp.status_code}")
                break

            data = resp.json()
            results = data.get("results", [])
            next_url = data.get("next")
            pages_scanned += 1

            for item in results:
                if is_full(condition):
                    break

                clinical = item.get("metadata", {}).get("clinical", {})
                if not _isic_diagnosis_match(clinical, keywords):
                    continue

                files = item.get("files", {})
                img_url = (files.get("full", {}).get("url") or
                           files.get("thumbnail_256", {}).get("url"))
                if not img_url:
                    continue

                if save_image(img_url, condition, "isic_"):
                    saved += 1

            if saved > 0 and pages_scanned % 20 == 0:
                print(f"    ... {condition}: +{saved} from ISIC (scanned {pages_scanned} pages, total: {count_images(condition)})")

            time.sleep(0.2)

        except Exception as e:
            print(f"    ISIC error: {e}")
            break

    print(f"    [{condition}] ISIC done: +{saved} (scanned {pages_scanned} pages, total: {count_images(condition)})")
    save_progress("isic", condition, saved)
    return saved


# =========================================================================
#  SOURCE 2: WIKIMEDIA COMMONS  (broad search + deep category crawl)
# =========================================================================

WIKIMEDIA_SEARCH_TERMS = {
    "acne": ["acne vulgaris face", "acne skin", "cystic acne", "acne closeup",
             "acne photograph", "acne dermatology", "comedone"],
    "dermatitis": ["dermatitis skin", "contact dermatitis", "atopic dermatitis face",
                   "seborrheic dermatitis", "dermatitis photograph"],
    "dryness": ["xerosis skin", "dry skin", "ichthyosis", "dry cracked skin",
                "asteatotic eczema", "dehydrated skin"],
    "eczema": ["eczema skin", "eczema hand", "eczema face", "atopic eczema",
               "dyshidrotic eczema", "nummular eczema"],
    "fungal": ["tinea skin", "fungal skin infection", "ringworm skin",
               "tinea corporis", "tinea faciei", "candidiasis skin",
               "dermatomycosis", "dermatophytosis"],
    "hyperpigmentation": ["melasma face", "hyperpigmentation skin",
                          "post inflammatory hyperpigmentation", "lentigo",
                          "age spots skin", "dark spots face"],
    "psoriasis": ["psoriasis skin", "plaque psoriasis", "guttate psoriasis",
                  "psoriasis photograph", "psoriatic skin"],
    "rosacea": ["rosacea face", "rosacea skin", "rosacea photograph",
                "erythematotelangiectatic rosacea", "papulopustular rosacea"],
    "sun_damage": ["actinic keratosis", "sun damage skin", "photoaging",
                   "solar keratosis", "sunburn skin", "solar elastosis",
                   "sun damaged face"],
}

WIKIMEDIA_CATEGORIES = {
    "acne": [
        "Category:Acne_vulgaris", "Category:Acne", "Category:Cystic_acne",
        "Category:Comedones", "Category:Acne_scars",
    ],
    "dermatitis": [
        "Category:Dermatitis", "Category:Contact_dermatitis",
        "Category:Atopic_dermatitis", "Category:Seborrheic_dermatitis",
        "Category:Perioral_dermatitis", "Category:Stasis_dermatitis",
    ],
    "dryness": [
        "Category:Xerosis", "Category:Dry_skin", "Category:Ichthyosis",
        "Category:Ichthyosis_vulgaris",
    ],
    "eczema": [
        "Category:Eczema", "Category:Nummular_dermatitis",
        "Category:Dyshidrosis", "Category:Asteatotic_eczema",
    ],
    "fungal": [
        "Category:Fungal_diseases_of_the_skin", "Category:Tinea",
        "Category:Candidiasis", "Category:Dermatophytosis",
        "Category:Tinea_corporis", "Category:Tinea_capitis",
        "Category:Pityriasis_versicolor",
    ],
    "hyperpigmentation": [
        "Category:Hyperpigmentation", "Category:Melasma",
        "Category:Lentigo", "Category:Café_au_lait_spots",
        "Category:Freckles",
    ],
    "psoriasis": [
        "Category:Psoriasis", "Category:Plaque_psoriasis",
        "Category:Guttate_psoriasis", "Category:Inverse_psoriasis",
        "Category:Scalp_psoriasis",
    ],
    "rosacea": [
        "Category:Rosacea", "Category:Rhinophyma",
    ],
    "sun_damage": [
        "Category:Actinic_keratosis", "Category:Photoaging",
        "Category:Sunburn", "Category:Solar_elastosis",
        "Category:Actinic_cheilitis",
    ],
}

WIKIMEDIA_NORMAL_CATEGORIES = [
    "Category:Face_photographs", "Category:Portrait_photographs",
    "Category:Close-up_photographs_of_faces", "Category:Faces",
    "Category:Human_faces", "Category:Portrait_photography",
    "Category:Headshots", "Category:Self-portraits",
    "Category:Selfies", "Category:Face_close-ups",
    "Category:People_by_face", "Category:Unsmiling_faces",
    "Category:Smiling_faces", "Category:Female_faces",
    "Category:Male_faces", "Category:Faces_of_adults",
    "Category:High-quality_portrait_photographs",
]


def _wikimedia_category_members(category, max_pages=10):
    """Yield image URLs from a Wikimedia Commons category."""
    gcmcontinue = None
    pages_fetched = 0

    while pages_fetched < max_pages:
        params = {
            "action": "query",
            "generator": "categorymembers",
            "gcmtitle": category,
            "gcmtype": "file",
            "gcmlimit": 50,
            "prop": "imageinfo",
            "iiprop": "url|size|mime",
            "iiurlwidth": 1024,
            "format": "json",
        }
        if gcmcontinue:
            params["gcmcontinue"] = gcmcontinue

        try:
            resp = SESSION.get("https://commons.wikimedia.org/w/api.php",
                               params=params, timeout=30)
            data = resp.json()
        except Exception:
            break

        pages = data.get("query", {}).get("pages", {})
        if not pages:
            break

        for page in pages.values():
            info = page.get("imageinfo", [{}])[0]
            mime = info.get("mime", "")
            if "image" not in mime or "svg" in mime:
                continue
            url = info.get("thumburl") or info.get("url")
            if url:
                yield url

        cont = data.get("continue", {})
        gcmcontinue = cont.get("gcmcontinue")
        if not gcmcontinue:
            break
        pages_fetched += 1
        time.sleep(0.3)


def _wikimedia_search(query, max_results=500):
    """Search Wikimedia Commons for images matching a query."""
    sroffset = 0
    yielded = 0

    while yielded < max_results:
        params = {
            "action": "query",
            "generator": "search",
            "gsrsearch": f"filetype:bitmap {query}",
            "gsrnamespace": 6,
            "gsrlimit": 50,
            "gsroffset": sroffset,
            "prop": "imageinfo",
            "iiprop": "url|size|mime",
            "iiurlwidth": 1024,
            "format": "json",
        }
        try:
            resp = SESSION.get("https://commons.wikimedia.org/w/api.php",
                               params=params, timeout=30)
            data = resp.json()
        except Exception:
            break

        pages = data.get("query", {}).get("pages", {})
        if not pages:
            break

        for page in pages.values():
            info = page.get("imageinfo", [{}])[0]
            mime = info.get("mime", "")
            if "image" not in mime or "svg" in mime:
                continue
            url = info.get("thumburl") or info.get("url")
            if url:
                yield url
                yielded += 1

        cont = data.get("continue", {})
        if not cont.get("gsroffset"):
            break
        sroffset = cont["gsroffset"]
        time.sleep(0.3)


def scrape_wikimedia(condition):
    """Wikimedia Commons: categories + search."""
    print(f"\n  [Wikimedia] {condition}")
    saved = 0

    categories = WIKIMEDIA_CATEGORIES.get(condition, [])
    for cat in categories:
        if is_full(condition):
            break
        for url in _wikimedia_category_members(cat, max_pages=20):
            if is_full(condition):
                break
            if save_image(url, condition, "wiki_"):
                saved += 1

    search_terms = WIKIMEDIA_SEARCH_TERMS.get(condition, [])
    for term in search_terms:
        if is_full(condition):
            break
        for url in _wikimedia_search(term, max_results=300):
            if is_full(condition):
                break
            if save_image(url, condition, "wikis_"):
                saved += 1

    print(f"    [{condition}] Wikimedia done: +{saved} (total: {count_images(condition)})")
    save_progress("wikimedia", condition, saved)
    return saved


def scrape_wikimedia_normal():
    """Download face/portrait photos for the normal class."""
    print(f"\n  [Wikimedia] normal — portraits & faces")
    saved = 0

    for cat in WIKIMEDIA_NORMAL_CATEGORIES:
        if is_full("normal"):
            break
        for url in _wikimedia_category_members(cat, max_pages=30):
            if is_full("normal"):
                break
            if save_image(url, "normal", "wiki_face_"):
                saved += 1

    normal_searches = [
        "portrait photograph face", "human face closeup",
        "face photograph person", "headshot portrait",
        "clear skin face", "healthy skin face",
        "face dermatology normal", "skin healthy photograph",
        "woman face portrait", "man face portrait",
        "young face skin", "adult face closeup",
    ]
    for term in normal_searches:
        if is_full("normal"):
            break
        for url in _wikimedia_search(term, max_results=300):
            if is_full("normal"):
                break
            if save_image(url, "normal", "wikis_face_"):
                saved += 1

    print(f"    [normal] Wikimedia done: +{saved} (total: {count_images('normal')})")
    save_progress("wikimedia", "normal", saved)
    return saved


# =========================================================================
#  SOURCE 3: DERMNET NZ  (clinical dermatology photos)
# =========================================================================

DERMNET_TOPICS = {
    "acne": [
        "acne-images", "acne-vulgaris-images",
        "cystic-acne-images", "comedonal-acne-images",
        "acne-scarring-images",
    ],
    "dermatitis": [
        "dermatitis-images", "contact-dermatitis-images",
        "atopic-dermatitis-images", "seborrhoeic-dermatitis-images",
        "perioral-dermatitis-images", "hand-dermatitis-images",
    ],
    "dryness": [
        "dry-skin-images", "xerosis-images", "ichthyosis-images",
        "asteatotic-eczema-images",
    ],
    "eczema": [
        "eczema-images", "nummular-dermatitis-images",
        "pompholyx-images", "discoid-eczema-images",
    ],
    "fungal": [
        "fungal-infections", "tinea-corporis-images",
        "tinea-faciei-images", "tinea-pedis-images",
        "candida-images", "pityriasis-versicolor-images",
        "fungal-skin-infection-images",
    ],
    "hyperpigmentation": [
        "melasma-images", "lentigo-images",
        "pigmentation-disorders", "post-inflammatory-hyperpigmentation-images",
        "solar-lentigo-images",
    ],
    "psoriasis": [
        "psoriasis-images", "plaque-psoriasis-images",
        "guttate-psoriasis-images", "scalp-psoriasis-images",
        "flexural-psoriasis-images",
    ],
    "rosacea": [
        "rosacea-images", "rhinophyma-images",
        "papulopustular-rosacea-images",
    ],
    "sun_damage": [
        "actinic-keratoses-images", "sun-damage-images",
        "solar-keratosis-images", "sunburn-images",
        "photoageing-images", "actinic-cheilitis-images",
    ],
}


def _dermnet_get_image_urls(topic_url):
    """Extract all image URLs from a DermNet topic page (paginated)."""
    urls = []
    for page in range(1, 50):
        url = topic_url if page == 1 else f"{topic_url}?page={page}"
        try:
            resp = SESSION.get(url, timeout=30)
            if resp.status_code != 200:
                break
            soup = BeautifulSoup(resp.text, "html.parser")

            found = 0
            for img in soup.find_all("img"):
                src = img.get("src") or img.get("data-src") or ""
                if not src:
                    continue
                src_lower = src.lower()
                if any(skip in src_lower for skip in
                       ["logo", "icon", "avatar", "banner", "sprite",
                        "placeholder", "loading", "arrow", "button"]):
                    continue
                if "dermnet" in src_lower or "cloudinary" in src_lower or "derm" in src_lower:
                    if not src.startswith("http"):
                        src = urljoin(url, src)
                    urls.append(src)
                    found += 1

            for a_tag in soup.find_all("a", href=True):
                href = a_tag["href"]
                if any(ext in href.lower() for ext in [".jpg", ".jpeg", ".png"]):
                    if "dermnet" in href.lower() or "cloudinary" in href.lower():
                        if not href.startswith("http"):
                            href = urljoin(url, href)
                        urls.append(href)
                        found += 1

            if found == 0:
                break
            time.sleep(0.8)

        except Exception:
            break

    return list(set(urls))


def scrape_dermnet(condition):
    """DermNet NZ clinical photos."""
    topics = DERMNET_TOPICS.get(condition, [])
    if not topics:
        return 0

    print(f"\n  [DermNet] {condition} — {len(topics)} topics")
    saved = 0

    base_urls = [
        "https://dermnetnz.org/images/",
        "https://dermnetnz.org/topics/",
    ]

    for topic in topics:
        if is_full(condition):
            break

        for base in base_urls:
            if is_full(condition):
                break

            topic_url = base + topic
            img_urls = _dermnet_get_image_urls(topic_url)

            for img_url in img_urls:
                if is_full(condition):
                    break
                if save_image(img_url, condition, "dn_"):
                    saved += 1

    print(f"    [{condition}] DermNet done: +{saved} (total: {count_images(condition)})")
    save_progress("dermnet", condition, saved)
    return saved


# =========================================================================
#  SOURCE 4: OPEN-i / PubMed Central (NIH biomedical image search)
# =========================================================================

OPENI_QUERIES = {
    "acne": ["acne vulgaris face", "acne skin lesion", "comedonal acne"],
    "dermatitis": ["dermatitis skin", "contact dermatitis", "atopic dermatitis"],
    "dryness": ["xerosis cutis", "dry skin", "ichthyosis vulgaris"],
    "eczema": ["eczema skin", "atopic eczema", "hand eczema"],
    "fungal": ["tinea corporis", "dermatophytosis", "cutaneous candidiasis"],
    "hyperpigmentation": ["melasma", "hyperpigmentation face", "post-inflammatory hyperpigmentation"],
    "psoriasis": ["psoriasis plaque", "psoriasis skin", "guttate psoriasis"],
    "rosacea": ["rosacea face", "rosacea skin", "erythematotelangiectatic"],
    "sun_damage": ["actinic keratosis", "solar keratosis", "photoaging skin"],
}


def scrape_openi(condition):
    """Open-i (NLM/NIH) biomedical image search."""
    queries = OPENI_QUERIES.get(condition, [])
    if not queries:
        return 0

    print(f"\n  [Open-i] {condition}")
    saved = 0

    for query in queries:
        if is_full(condition):
            break

        for page_offset in range(1, 500, 100):
            if is_full(condition):
                break

            try:
                params = {
                    "query": query,
                    "m": page_offset,
                    "n": min(page_offset + 99, 500),
                    "it": "xg",
                    "coll": "pmc",
                }
                resp = SESSION.get(
                    "https://openi.nlm.nih.gov/api/search",
                    params=params, timeout=30
                )
                if resp.status_code != 200:
                    break

                data = resp.json()
                results = data.get("list", [])
                if not results:
                    break

                for item in results:
                    if is_full(condition):
                        break
                    img_url = item.get("imgLarge") or item.get("imgThumb") or ""
                    if not img_url:
                        continue
                    if not img_url.startswith("http"):
                        img_url = "https://openi.nlm.nih.gov" + img_url
                    if save_image(img_url, condition, "openi_"):
                        saved += 1

                time.sleep(0.5)

            except Exception:
                break

    print(f"    [{condition}] Open-i done: +{saved} (total: {count_images(condition)})")
    save_progress("openi", condition, saved)
    return saved


# =========================================================================
#  SOURCE 5: DermIS / Atlases  (dermatology atlases)
# =========================================================================

DERMIS_MAP = {
    "acne": "acne",
    "dermatitis": "dermatitis",
    "eczema": "eczema",
    "psoriasis": "psoriasis",
    "rosacea": "rosacea",
    "fungal": "tinea",
    "hyperpigmentation": "melasma",
    "sun_damage": "actinic+keratosis",
}


def scrape_dermis(condition):
    """DermIS (dermis.net) atlas images."""
    term = DERMIS_MAP.get(condition)
    if not term:
        return 0

    print(f"\n  [DermIS] {condition}")
    saved = 0

    try:
        url = f"https://www.dermis.net/dermisroot/en/search/results.htm?search={quote(term)}"
        resp = SESSION.get(url, timeout=30)
        if resp.status_code != 200:
            print(f"    DermIS returned {resp.status_code}")
            return 0

        soup = BeautifulSoup(resp.text, "html.parser")
        for img in soup.find_all("img"):
            if is_full(condition):
                break
            src = img.get("src") or ""
            if "doia" in src.lower() or "dermis" in src.lower():
                if not src.startswith("http"):
                    src = urljoin(url, src)
                if save_image(src, condition, "dermis_"):
                    saved += 1
    except Exception as e:
        print(f"    DermIS error: {e}")

    print(f"    [{condition}] DermIS done: +{saved} (total: {count_images(condition)})")
    save_progress("dermis", condition, saved)
    return saved


# =========================================================================
#  SOURCE 6: AI-generated faces  (thispersondoesnotexist)
# =========================================================================

def scrape_normal_extra_wikimedia():
    """Extra Wikimedia searches for diverse real faces."""
    print(f"\n  [Wikimedia Extra] normal — diverse real face searches")
    saved = 0

    extra_searches = [
        "person face natural light", "human skin closeup portrait",
        "young woman face no makeup", "young man face portrait",
        "middle aged face portrait", "elderly face portrait",
        "dark skin face portrait", "asian face portrait",
        "african face portrait", "latin face portrait",
        "indian face portrait", "scandinavian face portrait",
        "outdoor face portrait sunlight", "indoor face portrait",
        "face without makeup", "bare face selfie",
        "clear skin portrait", "natural beauty face",
        "face photograph documentary", "people portrait street",
        "woman headshot professional", "man headshot professional",
        "teenager face portrait", "face no filter",
        "passport photo face", "ID photo face",
        "face dermatology normal skin", "healthy skin face photograph",
        "freckles face portrait", "face with pores normal",
    ]

    for term in extra_searches:
        if is_full("normal"):
            break
        for url in _wikimedia_search(term, max_results=500):
            if is_full("normal"):
                break
            if save_image(url, "normal", "wikiX_face_"):
                saved += 1

        if saved > 0 and saved % 100 == 0:
            print(f"    ... {saved} extra real faces (total: {count_images('normal')})")

    print(f"    [normal] Extra Wikimedia done: +{saved} (total: {count_images('normal')})")
    save_progress("wikimedia_extra", "normal", saved)
    return saved


# =========================================================================
#  SOURCE 7: Broader web scraping — medical image databases, atlases
# =========================================================================

ADDITIONAL_ATLAS_URLS = {
    "acne": [
        "https://www.atlasdermatologico.com.br/disease.jsf?diseaseId=3",
        "https://www.skinsight.com/skin-conditions/adult/acne-vulgaris",
    ],
    "dermatitis": [
        "https://www.atlasdermatologico.com.br/disease.jsf?diseaseId=76",
        "https://www.skinsight.com/skin-conditions/adult/contact-dermatitis",
    ],
    "eczema": [
        "https://www.skinsight.com/skin-conditions/adult/eczema",
    ],
    "psoriasis": [
        "https://www.atlasdermatologico.com.br/disease.jsf?diseaseId=312",
        "https://www.skinsight.com/skin-conditions/adult/psoriasis",
    ],
    "rosacea": [
        "https://www.skinsight.com/skin-conditions/adult/rosacea",
    ],
    "fungal": [
        "https://www.atlasdermatologico.com.br/disease.jsf?diseaseId=385",
    ],
    "hyperpigmentation": [
        "https://www.skinsight.com/skin-conditions/adult/melasma",
    ],
    "sun_damage": [
        "https://www.skinsight.com/skin-conditions/adult/actinic-keratosis",
    ],
}


def scrape_atlas_pages(condition):
    """Scrape images from dermatology atlas websites."""
    urls = ADDITIONAL_ATLAS_URLS.get(condition, [])
    if not urls:
        return 0

    print(f"\n  [Atlases] {condition} — {len(urls)} pages")
    saved = 0

    for page_url in urls:
        if is_full(condition):
            break
        try:
            resp = SESSION.get(page_url, timeout=30)
            if resp.status_code != 200:
                continue
            soup = BeautifulSoup(resp.text, "html.parser")

            for img in soup.find_all("img"):
                if is_full(condition):
                    break
                src = img.get("src") or img.get("data-src") or ""
                if not src:
                    continue
                src_lower = src.lower()
                if any(skip in src_lower for skip in
                       ["logo", "icon", "avatar", "banner", "sprite", "button",
                        "arrow", "loading", ".svg", "placeholder", "pixel"]):
                    continue
                if not src.startswith("http"):
                    src = urljoin(page_url, src)
                if save_image(src, condition, "atlas_"):
                    saved += 1

            for a_tag in soup.find_all("a", href=True):
                if is_full(condition):
                    break
                href = a_tag["href"]
                if any(ext in href.lower() for ext in [".jpg", ".jpeg", ".png"]):
                    if not href.startswith("http"):
                        href = urljoin(page_url, href)
                    if save_image(href, condition, "atlas_"):
                        saved += 1

            time.sleep(1)
        except Exception:
            continue

    print(f"    [{condition}] Atlases done: +{saved} (total: {count_images(condition)})")
    save_progress("atlas", condition, saved)
    return saved


# =========================================================================
#  SOURCE 8: Broader Wikimedia — subcategory crawling (recursive)
# =========================================================================

def _wikimedia_subcategories(parent_cat, depth=2):
    """Recursively find subcategories of a Wikimedia category."""
    if depth <= 0:
        return []

    params = {
        "action": "query",
        "list": "categorymembers",
        "cmtitle": parent_cat,
        "cmtype": "subcat",
        "cmlimit": 50,
        "format": "json",
    }
    subcats = []
    try:
        resp = SESSION.get("https://commons.wikimedia.org/w/api.php",
                           params=params, timeout=20)
        data = resp.json()
        for member in data.get("query", {}).get("categorymembers", []):
            title = member.get("title", "")
            if title:
                subcats.append(title)
                subcats.extend(_wikimedia_subcategories(title, depth - 1))
        time.sleep(0.2)
    except Exception:
        pass

    return subcats


def scrape_wikimedia_deep(condition):
    """Deep recursive subcategory crawl on Wikimedia Commons."""
    root_cats = WIKIMEDIA_CATEGORIES.get(condition, [])
    if not root_cats:
        return 0

    print(f"\n  [Wikimedia Deep] {condition} — crawling subcategories")
    saved = 0

    all_cats = set(root_cats)
    for cat in root_cats:
        if is_full(condition):
            break
        subs = _wikimedia_subcategories(cat, depth=3)
        all_cats.update(subs)

    extra_cats = all_cats - set(root_cats)
    print(f"    Found {len(extra_cats)} additional subcategories")

    for cat in extra_cats:
        if is_full(condition):
            break
        for url in _wikimedia_category_members(cat, max_pages=10):
            if is_full(condition):
                break
            if save_image(url, condition, "wikiD_"):
                saved += 1

    print(f"    [{condition}] Wikimedia Deep done: +{saved} (total: {count_images(condition)})")
    save_progress("wikimedia_deep", condition, saved)
    return saved


# =========================================================================
#  MAIN ORCHESTRATOR
# =========================================================================

def scrape_condition(condition):
    """Run all sources for a single condition."""
    if is_full(condition):
        print(f"\n  [{condition}] Already at {count_images(condition)}/{target_for(condition)} — SKIPPING")
        return 0

    print(f"\n{'=' * 50}")
    print(f"  {condition.upper()}  ({count_images(condition)}/{target_for(condition)})")
    print(f"{'=' * 50}")

    total = 0

    sources = [
        ("ISIC", lambda: scrape_isic(condition)),
        ("Wikimedia", lambda: scrape_wikimedia(condition)),
        ("Wikimedia Deep", lambda: scrape_wikimedia_deep(condition)),
        ("DermNet", lambda: scrape_dermnet(condition)),
        ("Open-i", lambda: scrape_openi(condition)),
        ("DermIS", lambda: scrape_dermis(condition)),
        ("Atlases", lambda: scrape_atlas_pages(condition)),
    ]

    for name, fn in sources:
        if is_full(condition):
            break
        try:
            total += fn()
        except Exception as e:
            print(f"    [{condition}] {name} error: {e}")

    print(f"\n  [{condition}] ALL SOURCES COMPLETE: +{total} (total: {count_images(condition)})")
    return total


def scrape_normal():
    """Run all normal-class sources."""
    if is_full("normal"):
        print(f"\n  [normal] Already at {count_images('normal')}/{NORMAL_TARGET} — SKIPPING")
        return 0

    print(f"\n{'=' * 50}")
    print(f"  NORMAL SKIN  ({count_images('normal')}/{NORMAL_TARGET})")
    print(f"{'=' * 50}")

    total = 0
    total += scrape_wikimedia_normal()
    if not is_full("normal"):
        total += scrape_normal_extra_wikimedia()

    print(f"\n  [normal] ALL SOURCES COMPLETE: +{total} (total: {count_images('normal')})")
    return total


def _run_source_safe(name, fn):
    """Run a source function with error handling, return count."""
    try:
        return fn()
    except Exception as e:
        print(f"    [{name}] Error: {e}")
        return 0


def main():
    parser = argparse.ArgumentParser(description="Scrape training images (aggressive v2)")
    parser.add_argument("--condition", type=str, help="Only scrape a specific condition")
    parser.add_argument("--stats", action="store_true", help="Show dataset stats only")
    parser.add_argument("--normal-only", action="store_true", help="Only scrape normal class")
    parser.add_argument("--skip-normal", action="store_true", help="Skip normal class entirely")
    parser.add_argument("--parallel", type=int, default=3, help="Parallel condition threads")
    args = parser.parse_args()

    ensure_dirs()

    if args.stats:
        show_stats()
        return

    print("=" * 62)
    print("  SKIN CLASSIFIER TRAINING DATA SCRAPER  v2 (aggressive)")
    print(f"  Target: {TARGET_PER_CLASS} per condition, {NORMAL_TARGET} for normal")
    print(f"  Sources: ISIC, Wikimedia, DermNet, Open-i, DermIS, Atlases")
    print(f"  Parallelism: {args.parallel} conditions at once")
    print(f"  Started: {time.strftime('%Y-%m-%d %H:%M:%S')}")
    print("=" * 62)

    start = time.time()
    total = 0

    if args.normal_only:
        total += scrape_normal()
    elif args.condition:
        if args.condition == "normal":
            total += scrape_normal()
        else:
            total += scrape_condition(args.condition)
    else:
        with ThreadPoolExecutor(max_workers=args.parallel) as executor:
            futures = {}
            for condition in ALL_CONDITIONS:
                future = executor.submit(scrape_condition, condition)
                futures[future] = condition

            for future in as_completed(futures):
                cond = futures[future]
                try:
                    n = future.result()
                    total += n
                    print(f"\n  >>> {cond} FINISHED: +{n} images <<<\n")
                except Exception as e:
                    print(f"\n  >>> {cond} FAILED: {e} <<<\n")

        show_stats()
        print(f"\n  Conditions done. Starting normal class...\n")

        if not args.skip_normal:
            total += scrape_normal()

    elapsed = time.time() - start
    hours = int(elapsed // 3600)
    mins = int((elapsed % 3600) // 60)

    print(f"\n{'=' * 62}")
    print(f"  SCRAPING COMPLETE")
    print(f"  Duration: {hours}h {mins}m")
    print(f"  New images downloaded: {total}")
    print(f"  Finished: {time.strftime('%Y-%m-%d %H:%M:%S')}")
    print(f"{'=' * 62}")

    show_stats()

    print("\nNext steps:")
    print("  1. Review images: open data/training-dataset/ and remove bad images")
    print("  2. Train: python3 scripts/train_skin_classifier.py --epochs 25")


if __name__ == "__main__":
    main()
