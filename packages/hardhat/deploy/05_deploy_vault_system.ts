import { HardhatRuntimeEnvironment } from "hardhat/types";
import { DeployFunction } from "hardhat-deploy/types";
import { Contract } from "ethers";

const deployVaultSystem: DeployFunction = async function (hre: HardhatRuntimeEnvironment) {
  const { deployer } = await hre.getNamedAccounts();
  const { deploy } = hre.deployments;

  console.log("🚀 Deploying VaultSystem contract...");

  // Get SAFEToken address
  const safeToken = await hre.deployments.get("SAFEToken");

  await deploy("VaultSystem", {
    from: deployer,
    args: [safeToken.address],
    log: true,
    autoMine: true,
  });

  // Get deployed contract
  const vaultSystemContract = await hre.ethers.getContract<Contract>("VaultSystem", deployer);
  const safeTokenContract = await hre.ethers.getContract<Contract>("SAFEToken", deployer);

  // Set platform contract in SAFE token
  console.log("🔗 Setting platform contract in SAFE token...");
  await safeTokenContract.setPlatformContract(vaultSystemContract.target);

  console.log("✅ VaultSystem deployed successfully!");
  console.log("🏦 Contract Address:", vaultSystemContract.target);
  console.log("📊 Platform Name:", await vaultSystemContract.platformName());
  console.log("🎯 Protocol Fee Rate:", await vaultSystemContract.protocolFeeRate());
  console.log("🚨 Emergency Withdrawal Fee:", await vaultSystemContract.emergencyWithdrawalFee());
  console.log("💰 Pension Yield Boost:", await vaultSystemContract.pensionYieldBoost());
  console.log("📈 Micro-Savings Yield Boost:", await vaultSystemContract.microSavingsYieldBoost());
  console.log("🛡️ Emergency Incentive Rate:", await vaultSystemContract.emergencyIncentiveRate());
};

export default deployVaultSystem;
deployVaultSystem.tags = ["VaultSystem"];
deployVaultSystem.dependencies = ["SAFEToken"];
