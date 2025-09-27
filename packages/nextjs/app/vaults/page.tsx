"use client";

import { useState, useEffect } from "react";
import type { NextPage } from "next";
import { useAccount, useWriteContract, useReadContract } from "wagmi";
import { Address } from "~~/components/scaffold-eth";
import { 
  CurrencyDollarIcon, 
  ChartBarIcon, 
  ShieldCheckIcon,
  PlusIcon,
  ArrowTrendingUpIcon,
  ClockIcon,
  BanknotesIcon,
  StarIcon,
  GiftIcon,
  UsersIcon
} from "@heroicons/react/24/outline";

interface VaultData {
  type: "micro-savings" | "pension-nest" | "emergency-vault";
  name: string;
  description: string;
  icon: React.ReactNode;
  color: string;
  minDeposit: string;
  yieldRate: string;
  features: string[];
  premiumRequired: boolean;
}

const VaultsPage: NextPage = () => {
  const { address: connectedAddress } = useAccount();
  const { writeContract, isPending, isSuccess } = useWriteContract();
  const [activeTab, setActiveTab] = useState<"overview" | "micro-savings" | "pension-nest" | "emergency-vault" | "premium">("overview");
  const [selectedVault, setSelectedVault] = useState<VaultData | null>(null);
  const [isCreateModalOpen, setIsCreateModalOpen] = useState(false);

  const vaultTypes: VaultData[] = [
    {
      type: "micro-savings",
      name: "Micro-Savings Vault",
      description: "Save tiny amounts daily/weekly with automatic yield deployment",
      icon: <BanknotesIcon className="h-8 w-8" />,
      color: "bg-green-500",
      minDeposit: "0.001 ETH",
      yieldRate: "4.0% APY",
      features: ["Daily/Weekly deposits", "Auto-yield deployment", "Round-up savings", "Mobile money integration"],
      premiumRequired: false
    },
    {
      type: "pension-nest",
      name: "Pension Nest",
      description: "Long-term retirement savings with time-locked withdrawals",
      icon: <ClockIcon className="h-8 w-8" />,
      color: "bg-blue-500",
      minDeposit: "0.01 ETH",
      yieldRate: "7.0% APY",
      features: ["10-year vesting", "2% yield boost", "Retirement planning", "Monthly withdrawals"],
      premiumRequired: false
    },
    {
      type: "emergency-vault",
      name: "Emergency Vault",
      description: "Liquid savings with instant withdrawal and small incentives",
      icon: <ShieldCheckIcon className="h-8 w-8" />,
      color: "bg-red-500",
      minDeposit: "0.005 ETH",
      yieldRate: "2.25% APY",
      features: ["Instant withdrawal", "0.5% withdrawal fee", "0.25% parking incentive", "Insurance coverage"],
      premiumRequired: false
    }
  ];

  const premiumFeatures = [
    {
      name: "Premium Vault Access",
      description: "Access to advanced vault features and higher yields",
      stakeRequired: "10,000 SAFE",
      benefits: ["Higher yield rates", "Priority support", "Advanced analytics", "Custom strategies"]
    },
    {
      name: "Instant Withdrawal",
      description: "Withdraw from any vault instantly without waiting periods",
      stakeRequired: "5,000 SAFE",
      benefits: ["No waiting periods", "Reduced fees", "Priority processing", "Emergency access"]
    },
    {
      name: "Free Transfers",
      description: "Make cross-border transfers without fees",
      stakeRequired: "2,000 SAFE",
      benefits: ["Zero transfer fees", "Global transfers", "Mobile money integration", "Real-time processing"]
    },
    {
      name: "Premium Insurance",
      description: "Enhanced insurance coverage for all vaults",
      stakeRequired: "15,000 SAFE",
      benefits: ["10x coverage", "Lower premiums", "Fast claims", "Global coverage"]
    }
  ];

  const handleCreateVault = async (vaultType: string) => {
    if (!connectedAddress) return;

    try {
      // In a real implementation, this would call the VaultSystem contract
      console.log(`Creating ${vaultType} vault for ${connectedAddress}`);
      setIsCreateModalOpen(false);
    } catch (error) {
      console.error("Failed to create vault:", error);
    }
  };

  const handleDeposit = async (vaultType: string, amount: string) => {
    if (!connectedAddress) return;

    try {
      // In a real implementation, this would call the VaultSystem contract
      console.log(`Depositing ${amount} to ${vaultType} vault for ${connectedAddress}`);
    } catch (error) {
      console.error("Failed to deposit:", error);
    }
  };

  return (
    <>
      <div className="min-h-screen bg-gradient-to-br from-green-50 via-white to-blue-50 dark:from-gray-900 dark:via-gray-800 dark:to-gray-900">
        {/* Header */}
        <div className="bg-white dark:bg-gray-800 shadow-lg">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
            <div className="text-center">
              <h1 className="text-4xl md:text-5xl font-bold text-gray-900 dark:text-white mb-4">
                <span className="bg-gradient-to-r from-green-600 to-blue-600 bg-clip-text text-transparent">
                  SafeNest Vaults
                </span>
              </h1>
              <p className="text-xl text-gray-600 dark:text-gray-300 mb-6">
                Micro-savings, pension nest, and emergency vaults with $SAFE governance
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
                  <span className="text-yellow-700 dark:text-yellow-300 font-medium">Connect your wallet to get started</span>
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
                  activeTab === "overview"
                    ? "border-green-500 text-green-600 dark:text-green-400"
                    : "border-transparent text-gray-500 hover:text-gray-700 dark:text-gray-400"
                }`}
                onClick={() => setActiveTab("overview")}
              >
                <ChartBarIcon className="h-5 w-5" />
                <span>Overview</span>
              </button>
              <button
                className={`flex items-center space-x-2 py-4 px-1 border-b-2 font-medium text-sm whitespace-nowrap ${
                  activeTab === "micro-savings"
                    ? "border-green-500 text-green-600 dark:text-green-400"
                    : "border-transparent text-gray-500 hover:text-gray-700 dark:text-gray-400"
                }`}
                onClick={() => setActiveTab("micro-savings")}
              >
                <BanknotesIcon className="h-5 w-5" />
                <span>Micro-Savings</span>
              </button>
              <button
                className={`flex items-center space-x-2 py-4 px-1 border-b-2 font-medium text-sm whitespace-nowrap ${
                  activeTab === "pension-nest"
                    ? "border-blue-500 text-blue-600 dark:text-blue-400"
                    : "border-transparent text-gray-500 hover:text-gray-700 dark:text-gray-400"
                }`}
                onClick={() => setActiveTab("pension-nest")}
              >
                <ClockIcon className="h-5 w-5" />
                <span>Pension Nest</span>
              </button>
              <button
                className={`flex items-center space-x-2 py-4 px-1 border-b-2 font-medium text-sm whitespace-nowrap ${
                  activeTab === "emergency-vault"
                    ? "border-red-500 text-red-600 dark:text-red-400"
                    : "border-transparent text-gray-500 hover:text-gray-700 dark:text-gray-400"
                }`}
                onClick={() => setActiveTab("emergency-vault")}
              >
                <ShieldCheckIcon className="h-5 w-5" />
                <span>Emergency Vault</span>
              </button>
              <button
                className={`flex items-center space-x-2 py-4 px-1 border-b-2 font-medium text-sm whitespace-nowrap ${
                  activeTab === "premium"
                    ? "border-purple-500 text-purple-600 dark:text-purple-400"
                    : "border-transparent text-gray-500 hover:text-gray-700 dark:text-gray-400"
                }`}
                onClick={() => setActiveTab("premium")}
              >
                <StarIcon className="h-5 w-5" />
                <span>Premium Features</span>
              </button>
            </div>
          </div>
        </div>

        {/* Tab Content */}
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          {activeTab === "overview" && (
            <div className="space-y-8">
              {/* Vault Statistics */}
              <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
                <div className="bg-white dark:bg-gray-800 rounded-2xl shadow-lg p-6 text-center">
                  <div className="text-3xl font-bold text-green-600 mb-2">$0</div>
                  <div className="text-sm text-gray-500 dark:text-gray-400">Total Deposited</div>
                </div>
                <div className="bg-white dark:bg-gray-800 rounded-2xl shadow-lg p-6 text-center">
                  <div className="text-3xl font-bold text-blue-600 mb-2">0</div>
                  <div className="text-sm text-gray-500 dark:text-gray-400">Active Vaults</div>
                </div>
                <div className="bg-white dark:bg-gray-800 rounded-2xl shadow-lg p-6 text-center">
                  <div className="text-3xl font-bold text-purple-600 mb-2">0%</div>
                  <div className="text-sm text-gray-500 dark:text-gray-400">Average APY</div>
                </div>
                <div className="bg-white dark:bg-gray-800 rounded-2xl shadow-lg p-6 text-center">
                  <div className="text-3xl font-bold text-orange-600 mb-2">0</div>
                  <div className="text-sm text-gray-500 dark:text-gray-400">SAFE Staked</div>
                </div>
              </div>

              {/* Vault Types */}
              <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                {vaultTypes.map((vault) => (
                  <div key={vault.type} className="bg-white dark:bg-gray-800 rounded-2xl shadow-lg p-6 hover:shadow-xl transition-shadow">
                    <div className="flex items-center justify-between mb-4">
                      <div className="flex items-center space-x-3">
                        <div className={`w-12 h-12 ${vault.color} rounded-xl flex items-center justify-center text-white`}>
                          {vault.icon}
                        </div>
                        <div>
                          <h3 className="font-semibold text-gray-900 dark:text-white">{vault.name}</h3>
                          <p className="text-sm text-gray-500 dark:text-gray-400">{vault.yieldRate}</p>
                        </div>
                      </div>
                      {vault.premiumRequired && (
                        <div className="px-2 py-1 bg-purple-100 dark:bg-purple-900/20 text-purple-800 dark:text-purple-300 rounded-full text-xs font-medium">
                          Premium
                        </div>
                      )}
                    </div>

                    <p className="text-gray-600 dark:text-gray-300 text-sm mb-4">{vault.description}</p>

                    <div className="space-y-2 mb-6">
                      <div className="flex justify-between text-sm">
                        <span className="text-gray-500 dark:text-gray-400">Min Deposit</span>
                        <span className="font-medium text-gray-900 dark:text-white">{vault.minDeposit}</span>
                      </div>
                      <div className="flex justify-between text-sm">
                        <span className="text-gray-500 dark:text-gray-400">Yield Rate</span>
                        <span className="font-medium text-green-600 dark:text-green-400">{vault.yieldRate}</span>
                      </div>
                    </div>

                    <div className="space-y-2 mb-6">
                      <div className="text-sm font-medium text-gray-700 dark:text-gray-300">Features:</div>
                      <ul className="space-y-1">
                        {vault.features.map((feature, index) => (
                          <li key={index} className="text-sm text-gray-600 dark:text-gray-400 flex items-center">
                            <div className="w-1.5 h-1.5 bg-green-500 rounded-full mr-2"></div>
                            {feature}
                          </li>
                        ))}
                      </ul>
                    </div>

                    <button
                      onClick={() => {
                        setSelectedVault(vault);
                        setIsCreateModalOpen(true);
                      }}
                      disabled={!connectedAddress}
                      className="w-full bg-gradient-to-r from-green-500 to-blue-600 hover:from-green-600 hover:to-blue-700 disabled:from-gray-400 disabled:to-gray-500 text-white font-medium py-2 px-4 rounded-lg transition-all duration-200 disabled:cursor-not-allowed"
                    >
                      {connectedAddress ? "Create Vault" : "Connect Wallet"}
                    </button>
                  </div>
                ))}
              </div>
            </div>
          )}

          {activeTab === "premium" && (
            <div className="space-y-8">
              <div className="text-center mb-8">
                <h2 className="text-3xl font-bold text-gray-900 dark:text-white mb-4">
                  Premium Features with $SAFE Staking
                </h2>
                <p className="text-lg text-gray-600 dark:text-gray-300">
                  Unlock advanced features by staking $SAFE tokens
                </p>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                {premiumFeatures.map((feature, index) => (
                  <div key={index} className="bg-white dark:bg-gray-800 rounded-2xl shadow-lg p-6">
                    <div className="flex items-center justify-between mb-4">
                      <h3 className="text-lg font-semibold text-gray-900 dark:text-white">{feature.name}</h3>
                      <div className="px-3 py-1 bg-purple-100 dark:bg-purple-900/20 text-purple-800 dark:text-purple-300 rounded-full text-sm font-medium">
                        {feature.stakeRequired}
                      </div>
                    </div>

                    <p className="text-gray-600 dark:text-gray-300 mb-4">{feature.description}</p>

                    <div className="space-y-2">
                      <div className="text-sm font-medium text-gray-700 dark:text-gray-300">Benefits:</div>
                      <ul className="space-y-1">
                        {feature.benefits.map((benefit, benefitIndex) => (
                          <li key={benefitIndex} className="text-sm text-gray-600 dark:text-gray-400 flex items-center">
                            <div className="w-1.5 h-1.5 bg-purple-500 rounded-full mr-2"></div>
                            {benefit}
                          </li>
                        ))}
                      </ul>
                    </div>

                    <button className="w-full mt-4 bg-gradient-to-r from-purple-500 to-pink-600 hover:from-purple-600 hover:to-pink-700 text-white font-medium py-2 px-4 rounded-lg transition-all duration-200">
                      Stake $SAFE
                    </button>
                  </div>
                ))}
              </div>

              {/* $SAFE Token Info */}
              <div className="bg-gradient-to-r from-purple-50 to-pink-50 dark:from-purple-900/20 dark:to-pink-900/20 rounded-2xl p-8">
                <div className="text-center">
                  <h3 className="text-2xl font-bold text-gray-900 dark:text-white mb-4">$SAFE Token</h3>
                  <p className="text-gray-600 dark:text-gray-300 mb-6">
                    Governance token that unlocks premium features and provides voting rights
                  </p>
                  
                  <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-6">
                    <div className="text-center">
                      <div className="text-2xl font-bold text-purple-600 mb-2">1B</div>
                      <div className="text-sm text-gray-500 dark:text-gray-400">Total Supply</div>
                    </div>
                    <div className="text-center">
                      <div className="text-2xl font-bold text-blue-600 mb-2">300M</div>
                      <div className="text-sm text-gray-500 dark:text-gray-400">Staking Rewards</div>
                    </div>
                    <div className="text-center">
                      <div className="text-2xl font-bold text-green-600 mb-2">4 Years</div>
                      <div className="text-sm text-gray-500 dark:text-gray-400">Reward Duration</div>
                    </div>
                  </div>

                  <div className="flex flex-col sm:flex-row gap-4 justify-center">
                    <button className="bg-purple-600 hover:bg-purple-700 text-white font-medium py-2 px-6 rounded-lg transition-colors">
                      Buy $SAFE
                    </button>
                    <button className="bg-blue-600 hover:bg-blue-700 text-white font-medium py-2 px-6 rounded-lg transition-colors">
                      Stake $SAFE
                    </button>
                    <button className="bg-green-600 hover:bg-green-700 text-white font-medium py-2 px-6 rounded-lg transition-colors">
                      View Tokenomics
                    </button>
                  </div>
                </div>
              </div>
            </div>
          )}

          {/* Individual vault tabs would go here */}
          {(activeTab === "micro-savings" || activeTab === "pension-nest" || activeTab === "emergency-vault") && (
            <div className="text-center py-12">
              <div className="text-gray-500 dark:text-gray-400 mb-2">
                {activeTab.charAt(0).toUpperCase() + activeTab.slice(1).replace('-', ' ')} vault details coming soon
              </div>
              <div className="text-sm text-gray-400 dark:text-gray-500">
                Create your first vault to get started
              </div>
            </div>
          )}
        </div>

        {/* Create Vault Modal */}
        {isCreateModalOpen && selectedVault && (
          <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
            <div className="bg-white dark:bg-gray-800 rounded-2xl shadow-2xl w-full max-w-md">
              <div className="p-6">
                <h2 className="text-xl font-semibold text-gray-900 dark:text-white mb-4">
                  Create {selectedVault.name}
                </h2>
                
                <div className="space-y-4 mb-6">
                  <div className="flex justify-between">
                    <span className="text-gray-600 dark:text-gray-300">Vault Type</span>
                    <span className="font-medium text-gray-900 dark:text-white">{selectedVault.name}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-gray-600 dark:text-gray-300">Min Deposit</span>
                    <span className="font-medium text-gray-900 dark:text-white">{selectedVault.minDeposit}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-gray-600 dark:text-gray-300">Expected Yield</span>
                    <span className="font-medium text-green-600 dark:text-green-400">{selectedVault.yieldRate}</span>
                  </div>
                </div>

                <div className="flex space-x-3">
                  <button
                    onClick={() => setIsCreateModalOpen(false)}
                    className="flex-1 px-4 py-2 border border-gray-300 dark:border-gray-600 text-gray-700 dark:text-gray-300 rounded-lg hover:bg-gray-50 dark:hover:bg-gray-700 transition-colors"
                  >
                    Cancel
                  </button>
                  <button
                    onClick={() => handleCreateVault(selectedVault.type)}
                    className="flex-1 bg-gradient-to-r from-green-500 to-blue-600 hover:from-green-600 hover:to-blue-700 text-white font-medium py-2 px-4 rounded-lg transition-all duration-200"
                  >
                    Create Vault
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

export default VaultsPage;
