const express = require("express")
const { createEC2Instance, waitForInstanceRunning } = require("../services/awsEc2")
const { waitForSsm, fetchWalrusBlob } = require("../services/awsSsm")
const { loadInstances, getInstance, updateInstance, deleteInstance } = require("../services/store")

const router = express.Router()

async function provisionInstance({ instanceId, blobId, objectId }) {
  try {
    console.log(`[provision] starting instanceId=${instanceId} blobId=${blobId || ""} objectId=${objectId || ""}`)
    await updateInstance(instanceId, { status: "waiting_for_instance" })

    const publicIp = await waitForInstanceRunning(instanceId)
    if (!publicIp) {
      await updateInstance(instanceId, { status: "failed", error: "Instance failed to start" })
      return
    }
    await updateInstance(instanceId, { publicIp, public_ip: publicIp, status: "waiting_for_ssm" })

    const ssmReady = await waitForSsm(instanceId)
    if (!ssmReady) {
      await updateInstance(instanceId, { status: "failed", error: "SSM agent not ready" })
      return
    }

    await updateInstance(instanceId, { status: "fetching_blob" })
    console.log(`[provision] SSM ready, sending bootstrap command... instanceId=${instanceId}`)
    const fetched = await fetchWalrusBlob(instanceId, { blobId, objectId, port: 8000 })
    if (!fetched) {
      await updateInstance(instanceId, { status: "failed", error: "Model download/start failed" })
      return
    }

    const predictUrl = `http://${publicIp}:8000/predict`
    await updateInstance(instanceId, {
      status: "ready",
      predict_url: predictUrl,
      predictUrl,
    })
  } catch (err) {
    console.error("Provision error:", err)
    await updateInstance(instanceId, { status: "failed", error: err?.message || "Unknown error" })
  }
}

router.post("/", async (req, res) => {
  try {
    const { blob_id, object_id } = req.body
    // Accept both fields:
    // - blob_id: Walrus blobId (preferred)
    // - object_id: Walrus/Sui object id (fallback)
    if (!blob_id && !object_id) {
      return res.status(400).json({ error: "blob_id or object_id is required" })
    }

    const ec2Result = await createEC2Instance()
    if (!ec2Result) return res.status(500).json({ error: "Failed to create EC2 instance" })

    const instanceId = ec2Result.instanceId
    await updateInstance(instanceId, {
      instanceId,
      blob_id: blob_id || null,
      object_id: object_id || null,
      status: "provisioning",
      publicIp: null,
      public_ip: null,
      createdAt: new Date().toISOString(),
      error: null,
    })

    // Run long provisioning in background so the client doesn't time out / get "Failed to fetch"
    setImmediate(() => provisionInstance({ instanceId, blobId: blob_id || null, objectId: object_id || null }))

    return res.status(202).json({
      // snake_case (frontend expects this)
      instance_id: instanceId,
      blob_id: blob_id || null,
      object_id: object_id || null,
      public_ip: null,
      predict_url: null,
      status: "provisioning",
      message: "Instance provisioning started",

      // camelCase (backward compatibility)
      instanceId,
    })
  } catch (error) {
    console.error(error)
    return res.status(500).json({ error: error.message })
  }
})

router.get("/", async (_req, res) => {
  try {
    const instances = await loadInstances()
    const list = Object.entries(instances).map(([id, data]) => ({
      instanceId: id,
      status: data.status,
      publicIp: data.publicIp,
      blob_id: data.blob_id,
      createdAt: data.createdAt,
    }))

    return res.json({ total: list.length, instances: list })
  } catch (error) {
    return res.status(500).json({ error: error.message })
  }
})

router.get("/:instanceId", async (req, res) => {
  const { instanceId } = req.params
  try {
    const local = await getInstance(instanceId)
    if (!local) return res.status(404).json({ error: "Instance not found" })
    return res.json(local)
  } catch (error) {
    return res.status(500).json({ error: error.message })
  }
})

// Proxy inference to the instance to avoid browser CORS/mixed-content issues.
// Frontend can call: POST /api/instances/:instanceId/predict
router.post("/:instanceId/predict", async (req, res) => {
  const { instanceId } = req.params
  try {
    const local = await getInstance(instanceId)
    if (!local) return res.status(404).json({ error: "Instance not found" })
    if (!local.publicIp) return res.status(400).json({ error: "Instance has no public IP yet" })

    const predictUrl = `http://${local.publicIp}:8000/predict`
    const upstream = await fetch(predictUrl, {
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

router.delete("/:instanceId", async (req, res) => {
  const { instanceId } = req.params
  try {
    const AWS = require("aws-sdk")
    const { AWS_REGION } = require("../config")
    const ec2 = new AWS.EC2({ region: AWS_REGION })

    await ec2.terminateInstances({ InstanceIds: [instanceId] }).promise()
    await deleteInstance(instanceId)

    return res.json({ message: "Instance terminated", instanceId })
  } catch (error) {
    return res.status(500).json({ error: error.message })
  }
})

module.exports = router
