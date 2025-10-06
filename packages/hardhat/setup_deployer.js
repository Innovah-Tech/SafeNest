const { ethers } = require("ethers");
const fs = require("fs");

async function setupDeployer() {
  const privateKey = "0x444349490b70d2df124051cf3acf5ad5c69a93202d4fb2ded0f5f8215609e3c1";
  const password = "deploy123"; // Simple password for deployment
  
  try {
    const wallet = new ethers.Wallet(privateKey);
    const encryptedJson = await wallet.encrypt(password);
    
    const envContent = `DEPLOYER_PRIVATE_KEY_ENCRYPTED=${encryptedJson}`;
    
    fs.writeFileSync("./.env", envContent);
    console.log("✅ Deployer account setup complete!");
    console.log("📍 Wallet address:", wallet.address);
    console.log("🔑 Encrypted key saved to .env file");
  } catch (error) {
    console.error("❌ Error setting up deployer:", error);
  }
}

setupDeployer();
