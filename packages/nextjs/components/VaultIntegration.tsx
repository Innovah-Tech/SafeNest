"use client";

import { useState, useEffect } from "react";
import { useAccount, useReadContract, useWriteContract } from "wagmi";
import { Address } from "~~/components/scaffold-eth";
import { 
  BanknotesIcon, 
  ClockIcon, 
  ShieldCheckIcon,
  PlusIcon,
  MinusIcon,
  ArrowTrendingUpIcon
} from "@heroicons/react/24/outline";

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

const VaultIntegration = () => {
  const { address: connectedAddress } = useAccount();
  const { writeContract, isPending, isSuccess } = useWriteContract();
  const [selectedVault, setSelectedVault] = useState<VaultData | null>(null);
  const [depositAmount, setDepositAmount] = useState("");
  const [withdrawAmount, setWithdrawAmount] = useState("");
  const [userVaults, setUserVaults] = useState<Record<number, UserVault>>({});

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
      premiumRequired: false
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
      premiumRequired: false
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
      premiumRequired: false
    }
  ];

  // Read user vault data
  const { data: microSavingsVault } = useReadContract({
    address: "0x09A16F146D9CF82083f181E6238CDF8Be8E8f43F", // VaultSystem
    abi: [
      {
        inputs: [
          { internalType: "address", name: "user", type: "address" },
          { internalType: "uint8", name: "vaultType", type: "uint8" },
        ],
        name: "getUserVault",
        outputs: [
          {
            components: [
              { internalType: "address", name: "user", type: "address" },
              { internalType: "uint8", name: "vaultType", type: "uint8" },
              { internalType: "uint256", name: "totalDeposited", type: "uint256" },
              { internalType: "uint256", name: "currentBalance", type: "uint256" },
              { internalType: "uint256", name: "totalWithdrawn", type: "uint256" },
              { internalType: "uint256", name: "lastDepositTime", type: "uint256" },
              { internalType: "uint256", name: "lastWithdrawalTime", type: "uint256" },
              { internalType: "uint256", name: "yieldEarned", type: "uint256" },
              { internalType: "bool", name: "isActive", type: "bool" },
              { internalType: "uint256", name: "autoDepositAmount", type: "uint256" },
              { internalType: "uint256", name: "autoDepositFrequency", type: "uint256" },
              { internalType: "uint256", name: "nextAutoDeposit", type: "uint256" },
            ],
            internalType: "struct VaultSystem.UserVault",
            name: "",
            type: "tuple",
          },
        ],
        stateMutability: "view",
        type: "function",
      },
    ],
    functionName: "getUserVault",
    args: connectedAddress ? [connectedAddress, 0] : undefined, // 0 = Micro-Savings
  });

  const { data: pensionVault } = useReadContract({
    address: "0x09A16F146D9CF82083f181E6238CDF8Be8E8f43F", // VaultSystem
    abi: [
      {
        inputs: [
          { internalType: "address", name: "user", type: "address" },
          { internalType: "uint8", name: "vaultType", type: "uint8" },
        ],
        name: "getUserVault",
        outputs: [
          {
            components: [
              { internalType: "address", name: "user", type: "address" },
              { internalType: "uint8", name: "vaultType", type: "uint8" },
              { internalType: "uint256", name: "totalDeposited", type: "uint256" },
              { internalType: "uint256", name: "currentBalance", type: "uint256" },
              { internalType: "uint256", name: "totalWithdrawn", type: "uint256" },
              { internalType: "uint256", name: "lastDepositTime", type: "uint256" },
              { internalType: "uint256", name: "lastWithdrawalTime", type: "uint256" },
              { internalType: "uint256", name: "yieldEarned", type: "uint256" },
              { internalType: "bool", name: "isActive", type: "bool" },
              { internalType: "uint256", name: "autoDepositAmount", type: "uint256" },
              { internalType: "uint256", name: "autoDepositFrequency", type: "uint256" },
              { internalType: "uint256", name: "nextAutoDeposit", type: "uint256" },
            ],
            internalType: "struct VaultSystem.UserVault",
            name: "",
            type: "tuple",
          },
        ],
        stateMutability: "view",
        type: "function",
      },
    ],
    functionName: "getUserVault",
    args: connectedAddress ? [connectedAddress, 1] : undefined, // 1 = Pension Nest
  });

  const { data: emergencyVault } = useReadContract({
    address: "0x09A16F146D9CF82083f181E6238CDF8Be8E8f43F", // VaultSystem
    abi: [
      {
        inputs: [
          { internalType: "address", name: "user", type: "address" },
          { internalType: "uint8", name: "vaultType", type: "uint8" },
        ],
        name: "getUserVault",
        outputs: [
          {
            components: [
              { internalType: "address", name: "user", type: "address" },
              { internalType: "uint8", name: "vaultType", type: "uint8" },
              { internalType: "uint256", name: "totalDeposited", type: "uint256" },
              { internalType: "uint256", name: "currentBalance", type: "uint256" },
              { internalType: "uint256", name: "totalWithdrawn", type: "uint256" },
              { internalType: "uint256", name: "lastDepositTime", type: "uint256" },
              { internalType: "uint256", name: "lastWithdrawalTime", type: "uint256" },
              { internalType: "uint256", name: "yieldEarned", type: "uint256" },
              { internalType: "bool", name: "isActive", type: "bool" },
              { internalType: "uint256", name: "autoDepositAmount", type: "uint256" },
              { internalType: "uint256", name: "autoDepositFrequency", type: "uint256" },
              { internalType: "uint256", name: "nextAutoDeposit", type: "uint256" },
            ],
            internalType: "struct VaultSystem.UserVault",
            name: "",
            type: "tuple",
          },
        ],
        stateMutability: "view",
        type: "function",
      },
    ],
    functionName: "getUserVault",
    args: connectedAddress ? [connectedAddress, 2] : undefined, // 2 = Emergency Vault
  });

  useEffect(() => {
    if (microSavingsVault) setUserVaults(prev => ({ ...prev, 0: microSavingsVault }));
    if (pensionVault) setUserVaults(prev => ({ ...prev, 1: pensionVault }));
    if (emergencyVault) setUserVaults(prev => ({ ...prev, 2: emergencyVault }));
  }, [microSavingsVault, pensionVault, emergencyVault]);

  const handleDeposit = async (vaultType: number) => {
    if (!connectedAddress || !depositAmount) return;

    try {
      // Use the actual deployed VaultSystem contract ABI
      await writeContract({
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
      setDepositAmount("");
    } catch (error) {
      console.error("Deposit failed:", error);
      alert(`Deposit failed: ${error.message}`);
    }
  };

  const handleWithdraw = async (vaultType: number) => {
    if (!connectedAddress || !withdrawAmount) return;

    try {
      await writeContract({
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
      setWithdrawAmount("");
    } catch (error) {
      console.error("Withdrawal failed:", error);
      alert(`Withdrawal failed: ${error.message}`);
    }
  };

  const formatBalance = (balance: bigint) => {
    return (Number(balance) / 1e18).toFixed(4);
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
      {/* Vault Overview */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {vaultTypes.map((vault, index) => {
          const userVault = userVaults[index];
          return (
            <div key={vault.type} className="card bg-base-100 shadow-xl">
              <div className="card-body">
                <div className="flex items-center justify-between mb-4">
                  <div className={`p-3 rounded-lg ${vault.color} text-white`}>
                    {vault.icon}
                  </div>
                  <div className="text-right">
                    <div className="text-2xl font-bold">
                      {userVault ? formatBalance(userVault.currentBalance) : "0.0000"} U2U
                    </div>
                    <div className="text-sm text-gray-500">Current Balance</div>
                  </div>
                </div>
                
                <h3 className="card-title text-lg">{vault.name}</h3>
                <p className="text-gray-600 text-sm mb-4">{vault.description}</p>
                
                <div className="space-y-2 mb-4">
                  <div className="flex justify-between text-sm">
                    <span>Yield Rate:</span>
                    <span className="font-semibold text-green-600">{vault.yieldRate}</span>
                  </div>
                  <div className="flex justify-between text-sm">
                    <span>Total Deposited:</span>
                    <span>{userVault ? formatBalance(userVault.totalDeposited) : "0.0000"} U2U</span>
                  </div>
                  <div className="flex justify-between text-sm">
                    <span>Yield Earned:</span>
                    <span className="text-green-600">{userVault ? formatBalance(userVault.yieldEarned) : "0.0000"} U2U</span>
                  </div>
                </div>

                {/* Deposit/Withdraw Controls */}
                <div className="space-y-3">
                  <div className="flex gap-2">
                    <input
                      type="number"
                      placeholder="Amount"
                      className="input input-bordered input-sm flex-1"
                      value={depositAmount}
                      onChange={(e) => setDepositAmount(e.target.value)}
                    />
                    <button
                      className="btn btn-primary btn-sm"
                      onClick={() => handleDeposit(index)}
                      disabled={isPending || !depositAmount}
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
                      value={withdrawAmount}
                      onChange={(e) => setWithdrawAmount(e.target.value)}
                    />
                    <button
                      className="btn btn-outline btn-sm"
                      onClick={() => handleWithdraw(index)}
                      disabled={isPending || !withdrawAmount}
                    >
                      <MinusIcon className="h-4 w-4" />
                      Withdraw
                    </button>
                  </div>
                </div>

                {isSuccess && (
                  <div className="alert alert-success mt-4">
                    <ArrowTrendingUpIcon className="h-4 w-4" />
                    Transaction successful!
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
    </div>
  );
};

export default VaultIntegration;
