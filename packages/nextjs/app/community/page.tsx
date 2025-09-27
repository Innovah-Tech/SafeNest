"use client";

import { useState, useEffect } from "react";
import type { NextPage } from "next";
import { useAccount, useWriteContract, useReadContract } from "wagmi";
import { Address } from "~~/components/scaffold-eth";
import { CONTRACT_ADDRESSES, SIMPLE_MICRO_SAVINGS_ABI } from "~~/utils/contracts";
import { 
  UsersIcon, 
  PlusIcon, 
  BanknotesIcon,
  ClockIcon,
  ArrowTrendingUpIcon,
  ShieldCheckIcon,
  UserGroupIcon,
  CurrencyDollarIcon
} from "@heroicons/react/24/outline";

interface CommunityPool {
  id: number;
  name: string;
  description: string;
  creator: string;
  memberCount: number;
  maxMembers: number;
  contributionAmount: string;
  contributionFrequency: string;
  totalDeposits: string;
  yieldRate: string;
  isActive: boolean;
  isPublic: boolean;
  createdAt: string;
  poolType: "rotating" | "investment" | "emergency" | "goal";
}

const CommunityPage: NextPage = () => {
  const { address: connectedAddress } = useAccount();
  const { writeContract, isPending, isSuccess } = useWriteContract();
  const [activeTab, setActiveTab] = useState<"explore" | "create" | "my-pools">("explore");
  const [isCreateModalOpen, setIsCreateModalOpen] = useState(false);
  const [isJoinModalOpen, setIsJoinModalOpen] = useState(false);
  const [selectedPool, setSelectedPool] = useState<CommunityPool | null>(null);

  // Mock data for community pools
  const [communityPools, setCommunityPools] = useState<CommunityPool[]>([
    {
      id: 1,
      name: "Digital Chama #1",
      description: "Traditional rotating savings group for emergency funds",
      creator: "0x1234...5678",
      memberCount: 8,
      maxMembers: 12,
      contributionAmount: "50",
      contributionFrequency: "Monthly",
      totalDeposits: "400",
      yieldRate: "4.2%",
      isActive: true,
      isPublic: true,
      createdAt: "2024-01-15",
      poolType: "rotating"
    },
    {
      id: 2,
      name: "Investment Pool Alpha",
      description: "Collective DeFi investment pool for higher yields",
      creator: "0x2345...6789",
      memberCount: 15,
      maxMembers: 20,
      contributionAmount: "100",
      contributionFrequency: "Weekly",
      totalDeposits: "1500",
      yieldRate: "6.8%",
      isActive: true,
      isPublic: true,
      createdAt: "2024-01-10",
      poolType: "investment"
    },
    {
      id: 3,
      name: "Emergency Fund Collective",
      description: "Community emergency fund with instant access",
      creator: "0x3456...7890",
      memberCount: 25,
      maxMembers: 50,
      contributionAmount: "25",
      contributionFrequency: "Bi-weekly",
      totalDeposits: "625",
      yieldRate: "3.5%",
      isActive: true,
      isPublic: true,
      createdAt: "2024-01-05",
      poolType: "emergency"
    },
    {
      id: 4,
      name: "Education Fund",
      description: "Saving for children's education expenses",
      creator: "0x4567...8901",
      memberCount: 12,
      maxMembers: 15,
      contributionAmount: "75",
      contributionFrequency: "Monthly",
      totalDeposits: "900",
      yieldRate: "5.1%",
      isActive: true,
      isPublic: false,
      createdAt: "2024-01-20",
      poolType: "goal"
    }
  ]);

  const [myPools, setMyPools] = useState<CommunityPool[]>([]);

  // Create pool form state
  const [createForm, setCreateForm] = useState({
    name: "",
    description: "",
    poolType: "rotating" as "rotating" | "investment" | "emergency" | "goal",
    contributionAmount: "",
    contributionFrequency: "monthly",
    maxMembers: "12",
    isPublic: true
  });

  const handleCreatePool = async () => {
    if (!connectedAddress) return;

    try {
      // In a real implementation, this would call the smart contract
      const newPool: CommunityPool = {
        id: communityPools.length + 1,
        name: createForm.name,
        description: createForm.description,
        creator: connectedAddress,
        memberCount: 1,
        maxMembers: parseInt(createForm.maxMembers),
        contributionAmount: createForm.contributionAmount,
        contributionFrequency: createForm.contributionFrequency,
        totalDeposits: "0",
        yieldRate: "0%",
        isActive: true,
        isPublic: createForm.isPublic,
        createdAt: new Date().toISOString().split('T')[0],
        poolType: createForm.poolType
      };

      setCommunityPools(prev => [newPool, ...prev]);
      setMyPools(prev => [newPool, ...prev]);
      setIsCreateModalOpen(false);
      
      // Reset form
      setCreateForm({
        name: "",
        description: "",
        poolType: "rotating",
        contributionAmount: "",
        contributionFrequency: "monthly",
        maxMembers: "12",
        isPublic: true
      });
    } catch (error) {
      console.error("Failed to create pool:", error);
    }
  };

  const handleJoinPool = async (pool: CommunityPool) => {
    if (!connectedAddress) return;

    try {
      // In a real implementation, this would call the smart contract
      const updatedPools = communityPools.map(p => 
        p.id === pool.id 
          ? { ...p, memberCount: p.memberCount + 1, totalDeposits: (parseInt(p.totalDeposits) + parseInt(p.contributionAmount)).toString() }
          : p
      );
      setCommunityPools(updatedPools);
      setIsJoinModalOpen(false);
    } catch (error) {
      console.error("Failed to join pool:", error);
    }
  };

  const getPoolTypeIcon = (type: string) => {
    switch (type) {
      case "rotating": return <UserGroupIcon className="h-5 w-5" />;
      case "investment": return <ArrowTrendingUpIcon className="h-5 w-5" />;
      case "emergency": return <ShieldCheckIcon className="h-5 w-5" />;
      case "goal": return <ClockIcon className="h-5 w-5" />;
      default: return <UsersIcon className="h-5 w-5" />;
    }
  };

  const getPoolTypeColor = (type: string) => {
    switch (type) {
      case "rotating": return "bg-blue-500";
      case "investment": return "bg-green-500";
      case "emergency": return "bg-red-500";
      case "goal": return "bg-purple-500";
      default: return "bg-gray-500";
    }
  };

  return (
    <>
      <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-purple-50 dark:from-gray-900 dark:via-gray-800 dark:to-gray-900">
        {/* Header */}
        <div className="bg-white dark:bg-gray-800 shadow-lg">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
            <div className="text-center">
              <h1 className="text-4xl md:text-5xl font-bold text-gray-900 dark:text-white mb-4">
                <span className="bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent">
                  Community Pools
                </span>
              </h1>
              <p className="text-xl text-gray-600 dark:text-gray-300 mb-6">
                Join digital chamas and collective investment pools for higher yields
              </p>
              
              {/* Wallet Status */}
              {connectedAddress ? (
                <div className="inline-flex items-center bg-green-50 dark:bg-green-900/20 border border-green-200 dark:border-green-800 rounded-xl px-6 py-3">
                  <div className="w-3 h-3 bg-green-500 rounded-full animate-pulse mr-3"></div>
                  <span className="text-green-700 dark:text-green-300 font-medium mr-4">Wallet Connected</span>
                  <Address address={connectedAddress} />
                </div>
              ) : (
                <div className="inline-flex items-center bg-yellow-50 dark:bg-yellow-900/20 border border-yellow-200 dark:border-yellow-800 rounded-xl px-6 py-3">
                  <div className="w-3 h-3 bg-yellow-500 rounded-full mr-3"></div>
                  <span className="text-yellow-700 dark:text-yellow-300 font-medium">Connect your wallet to participate</span>
                </div>
              )}
            </div>
          </div>
        </div>

        {/* Navigation Tabs */}
        <div className="bg-white dark:bg-gray-800 border-b border-gray-200 dark:border-gray-700">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="flex space-x-8 overflow-x-auto">
              <button
                className={`flex items-center space-x-2 py-4 px-1 border-b-2 font-medium text-sm whitespace-nowrap ${
                  activeTab === "explore"
                    ? "border-blue-500 text-blue-600 dark:text-blue-400"
                    : "border-transparent text-gray-500 hover:text-gray-700 dark:text-gray-400"
                }`}
                onClick={() => setActiveTab("explore")}
              >
                <UsersIcon className="h-5 w-5" />
                <span>Explore Pools</span>
              </button>
              <button
                className={`flex items-center space-x-2 py-4 px-1 border-b-2 font-medium text-sm whitespace-nowrap ${
                  activeTab === "create"
                    ? "border-blue-500 text-blue-600 dark:text-blue-400"
                    : "border-transparent text-gray-500 hover:text-gray-700 dark:text-gray-400"
                }`}
                onClick={() => setActiveTab("create")}
              >
                <PlusIcon className="h-5 w-5" />
                <span>Create Pool</span>
              </button>
              <button
                className={`flex items-center space-x-2 py-4 px-1 border-b-2 font-medium text-sm whitespace-nowrap ${
                  activeTab === "my-pools"
                    ? "border-blue-500 text-blue-600 dark:text-blue-400"
                    : "border-transparent text-gray-500 hover:text-gray-700 dark:text-gray-400"
                }`}
                onClick={() => setActiveTab("my-pools")}
              >
                <UserGroupIcon className="h-5 w-5" />
                <span>My Pools</span>
              </button>
            </div>
          </div>
        </div>

        {/* Tab Content */}
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          {activeTab === "explore" && (
            <div className="space-y-6">
              {/* Pool Statistics */}
              <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
                <div className="bg-white dark:bg-gray-800 rounded-2xl shadow-lg p-6 text-center">
                  <div className="text-3xl font-bold text-blue-600 mb-2">{communityPools.length}</div>
                  <div className="text-sm text-gray-500 dark:text-gray-400">Active Pools</div>
                </div>
                <div className="bg-white dark:bg-gray-800 rounded-2xl shadow-lg p-6 text-center">
                  <div className="text-3xl font-bold text-green-600 mb-2">
                    {communityPools.reduce((sum, pool) => sum + pool.memberCount, 0)}
                  </div>
                  <div className="text-sm text-gray-500 dark:text-gray-400">Total Members</div>
                </div>
                <div className="bg-white dark:bg-gray-800 rounded-2xl shadow-lg p-6 text-center">
                  <div className="text-3xl font-bold text-purple-600 mb-2">
                    ${communityPools.reduce((sum, pool) => sum + parseInt(pool.totalDeposits), 0)}
                  </div>
                  <div className="text-sm text-gray-500 dark:text-gray-400">Total Deposits</div>
                </div>
                <div className="bg-white dark:bg-gray-800 rounded-2xl shadow-lg p-6 text-center">
                  <div className="text-3xl font-bold text-orange-600 mb-2">5.1%</div>
                  <div className="text-sm text-gray-500 dark:text-gray-400">Average APY</div>
                </div>
              </div>

              {/* Pool Grid */}
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {communityPools.map((pool) => (
                  <div key={pool.id} className="bg-white dark:bg-gray-800 rounded-2xl shadow-lg p-6 hover:shadow-xl transition-shadow">
                    <div className="flex items-center justify-between mb-4">
                      <div className="flex items-center space-x-3">
                        <div className={`w-10 h-10 ${getPoolTypeColor(pool.poolType)} rounded-xl flex items-center justify-center text-white`}>
                          {getPoolTypeIcon(pool.poolType)}
                        </div>
                        <div>
                          <h3 className="font-semibold text-gray-900 dark:text-white">{pool.name}</h3>
                          <p className="text-sm text-gray-500 dark:text-gray-400 capitalize">{pool.poolType} Pool</p>
                        </div>
                      </div>
                      <div className={`px-2 py-1 rounded-full text-xs font-medium ${
                        pool.isActive ? 'bg-green-100 text-green-800 dark:bg-green-900/20 dark:text-green-300' : 'bg-gray-100 text-gray-800 dark:bg-gray-900/20 dark:text-gray-300'
                      }`}>
                        {pool.isActive ? 'Active' : 'Inactive'}
                      </div>
                    </div>

                    <p className="text-gray-600 dark:text-gray-300 text-sm mb-4">{pool.description}</p>

                    <div className="space-y-3 mb-6">
                      <div className="flex justify-between">
                        <span className="text-sm text-gray-500 dark:text-gray-400">Members</span>
                        <span className="text-sm font-medium text-gray-900 dark:text-white">
                          {pool.memberCount}/{pool.maxMembers}
                        </span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-sm text-gray-500 dark:text-gray-400">Contribution</span>
                        <span className="text-sm font-medium text-gray-900 dark:text-white">
                          ${pool.contributionAmount} {pool.contributionFrequency}
                        </span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-sm text-gray-500 dark:text-gray-400">Total Deposits</span>
                        <span className="text-sm font-medium text-gray-900 dark:text-white">
                          ${pool.totalDeposits}
                        </span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-sm text-gray-500 dark:text-gray-400">Yield Rate</span>
                        <span className="text-sm font-medium text-green-600 dark:text-green-400">
                          {pool.yieldRate}
                        </span>
                      </div>
                    </div>

                    <div className="flex space-x-3">
                      <button
                        onClick={() => {
                          setSelectedPool(pool);
                          setIsJoinModalOpen(true);
                        }}
                        disabled={!connectedAddress || pool.memberCount >= pool.maxMembers}
                        className="flex-1 bg-blue-500 hover:bg-blue-600 disabled:bg-gray-400 text-white font-medium py-2 px-4 rounded-lg transition-colors disabled:cursor-not-allowed"
                      >
                        {pool.memberCount >= pool.maxMembers ? 'Full' : 'Join Pool'}
                      </button>
                      <button className="px-4 py-2 border border-gray-300 dark:border-gray-600 text-gray-700 dark:text-gray-300 rounded-lg hover:bg-gray-50 dark:hover:bg-gray-700 transition-colors">
                        View Details
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}

          {activeTab === "create" && (
            <div className="max-w-2xl mx-auto">
              <div className="bg-white dark:bg-gray-800 rounded-2xl shadow-lg p-8">
                <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-6">Create Community Pool</h2>
                
                <div className="space-y-6">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                      Pool Name
                    </label>
                    <input
                      type="text"
                      value={createForm.name}
                      onChange={(e) => setCreateForm({...createForm, name: e.target.value})}
                      placeholder="e.g., Digital Chama #1"
                      className="w-full p-3 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-white focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                      Description
                    </label>
                    <textarea
                      value={createForm.description}
                      onChange={(e) => setCreateForm({...createForm, description: e.target.value})}
                      placeholder="Describe your pool's purpose and goals..."
                      rows={3}
                      className="w-full p-3 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-white focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                      Pool Type
                    </label>
                    <select
                      value={createForm.poolType}
                      onChange={(e) => setCreateForm({...createForm, poolType: e.target.value as any})}
                      className="w-full p-3 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-white focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                    >
                      <option value="rotating">Rotating Savings (Chama)</option>
                      <option value="investment">Investment Pool</option>
                      <option value="emergency">Emergency Fund</option>
                      <option value="goal">Goal-Oriented</option>
                    </select>
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div>
                      <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                        Contribution Amount (USDC)
                      </label>
                      <input
                        type="number"
                        value={createForm.contributionAmount}
                        onChange={(e) => setCreateForm({...createForm, contributionAmount: e.target.value})}
                        placeholder="50"
                        className="w-full p-3 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-white focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                        Max Members
                      </label>
                      <input
                        type="number"
                        value={createForm.maxMembers}
                        onChange={(e) => setCreateForm({...createForm, maxMembers: e.target.value})}
                        placeholder="12"
                        min="5"
                        max="50"
                        className="w-full p-3 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-white focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                      />
                    </div>
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                      Contribution Frequency
                    </label>
                    <select
                      value={createForm.contributionFrequency}
                      onChange={(e) => setCreateForm({...createForm, contributionFrequency: e.target.value})}
                      className="w-full p-3 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-white focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                    >
                      <option value="weekly">Weekly</option>
                      <option value="bi-weekly">Bi-weekly</option>
                      <option value="monthly">Monthly</option>
                      <option value="quarterly">Quarterly</option>
                    </select>
                  </div>

                  <div className="flex items-center">
                    <input
                      type="checkbox"
                      id="isPublic"
                      checked={createForm.isPublic}
                      onChange={(e) => setCreateForm({...createForm, isPublic: e.target.checked})}
                      className="h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300 rounded"
                    />
                    <label htmlFor="isPublic" className="ml-2 block text-sm text-gray-700 dark:text-gray-300">
                      Make this pool public (others can discover and join)
                    </label>
                  </div>

                  <button
                    onClick={handleCreatePool}
                    disabled={!connectedAddress || !createForm.name || !createForm.description || !createForm.contributionAmount}
                    className="w-full bg-gradient-to-r from-blue-500 to-purple-600 hover:from-blue-600 hover:to-purple-700 disabled:from-gray-400 disabled:to-gray-500 text-white font-medium py-3 px-6 rounded-lg transition-all duration-200 disabled:cursor-not-allowed"
                  >
                    {isPending ? "Creating..." : "Create Pool"}
                  </button>
                </div>
              </div>
            </div>
          )}

          {activeTab === "my-pools" && (
            <div className="space-y-6">
              {myPools.length > 0 ? (
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                  {myPools.map((pool) => (
                    <div key={pool.id} className="bg-white dark:bg-gray-800 rounded-2xl shadow-lg p-6">
                      <div className="flex items-center justify-between mb-4">
                        <div className="flex items-center space-x-3">
                          <div className={`w-10 h-10 ${getPoolTypeColor(pool.poolType)} rounded-xl flex items-center justify-center text-white`}>
                            {getPoolTypeIcon(pool.poolType)}
                          </div>
                          <div>
                            <h3 className="font-semibold text-gray-900 dark:text-white">{pool.name}</h3>
                            <p className="text-sm text-gray-500 dark:text-gray-400 capitalize">{pool.poolType} Pool</p>
                          </div>
                        </div>
                        <div className={`px-2 py-1 rounded-full text-xs font-medium ${
                          pool.isActive ? 'bg-green-100 text-green-800 dark:bg-green-900/20 dark:text-green-300' : 'bg-gray-100 text-gray-800 dark:bg-gray-900/20 dark:text-gray-300'
                        }`}>
                          {pool.isActive ? 'Active' : 'Inactive'}
                        </div>
                      </div>

                      <div className="space-y-3 mb-6">
                        <div className="flex justify-between">
                          <span className="text-sm text-gray-500 dark:text-gray-400">Members</span>
                          <span className="text-sm font-medium text-gray-900 dark:text-white">
                            {pool.memberCount}/{pool.maxMembers}
                          </span>
                        </div>
                        <div className="flex justify-between">
                          <span className="text-sm text-gray-500 dark:text-gray-400">Your Contribution</span>
                          <span className="text-sm font-medium text-gray-900 dark:text-white">
                            ${pool.contributionAmount} {pool.contributionFrequency}
                          </span>
                        </div>
                        <div className="flex justify-between">
                          <span className="text-sm text-gray-500 dark:text-gray-400">Total Deposits</span>
                          <span className="text-sm font-medium text-gray-900 dark:text-white">
                            ${pool.totalDeposits}
                          </span>
                        </div>
                      </div>

                      <div className="flex space-x-3">
                        <button className="flex-1 bg-blue-500 hover:bg-blue-600 text-white font-medium py-2 px-4 rounded-lg transition-colors">
                          Manage Pool
                        </button>
                        <button className="px-4 py-2 border border-gray-300 dark:border-gray-600 text-gray-700 dark:text-gray-300 rounded-lg hover:bg-gray-50 dark:hover:bg-gray-700 transition-colors">
                          View Details
                        </button>
                      </div>
                    </div>
                  ))}
                </div>
              ) : (
                <div className="text-center py-12">
                  <UsersIcon className="h-16 w-16 text-gray-400 mx-auto mb-4" />
                  <h3 className="text-lg font-medium text-gray-900 dark:text-white mb-2">No pools yet</h3>
                  <p className="text-gray-500 dark:text-gray-400 mb-6">Create your first community pool or join an existing one</p>
                  <button
                    onClick={() => setActiveTab("create")}
                    className="bg-blue-500 hover:bg-blue-600 text-white font-medium py-2 px-6 rounded-lg transition-colors"
                  >
                    Create Pool
                  </button>
                </div>
              )}
            </div>
          )}
        </div>

        {/* Join Pool Modal */}
        {isJoinModalOpen && selectedPool && (
          <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
            <div className="bg-white dark:bg-gray-800 rounded-2xl shadow-2xl w-full max-w-md">
              <div className="p-6">
                <h2 className="text-xl font-semibold text-gray-900 dark:text-white mb-4">Join {selectedPool.name}</h2>
                
                <div className="space-y-4 mb-6">
                  <div className="flex justify-between">
                    <span className="text-gray-600 dark:text-gray-300">Contribution Amount</span>
                    <span className="font-medium text-gray-900 dark:text-white">
                      ${selectedPool.contributionAmount} {selectedPool.contributionFrequency}
                    </span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-gray-600 dark:text-gray-300">Current Members</span>
                    <span className="font-medium text-gray-900 dark:text-white">
                      {selectedPool.memberCount}/{selectedPool.maxMembers}
                    </span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-gray-600 dark:text-gray-300">Expected Yield</span>
                    <span className="font-medium text-green-600 dark:text-green-400">
                      {selectedPool.yieldRate}
                    </span>
                  </div>
                </div>

                <div className="flex space-x-3">
                  <button
                    onClick={() => setIsJoinModalOpen(false)}
                    className="flex-1 px-4 py-2 border border-gray-300 dark:border-gray-600 text-gray-700 dark:text-gray-300 rounded-lg hover:bg-gray-50 dark:hover:bg-gray-700 transition-colors"
                  >
                    Cancel
                  </button>
                  <button
                    onClick={() => handleJoinPool(selectedPool)}
                    className="flex-1 bg-blue-500 hover:bg-blue-600 text-white font-medium py-2 px-4 rounded-lg transition-colors"
                  >
                    Join Pool
                  </button>
                </div>
              </div>
            </div>
          </div>
        )}
      </div>
    </>
  );
};

export default CommunityPage;
