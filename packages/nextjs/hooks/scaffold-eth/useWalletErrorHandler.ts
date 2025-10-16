import { useEffect } from "react";

/**
 * Custom hook to handle wallet-related errors gracefully
 * This prevents non-critical wallet extension errors from cluttering the console
 */
export const useWalletErrorHandler = () => {
  useEffect(() => {
    // Handle unhandled promise rejections from wallet extensions
    const handleUnhandledRejection = (event: PromiseRejectionEvent) => {
      const reason = event.reason;

      // Check if it's a wallet-related error
      if (
        typeof reason === "string" &&
        (reason.includes("Error checking default wallet status") ||
          reason.includes("chrome-extension") ||
          reason.includes("wallet") ||
          reason.includes("pageProvider") ||
          reason.includes("Error checking default wallet status: {}"))
      ) {
        console.warn("Wallet extension error (non-critical):", reason);
        event.preventDefault(); // Prevent the error from being logged as unhandled
        return;
      }

      // Check if it's an object with wallet-related properties
      if (reason && typeof reason === "object") {
        const reasonStr = JSON.stringify(reason);
        if (reasonStr.includes("wallet") || reasonStr.includes("extension") || reasonStr.includes("pageProvider")) {
          console.warn("Wallet extension error (non-critical):", reason);
          event.preventDefault();
          return;
        }
      }
    };

    // Handle regular errors
    const handleError = (event: ErrorEvent) => {
      if (
        event.message?.includes("Error checking default wallet status") ||
        event.message?.includes("chrome-extension") ||
        event.message?.includes("wallet") ||
        event.message?.includes("pageProvider") ||
        event.message?.includes("Error checking default wallet status: {}") ||
        event.filename?.includes("chrome-extension") ||
        event.filename?.includes("pageProvider")
      ) {
        console.warn("Wallet extension communication error (non-critical):", event.message);
        event.preventDefault();
        return false;
      }
    };

    // Add event listeners
    window.addEventListener("unhandledrejection", handleUnhandledRejection);
    window.addEventListener("error", handleError);

    // Cleanup
    return () => {
      window.removeEventListener("unhandledrejection", handleUnhandledRejection);
      window.removeEventListener("error", handleError);
    };
  }, []); // Empty dependency array to prevent re-runs
};
