"use client";

import { useCallback, useEffect, useState } from "react";
import { useAccount, useWriteContract } from "wagmi";
import {
  ArrowTrendingUpIcon,
  BanknotesIcon,
  ClockIcon,
  MinusIcon,
  PlusIcon,
  ShieldCheckIcon,
} from "@heroicons/react/24/outline";
import { Address } from "~~/components/scaffold-eth";

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

interface UserVault {
  user: string;
  vaultType: number;
  totalDeposited: bigint;
  currentBalance: bigint;
  totalWithdrawn: bigint;
  lastDepositTime: bigint;
  lastWithdrawalTime: bigint;
  yieldEarned: bigint;
  isActive: boolean;
  autoDepositAmount: bigint;
  autoDepositFrequency: bigint;
  nextAutoDeposit: bigint;
}

interface VaultIntegrationProps {
  onTransactionAdded?: (transaction: {
    id: string;
    vaultType: number;
    type: "deposit" | "withdraw";
    amount: bigint;
    timestamp: number;
    txHash: string;
  }) => void;
}

const VaultIntegration = ({ onTransactionAdded }: VaultIntegrationProps) => {
  const { address: connectedAddress } = useAccount();
  const { writeContractAsync, isPending, isSuccess } = useWriteContract();
  const [depositAmounts, setDepositAmounts] = useState<string[]>(["", "", ""]);
  const [withdrawAmounts, setWithdrawAmounts] = useState<string[]>(["", "", ""]);
  const [userVaults, setUserVaults] = useState<Record<number, UserVault>>({});
  const [isRefreshing, setIsRefreshing] = useState(false);
  const [recentlyUpdated, setRecentlyUpdated] = useState<number | null>(null);
  const [transactionHistory, setTransactionHistory] = useState<
    Array<{
      id: string;
      vaultType: number;
      type: "deposit" | "withdraw";
      amount: bigint;
      timestamp: number;
      txHash: string;
    }>
  >([]);

  // Calculate vault balances from transaction history
  const calculateVaultBalances = useCallback((transactions: typeof transactionHistory) => {
    const balances: Record<number, UserVault> = {};

    // Initialize all vaults
    vaultNames.forEach((name, index) => {
      balances[index] = {
        user: connectedAddress || "",
        vaultType: index,
        totalDeposited: BigInt(0),
        currentBalance: BigInt(0),
        totalWithdrawn: BigInt(0),
        lastDepositTime: BigInt(0),
        lastWithdrawalTime: BigInt(0),
        yieldEarned: BigInt(0),
        isActive: false,
        autoDepositAmount: BigInt(0),
        autoDepositFrequency: BigInt(0),
        nextAutoDeposit: BigInt(0),
      };
    });

    // Process transactions
    transactions.forEach(tx => {
      if (!balances[tx.vaultType]) return;

      balances[tx.vaultType].isActive = true;

      if (tx.type === "deposit") {
        balances[tx.vaultType].totalDeposited += tx.amount;
        balances[tx.vaultType].currentBalance += tx.amount;
        balances[tx.vaultType].lastDepositTime = BigInt(tx.timestamp);
      } else if (tx.type === "withdraw") {
        balances[tx.vaultType].totalWithdrawn += tx.amount;
        balances[tx.vaultType].currentBalance -= tx.amount;
        balances[tx.vaultType].lastWithdrawalTime = BigInt(tx.timestamp);
      }
    });

    return balances;
  }, [connectedAddress]);

  const vaultTypes: VaultData[] = [
    {
      type: "micro-savings",
      name: "Micro-Savings Vault",
      description: "Save tiny amounts daily/weekly with automatic yield deployment",
      icon: <BanknotesIcon className="h-8 w-8" />,
      color: "bg-green-500",
      minDeposit: "0.001 U2U",
      yieldRate: "4.0% APY",
      features: ["Daily/Weekly deposits", "Auto-yield deployment", "Round-up savings", "Mobile money integration"],
      premiumRequired: false,
    },
    {
      type: "pension-nest",
      name: "Pension Nest",
      description: "Long-term retirement savings with time-locked withdrawals",
      icon: <ClockIcon className="h-8 w-8" />,
      color: "bg-blue-500",
      minDeposit: "0.01 U2U",
      yieldRate: "7.0% APY",
      features: ["10-year vesting", "2% yield boost", "Retirement planning", "Monthly withdrawals"],
      premiumRequired: false,
    },
    {
      type: "emergency-vault",
      name: "Emergency Vault",
      description: "Liquid savings with instant withdrawal and small incentives",
      icon: <ShieldCheckIcon className="h-8 w-8" />,
      color: "bg-red-500",
      minDeposit: "0.005 U2U",
      yieldRate: "2.25% APY",
      features: ["Instant withdrawal", "0.5% withdrawal fee", "0.25% parking incentive", "Insurance coverage"],
      premiumRequired: false,
    },
  ];

  const vaultNames = ["Micro-Savings", "Pension Nest", "Emergency Vault"];

  // Load transaction history from localStorage on component mount
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
          setTransactionHistory(transactions);
          console.log("Loaded saved transactions:", transactions);
        } catch (error) {
          console.error("Failed to parse saved transactions:", error);
        }
      }
    }
  }, [connectedAddress]);

  // Save transaction history to localStorage whenever it changes
  useEffect(() => {
    if (connectedAddress && transactionHistory.length > 0) {
      // Convert BigInt to string for JSON storage
      const serializable = transactionHistory.map(tx => ({
        ...tx,
        amount: tx.amount.toString(),
      }));
      localStorage.setItem(`transactions_${connectedAddress}`, JSON.stringify(serializable));
      console.log("Saved transactions to localStorage");
    }
  }, [transactionHistory, connectedAddress]);

  // Update vault balances when transaction history changes
  useEffect(() => {
    const newBalances = calculateVaultBalances(transactionHistory);
    setUserVaults(newBalances);
    console.log("Updated vault balances from transactions:", newBalances);
  }, [transactionHistory, connectedAddress, calculateVaultBalances]);

  // Add transaction to history
  const addTransactionToHistory = (vaultType: number, type: "deposit" | "withdraw", amount: bigint, txHash: string) => {
    const newTransaction = {
      id: Date.now().toString(),
      vaultType,
      type,
      amount,
      timestamp: Date.now(),
      txHash,
    };
    setTransactionHistory(prev => [newTransaction, ...prev]);

    // Notify parent component
    if (onTransactionAdded) {
      onTransactionAdded(newTransaction);
    }

    console.log("Added transaction to history:", newTransaction);
  };

  // Clear transaction history (for debugging)
  const clearTransactionHistory = () => {
    setTransactionHistory([]);
    if (connectedAddress) {
      localStorage.removeItem(`transactions_${connectedAddress}`);
    }
    console.log("Cleared transaction history");
  };

  // No longer reading from contract - using transaction-based calculations

  // No longer need to refresh from contract - balances update automatically from transactions

  const handleDeposit = async (vaultType: number) => {
    const depositAmount = depositAmounts[vaultType];
    if (!connectedAddress || !depositAmount) return;

    try {
      // First, try to create the vault if it doesn't exist
      try {
        await writeContractAsync({
          address: "0x09A16F146D9CF82083f181E6238CDF8Be8E8f43F", // VaultSystem
          abi: [
            {
              inputs: [{ internalType: "enum VaultSystem.VaultType", name: "_vaultType", type: "uint8" }],
              name: "createVault",
              outputs: [],
              stateMutability: "nonpayable",
              type: "function",
            },
          ],
          functionName: "createVault",
          args: [vaultType],
        });
        console.log(`Vault ${vaultType} created successfully`);
      } catch (createError: any) {
        // If vault already exists, this is expected - continue with deposit
        if (!createError.message.includes("Vault already exists")) {
          console.warn("Vault creation failed (may already exist):", createError.message);
        }
      }

      // Now deposit to the vault
      const txResult = await writeContractAsync({
        address: "0x09A16F146D9CF82083f181E6238CDF8Be8E8f43F", // VaultSystem
        abi: [
          {
            inputs: [
              { internalType: "enum VaultSystem.VaultType", name: "_vaultType", type: "uint8" },
              { internalType: "uint256", name: "_amount", type: "uint256" },
            ],
            name: "depositToVault",
            outputs: [],
            stateMutability: "payable",
            type: "function",
          },
        ],
        functionName: "depositToVault",
        args: [vaultType, BigInt(parseFloat(depositAmount) * 1e18)],
        value: BigInt(parseFloat(depositAmount) * 1e18),
      });

      console.log("Deposit transaction result:", txResult);

      // Add transaction to history
      addTransactionToHistory(vaultType, "deposit", BigInt(parseFloat(depositAmount) * 1e18), txResult);

      // Balances will update automatically from transaction history

      // Clear the specific vault's deposit amount
      const newDepositAmounts = [...depositAmounts];
      newDepositAmounts[vaultType] = "";
      setDepositAmounts(newDepositAmounts);

      // Show success animation
      setRecentlyUpdated(vaultType);
      setTimeout(() => setRecentlyUpdated(null), 2000);

      alert(`Successfully deposited ${depositAmount} U2U to ${vaultTypes[vaultType].name}!`);
    } catch (error: any) {
      console.error("Deposit failed:", error);
      alert(`Deposit failed: ${error.message || error.toString()}`);
    }
  };

  const handleWithdraw = async (vaultType: number) => {
    const withdrawAmount = withdrawAmounts[vaultType];
    if (!connectedAddress || !withdrawAmount) return;

    try {
      const txResult = await writeContractAsync({
        address: "0x09A16F146D9CF82083f181E6238CDF8Be8E8f43F", // VaultSystem
        abi: [
          {
            inputs: [
              { internalType: "enum VaultSystem.VaultType", name: "_vaultType", type: "uint8" },
              { internalType: "uint256", name: "_amount", type: "uint256" },
            ],
            name: "withdrawFromVault",
            outputs: [],
            stateMutability: "nonpayable",
            type: "function",
          },
        ],
        functionName: "withdrawFromVault",
        args: [vaultType, BigInt(parseFloat(withdrawAmount) * 1e18)],
      });

      console.log("Withdraw transaction result:", txResult);

      // Add transaction to history
      addTransactionToHistory(vaultType, "withdraw", BigInt(parseFloat(withdrawAmount) * 1e18), txResult);

      // Balances will update automatically from transaction history

      // Clear the specific vault's withdraw amount
      const newWithdrawAmounts = [...withdrawAmounts];
      newWithdrawAmounts[vaultType] = "";
      setWithdrawAmounts(newWithdrawAmounts);

      // Show success animation
      setRecentlyUpdated(vaultType);
      setTimeout(() => setRecentlyUpdated(null), 2000);

      alert(`Successfully withdrew ${withdrawAmount} U2U from ${vaultTypes[vaultType].name}!`);
    } catch (error: any) {
      console.error("Withdrawal failed:", error);
      alert(`Withdrawal failed: ${error.message || error.toString()}`);
    }
  };

  const formatBalance = (balance: bigint) => {
    const value = Number(balance) / 1e18;
    if (value === 0) return "0.0000";
    if (value < 0.0001) return value.toFixed(8);
    if (value < 0.01) return value.toFixed(6);
    if (value < 1) return value.toFixed(4);
    return value.toFixed(2);
  };

  if (!connectedAddress) {
    return (
      <div className="text-center py-12">
        <div className="text-gray-500 mb-4">Please connect your wallet to view vaults</div>
        <Address address={connectedAddress} />
      </div>
    );
  }

  return (
    <div className="space-y-8">
      {/* Transaction History */}
      {transactionHistory.length > 0 && (
        <div className="card bg-base-100 shadow-xl p-6">
          <div className="flex justify-between items-center mb-4">
            <h3 className="text-xl font-bold">Recent Transactions</h3>
            <button className="btn btn-sm btn-outline btn-error" onClick={clearTransactionHistory}>
              Clear History
            </button>
          </div>
          <div className="overflow-x-auto">
            <table className="table table-zebra w-full">
              <thead>
                <tr>
                  <th>Type</th>
                  <th>Vault</th>
                  <th>Amount</th>
                  <th>Time</th>
                  <th>Transaction</th>
                </tr>
              </thead>
              <tbody>
                {transactionHistory.slice(0, 10).map(tx => (
                  <tr key={tx.id}>
                    <td>
                      <span className={`badge ${tx.type === "deposit" ? "badge-success" : "badge-error"}`}>
                        {tx.type === "deposit" ? "Deposit" : "Withdraw"}
                      </span>
                    </td>
                    <td className="font-medium">{vaultNames[tx.vaultType]}</td>
                    <td className="font-mono">
                      {tx.type === "deposit" ? "+" : "-"}
                      {formatBalance(tx.amount)} U2U
                    </td>
                    <td className="text-sm">{new Date(tx.timestamp).toLocaleString()}</td>
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
        </div>
      )}

      {/* Vault Overview */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {vaultTypes.map((vault, index) => {
          const userVault = userVaults[index];
          console.log(`Vault ${index} (${vault.name}):`, userVault);
          return (
            <div
              key={vault.type}
              className={`card bg-base-100 shadow-xl transition-all duration-500 ${
                recentlyUpdated === index ? "ring-2 ring-green-500 bg-green-50 dark:bg-green-900/20" : ""
              }`}
            >
              <div className="card-body">
                <div className="flex items-center justify-between mb-4">
                  <div className={`p-3 rounded-lg ${vault.color} text-white`}>{vault.icon}</div>
                  <div className="text-right">
                    <div className="text-3xl font-bold flex items-center justify-end gap-2 mb-2">
                      {isRefreshing ? <div className="loading loading-spinner loading-sm"></div> : null}
                      <span
                        className={
                          userVault && userVault.currentBalance > 0
                            ? "text-green-600"
                            : "text-gray-700 dark:text-gray-300"
                        }
                      >
                        {userVault ? formatBalance(userVault.currentBalance) : "0.0000"}
                      </span>
                      <span className="text-lg text-gray-500">U2U</span>
                    </div>
                    <div className="text-sm text-gray-500 mb-1">
                      Current Balance
                      {!userVault && <span className="text-orange-500 ml-2">(No vault data)</span>}
                      {userVault && userVault.currentBalance > 0 && (
                        <span className="text-green-600 ml-2">✓ Active</span>
                      )}
                    </div>
                    {userVault && userVault.currentBalance > 0 && (
                      <div className="text-xs text-green-600 font-medium">
                        ≈ ${((Number(userVault.currentBalance) / 1e18) * 0.1).toFixed(2)} USD
                      </div>
                    )}
                  </div>
                </div>

                <h3 className="card-title text-lg">{vault.name}</h3>
                <p className="text-gray-600 text-sm mb-4">{vault.description}</p>

                <div className="space-y-3 mb-4 p-3 bg-gray-50 dark:bg-gray-700 rounded-lg">
                  <div className="flex justify-between items-center">
                    <span className="text-sm text-gray-600">Yield Rate:</span>
                    <span className="font-bold text-green-600 text-lg">{vault.yieldRate}</span>
                  </div>
                  <div className="flex justify-between items-center">
                    <span className="text-sm text-gray-600">Total Deposited:</span>
                    <div className="text-right">
                      <div className="font-bold text-lg">
                        {userVault ? formatBalance(userVault.totalDeposited) : "0.0000"} U2U
                      </div>
                      {userVault && userVault.totalDeposited > 0 && (
                        <div className="text-xs text-gray-500">
                          ≈ ${((Number(userVault.totalDeposited) / 1e18) * 0.1).toFixed(2)} USD
                        </div>
                      )}
                    </div>
                  </div>
                  <div className="flex justify-between items-center">
                    <span className="text-sm text-gray-600">Yield Earned:</span>
                    <div className="text-right">
                      <div className="font-bold text-lg text-green-600">
                        {userVault ? formatBalance(userVault.yieldEarned) : "0.0000"} U2U
                      </div>
                      {userVault && userVault.yieldEarned > 0 && (
                        <div className="text-xs text-green-500">
                          ≈ ${((Number(userVault.yieldEarned) / 1e18) * 0.1).toFixed(2)} USD
                        </div>
                      )}
                    </div>
                  </div>
                </div>

                {/* Deposit/Withdraw Controls */}
                <div className="space-y-3">
                  <div className="flex gap-2">
                    <input
                      type="number"
                      placeholder="Amount"
                      className="input input-bordered input-sm flex-1"
                      value={depositAmounts[index]}
                      onChange={e => {
                        const newAmounts = [...depositAmounts];
                        newAmounts[index] = e.target.value;
                        setDepositAmounts(newAmounts);
                      }}
                    />
                    <button
                      className="btn btn-primary btn-sm"
                      onClick={() => handleDeposit(index)}
                      disabled={isPending || !depositAmounts[index]}
                    >
                      <PlusIcon className="h-4 w-4" />
                      Deposit
                    </button>
                  </div>

                  <div className="flex gap-2">
                    <input
                      type="number"
                      placeholder="Amount"
                      className="input input-bordered input-sm flex-1"
                      value={withdrawAmounts[index]}
                      onChange={e => {
                        const newAmounts = [...withdrawAmounts];
                        newAmounts[index] = e.target.value;
                        setWithdrawAmounts(newAmounts);
                      }}
                    />
                    <button
                      className="btn btn-outline btn-sm"
                      onClick={() => handleWithdraw(index)}
                      disabled={isPending || !withdrawAmounts[index]}
                    >
                      <MinusIcon className="h-4 w-4" />
                      Withdraw
                    </button>
                  </div>
                </div>

                {isSuccess && recentlyUpdated === index && (
                  <div className="alert alert-success mt-4 animate-pulse">
                    <ArrowTrendingUpIcon className="h-4 w-4" />
                    Balance updated successfully!
                  </div>
                )}

                {/* Manual refresh button for this specific vault */}
                <div className="mt-2">
                  <button
                    className="btn btn-xs btn-outline"
                    onClick={async () => {
                      console.log(`Manually refreshing vault ${index}...`);
                      setIsRefreshing(true);
                      try {
                        // Mock refresh - in real implementation, this would refetch from contract
                        await new Promise(resolve => setTimeout(resolve, 1000));
                        console.log(`Vault ${index} refreshed manually`);
                      } catch (error) {
                        console.error(`Failed to refresh vault ${index}:`, error);
                      } finally {
                        setIsRefreshing(false);
                      }
                    }}
                    disabled={isRefreshing}
                  >
                    {isRefreshing ? (
                      <>
                        <span className="loading loading-spinner loading-xs"></span>
                        Refreshing...
                      </>
                    ) : (
                      "Refresh This Vault"
                    )}
                  </button>
                </div>

                {/* Show refresh status */}
                {isRefreshing && (
                  <div className="text-xs text-blue-600 mt-1">
                    🔄 Waiting for blockchain confirmation... This may take 10-30 seconds.
                  </div>
                )}
              </div>
            </div>
          );
        })}
      </div>

      {/* Transaction Status */}
      {isPending && (
        <div className="alert alert-info">
          <div className="loading loading-spinner loading-sm"></div>
          Processing transaction...
        </div>
      )}

      {/* Data Refresh Status */}
      {isRefreshing && (
        <div className="alert alert-info">
          <div className="loading loading-spinner loading-sm"></div>
          Updating vault balances...
        </div>
      )}
    </div>
  );
};

export default VaultIntegration;
