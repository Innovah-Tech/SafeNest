const { ethers } = require("ethers");
const fs = require("fs");
const path = require("path");

// U2U Solaris Mainnet configuration
const U2U_RPC_URL = "https://rpc-mainnet.u2u.xyz";
const U2U_CHAIN_ID = 39;
const U2U_EXPLORER = "https://u2uscan.xyz";

const privateKey = "0x444349490b70d2df124051cf3acf5ad5c69a93202d4fb2ded0f5f8215609e3c1";
const provider = new ethers.JsonRpcProvider(U2U_RPC_URL);
const wallet = new ethers.Wallet(privateKey, provider);

// Contract artifacts
const contractArtifacts = {
  "SafeNest": require("./artifacts/contracts/YourContract.sol/SafeNest.json"),
  "SAFEToken": require("./artifacts/contracts/SAFEToken.sol/SAFEToken.json"),
  "VaultSystem": require("./artifacts/contracts/VaultSystem.sol/VaultSystem.json"),
  "MicroSavings": require("./artifacts/contracts/MicroSavings.sol/MicroSavings.json"),
  "SimpleMicroSavings": require("./artifacts/contracts/SimpleMicroSavings.sol/SimpleMicroSavings.json"),
  "CommunityPools": require("./artifacts/contracts/CommunityPools.sol/CommunityPools.json"),
  "CommunityPoolsAdvanced": require("./artifacts/contracts/CommunityPoolsAdvanced.sol/CommunityPoolsAdvanced.json"),
  "INCLToken": require("./artifacts/contracts/INCLToken.sol/INCLToken.json")
};

async function deployContract(contractName, constructorArgs = []) {
  console.log(`\n🚀 Deploying ${contractName}...`);
  
  const contractArtifact = contractArtifacts[contractName];
  if (!contractArtifact) {
    console.log(`❌ Contract artifact not found for ${contractName}`);
    return null;
  }
  
  try {
    const factory = new ethers.ContractFactory(
      contractArtifact.abi,
      contractArtifact.bytecode,
      wallet
    );
    
    const contract = await factory.deploy(...constructorArgs);
    await contract.waitForDeployment();
    const address = await contract.getAddress();
    
    console.log(`✅ ${contractName} deployed to: ${address}`);
    console.log(`🔗 View on U2UScan: ${U2U_EXPLORER}/address/${address}`);
    
    return address;
  } catch (error) {
    console.error(`❌ Failed to deploy ${contractName}:`, error.message);
    return null;
  }
}

async function main() {
  const contractToDeploy = process.argv[2];
  
  if (!contractToDeploy) {
    console.log("Usage: node deploy_single.js <ContractName>");
    console.log("Available contracts:");
    Object.keys(contractArtifacts).forEach(name => console.log(`  - ${name}`));
    return;
  }
  
  console.log("🚀 Deploying to U2U Solaris Mainnet...");
  console.log("📍 Deployer address:", wallet.address);
  console.log("🌐 Network: U2U Solaris (Chain ID: 39)");
  
  const balance = await provider.getBalance(wallet.address);
  console.log("💰 U2U Balance:", ethers.formatEther(balance), "U2U");
  
  let address;
  
  switch (contractToDeploy) {
    case "SafeNest":
      address = await deployContract("SafeNest");
      break;
    case "SAFEToken":
      address = await deployContract("SAFEToken");
      break;
    case "VaultSystem":
      // Need SAFEToken address first
      const safeTokenAddress = process.argv[3];
      if (!safeTokenAddress) {
        console.log("❌ VaultSystem requires SAFEToken address as second argument");
        console.log("Usage: node deploy_single.js VaultSystem <SAFETokenAddress>");
        return;
      }
      address = await deployContract("VaultSystem", [safeTokenAddress]);
      break;
    case "MicroSavings":
      address = await deployContract("MicroSavings");
      break;
    case "SimpleMicroSavings":
      address = await deployContract("SimpleMicroSavings");
      break;
    case "CommunityPools":
      address = await deployContract("CommunityPools");
      break;
    case "CommunityPoolsAdvanced":
      address = await deployContract("CommunityPoolsAdvanced");
      break;
    case "INCLToken":
      address = await deployContract("INCLToken");
      break;
    default:
      console.log(`❌ Unknown contract: ${contractToDeploy}`);
      return;
  }
  
  if (address) {
    console.log(`\n🎉 ${contractToDeploy} deployed successfully!`);
    console.log(`📍 Address: ${address}`);
    console.log(`🔗 Explorer: ${U2U_EXPLORER}/address/${address}`);
  }
}

main().catch(console.error);
