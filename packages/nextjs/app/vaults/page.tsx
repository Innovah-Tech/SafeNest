"use client";

import type { NextPage } from "next";
import VaultIntegration from "~~/components/VaultIntegration";

const VaultsPage: NextPage = () => {
  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-purple-50 dark:from-gray-900 dark:via-gray-800 dark:to-gray-900">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        {/* Header */}
        <div className="text-center mb-12">
          <h1 className="text-4xl md:text-5xl font-bold text-gray-900 dark:text-white mb-4">
            <span className="bg-gradient-to-r from-green-600 to-blue-600 bg-clip-text text-transparent">
              SafeNest Vaults
            </span>
          </h1>
          <p className="text-xl text-gray-600 dark:text-gray-300 max-w-3xl mx-auto">
            Manage your micro-savings, pension nest, and emergency funds with our integrated vault system
          </p>
        </div>

        {/* Vault Integration Component */}
        <VaultIntegration />

        {/* Additional Information */}
        <div className="mt-16 grid grid-cols-1 md:grid-cols-3 gap-8">
          <div className="text-center">
            <div className="bg-green-100 dark:bg-green-900 p-4 rounded-full w-16 h-16 mx-auto mb-4 flex items-center justify-center">
              <span className="text-2xl">🏦</span>
            </div>
            <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-2">
              Micro-Savings
            </h3>
            <p className="text-gray-600 dark:text-gray-300 text-sm">
              Start with as little as 0.001 U2U and build your savings habit
            </p>
          </div>

          <div className="text-center">
            <div className="bg-blue-100 dark:bg-blue-900 p-4 rounded-full w-16 h-16 mx-auto mb-4 flex items-center justify-center">
              <span className="text-2xl">🏛️</span>
            </div>
            <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-2">
              Pension Nest
            </h3>
            <p className="text-gray-600 dark:text-gray-300 text-sm">
              Long-term retirement planning with higher yields and time-locked access
            </p>
          </div>

          <div className="text-center">
            <div className="bg-red-100 dark:bg-red-900 p-4 rounded-full w-16 h-16 mx-auto mb-4 flex items-center justify-center">
              <span className="text-2xl">🚨</span>
            </div>
            <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-2">
              Emergency Vault
            </h3>
            <p className="text-gray-600 dark:text-gray-300 text-sm">
              Instant access to your funds when you need them most
            </p>
          </div>
        </div>

        {/* Network Information */}
        <div className="mt-16 bg-white dark:bg-gray-800 rounded-2xl shadow-lg p-8">
          <div className="text-center">
            <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-4">
              Deployed on U2U Solaris Mainnet
            </h2>
            <p className="text-gray-600 dark:text-gray-300 mb-6">
              All vaults are secured by smart contracts on the U2U Solaris blockchain
            </p>
            <div className="flex flex-wrap justify-center gap-4 text-sm">
              <div className="bg-gray-100 dark:bg-gray-700 px-4 py-2 rounded-lg">
                <span className="font-semibold">Network:</span> U2U Solaris
              </div>
              <div className="bg-gray-100 dark:bg-gray-700 px-4 py-2 rounded-lg">
                <span className="font-semibold">Chain ID:</span> 39
              </div>
              <div className="bg-gray-100 dark:bg-gray-700 px-4 py-2 rounded-lg">
                <span className="font-semibold">Explorer:</span> 
                <a href="https://u2uscan.xyz" target="_blank" rel="noopener noreferrer" className="text-blue-600 hover:text-blue-800 ml-1">
                  U2UScan
                </a>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default VaultsPage;