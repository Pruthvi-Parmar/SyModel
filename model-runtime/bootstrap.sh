#!/bin/sh
set -e

# ----------------------------
# Config
# ----------------------------
PORT="${safePort}"
BLOB_ID="${safeBlobId}"
OBJECT_ID="${safeObjectId}"

WORK="/opt/synapse"
ZIP="$WORK/model.zip"
DIR="$WORK/model_dir"
LOG="$WORK/synapse-model.log"
RUNNER="$WORK/runner_server.py"

PYTHON_BIN="python3"

# ----------------------------
# Setup dirs & logging
# ----------------------------
mkdir -p "$WORK"
mkdir -p "$DIR"

: >"$LOG"
chmod 644 "$LOG"

echo "[bootstrap] starting synapse runtime" | tee -a "$LOG"
echo "[bootstrap] PORT=$PORT" | tee -a "$LOG"
echo "[bootstrap] BLOB_ID=$BLOB_ID" | tee -a "$LOG"

# Redirect all future output to log
exec >>"$LOG" 2>&1

# ----------------------------
# Install OS dependencies
# ----------------------------
echo "[bootstrap] installing system dependencies..."
apt-get update
apt-get install -y curl unzip python3 python3-pip

# ----------------------------
# Download model from Walrus
# ----------------------------
echo "[bootstrap] downloading model zip from Walrus..."

if [ -n "$BLOB_ID" ]; then
  curl -fL \
    "https://aggregator.walrus-testnet.walrus.space/v1/blobs/$BLOB_ID" \
    -o "$ZIP"
else
  echo "[bootstrap] ERROR: No blob_id provided"
  exit 1
fi

# ----------------------------
# Unzip model
# ----------------------------
echo "[bootstrap] unzipping model..."
rm -rf "$DIR"
mkdir -p "$DIR"
unzip -q "$ZIP" -d "$DIR"

# ----------------------------
# Install Python dependencies
# ----------------------------
if [ -f "$DIR/requirements.txt" ]; then
  echo "[bootstrap] installing python dependencies..."
  pip3 install --no-cache-dir -r "$DIR/requirements.txt"
fi

# ----------------------------
# Validate files
# ----------------------------
if [ ! -f "$DIR/inference.py" ]; then
  echo "[bootstrap] ERROR: inference.py not found"
  exit 1
fi

# ----------------------------
# Start inference server (PID 1)
# ----------------------------
echo "[bootstrap] starting inference server on port $PORT"
echo "[bootstrap] MODEL_DIR=$DIR"

# 🔥 THIS IS THE IMPORTANT LINE
exec env PORT="$PORT" MODEL_DIR="$DIR" "$PYTHON_BIN" "$RUNNER"
