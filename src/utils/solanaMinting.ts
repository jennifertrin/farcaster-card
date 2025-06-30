import { Connection, Keypair, LAMPORTS_PER_SOL, PublicKey as SolanaPublicKey, Transaction, SystemProgram } from '@solana/web3.js';
import { Program, AnchorProvider, web3, utils, BN } from '@coral-xyz/anchor';
import { TOKEN_PROGRAM_ID, ASSOCIATED_TOKEN_PROGRAM_ID, getAssociatedTokenAddress } from '@solana/spl-token';
import { sdk } from '@farcaster/frame-sdk';

// Solana network configuration
export const SOLANA_NETWORK = 'devnet'; // Change to 'mainnet-beta' for production
export const SOLANA_RPC_URL = `https://api.${SOLANA_NETWORK}.solana.com`;

// Mint price in SOL (0.01 SOL)
export const SOLANA_MINT_PRICE = 0.01;

// Program ID for the Farcaster Pro NFT program
export const PROGRAM_ID = new SolanaPublicKey('FarcasterProNFT111111111111111111111111111111111');

// Metadata Program ID
export const METADATA_PROGRAM_ID = new SolanaPublicKey('metaqbxxUerdq28cj1RbAWkYQm3ybzjb6a8bt518x1s');

// Generate a new keypair for the mint
export function generateMintKeypair(): Keypair {
  return Keypair.generate();
}

// Create NFT metadata
export interface NFTMetadata {
  name: string;
  symbol: string;
  uri: string; // IPFS or HTTP URI for the metadata JSON
  sellerFeeBasisPoints: number; // Royalty percentage (500 = 5%)
  creators?: Array<{
    address: SolanaPublicKey;
    verified: boolean;
    share: number;
  }>;
}

// Function to mint NFT on Solana (simplified version for demo)
export async function mintSolanaNFT(
  metadata: NFTMetadata,
  payerKeypair: Keypair
): Promise<{ mint: SolanaPublicKey; signature: string }> {
  try {
    // For demo purposes, we'll simulate the minting process
    // In a real implementation, you would use the Anchor program or Metaplex SDK
    
    // Generate mint keypair
    const mintKeypair = generateMintKeypair();
    
    // Simulate transaction processing
    await new Promise(resolve => setTimeout(resolve, 2000));
    
    // Return mock result
    return {
      mint: mintKeypair.publicKey,
      signature: 'mock_signature_' + Date.now()
    };
  } catch (error) {
    console.error('Error minting Solana NFT:', error);
    throw new Error(`Failed to mint Solana NFT: ${error instanceof Error ? error.message : 'Unknown error'}`);
  }
}

// Function to get Solana provider from Farcaster SDK
export function getSolanaProvider() {
  try {
    return sdk.wallet.getSolanaProvider();
  } catch (error) {
    console.error('Error getting Solana provider:', error);
    throw new Error('Failed to get Solana provider from Farcaster SDK');
  }
}

// Function to check SOL balance
export async function getSolBalance(publicKey: string): Promise<number> {
  try {
    const connection = new Connection(SOLANA_RPC_URL);
    const balance = await connection.getBalance(new SolanaPublicKey(publicKey));
    return balance / LAMPORTS_PER_SOL;
  } catch (error) {
    console.error('Error getting SOL balance:', error);
    throw new Error(`Failed to get SOL balance: ${error instanceof Error ? error.message : 'Unknown error'}`);
  }
}

// Function to create metadata JSON for the NFT
export function createMetadataJSON(
  name: string,
  symbol: string,
  description: string,
  imageUrl: string,
  attributes?: Array<{ trait_type: string; value: string }>
) {
  return {
    name,
    symbol,
    description,
    image: imageUrl,
    attributes: attributes || [],
    properties: {
      files: [
        {
          type: 'image/png',
          uri: imageUrl,
        },
      ],
      category: 'image',
    },
  };
}

// Function to prepare Solana mint transaction
export function prepareSolanaMintTransaction(
  cardImageUrl: string,
  membershipId: string,
  memberName: string
) {
  const metadata = createMetadataJSON(
    `Farcaster Pro Card - ${memberName}`,
    'FARPRO',
    `Farcaster Pro Membership Card for ${memberName} (ID: ${membershipId})`,
    cardImageUrl,
    [
      { trait_type: 'Membership ID', value: membershipId },
      { trait_type: 'Member Name', value: memberName },
      { trait_type: 'Card Type', value: 'Farcaster Pro' },
      { trait_type: 'Blockchain', value: 'Solana' }
    ]
  );

  return {
    metadata,
    mintPrice: SOLANA_MINT_PRICE,
    network: SOLANA_NETWORK
  };
} 