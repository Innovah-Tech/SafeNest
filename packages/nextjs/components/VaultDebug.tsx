"use client";

import { useAccount, useReadContract } from "wagmi";

const VaultDebug = () => {
  const { address: connectedAddress } = useAccount();

  const {
    data: microSavingsVault,
    error: microError,
    isLoading: microLoading,
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

  if (!connectedAddress) {
    return <div className="text-red-500">Please connect your wallet</div>;
  }

  return (
    <div className="bg-yellow-100 dark:bg-yellow-900 p-4 rounded-lg">
      <h3 className="font-bold text-lg mb-2">Vault Debug Info</h3>
      <div className="space-y-2 text-sm">
        <div>
          <strong>Connected Address:</strong> {connectedAddress}
        </div>
        <div>
          <strong>Loading:</strong> {microLoading ? "Yes" : "No"}
        </div>
        <div>
          <strong>Error:</strong>{" "}
          {microError
            ? microError.message.includes("returned no data")
              ? "Vault not created yet"
              : microError.message
            : "None"}
        </div>
        <div>
          <strong>Vault Data:</strong> {microSavingsVault ? "Found" : microError ? "Not created" : "Not found"}
        </div>
        {microSavingsVault && (
          <div className="mt-2 p-2 bg-white dark:bg-gray-800 rounded">
            <pre className="text-xs overflow-auto">
              {JSON.stringify(
                microSavingsVault,
                (key, value) => (typeof value === "bigint" ? value.toString() : value),
                2,
              )}
            </pre>
          </div>
        )}
      </div>
    </div>
  );
};

export default VaultDebug;
