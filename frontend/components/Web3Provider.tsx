import type React from "react"

import { QueryClient, QueryClientProvider } from "@tanstack/react-query"
import { EvmWalletProvider } from "@/hooks/useEvmWallet"

const queryClient = new QueryClient()

export function Web3Provider({ children }: { children: React.ReactNode }) {
  return (
    <QueryClientProvider client={queryClient}>
      <EvmWalletProvider>{children}</EvmWalletProvider>
    </QueryClientProvider>
  )
}
