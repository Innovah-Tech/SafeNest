"use client";

import { useAccount, useReadContract } from "wagmi";

interface BalanceDisplayProps {
  vaultType: number;
  vaultName: string;
}

const BalanceDisplay = ({ vaultType, vaultName }: BalanceDisplayProps) => {
  const { address: connectedAddress } = useAccount();

  const { data: vaultData, isLoading, error } = useReadContract({
    address: "0x09A16F146D9CF82083f181E6238CDF8Be8E8f43F", // VaultSystem
    abi: [
      {
        inputs: [
          { internalType: "address", name: "_user", type: "address" },
          { internalType: "enum VaultSystem.VaultType", name: "_vaultType", type: "uint8" },
        ],
        name: "getVaultDetails",
        outputs: [
          { internalType: "uint256", name: "vaultTotalDeposited", type: "uint256" },
          { internalType: "uint256", name: "currentBalance", type: "uint256" },
          { internalType: "uint256", name: "vaultTotalWithdrawn", type: "uint256" },
          { internalType: "uint256", name: "yieldEarned", type: "uint256" },
          { internalType: "uint256", name: "lastDepositTime", type: "uint256" },
          { internalType: "uint256", name: "lastWithdrawalTime", type: "uint256" },
          { internalType: "bool", name: "isActive", type: "bool" },
          { internalType: "uint256", name: "autoDepositAmount", type: "uint256" },
          { internalType: "uint256", name: "autoDepositFrequency", type: "uint256" },
        ],
        stateMutability: "view",
        type: "function",
      },
    ],
    functionName: "getVaultDetails",
    args: connectedAddress ? [connectedAddress, vaultType] : undefined,
    query: {
      enabled: !!connectedAddress,
      retry: false, // Don't retry on error
    },
  });

  const formatBalance = (balance: bigint) => {
    const value = Number(balance) / 1e18;
    if (value === 0) return "0.00000000";
    if (value < 0.0001) return value.toFixed(8);
    if (value < 0.01) return value.toFixed(6);
    if (value < 1) return value.toFixed(4);
    return value.toFixed(2);
  };

  if (!connectedAddress) {
    return (
      <div className="bg-red-50 dark:bg-red-900/20 p-4 rounded-lg">
        <div className="text-red-600 font-medium">Please connect your wallet</div>
      </div>
    );
  }

  if (isLoading) {
    return (
      <div className="bg-blue-50 dark:bg-blue-900/20 p-4 rounded-lg">
        <div className="text-blue-600 font-medium">Loading {vaultName} balance...</div>
      </div>
    );
  }

  if (error) {
    // Check if the error is because vault doesn't exist
    if (error.message.includes("returned no data") || error.message.includes("Vault not active")) {
      return (
        <div className="bg-blue-50 dark:bg-blue-900/20 p-4 rounded-lg">
          <div className="text-blue-600 font-medium mb-2">{vaultName} - Not Created Yet</div>
          <div className="text-sm text-blue-500">
            This vault hasn't been created yet. Create it by making your first deposit!
          </div>
        </div>
      );
    }
    
    return (
      <div className="bg-yellow-50 dark:bg-yellow-900/20 p-4 rounded-lg">
        <div className="text-yellow-600 font-medium">Error loading {vaultName}: {error.message}</div>
      </div>
    );
  }

  if (!vaultData || !Array.isArray(vaultData)) {
    return (
      <div className="bg-blue-50 dark:bg-blue-900/20 p-4 rounded-lg">
        <div className="text-blue-600 font-medium mb-2">{vaultName} - Not Created Yet</div>
        <div className="text-sm text-blue-500">
          This vault hasn't been created yet. Create it by making your first deposit!
        </div>
      </div>
    );
  }

  const [vaultTotalDeposited, currentBalance, vaultTotalWithdrawn, yieldEarned, lastDepositTime, lastWithdrawalTime, isActive, autoDepositAmount, autoDepositFrequency] = vaultData;

  return (
    <div className="bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 p-4 rounded-lg shadow-sm">
      <h3 className="font-bold text-lg mb-3 text-gray-900 dark:text-white">{vaultName} Balance</h3>
      
      <div className="space-y-2">
        <div className="flex justify-between items-center">
          <span className="text-gray-600 dark:text-gray-400">Current Balance:</span>
          <span className="font-mono text-lg font-bold text-green-600">
            {formatBalance(currentBalance)} U2U
          </span>
        </div>
        
        <div className="flex justify-between items-center">
          <span className="text-gray-600 dark:text-gray-400">Total Deposited:</span>
          <span className="font-mono text-sm font-medium">
            {formatBalance(vaultTotalDeposited)} U2U
          </span>
        </div>
        
        <div className="flex justify-between items-center">
          <span className="text-gray-600 dark:text-gray-400">Total Withdrawn:</span>
          <span className="font-mono text-sm font-medium">
            {formatBalance(vaultTotalWithdrawn)} U2U
          </span>
        </div>
        
        <div className="flex justify-between items-center">
          <span className="text-gray-600 dark:text-gray-400">Yield Earned:</span>
          <span className="font-mono text-sm font-medium text-green-600">
            {formatBalance(yieldEarned)} U2U
          </span>
        </div>
        
        <div className="flex justify-between items-center">
          <span className="text-gray-600 dark:text-gray-400">Status:</span>
          <span className={`text-sm font-medium ${isActive ? 'text-green-600' : 'text-red-600'}`}>
            {isActive ? 'Active' : 'Inactive'}
          </span>
        </div>
      </div>
    </div>
  );
};

export default BalanceDisplay;
