"use client"

import type { ReactNode } from "react"
import { createContext, useContext, useEffect, useMemo, useState } from "react"
import { BrowserProvider, type Eip1193Provider } from "ethers"
import { getDefaultTargetChain } from "@/lib/evmChains"

type EvmWalletState = {
  address?: string
  chainId?: number
  isConnected: boolean
  hasProvider: boolean
  connectWallet: () => Promise<void>
  disconnectWallet: () => void
  formatAddress: () => string
  provider?: BrowserProvider
}

const EvmWalletContext = createContext<EvmWalletState | null>(null)

function getEthereum(): Eip1193Provider | null {
  const anyWindow = window as any
  return (anyWindow?.ethereum as Eip1193Provider | undefined) ?? null
}

export function EvmWalletProvider({ children }: { children: ReactNode }) {
  const [address, setAddress] = useState<string | undefined>(undefined)
  const [chainId, setChainId] = useState<number | undefined>(undefined)
  const [provider, setProvider] = useState<BrowserProvider | undefined>(undefined)

  const eth = typeof window !== "undefined" ? getEthereum() : null

  const hasProvider = !!eth
  const isConnected = !!address

  const connectWallet = async () => {
    const ethereum = getEthereum()
    if (!ethereum) throw new Error("MetaMask not found. Please install MetaMask.")

    const browserProvider = new BrowserProvider(ethereum)
    setProvider(browserProvider)

    // Request accounts
    const accounts = (await ethereum.request?.({ method: "eth_requestAccounts" })) as string[] | undefined
    const acct = accounts?.[0]
    setAddress(acct)

    // Ensure we're on the expected chain (Polygon Amoy by default)
    const target = getDefaultTargetChain()
    const currentChainIdHex = (await ethereum.request?.({ method: "eth_chainId" })) as string
    const currentChainId = Number.parseInt(currentChainIdHex, 16)
    setChainId(currentChainId)

    if (currentChainId !== target.chainId) {
      const targetHex = `0x${target.chainId.toString(16)}`
      try {
        await ethereum.request?.({
          method: "wallet_switchEthereumChain",
          params: [{ chainId: targetHex }],
        })
      } catch (err: any) {
        // Unrecognized chain: add it
        if (err?.code === 4902) {
          await ethereum.request?.({
            method: "wallet_addEthereumChain",
            params: [
              {
                chainId: targetHex,
                chainName: target.chainName,
                nativeCurrency: target.nativeCurrency,
                rpcUrls: target.rpcUrls,
                blockExplorerUrls: target.blockExplorerUrls,
              },
            ],
          })
        } else {
          throw err
        }
      }

      const switchedChainIdHex = (await ethereum.request?.({ method: "eth_chainId" })) as string
      setChainId(Number.parseInt(switchedChainIdHex, 16))
    }
  }

  const disconnectWallet = () => {
    // MetaMask doesn't support programmatic disconnect; we just clear local state.
    setAddress(undefined)
    setChainId(undefined)
    setProvider(undefined)
  }

  useEffect(() => {
    const ethereum = getEthereum()
    if (!ethereum?.on) return

    const onAccountsChanged = (accounts: string[]) => {
      setAddress(accounts?.[0])
    }

    const onChainChanged = (chainIdHex: string) => {
      setChainId(Number.parseInt(chainIdHex, 16))
    }

    ethereum.on("accountsChanged", onAccountsChanged)
    ethereum.on("chainChanged", onChainChanged)

    // Try to hydrate from currently connected accounts (no popup)
    ;(async () => {
      try {
        const accounts = (await ethereum.request?.({ method: "eth_accounts" })) as string[] | undefined
        const acct = accounts?.[0]
        setAddress(acct)

        const chainIdHex = (await ethereum.request?.({ method: "eth_chainId" })) as string
        setChainId(Number.parseInt(chainIdHex, 16))

        if (acct) setProvider(new BrowserProvider(ethereum))
      } catch {
        // ignore
      }
    })()

    return () => {
      ethereum.removeListener?.("accountsChanged", onAccountsChanged)
      ethereum.removeListener?.("chainChanged", onChainChanged)
    }
  }, [])

  const value = useMemo<EvmWalletState>(() => {
    const formatAddress = () => {
      if (!address) return ""
      return `${address.slice(0, 6)}...${address.slice(-4)}`
    }

    return {
      address,
      chainId,
      isConnected,
      hasProvider,
      connectWallet,
      disconnectWallet,
      formatAddress,
      provider,
    }
  }, [address, chainId, isConnected, hasProvider, provider])

  return <EvmWalletContext.Provider value={value}>{children}</EvmWalletContext.Provider>
}

export function useEvmWallet() {
  const ctx = useContext(EvmWalletContext)
  if (!ctx) throw new Error("useEvmWallet must be used within EvmWalletProvider")
  return ctx
}


