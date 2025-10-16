"use client";

import React from "react";
import { ExclamationTriangleIcon } from "@heroicons/react/24/outline";

interface WalletErrorBoundaryState {
  hasError: boolean;
  error?: Error;
}

interface WalletErrorBoundaryProps {
  children: React.ReactNode;
}

/**
 * Error boundary specifically for wallet-related errors
 * This prevents wallet extension errors from crashing the entire app
 */
export class WalletErrorBoundary extends React.Component<WalletErrorBoundaryProps, WalletErrorBoundaryState> {
  constructor(props: WalletErrorBoundaryProps) {
    super(props);
    this.state = { hasError: false };
  }

  static getDerivedStateFromError(error: Error): WalletErrorBoundaryState {
    // Check if this is a wallet-related error
    const isWalletError = 
      error.message?.includes("Error checking default wallet status") ||
      error.message?.includes("chrome-extension") ||
      error.message?.includes("wallet") ||
      error.message?.includes("pageProvider") ||
      error.stack?.includes("chrome-extension") ||
      error.stack?.includes("pageProvider");

    if (isWalletError) {
      // Log as warning instead of error
      console.warn("Wallet extension error caught by boundary:", error.message);
      return { hasError: false }; // Don't show error UI for wallet issues
    }

    return { hasError: true, error };
  }

  componentDidCatch(error: Error, errorInfo: React.ErrorInfo) {
    // Check if this is a wallet-related error
    const isWalletError = 
      error.message?.includes("Error checking default wallet status") ||
      error.message?.includes("chrome-extension") ||
      error.message?.includes("wallet") ||
      error.message?.includes("pageProvider") ||
      error.stack?.includes("chrome-extension") ||
      error.stack?.includes("pageProvider");

    if (isWalletError) {
      console.warn("Wallet extension error (non-critical):", error, errorInfo);
      // Reset the error state to prevent UI from showing error
      this.setState({ hasError: false });
      return;
    }

    // Log other errors normally
    console.error("ErrorBoundary caught an error:", error, errorInfo);
  }

  render() {
    if (this.state.hasError) {
      return (
        <div className="min-h-screen bg-gray-50 dark:bg-gray-900 flex items-center justify-center p-4">
          <div className="max-w-md w-full bg-white dark:bg-gray-800 rounded-2xl shadow-lg p-8 text-center">
            <div className="flex items-center justify-center w-16 h-16 bg-red-100 dark:bg-red-900/20 rounded-full mx-auto mb-6">
              <ExclamationTriangleIcon className="h-8 w-8 text-red-600 dark:text-red-400" />
            </div>

            <h1 className="text-2xl font-bold text-gray-900 dark:text-white mb-4">Something went wrong</h1>

            <p className="text-gray-600 dark:text-gray-300 mb-6">
              We encountered an unexpected error. Please try refreshing the page.
            </p>

            {process.env.NODE_ENV === "development" && this.state.error && (
              <details className="mb-6 text-left">
                <summary className="cursor-pointer text-sm text-gray-500 dark:text-gray-400 mb-2">
                  Error Details (Development)
                </summary>
                <pre className="text-xs text-red-600 dark:text-red-400 bg-red-50 dark:bg-red-900/20 p-3 rounded-lg overflow-auto">
                  {this.state.error.message}
                  {this.state.error.stack}
                </pre>
              </details>
            )}

            <div className="flex space-x-4">
              <button
                onClick={() => this.setState({ hasError: false, error: undefined })}
                className="flex-1 bg-blue-500 hover:bg-blue-600 text-white font-medium py-2 px-4 rounded-lg transition-colors"
              >
                Try Again
              </button>
              <button
                onClick={() => window.location.reload()}
                className="flex-1 bg-gray-500 hover:bg-gray-600 text-white font-medium py-2 px-4 rounded-lg transition-colors"
              >
                Refresh Page
              </button>
            </div>
          </div>
        </div>
      );
    }

    return this.props.children;
  }
}

