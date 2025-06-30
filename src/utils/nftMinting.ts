import { parseEther } from 'viem'

// Simple NFT contract ABI for minting
export const NFT_CONTRACT_ABI = [
  {
    inputs: [
      {
        internalType: "string",
        name: "tokenURI",
        type: "string"
      }
    ],
    name: "mint",
    outputs: [
      {
        internalType: "uint256",
        name: "",
        type: "uint256"
      }
    ],
    stateMutability: "payable",
    type: "function"
  }
] as const

// Contract address on Base network - you'll need to deploy this contract
// This is a placeholder - replace with your actual deployed contract address on Base
export const NFT_CONTRACT_ADDRESS = '0x259bbCb5E405b35DD9eFc06611720a2C5784D43b'

// Mint price in ETH (same on Base as it's an L2)
export const MINT_PRICE = parseEther('0.005')

// Function to prepare mint transaction
export function prepareMintTransaction(tokenURI: string) {
  return {
    address: NFT_CONTRACT_ADDRESS as `0x${string}`,
    abi: NFT_CONTRACT_ABI,
    functionName: 'mint' as const,
    args: [tokenURI] as const,
    value: MINT_PRICE,
  }
} 