import { HardhatRuntimeEnvironment } from "hardhat/types";
import { DeployFunction } from "hardhat-deploy/types";
import { Contract } from "ethers";
import { ethers } from "hardhat";

/**
 * Deploys the SimpleMicroSavings contract
 *
 * @param hre HardhatRuntimeEnvironment object.
 */
const deploySimpleMicroSavings: DeployFunction = async function (hre: HardhatRuntimeEnvironment) {
  const { deployer } = await hre.getNamedAccounts();
  const { deploy } = hre.deployments;

  console.log("🚀 Deploying SimpleMicroSavings...");

  // Deploy SimpleMicroSavings contract
  const simpleMicroSavings = await deploy("SimpleMicroSavings", {
    from: deployer,
    args: [],
    log: true,
    autoMine: true,
  });

  // Get deployed contract
  const simpleMicroSavingsContract = await hre.ethers.getContract<Contract>("SimpleMicroSavings", deployer);

  // Note: Investment strategies will be added by the owner after deployment
  console.log("📈 Ready to add investment strategies...");

  console.log("✅ SimpleMicroSavings deployed successfully!");
  console.log("💰 Contract Address:", simpleMicroSavings.address);
  console.log("📊 Platform Name:", await simpleMicroSavingsContract.platformName());
  console.log("🎯 Platform Fee Rate:", await simpleMicroSavingsContract.platformFeeRate());
};

export default deploySimpleMicroSavings;

deploySimpleMicroSavings.tags = ["SimpleMicroSavings"];
