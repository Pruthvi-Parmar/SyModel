import { ethers } from "hardhat"

async function main() {
  const factory = await ethers.getContractFactory("ModelRegistry")
  const registry = await factory.deploy()
  await registry.waitForDeployment()

  const address = await registry.getAddress()
  console.log("ModelRegistry deployed to:", address)
}

main().catch((err) => {
  console.error(err)
  process.exitCode = 1
})


