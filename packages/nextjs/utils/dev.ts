// Development utilities to suppress console warnings and improve DX
import { developmentConfig } from "~~/config/development";

// Suppress console warnings based on configuration
if (typeof window !== "undefined" && developmentConfig.suppressWarnings) {
  const originalConsoleWarn = console.warn;
  const originalConsoleError = console.error;

  console.warn = (...args) => {
    const message = args[0];

    // Suppress configured warnings
    if (
      typeof message === "string" &&
      developmentConfig.suppressedWarnings.some(warning => message.includes(warning))
    ) {
      return;
    }

    originalConsoleWarn.apply(console, args);
  };

  console.error = (...args) => {
    const message = args[0];

    // Suppress configured errors
    if (
      typeof message === "string" &&
      developmentConfig.suppressedWarnings.some(warning => message.includes(warning))
    ) {
      return;
    }

    originalConsoleError.apply(console, args);
  };
}

// Development environment check
export const isDevelopment = process.env.NODE_ENV === "development";
export const isProduction = process.env.NODE_ENV === "production";

// Logging utility for development
export const devLog = (message: string, data?: any) => {
  if (isDevelopment) {
    console.log(`[MicroSavings Dev] ${message}`, data || "");
  }
};

// Error logging utility
export const devError = (message: string, error?: any) => {
  if (isDevelopment) {
    console.error(`[MicroSavings Error] ${message}`, error || "");
  }
};
