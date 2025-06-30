# NFT Contract Deployment Instructions

## Overview
This document provides instructions for deploying the Farcaster Pro NFT smart contract to Base network (Coinbase's L2).

## Smart Contract Details
- **Contract Name**: FarcasterProNFT
- **Token Name**: Farcaster Pro Membership Card
- **Token Symbol**: FARPRO
- **Mint Price**: 0.005 ETH
- **Standard**: ERC-721
- **Network**: Base (Coinbase L2)

## Base Network Information
- **Chain ID**: 8453 (mainnet), 84532 (testnet)
- **RPC URL**: https://mainnet.base.org
- **Testnet RPC URL**: https://sepolia.base.org
- **Block Explorer**: https://basescan.org
- **Testnet Explorer**: https://sepolia.basescan.org

## Deployment Steps

### 1. Install Dependencies
```bash
npm install -g hardhat
npm install @openzeppelin/contracts
```

### 2. Initialize Hardhat Project
```bash
npx hardhat init
```

### 3. Copy Contract
Copy the `contracts/FarcasterProNFT.sol` file to your Hardhat project's `contracts/` directory.

### 4. Configure Hardhat
Update your `hardhat.config.js` or `hardhat.config.ts`:

```javascript
require("@nomicfoundation/hardhat-toolbox");
require("dotenv").config();

module.exports = {
  solidity: "0.8.20",
  networks: {
    base: {
      url: process.env.BASE_RPC_URL || "https://mainnet.base.org",
      accounts: [process.env.PRIVATE_KEY],
      chainId: 8453,
    },
    baseSepolia: {
      url: process.env.BASE_SEPOLIA_RPC_URL || "https://sepolia.base.org",
      accounts: [process.env.PRIVATE_KEY],
      chainId: 84532,
    }
  },
};
```

### 5. Set Environment Variables
Create a `.env` file:
```
PRIVATE_KEY=your_wallet_private_key
BASE_RPC_URL=https://mainnet.base.org
BASE_SEPOLIA_RPC_URL=https://sepolia.base.org
```

### 6. Get Base ETH for Deployment
Before deploying, you'll need Base ETH in your wallet:
- **Mainnet**: Bridge ETH from Ethereum mainnet to Base using the official bridge at https://bridge.base.org
- **Testnet**: Get testnet ETH from https://www.coinbase.com/faucets/base-ethereum-goerli-faucet

### 7. Deploy Contract
First, test on Base Sepolia testnet:
```bash
npx hardhat run scripts/deploy.js --network baseSepolia
```

Then deploy to Base mainnet:
```bash
npx hardhat run scripts/deploy.js --network base
```

### 8. Update Contract Address
After deployment, update the `NFT_CONTRACT_ADDRESS` in `src/utils/nftMinting.ts` with your deployed contract address.

## Contract Functions

### Public Functions
- `mint(string memory tokenURI)` - Mints a new NFT for 0.005 ETH
- `tokenURI(uint256 tokenId)` - Returns the token URI for a given token ID
- `totalSupply()` - Returns the total number of minted NFTs

### Owner Functions
- `withdraw()` - Allows the contract owner to withdraw accumulated ETH

## Security Notes
- The contract owner can withdraw all ETH from the contract
- Each mint costs exactly 0.005 ETH
- Token URIs are set during minting and cannot be changed later
- The contract uses OpenZeppelin's secure ERC-721 implementation

## Testing
Before deploying to Base mainnet, test on Base Sepolia testnet:
```bash
npx hardhat run scripts/deploy.js --network baseSepolia
```

## Verification
After deployment, verify your contract on Basescan:
```bash
npx hardhat verify --network base DEPLOYED_CONTRACT_ADDRESS
```

For Base Sepolia:
```bash
npx hardhat verify --network baseSepolia DEPLOYED_CONTRACT_ADDRESS
```

## Gas Optimization
Base network typically has much lower gas fees than Ethereum mainnet. The deployment and minting costs will be significantly lower.

## Bridge Information
To move ETH between Ethereum and Base:
- **Ethereum → Base**: Use https://bridge.base.org
- **Base → Ethereum**: Use the same bridge (7-day withdrawal period applies)

## Support
- Base Documentation: https://docs.base.org
- Base Discord: https://discord.gg/buildonbase
- Base Twitter: @BuildOnBase 