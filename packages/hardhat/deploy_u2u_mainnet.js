const { ethers } = require("ethers");
const fs = require("fs");
const path = require("path");

// U2U Solaris Mainnet configuration
const U2U_RPC_URL = "https://rpc-mainnet.u2u.xyz";
const U2U_CHAIN_ID = 39;
const U2U_EXPLORER = "https://u2uscan.xyz";

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

async function deployToU2UMainnet() {
  const privateKey = "0x444349490b70d2df124051cf3acf5ad5c69a93202d4fb2ded0f5f8215609e3c1";
  const provider = new ethers.JsonRpcProvider(U2U_RPC_URL);
  const wallet = new ethers.Wallet(privateKey, provider);
  
  console.log("🚀 Deploying SafeNest contracts to U2U Solaris Mainnet...");
  console.log("📍 Deployer address:", wallet.address);
  console.log("🌐 Network: U2U Solaris (Chain ID: 39)");
  console.log("🔍 Explorer:", U2U_EXPLORER);
  
  // Check balance
  const balance = await provider.getBalance(wallet.address);
  console.log("💰 U2U Balance:", ethers.formatEther(balance), "U2U");
  
  if (balance < ethers.parseEther("0.001")) {
    console.log("❌ Insufficient U2U balance for deployment. Need at least 0.001 U2U");
    console.log("💡 Get U2U tokens from exchanges or faucet");
    return;
  }
  
  const deployedContracts = {};
  
  try {
    // 1. Deploy SafeNest
    console.log("\n📦 Deploying SafeNest...");
    const safeNestFactory = new ethers.ContractFactory(
      contractArtifacts.SafeNest.abi,
      contractArtifacts.SafeNest.bytecode,
      wallet
    );
    const safeNest = await safeNestFactory.deploy();
    await safeNest.waitForDeployment();
    deployedContracts.SafeNest = await safeNest.getAddress();
    console.log("✅ SafeNest deployed to:", deployedContracts.SafeNest);
    console.log("🔗 View on U2UScan:", `${U2U_EXPLORER}/address/${deployedContracts.SafeNest}`);
    
    // 2. Deploy SAFEToken
    console.log("\n🪙 Deploying SAFEToken...");
    const safeTokenFactory = new ethers.ContractFactory(
      contractArtifacts.SAFEToken.abi,
      contractArtifacts.SAFEToken.bytecode,
      wallet
    );
    const safeToken = await safeTokenFactory.deploy();
    await safeToken.waitForDeployment();
    deployedContracts.SAFEToken = await safeToken.getAddress();
    console.log("✅ SAFEToken deployed to:", deployedContracts.SAFEToken);
    console.log("🔗 View on U2UScan:", `${U2U_EXPLORER}/address/${deployedContracts.SAFEToken}`);
    
    // 3. Deploy VaultSystem
    console.log("\n🏦 Deploying VaultSystem...");
    const vaultSystemFactory = new ethers.ContractFactory(
      contractArtifacts.VaultSystem.abi,
      contractArtifacts.VaultSystem.bytecode,
      wallet
    );
    const vaultSystem = await vaultSystemFactory.deploy(deployedContracts.SAFEToken);
    await vaultSystem.waitForDeployment();
    deployedContracts.VaultSystem = await vaultSystem.getAddress();
    console.log("✅ VaultSystem deployed to:", deployedContracts.VaultSystem);
    console.log("🔗 View on U2UScan:", `${U2U_EXPLORER}/address/${deployedContracts.VaultSystem}`);
    
    // 4. Deploy MicroSavings
    console.log("\n💰 Deploying MicroSavings...");
    const microSavingsFactory = new ethers.ContractFactory(
      contractArtifacts.MicroSavings.abi,
      contractArtifacts.MicroSavings.bytecode,
      wallet
    );
    const microSavings = await microSavingsFactory.deploy();
    await microSavings.waitForDeployment();
    deployedContracts.MicroSavings = await microSavings.getAddress();
    console.log("✅ MicroSavings deployed to:", deployedContracts.MicroSavings);
    console.log("🔗 View on U2UScan:", `${U2U_EXPLORER}/address/${deployedContracts.MicroSavings}`);
    
    // 5. Deploy SimpleMicroSavings
    console.log("\n💳 Deploying SimpleMicroSavings...");
    const simpleMicroSavingsFactory = new ethers.ContractFactory(
      contractArtifacts.SimpleMicroSavings.abi,
      contractArtifacts.SimpleMicroSavings.bytecode,
      wallet
    );
    const simpleMicroSavings = await simpleMicroSavingsFactory.deploy();
    await simpleMicroSavings.waitForDeployment();
    deployedContracts.SimpleMicroSavings = await simpleMicroSavings.getAddress();
    console.log("✅ SimpleMicroSavings deployed to:", deployedContracts.SimpleMicroSavings);
    console.log("🔗 View on U2UScan:", `${U2U_EXPLORER}/address/${deployedContracts.SimpleMicroSavings}`);
    
    // 6. Deploy CommunityPools
    console.log("\n👥 Deploying CommunityPools...");
    const communityPoolsFactory = new ethers.ContractFactory(
      contractArtifacts.CommunityPools.abi,
      contractArtifacts.CommunityPools.bytecode,
      wallet
    );
    const communityPools = await communityPoolsFactory.deploy();
    await communityPools.waitForDeployment();
    deployedContracts.CommunityPools = await communityPools.getAddress();
    console.log("✅ CommunityPools deployed to:", deployedContracts.CommunityPools);
    console.log("🔗 View on U2UScan:", `${U2U_EXPLORER}/address/${deployedContracts.CommunityPools}`);
    
    // 7. Deploy CommunityPoolsAdvanced
    console.log("\n🏛️ Deploying CommunityPoolsAdvanced...");
    const communityPoolsAdvancedFactory = new ethers.ContractFactory(
      contractArtifacts.CommunityPoolsAdvanced.abi,
      contractArtifacts.CommunityPoolsAdvanced.bytecode,
      wallet
    );
    const communityPoolsAdvanced = await communityPoolsAdvancedFactory.deploy();
    await communityPoolsAdvanced.waitForDeployment();
    deployedContracts.CommunityPoolsAdvanced = await communityPoolsAdvanced.getAddress();
    console.log("✅ CommunityPoolsAdvanced deployed to:", deployedContracts.CommunityPoolsAdvanced);
    console.log("🔗 View on U2UScan:", `${U2U_EXPLORER}/address/${deployedContracts.CommunityPoolsAdvanced}`);
    
    // 8. Deploy INCLToken
    console.log("\n🌍 Deploying INCLToken...");
    const inclTokenFactory = new ethers.ContractFactory(
      contractArtifacts.INCLToken.abi,
      contractArtifacts.INCLToken.bytecode,
      wallet
    );
    const inclToken = await inclTokenFactory.deploy();
    await inclToken.waitForDeployment();
    deployedContracts.INCLToken = await inclToken.getAddress();
    console.log("✅ INCLToken deployed to:", deployedContracts.INCLToken);
    console.log("🔗 View on U2UScan:", `${U2U_EXPLORER}/address/${deployedContracts.INCLToken}`);
    
    // Set platform contract in SAFE token
    console.log("\n🔗 Setting platform contract in SAFE token...");
    const safeTokenContract = new ethers.Contract(
      deployedContracts.SAFEToken,
      contractArtifacts.SAFEToken.abi,
      wallet
    );
    await safeTokenContract.setPlatformContract(deployedContracts.VaultSystem);
    console.log("✅ Platform contract set successfully");
    
    // Save deployment info
    const deploymentInfo = {
      network: "u2uSolaris",
      chainId: U2U_CHAIN_ID,
      rpcUrl: U2U_RPC_URL,
      explorer: U2U_EXPLORER,
      deployer: wallet.address,
      contracts: deployedContracts,
      timestamp: new Date().toISOString()
    };
    
    const deploymentsDir = "./deployments/u2uSolaris";
    if (!fs.existsSync(deploymentsDir)) {
      fs.mkdirSync(deploymentsDir, { recursive: true });
    }
    
    fs.writeFileSync(
      path.join(deploymentsDir, "deployment.json"),
      JSON.stringify(deploymentInfo, null, 2)
    );
    
    console.log("\n🎉 All contracts deployed successfully to U2U Solaris Mainnet!");
    console.log("\n📋 Deployment Summary:");
    console.log("=".repeat(60));
    console.log(`🌐 Network: U2U Solaris (Chain ID: ${U2U_CHAIN_ID})`);
    console.log(`📍 Deployer: ${wallet.address}`);
    console.log(`🔍 Explorer: ${U2U_EXPLORER}`);
    console.log("=".repeat(60));
    Object.entries(deployedContracts).forEach(([name, address]) => {
      console.log(`${name}: ${address}`);
    });
    console.log("=".repeat(60));
    console.log("\n📄 Deployment info saved to: ./deployments/u2uSolaris/deployment.json");
    console.log("\n🔗 View all contracts on U2UScan:");
    Object.entries(deployedContracts).forEach(([name, address]) => {
      console.log(`${name}: ${U2U_EXPLORER}/address/${address}`);
    });
    
  } catch (error) {
    console.error("❌ Deployment failed:", error);
  }
}

deployToU2UMainnet();
