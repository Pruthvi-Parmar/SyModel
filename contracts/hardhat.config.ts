import type { HardhatUserConfig } from "hardhat/config"
import "@nomicfoundation/hardhat-ethers"
import * as dotenv from "dotenv"

dotenv.config()

const AMOY_RPC_URL = process.env.POLYGON_AMOY_RPC_URL || ""
const MAINNET_RPC_URL = process.env.POLYGON_MAINNET_RPC_URL || ""
const DEPLOYER_PRIVATE_KEY_RAW = process.env.DEPLOYER_PRIVATE_KEY || ""

function normalizePrivateKey(input: string): string {
  const trimmed = input.trim()
  if (!trimmed) return ""
  const with0x = trimmed.startsWith("0x") ? trimmed : `0x${trimmed}`
  const isValid = /^0x[0-9a-fA-F]{64}$/.test(with0x)
  if (!isValid) {
    const hint =
      with0x.length === 42
        ? "It looks like you provided an address (0x + 40 hex chars). You must provide a private key (0x + 64 hex chars)."
        : "Private key must be 32 bytes hex (0x + 64 hex chars)."
    throw new Error(`Invalid DEPLOYER_PRIVATE_KEY. ${hint}`)
  }
  return with0x
}

const accounts = DEPLOYER_PRIVATE_KEY_RAW ? [normalizePrivateKey(DEPLOYER_PRIVATE_KEY_RAW)] : []

const config: HardhatUserConfig = {
  solidity: {
    version: "0.8.20",
    settings: {
      optimizer: { enabled: true, runs: 200 },
      viaIR: true,
    },
  },
  networks: {
    hardhat: {},
    polygonAmoy: {
      url: AMOY_RPC_URL,
      chainId: 80002,
      accounts,
    },
    polygon: {
      url: MAINNET_RPC_URL,
      chainId: 137,
      accounts,
    },
  },
}

export default config


