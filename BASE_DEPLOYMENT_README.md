# Base Network NFT Deployment Guide

## Quick Start

This guide will help you deploy your Farcaster Pro NFT contract to Base network (Coinbase's L2).

### Prerequisites
- Node.js and npm installed
- A wallet with ETH (for mainnet) or testnet ETH (for testing)
- Basic knowledge of Hardhat and smart contracts

### Step 1: Setup Environment

1. **Install dependencies** (if not already done):
```bash
npm install
```

2. **Create environment file**:
```bash
cp .env.example .env
```

3. **Add your private key to `.env`**:
```
PRIVATE_KEY=your_wallet_private_key_here
```

### Step 2: Get Testnet ETH (for testing)

Run the helper script to get information about testnet ETH:
```bash
npx hardhat run scripts/get-testnet-eth.js --network baseSepolia
```

Follow the instructions to get Base Sepolia testnet ETH from the faucet.

### Step 3: Test Deployment

Deploy to Base Sepolia testnet first:
```bash
npx hardhat run scripts/deploy.js --network baseSepolia
```

This will output your contract address. Save it for the next step.

### Step 4: Update Contract Address

Update the contract address in `src/utils/nftMinting.ts`:
```typescript
export const NFT_CONTRACT_ADDRESS = 'YOUR_DEPLOYED_CONTRACT_ADDRESS'
```

### Step 5: Test Minting

1. Start your development server:
```bash
npm run dev
```

2. Test the minting functionality on Base Sepolia

### Step 6: Deploy to Base Mainnet

1. **Bridge ETH to Base**:
   - Visit https://bridge.base.org
   - Bridge ETH from Ethereum mainnet to Base

2. **Deploy to Base mainnet**:
```bash
npx hardhat run scripts/deploy.js --network base
```

3. **Update the contract address** in `src/utils/nftMinting.ts` with the mainnet address

4. **Verify your contract**:
```bash
npx hardhat verify --network base YOUR_CONTRACT_ADDRESS
```

## Network Configuration

The project is now configured for Base network:

- **Wagmi Config** (`src/lib/wagmi.ts`): Uses Base network
- **Hardhat Config** (`hardhat.config.js`): Includes Base and Base Sepolia networks
- **NFT Minting** (`src/utils/nftMinting.ts`): Configured for Base deployment

## Benefits of Base Network

- **Lower Gas Fees**: Significantly cheaper than Ethereum mainnet
- **Fast Transactions**: L2 scaling solution
- **Ethereum Compatibility**: Same tooling and standards as Ethereum
- **Coinbase Backing**: Built by Coinbase, reliable infrastructure

## Troubleshooting

### Common Issues

1. **Insufficient Balance**:
   - For testnet: Get ETH from faucet
   - For mainnet: Bridge ETH from Ethereum

2. **Transaction Failed**:
   - Check gas limits
   - Ensure sufficient balance
   - Verify network configuration

3. **Contract Verification Failed**:
   - Ensure all constructor parameters are correct
   - Check if contract is already verified

### Support Resources

- [Base Documentation](https://docs.base.org)
- [Base Discord](https://discord.gg/buildonbase)
- [Base Bridge](https://bridge.base.org)
- [Basescan](https://basescan.org)

## Gas Costs

Typical gas costs on Base:
- **Contract Deployment**: ~0.001-0.005 ETH
- **NFT Minting**: ~0.0001-0.0005 ETH
- **Withdrawal**: ~0.0001-0.0003 ETH

*Note: Gas costs are much lower than Ethereum mainnet*

## Security Considerations

- Keep your private key secure
- Test thoroughly on testnet before mainnet
- Verify your contract after deployment
- Consider using a multisig wallet for contract ownership 