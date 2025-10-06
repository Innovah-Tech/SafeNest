"use client";

import type { NextPage } from "next";
import CommunityPoolsIntegration from "~~/components/CommunityPoolsIntegration";

const CommunityPage: NextPage = () => {
  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-purple-50 dark:from-gray-900 dark:via-gray-800 dark:to-gray-900">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        {/* Header */}
        <div className="text-center mb-12">
          <h1 className="text-4xl md:text-5xl font-bold text-gray-900 dark:text-white mb-4">
            <span className="bg-gradient-to-r from-green-600 to-blue-600 bg-clip-text text-transparent">
              Community Pools
            </span>
          </h1>
          <p className="text-xl text-gray-600 dark:text-gray-300 max-w-3xl mx-auto">
            Join or create community savings pools for shared financial goals
          </p>
        </div>

        {/* Community Pools Integration Component */}
        <CommunityPoolsIntegration />

        {/* Community Features Overview */}
        <div className="mt-16 grid grid-cols-1 md:grid-cols-3 gap-8">
          <div className="text-center">
            <div className="bg-blue-100 dark:bg-blue-900 p-4 rounded-full w-16 h-16 mx-auto mb-4 flex items-center justify-center">
              <span className="text-2xl">👥</span>
            </div>
            <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-2">
              Digital Chamas
            </h3>
            <p className="text-gray-600 dark:text-gray-300 text-sm">
              Traditional rotating savings groups adapted for the digital age
            </p>
          </div>

          <div className="text-center">
            <div className="bg-green-100 dark:bg-green-900 p-4 rounded-full w-16 h-16 mx-auto mb-4 flex items-center justify-center">
              <span className="text-2xl">🎯</span>
            </div>
            <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-2">
              Goal-Oriented Savings
            </h3>
            <p className="text-gray-600 dark:text-gray-300 text-sm">
              Save together for education, healthcare, or business investments
            </p>
          </div>

          <div className="text-center">
            <div className="bg-purple-100 dark:bg-purple-900 p-4 rounded-full w-16 h-16 mx-auto mb-4 flex items-center justify-center">
              <span className="text-2xl">🤝</span>
            </div>
            <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-2">
              Community Support
            </h3>
            <p className="text-gray-600 dark:text-gray-300 text-sm">
              Mutual support and accountability for financial goals
            </p>
          </div>
        </div>

        {/* How It Works */}
        <div className="mt-16 bg-white dark:bg-gray-800 rounded-2xl shadow-lg p-8">
          <h2 className="text-2xl font-bold text-center text-gray-900 dark:text-white mb-8">
            How Community Pools Work
          </h2>
          
          <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
            <div className="text-center">
              <div className="bg-blue-500 text-white rounded-full w-12 h-12 flex items-center justify-center mx-auto mb-4 text-xl font-bold">
                1
              </div>
              <h3 className="font-semibold mb-2">Create or Join</h3>
              <p className="text-sm text-gray-600">
                Create a new pool or join an existing one that matches your goals
              </p>
            </div>

            <div className="text-center">
              <div className="bg-green-500 text-white rounded-full w-12 h-12 flex items-center justify-center mx-auto mb-4 text-xl font-bold">
                2
              </div>
              <h3 className="font-semibold mb-2">Contribute Regularly</h3>
              <p className="text-sm text-gray-600">
                Make regular contributions according to the pool's schedule
              </p>
            </div>

            <div className="text-center">
              <div className="bg-purple-500 text-white rounded-full w-12 h-12 flex items-center justify-center mx-auto mb-4 text-xl font-bold">
                3
              </div>
              <h3 className="font-semibold mb-2">Earn Together</h3>
              <p className="text-sm text-gray-600">
                Pool funds are invested to earn yield for all members
              </p>
            </div>

            <div className="text-center">
              <div className="bg-orange-500 text-white rounded-full w-12 h-12 flex items-center justify-center mx-auto mb-4 text-xl font-bold">
                4
              </div>
              <h3 className="font-semibold mb-2">Withdraw When Ready</h3>
              <p className="text-sm text-gray-600">
                Withdraw your share plus earned yield when the pool matures
              </p>
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
              Community pools are secured by smart contracts on the U2U Solaris blockchain
            </p>
            <div className="flex flex-wrap justify-center gap-4 text-sm">
              <div className="bg-gray-100 dark:bg-gray-700 px-4 py-2 rounded-lg">
                <span className="font-semibold">Contract:</span> 
                <a href="https://u2uscan.xyz/address/0x8DaC034C5Ed072630789aF53a39A090f477bE7e2" target="_blank" rel="noopener noreferrer" className="text-blue-600 hover:text-blue-800 ml-1">
                  0x8DaC...7e2
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

export default CommunityPage;