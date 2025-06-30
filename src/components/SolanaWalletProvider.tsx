'use client';

import React, { FC, ReactNode } from 'react';
import { FarcasterSolanaProvider } from '@farcaster/mini-app-solana';

interface SolanaWalletProviderProps {
  children: ReactNode;
}

export const SolanaWalletProvider: FC<SolanaWalletProviderProps> = ({ children }) => {
  // Use mainnet endpoint - you can replace with your own RPC endpoint
  const solanaEndpoint = process.env.SOLANA_RPC_URL;

  return (
    <FarcasterSolanaProvider endpoint={solanaEndpoint || 'https://api.mainnet.solana.com'}>
      {children}
    </FarcasterSolanaProvider>
  );
}; 