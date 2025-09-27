"use client";

import { useState, useEffect } from "react";
import { useAccount, useWriteContract, useReadContract } from "wagmi";
import { XMarkIcon } from "@heroicons/react/24/outline";
import { CONTRACT_ADDRESSES, SIMPLE_MICRO_SAVINGS_ABI } from "~~/utils/contracts";

interface InvestModalProps {
  isOpen: boolean;
  onClose: () => void;
}

interface InvestmentStrategy {
  id: number;
  name: string;
  apy: number;
  isActive: boolean;
  minDeposit: string;
  maxDeposit: string;
}

export const InvestModal: React.FC<InvestModalProps> = ({ isOpen, onClose }) => {
  const { address } = useAccount();
  const { writeContract, isPending, isSuccess } = useWriteContract();
  const [amount, setAmount] = useState("");
  const [selectedStrategy, setSelectedStrategy] = useState<number | null>(null);
  const [strategies, setStrategies] = useState<InvestmentStrategy[]>([]);

  // Read investment strategies from contract
  const { data: strategyCount } = useReadContract({
    address: CONTRACT_ADDRESSES.SimpleMicroSavings,
    abi: SIMPLE_MICRO_SAVINGS_ABI,
    functionName: "nextStrategyId",
  });

  // Load strategies (simplified - in production, you'd read each strategy individually)
  useEffect(() => {
    if (strategyCount && Number(strategyCount) > 1) {
      // Mock strategies for demo - in production, read from contract
      setStrategies([
        {
          id: 1,
          name: "Aave USDC Lending",
          apy: 500, // 5%
          isActive: true,
          minDeposit: "0.01",
          maxDeposit: "10"
        },
        {
          id: 2,
          name: "Compound DAI Lending",
          apy: 450, // 4.5%
          isActive: true,
          minDeposit: "0.01",
          maxDeposit: "10"
        }
      ]);
    }
  }, [strategyCount]);

  const handleInvest = async () => {
    if (!amount || !selectedStrategy || !address) return;

    try {
      // Convert amount to wei
      const amountInWei = (parseFloat(amount) * 1e18).toString();
      
      // Call the SimpleMicroSavings contract
      await writeContract({
        address: CONTRACT_ADDRESSES.SimpleMicroSavings,
        abi: SIMPLE_MICRO_SAVINGS_ABI,
        functionName: "investInStrategy",
        args: [BigInt(selectedStrategy), BigInt(amountInWei)],
        value: BigInt(amountInWei),
      });
    } catch (error) {
      console.error("Investment failed:", error);
    }
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
      <div className="bg-white dark:bg-gray-800 rounded-2xl shadow-2xl w-full max-w-md">
        <div className="flex items-center justify-between p-6 border-b border-gray-200 dark:border-gray-700">
          <h2 className="text-xl font-semibold text-gray-900 dark:text-white">Invest Now</h2>
          <button
            onClick={onClose}
            className="p-2 hover:bg-gray-100 dark:hover:bg-gray-700 rounded-lg transition-colors"
          >
            <XMarkIcon className="h-5 w-5 text-gray-500" />
          </button>
        </div>

        <div className="p-6 space-y-6">
          {/* Investment Strategies */}
          <div>
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-3">
              Select Strategy
            </label>
            <div className="space-y-2">
              {strategies.length > 0 ? (
                strategies.map((strategy) => (
                  <button
                    key={strategy.id}
                    onClick={() => setSelectedStrategy(strategy.id)}
                    className={`w-full p-4 rounded-lg border text-left transition-colors ${
                      selectedStrategy === strategy.id
                        ? "border-blue-500 bg-blue-50 dark:bg-blue-900/20"
                        : "border-gray-200 dark:border-gray-600 hover:border-gray-300 dark:hover:border-gray-500"
                    }`}
                  >
                    <div className="flex items-center justify-between">
                      <div>
                        <h3 className="font-medium text-gray-900 dark:text-white">{strategy.name}</h3>
                        <p className="text-sm text-gray-500 dark:text-gray-400">
                          Min: {strategy.minDeposit} ETH • Max: {strategy.maxDeposit} ETH
                        </p>
                      </div>
                      <div className="text-right">
                        <div className="text-lg font-semibold text-green-600">
                          {(strategy.apy / 100).toFixed(1)}%
                        </div>
                        <div className="text-xs text-gray-500">APY</div>
                      </div>
                    </div>
                  </button>
                ))
              ) : (
                <div className="text-center py-8">
                  <p className="text-gray-500 dark:text-gray-400">No investment strategies available</p>
                  <p className="text-sm text-gray-400 dark:text-gray-500">
                    Strategies will be added by the platform owner
                  </p>
                </div>
              )}
            </div>
          </div>

          {/* Investment Amount */}
          <div>
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
              Investment Amount (ETH)
            </label>
            <input
              type="number"
              step="0.01"
              min="0.001"
              placeholder="0.00"
              value={amount}
              onChange={(e) => setAmount(e.target.value)}
              className="w-full p-3 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-white focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            />
            {selectedStrategy && (
              <p className="text-xs text-gray-500 mt-1">
                Min: {strategies.find(s => s.id === selectedStrategy)?.minDeposit} ETH • 
                Max: {strategies.find(s => s.id === selectedStrategy)?.maxDeposit} ETH
              </p>
            )}
          </div>

          {/* Wallet Status */}
          {!address && (
            <div className="bg-yellow-50 dark:bg-yellow-900/20 border border-yellow-200 dark:border-yellow-800 rounded-lg p-4">
              <p className="text-sm text-yellow-700 dark:text-yellow-300">
                Please connect your wallet to make an investment
              </p>
            </div>
          )}

          {/* Transaction Status */}
          {isSuccess && (
            <div className="bg-green-50 dark:bg-green-900/20 border border-green-200 dark:border-green-800 rounded-lg p-4">
              <p className="text-sm text-green-700 dark:text-green-300">
                Investment successful! Your funds have been invested in the selected strategy.
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
              onClick={handleInvest}
              disabled={!amount || !selectedStrategy || !address || isPending}
              className="flex-1 bg-gradient-to-r from-blue-500 to-blue-600 hover:from-blue-600 hover:to-blue-700 disabled:from-gray-400 disabled:to-gray-500 text-white font-medium py-3 rounded-lg transition-all duration-200 disabled:cursor-not-allowed"
            >
              {isPending ? "Processing..." : "Invest"}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};
