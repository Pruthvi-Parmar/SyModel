const { ec2, AWS_LAUNCH_TEMPLATE_ID } = require("../config")

function nowStamp() {
  return new Date().toISOString().replace(/[:-]/g, "").slice(0, 15)
}

async function createEC2Instance() {
  try {
    const instanceName = `walrus-vm-${nowStamp()}`
    const params = {
      LaunchTemplate: { LaunchTemplateId: AWS_LAUNCH_TEMPLATE_ID },
      MinCount: 1,
      MaxCount: 1,
      TagSpecifications: [
        {
          ResourceType: "instance",
          Tags: [
            { Key: "Name", Value: instanceName },
            { Key: "ManagedBy", Value: "WalrusAPI" },
          ],
        },
      ],
    }

    const response = await ec2.runInstances(params).promise()
    const instance = response.Instances[0]
    return {
      instanceId: instance.InstanceId,
      state: instance.State.Name,
    }
  } catch (error) {
    console.error(`AWS EC2 error: ${error.message}`)
    return null
  }
}

async function waitForInstanceRunning(instanceId, timeoutSec = 300) {
  let waited = 0
  const step = 10 * 1000

  while (waited < timeoutSec * 1000) {
    try {
      const describe = await ec2
        .describeInstances({ InstanceIds: [instanceId] })
        .promise()
      const instance = describe.Reservations[0]?.Instances[0]
      if (!instance) {
        console.error("Instance not found in describeInstances")
        return null
      }

      const state = instance.State.Name
      const publicIp = instance.PublicIpAddress

      if (state === "running" && publicIp) return publicIp
      if (["terminated", "terminating", "stopped", "stopping"].includes(state)) {
        console.error(`Instance ended in state: ${state}`)
        return null
      }

      await new Promise((r) => setTimeout(r, step))
      waited += step
    } catch (error) {
      console.error(`Error polling instance: ${error.message}`)
      await new Promise((r) => setTimeout(r, step))
      waited += step
    }
  }

  return null
}

module.exports = {
  createEC2Instance,
  waitForInstanceRunning,
}
