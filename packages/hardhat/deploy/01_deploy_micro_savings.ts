import { HardhatRuntimeEnvironment } from "hardhat/types";
import { DeployFunction } from "hardhat-deploy/types";
import { Contract } from "ethers";
import { ethers } from "hardhat";

/**
 * Deploys the MicroSavings ecosystem contracts
 *
 * @param hre HardhatRuntimeEnvironment object.
 */
const deployMicroSavings: DeployFunction = async function (hre: HardhatRuntimeEnvironment) {
  const { deployer } = await hre.getNamedAccounts();
  const { deploy } = hre.deployments;

  console.log("🚀 Deploying MicroSavings ecosystem...");

  // Deploy INCL Token first
  console.log("📝 Deploying INCL Token...");
  const inclToken = await deploy("INCLToken", {
    from: deployer,
    args: [],
    log: true,
    autoMine: true,
  });

  // Deploy MicroSavings contract
  console.log("💰 Deploying MicroSavings contract...");
  const microSavings = await deploy("MicroSavings", {
    from: deployer,
    args: [],
    log: true,
    autoMine: true,
  });

  // Deploy CommunityPools contract
  console.log("👥 Deploying CommunityPools contract...");
  const communityPools = await deploy("CommunityPools", {
    from: deployer,
    args: [],
    log: true,
    autoMine: true,
  });

  // Get deployed contracts
  const inclTokenContract = await hre.ethers.getContract<Contract>("INCLToken", deployer);
  const microSavingsContract = await hre.ethers.getContract<Contract>("MicroSavings", deployer);
  const communityPoolsContract = await hre.ethers.getContract<Contract>("CommunityPools", deployer);

  // Set platform contract address for INCL token
  console.log("🔗 Setting platform contract address...");
  await inclTokenContract.setPlatformContract(microSavingsContract.target);

  // Note: Stablecoins and investment strategies will be added by the owner after deployment
  console.log("💱 Ready to add stablecoins and investment strategies...");

  console.log("✅ MicroSavings ecosystem deployed successfully!");
  console.log("🏠 INCL Token:", inclToken.address);
  console.log("💰 MicroSavings:", microSavings.address);
  console.log("👥 CommunityPools:", communityPools.address);
  console.log("📊 Total INCL Supply:", await inclTokenContract.totalSupply());
  console.log("🎯 Platform Fee Rate:", await microSavingsContract.platformFeeRate());
};

export default deployMicroSavings;

deployMicroSavings.tags = ["MicroSavings", "INCLToken", "CommunityPools"];
