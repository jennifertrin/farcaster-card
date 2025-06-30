# Farcaster Pro Membership Card

A virtual membership card generator for Farcaster users with NFT minting capabilities.

## Features

- **Virtual Membership Cards**: Generate personalized Farcaster Pro membership cards
- **Card Sharing**: Share your card directly to Farcaster
- **Dual Blockchain NFT Minting**: Mint your card as an NFT on both Ethereum (0.005 ETH) and Solana (0.01 SOL)
- **Multi-Wallet Integration**: Seamless wallet connection for both Ethereum and Solana chains

## NFT Minting

Users can now mint their Farcaster Pro membership card as an NFT on both Ethereum and Solana:

### Ethereum NFT Minting
- **Mint Price**: 0.005 ETH per NFT
- **Blockchain**: Ethereum Mainnet
- **Standard**: ERC-721
- **Token Name**: Farcaster Pro Membership Card
- **Token Symbol**: FARPRO

### Solana NFT Minting
- **Mint Price**: 0.01 SOL per NFT
- **Blockchain**: Solana Devnet/Mainnet
- **Standard**: SPL Token with Metaplex metadata
- **Token Name**: Farcaster Pro Card - [Member Name]
- **Token Symbol**: FARPRO

### How to Mint

1. Generate your virtual membership card
2. Choose your preferred blockchain (Ethereum or Solana)
3. Connect the appropriate wallet (MetaMask for Ethereum, Farcaster wallet for Solana)
4. Click the mint button for your chosen blockchain
5. Confirm the transaction in your wallet
6. Your NFT will be minted with your card image as the token URI

## Smart Contract

The NFT minting functionality uses a custom ERC-721 smart contract:

- **Contract**: `FarcasterProNFT.sol`
- **Features**: 
  - Payable mint function (0.005 ETH)
  - Custom token URIs
  - Owner withdrawal function
  - OpenZeppelin secure implementation

### Deployment

See `DEPLOYMENT_INSTRUCTIONS.md` for detailed deployment steps.

## Setup

### Prerequisites

- Node.js 18+ 
- npm or yarn
- Ethereum wallet (for NFT minting)

### Installation

```bash
npm install
```

### Environment Variables

Create a `.env.local` file:

```env
NEXT_PUBLIC_HOST=https://your-domain.com
```

### Development

```bash
npm run dev
```

### Build

```bash
npm run build
```

## Dependencies

- **Next.js 15**: React framework
- **Farcaster Frame SDK**: For Farcaster integration
- **Wagmi**: For Ethereum wallet interactions
- **Viem**: Ethereum library
- **Solana Web3.js**: For Solana blockchain interactions
- **Anchor**: For Solana program development
- **Metaplex**: For Solana NFT metadata
- **Tailwind CSS**: Styling

## Project Structure

```
src/
├── app/                 # Next.js app directory
├── components/          # React components
│   ├── VirtualCard.tsx # Main card component with dual NFT minting
│   ├── WagmiProvider.tsx # Ethereum wallet provider
│   └── SolanaWalletProvider.tsx # Solana wallet provider
├── lib/
│   └── wagmi.ts        # Wagmi configuration
├── utils/
│   ├── cardImage.ts    # Card image generation
│   ├── nftMinting.ts   # Ethereum NFT minting utilities
│   └── solanaMinting.ts # Solana NFT minting utilities
└── middleware.ts       # Farcaster middleware

contracts/
└── FarcasterProNFT.sol # Ethereum NFT smart contract

programs/
└── farcaster-pro-nft/  # Solana NFT program (Anchor)
    ├── src/
    │   └── lib.rs      # Main program logic
    └── Cargo.toml      # Program dependencies

scripts/
├── deploy.js           # Ethereum contract deployment
└── deploy-solana.js    # Solana program deployment
```

## Contributing

1. Fork the repository
2. Create a feature branch
3. Make your changes
4. Test thoroughly
5. Submit a pull request

## License

MIT License
