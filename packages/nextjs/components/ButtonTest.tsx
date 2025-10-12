"use client";

import { useState } from "react";
import { useAccount, useWriteContract } from "wagmi";

const ButtonTest = () => {
  const { address: connectedAddress } = useAccount();
  const { writeContract, isPending, isSuccess, error } = useWriteContract();
  const [testAmount, setTestAmount] = useState("0.001");

  const testVaultDeposit = async () => {
    if (!connectedAddress) return;

    try {
      await writeContract({
        address: "0x09A16F146D9CF82083f181E6238CDF8Be8E8f43F", // VaultSystem
        abi: [
          {
            inputs: [
              { internalType: "enum VaultSystem.VaultType", name: "_vaultType", type: "uint8" },
              { internalType: "uint256", name: "_amount", type: "uint256" },
            ],
            name: "depositToVault",
            outputs: [],
            stateMutability: "payable",
            type: "function",
          },
        ],
        functionName: "depositToVault",
        args: [0, BigInt(parseFloat(testAmount) * 1e18)], // Micro-savings vault
        value: BigInt(parseFloat(testAmount) * 1e18),
      });
    } catch (err) {
      console.error("Test failed:", err);
    }
  };

  const testSafeTokenStake = async () => {
    if (!connectedAddress) return;

    try {
      await writeContract({
        address: "0x996cEB391a85d36CDD1e2e838A5dE4049A407db1", // SAFEToken
        abi: [
          {
            inputs: [
              { internalType: "uint256", name: "_amount", type: "uint256" },
              { internalType: "uint256", name: "_lockPeriod", type: "uint256" },
            ],
            name: "stake",
            outputs: [],
            stateMutability: "nonpayable",
            type: "function",
          },
        ],
        functionName: "stake",
        args: [
          BigInt(parseFloat(testAmount) * 1e18),
          BigInt(30 * 24 * 60 * 60), // 30 days
        ],
      });
    } catch (err) {
      console.error("Test failed:", err);
    }
  };

  const testCommunityPoolJoin = async () => {
    if (!connectedAddress) return;

    try {
      await writeContract({
        address: "0x8DaC034C5Ed072630789aF53a39A090f477bE7e2", // CommunityPools
        abi: [
          {
            inputs: [{ internalType: "uint256", name: "_poolId", type: "uint256" }],
            name: "joinPool",
            outputs: [],
            stateMutability: "nonpayable",
            type: "function",
          },
        ],
        functionName: "joinPool",
        args: [BigInt(1)], // Join pool 1
      });
    } catch (err) {
      console.error("Test failed:", err);
    }
  };

  if (!connectedAddress) {
    return (
      <div className="card bg-base-100 shadow-xl">
        <div className="card-body">
          <h2 className="card-title">Button Test</h2>
          <p>Please connect your wallet to test buttons</p>
        </div>
      </div>
    );
  }

  return (
    <div className="card bg-base-100 shadow-xl">
      <div className="card-body">
        <h2 className="card-title">Button Functionality Test</h2>
        <p className="text-sm text-gray-600 mb-4">Test if the contract interaction buttons work correctly</p>

        <div className="form-control mb-4">
          <label className="label">
            <span className="label-text">Test Amount (U2U)</span>
          </label>
          <input
            type="number"
            placeholder="0.001"
            className="input input-bordered"
            value={testAmount}
            onChange={e => setTestAmount(e.target.value)}
          />
        </div>

        <div className="space-y-3">
          <button className="btn btn-primary w-full" onClick={testVaultDeposit} disabled={isPending}>
            {isPending ? "Testing..." : "Test Vault Deposit"}
          </button>

          <button className="btn btn-secondary w-full" onClick={testSafeTokenStake} disabled={isPending}>
            {isPending ? "Testing..." : "Test SAFE Token Stake"}
          </button>

          <button className="btn btn-accent w-full" onClick={testCommunityPoolJoin} disabled={isPending}>
            {isPending ? "Testing..." : "Test Community Pool Join"}
          </button>
        </div>

        {isSuccess && (
          <div className="alert alert-success mt-4">
            <span>✅ Transaction successful!</span>
          </div>
        )}

        {error && (
          <div className="alert alert-error mt-4">
            <span>❌ Error: {error.message}</span>
          </div>
        )}

        <div className="text-xs text-gray-500 mt-4">
          <p>
            <strong>Note:</strong> These are real transactions on U2U Solaris mainnet.
          </p>
          <p>Make sure you have U2U tokens and are connected to the correct network.</p>
        </div>
      </div>
    </div>
  );
};

export default ButtonTest;
