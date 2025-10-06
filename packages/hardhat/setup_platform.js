const { ethers } = require("ethers");

// U2U Solaris Mainnet configuration
const U2U_RPC_URL = "https://rpc-mainnet.u2u.xyz";
const U2U_EXPLORER = "https://u2uscan.xyz";

const privateKey = "0x444349490b70d2df124051cf3acf5ad5c69a93202d4fb2ded0f5f8215609e3c1";
const provider = new ethers.JsonRpcProvider(U2U_RPC_URL);
const wallet = new ethers.Wallet(privateKey, provider);

// Contract addresses from deployment
const SAFETokenAddress = "0x996cEB391a85d36CDD1e2e838A5dE4049A407db1";
const VaultSystemAddress = "0x09A16F146D9CF82083f181E6238CDF8Be8E8f43F";

async function setupPlatform() {
  console.log("🔗 Setting up platform contract in SAFE token...");
  
  try {
    // Load SAFEToken contract
    const safeTokenArtifact = require("./artifacts/contracts/SAFEToken.sol/SAFEToken.json");
    const safeTokenContract = new ethers.Contract(
      SAFETokenAddress,
      safeTokenArtifact.abi,
      wallet
    );
    
    // Set platform contract
    const tx = await safeTokenContract.setPlatformContract(VaultSystemAddress);
    console.log("⏳ Transaction submitted:", tx.hash);
    console.log("🔗 View on U2UScan:", `${U2U_EXPLORER}/tx/${tx.hash}`);
    
    await tx.wait();
    console.log("✅ Platform contract set successfully!");
    
    // Verify the setting
    const platformContract = await safeTokenContract.platformContract();
    console.log("📍 Platform contract address:", platformContract);
    
  } catch (error) {
    console.error("❌ Failed to set platform contract:", error.message);
  }
}

setupPlatform();
