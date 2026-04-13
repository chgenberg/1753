#!/bin/bash
# Night run: wait for severity + vision filter, then train model
# Keeps Mac awake with caffeinate

cd /Users/christophergenberg/Desktop/1753
LOG="logs/night-run.log"
mkdir -p logs

echo "$(date): Night run started" >> "$LOG"

# --- Wait for severity annotation ---
echo "$(date): Waiting for severity annotation to finish..." >> "$LOG"
while pgrep -f "annotate-severity" > /dev/null 2>&1; do
  sleep 60
done
echo "$(date): Severity annotation done" >> "$LOG"

# --- Wait for GPT vision filter ---
echo "$(date): Waiting for GPT vision filter to finish..." >> "$LOG"
while pgrep -f "gpt-vision-filter" > /dev/null 2>&1; do
  sleep 60
done
echo "$(date): GPT vision filter done" >> "$LOG"

# --- Wait for review translation ---
echo "$(date): Waiting for review translation to finish..." >> "$LOG"
while pgrep -f "translate-reviews" > /dev/null 2>&1; do
  sleep 60
done
echo "$(date): Review translation done" >> "$LOG"

# --- Count dataset ---
echo "$(date): Dataset summary:" >> "$LOG"
for d in data/training-dataset/*/; do
  cls=$(basename "$d")
  orig=$(find "$d" -maxdepth 1 -name "*.jpg" -o -name "*.jpeg" -o -name "*.png" | grep -v "aug_" | wc -l | tr -d ' ')
  total=$(find "$d" -maxdepth 1 -name "*.jpg" -o -name "*.jpeg" -o -name "*.png" | wc -l | tr -d ' ')
  echo "  $cls: $orig originals, $total total" >> "$LOG"
done

# --- Check severity annotations ---
if [ -f "data/training-dataset/_severity_annotations.json" ]; then
  count=$(python3 -c "import json; print(len(json.load(open('data/training-dataset/_severity_annotations.json'))))")
  echo "$(date): Severity annotations: $count" >> "$LOG"
fi

# --- Train model ---
echo "" >> "$LOG"
echo "$(date): Starting EfficientNet-B3 training (25 epochs)..." >> "$LOG"
echo "========================================================" >> "$LOG"

# Load API key from .env if not already set
if [ -z "$OPENAI_API_KEY" ] && [ -f .env ]; then
  export $(grep OPENAI_API_KEY .env | xargs)
fi

python3 scripts/train_skin_classifier.py --model b3 --epochs 25 --batch-size 24 >> "$LOG" 2>&1
TRAIN_EXIT=$?

echo "" >> "$LOG"
if [ $TRAIN_EXIT -eq 0 ]; then
  echo "$(date): Training COMPLETE! Model exported to frontend/public/models/" >> "$LOG"
  echo "$(date): Check logs/night-run.log for results" >> "$LOG"
else
  echo "$(date): Training FAILED with exit code $TRAIN_EXIT" >> "$LOG"
fi

echo "$(date): Night run finished" >> "$LOG"
