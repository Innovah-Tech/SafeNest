"use client";

import { useState } from "react";
import { useAccount, useWriteContract } from "wagmi";
import { XMarkIcon } from "@heroicons/react/24/outline";
import { CONTRACT_ADDRESSES, SIMPLE_MICRO_SAVINGS_ABI } from "~~/utils/contracts";

interface QuickDepositModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export const QuickDepositModal: React.FC<QuickDepositModalProps> = ({ isOpen, onClose }) => {
  const { address } = useAccount();
  const { writeContract, isPending, isSuccess } = useWriteContract();
  const [amount, setAmount] = useState("");
  const [selectedPreset, setSelectedPreset] = useState<number | null>(null);

  const presetAmounts = [0.01, 0.05, 0.1, 0.5, 1.0];

  const handlePresetClick = (preset: number) => {
    setAmount(preset.toString());
    setSelectedPreset(preset);
  };

  const handleDeposit = async () => {
    if (!amount || !address) return;

    try {
      // Convert amount to wei
      const amountInWei = (parseFloat(amount) * 1e18).toString();
      
      // Call the SimpleMicroSavings contract
      await writeContract({
        address: CONTRACT_ADDRESSES.SimpleMicroSavings,
        abi: SIMPLE_MICRO_SAVINGS_ABI,
        functionName: "depositSavings",
        args: [BigInt(amountInWei)],
        value: BigInt(amountInWei),
      });
    } catch (error) {
      console.error("Deposit failed:", error);
    }
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
      <div className="bg-white dark:bg-gray-800 rounded-2xl shadow-2xl w-full max-w-md">
        <div className="flex items-center justify-between p-6 border-b border-gray-200 dark:border-gray-700">
          <h2 className="text-xl font-semibold text-gray-900 dark:text-white">Quick Deposit</h2>
          <button
            onClick={onClose}
            className="p-2 hover:bg-gray-100 dark:hover:bg-gray-700 rounded-lg transition-colors"
          >
            <XMarkIcon className="h-5 w-5 text-gray-500" />
          </button>
        </div>

        <div className="p-6 space-y-6">
          {/* Preset Amounts */}
          <div>
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-3">
              Quick Amounts (ETH)
            </label>
            <div className="grid grid-cols-5 gap-2">
              {presetAmounts.map((preset) => (
                <button
                  key={preset}
                  onClick={() => handlePresetClick(preset)}
                  className={`p-3 rounded-lg text-sm font-medium transition-colors ${
                    selectedPreset === preset
                      ? "bg-green-500 text-white"
                      : "bg-gray-100 dark:bg-gray-700 text-gray-700 dark:text-gray-300 hover:bg-gray-200 dark:hover:bg-gray-600"
                  }`}
                >
                  {preset}
                </button>
              ))}
            </div>
          </div>

          {/* Custom Amount */}
          <div>
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
              Custom Amount (ETH)
            </label>
            <input
              type="number"
              step="0.01"
              min="0.001"
              placeholder="0.00"
              value={amount}
              onChange={(e) => {
                setAmount(e.target.value);
                setSelectedPreset(null);
              }}
              className="w-full p-3 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-white focus:ring-2 focus:ring-green-500 focus:border-transparent"
            />
          </div>

          {/* Wallet Status */}
          {!address && (
            <div className="bg-yellow-50 dark:bg-yellow-900/20 border border-yellow-200 dark:border-yellow-800 rounded-lg p-4">
              <p className="text-sm text-yellow-700 dark:text-yellow-300">
                Please connect your wallet to make a deposit
              </p>
            </div>
          )}

          {/* Transaction Status */}
          {isSuccess && (
            <div className="bg-green-50 dark:bg-green-900/20 border border-green-200 dark:border-green-800 rounded-lg p-4">
              <p className="text-sm text-green-700 dark:text-green-300">
                Deposit successful! Your funds have been added to your savings account.
              </p>
            </div>
          )}

          {/* Action Buttons */}
          <div className="flex space-x-3">
            <button
              onClick={onClose}
              className="flex-1 px-4 py-3 border border-gray-300 dark:border-gray-600 text-gray-700 dark:text-gray-300 rounded-lg hover:bg-gray-50 dark:hover:bg-gray-700 transition-colors"
            >
              Cancel
            </button>
            <button
              onClick={handleDeposit}
              disabled={!amount || !address || isPending}
              className="flex-1 bg-gradient-to-r from-green-500 to-green-600 hover:from-green-600 hover:to-green-700 disabled:from-gray-400 disabled:to-gray-500 text-white font-medium py-3 rounded-lg transition-all duration-200 disabled:cursor-not-allowed"
            >
              {isPending ? "Processing..." : "Deposit"}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};
