const fs = require("fs").promises
const { STORAGE_FILE } = require("../config")

async function loadInstances() {
  try {
    const raw = await fs.readFile(STORAGE_FILE, "utf8")
    return JSON.parse(raw)
  } catch (err) {
    if (err.code === "ENOENT") return {}
    throw err
  }
}

async function saveInstances(instances) {
  await fs.writeFile(STORAGE_FILE, JSON.stringify(instances, null, 2), "utf8")
}

async function getInstance(id) {
  const instances = await loadInstances()
  return instances[id] || null
}

async function updateInstance(id, data) {
  const instances = await loadInstances()
  if (instances[id]) {
    instances[id] = { ...instances[id], ...data }
  } else {
    instances[id] = data
  }
  await saveInstances(instances)
}

async function deleteInstance(id) {
  const instances = await loadInstances()
  delete instances[id]
  await saveInstances(instances)
}

module.exports = {
  loadInstances,
  saveInstances,
  getInstance,
  updateInstance,
  deleteInstance,
}
