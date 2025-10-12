"use client";

import React, { useEffect, useState } from "react";
import { formatEther } from "viem";
import { useAccount, useReadContract } from "wagmi";

const BalanceTest = () => {
  const { address: connectedAddress } = useAccount();
  const [testResults, setTestResults] = useState<string[]>([]);

  const addResult = (message: string) => {
    setTestResults(prev => [...prev, `${new Date().toLocaleTimeString()}: ${message}`]);
  };

  const {
    data: microSavingsVault,
    refetch: refetchMicro,
    error: microError,
  } = useReadContract({
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
    args: connectedAddress ? [connectedAddress, 0] : undefined, // 0 = Micro-Savings
    query: {
      enabled: !!connectedAddress,
      retry: false,
    },
  });

  useEffect(() => {
    if (microSavingsVault) {
      addResult(`Micro-Savings data received: ${JSON.stringify(microSavingsVault)}`);
      if (Array.isArray(microSavingsVault) && microSavingsVault[1]) {
        addResult(`Current balance: ${formatEther(microSavingsVault[1])} U2U`);
      }
    }
  }, [microSavingsVault]);

  useEffect(() => {
    if (microError) {
      addResult(`Micro-Savings error: ${microError.message}`);
    }
  }, [microError]);

  const testBalance = async () => {
    addResult("Starting balance test...");
    try {
      const result = await refetchMicro();
      addResult(`Refetch result: ${JSON.stringify(result)}`);
    } catch (error: any) {
      addResult(`Refetch error: ${error.message}`);
    }
  };

  const clearResults = () => {
    setTestResults([]);
  };

  if (!connectedAddress) {
    return (
      <div className="card bg-base-100 shadow-xl p-6">
        <h2 className="text-2xl font-bold mb-4">Balance Test</h2>
        <p className="text-red-500">Please connect your wallet to test balance display.</p>
      </div>
    );
  }

  return (
    <div className="card bg-base-100 shadow-xl p-6">
      <h2 className="text-2xl font-bold mb-4">Balance Test - Micro-Savings Vault</h2>

      <div className="mb-4">
        <p>
          <strong>Connected Address:</strong> {connectedAddress}
        </p>
        <p>
          <strong>Vault Data:</strong> {microSavingsVault ? "Available" : "Not Available"}
        </p>
        <p>
          <strong>Error:</strong> {microError ? microError.message : "None"}
        </p>
        {microSavingsVault && Array.isArray(microSavingsVault) && (
          <p>
            <strong>Current Balance:</strong> {formatEther(microSavingsVault[1])} U2U
          </p>
        )}
      </div>

      <div className="flex gap-2 mb-4">
        <button className="btn btn-primary" onClick={testBalance}>
          Test Balance Refresh
        </button>
        <button className="btn btn-outline" onClick={clearResults}>
          Clear Results
        </button>
      </div>

      <div className="bg-gray-100 dark:bg-gray-800 p-4 rounded-lg max-h-64 overflow-y-auto">
        <h3 className="font-bold mb-2">Test Results:</h3>
        {testResults.length === 0 ? (
          <p className="text-gray-500">No test results yet. Click &quot;Test Balance Refresh&quot; to start.</p>
        ) : (
          <div className="space-y-1">
            {testResults.map((result, index) => (
              <div key={index} className="text-sm font-mono">
                {result}
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

export default BalanceTest;
