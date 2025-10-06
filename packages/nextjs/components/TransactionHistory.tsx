"use client";

import React, { useState, useEffect } from "react";
import { useAccount, useReadContract } from "wagmi";
import { formatEther } from "viem";

interface Transaction {
  id: string;
  vaultType: number;
  vaultName: string;
  type: 'deposit' | 'withdraw';
  amount: bigint;
  timestamp: number;
  blockNumber: number;
  txHash: string;
}

interface VaultBalance {
  vaultType: number;
  vaultName: string;
  totalDeposited: bigint;
  totalWithdrawn: bigint;
  currentBalance: bigint;
  transactionCount: number;
}

interface TransactionHistoryProps {
  transactions?: Transaction[];
}

const TransactionHistory = ({ transactions = [] }: TransactionHistoryProps) => {
  const { address: connectedAddress } = useAccount();
  const [vaultBalances, setVaultBalances] = useState<VaultBalance[]>([]);
  const [isLoading, setIsLoading] = useState(false);

  const vaultNames = ["Micro-Savings", "Pension Nest", "Emergency Vault"];

  // No mock data - only show real transactions

  // Calculate vault balances from transaction history
  const calculateBalances = (txs: Transaction[]): VaultBalance[] => {
    const balances: Record<number, VaultBalance> = {};

    // Initialize all vaults
    vaultNames.forEach((name, index) => {
      balances[index] = {
        vaultType: index,
        vaultName: name,
        totalDeposited: BigInt(0),
        totalWithdrawn: BigInt(0),
        currentBalance: BigInt(0),
        transactionCount: 0
      };
    });

    // Process transactions
    txs.forEach(tx => {
      if (!balances[tx.vaultType]) return;

      balances[tx.vaultType].transactionCount++;

      if (tx.type === 'deposit') {
        balances[tx.vaultType].totalDeposited += tx.amount;
        balances[tx.vaultType].currentBalance += tx.amount;
      } else if (tx.type === 'withdraw') {
        balances[tx.vaultType].totalWithdrawn += tx.amount;
        balances[tx.vaultType].currentBalance -= tx.amount;
      }
    });

    return Object.values(balances);
  };

  // Calculate balances from current transactions
  useEffect(() => {
    const balances = calculateBalances(transactions);
    setVaultBalances(balances);
    console.log("Updated balances from transactions:", balances);
  }, [transactions]);


  // Format amount for display
  const formatAmount = (amount: bigint) => {
    const value = Number(formatEther(amount));
    if (value === 0) return "0.0000";
    if (value < 0.0001) return value.toFixed(8);
    if (value < 0.01) return value.toFixed(6);
    if (value < 1) return value.toFixed(4);
    return value.toFixed(2);
  };

  // Format timestamp
  const formatTimestamp = (timestamp: number) => {
    return new Date(timestamp).toLocaleString();
  };

  // Get USD equivalent (mock rate)
  const getUsdValue = (amount: bigint) => {
    const value = Number(formatEther(amount));
    return (value * 0.1).toFixed(2); // Assuming 1 U2U = 0.1 USD
  };


  if (!connectedAddress) {
    return (
      <div className="card bg-base-100 shadow-xl p-6">
        <h2 className="text-2xl font-bold mb-4">Transaction History</h2>
        <p className="text-red-500">Please connect your wallet to view transaction history.</p>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Vault Balances Summary */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        {vaultBalances.map((balance) => (
          <div key={balance.vaultType} className="card bg-base-100 shadow-xl p-4">
            <h3 className="text-lg font-semibold mb-2">{balance.vaultName}</h3>
            <div className="space-y-1 text-sm">
              <div className="flex justify-between">
                <span>Current Balance:</span>
                <span className="font-bold text-green-600">
                  {formatAmount(balance.currentBalance)} U2U
                </span>
              </div>
              <div className="flex justify-between">
                <span>Total Deposited:</span>
                <span>{formatAmount(balance.totalDeposited)} U2U</span>
              </div>
              <div className="flex justify-between">
                <span>Total Withdrawn:</span>
                <span>{formatAmount(balance.totalWithdrawn)} U2U</span>
              </div>
              <div className="flex justify-between">
                <span>Transactions:</span>
                <span>{balance.transactionCount}</span>
              </div>
              <div className="text-xs text-gray-500">
                ≈ ${getUsdValue(balance.currentBalance)} USD
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* Transaction History */}
      <div className="card bg-base-100 shadow-xl p-6">
        <div className="flex justify-between items-center mb-4">
          <h2 className="text-2xl font-bold">Transaction History</h2>
            <button
              className="btn btn-sm btn-outline"
              onClick={() => window.location.reload()}
            >
              Refresh Page
            </button>
        </div>

        {isLoading ? (
          <div className="text-center py-8">
            <span className="loading loading-spinner loading-lg"></span>
            <p className="mt-2">Loading transaction history...</p>
          </div>
        ) : transactions.length === 0 ? (
          <div className="text-center py-8 text-gray-500">
            <p>No transactions found.</p>
            <p className="text-sm">Make a deposit or withdrawal to see transaction history.</p>
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="table table-zebra w-full">
              <thead>
                <tr>
                  <th>Type</th>
                  <th>Vault</th>
                  <th>Amount</th>
                  <th>USD Value</th>
                  <th>Time</th>
                  <th>Transaction</th>
                </tr>
              </thead>
              <tbody>
                {transactions.map((tx) => (
                  <tr key={tx.id}>
                    <td>
                      <span className={`badge ${
                        tx.type === 'deposit' ? 'badge-success' : 'badge-error'
                      }`}>
                        {tx.type === 'deposit' ? 'Deposit' : 'Withdraw'}
                      </span>
                    </td>
                    <td className="font-medium">{tx.vaultName}</td>
                    <td className="font-mono">
                      {tx.type === 'deposit' ? '+' : '-'}{formatAmount(tx.amount)} U2U
                    </td>
                    <td className="text-sm text-gray-500">
                      ${getUsdValue(tx.amount)}
                    </td>
                    <td className="text-sm">
                      {formatTimestamp(tx.timestamp)}
                    </td>
                    <td>
                      <a
                        href={`https://u2uscan.xyz/tx/${tx.txHash}`}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="link link-primary text-xs"
                      >
                        View
                      </a>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>

    </div>
  );
};

export default TransactionHistory;
