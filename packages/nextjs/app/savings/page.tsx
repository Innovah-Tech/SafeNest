"use client";

import { useEffect, useState } from "react";
import { InvestModal } from "./_components/InvestModal";
import { QuickDepositModal } from "./_components/QuickDepositModal";
import type { NextPage } from "next";
import { useAccount } from "wagmi";
import {
  ArrowTrendingUpIcon,
  BanknotesIcon,
  ChartBarIcon,
  ClockIcon,
  CurrencyDollarIcon,
  PlusIcon,
  ShieldCheckIcon,
  UsersIcon,
} from "@heroicons/react/24/outline";
import MicroSavingsIntegration from "~~/components/MicroSavingsIntegration";
import { Address } from "~~/components/scaffold-eth";

interface Transaction {
  id: string;
  type: "deposit" | "withdraw";
  amount: BigInt;
  vaultType: number;
  timestamp: number;
  hash: string;
}

const SavingsPage: NextPage = () => {
  const { address: connectedAddress } = useAccount();
  const [activeTab, setActiveTab] = useState<"overview" | "deposit" | "invest" | "goals" | "community">("overview");
  const [isDepositModalOpen, setIsDepositModalOpen] = useState(false);
  const [isInvestModalOpen, setIsInvestModalOpen] = useState(false);
  const [transactions, setTransactions] = useState<Transaction[]>([]);

  // Load transactions from localStorage on component mount
  useEffect(() => {
    if (connectedAddress) {
      const savedTransactions = localStorage.getItem(`transactions_${connectedAddress}`);
      if (savedTransactions) {
        try {
          const parsed = JSON.parse(savedTransactions);
          // Convert amount strings back to BigInt
          const transactions = parsed.map((tx: any) => ({
            ...tx,
            amount: BigInt(tx.amount),
          }));
          setTransactions(transactions);
        } catch (error) {
          console.error("Failed to parse saved transactions:", error);
        }
      }
    }
  }, [connectedAddress]);

  // Save transactions to localStorage whenever they change
  useEffect(() => {
    if (connectedAddress && transactions.length > 0) {
      // Convert BigInt to string for JSON storage
      const serializable = transactions.map(tx => ({
        ...tx,
        amount: tx.amount.toString(),
      }));
      localStorage.setItem(`transactions_${connectedAddress}`, JSON.stringify(serializable));
    }
  }, [transactions, connectedAddress]);

  const handleTransactionAdded = (transaction: Transaction) => {
    setTransactions(prev => [...prev, transaction]);
  };

  return (
    <>
      <div className="min-h-screen bg-gradient-to-br from-green-50 via-white to-blue-50 dark:from-gray-900 dark:via-gray-800 dark:to-gray-900">
        {/* Mobile-First Header */}
        <div className="bg-white dark:bg-gray-800 shadow-lg sticky top-0 z-50">
          <div className="px-4 py-4">
            <div className="flex items-center justify-between">
              <div className="flex items-center space-x-3">
                <div className="w-10 h-10 bg-gradient-to-r from-green-500 to-blue-500 rounded-xl flex items-center justify-center">
                  <CurrencyDollarIcon className="h-6 w-6 text-white" />
                </div>
                <div>
                  <h1 className="text-xl font-bold text-gray-900 dark:text-white">MicroSavings</h1>
                  <p className="text-sm text-gray-500 dark:text-gray-400">Mobile DeFi Platform</p>
                </div>
              </div>

              {/* Wallet Status */}
              {connectedAddress ? (
                <div className="flex items-center space-x-2 bg-green-50 dark:bg-green-900/20 px-3 py-2 rounded-lg">
                  <div className="w-2 h-2 bg-green-500 rounded-full animate-pulse"></div>
                  <span className="text-xs text-green-700 dark:text-green-300 font-medium">Connected</span>
                </div>
              ) : (
                <div className="flex items-center space-x-2 bg-yellow-50 dark:bg-yellow-900/20 px-3 py-2 rounded-lg">
                  <div className="w-2 h-2 bg-yellow-500 rounded-full"></div>
                  <span className="text-xs text-yellow-700 dark:text-yellow-300 font-medium">Connect</span>
                </div>
              )}
            </div>
          </div>
        </div>

        {/* Mobile Navigation Tabs */}
        <div className="bg-white dark:bg-gray-800 border-b border-gray-200 dark:border-gray-700 px-4">
          <div className="flex space-x-1 overflow-x-auto">
            <button
              className={`flex items-center space-x-2 py-3 px-4 border-b-2 text-sm font-medium whitespace-nowrap ${
                activeTab === "overview"
                  ? "border-green-500 text-green-600 dark:text-green-400"
                  : "border-transparent text-gray-500 hover:text-gray-700 dark:text-gray-400"
              }`}
              onClick={() => setActiveTab("overview")}
            >
              <ChartBarIcon className="h-4 w-4" />
              <span>Overview</span>
            </button>
            <button
              className={`flex items-center space-x-2 py-3 px-4 border-b-2 text-sm font-medium whitespace-nowrap ${
                activeTab === "deposit"
                  ? "border-green-500 text-green-600 dark:text-green-400"
                  : "border-transparent text-gray-500 hover:text-gray-700 dark:text-gray-400"
              }`}
              onClick={() => setActiveTab("deposit")}
            >
              <PlusIcon className="h-4 w-4" />
              <span>Deposit</span>
            </button>
            <button
              className={`flex items-center space-x-2 py-3 px-4 border-b-2 text-sm font-medium whitespace-nowrap ${
                activeTab === "invest"
                  ? "border-green-500 text-green-600 dark:text-green-400"
                  : "border-transparent text-gray-500 hover:text-gray-700 dark:text-gray-400"
              }`}
              onClick={() => setActiveTab("invest")}
            >
              <ArrowTrendingUpIcon className="h-4 w-4" />
              <span>Invest</span>
            </button>
            <button
              className={`flex items-center space-x-2 py-3 px-4 border-b-2 text-sm font-medium whitespace-nowrap ${
                activeTab === "goals"
                  ? "border-green-500 text-green-600 dark:text-green-400"
                  : "border-transparent text-gray-500 hover:text-gray-700 dark:text-gray-400"
              }`}
              onClick={() => setActiveTab("goals")}
            >
              <ClockIcon className="h-4 w-4" />
              <span>Goals</span>
            </button>
            <button
              className={`flex items-center space-x-2 py-3 px-4 border-b-2 text-sm font-medium whitespace-nowrap ${
                activeTab === "community"
                  ? "border-green-500 text-green-600 dark:text-green-400"
                  : "border-transparent text-gray-500 hover:text-gray-700 dark:text-gray-400"
              }`}
              onClick={() => setActiveTab("community")}
            >
              <UsersIcon className="h-4 w-4" />
              <span>Community</span>
            </button>
          </div>
        </div>

        {/* Tab Content */}
        <div className="px-4 py-6 space-y-6">
          {activeTab === "overview" && (
            <div className="space-y-6">
              {/* Test Basic Display */}
              <div className="bg-white dark:bg-gray-800 rounded-2xl shadow-lg p-6">
                <h2 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">Portfolio Summary</h2>
                <div className="text-center py-4">
                  <div className="text-2xl font-bold text-green-600 mb-2">{transactions.length} Transactions</div>
                  <div className="text-sm text-gray-500 dark:text-gray-400">
                    Connected: {connectedAddress ? "Yes" : "No"}
                  </div>
                </div>
              </div>

              {/* Dynamic Portfolio Summary */}
              <MicroSavingsIntegration transactions={transactions} onTransactionAdded={handleTransactionAdded} />

              {/* Quick Actions */}
              <div className="grid grid-cols-2 gap-4">
                <button
                  onClick={() => setIsDepositModalOpen(true)}
                  className="bg-gradient-to-r from-green-500 to-green-600 hover:from-green-600 hover:to-green-700 text-white p-4 rounded-xl shadow-lg transition-all duration-200 transform hover:-translate-y-1"
                >
                  <PlusIcon className="h-6 w-6 mx-auto mb-2" />
                  <div className="text-sm font-medium">Quick Deposit</div>
                </button>
                <button
                  onClick={() => setIsInvestModalOpen(true)}
                  className="bg-gradient-to-r from-blue-500 to-blue-600 hover:from-blue-600 hover:to-blue-700 text-white p-4 rounded-xl shadow-lg transition-all duration-200 transform hover:-translate-y-1"
                >
                  <ArrowTrendingUpIcon className="h-6 w-6 mx-auto mb-2" />
                  <div className="text-sm font-medium">Invest Now</div>
                </button>
              </div>
            </div>
          )}

          {activeTab === "deposit" && (
            <div className="space-y-6">
              {/* Deposit Form */}
              <div className="bg-white dark:bg-gray-800 rounded-2xl shadow-lg p-6">
                <h2 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">Make a Deposit</h2>

                <div className="space-y-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                      Select Stablecoin
                    </label>
                    <select className="w-full p-3 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-white">
                      <option>USDC</option>
                      <option>DAI</option>
                    </select>
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">Amount</label>
                    <input
                      type="number"
                      placeholder="0.00"
                      className="w-full p-3 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-white"
                    />
                  </div>

                  <button
                    onClick={() => setIsDepositModalOpen(true)}
                    className="w-full bg-gradient-to-r from-green-500 to-green-600 hover:from-green-600 hover:to-green-700 text-white py-3 rounded-lg font-medium transition-all duration-200"
                  >
                    Deposit Now
                  </button>
                </div>
              </div>

              {/* Round-Up Feature */}
              <div className="bg-gradient-to-r from-purple-50 to-pink-50 dark:from-purple-900/20 dark:to-pink-900/20 rounded-2xl p-6">
                <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-2">Round-Up Deposits</h3>
                <p className="text-sm text-gray-600 dark:text-gray-300 mb-4">
                  Automatically round up your everyday spending and save the difference
                </p>
                <button className="bg-gradient-to-r from-purple-500 to-pink-500 text-white px-4 py-2 rounded-lg text-sm font-medium">
                  Enable Round-Up
                </button>
              </div>
            </div>
          )}

          {activeTab === "invest" && (
            <div className="space-y-6">
              {/* Investment Strategies */}
              <div className="bg-white dark:bg-gray-800 rounded-2xl shadow-lg p-6">
                <h2 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">Investment Strategies</h2>

                <div className="text-center py-8">
                  <div className="text-gray-500 dark:text-gray-400 mb-2">No investment strategies available</div>
                  <div className="text-sm text-gray-400 dark:text-gray-500">
                    Strategies will be added by the platform owner
                  </div>
                </div>
              </div>
            </div>
          )}

          {activeTab === "goals" && (
            <div className="space-y-6">
              {/* Goals List */}
              <div className="bg-white dark:bg-gray-800 rounded-2xl shadow-lg p-6">
                <div className="flex items-center justify-between mb-4">
                  <h2 className="text-lg font-semibold text-gray-900 dark:text-white">Savings Goals</h2>
                  <button className="bg-green-500 text-white p-2 rounded-lg">
                    <PlusIcon className="h-5 w-5" />
                  </button>
                </div>

                <div className="text-center py-8">
                  <div className="text-gray-500 dark:text-gray-400 mb-2">No savings goals set</div>
                  <div className="text-sm text-gray-400 dark:text-gray-500">
                    Create your first goal to start tracking progress
                  </div>
                </div>
              </div>
            </div>
          )}

          {activeTab === "community" && (
            <div className="space-y-6">
              {/* Community Pools */}
              <div className="bg-white dark:bg-gray-800 rounded-2xl shadow-lg p-6">
                <div className="flex items-center justify-between mb-4">
                  <h2 className="text-lg font-semibold text-gray-900 dark:text-white">Community Pools</h2>
                  <button className="bg-blue-500 text-white p-2 rounded-lg">
                    <PlusIcon className="h-5 w-5" />
                  </button>
                </div>

                <div className="text-center py-8">
                  <div className="text-gray-500 dark:text-gray-400 mb-2">No community pools available</div>
                  <div className="text-sm text-gray-400 dark:text-gray-500">
                    Create or join a pool to start community savings
                  </div>
                </div>
              </div>
            </div>
          )}
        </div>

        {/* Modals */}
        <QuickDepositModal isOpen={isDepositModalOpen} onClose={() => setIsDepositModalOpen(false)} />
        <InvestModal isOpen={isInvestModalOpen} onClose={() => setIsInvestModalOpen(false)} />
      </div>
    </>
  );
};

export default SavingsPage;
