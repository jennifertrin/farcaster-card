# Farcaster Pro Membership Card

A virtual membership card generator for Farcaster users with NFT minting capabilities.

## Features

- **Virtual Membership Cards**: Generate personalized Farcaster Pro membership cards
- **Card Sharing**: Share your card directly to Farcaster
- **NFT Minting**: Mint your card as an NFT on Ethereum for 0.005 ETH
- **Wallet Integration**: Seamless wallet connection using Farcaster Frame SDK

## NFT Minting

Users can now mint their Farcaster Pro membership card as an NFT on Ethereum:

- **Mint Price**: 0.005 ETH per NFT
- **Blockchain**: Ethereum Mainnet
- **Standard**: ERC-721
- **Token Name**: Farcaster Pro Membership Card
- **Token Symbol**: FARPRO

### How to Mint

1. Generate your virtual membership card
2. Click the "Mint NFT" button below the "Share Card" button
3. Connect your wallet if not already connected
4. Confirm the transaction in your wallet
5. Your NFT will be minted with your card image as the token URI

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
- **Tailwind CSS**: Styling

## Project Structure

```
src/
├── app/                 # Next.js app directory
├── components/          # React components
│   ├── VirtualCard.tsx # Main card component with NFT minting
│   └── WagmiProvider.tsx # Wallet provider
├── lib/
│   └── wagmi.ts        # Wagmi configuration
├── utils/
│   ├── cardImage.ts    # Card image generation
│   └── nftMinting.ts   # NFT minting utilities
└── middleware.ts       # Farcaster middleware

contracts/
└── FarcasterProNFT.sol # NFT smart contract

scripts/
└── deploy.js           # Contract deployment script
```

## Contributing

1. Fork the repository
2. Create a feature branch
3. Make your changes
4. Test thoroughly
5. Submit a pull request

## License

MIT License
