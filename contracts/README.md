# Polygon Contracts (Model Registry)

This folder contains the **Polygon (EVM)** smart contracts used by the frontend to store **model metadata** (name/description/blobId, etc.) on-chain after the model file is uploaded to Walrus.

## What gets stored on Polygon

- `blobId`: Walrus blob id (string)
- `objectId`: Walrus object id (string, optional but stored for reference)
- `name`, `description`
- `modelType`, `tagsCsv`, `framework`
- `pricingMode`, `pricePerHour`
- `uploader` (wallet address) + `uploadedAt` (timestamp)

The **model file itself stays on Walrus**; only metadata is stored on Polygon.

## Quick start (Hardhat)

### Prereqs

- Node.js (Hardhat is usually happiest on Node 18/20)
- A funded account on Polygon Amoy (testnet) or Polygon PoS (mainnet)

### Install

```bash
cd contracts
npm install
```

### Configure env

Create `contracts/.env`:

```bash
POLYGON_AMOY_RPC_URL="https://polygon-amoy-bor-rpc.publicnode.com"
DEPLOYER_PRIVATE_KEY="0xYOUR_PRIVATE_KEY"
```

Notes:
- `DEPLOYER_PRIVATE_KEY` must be a **private key**, not an address.
- Format must be **`0x` + 64 hex chars** (32 bytes).

### Deploy (Amoy)

```bash
npx hardhat run scripts/deploy.ts --network polygonAmoy
```

Copy the deployed contract address into the frontend env:

- `frontend/.env` → `VITE_POLYGON_MODEL_REGISTRY_ADDRESS=0x...`


