"use client";

import type { NextPage } from "next";
import GovernanceIntegration from "~~/components/GovernanceIntegration";

const TokenomicsPage: NextPage = () => {
  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-purple-50 dark:from-gray-900 dark:via-gray-800 dark:to-gray-900">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        {/* Header */}
        <div className="text-center mb-12">
          <h1 className="text-4xl md:text-5xl font-bold text-gray-900 dark:text-white mb-4">
            <span className="bg-gradient-to-r from-green-600 to-blue-600 bg-clip-text text-transparent">
              SAFE Tokenomics
            </span>
          </h1>
          <p className="text-xl text-gray-600 dark:text-gray-300 max-w-3xl mx-auto">
            Governance, staking, and token distribution for the SafeNest ecosystem
          </p>
        </div>

        {/* Governance Integration Component */}
        <GovernanceIntegration />

        {/* Token Distribution Overview */}
        <div className="mt-16 grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          <div className="card bg-base-100 shadow-xl">
            <div className="card-body">
              <div className="flex items-center space-x-3 mb-4">
                <div className="p-3 rounded-lg bg-blue-500 text-white">
                  <span className="text-2xl">👥</span>
                </div>
                <div>
                  <h3 className="text-lg font-semibold">Community Rewards</h3>
                  <p className="text-2xl font-bold text-blue-600">400M SAFE</p>
                </div>
              </div>
              <p className="text-gray-600 text-sm">
                Referrals, education, liquidity mining, and community incentives
              </p>
            </div>
          </div>

          <div className="card bg-base-100 shadow-xl">
            <div className="card-body">
              <div className="flex items-center space-x-3 mb-4">
                <div className="p-3 rounded-lg bg-green-500 text-white">
                  <span className="text-2xl">🏛️</span>
                </div>
                <div>
                  <h3 className="text-lg font-semibold">Protocol Treasury</h3>
                  <p className="text-2xl font-bold text-green-600">200M SAFE</p>
                </div>
              </div>
              <p className="text-gray-600 text-sm">
                Development, partnerships, operations, and ecosystem growth
              </p>
            </div>
          </div>

          <div className="card bg-base-100 shadow-xl">
            <div className="card-body">
              <div className="flex items-center space-x-3 mb-4">
                <div className="p-3 rounded-lg bg-purple-500 text-white">
                  <span className="text-2xl">👨‍💼</span>
                </div>
                <div>
                  <h3 className="text-lg font-semibold">Team & Advisors</h3>
                  <p className="text-2xl font-bold text-purple-600">150M SAFE</p>
                </div>
              </div>
              <p className="text-gray-600 text-sm">
                4-year vesting schedule for team and advisory members
              </p>
            </div>
          </div>
        </div>

        {/* Staking Tiers */}
        <div className="mt-16">
          <h2 className="text-3xl font-bold text-center text-gray-900 dark:text-white mb-8">
            Staking Tiers & Benefits
          </h2>
          
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            <div className="card bg-base-100 shadow-xl border-2 border-gray-200">
              <div className="card-body text-center">
                <div className="text-4xl mb-4">🥉</div>
                <h3 className="card-title justify-center text-lg">Basic</h3>
                <div className="text-2xl font-bold text-gray-700 mb-2">1,000 SAFE</div>
                <div className="text-sm text-gray-600 mb-4">Minimum Stake</div>
                <ul className="text-sm space-y-2 text-left">
                  <li>• 1x Voting Power</li>
                  <li>• Basic Features</li>
                  <li>• Standard Support</li>
                </ul>
              </div>
            </div>

            <div className="card bg-base-100 shadow-xl border-2 border-gray-300">
              <div className="card-body text-center">
                <div className="text-4xl mb-4">🥈</div>
                <h3 className="card-title justify-center text-lg">Silver</h3>
                <div className="text-2xl font-bold text-gray-700 mb-2">5,000 SAFE</div>
                <div className="text-sm text-gray-600 mb-4">Minimum Stake</div>
                <ul className="text-sm space-y-2 text-left">
                  <li>• 1.5x Voting Power</li>
                  <li>• Premium Withdrawals</li>
                  <li>• Priority Support</li>
                </ul>
              </div>
            </div>

            <div className="card bg-base-100 shadow-xl border-2 border-yellow-400">
              <div className="card-body text-center">
                <div className="text-4xl mb-4">🥇</div>
                <h3 className="card-title justify-center text-lg">Gold</h3>
                <div className="text-2xl font-bold text-gray-700 mb-2">10,000 SAFE</div>
                <div className="text-sm text-gray-600 mb-4">Minimum Stake</div>
                <ul className="text-sm space-y-2 text-left">
                  <li>• 2x Voting Power</li>
                  <li>• Free Transfers</li>
                  <li>• Premium Vault Access</li>
                </ul>
              </div>
            </div>

            <div className="card bg-base-100 shadow-xl border-2 border-purple-500">
              <div className="card-body text-center">
                <div className="text-4xl mb-4">💎</div>
                <h3 className="card-title justify-center text-lg">Platinum</h3>
                <div className="text-2xl font-bold text-gray-700 mb-2">50,000 SAFE</div>
                <div className="text-sm text-gray-600 mb-4">Minimum Stake</div>
                <ul className="text-sm space-y-2 text-left">
                  <li>• 3x Voting Power</li>
                  <li>• Governance Proposals</li>
                  <li>• Premium Insurance</li>
                </ul>
              </div>
            </div>
          </div>
        </div>

        {/* Network Information */}
        <div className="mt-16 bg-white dark:bg-gray-800 rounded-2xl shadow-lg p-8">
          <div className="text-center">
            <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-4">
              Deployed on U2U Solaris Mainnet
            </h2>
            <p className="text-gray-600 dark:text-gray-300 mb-6">
              SAFE tokens are secured by smart contracts on the U2U Solaris blockchain
            </p>
            <div className="flex flex-wrap justify-center gap-4 text-sm">
              <div className="bg-gray-100 dark:bg-gray-700 px-4 py-2 rounded-lg">
                <span className="font-semibold">Contract:</span> 
                <a href="https://u2uscan.xyz/address/0x996cEB391a85d36CDD1e2e838A5dE4049A407db1" target="_blank" rel="noopener noreferrer" className="text-blue-600 hover:text-blue-800 ml-1">
                  0x996c...7db1
                </a>
              </div>
              <div className="bg-gray-100 dark:bg-gray-700 px-4 py-2 rounded-lg">
                <span className="font-semibold">Network:</span> U2U Solaris
              </div>
              <div className="bg-gray-100 dark:bg-gray-700 px-4 py-2 rounded-lg">
                <span className="font-semibold">Chain ID:</span> 39
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default TokenomicsPage;