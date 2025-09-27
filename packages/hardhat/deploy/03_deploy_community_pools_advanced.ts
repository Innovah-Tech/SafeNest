import { HardhatRuntimeEnvironment } from "hardhat/types";
import { DeployFunction } from "hardhat-deploy/types";
import { Contract } from "ethers";

const deployCommunityPoolsAdvanced: DeployFunction = async function (hre: HardhatRuntimeEnvironment) {
  const { deployer } = await hre.getNamedAccounts();
  const { deploy } = hre.deployments;

  console.log("🚀 Deploying CommunityPoolsAdvanced contract...");

  await deploy("CommunityPoolsAdvanced", {
    from: deployer,
    args: [],
    log: true,
    autoMine: true,
  });

  // Get deployed contract
  const communityPoolsAdvancedContract = await hre.ethers.getContract<Contract>("CommunityPoolsAdvanced", deployer);

  console.log("✅ CommunityPoolsAdvanced deployed successfully!");
  console.log("👥 Contract Address:", communityPoolsAdvancedContract.target);
  console.log("📊 Platform Name:", await communityPoolsAdvancedContract.platformName());
  console.log("🎯 Platform Fee Rate:", await communityPoolsAdvancedContract.platformFeeRate());
  console.log("⭐ Reputation Threshold:", await communityPoolsAdvancedContract.reputationThreshold());
};

export default deployCommunityPoolsAdvanced;
deployCommunityPoolsAdvanced.tags = ["CommunityPoolsAdvanced"];
