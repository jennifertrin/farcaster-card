const hre = require("hardhat");

async function main() {
  console.log("Deploying FarcasterProNFT contract...");

  const FarcasterProNFT = await hre.ethers.getContractFactory("FarcasterProNFT");
  const farcasterProNFT = await FarcasterProNFT.deploy();

  // Wait for deployment to complete
  await farcasterProNFT.waitForDeployment();

  const address = await farcasterProNFT.getAddress();
  console.log("FarcasterProNFT deployed to:", address);
  
  // Add a small delay to ensure the contract is fully deployed
  await new Promise(resolve => setTimeout(resolve, 1000));
  
  console.log("Contract owner:", await farcasterProNFT.owner());
  console.log("Mint price:", hre.ethers.formatEther(await farcasterProNFT.MINT_PRICE()), "ETH");
}

main()
  .then(() => process.exit(0))
  .catch((error) => {
    console.error(error);
    process.exit(1);
  });