"use client";

import React, { useCallback, useEffect, useState } from "react";
import { formatEther } from "viem";
import { useAccount, useBlockNumber } from "wagmi";

interface Transaction {
  id: string;
  vaultType: number;
  vaultName: string;
  type: "deposit" | "withdraw";
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

const RealTransactionHistory = () => {
  const { address: connectedAddress } = useAccount();
  const { data: blockNumber } = useBlockNumber();
  const [transactions, setTransactions] = useState<Transaction[]>([]);
  const [vaultBalances, setVaultBalances] = useState<VaultBalance[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [lastProcessedBlock, setLastProcessedBlock] = useState<number>(0);

  const vaultNames = ["Micro-Savings", "Pension Nest", "Emergency Vault"];

  // Mock transaction history for demonstration

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
        transactionCount: 0,
      };
    });

    // Process transactions
    txs.forEach(tx => {
      if (!balances[tx.vaultType]) return;

      balances[tx.vaultType].transactionCount++;

      if (tx.type === "deposit") {
        balances[tx.vaultType].totalDeposited += tx.amount;
        balances[tx.vaultType].currentBalance += tx.amount;
      } else if (tx.type === "withdraw") {
        balances[tx.vaultType].totalWithdrawn += tx.amount;
        balances[tx.vaultType].currentBalance -= tx.amount;
      }
    });

    return Object.values(balances);
  };

  // Simulate fetching transaction history from blockchain
  const loadTransactionHistory = useCallback(async () => {
    if (!connectedAddress) return;

    setIsLoading(true);
    try {
      // In a real implementation, you would:
      // 1. Query contract events using getLogs
      // 2. Parse DepositMade and WithdrawMade events
      // 3. Convert to Transaction objects

      // For now, we'll simulate with mock data
      await new Promise(resolve => setTimeout(resolve, 1000));

      // Mock transaction data based on current time
      const mockTransactions: Transaction[] = [
        {
          id: "1",
          vaultType: 0,
          vaultName: "Micro-Savings",
          type: "deposit",
          amount: BigInt("1000000000000000000"), // 1 U2U
          timestamp: Date.now() - 3600000, // 1 hour ago
          blockNumber: Number(blockNumber || 0) - 100,
          txHash: "0x1234567890abcdef1234567890abcdef1234567890abcdef1234567890abcdef",
        },
        {
          id: "2",
          vaultType: 0,
          vaultName: "Micro-Savings",
          type: "deposit",
          amount: BigInt("500000000000000000"), // 0.5 U2U
          timestamp: Date.now() - 1800000, // 30 minutes ago
          blockNumber: Number(blockNumber || 0) - 50,
          txHash: "0xabcdef1234567890abcdef1234567890abcdef1234567890abcdef1234567890",
        },
        {
          id: "3",
          vaultType: 1,
          vaultName: "Pension Nest",
          type: "deposit",
          amount: BigInt("2000000000000000000"), // 2 U2U
          timestamp: Date.now() - 900000, // 15 minutes ago
          blockNumber: Number(blockNumber || 0) - 25,
          txHash: "0x9876543210fedcba9876543210fedcba9876543210fedcba9876543210fedcba",
        },
        {
          id: "4",
          vaultType: 0,
          vaultName: "Micro-Savings",
          type: "withdraw",
          amount: BigInt("200000000000000000"), // 0.2 U2U
          timestamp: Date.now() - 300000, // 5 minutes ago
          blockNumber: Number(blockNumber || 0) - 10,
          txHash: "0xfedcba9876543210fedcba9876543210fedcba9876543210fedcba9876543210",
        },
      ];

      setTransactions(mockTransactions);
      const balances = calculateBalances(mockTransactions);
      setVaultBalances(balances);

      console.log("Transaction history loaded:", mockTransactions);
      console.log("Calculated balances:", balances);
    } catch (error) {
      console.error("Failed to load transaction history:", error);
    } finally {
      setIsLoading(false);
    }
  }, [connectedAddress, blockNumber, calculateBalances]);

  // Add a new transaction (called after successful deposit/withdraw)
  const addTransaction = (vaultType: number, type: "deposit" | "withdraw", amount: bigint, txHash: string) => {
    const newTransaction: Transaction = {
      id: Date.now().toString(),
      vaultType,
      vaultName: vaultNames[vaultType],
      type,
      amount,
      timestamp: Date.now(),
      blockNumber: Number(blockNumber || 0),
      txHash,
    };

    const updatedTransactions = [newTransaction, ...transactions];
    setTransactions(updatedTransactions);

    const updatedBalances = calculateBalances(updatedTransactions);
    setVaultBalances(updatedBalances);

    console.log("Added new transaction:", newTransaction);
    console.log("Updated balances:", updatedBalances);
  };

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

  // Load transaction history when wallet connects
  useEffect(() => {
    if (connectedAddress) {
      loadTransactionHistory();
    }
  }, [connectedAddress, loadTransactionHistory]);

  // Auto-refresh when new blocks are mined
  useEffect(() => {
    if (blockNumber && blockNumber > lastProcessedBlock) {
      console.log(`New block detected: ${blockNumber}, last processed: ${lastProcessedBlock}`);
      setLastProcessedBlock(Number(blockNumber));
      // In a real app, you would check for new events here
    }
  }, [blockNumber, lastProcessedBlock]);

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
        {vaultBalances.map(balance => (
          <div key={balance.vaultType} className="card bg-base-100 shadow-xl p-4">
            <h3 className="text-lg font-semibold mb-2">{balance.vaultName}</h3>
            <div className="space-y-1 text-sm">
              <div className="flex justify-between">
                <span>Current Balance:</span>
                <span className="font-bold text-green-600">{formatAmount(balance.currentBalance)} U2U</span>
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
              <div className="text-xs text-gray-500">≈ ${getUsdValue(balance.currentBalance)} USD</div>
            </div>
          </div>
        ))}
      </div>

      {/* Transaction History */}
      <div className="card bg-base-100 shadow-xl p-6">
        <div className="flex justify-between items-center mb-4">
          <h2 className="text-2xl font-bold">Transaction History</h2>
          <div className="flex gap-2">
            <div className="text-sm text-gray-500">Block: {blockNumber?.toString() || "Loading..."}</div>
            <button className="btn btn-sm btn-outline" onClick={loadTransactionHistory} disabled={isLoading}>
              {isLoading ? "Loading..." : "Refresh"}
            </button>
          </div>
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
                  <th>Block</th>
                  <th>Transaction</th>
                </tr>
              </thead>
              <tbody>
                {transactions.map(tx => (
                  <tr key={tx.id}>
                    <td>
                      <span className={`badge ${tx.type === "deposit" ? "badge-success" : "badge-error"}`}>
                        {tx.type === "deposit" ? "Deposit" : "Withdraw"}
                      </span>
                    </td>
                    <td className="font-medium">{tx.vaultName}</td>
                    <td className="font-mono">
                      {tx.type === "deposit" ? "+" : "-"}
                      {formatAmount(tx.amount)} U2U
                    </td>
                    <td className="text-sm text-gray-500">${getUsdValue(tx.amount)}</td>
                    <td className="text-sm">{formatTimestamp(tx.timestamp)}</td>
                    <td className="text-sm font-mono">{tx.blockNumber}</td>
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

      {/* Test Controls */}
      <div className="card bg-base-100 shadow-xl p-6">
        <h3 className="text-lg font-semibold mb-4">Test Controls</h3>
        <div className="flex gap-2 flex-wrap">
          <button
            className="btn btn-sm btn-primary"
            onClick={() =>
              addTransaction(
                0,
                "deposit",
                BigInt("1000000000000000000"),
                "0x" + Math.random().toString(16).substr(2, 64),
              )
            }
          >
            Add Micro-Savings Deposit
          </button>
          <button
            className="btn btn-sm btn-secondary"
            onClick={() =>
              addTransaction(
                1,
                "deposit",
                BigInt("2000000000000000000"),
                "0x" + Math.random().toString(16).substr(2, 64),
              )
            }
          >
            Add Pension Deposit
          </button>
          <button
            className="btn btn-sm btn-accent"
            onClick={() =>
              addTransaction(
                2,
                "deposit",
                BigInt("500000000000000000"),
                "0x" + Math.random().toString(16).substr(2, 64),
              )
            }
          >
            Add Emergency Deposit
          </button>
          <button
            className="btn btn-sm btn-outline"
            onClick={() =>
              addTransaction(
                0,
                "withdraw",
                BigInt("100000000000000000"),
                "0x" + Math.random().toString(16).substr(2, 64),
              )
            }
          >
            Add Micro-Savings Withdrawal
          </button>
        </div>
      </div>
    </div>
  );
};

export default RealTransactionHistory;
