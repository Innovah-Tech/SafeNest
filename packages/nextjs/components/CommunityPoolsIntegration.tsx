"use client";

import { useEffect, useState } from "react";
import { useAccount, useReadContract, useWriteContract } from "wagmi";
import { ArrowTrendingUpIcon, ClockIcon, CurrencyDollarIcon, PlusIcon, UsersIcon } from "@heroicons/react/24/outline";
import { Address } from "~~/components/scaffold-eth";

interface CommunityPool {
  id: number;
  name: string;
  description: string;
  targetAmount: bigint;
  currentAmount: bigint;
  memberLimit: number;
  currentMembers: number;
  creator: string;
  isActive: boolean;
  createdAt: bigint;
}

const CommunityPoolsIntegration = () => {
  const { address: connectedAddress } = useAccount();
  const { writeContractAsync, isPending, isSuccess } = useWriteContract();
  const [pools, setPools] = useState<CommunityPool[]>([]);
  const [isCreateModalOpen, setIsCreateModalOpen] = useState(false);
  const [newPool, setNewPool] = useState({
    name: "",
    description: "",
    targetAmount: "",
    memberLimit: "",
  });

  // Mock data for demonstration - in real implementation, you'd read from contract
  const mockPools: CommunityPool[] = [
    {
      id: 1,
      name: "Education Fund",
      description: "Saving for children's education expenses",
      targetAmount: BigInt(1000 * 1e18), // 1000 U2U
      currentAmount: BigInt(350 * 1e18), // 350 U2U
      memberLimit: 10,
      currentMembers: 7,
      creator: "0x1234...5678",
      isActive: true,
      createdAt: BigInt(Math.floor(Date.now() / 1000 - 86400)), // 1 day ago
    },
    {
      id: 2,
      name: "Emergency Fund",
      description: "Community emergency fund for unexpected expenses",
      targetAmount: BigInt(5000 * 1e18), // 5000 U2U
      currentAmount: BigInt(1200 * 1e18), // 1200 U2U
      memberLimit: 20,
      currentMembers: 15,
      creator: "0x8765...4321",
      isActive: true,
      createdAt: BigInt(Math.floor(Date.now() / 1000 - 172800)), // 2 days ago
    },
    {
      id: 3,
      name: "Business Investment",
      description: "Pool for small business investments in the community",
      targetAmount: BigInt(10000 * 1e18), // 10000 U2U
      currentAmount: BigInt(7500 * 1e18), // 7500 U2U
      memberLimit: 15,
      currentMembers: 12,
      creator: "0xabcd...efgh",
      isActive: true,
      createdAt: BigInt(Math.floor(Date.now() / 1000 - 259200)), // 3 days ago
    },
  ];

  useEffect(() => {
    setPools(mockPools);
  }, []);

  const handleCreatePool = async () => {
    if (!connectedAddress || !newPool.name || !newPool.description || !newPool.targetAmount || !newPool.memberLimit)
      return;

    try {
      await writeContractAsync({
        address: "0x8DaC034C5Ed072630789aF53a39A090f477bE7e2", // CommunityPools
        abi: [
          {
            inputs: [
              { internalType: "string", name: "_name", type: "string" },
              { internalType: "string", name: "_description", type: "string" },
              { internalType: "enum CommunityPools.PoolType", name: "_poolType", type: "uint8" },
              { internalType: "address", name: "_stablecoin", type: "address" },
              { internalType: "uint256", name: "_contributionAmount", type: "uint256" },
              { internalType: "uint256", name: "_contributionFrequency", type: "uint256" },
              { internalType: "uint256", name: "_maxMembers", type: "uint256" },
              { internalType: "bool", name: "_isPublic", type: "bool" },
            ],
            name: "createPool",
            outputs: [],
            stateMutability: "nonpayable",
            type: "function",
          },
        ],
        functionName: "createPool",
        args: [
          newPool.name,
          newPool.description,
          0, // PoolType.SAVINGS (0)
          "0x0000000000000000000000000000000000000000", // No stablecoin (use ETH)
          BigInt(parseFloat(newPool.targetAmount) * 1e18), // Contribution amount
          BigInt(7 * 24 * 60 * 60), // Weekly frequency (7 days in seconds)
          BigInt(parseInt(newPool.memberLimit)),
          true, // Public pool
        ],
      });

      // Reset form
      setNewPool({
        name: "",
        description: "",
        targetAmount: "",
        memberLimit: "",
      });
      setIsCreateModalOpen(false);
      alert(`Successfully created pool "${newPool.name}"!`);
    } catch (error: any) {
      console.error("Create pool failed:", error);
      alert(`Create pool failed: ${error.message || error.toString()}`);
    }
  };

  const handleJoinPool = async (poolId: number) => {
    if (!connectedAddress) return;

    try {
      await writeContractAsync({
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
        args: [BigInt(poolId)],
      });
      alert(`Successfully joined pool ${poolId}!`);
    } catch (error: any) {
      console.error("Join pool failed:", error);
      alert(`Join pool failed: ${error.message || error.toString()}`);
    }
  };

  const formatBalance = (balance: bigint) => {
    return (Number(balance) / 1e18).toFixed(2);
  };

  const getProgressPercentage = (current: bigint, target: bigint) => {
    return Math.min((Number(current) / Number(target)) * 100, 100);
  };

  if (!connectedAddress) {
    return (
      <div className="text-center py-12">
        <div className="text-gray-500 mb-4">Please connect your wallet to view community pools</div>
        <Address address={connectedAddress} />
      </div>
    );
  }

  return (
    <div className="space-y-8">
      {/* Header with Create Button */}
      <div className="flex justify-between items-center">
        <div>
          <h2 className="text-3xl font-bold text-gray-900 dark:text-white">Community Pools</h2>
          <p className="text-gray-600 dark:text-gray-300 mt-2">
            Join or create community savings pools for shared goals
          </p>
        </div>
        <button className="btn btn-primary" onClick={() => setIsCreateModalOpen(true)}>
          <PlusIcon className="h-5 w-5" />
          Create Pool
        </button>
      </div>

      {/* Pools Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {pools.map(pool => (
          <div key={pool.id} className="card bg-base-100 shadow-xl">
            <div className="card-body">
              <div className="flex items-start justify-between mb-4">
                <div className="flex items-center space-x-3">
                  <div className="p-3 rounded-lg bg-blue-500 text-white">
                    <UsersIcon className="h-6 w-6" />
                  </div>
                  <div>
                    <h3 className="card-title text-lg">{pool.name}</h3>
                    <p className="text-sm text-gray-500">Pool #{pool.id}</p>
                  </div>
                </div>
                <div className={`badge ${pool.isActive ? "badge-success" : "badge-error"}`}>
                  {pool.isActive ? "Active" : "Inactive"}
                </div>
              </div>

              <p className="text-gray-600 text-sm mb-4">{pool.description}</p>

              {/* Progress Bar */}
              <div className="mb-4">
                <div className="flex justify-between text-sm mb-2">
                  <span>Progress</span>
                  <span>{getProgressPercentage(pool.currentAmount, pool.targetAmount).toFixed(1)}%</span>
                </div>
                <progress
                  className="progress progress-primary w-full"
                  value={getProgressPercentage(pool.currentAmount, pool.targetAmount)}
                  max="100"
                ></progress>
                <div className="flex justify-between text-xs text-gray-500 mt-1">
                  <span>{formatBalance(pool.currentAmount)} U2U</span>
                  <span>{formatBalance(pool.targetAmount)} U2U</span>
                </div>
              </div>

              {/* Pool Stats */}
              <div className="grid grid-cols-2 gap-4 mb-4 text-sm">
                <div>
                  <div className="text-gray-500">Members</div>
                  <div className="font-semibold">
                    {pool.currentMembers}/{pool.memberLimit}
                  </div>
                </div>
                <div>
                  <div className="text-gray-500">Created</div>
                  <div className="font-semibold">{new Date(Number(pool.createdAt) * 1000).toLocaleDateString()}</div>
                </div>
              </div>

              {/* Action Button */}
              <button
                className="btn btn-primary w-full"
                onClick={() => handleJoinPool(pool.id)}
                disabled={isPending || pool.currentMembers >= pool.memberLimit}
              >
                {pool.currentMembers >= pool.memberLimit ? "Pool Full" : "Join Pool"}
              </button>
            </div>
          </div>
        ))}
      </div>

      {/* Create Pool Modal */}
      {isCreateModalOpen && (
        <div className="modal modal-open">
          <div className="modal-box">
            <h3 className="font-bold text-lg mb-4">Create New Community Pool</h3>

            <div className="space-y-4">
              <div>
                <label className="label">
                  <span className="label-text">Pool Name</span>
                </label>
                <input
                  type="text"
                  placeholder="Enter pool name"
                  className="input input-bordered w-full"
                  value={newPool.name}
                  onChange={e => setNewPool({ ...newPool, name: e.target.value })}
                />
              </div>

              <div>
                <label className="label">
                  <span className="label-text">Description</span>
                </label>
                <textarea
                  placeholder="Describe the purpose of this pool"
                  className="textarea textarea-bordered w-full"
                  value={newPool.description}
                  onChange={e => setNewPool({ ...newPool, description: e.target.value })}
                />
              </div>

              <div>
                <label className="label">
                  <span className="label-text">Target Amount (U2U)</span>
                </label>
                <input
                  type="number"
                  placeholder="Enter target amount"
                  className="input input-bordered w-full"
                  value={newPool.targetAmount}
                  onChange={e => setNewPool({ ...newPool, targetAmount: e.target.value })}
                />
              </div>

              <div>
                <label className="label">
                  <span className="label-text">Member Limit</span>
                </label>
                <input
                  type="number"
                  placeholder="Maximum number of members"
                  className="input input-bordered w-full"
                  value={newPool.memberLimit}
                  onChange={e => setNewPool({ ...newPool, memberLimit: e.target.value })}
                />
              </div>
            </div>

            <div className="modal-action">
              <button className="btn btn-ghost" onClick={() => setIsCreateModalOpen(false)}>
                Cancel
              </button>
              <button
                className="btn btn-primary"
                onClick={handleCreatePool}
                disabled={
                  isPending || !newPool.name || !newPool.description || !newPool.targetAmount || !newPool.memberLimit
                }
              >
                {isPending ? "Creating..." : "Create Pool"}
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Transaction Status */}
      {isSuccess && (
        <div className="alert alert-success">
          <ArrowTrendingUpIcon className="h-4 w-4" />
          Transaction successful!
        </div>
      )}

      {isPending && (
        <div className="alert alert-info">
          <div className="loading loading-spinner loading-sm"></div>
          Processing transaction...
        </div>
      )}
    </div>
  );
};

export default CommunityPoolsIntegration;
