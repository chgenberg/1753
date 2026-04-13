#!/bin/bash
#
# run-training-pipeline.sh  (v4 — face-only + GPT filter)
#
# Full training pipeline:
#   1. Scrape face-only images with DNN face detection
#   2. GPT Vision quality filter (remove illustrations, text, body-only)
#   3. Install PyTorch (if needed)
#   4. Train EfficientNet with 10 classes (incl. normal)
#   5. Export to ONNX
#
# Runs with caffeinate to prevent macOS sleep.
#
# Usage:
#   nohup caffeinate -dims bash scripts/run-training-pipeline.sh &
#
# Monitor:
#   tail -f data/training-pipeline.log

set -e

SCRIPT_DIR="$(cd "$(dirname "$0")" && pwd)"
PROJECT_ROOT="$(dirname "$SCRIPT_DIR")"
LOG_FILE="$PROJECT_ROOT/data/training-pipeline.log"
LOCK_FILE="$PROJECT_ROOT/data/.training-pipeline.lock"

mkdir -p "$PROJECT_ROOT/data"

if [ -f "$LOCK_FILE" ]; then
    PID=$(cat "$LOCK_FILE")
    if kill -0 "$PID" 2>/dev/null; then
        echo "Pipeline already running (PID $PID). Check $LOG_FILE"
        exit 1
    else
        rm -f "$LOCK_FILE"
    fi
fi

echo $$ > "$LOCK_FILE"
cleanup() { rm -f "$LOCK_FILE"; }
trap cleanup EXIT

{
    echo ""
    echo "================================================================"
    echo "  TRAINING PIPELINE v4  (face-only + GPT filter)"
    echo "  $(date)"
    echo "  PID: $$"
    echo "  Target: 1500/condition, 3000 normal"
    echo "  DNN face detection + GPT Vision quality filter"
    echo "================================================================"
    echo ""

    # ---- STEP 1: SCRAPE FACE IMAGES ----
    echo "[STEP 1/5] Scraping face images from web (DDG + Wiki + Open-i + Flickr)..."
    echo "  Started: $(date)"
    echo ""
    python3 -u "$SCRIPT_DIR/scrape-web-faces.py" 2>&1
    echo ""
    echo "  Primary scraping finished: $(date)"
    echo ""

    # ---- STEP 1b: SUPPLEMENTARY SCRAPING (Bing + Yandex + DermNet) ----
    echo "[STEP 1b/5] Supplementary scraping (Bing + Yandex + DermNet + Unsplash)..."
    echo "  Started: $(date)"
    echo ""
    python3 -u "$SCRIPT_DIR/scrape-bing-yandex.py" 2>&1
    echo ""
    echo "  Supplementary scraping finished: $(date)"
    echo ""

    # ---- STEP 2: GPT VISION FILTER ----
    echo "[STEP 2/5] GPT Vision quality filter (removing illustrations, text, body-only)..."
    echo "  Started: $(date)"
    echo ""
    python3 -u "$SCRIPT_DIR/gpt-filter-images.py" 2>&1
    echo ""
    echo "  GPT filter finished: $(date)"
    echo ""

    # ---- STEP 3: DEPENDENCIES ----
    echo "[STEP 3/5] Installing/checking PyTorch dependencies..."
    pip3 install torch torchvision onnx onnxruntime pillow 2>&1
    echo ""

    # ---- STEP 4: TRAIN ----
    echo "[STEP 4/5] Training model (25 epochs, EfficientNet-B0)..."
    echo "  Started: $(date)"
    echo ""
    python3 -u "$SCRIPT_DIR/train_skin_classifier.py" --epochs 25 --batch-size 32 2>&1
    echo ""
    echo "  Training finished: $(date)"
    echo ""

    # ---- STEP 5: SUMMARY ----
    echo "[STEP 5/5] Final dataset summary..."
    echo ""
    for cls_dir in "$PROJECT_ROOT/data/training-dataset"/*/; do
        cls=$(basename "$cls_dir")
        if [[ "$cls" == _* ]]; then continue; fi
        count=$(find "$cls_dir" -maxdepth 1 -type f \( -name "*.jpg" -o -name "*.jpeg" -o -name "*.png" \) | wc -l | tr -d ' ')
        echo "    $cls: $count images"
    done
    echo ""

    echo "================================================================"
    echo "  PIPELINE COMPLETE"
    echo "  $(date)"
    echo ""
    echo "  ONNX model: frontend/public/models/skin_classifier_q8.onnx"
    echo "  Model meta: frontend/public/models/model_meta.json"
    echo "  Restart the Next.js frontend to use the new model."
    echo "================================================================"

} >> "$LOG_FILE" 2>&1

echo "Pipeline finished. Check $LOG_FILE for details."
