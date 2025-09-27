"use client";

import { useState } from "react";
import type { NextPage } from "next";
import { 
  ChartPieIcon, 
  CurrencyDollarIcon, 
  UsersIcon, 
  ClockIcon,
  ShieldCheckIcon,
  BanknotesIcon,
  ArrowTrendingUpIcon,
  GiftIcon
} from "@heroicons/react/24/outline";

const TokenomicsPage: NextPage = () => {
  const [activeTab, setActiveTab] = useState<"overview" | "distribution" | "staking" | "governance" | "rewards">("overview");

  const tokenDistribution = [
    { name: "Community Rewards", amount: "400M", percentage: "40%", color: "bg-blue-500", description: "Referrals, education, liquidity mining" },
    { name: "Team & Advisors", amount: "150M", percentage: "15%", color: "bg-green-500", description: "4-year vesting schedule" },
    { name: "Protocol Treasury", amount: "200M", percentage: "20%", color: "bg-purple-500", description: "Development, partnerships, operations" },
    { name: "DEX Liquidity", amount: "100M", percentage: "10%", color: "bg-orange-500", description: "Initial liquidity provision" },
    { name: "Strategic Partners", amount: "100M", percentage: "10%", color: "bg-pink-500", description: "SACCOs, NGOs, mobile money providers" },
    { name: "Early Adopters", amount: "50M", percentage: "5%", color: "bg-indigo-500", description: "Beta testers, early users" },
  ];

  const stakingTiers = [
    { tier: "Basic", minStake: "1,000 INCL", votingPower: "1x", feeShare: "0%", features: ["Basic voting", "Standard features"] },
    { tier: "Silver", minStake: "10,000 INCL", votingPower: "1.5x", feeShare: "0.1%", features: ["Enhanced voting", "Premium withdrawals", "Priority support"] },
    { tier: "Gold", minStake: "50,000 INCL", votingPower: "2x", feeShare: "0.2%", features: ["Maximum voting", "Free transfers", "Premium insurance"] },
    { tier: "Platinum", minStake: "100,000 INCL", votingPower: "3x", feeShare: "0.3%", features: ["Governance proposals", "Early access", "VIP support"] },
  ];

  const rewardPools = [
    { name: "Staking Rewards", amount: "300M INCL", duration: "4 years", rate: "23.7 INCL/second", description: "Daily rewards for stakers" },
    { name: "Liquidity Mining", amount: "50M INCL", duration: "2 years", rate: "0.79 INCL/second", description: "DEX liquidity providers" },
    { name: "Education Rewards", amount: "25M INCL", duration: "Ongoing", rate: "100 INCL/module", description: "Financial literacy completion" },
    { name: "Partner Rewards", amount: "75M INCL", duration: "Ongoing", rate: "500 INCL/referral", description: "Strategic partner integrations" },
  ];

  return (
    <>
      <div className="min-h-screen bg-gradient-to-br from-purple-50 via-white to-blue-50 dark:from-gray-900 dark:via-gray-800 dark:to-gray-900">
        {/* Header */}
        <div className="bg-white dark:bg-gray-800 shadow-lg">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
            <div className="text-center">
              <h1 className="text-4xl md:text-5xl font-bold text-gray-900 dark:text-white mb-4">
                <span className="bg-gradient-to-r from-purple-600 to-blue-600 bg-clip-text text-transparent">
                  $INCL Tokenomics
                </span>
              </h1>
              <p className="text-xl text-gray-600 dark:text-gray-300 mb-6">
                Comprehensive economic model for inclusive financial growth
              </p>
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
                    ? "border-purple-500 text-purple-600 dark:text-purple-400"
                    : "border-transparent text-gray-500 hover:text-gray-700 dark:text-gray-400"
                }`}
                onClick={() => setActiveTab("overview")}
              >
                <ChartPieIcon className="h-5 w-5" />
                <span>Overview</span>
              </button>
              <button
                className={`flex items-center space-x-2 py-4 px-1 border-b-2 font-medium text-sm whitespace-nowrap ${
                  activeTab === "distribution"
                    ? "border-purple-500 text-purple-600 dark:text-purple-400"
                    : "border-transparent text-gray-500 hover:text-gray-700 dark:text-gray-400"
                }`}
                onClick={() => setActiveTab("distribution")}
              >
                <CurrencyDollarIcon className="h-5 w-5" />
                <span>Distribution</span>
              </button>
              <button
                className={`flex items-center space-x-2 py-4 px-1 border-b-2 font-medium text-sm whitespace-nowrap ${
                  activeTab === "staking"
                    ? "border-purple-500 text-purple-600 dark:text-purple-400"
                    : "border-transparent text-gray-500 hover:text-gray-700 dark:text-gray-400"
                }`}
                onClick={() => setActiveTab("staking")}
              >
                <ShieldCheckIcon className="h-5 w-5" />
                <span>Staking</span>
              </button>
              <button
                className={`flex items-center space-x-2 py-4 px-1 border-b-2 font-medium text-sm whitespace-nowrap ${
                  activeTab === "governance"
                    ? "border-purple-500 text-purple-600 dark:text-purple-400"
                    : "border-transparent text-gray-500 hover:text-gray-700 dark:text-gray-400"
                }`}
                onClick={() => setActiveTab("governance")}
              >
                <UsersIcon className="h-5 w-5" />
                <span>Governance</span>
              </button>
              <button
                className={`flex items-center space-x-2 py-4 px-1 border-b-2 font-medium text-sm whitespace-nowrap ${
                  activeTab === "rewards"
                    ? "border-purple-500 text-purple-600 dark:text-purple-400"
                    : "border-transparent text-gray-500 hover:text-gray-700 dark:text-gray-400"
                }`}
                onClick={() => setActiveTab("rewards")}
              >
                <GiftIcon className="h-5 w-5" />
                <span>Rewards</span>
              </button>
            </div>
          </div>
        </div>

        {/* Tab Content */}
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          {activeTab === "overview" && (
            <div className="space-y-8">
              {/* Key Metrics */}
              <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
                <div className="bg-white dark:bg-gray-800 rounded-2xl shadow-lg p-6 text-center">
                  <div className="text-3xl font-bold text-purple-600 mb-2">1B</div>
                  <div className="text-sm text-gray-500 dark:text-gray-400">Total Supply</div>
                </div>
                <div className="bg-white dark:bg-gray-800 rounded-2xl shadow-lg p-6 text-center">
                  <div className="text-3xl font-bold text-blue-600 mb-2">40%</div>
                  <div className="text-sm text-gray-500 dark:text-gray-400">Community Allocation</div>
                </div>
                <div className="bg-white dark:bg-gray-800 rounded-2xl shadow-lg p-6 text-center">
                  <div className="text-3xl font-bold text-green-600 mb-2">0.3%</div>
                  <div className="text-sm text-gray-500 dark:text-gray-400">Protocol Fee</div>
                </div>
                <div className="bg-white dark:bg-gray-800 rounded-2xl shadow-lg p-6 text-center">
                  <div className="text-3xl font-bold text-orange-600 mb-2">4 Years</div>
                  <div className="text-sm text-gray-500 dark:text-gray-400">Staking Rewards</div>
                </div>
              </div>

              {/* Core Features */}
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                <div className="bg-white dark:bg-gray-800 rounded-2xl shadow-lg p-6">
                  <div className="flex items-center justify-center w-12 h-12 bg-purple-100 dark:bg-purple-900/20 rounded-xl mb-4">
                    <BanknotesIcon className="h-6 w-6 text-purple-600" />
                  </div>
                  <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-2">Micro-Savings</h3>
                  <p className="text-gray-600 dark:text-gray-300 text-sm">
                    Deposit as little as $0.01 daily with automatic allocation to emergency funds and pensions.
                  </p>
                </div>
                <div className="bg-white dark:bg-gray-800 rounded-2xl shadow-lg p-6">
                  <div className="flex items-center justify-center w-12 h-12 bg-blue-100 dark:bg-blue-900/20 rounded-xl mb-4">
                    <ArrowTrendingUpIcon className="h-6 w-6 text-blue-600" />
                  </div>
                  <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-2">Auto-Yield</h3>
                  <p className="text-gray-600 dark:text-gray-300 text-sm">
                    Automatic deployment to low-risk DeFi strategies with 2% bonus for pension deposits.
                  </p>
                </div>
                <div className="bg-white dark:bg-gray-800 rounded-2xl shadow-lg p-6">
                  <div className="flex items-center justify-center w-12 h-12 bg-green-100 dark:bg-green-900/20 rounded-xl mb-4">
                    <ShieldCheckIcon className="h-6 w-6 text-green-600" />
                  </div>
                  <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-2">Insurance</h3>
                  <p className="text-gray-600 dark:text-gray-300 text-sm">
                    Optional micro-insurance with 0.1% premium and 10x coverage for insured deposits.
                  </p>
                </div>
              </div>
            </div>
          )}

          {activeTab === "distribution" && (
            <div className="space-y-8">
              <div className="bg-white dark:bg-gray-800 rounded-2xl shadow-lg p-8">
                <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-6">Token Distribution</h2>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  {tokenDistribution.map((item, index) => (
                    <div key={index} className="border border-gray-200 dark:border-gray-600 rounded-lg p-4">
                      <div className="flex items-center justify-between mb-3">
                        <div className="flex items-center space-x-3">
                          <div className={`w-4 h-4 rounded-full ${item.color}`}></div>
                          <h3 className="font-semibold text-gray-900 dark:text-white">{item.name}</h3>
                        </div>
                        <div className="text-right">
                          <div className="font-bold text-gray-900 dark:text-white">{item.amount}</div>
                          <div className="text-sm text-gray-500 dark:text-gray-400">{item.percentage}</div>
                        </div>
                      </div>
                      <p className="text-sm text-gray-600 dark:text-gray-300">{item.description}</p>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          )}

          {activeTab === "staking" && (
            <div className="space-y-8">
              <div className="bg-white dark:bg-gray-800 rounded-2xl shadow-lg p-8">
                <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-6">Staking Tiers</h2>
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
                  {stakingTiers.map((tier, index) => (
                    <div key={index} className="border border-gray-200 dark:border-gray-600 rounded-lg p-6">
                      <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">{tier.tier}</h3>
                      <div className="space-y-3 mb-6">
                        <div>
                          <div className="text-sm text-gray-500 dark:text-gray-400">Minimum Stake</div>
                          <div className="font-medium text-gray-900 dark:text-white">{tier.minStake}</div>
                        </div>
                        <div>
                          <div className="text-sm text-gray-500 dark:text-gray-400">Voting Power</div>
                          <div className="font-medium text-gray-900 dark:text-white">{tier.votingPower}</div>
                        </div>
                        <div>
                          <div className="text-sm text-gray-500 dark:text-gray-400">Fee Share</div>
                          <div className="font-medium text-gray-900 dark:text-white">{tier.feeShare}</div>
                        </div>
                      </div>
                      <div>
                        <div className="text-sm text-gray-500 dark:text-gray-400 mb-2">Features</div>
                        <ul className="space-y-1">
                          {tier.features.map((feature, featureIndex) => (
                            <li key={featureIndex} className="text-sm text-gray-600 dark:text-gray-300">
                              • {feature}
                            </li>
                          ))}
                        </ul>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          )}

          {activeTab === "governance" && (
            <div className="space-y-8">
              <div className="bg-white dark:bg-gray-800 rounded-2xl shadow-lg p-8">
                <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-6">Governance Model</h2>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                  <div>
                    <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">Voting Parameters</h3>
                    <div className="space-y-4">
                      <div className="flex justify-between">
                        <span className="text-gray-600 dark:text-gray-300">Minimum Stake for Voting</span>
                        <span className="font-medium text-gray-900 dark:text-white">1,000 INCL</span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-gray-600 dark:text-gray-300">Voting Duration</span>
                        <span className="font-medium text-gray-900 dark:text-white">3 days</span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-gray-600 dark:text-gray-300">Execution Delay</span>
                        <span className="font-medium text-gray-900 dark:text-white">1 day</span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-gray-600 dark:text-gray-300">Quorum Threshold</span>
                        <span className="font-medium text-gray-900 dark:text-white">5%</span>
                      </div>
                    </div>
                  </div>
                  <div>
                    <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">Governance Rights</h3>
                    <ul className="space-y-3">
                      <li className="flex items-start space-x-2">
                        <div className="w-2 h-2 bg-purple-500 rounded-full mt-2"></div>
                        <span className="text-gray-600 dark:text-gray-300">Vote on portfolio strategies and yield optimization</span>
                      </li>
                      <li className="flex items-start space-x-2">
                        <div className="w-2 h-2 bg-purple-500 rounded-full mt-2"></div>
                        <span className="text-gray-600 dark:text-gray-300">Propose new features and products</span>
                      </li>
                      <li className="flex items-start space-x-2">
                        <div className="w-2 h-2 bg-purple-500 rounded-full mt-2"></div>
                        <span className="text-gray-600 dark:text-gray-300">Adjust protocol fees and parameters</span>
                      </li>
                      <li className="flex items-start space-x-2">
                        <div className="w-2 h-2 bg-purple-500 rounded-full mt-2"></div>
                        <span className="text-gray-600 dark:text-gray-300">Approve strategic partnerships</span>
                      </li>
                    </ul>
                  </div>
                </div>
              </div>
            </div>
          )}

          {activeTab === "rewards" && (
            <div className="space-y-8">
              <div className="bg-white dark:bg-gray-800 rounded-2xl shadow-lg p-8">
                <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-6">Reward Pools</h2>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  {rewardPools.map((pool, index) => (
                    <div key={index} className="border border-gray-200 dark:border-gray-600 rounded-lg p-6">
                      <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">{pool.name}</h3>
                      <div className="space-y-3">
                        <div>
                          <div className="text-sm text-gray-500 dark:text-gray-400">Total Allocation</div>
                          <div className="font-medium text-gray-900 dark:text-white">{pool.amount}</div>
                        </div>
                        <div>
                          <div className="text-sm text-gray-500 dark:text-gray-400">Duration</div>
                          <div className="font-medium text-gray-900 dark:text-white">{pool.duration}</div>
                        </div>
                        <div>
                          <div className="text-sm text-gray-500 dark:text-gray-400">Reward Rate</div>
                          <div className="font-medium text-gray-900 dark:text-white">{pool.rate}</div>
                        </div>
                        <div>
                          <div className="text-sm text-gray-500 dark:text-gray-400">Description</div>
                          <div className="text-sm text-gray-600 dark:text-gray-300">{pool.description}</div>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          )}
        </div>
      </div>
    </>
  );
};

export default TokenomicsPage;
