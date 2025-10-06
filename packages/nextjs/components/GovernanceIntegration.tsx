"use client";

import { useState, useEffect } from "react";
import { useAccount, useReadContract, useWriteContract } from "wagmi";
import { Address } from "~~/components/scaffold-eth";
import { 
  CurrencyDollarIcon, 
  ChartBarIcon, 
  ShieldCheckIcon,
  PlusIcon,
  MinusIcon,
  ArrowTrendingUpIcon,
  CheckCircleIcon,
  XCircleIcon
} from "@heroicons/react/24/outline";

const GovernanceIntegration = () => {
  const { address: connectedAddress } = useAccount();
  const { writeContract, isPending, isSuccess } = useWriteContract();
  const [stakeAmount, setStakeAmount] = useState("");
  const [unstakeAmount, setUnstakeAmount] = useState("");
  const [userBalance, setUserBalance] = useState("0");
  const [stakedBalance, setStakedBalance] = useState("0");

  // Read SAFE token balance
  const { data: safeBalance } = useReadContract({
    address: "0x996cEB391a85d36CDD1e2e838A5dE4049A407db1", // SAFEToken
    abi: [
      {
        inputs: [{ internalType: "address", name: "account", type: "address" }],
        name: "balanceOf",
        outputs: [{ internalType: "uint256", name: "", type: "uint256" }],
        stateMutability: "view",
        type: "function",
      },
    ],
    functionName: "balanceOf",
    args: connectedAddress ? [connectedAddress] : undefined,
  });

  // Read token info
  const { data: tokenName } = useReadContract({
    address: "0x996cEB391a85d36CDD1e2e838A5dE4049A407db1", // SAFEToken
    abi: [
      {
        inputs: [],
        name: "name",
        outputs: [{ internalType: "string", name: "", type: "string" }],
        stateMutability: "view",
        type: "function",
      },
    ],
    functionName: "name",
  });

  const { data: tokenSymbol } = useReadContract({
    address: "0x996cEB391a85d36CDD1e2e838A5dE4049A407db1", // SAFEToken
    abi: [
      {
        inputs: [],
        name: "symbol",
        outputs: [{ internalType: "string", name: "", type: "string" }],
        stateMutability: "view",
        type: "function",
      },
    ],
    functionName: "symbol",
  });

  const { data: totalSupply } = useReadContract({
    address: "0x996cEB391a85d36CDD1e2e838A5dE4049A407db1", // SAFEToken
    abi: [
      {
        inputs: [],
        name: "TOTAL_SUPPLY",
        outputs: [{ internalType: "uint256", name: "", type: "uint256" }],
        stateMutability: "view",
        type: "function",
      },
    ],
    functionName: "TOTAL_SUPPLY",
  });

  useEffect(() => {
    if (safeBalance) {
      setUserBalance((Number(safeBalance) / 1e18).toFixed(4));
    }
  }, [safeBalance]);

  const handleStake = async () => {
    if (!connectedAddress || !stakeAmount) return;

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
          BigInt(parseFloat(stakeAmount) * 1e18),
          BigInt(30 * 24 * 60 * 60), // 30 days in seconds
        ],
      });
      setStakeAmount("");
    } catch (error) {
      console.error("Staking failed:", error);
      alert(`Staking failed: ${error.message}`);
    }
  };

  const handleUnstake = async () => {
    if (!connectedAddress) return;

    try {
      // For now, unstake the first stake (index 0)
      // In a real implementation, you'd show a list of stakes for the user to choose
      await writeContract({
        address: "0x996cEB391a85d36CDD1e2e838A5dE4049A407db1", // SAFEToken
        abi: [
          {
            inputs: [{ internalType: "uint256", name: "_stakeIndex", type: "uint256" }],
            name: "unstake",
            outputs: [],
            stateMutability: "nonpayable",
            type: "function",
          },
        ],
        functionName: "unstake",
        args: [BigInt(0)], // Unstake first stake
      });
      setUnstakeAmount("");
    } catch (error) {
      console.error("Unstaking failed:", error);
      alert(`Unstaking failed: ${error.message}`);
    }
  };

  const formatBalance = (balance: bigint) => {
    return (Number(balance) / 1e18).toFixed(4);
  };

  if (!connectedAddress) {
    return (
      <div className="text-center py-12">
        <div className="text-gray-500 mb-4">Please connect your wallet to view governance</div>
        <Address address={connectedAddress} />
      </div>
    );
  }

  return (
    <div className="space-y-8">
      {/* Token Overview */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <div className="card bg-base-100 shadow-xl">
          <div className="card-body">
            <div className="flex items-center justify-between mb-4">
              <div className="p-3 rounded-lg bg-blue-500 text-white">
                <CurrencyDollarIcon className="h-8 w-8" />
              </div>
              <div className="text-right">
                <div className="text-2xl font-bold">{userBalance} SAFE</div>
                <div className="text-sm text-gray-500">Your Balance</div>
              </div>
            </div>
            <h3 className="card-title text-lg">SAFE Token Balance</h3>
            <p className="text-gray-600 text-sm">
              {tokenName} ({tokenSymbol}) tokens in your wallet
            </p>
          </div>
        </div>

        <div className="card bg-base-100 shadow-xl">
          <div className="card-body">
            <div className="flex items-center justify-between mb-4">
              <div className="p-3 rounded-lg bg-green-500 text-white">
                <ShieldCheckIcon className="h-8 w-8" />
              </div>
              <div className="text-right">
                <div className="text-2xl font-bold">{stakedBalance} SAFE</div>
                <div className="text-sm text-gray-500">Staked Amount</div>
              </div>
            </div>
            <h3 className="card-title text-lg">Staked Tokens</h3>
            <p className="text-gray-600 text-sm">
              Tokens staked for governance and premium features
            </p>
          </div>
        </div>

        <div className="card bg-base-100 shadow-xl">
          <div className="card-body">
            <div className="flex items-center justify-between mb-4">
              <div className="p-3 rounded-lg bg-purple-500 text-white">
                <ChartBarIcon className="h-8 w-8" />
              </div>
              <div className="text-right">
                <div className="text-2xl font-bold">
                  {totalSupply ? formatBalance(totalSupply) : "0.0000"}
                </div>
                <div className="text-sm text-gray-500">Total Supply</div>
              </div>
            </div>
            <h3 className="card-title text-lg">Total Supply</h3>
            <p className="text-gray-600 text-sm">
              1 billion SAFE tokens for governance
            </p>
          </div>
        </div>
      </div>

      {/* Staking Controls */}
      <div className="card bg-base-100 shadow-xl">
        <div className="card-body">
          <h2 className="card-title text-2xl mb-6">Governance Staking</h2>
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {/* Stake Tokens */}
            <div className="space-y-4">
              <h3 className="text-lg font-semibold">Stake SAFE Tokens</h3>
              <p className="text-gray-600 text-sm">
                Stake your SAFE tokens to participate in governance and unlock premium features
              </p>
              
              <div className="space-y-3">
                <div className="flex gap-2">
                  <input
                    type="number"
                    placeholder="Amount to stake"
                    className="input input-bordered flex-1"
                    value={stakeAmount}
                    onChange={(e) => setStakeAmount(e.target.value)}
                  />
                  <button
                    className="btn btn-primary"
                    onClick={handleStake}
                    disabled={isPending || !stakeAmount}
                  >
                    <PlusIcon className="h-4 w-4" />
                    Stake
                  </button>
                </div>
              </div>
            </div>

            {/* Unstake Tokens */}
            <div className="space-y-4">
              <h3 className="text-lg font-semibold">Unstake SAFE Tokens</h3>
              <p className="text-gray-600 text-sm">
                Unstake your tokens to regain full control (may have cooldown period)
              </p>
              
              <div className="space-y-3">
                <div className="flex gap-2">
                  <input
                    type="number"
                    placeholder="Amount to unstake"
                    className="input input-bordered flex-1"
                    value={unstakeAmount}
                    onChange={(e) => setUnstakeAmount(e.target.value)}
                  />
                  <button
                    className="btn btn-outline"
                    onClick={handleUnstake}
                    disabled={isPending || !unstakeAmount}
                  >
                    <MinusIcon className="h-4 w-4" />
                    Unstake
                  </button>
                </div>
              </div>
            </div>
          </div>

          {/* Governance Benefits */}
          <div className="mt-8">
            <h3 className="text-lg font-semibold mb-4">Governance Benefits</h3>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
              <div className="flex items-center space-x-2">
                <CheckCircleIcon className="h-5 w-5 text-green-500" />
                <span className="text-sm">Voting Rights</span>
              </div>
              <div className="flex items-center space-x-2">
                <CheckCircleIcon className="h-5 w-5 text-green-500" />
                <span className="text-sm">Premium Vault Access</span>
              </div>
              <div className="flex items-center space-x-2">
                <CheckCircleIcon className="h-5 w-5 text-green-500" />
                <span className="text-sm">Fee Discounts</span>
              </div>
              <div className="flex items-center space-x-2">
                <CheckCircleIcon className="h-5 w-5 text-green-500" />
                <span className="text-sm">Yield Boosts</span>
              </div>
            </div>
          </div>

          {/* Transaction Status */}
          {isSuccess && (
            <div className="alert alert-success mt-4">
              <ArrowTrendingUpIcon className="h-4 w-4" />
              Transaction successful!
            </div>
          )}

          {isPending && (
            <div className="alert alert-info mt-4">
              <div className="loading loading-spinner loading-sm"></div>
              Processing transaction...
            </div>
          )}
        </div>
      </div>

      {/* Tokenomics Information */}
      <div className="card bg-base-100 shadow-xl">
        <div className="card-body">
          <h2 className="card-title text-2xl mb-6">SAFE Tokenomics</h2>
          
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            <div className="text-center">
              <div className="text-3xl font-bold text-blue-600">40%</div>
              <div className="text-sm text-gray-600">Community Rewards</div>
              <div className="text-xs text-gray-500">400M tokens</div>
            </div>
            <div className="text-center">
              <div className="text-3xl font-bold text-green-600">20%</div>
              <div className="text-sm text-gray-600">Protocol Treasury</div>
              <div className="text-xs text-gray-500">200M tokens</div>
            </div>
            <div className="text-center">
              <div className="text-3xl font-bold text-purple-600">15%</div>
              <div className="text-sm text-gray-600">Team & Advisors</div>
              <div className="text-xs text-gray-500">150M tokens</div>
            </div>
            <div className="text-center">
              <div className="text-3xl font-bold text-orange-600">25%</div>
              <div className="text-sm text-gray-600">Other</div>
              <div className="text-xs text-gray-500">250M tokens</div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default GovernanceIntegration;
