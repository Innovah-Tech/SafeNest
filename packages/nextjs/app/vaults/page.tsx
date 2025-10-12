"use client";

import { useEffect, useState } from "react";
import type { NextPage } from "next";
import TransactionHistory from "~~/components/TransactionHistory";
import VaultIntegration from "~~/components/VaultIntegration";

interface Transaction {
  id: string;
  vaultType: number;
  type: "deposit" | "withdraw";
  amount: bigint;
  timestamp: number;
  txHash: string;
}

const VaultsPage: NextPage = () => {
  const [transactions, setTransactions] = useState<Transaction[]>([]);

  // Load transactions from localStorage on component mount
  useEffect(() => {
    const savedTransactions = localStorage.getItem("global_transactions");
    if (savedTransactions) {
      try {
        const parsed = JSON.parse(savedTransactions);
        // Convert amount strings back to BigInt
        const transactions = parsed.map((tx: any) => ({
          ...tx,
          amount: BigInt(tx.amount),
        }));
        setTransactions(transactions);
        console.log("Loaded global transactions:", transactions);
      } catch (error) {
        console.error("Failed to parse saved global transactions:", error);
      }
    }
  }, []);

  // Save transactions to localStorage whenever they change
  useEffect(() => {
    if (transactions.length > 0) {
      // Convert BigInt to string for JSON storage
      const serializable = transactions.map(tx => ({
        ...tx,
        amount: tx.amount.toString(),
      }));
      localStorage.setItem("global_transactions", JSON.stringify(serializable));
      console.log("Saved global transactions to localStorage");
    }
  }, [transactions]);

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
        <VaultIntegration onTransactionAdded={tx => setTransactions(prev => [tx, ...prev])} />

        {/* Transaction History */}
        <TransactionHistory transactions={transactions} />

        {/* Network Information */}
        <div className="mt-16 bg-white dark:bg-gray-800 rounded-2xl shadow-lg p-8">
          <div className="text-center">
            <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-4">Deployed on U2U Solaris Mainnet</h2>
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
                <a
                  href="https://u2uscan.xyz"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-blue-600 hover:text-blue-800 ml-1"
                >
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
