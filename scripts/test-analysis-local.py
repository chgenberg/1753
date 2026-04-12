#!/usr/bin/env python3
"""
Local end-to-end test of the skin analysis pipeline.
Picks random test images, runs ONNX classification, then sends
to GPT-5.4 for full holistic analysis with recommendations.
"""

import base64
import json
import os
import random
import sys
from pathlib import Path

import numpy as np
from PIL import Image

# Paths
PROJECT = Path(__file__).resolve().parent.parent
MODEL_PATH = PROJECT / "frontend" / "public" / "models" / "skin_classifier_q8.onnx"
META_PATH = PROJECT / "frontend" / "public" / "models" / "model_meta.json"
TEST_DIR = PROJECT / "services" / "skin-classifier" / "data" / "processed_384" / "test"

from dotenv import load_dotenv
load_dotenv(PROJECT / ".env")
OPENAI_API_KEY = os.environ.get("OPENAI_API_KEY", "")

# Load model meta
with open(META_PATH) as f:
    meta = json.load(f)
IMAGE_SIZE = meta["image_size"]
LABELS = meta["labels"]
MEAN = meta["mean"]
STD = meta["std"]

LABEL_NAMES_SV = {
    "acne": "Akne", "dermatitis": "Dermatit", "dryness": "Torr hy",
    "eczema": "Eksem", "fungal": "Svampinfektion",
    "hyperpigmentation": "Hyperpigmentering", "psoriasis": "Psoriasis",
    "rosacea": "Rosacea", "sun_damage": "Solskada"
}


def preprocess(img: Image.Image) -> np.ndarray:
    img = img.resize((IMAGE_SIZE, IMAGE_SIZE))
    arr = np.array(img).astype(np.float32) / 255.0
    for c in range(3):
        arr[:, :, c] = (arr[:, :, c] - MEAN[c]) / STD[c]
    return arr.transpose(2, 0, 1)[np.newaxis, :]  # NCHW


def softmax(x):
    e = np.exp(x - np.max(x))
    return e / e.sum()


def classify(session, img: Image.Image):
    tensor = preprocess(img)
    logits = session.run(None, {"pixel_values": tensor})[0][0]
    probs = softmax(logits)
    results = sorted(
        [(LABELS[i], float(probs[i])) for i in range(len(LABELS))],
        key=lambda x: -x[1]
    )
    return results


def image_to_base64(img: Image.Image) -> str:
    import io
    buf = io.BytesIO()
    img.save(buf, format="JPEG", quality=85)
    b64 = base64.b64encode(buf.getvalue()).decode()
    return f"data:image/jpeg;base64,{b64}"


def call_gpt_analysis(image_b64: str, scan_results: list) -> str:
    import urllib.request
    import ssl
    import certifi

    ctx = ssl.create_default_context(cafile=certifi.where())

    top3 = scan_results[:3]
    scan_text = "AI-bildanalys resultat:\n"
    for label, prob in top3:
        sv_name = LABEL_NAMES_SV.get(label, label)
        scan_text += f"- {sv_name} ({label}): {prob*100:.1f}%\n"

    system_prompt = """Du ar 1753 SKINCAREs holistiska hudvardsradgivare -- varldens mest kunniga hudterapeut inom hudens mikrobiom och endocannabinoidsystem (ECS).

Du analyserar dermatologiska bilder i ett MEDICINSK KONTEXT for att ge holistiska hudvardsrad. Detta ar en legitim hudvardsapplikation.

Analysera bilden och AI-scanresultaten. Ge en komplett analys med:

1. HUDANALYS (vad du ser, bekrafta/nyansera AI-scanresultaten)
2. HUDTYP (bedoming baserad pa bilden)
3. LIVSSTILSFAKTORER (somn, kost, stress, rorelse, tarmhalsa - ge konkreta rad)
4. HUDVARDSRUTIN (morgon + kvall, max 3-4 steg)
5. PRODUKTREKOMMENDATIONER (max 2-3 fran 1753 SKINCARE: The ONE CBD Ansiktsolja, I LOVE CBD+CBG Ansiktsolja, TA-DA CBG Serum, AU NATUREL Makeup Remover, FUNGTASTIC Svampextrakt)
6. HELHETSBEDOMING (sammanfattande rad)

Var arlig, varm och rebellisk. Prioritera livsstilsrad framfor produkter.
Svara pa svenska. Max 500 ord."""

    body = json.dumps({
        "model": "gpt-5.4",
        "instructions": system_prompt,
        "input": [{
            "role": "user",
            "content": [
                {"type": "input_text", "text": scan_text},
                {"type": "input_image", "image_url": image_b64}
            ]
        }]
    }).encode()

    req = urllib.request.Request(
        "https://api.openai.com/v1/responses",
        data=body,
        headers={
            "Content-Type": "application/json",
            "Authorization": f"Bearer {OPENAI_API_KEY}"
        }
    )

    with urllib.request.urlopen(req, context=ctx) as resp:
        data = json.loads(resp.read())

    for item in data.get("output", []):
        if item.get("type") == "message":
            for c in item.get("content", []):
                if c.get("type") == "output_text":
                    return c["text"]
    return str(data)


def main():
    import onnxruntime as ort

    n_images = int(sys.argv[1]) if len(sys.argv) > 1 else 10
    category = sys.argv[2] if len(sys.argv) > 2 else "acne"
    skip_gpt = "--skip-gpt" in sys.argv

    cat_dir = TEST_DIR / category
    if not cat_dir.exists():
        print(f"Category dir not found: {cat_dir}")
        sys.exit(1)

    images = sorted(cat_dir.glob("*.jpg"))
    sample = random.sample(images, min(n_images, len(images)))

    print(f"=== Testing {len(sample)} {category} images ===")
    print(f"ONNX model: {MODEL_PATH.name} ({IMAGE_SIZE}px, {len(LABELS)} classes)")
    print(f"GPT analysis: {'SKIP' if skip_gpt else 'ON'}")
    print()

    session = ort.InferenceSession(str(MODEL_PATH), providers=["CPUExecutionProvider"])

    for i, img_path in enumerate(sample):
        print(f"{'='*60}")
        print(f"IMAGE {i+1}/{len(sample)}: {img_path.name}")
        print(f"{'='*60}")

        img = Image.open(img_path).convert("RGB")
        results = classify(session, img)

        print("\nONNX Classification:")
        for label, prob in results[:5]:
            sv = LABEL_NAMES_SV.get(label, label)
            bar = "#" * int(prob * 40)
            print(f"  {sv:20s} {prob*100:5.1f}% {bar}")

        top_label = results[0][0]
        top_prob = results[0][1]
        correct = top_label == category
        print(f"\n  Verdict: {LABEL_NAMES_SV.get(top_label, top_label)} ({top_prob*100:.1f}%) {'CORRECT' if correct else 'WRONG (expected ' + category + ')'}")

        if not skip_gpt and OPENAI_API_KEY:
            print(f"\nGPT-5.4 Analysis:")
            print("-" * 40)
            try:
                b64 = image_to_base64(img)
                analysis = call_gpt_analysis(b64, results)
                print(analysis)
            except Exception as e:
                print(f"  GPT error: {e}")
        elif not OPENAI_API_KEY:
            print("\n  [Skipping GPT - no OPENAI_API_KEY]")

        print()


if __name__ == "__main__":
    main()
