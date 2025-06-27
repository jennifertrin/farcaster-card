# NFT Contract Deployment Instructions

## Overview
This document provides instructions for deploying the Farcaster Pro NFT smart contract to Ethereum mainnet.

## Smart Contract Details
- **Contract Name**: FarcasterProNFT
- **Token Name**: Farcaster Pro Membership Card
- **Token Symbol**: FARPRO
- **Mint Price**: 0.005 ETH
- **Standard**: ERC-721

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
    mainnet: {
      url: process.env.MAINNET_RPC_URL,
      accounts: [process.env.PRIVATE_KEY],
    },
  },
};
```

### 5. Set Environment Variables
Create a `.env` file:
```
MAINNET_RPC_URL=your_mainnet_rpc_url
PRIVATE_KEY=your_wallet_private_key
```

### 6. Deploy Contract
```bash
npx hardhat run scripts/deploy.js --network mainnet
```

### 7. Update Contract Address
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
Before deploying to mainnet, test on a testnet:
```bash
npx hardhat run scripts/deploy.js --network sepolia
```

## Verification
After deployment, verify your contract on Etherscan:
```bash
npx hardhat verify --network mainnet DEPLOYED_CONTRACT_ADDRESS
``` 