"use client";

import Link from "next/link";
import type { NextPage } from "next";
import { useAccount } from "wagmi";
import {
  BanknotesIcon,
  BugAntIcon,
  ChartBarIcon,
  QuestionMarkCircleIcon,
  ShieldCheckIcon,
  UsersIcon,
} from "@heroicons/react/24/outline";
import { WalletConnectionStatus } from "~~/components/WalletConnectionStatus";

const Home: NextPage = () => {
  return (
    <>
      <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-purple-50 dark:from-gray-900 dark:via-gray-800 dark:to-gray-900">
        {/* Hero Section */}
        <div className="relative overflow-hidden">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-20 pb-16">
            <div className="text-center">
              <div className="flex justify-center mb-8">
                <div className="relative">
                  <div className="absolute inset-0 bg-gradient-to-r from-blue-400 to-purple-500 rounded-full blur-lg opacity-30"></div>
                  <div className="relative bg-white dark:bg-gray-800 p-6 rounded-full shadow-2xl">
                    <ShieldCheckIcon className="h-16 w-16 text-blue-500" />
                  </div>
                </div>
              </div>

              <h1 className="text-5xl md:text-7xl font-bold text-gray-900 dark:text-white mb-6">
                <span className="bg-gradient-to-r from-green-600 to-blue-600 bg-clip-text text-transparent">
                  SafeNest
                </span>
              </h1>

              <p className="text-xl md:text-2xl text-gray-600 dark:text-gray-300 mb-8 max-w-3xl mx-auto">
                Inclusive Finance DApp - Mobile-First DeFi Super-Wallet
              </p>

              <p className="text-lg text-gray-500 dark:text-gray-400 mb-12 max-w-2xl mx-auto">
                Micro-savings vaults, pension nest, emergency funds, and community pools with $SAFE governance for
                emerging markets.
              </p>

              {/* Wallet Connection Status */}
              <WalletConnectionStatus />

              {/* CTA Buttons */}
              <div className="flex flex-col sm:flex-row gap-4 justify-center">
                <Link
                  href="/vaults"
                  className="bg-gradient-to-r from-green-500 to-blue-600 hover:from-green-600 hover:to-blue-700 text-white font-semibold py-4 px-8 rounded-xl shadow-lg hover:shadow-xl transform hover:-translate-y-1 transition-all duration-200"
                >
                  Open Vaults
                </Link>
                <Link
                  href="/community"
                  className="bg-gradient-to-r from-purple-500 to-pink-600 hover:from-purple-600 hover:to-pink-700 text-white font-semibold py-4 px-8 rounded-xl shadow-lg hover:shadow-xl transform hover:-translate-y-1 transition-all duration-200"
                >
                  Join Community
                </Link>
                <Link
                  href="/tokenomics"
                  className="bg-gradient-to-r from-orange-500 to-red-600 hover:from-orange-600 hover:to-red-700 text-white font-semibold py-4 px-8 rounded-xl shadow-lg hover:shadow-xl transform hover:-translate-y-1 transition-all duration-200"
                >
                  $SAFE Token
                </Link>
              </div>
            </div>
          </div>
        </div>

        {/* Features Section */}
        <div className="py-20 bg-white dark:bg-gray-800">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="text-center mb-16">
              <h2 className="text-4xl font-bold text-gray-900 dark:text-white mb-4">Why Choose SafeNest?</h2>
              <p className="text-xl text-gray-600 dark:text-gray-300 max-w-2xl mx-auto">
                A comprehensive vault system with $SAFE governance for emerging markets
              </p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
              {/* Feature 1 */}
              <div className="group bg-gradient-to-br from-green-50 to-green-100 dark:from-gray-700 dark:to-gray-600 p-8 rounded-2xl shadow-lg hover:shadow-xl transform hover:-translate-y-2 transition-all duration-300">
                <div className="flex items-center justify-center w-16 h-16 bg-green-500 rounded-xl mb-6 group-hover:scale-110 transition-transform duration-300">
                  <BanknotesIcon className="h-8 w-8 text-white" />
                </div>
                <h3 className="text-xl font-semibold text-gray-900 dark:text-white mb-4">Micro-Savings Vault</h3>
                <p className="text-gray-600 dark:text-gray-300 mb-6">
                  Save tiny amounts daily/weekly with 4% APY, auto-yield deployment, and round-up features.
                </p>
                <Link href="/vaults" className="text-green-500 hover:text-green-600 font-medium">
                  Open vault →
                </Link>
              </div>

              {/* Feature 2 */}
              <div className="group bg-gradient-to-br from-blue-50 to-blue-100 dark:from-gray-700 dark:to-gray-600 p-8 rounded-2xl shadow-lg hover:shadow-xl transform hover:-translate-y-2 transition-all duration-300">
                <div className="flex items-center justify-center w-16 h-16 bg-blue-500 rounded-xl mb-6 group-hover:scale-110 transition-transform duration-300">
                  <ChartBarIcon className="h-8 w-8 text-white" />
                </div>
                <h3 className="text-xl font-semibold text-gray-900 dark:text-white mb-4">Pension Nest</h3>
                <p className="text-gray-600 dark:text-gray-300 mb-6">
                  Long-term retirement savings with 7% APY, 10-year vesting, and 2% yield boost.
                </p>
                <Link href="/vaults" className="text-blue-500 hover:text-blue-600 font-medium">
                  Plan retirement →
                </Link>
              </div>

              {/* Feature 3 */}
              <div className="group bg-gradient-to-br from-purple-50 to-purple-100 dark:from-gray-700 dark:to-gray-600 p-8 rounded-2xl shadow-lg hover:shadow-xl transform hover:-translate-y-2 transition-all duration-300">
                <div className="flex items-center justify-center w-16 h-16 bg-purple-500 rounded-xl mb-6 group-hover:scale-110 transition-transform duration-300">
                  <UsersIcon className="h-8 w-8 text-white" />
                </div>
                <h3 className="text-xl font-semibold text-gray-900 dark:text-white mb-4">Emergency Vault</h3>
                <p className="text-gray-600 dark:text-gray-300 mb-6">
                  Liquid savings with instant withdrawal, 2.25% APY, and 0.25% parking incentives.
                </p>
                <Link href="/vaults" className="text-purple-500 hover:text-purple-600 font-medium">
                  Build emergency fund →
                </Link>
              </div>
            </div>
          </div>
        </div>

        {/* Platform Stats */}
        <div className="py-20 bg-gradient-to-r from-green-500 to-blue-600">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="text-center mb-16">
              <h2 className="text-4xl font-bold text-white mb-4">Platform Impact</h2>
              <p className="text-xl text-green-100 max-w-2xl mx-auto">
                Empowering financial inclusion through mobile-first DeFi
              </p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
              <div className="text-center">
                <div className="text-4xl font-bold text-white mb-2">$0</div>
                <div className="text-green-100">Total Savings</div>
              </div>
              <div className="text-center">
                <div className="text-4xl font-bold text-white mb-2">0</div>
                <div className="text-green-100">Active Users</div>
              </div>
              <div className="text-center">
                <div className="text-4xl font-bold text-white mb-2">0</div>
                <div className="text-green-100">Community Pools</div>
              </div>
              <div className="text-center">
                <div className="text-4xl font-bold text-white mb-2">0%</div>
                <div className="text-green-100">Average APY</div>
              </div>
            </div>
          </div>
        </div>

        {/* Quick Actions */}
        <div className="py-20 bg-gray-50 dark:bg-gray-900">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="text-center mb-16">
              <h2 className="text-4xl font-bold text-gray-900 dark:text-white mb-4">Get Started Today</h2>
              <p className="text-xl text-gray-600 dark:text-gray-300">
                Start your financial journey with SafeNest vaults and $SAFE governance
              </p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
              <Link
                href="/vaults"
                className="group bg-white dark:bg-gray-800 p-8 rounded-2xl shadow-lg hover:shadow-xl transform hover:-translate-y-2 transition-all duration-300 border border-gray-200 dark:border-gray-700"
              >
                <div className="flex items-center justify-center w-16 h-16 bg-green-500 rounded-xl mb-6 group-hover:scale-110 transition-transform duration-300">
                  <BanknotesIcon className="h-8 w-8 text-white" />
                </div>
                <h3 className="text-xl font-semibold text-gray-900 dark:text-white mb-4">SafeNest Vaults</h3>
                <p className="text-gray-600 dark:text-gray-300 mb-6">
                  Open micro-savings, pension nest, and emergency vaults with $SAFE governance.
                </p>
                <div className="text-green-500 group-hover:text-green-600 font-medium">Open Vaults →</div>
              </Link>

              <Link
                href="/community"
                className="group bg-white dark:bg-gray-800 p-8 rounded-2xl shadow-lg hover:shadow-xl transform hover:-translate-y-2 transition-all duration-300 border border-gray-200 dark:border-gray-700"
              >
                <div className="flex items-center justify-center w-16 h-16 bg-purple-500 rounded-xl mb-6 group-hover:scale-110 transition-transform duration-300">
                  <UsersIcon className="h-8 w-8 text-white" />
                </div>
                <h3 className="text-xl font-semibold text-gray-900 dark:text-white mb-4">Community Pools</h3>
                <p className="text-gray-600 dark:text-gray-300 mb-6">
                  Join digital chamas and collective investment pools for higher yields.
                </p>
                <div className="text-purple-500 group-hover:text-purple-600 font-medium">Join Community →</div>
              </Link>

              <Link
                href="/help"
                className="group bg-white dark:bg-gray-800 p-8 rounded-2xl shadow-lg hover:shadow-xl transform hover:-translate-y-2 transition-all duration-300 border border-gray-200 dark:border-gray-700"
              >
                <div className="flex items-center justify-center w-16 h-16 bg-blue-500 rounded-xl mb-6 group-hover:scale-110 transition-transform duration-300">
                  <QuestionMarkCircleIcon className="h-8 w-8 text-white" />
                </div>
                <h3 className="text-xl font-semibold text-gray-900 dark:text-white mb-4">SafeNest Help System</h3>
                <p className="text-gray-600 dark:text-gray-300 mb-6">
                  Get help and provide assistance with our decentralized help platform.
                </p>
                <div className="text-blue-500 group-hover:text-blue-600 font-medium">Get Help →</div>
              </Link>

              <Link
                href="/debug"
                className="group bg-white dark:bg-gray-800 p-8 rounded-2xl shadow-lg hover:shadow-xl transform hover:-translate-y-2 transition-all duration-300 border border-gray-200 dark:border-gray-700"
              >
                <div className="flex items-center justify-center w-16 h-16 bg-orange-500 rounded-xl mb-6 group-hover:scale-110 transition-transform duration-300">
                  <BugAntIcon className="h-8 w-8 text-white" />
                </div>
                <h3 className="text-xl font-semibold text-gray-900 dark:text-white mb-4">Debug Contracts</h3>
                <p className="text-gray-600 dark:text-gray-300 mb-6">
                  Tinker with your smart contracts using our debug interface.
                </p>
                <div className="text-orange-500 group-hover:text-orange-600 font-medium">Debug Now →</div>
              </Link>
            </div>
          </div>
        </div>
      </div>
    </>
  );
};

export default Home;
