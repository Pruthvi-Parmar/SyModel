export type EvmChainConfig = {
  chainId: number
  chainName: string
  nativeCurrency: { name: string; symbol: string; decimals: number }
  rpcUrls: string[]
  blockExplorerUrls: string[]
}

export const POLYGON_MAINNET: EvmChainConfig = {
  chainId: 137,
  chainName: "Polygon Mainnet",
  nativeCurrency: { name: "MATIC", symbol: "MATIC", decimals: 18 },
  rpcUrls: ["https://polygon-rpc.com"],
  blockExplorerUrls: ["https://polygonscan.com"],
}

export const POLYGON_AMOY: EvmChainConfig = {
  chainId: 80002,
  chainName: "Polygon Amoy",
  nativeCurrency: { name: "MATIC", symbol: "MATIC", decimals: 18 },
  rpcUrls: ["https://polygon-amoy-bor-rpc.publicnode.com"],
  blockExplorerUrls: ["https://amoy.polygonscan.com"],
}

export function getExplorerBaseUrl(chainId?: number): string | null {
  if (!chainId) return null
  if (chainId === POLYGON_MAINNET.chainId) return POLYGON_MAINNET.blockExplorerUrls[0]
  if (chainId === POLYGON_AMOY.chainId) return POLYGON_AMOY.blockExplorerUrls[0]
  return null
}

export function getDefaultTargetChain(): EvmChainConfig {
  const envChainIdRaw = import.meta.env.VITE_POLYGON_CHAIN_ID
  const envChainId = envChainIdRaw ? Number(envChainIdRaw) : undefined
  if (envChainId === POLYGON_MAINNET.chainId) return POLYGON_MAINNET
  if (envChainId === POLYGON_AMOY.chainId) return POLYGON_AMOY
  return POLYGON_AMOY
}


