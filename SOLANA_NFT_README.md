# Solana NFT Minting for Farcaster Pro Cards

This project now supports minting Farcaster Pro membership cards as NFTs on both Ethereum and Solana blockchains.

## Features Added

### Solana NFT Minting
- **Dual Blockchain Support**: Mint NFTs on both Ethereum and Solana
- **Farcaster Solana Integration**: Seamless integration with Farcaster's built-in Solana wallet
- **Custom Solana Program**: Dedicated Anchor program for NFT minting
- **Metadata Support**: Full NFT metadata with attributes and royalties

## Solana Program Details

### Program Structure
- **Location**: `programs/farcaster-pro-nft/`
- **Language**: Rust with Anchor framework
- **Program ID**: `FarcasterProNFT111111111111111111111111111111111`

### Key Features
- **Mint Function**: `mint_nft(name, symbol, uri)` - Creates new NFTs
- **Metadata Support**: Automatic metadata account creation
- **Master Edition**: Creates master edition for unlimited supply
- **Royalties**: 5% creator royalties
- **Token Standard**: SPL Token with Metaplex metadata

## Setup Instructions

### 1. Install Dependencies
```bash
npm install
```

### 2. Solana Program Development
```bash
# Install Anchor CLI (if not already installed)
cargo install --git https://github.com/coral-xyz/anchor avm --locked --force

# Build the program
anchor build

# Deploy to devnet
anchor deploy --provider.cluster devnet
```

### 3. Environment Configuration
The Solana program is configured for devnet by default. For production:
- Update `SOLANA_NETWORK` in `src/utils/solanaMinting.ts`
- Deploy program to mainnet-beta
- Update program ID if needed

## Usage

### Frontend Integration
The VirtualCard component now includes:

1. **Ethereum Minting**: Original functionality with 0.005 ETH cost
2. **Solana Minting**: New button for Solana NFT minting (0.01 SOL cost) with Farcaster wallet integration

### User Flow
1. Generate virtual membership card
2. Choose blockchain (Ethereum or Solana)
3. Connect appropriate wallet (MetaMask for Ethereum, Farcaster wallet for Solana)
4. Click mint button
5. Confirm transaction
6. NFT is minted with card image as metadata

## Technical Implementation

### Solana Minting Utility (`src/utils/solanaMinting.ts`)
- **Network Configuration**: Devnet/mainnet support
- **Program Integration**: Anchor program interaction
- **Metadata Creation**: Automatic metadata JSON generation
- **Transaction Handling**: Simplified minting process

### Solana Wallet Provider (`src/components/SolanaWalletProvider.tsx`)
- **Farcaster Integration**: Uses Farcaster's built-in Solana wallet
- **Auto-Connection**: Automatic wallet connection through Farcaster
- **Network Configuration**: Mainnet by default

### VirtualCard Component Updates
- **Dual Minting Interface**: Separate buttons for each blockchain
- **Wallet State Management**: Track both Ethereum and Solana connections
- **Error Handling**: Separate error states for each blockchain
- **Success Feedback**: Transaction confirmation for both chains

## Deployment

### Solana Program Deployment
```bash
# Build program
anchor build

# Deploy to devnet
anchor deploy --provider.cluster devnet

# Deploy to mainnet-beta (production)
anchor deploy --provider.cluster mainnet-beta
```

### Frontend Deployment
The frontend automatically detects the network and uses appropriate configurations.

## Configuration

### Network Settings
- **Devnet**: `SOLANA_NETWORK = 'devnet'`
- **Mainnet**: `SOLANA_NETWORK = 'mainnet-beta'`

### Mint Prices
- **Ethereum**: 0.005 ETH
- **Solana**: 0.01 SOL

### Royalties
- **Ethereum**: Set in smart contract
- **Solana**: 5% creator royalties

## Development Notes

### Current Implementation
- **Demo Mode**: Solana minting currently uses a mock implementation
- **Production Ready**: Ethereum minting is fully functional
- **Future Enhancement**: Real Solana program integration

### Next Steps
1. Deploy Solana program to devnet
2. Integrate real program calls
3. Add IPFS metadata storage
4. Implement collection features
5. Add marketplace integration

## Troubleshooting

### Common Issues
1. **Wallet Connection**: Ensure Solana wallet is installed and connected
2. **Network Mismatch**: Verify wallet is on correct network (devnet/mainnet)
3. **Insufficient Balance**: Ensure wallet has enough SOL for minting
4. **Program Deployment**: Verify Solana program is deployed and accessible

### Debug Information
- Check browser console for detailed error messages
- Verify network configuration in `solanaMinting.ts`
- Confirm program ID matches deployed program

## Security Considerations

- **Private Keys**: Never expose private keys in frontend code
- **Wallet Integration**: Use official wallet adapters only
- **Program Verification**: Verify program ID and deployment
- **Transaction Validation**: Validate all transaction parameters

## Support

For issues or questions:
1. Check the browser console for error messages
2. Verify wallet connection and network settings
3. Ensure sufficient balance for minting
4. Review program deployment status 