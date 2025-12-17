# Synapse Model - Polygon Frontend

AI Model Marketplace with **Walrus** file storage and **Polygon (EVM)** on-chain metadata (via smart contracts).

## Quick Start

### Prerequisites

- Node.js 18+ 
- pnpm (recommended) or npm
- MetaMask (browser extension)

### Installation

```bash
cd frontend
pnpm install
```

### Configuration

1. Deploy the Polygon contract (see `../contracts/README.md`)
2. Create `frontend/.env` with:

```bash
VITE_POLYGON_RPC_URL="https://polygon-amoy-bor-rpc.publicnode.com"
VITE_POLYGON_CHAIN_ID="80002"
VITE_POLYGON_MODEL_REGISTRY_ADDRESS="0xYOUR_DEPLOYED_CONTRACT_ADDRESS"
```

### Development

```bash
pnpm dev
```

Open [http://localhost:5173](http://localhost:5173)

### Build

```bash
pnpm build
```

## Features

- 🔗 **Polygon Blockchain Integration**: On-chain model registry (metadata)
- 📦 **Walrus Storage**: Model file storage (upload via Walrus publisher)
- 💼 **Wallet Management**: Connect with MetaMask
- 📤 **Model Upload**: Upload and register AI models
- 🔍 **Model Discovery**: Browse and search uploaded models
- 🎨 **Modern UI**: Built with React, TypeScript, and Tailwind CSS

## Tech Stack

- **Framework**: React 19 + TypeScript
- **Blockchain**: Polygon (EVM) + MetaMask + ethers
- **Storage**: Walrus (publisher API)
- **Styling**: Tailwind CSS
- **UI Components**: Radix UI
- **Animations**: Framer Motion
- **Form Handling**: React Hook Form + Zod
- **Build Tool**: Vite

## Project Structure

```
frontend/
├── components/        # React components
│   ├── ui/           # Reusable UI components
│   ├── Navbar.tsx    # Navigation bar
│   ├── UploadForm.tsx # Model upload form
│   └── ...
├── hooks/            # Custom React hooks
│   ├── useEvmWallet.ts
│   └── useBlockchainModels.ts
├── lib/              # Utilities and clients
│   ├── polygonRegistry.ts  # Polygon contract client
│   └── utils.ts      # Helper functions
├── pages/            # Page components
├── types/            # TypeScript type definitions
└── src/
    ├── App.tsx       # Main app component
    └── main.tsx      # Entry point
```

## Scripts

- `pnpm dev` - Start development server
- `pnpm build` - Build for production
- `pnpm preview` - Preview production build
- `pnpm lint` - Run ESLint

## Deployment

### Deploy Contract First
```bash
cd ../contracts
npm install
npx hardhat run scripts/deploy.ts --network polygonAmoy
```

### Update Configuration
Copy the deployed contract address to `frontend/.env` as `VITE_POLYGON_MODEL_REGISTRY_ADDRESS`.

### Deploy Frontend
```bash
pnpm build
# Deploy the dist/ folder to your hosting service
```

## License

MIT
