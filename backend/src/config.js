const AWS = require("aws-sdk")
const path = require("path")
require("dotenv").config()

// Environment
const AWS_REGION = process.env.AWS_REGION || "ap-south-1"
const AWS_LAUNCH_TEMPLATE_ID = process.env.AWS_LAUNCH_TEMPLATE_ID || "lt-0ca5736c0c7a26c51"
const PORT = process.env.PORT || 8000
const STORAGE_FILE = process.env.STORAGE_FILE || path.join(__dirname, "..", "instances_data.json")

// AWS clients (v2 SDK)
AWS.config.update({ region: AWS_REGION })

// Prefer explicit env credentials if provided. Support temporary credentials via AWS_SESSION_TOKEN.
const accessKeyId = process.env.AWS_ACCESS_KEY_ID
const secretAccessKey = process.env.AWS_SECRET_ACCESS_KEY
const sessionToken = process.env.AWS_SESSION_TOKEN

if (accessKeyId && secretAccessKey) {
  AWS.config.credentials = new AWS.Credentials({
    accessKeyId,
    secretAccessKey,
    sessionToken,
  })
}

const ec2 = new AWS.EC2()
const ssm = new AWS.SSM()

module.exports = {
  AWS_REGION,
  AWS_LAUNCH_TEMPLATE_ID,
  PORT,
  STORAGE_FILE,
  ec2,
  ssm,
}
