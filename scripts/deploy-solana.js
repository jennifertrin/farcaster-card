const { Connection, Keypair, LAMPORTS_PER_SOL, PublicKey } = require('@solana/web3.js');
const { Program, AnchorProvider, web3, utils, BN } = require('@coral-xyz/anchor');
const fs = require('fs');
const path = require('path');

// Load the program IDL
const idl = require('../target/idl/farcaster_pro_nft.json');

// Program ID
const PROGRAM_ID = new PublicKey('FarcasterProNFT111111111111111111111111111111111');

async function main() {
  console.log('Deploying Farcaster Pro NFT Solana program...');

  // Connect to devnet
  const connection = new Connection('https://api.devnet.solana.com', 'confirmed');
  
  // Load or create a keypair for deployment
  let deployerKeypair;
  const keypairPath = path.join(__dirname, '../keypair.json');
  
  if (fs.existsSync(keypairPath)) {
    const keypairData = JSON.parse(fs.readFileSync(keypairPath, 'utf8'));
    deployerKeypair = Keypair.fromSecretKey(new Uint8Array(keypairData));
    console.log('Loaded existing keypair');
  } else {
    deployerKeypair = Keypair.generate();
    fs.writeFileSync(keypairPath, JSON.stringify(Array.from(deployerKeypair.secretKey)));
    console.log('Generated new keypair and saved to keypair.json');
  }

  // Check balance
  const balance = await connection.getBalance(deployerKeypair.publicKey);
  console.log(`Deployer balance: ${balance / LAMPORTS_PER_SOL} SOL`);

  if (balance < LAMPORTS_PER_SOL) {
    console.log('Requesting airdrop...');
    const airdropSignature = await connection.requestAirdrop(
      deployerKeypair.publicKey,
      2 * LAMPORTS_PER_SOL
    );
    await connection.confirmTransaction(airdropSignature);
    console.log('Airdrop received');
  }

  // Create provider
  const provider = new AnchorProvider(
    connection,
    { publicKey: deployerKeypair.publicKey, signTransaction: (tx) => tx.sign(deployerKeypair) },
    { commitment: 'confirmed' }
  );

  // Create program instance
  const program = new Program(idl, PROGRAM_ID, provider);

  console.log('Program instance created');
  console.log('Program ID:', PROGRAM_ID.toString());
  console.log('Deployer public key:', deployerKeypair.publicKey.toString());

  // Note: In a real deployment, you would build and deploy the program here
  // For now, we'll just output the configuration
  console.log('\nDeployment configuration ready!');
  console.log('To deploy the program:');
  console.log('1. Build the program: anchor build');
  console.log('2. Deploy to devnet: anchor deploy --provider.cluster devnet');
  console.log('3. Update the program ID in your client code if needed');
}

main().catch((error) => {
  console.error('Error:', error);
  process.exit(1);
}); 