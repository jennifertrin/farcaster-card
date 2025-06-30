const hre = require("hardhat");

async function main() {
  const [deployer] = await hre.ethers.getSigners();
  
  console.log("=== Base Sepolia Testnet ETH Information ===");
  console.log("Account:", deployer.address);
  console.log("Account balance:", hre.ethers.formatEther(await deployer.provider.getBalance(deployer.address)), "ETH");
  
  console.log("\n=== How to get Base Sepolia testnet ETH ===");
  console.log("1. Visit: https://www.coinbase.com/faucets/base-ethereum-goerli-faucet");
  console.log("2. Connect your wallet");
  console.log("3. Request testnet ETH");
  console.log("4. Wait for the transaction to be processed");
  
  console.log("\n=== Alternative faucets ===");
  console.log("- Alchemy: https://www.alchemy.com/faucets/base-sepolia-faucet");
  console.log("- QuickNode: https://faucet.quicknode.com/base-sepolia");
  
  console.log("\n=== Bridge to Base Mainnet ===");
  console.log("When ready for mainnet deployment:");
  console.log("1. Visit: https://bridge.base.org");
  console.log("2. Bridge ETH from Ethereum mainnet to Base");
  console.log("3. Use the bridged ETH for deployment");
}

main()
  .then(() => process.exit(0))
  .catch((error) => {
    console.error(error);
    process.exit(1);
  }); 