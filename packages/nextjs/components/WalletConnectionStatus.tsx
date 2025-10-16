"use client";

import { WalletErrorBoundary } from "./WalletErrorBoundary";
import { useAccount, useConnect, useDisconnect } from "wagmi";
import { ExclamationTriangleIcon } from "@heroicons/react/24/outline";

/**
 * Enhanced wallet connection component with better error handling
 */
const WalletConnectionStatusInner = () => {
  const { address, isConnected, isConnecting } = useAccount();
  const { connect, connectors, error: connectError } = useConnect();
  const { disconnect } = useDisconnect();

  const handleConnect = async () => {
    try {
      // Try to connect with the first available connector
      const connector = connectors[0];
      if (connector) {
        await connect({ connector });
      }
    } catch (error) {
      console.warn("Wallet connection failed:", error);
      // The error will be handled by our global error handler
    }
  };

  if (isConnecting) {
    return (
      <div className="bg-blue-50 dark:bg-blue-900/20 border border-blue-200 dark:border-blue-800 rounded-xl p-6 mb-12 max-w-md mx-auto">
        <div className="flex items-center justify-center space-x-3">
          <div className="w-3 h-3 bg-blue-500 rounded-full animate-pulse"></div>
          <span className="text-blue-700 dark:text-blue-300 font-medium">Connecting wallet...</span>
        </div>
      </div>
    );
  }

  if (isConnected && address) {
    return (
      <div className="bg-green-50 dark:bg-green-900/20 border border-green-200 dark:border-green-800 rounded-xl p-6 mb-12 max-w-md mx-auto">
        <div className="flex items-center justify-center space-x-3">
          <div className="w-3 h-3 bg-green-500 rounded-full animate-pulse"></div>
          <span className="text-green-700 dark:text-green-300 font-medium">Wallet Connected</span>
        </div>
        <div className="mt-3 text-center">
          <div className="text-sm text-green-600 dark:text-green-400 font-mono">
            {address.slice(0, 6)}...{address.slice(-4)}
          </div>
          <button
            onClick={() => disconnect()}
            className="mt-2 text-xs text-green-600 dark:text-green-400 hover:text-green-800 dark:hover:text-green-200 underline"
          >
            Disconnect
          </button>
        </div>
      </div>
    );
  }

  if (connectError) {
    return (
      <div className="bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800 rounded-xl p-6 mb-12 max-w-md mx-auto">
        <div className="flex items-center justify-center space-x-3 mb-3">
          <ExclamationTriangleIcon className="h-5 w-5 text-red-500" />
          <span className="text-red-700 dark:text-red-300 font-medium">Connection Error</span>
        </div>
        <div className="text-sm text-red-600 dark:text-red-400 mb-3">
          {connectError.message || "Failed to connect wallet"}
        </div>
        <button
          onClick={handleConnect}
          className="w-full bg-red-500 hover:bg-red-600 text-white font-medium py-2 px-4 rounded-lg transition-colors"
        >
          Try Again
        </button>
      </div>
    );
  }

  return (
    <div className="bg-yellow-50 dark:bg-yellow-900/20 border border-yellow-200 dark:border-yellow-800 rounded-xl p-6 mb-12 max-w-md mx-auto">
      <div className="flex items-center justify-center space-x-3 mb-3">
        <div className="w-3 h-3 bg-yellow-500 rounded-full"></div>
        <span className="text-yellow-700 dark:text-yellow-300 font-medium">Connect your wallet to get started</span>
      </div>
      <button
        onClick={handleConnect}
        className="w-full bg-yellow-500 hover:bg-yellow-600 text-white font-medium py-2 px-4 rounded-lg transition-colors"
      >
        Connect Wallet
      </button>
    </div>
  );
};

export const WalletConnectionStatus = () => {
  return (
    <WalletErrorBoundary>
      <WalletConnectionStatusInner />
    </WalletErrorBoundary>
  );
};
