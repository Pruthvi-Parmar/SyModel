const express = require("express")

const {
  loadInstances,
  getInstance,
  updateInstance,
  deleteInstance,
} = require("../services/store")

const router = express.Router()

const WORKER_URL = "http://localhost:4001/run"

/**
 * Orchestrates provisioning of an instance by calling the worker and persisting the resulting endpoint.
 *
 * On success the instance record is updated to `ready` with `endpoint` and `predict_url`; on failure the
 * instance record is updated to `failed` with an error message.
 *
 * @param {Object} params - Provisioning parameters.
 * @param {string} params.instanceId - Unique job/instance identifier.
 * @param {string} [params.blobId] - Optional blob identifier for the model artifact.
 * @param {string} [params.objectId] - Optional object identifier for the model artifact.
 */
async function provisionInstance({ instanceId, blobId, objectId }) {
  try {
    console.log(`[provision] starting job=${instanceId}`)

    await updateInstance(instanceId, { status: "starting_worker" })

    const resp = await fetch(WORKER_URL, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        jobId: instanceId,
        blobId,
        objectId,
      }),
    })

    if (!resp.ok) {
      const text = await resp.text()
      throw new Error(text)
    }

    const { endpoint } = await resp.json()

    await updateInstance(instanceId, {
      status: "ready",
      predict_url: `${endpoint}/predict`,
      endpoint,
    })

    console.log(`[provision] ready job=${instanceId} endpoint=${endpoint}`)
  } catch (err) {
    console.error("[provision] error:", err)
    await updateInstance(instanceId, {
      status: "failed",
      error: err.message || "Worker failed",
    })
  }
}

/**
 * CREATE INSTANCE
 * POST /api/instances
 */
router.post("/", async (req, res) => {
  try {
    const { blob_id, object_id } = req.body

    if (!blob_id && !object_id) {
      return res.status(400).json({
        error: "blob_id or object_id is required",
      })
    }

    const instanceId = `job_${Date.now()}`

    await updateInstance(instanceId, {
      instanceId,
      blob_id: blob_id || null,
      object_id: object_id || null,
      status: "provisioning",
      predict_url: null,
      createdAt: new Date().toISOString(),
      error: null,
    })

    // Run worker job asynchronously
    setImmediate(() =>
      provisionInstance({
        instanceId,
        blobId: blob_id || null,
        objectId: object_id || null,
      })
    )

    return res.status(202).json({
      instance_id: instanceId,
      status: "provisioning",
      message: "Worker job started",
    })
  } catch (error) {
    console.error(error)
    return res.status(500).json({ error: error.message })
  }
})

/**
 * LIST INSTANCES
 * GET /api/instances
 */
router.get("/", async (_req, res) => {
  try {
    const instances = await loadInstances()
    const list = Object.entries(instances).map(([id, data]) => ({
      instanceId: id,
      status: data.status,
      blob_id: data.blob_id,
      createdAt: data.createdAt,
      predict_url: data.predict_url || null,
    }))

    return res.json({
      total: list.length,
      instances: list,
    })
  } catch (error) {
    return res.status(500).json({ error: error.message })
  }
})

/**
 * GET INSTANCE
 * GET /api/instances/:instanceId
 */
router.get("/:instanceId", async (req, res) => {
  try {
    const local = await getInstance(req.params.instanceId)
    if (!local) {
      return res.status(404).json({ error: "Instance not found" })
    }
    return res.json(local)
  } catch (error) {
    return res.status(500).json({ error: error.message })
  }
})

/**
 * PROXY PREDICT (OPTIONAL)
 * POST /api/instances/:instanceId/predict
 */
router.post("/:instanceId/predict", async (req, res) => {
  try {
    const local = await getInstance(req.params.instanceId)
    if (!local) {
      return res.status(404).json({ error: "Instance not found" })
    }
    if (local.status !== "ready") {
      return res.status(400).json({ error: "Instance not ready" })
    }

    const upstream = await fetch(local.predict_url, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(req.body ?? {}),
    })

    const contentType = upstream.headers.get("content-type") || ""
    res.status(upstream.status)

    if (contentType.includes("application/json")) {
      const json = await upstream.json()
      return res.json(json)
    }

    const text = await upstream.text()
    return res.send(text)
  } catch (error) {
    return res.status(500).json({ error: error.message })
  }
})

/**
 * DELETE INSTANCE (LOGICAL CLEANUP)
 */
router.delete("/:instanceId", async (req, res) => {
  try {
    await deleteInstance(req.params.instanceId)
    return res.json({
      message: "Instance removed (container cleanup handled by worker)",
    })
  } catch (error) {
    return res.status(500).json({ error: error.message })
  }
})

module.exports = router
