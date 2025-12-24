const express = require("express")
const cors = require("cors")
const morgan = require("morgan")
const path = require("path")
const { PORT, AWS_REGION, AWS_LAUNCH_TEMPLATE_ID } = require("./config")
const instanceRoutes = require("./routes/instances")

const app = express()

app.use(cors())
app.use(express.json())
app.use(morgan("dev"))

app.get("/", (_req, res) => {
  res.json({
    status: "healthy",
    service: "AWS EC2 + Walrus Manager (Node)",
    region: AWS_REGION,
    launchTemplate: AWS_LAUNCH_TEMPLATE_ID,
  })
})

app.use("/api/instances", instanceRoutes)

app.use((err, _req, res, _next) => {
  console.error(err)
  res.status(500).json({ error: "Internal server error" })
})

app.listen(PORT, () => {
  console.log("-------------------------------")
  console.log("🚀 Node backend running")
  console.log(`🌐 http://localhost:${PORT}`)
  console.log(`📍 Region: ${AWS_REGION}`)
  console.log(`📋 Launch Template: ${AWS_LAUNCH_TEMPLATE_ID}`)
  console.log(`📁 Storage: ${path.resolve(__dirname, "..", "instances_data.json")}`)
  console.log("-------------------------------")
})
