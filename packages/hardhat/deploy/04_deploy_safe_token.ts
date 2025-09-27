import { HardhatRuntimeEnvironment } from "hardhat/types";
import { DeployFunction } from "hardhat-deploy/types";
import { Contract } from "ethers";

const deploySAFEToken: DeployFunction = async function (hre: HardhatRuntimeEnvironment) {
  const { deployer } = await hre.getNamedAccounts();
  const { deploy } = hre.deployments;

  console.log("🚀 Deploying SAFEToken contract...");

  await deploy("SAFEToken", {
    from: deployer,
    args: [],
    log: true,
    autoMine: true,
  });

  // Get deployed contract
  const safeTokenContract = await hre.ethers.getContract<Contract>("SAFEToken", deployer);

  console.log("✅ SAFEToken deployed successfully!");
  console.log("🪙 Contract Address:", safeTokenContract.target);
  console.log("📊 Token Name:", await safeTokenContract.name());
  console.log("🔤 Token Symbol:", await safeTokenContract.symbol());
  console.log("📈 Total Supply:", await safeTokenContract.TOTAL_SUPPLY());
  console.log("🎯 Min Stake for Voting:", await safeTokenContract.MIN_STAKE_FOR_VOTING());
  console.log("💎 Premium Vault Stake:", await safeTokenContract.PREMIUM_VAULT_STAKE());
};

export default deploySAFEToken;
deploySAFEToken.tags = ["SAFEToken"];
