"use client";

import { useState, useEffect } from "react";
import { useAccount } from "wagmi";
import { formatEther } from "viem";

interface Transaction {
  id: string;
  type: 'deposit' | 'withdraw';
  amount: BigInt;
  vaultType: number;
  timestamp: number;
  hash: string;
}

interface VaultBalance {
  currentBalance: BigInt;
  totalDeposited: BigInt;
  totalWithdrawn: BigInt;
  isActive: boolean;
}

interface MicroSavingsIntegrationProps {
  transactions: Transaction[];
  onTransactionAdded?: (transaction: Transaction) => void;
}

const MicroSavingsIntegration: React.FC<MicroSavingsIntegrationProps> = ({ 
  transactions, 
  onTransactionAdded 
}) => {
  const { address: connectedAddress } = useAccount();
  const [vaultBalances, setVaultBalances] = useState<Record<number, VaultBalance>>({});

  const vaultNames = ["Micro-Savings", "Pension Nest", "Emergency Vault"];

  // Calculate vault balances from transaction history
  const calculateVaultBalances = (transactions: Transaction[]) => {
    const balances: Record<number, VaultBalance> = {};

    // Initialize all vaults
    vaultNames.forEach((_, index) => {
      balances[index] = {
        currentBalance: BigInt(0),
        totalDeposited: BigInt(0),
        totalWithdrawn: BigInt(0),
        isActive: false
      };
    });

    // Process transactions
    transactions.forEach(tx => {
      if (!balances[tx.vaultType]) return;

      balances[tx.vaultType].isActive = true;

      if (tx.type === 'deposit') {
        balances[tx.vaultType].totalDeposited += tx.amount;
        balances[tx.vaultType].currentBalance += tx.amount;
      } else if (tx.type === 'withdraw') {
        balances[tx.vaultType].totalWithdrawn += tx.amount;
        balances[tx.vaultType].currentBalance -= tx.amount;
      }
    });

    return balances;
  };

  // Update balances when transactions change
  useEffect(() => {
    const balances = calculateVaultBalances(transactions);
    setVaultBalances(balances);
  }, [transactions]);

  const formatBalance = (balance: BigInt) => {
    const balanceStr = formatEther(balance);
    const num = parseFloat(balanceStr);
    
    if (num === 0) return "0.0000";
    if (num < 0.0001) return num.toFixed(8);
    if (num < 0.01) return num.toFixed(6);
    if (num < 1) return num.toFixed(4);
    return num.toFixed(2);
  };

  // Calculate totals
  const totalSavings = Object.values(vaultBalances).reduce((sum, vault) => sum + vault.currentBalance, BigInt(0));
  const totalDeposited = Object.values(vaultBalances).reduce((sum, vault) => sum + vault.totalDeposited, BigInt(0));
  const totalWithdrawn = Object.values(vaultBalances).reduce((sum, vault) => sum + vault.totalWithdrawn, BigInt(0));
  const activeVaults = Object.values(vaultBalances).filter(vault => vault.isActive).length;

  // Get micro-savings specific data (vault type 0)
  const microSavingsVault = vaultBalances[0] || {
    currentBalance: BigInt(0),
    totalDeposited: BigInt(0),
    totalWithdrawn: BigInt(0),
    isActive: false
  };

  return (
    <div className="space-y-6">
      {/* Portfolio Summary */}
      <div className="bg-white dark:bg-gray-800 rounded-2xl shadow-lg p-6">
        <h2 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">Dynamic Portfolio Summary</h2>
        
        <div className="grid grid-cols-2 gap-4 mb-6">
          <div className="text-center">
            <div className="text-2xl font-bold text-green-600">
              {formatBalance(totalSavings)} U2U
            </div>
            <div className="text-sm text-gray-500 dark:text-gray-400">Total Savings</div>
            <div className="text-xs text-gray-400">
              ≈ ${(Number(formatEther(totalSavings)) * 0.1).toFixed(2)} USD
            </div>
          </div>
          <div className="text-center">
            <div className="text-2xl font-bold text-blue-600">
              {formatBalance(microSavingsVault.currentBalance)} U2U
            </div>
            <div className="text-sm text-gray-500 dark:text-gray-400">Micro-Savings</div>
            <div className="text-xs text-gray-400">
              ≈ ${(Number(formatEther(microSavingsVault.currentBalance)) * 0.1).toFixed(2)} USD
            </div>
          </div>
        </div>

        <div className="grid grid-cols-2 gap-4">
          <div className="text-center">
            <div className="text-xl font-bold text-purple-600">
              {formatBalance(vaultBalances[2]?.currentBalance || BigInt(0))} U2U
            </div>
            <div className="text-sm text-gray-500 dark:text-gray-400">Emergency Fund</div>
            <div className="text-xs text-gray-400">
              ≈ ${(Number(formatEther(vaultBalances[2]?.currentBalance || BigInt(0))) * 0.1).toFixed(2)} USD
            </div>
          </div>
          <div className="text-center">
            <div className="text-xl font-bold text-orange-600">
              {formatBalance(vaultBalances[1]?.currentBalance || BigInt(0))} U2U
            </div>
            <div className="text-sm text-gray-500 dark:text-gray-400">Pension Nest</div>
            <div className="text-xs text-gray-400">
              ≈ ${(Number(formatEther(vaultBalances[1]?.currentBalance || BigInt(0))) * 0.1).toFixed(2)} USD
            </div>
          </div>
        </div>

        {/* Summary Stats */}
        <div className="mt-6 pt-6 border-t border-gray-200 dark:border-gray-700">
          <div className="grid grid-cols-3 gap-4 text-center">
            <div>
              <div className="text-lg font-semibold text-gray-900 dark:text-white">
                {formatBalance(totalDeposited)} U2U
              </div>
              <div className="text-xs text-gray-500 dark:text-gray-400">Total Deposited</div>
            </div>
            <div>
              <div className="text-lg font-semibold text-gray-900 dark:text-white">
                {formatBalance(totalWithdrawn)} U2U
              </div>
              <div className="text-xs text-gray-500 dark:text-gray-400">Total Withdrawn</div>
            </div>
            <div>
              <div className="text-lg font-semibold text-gray-900 dark:text-white">
                {activeVaults}
              </div>
              <div className="text-xs text-gray-500 dark:text-gray-400">Active Vaults</div>
            </div>
          </div>
        </div>
      </div>

      {/* Recent Activity */}
      <div className="bg-white dark:bg-gray-800 rounded-2xl shadow-lg p-6">
        <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">Recent Activity</h3>
        
        {transactions.length === 0 ? (
          <div className="text-center py-8">
            <div className="text-gray-500 dark:text-gray-400 mb-2">No recent activity</div>
            <div className="text-sm text-gray-400 dark:text-gray-500">Start by making your first deposit</div>
          </div>
        ) : (
          <div className="space-y-3">
            {transactions.slice(0, 5).map((tx, index) => (
              <div key={tx.id || index} className="flex items-center justify-between p-3 bg-gray-50 dark:bg-gray-700 rounded-lg">
                <div className="flex items-center space-x-3">
                  <div className={`w-2 h-2 rounded-full ${tx.type === 'deposit' ? 'bg-green-500' : 'bg-red-500'}`}></div>
                  <div>
                    <div className="text-sm font-medium text-gray-900 dark:text-white">
                      {tx.type === 'deposit' ? 'Deposit' : 'Withdrawal'}
                    </div>
                    <div className="text-xs text-gray-500 dark:text-gray-400">
                      {vaultNames[tx.vaultType]} • {new Date(tx.timestamp).toLocaleDateString()}
                    </div>
                  </div>
                </div>
                <div className="text-right">
                  <div className={`text-sm font-semibold ${tx.type === 'deposit' ? 'text-green-600' : 'text-red-600'}`}>
                    {tx.type === 'deposit' ? '+' : '-'}{formatBalance(tx.amount)} U2U
                  </div>
                  <div className="text-xs text-gray-500 dark:text-gray-400">
                    ≈ ${(Number(formatEther(tx.amount)) * 0.1).toFixed(2)} USD
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

export default MicroSavingsIntegration;
