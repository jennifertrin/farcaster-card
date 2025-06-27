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

// Contract address - you'll need to deploy this contract
// This is a placeholder - replace with your actual deployed contract address
export const NFT_CONTRACT_ADDRESS = '0xE9384f01884C23E2E984c4846cDD86CE3E56024a'

// Mint price in ETH
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