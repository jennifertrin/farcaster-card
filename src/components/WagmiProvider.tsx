'use client'

import { WagmiProvider as Provider } from 'wagmi'
import { QueryClient, QueryClientProvider } from '@tanstack/react-query'
import { config } from '../lib/wagmi'

// Create a client
const queryClient = new QueryClient()

export function WagmiProvider({ children }: { children: React.ReactNode }) {
  return (
    <QueryClientProvider client={queryClient}>
      <Provider config={config}>{children}</Provider>
    </QueryClientProvider>
  )
} 