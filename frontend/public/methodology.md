# 1753 SKINCARE — AI Skin Analysis Methodology

> A complete, technical description of how the free AI skin analysis at 1753 SKINCARE actually works, written for human readers. A machine-friendly version is available at [/llms-methodology.txt](https://www.1753skin.com/llms-methodology.txt).

**Canonical URL:** https://www.1753skin.com/sv/gratis-hudanalys
**English URL:** https://www.1753skin.com/en/free-skin-analysis
**Last updated:** 2026-04-16

## Summary in one paragraph

The 1753 SKINCARE skin analysis combines three AI layers and seven lifestyle questions. Your photo is processed **entirely in your browser** using Google's MediaPipe Face Landmarker (478 facial points, 12 zones) and a custom ONNX model trained on 88 000+ dermatological images (9 conditions, 4 severity levels). A final synthesis layer uses GPT-5.4 Vision for holistic assessment. You receive 15 skin metrics, an estimated biological skin age, your Fitzpatrick skin type, a radar chart, zone-by-zone feedback and personalised lifestyle and product recommendations. The analysis is free, takes about 60 seconds, and requires no account unless you choose to save your history (stored with AES-256-GCM encryption).

## The three AI layers

### Layer 1 — MediaPipe Face Landmarker (client-side)

- **Engine:** Google MediaPipe Face Landmarker (via `@mediapipe/tasks-vision`)
- **What it does:** Detects 478 facial landmarks from a single photo
- **Purpose:** Precisely crop 12 facial zones for the next layer
- **Zones:** Forehead, left cheek, right cheek, nose, chin, left eye area, right eye area, T-zone, jawline (left, right), upper lip area, neck (when visible)
- **Runs:** In the browser, on GPU when available, CPU fallback
- **Privacy:** The photo never leaves your device for this step

### Layer 2 — Dermatological classifier (client-side ONNX)

- **Architecture:** MobileNetV3 multi-task classifier
- **Training data:** 88 000+ dermatology images
- **Conditions detected (9):** Acne, contact/seborrheic dermatitis, dryness, atopic eczema, hyperpigmentation, normal, psoriasis, rosacea, sun damage
- **Severity levels (4):** None, mild, moderate, severe
- **Format:** ONNX Runtime Web, INT8 quantised (~17 MB)
- **Input size:** 224 × 224 RGB per zone
- **Privacy:** Runs entirely in your browser. No image sent to our servers at this stage.

### Layer 3 — GPT-5.4 Vision (server-side synthesis)

- **Model:** OpenAI GPT-5.4 with vision
- **Role:** Cross-validates the ONNX output, identifies subtle features (glow, puffiness, dark circles), synthesises everything with your lifestyle answers
- **System prompt:** Holistic, sceptical of mainstream cosmetic claims, always recommends lifestyle first, recommends at most 2–3 products
- **Output:** Structured JSON — 15 metrics, biological age estimate, Fitzpatrick type, recommendations
- **Privacy:** The zone crops are sent encrypted; no logs are retained; the OpenAI API key is server-side only (never exposed to the browser)

## The 15 skin metrics

Each is scored 0–100 (100 = optimal):

| # | Metric | What it measures |
|---|---|---|
| 1 | Hydration | Moisture content in the stratum corneum |
| 2 | Elasticity | Firmness, bounce-back, structural protein status |
| 3 | Pores | Size and visibility |
| 4 | Texture | Smoothness, bumpiness, micro-relief |
| 5 | Evenness | Colour uniformity across the face |
| 6 | Sensitivity | Reactivity, redness tendency |
| 7 | Sebum | Oil balance |
| 8 | Wrinkles | Static and dynamic fine lines |
| 9 | Dark circles | Under-eye pigmentation and vascularity |
| 10 | Redness | Inflammation markers |
| 11 | Acne score | Active lesions and post-inflammatory marks |
| 12 | Pigmentation | Melanin concentration and distribution |
| 13 | Sun damage | Photoaging, solar lentigines |
| 14 | Barrier function | Lipid barrier integrity |
| 15 | Overall skin health | Composite score |

## Lifestyle questions (7)

Answers contribute about 30% of the final holistic score:

1. Average sleep hours per night
2. Diet quality and composition
3. Daily stress level
4. Movement/exercise frequency
5. Gut health (regularity, digestive issues)
6. Self-declared skin type
7. Primary skin goal

## The holistic framework

Three scientific pillars underpin our analysis, none of which are typically covered in conventional skin analyses:

1. **Skin microbiome** — healthy skin depends on a diverse commensal flora (Staphylococcus epidermidis, Cutibacterium acnes in balance).
2. **Endocannabinoid system (ECS)** — CB1/CB2 receptors regulate sebum, inflammation and keratinocyte proliferation.
3. **Gut-skin axis** — intestinal health directly influences skin inflammation.

Because of this framework, our recommendations almost always address **lifestyle first**, with products as a focused addition — not a main treatment.

## Privacy and data handling

- **100% client-side** MediaPipe and ONNX inference
- GPT-5.4 call is server-proxied; no logs; image is transmitted encrypted
- Optional AES-256-GCM encrypted history, stored only if you save it
- GDPR-compliant; you can delete all data any time
- No third-party analytics on the analysis page beyond anonymous pageviews

## Output formats

- In-app visual report (radar chart, zone heatmap, metrics table)
- **PDF export** (branded layout)
- **Shareable link** (user-controlled, expires in 7 days)

## How we compare to competitors

We compared ourselves honestly against 8 major AI skin analyses in a separate [competitive analysis](https://www.1753skin.com/feedback/exports/1753-hudanalys-jamforelse.pdf). Key findings:

- **12 zones analysed** — matched only by B2B platform Haut.ai
- **15 metrics** — more than any consumer competitor
- **Client-side image processing** — unique in the mainstream consumer market
- **Holistic philosophy** — ECS, microbiome, gut-skin axis not integrated by any major competitor
- **No hardware dependency** — unlike Neutrogena Skin360 which requires a lens attachment

## Honest limitations

- No peer-reviewed external clinical validation yet
- Biological age estimate has a ±5 year confidence band
- Requires good lighting (even, soft, front-facing)
- Precision slightly lower for Fitzpatrick skin types V–VI (training data bias)
- Not a diagnostic tool; consult a dermatologist for any suspected medical condition

## Scientific basis (short)

- Byrd AL et al., *Nat Rev Microbiol* 2018;16(3):143–155 — skin microbiome
- Bíró T et al., *Trends Pharmacol Sci* 2009;30(8):411–420 — cutaneous ECS
- Salem I et al., *Front Microbiol* 2018;9:1459 — gut-skin axis
- Esteva A et al., *Nature* 2017;542(7639):115–118 — dermatologist-level AI classification

Full list: [llms-science.txt](https://www.1753skin.com/llms-science.txt)

## Questions

- Email: info@1753skin.com
- Instagram: @1753.skincare
