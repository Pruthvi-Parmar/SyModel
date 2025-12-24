const { ssm } = require("../config")

async function waitForSsm(instanceId, timeoutSec = 300) {
  let waited = 0
  const step = 15 * 1000

  while (waited < timeoutSec * 1000) {
    try {
      const response = await ssm
        .describeInstanceInformation({
          Filters: [
            {
              Key: "InstanceIds",
              Values: [instanceId],
            },
          ],
        })
        .promise()

      if (response.InstanceInformationList.length > 0) return true
    } catch (error) {
      console.log(`SSM not ready yet: ${error.message}`)
    }

    await new Promise((r) => setTimeout(r, step))
    waited += step
  }

  return false
}

function buildBootstrapScript({ blobId, objectId, port }) {
  const safeBlobId = blobId ? String(blobId).replace(/"/g, '\\"') : ""
  const safeObjectId = objectId ? String(objectId).replace(/"/g, '\\"') : ""
  const safePort = Number(port || 8000)

  // NOTE: This is intentionally defensive and does not assume Ubuntu-only.
  // Universal runner:
  // - downloads model zip from Walrus
  // - unzips it
  // - (optional) installs python deps from requirements.txt
  // - starts a built-in HTTP server on 0.0.0.0:${port}
  //
  // The model zip must include a python inference entrypoint:
  // - recommended: inference.py with def predict(payload: dict) -> Any
  // - supported: handler.py / model.py (same signature)
  //
  // Optional: model.manifest.json can define a custom entrypoint:
  //   { "entrypoint": "inference:predict" }
  // IMPORTANT:
  // - This script is executed by SSM via AWS-RunShellScript (typically /bin/sh).
  // - Do NOT wrap it in `bash -lc "..."` (outer shell will expand $VARS and break the script).
  // - Keep it POSIX-sh compatible.
  return `
#!/bin/sh
set -e

PORT="${safePort}"
BLOB_ID="${safeBlobId}"
OBJECT_ID="${safeObjectId}"

WORK="/opt/synapse"
ZIP="$WORK/model.zip"
DIR="$WORK/model_dir"
LOG="$WORK/synapse-model.log"
RUNNER="$WORK/runner_server.py"

mkdir -p "$WORK"

# Log everything into a predictable location
mkdir -p "$WORK" || true
: >"$LOG" || true
chmod 644 "$LOG" || true
exec >>"$LOG" 2>&1
echo "[bootstrap] start $(date)"
echo "[bootstrap] PORT=$PORT BLOB_ID=$BLOB_ID OBJECT_ID=$OBJECT_ID"
echo "[bootstrap] WORK=$WORK LOG=$LOG"
echo "[bootstrap] continuing past initial setup..."

wait_for_apt() {
  max_wait=180
  i=0
  while [ "$i" -lt "$max_wait" ]; do
    # Check all possible apt/dpkg locks
    if ! fuser /var/lib/dpkg/lock >/dev/null 2>&1 && \
       ! fuser /var/lib/dpkg/lock-frontend >/dev/null 2>&1 && \
       ! fuser /var/lib/apt/lists/lock >/dev/null 2>&1 && \
       ! fuser /var/cache/apt/archives/lock >/dev/null 2>&1; then
      return 0
    fi
    if [ $((i % 10)) -eq 0 ]; then
      echo "[bootstrap] waiting for apt lock... ($i/$max_wait sec)"
    fi
    sleep 1
    i=$((i + 1))
  done
  echo "[bootstrap] WARNING: apt lock wait timeout, proceeding anyway..."
  return 1
}

install_deps() {
  # Check if unzip is already available
  if command -v unzip >/dev/null 2>&1 && command -v python3 >/dev/null 2>&1; then
    echo "[bootstrap] unzip and python3 already available, skipping apt install"
    return 0
  fi

  if command -v apt-get >/dev/null 2>&1; then
    export DEBIAN_FRONTEND=noninteractive
    
    # Wait for apt lock with retries
    attempt=1
    max_attempts=3
    while [ "$attempt" -le "$max_attempts" ]; do
      echo "[bootstrap] apt install attempt $attempt/$max_attempts"
      
      wait_for_apt
      
      # Try to install packages
      if apt-get update -y 2>&1 && \
         apt-get install -y curl unzip python3 python3-venv python3-pip 2>&1; then
        echo "[bootstrap] apt install succeeded"
        break
      fi
      
      echo "[bootstrap] apt install attempt $attempt failed, waiting before retry..."
      sleep 30
      attempt=$((attempt + 1))
    done
    
    # Final check
    if ! command -v unzip >/dev/null 2>&1; then
      echo "[bootstrap] ERROR: unzip not installed after $max_attempts attempts"
      return 1
    fi
  elif command -v yum >/dev/null 2>&1; then
    yum install -y curl unzip python3 python3-pip || true
    if ! command -v unzip >/dev/null 2>&1; then
      echo "[bootstrap] ERROR: unzip not installed after yum install"
      return 1
    fi
  fi
}

download_zip() {
  rm -f "$ZIP"

  # Prefer blobId if available
  if [ -n "$BLOB_ID" ]; then
    # Common Walrus aggregator pattern (blob id)
    curl -fL "https://aggregator.walrus-testnet.walrus.space/v1/blobs/$BLOB_ID" -o "$ZIP" && return 0
  fi

  # Fallback: object id (Sui object id)
  if [ -n "$OBJECT_ID" ]; then
    curl -fL "https://aggregator.walrus-testnet.walrus.space/v1/blobs/by-object-id/$OBJECT_ID" -o "$ZIP" && return 0
  fi

  # Backward-compat fallback (some clients incorrectly send object id as blob id)
  if [ -n "$BLOB_ID" ]; then
    curl -fL "https://aggregator.walrus-testnet.walrus.space/v1/blobs/by-object-id/$BLOB_ID" -o "$ZIP" && return 0
  fi

  return 1
}

pick_root_dir() {
  # Check if inference.py/handler.py/model.py exists in the base directory
  if [ -f "$DIR/inference.py" ] || [ -f "$DIR/handler.py" ] || [ -f "$DIR/model.py" ]; then
    echo "$DIR"
    return 0
  fi
  
  # Search recursively for inference.py, handler.py, or model.py (exclude __MACOSX)
  for pattern in inference.py handler.py model.py; do
    found=$(find "$DIR" -name "$pattern" -type f ! -path "*/__MACOSX/*" 2>/dev/null | head -1)
    if [ -n "$found" ]; then
      # Return the directory containing the file
      dirname "$found"
      return 0
    fi
  done
  
  # Fallback: if there's exactly one subdirectory (ignoring __MACOSX), use that
  count=$(find "$DIR" -mindepth 1 -maxdepth 1 -type d ! -name "__MACOSX" 2>/dev/null | wc -l | tr -d ' ')
  if [ "$count" -eq 1 ]; then
    find "$DIR" -mindepth 1 -maxdepth 1 -type d ! -name "__MACOSX"
    return 0
  fi
  
  # Default to base directory
  echo "$DIR"
}

wait_for_port() {
  i=1
  max=60
  while [ "$i" -le "$max" ]; do
    # Check if process is still alive
    if ! kill -0 "$SERVER_PID" 2>/dev/null; then
      echo "[bootstrap] ERROR: Server process $SERVER_PID died while waiting for port"
      return 1
    fi
    
    # Try to connect to health endpoint (accept any HTTP response, even 500)
    HTTP_CODE=$(curl -sS -o /dev/null -w "%{http_code}" "http://127.0.0.1:$PORT/health" 2>/dev/null || echo "000")
    if [ "$HTTP_CODE" != "000" ]; then
      echo "[bootstrap] health check got HTTP $HTTP_CODE on attempt $i"
      # Server is responding - good enough (even 500 means it's running)
      return 0
    fi
    
    # Log progress every 5 attempts (10 seconds)
    if [ $((i % 5)) -eq 0 ]; then
      echo "[bootstrap] waiting for port $PORT... (attempt $i/$max, last HTTP=$HTTP_CODE)"
    fi
    
    sleep 2
    i=$((i + 1))
  done
  echo "[bootstrap] ERROR: Port $PORT did not become ready after $max attempts"
  return 1
}

write_runner() {
  cat > "$RUNNER" <<'PY'
import json
import os
import traceback
from http.server import BaseHTTPRequestHandler, ThreadingHTTPServer
import importlib.util

MODEL_DIR = os.environ.get("MODEL_DIR", os.getcwd())
MODEL_WEIGHTS_DIR = os.environ.get("MODEL_WEIGHTS_DIR", "")

def _find_weights_dir():
    # If caller already set it, keep it.
    if MODEL_WEIGHTS_DIR:
        return MODEL_WEIGHTS_DIR
    # Common names
    for name in ("model_weights", "model-weights", "model-wrights", "weights"):
        cand = os.path.join(MODEL_DIR, name)
        if os.path.isdir(cand):
            return cand
    # Heuristic: find a directory containing config.json + *.safetensors
    try:
        for root, dirs, files in os.walk(MODEL_DIR):
            if "config.json" in files and any(f.endswith(".safetensors") for f in files):
                return root
    except Exception:
        pass
    return ""

WEIGHTS_DIR = _find_weights_dir()
if WEIGHTS_DIR and not os.environ.get("MODEL_WEIGHTS_DIR"):
    os.environ["MODEL_WEIGHTS_DIR"] = WEIGHTS_DIR

def _load_module_from_file(path: str):
    spec = importlib.util.spec_from_file_location("synapse_model_module", path)
    module = importlib.util.module_from_spec(spec)  # type: ignore
    assert spec and spec.loader
    spec.loader.exec_module(module)  # type: ignore
    return module

def _parse_entrypoint(ep: str):
    # Supports:
    # - "inference:predict"   (module file inference.py in MODEL_DIR)
    # - "inference:Predictor.predict" (class + method)
    if ":" not in ep:
        raise ValueError("entrypoint must be like 'module:function'")
    mod, target = ep.split(":", 1)
    mod = mod.strip()
    target = target.strip()
    if not mod:
        raise ValueError("entrypoint module is empty")
    if mod.endswith(".py"):
        mod_file = mod
    else:
        mod_file = f"{mod}.py"
    mod_path = os.path.join(MODEL_DIR, mod_file)
    if not os.path.exists(mod_path):
        raise FileNotFoundError(f"Entrypoint module not found: {mod_path}")
    module = _load_module_from_file(mod_path)

    # class.method form
    if "." in target:
        cls_name, meth = target.split(".", 1)
        cls = getattr(module, cls_name, None)
        if cls is None:
            raise AttributeError(f"Class '{cls_name}' not found in {mod_file}")
        inst = cls()
        fn = getattr(inst, meth, None)
        if fn is None:
            raise AttributeError(f"Method '{meth}' not found on {cls_name}")
        return fn

    fn = getattr(module, target, None)
    if fn is None:
        raise AttributeError(f"Function '{target}' not found in {mod_file}")
    return fn

def _load_predictor():
    manifest_path = os.path.join(MODEL_DIR, "model.manifest.json")
    if os.path.exists(manifest_path):
        try:
            with open(manifest_path, "r", encoding="utf-8") as f:
                manifest = json.load(f)
            ep = (manifest.get("entrypoint") or manifest.get("predict_entrypoint") or "").strip()
            if ep:
                return _parse_entrypoint(ep)
        except Exception:
            # ignore manifest issues; fall back to defaults
            pass

    # Default to inference.py first (your current format), then handler.py, then model.py
    for filename in ("inference.py", "handler.py", "model.py"):
        path = os.path.join(MODEL_DIR, filename)
        if os.path.exists(path):
            module = _load_module_from_file(path)
            # function predict(payload)
            if hasattr(module, "predict"):
                return getattr(module, "predict")
            # common class names
            for cls_name in ("Predictor", "Inference", "Model", "Runner"):
                cls = getattr(module, cls_name, None)
                if cls is not None:
                    inst = cls()
                    if hasattr(inst, "predict"):
                        return getattr(inst, "predict")
            raise AttributeError(f"No predict() found in {filename}. Add def predict(payload: dict) -> Any")

    raise FileNotFoundError("Missing inference.py/handler.py/model.py in model package")

PREDICT = None
HANDLER_ERROR = None
try:
    PREDICT = _load_predictor()
except Exception as e:
    HANDLER_ERROR = e

def _json_bytes(obj, status=200):
    body = json.dumps(obj).encode("utf-8")
    return status, body

class Handler(BaseHTTPRequestHandler):
    def _cors(self):
        self.send_header("Access-Control-Allow-Origin", "*")
        self.send_header("Access-Control-Allow-Headers", "Content-Type")
        self.send_header("Access-Control-Allow-Methods", "GET,POST,OPTIONS")

    def do_OPTIONS(self):
        self.send_response(204)
        self._cors()
        self.end_headers()

    def do_GET(self):
        if self.path in ("/", "/health"):
            if HANDLER_ERROR is not None:
                status, body = _json_bytes({"ok": False, "error": str(HANDLER_ERROR)}, 500)
            else:
                status, body = _json_bytes({"ok": True})
            self.send_response(status)
            self._cors()
            self.send_header("Content-Type", "application/json")
            self.end_headers()
            self.wfile.write(body)
            return
        self.send_response(404)
        self._cors()
        self.end_headers()

    def do_POST(self):
        if self.path != "/predict":
            self.send_response(404)
            self._cors()
            self.end_headers()
            return

        if HANDLER_ERROR is not None:
            status, body = _json_bytes({"error": str(HANDLER_ERROR)}, 500)
            self.send_response(status)
            self._cors()
            self.send_header("Content-Type", "application/json")
            self.end_headers()
            self.wfile.write(body)
            return

        try:
            length = int(self.headers.get("Content-Length") or "0")
            raw = self.rfile.read(length) if length > 0 else b"{}"
            payload = json.loads(raw.decode("utf-8") or "{}")
            if not isinstance(payload, dict):
                raise ValueError("Payload must be a JSON object")

            if PREDICT is None:
                raise RuntimeError("Predictor not loaded")

            # Try predict(dict). If user wrote predict(text), fall back to payload['text'].
            try:
                result = PREDICT(payload)  # type: ignore
            except TypeError:
                result = PREDICT(payload.get("text"))  # type: ignore
            if isinstance(result, (dict, list, str, int, float, bool)) or result is None:
                out = result
            else:
                out = {"result": str(result)}

            status, body = _json_bytes({"result": out})
            self.send_response(status)
            self._cors()
            self.send_header("Content-Type", "application/json")
            self.end_headers()
            self.wfile.write(body)
        except Exception as e:
            status, body = _json_bytes({"error": str(e), "trace": traceback.format_exc()}, 500)
            self.send_response(status)
            self._cors()
            self.send_header("Content-Type", "application/json")
            self.end_headers()
            self.wfile.write(body)

    def log_message(self, format, *args):
        # quiet default logging
        return

def main():
    host = "0.0.0.0"
    port = int(os.environ.get("PORT", "8000"))
    httpd = ThreadingHTTPServer((host, port), Handler)
    httpd.serve_forever()

if __name__ == "__main__":
    main()
PY
}

echo "[bootstrap] installing dependencies..."
if ! install_deps; then
  echo "[bootstrap] WARNING: install_deps returned error, but continuing..."
fi

if ! command -v unzip >/dev/null 2>&1; then
  echo "[bootstrap] ERROR: unzip command not found. Cannot continue."
  exit 1
fi
echo "[bootstrap] dependencies OK (curl, unzip, python3 available)"

echo "[bootstrap] downloading model zip..."
if ! download_zip; then
  echo "[bootstrap] ERROR: Failed to download model zip"
  exit 1
fi

if [ ! -f "$ZIP" ]; then
  echo "[bootstrap] ERROR: ZIP file not found at $ZIP"
  exit 1
fi

rm -rf "$DIR"
mkdir -p "$DIR"
echo "[bootstrap] extracting zip..."
unzip -o "$ZIP" -d "$DIR" || {
  echo "[bootstrap] ERROR: Failed to unzip $ZIP"
  exit 1
}

ROOT="$(pick_root_dir)"
echo "[bootstrap] root=$ROOT"

VENV_CREATED=0
if command -v python3 >/dev/null 2>&1; then
  echo "[bootstrap] creating venv at $ROOT/.venv..."
  if python3 -m venv "$ROOT/.venv" 2>&1; then
    echo "[bootstrap] venv created successfully"
    VENV_CREATED=1
  else
    echo "[bootstrap] WARNING: venv creation failed, will use system python3"
  fi
  
  if [ "$VENV_CREATED" = "1" ] && [ -f "$ROOT/.venv/bin/activate" ]; then
    echo "[bootstrap] activating venv..."
    . "$ROOT/.venv/bin/activate"
    echo "[bootstrap] venv activated, python=$(which python)"
    
    python -m pip install -U pip 2>&1 || echo "[bootstrap] WARNING: pip upgrade failed"
    
    if [ -f "$ROOT/requirements.txt" ]; then
      echo "[bootstrap] installing python deps from requirements.txt..."
      # Sanitize requirements: remove obvious non-package lines (e.g., print statements)
      FILTERED_REQ="$ROOT/requirements.filtered.txt"
      grep -v -E '^[[:space:]]*(print|import|from|def |class |if |#)' "$ROOT/requirements.txt" | grep -v -E '^[[:space:]]*$' > "$FILTERED_REQ" || true
      
      echo "[bootstrap] filtered requirements.txt contents:"
      cat "$FILTERED_REQ" || true
      
      # Check if torch is required - install CPU-only version to save disk space
      if grep -qi "torch" "$FILTERED_REQ" 2>/dev/null; then
        echo "[bootstrap] torch detected in requirements - installing CPU-only version to save disk space..."
        # Remove torch/torchvision from filtered requirements (we install separately)
        grep -v -iE '^torch' "$FILTERED_REQ" > "$ROOT/requirements.notorch.txt" || true
        
        # Install CPU-only PyTorch first (much smaller than CUDA version)
        python -m pip install torch torchvision torchaudio --index-url https://download.pytorch.org/whl/cpu 2>&1 || \
          echo "[bootstrap] WARNING: CPU torch install failed"
        
        # Install remaining requirements
        if [ -s "$ROOT/requirements.notorch.txt" ]; then
          python -m pip install -r "$ROOT/requirements.notorch.txt" 2>&1 || \
            echo "[bootstrap] WARNING: remaining requirements install failed"
        fi
        echo "[bootstrap] python deps installed (CPU-only torch)"
      elif [ -s "$FILTERED_REQ" ]; then
        if python -m pip install -r "$FILTERED_REQ" 2>&1; then
          echo "[bootstrap] python deps installed successfully"
        else
          echo "[bootstrap] WARNING: requirements install failed, continuing anyway..."
        fi
      else
        echo "[bootstrap] WARNING: no valid packages in requirements.txt after filtering"
      fi
    fi
  fi
else
  echo "[bootstrap] WARNING: python3 not found"
fi

echo "[bootstrap] starting server..."
write_runner
chmod +x "$RUNNER"

# Prefer venv python if created, else system python3
PYTHON_BIN="python3"
if [ -f "$ROOT/.venv/bin/python" ]; then
  PYTHON_BIN="$ROOT/.venv/bin/python"
  echo "[bootstrap] using venv python: $PYTHON_BIN"
else
  echo "[bootstrap] WARNING: venv python not found, using system python3"
fi

echo "[bootstrap] MODEL_DIR=$ROOT PORT=$PORT"
echo "[bootstrap] checking python can import basics..."
"$PYTHON_BIN" -c "import json, os; print('Python OK')" 2>&1 || echo "[bootstrap] WARNING: python import test failed"

echo "[bootstrap] launching server..."
env PORT="$PORT" MODEL_DIR="$ROOT" "$PYTHON_BIN" "$RUNNER" >>"$LOG" 2>&1 &
SERVER_PID=$!
echo "[bootstrap] server PID=$SERVER_PID"

# Give server time to start and potentially crash with error messages
sleep 3

# Check if process is still running
if ! kill -0 "$SERVER_PID" 2>/dev/null; then
  echo "[bootstrap] ERROR: Server process died. Python errors (if any):"
  tail -50 "$LOG" | grep -i -E "(error|exception|traceback|import)" || true
  
  # Try running directly to get error output
  echo "[bootstrap] Attempting direct run to capture error..."
  env PORT="$PORT" MODEL_DIR="$ROOT" "$PYTHON_BIN" "$RUNNER" 2>&1 || true
  exit 1
fi

echo "[bootstrap] server process is running, waiting for port $PORT..."
if wait_for_port; then
  echo "[bootstrap] ready - server is listening on port $PORT"
  echo "[bootstrap] testing health endpoint..."
  curl -sS "http://127.0.0.1:$PORT/health" || true
  echo ""
  echo "[bootstrap] DONE - model server is running on 0.0.0.0:$PORT"
else
  echo "[bootstrap] ERROR: Port $PORT did not become ready within timeout"
  echo "[bootstrap] checking what's listening..."
  ss -tlnp | grep ":$PORT" || echo "[bootstrap] nothing on port $PORT"
  echo "[bootstrap] Server process status:"
  ps aux | grep -E "(python|$SERVER_PID)" | head -5 || true
  exit 1
fi
`
}

async function fetchWalrusBlob(instanceId, { blobId, objectId, port = 8000 } = {}) {
  try {
    const script = buildBootstrapScript({ blobId, objectId, port })
    console.log(`[ssm] sendCommand instanceId=${instanceId} port=${port} blobId=${blobId || ""} objectId=${objectId || ""}`)
    const sendResp = await ssm
      .sendCommand({
        InstanceIds: [instanceId],
        DocumentName: "AWS-RunShellScript",
        // IMPORTANT: send the script as-is (multi-line). Do NOT wrap in bash -lc "...".
        // Wrapping causes outer-shell expansion of $VARS and breaks the script.
        Parameters: { commands: [script] },
        TimeoutSeconds: 1800,
      })
      .promise()

    const commandId = sendResp.Command.CommandId
    await new Promise((r) => setTimeout(r, 2000))

    let waited = 0
    const step = 5 * 1000
    const max = 20 * 60 * 1000

    while (waited < max) {
      try {
        const invocation = await ssm
          .getCommandInvocation({ CommandId: commandId, InstanceId: instanceId })
          .promise()
        const status = invocation.Status

        if (status === "Success") {
          console.log("Model downloaded and started successfully")
          return true
        }
        if (["Failed", "Cancelled", "TimedOut"].includes(status)) {
          console.error(`Fetch failed (${status}). Stdout:\n${invocation.StandardOutputContent || ""}\nStderr:\n${invocation.StandardErrorContent || ""}`)
          return false
        }
      } catch (error) {
        if (error.code !== "InvocationDoesNotExist") {
          console.error(`SSM invocation error: ${error.message}`)
          return false
        }
      }

      await new Promise((r) => setTimeout(r, step))
      waited += step
    }

    console.error("SSM command timeout")
    return false
  } catch (error) {
    console.error(`SSM sendCommand error: ${error.message}`)
    return false
  }
}

module.exports = {
  waitForSsm,
  fetchWalrusBlob,
}
