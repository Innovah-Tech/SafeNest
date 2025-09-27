// Development configuration for MicroSavings platform

export const developmentConfig = {
  // Suppress console warnings in development
  suppressWarnings: true,
  
  // Enable debug logging
  enableDebugLogging: process.env.NODE_ENV === 'development',
  
  // Contract addresses (will be updated after deployment)
  contracts: {
    SimpleMicroSavings: process.env.NEXT_PUBLIC_SIMPLE_MICRO_SAVINGS_ADDRESS || "0x5FbDB2315678afecb367f032d93F642f64180aa3",
    INCLToken: process.env.NEXT_PUBLIC_INCL_TOKEN_ADDRESS || "0x0000000000000000000000000000000000000000",
    CommunityPools: process.env.NEXT_PUBLIC_COMMUNITY_POOLS_ADDRESS || "0x0000000000000000000000000000000000000000",
  },
  
  // Network configuration
  network: {
    name: process.env.NEXT_PUBLIC_NETWORK || "localhost",
    chainId: parseInt(process.env.NEXT_PUBLIC_CHAIN_ID || "31337"),
  },
  
  // Features
  features: {
    enableAnalytics: process.env.NEXT_PUBLIC_ANALYTICS_ID ? true : false,
    enableErrorReporting: process.env.NODE_ENV === 'production',
    enablePerformanceMonitoring: process.env.NODE_ENV === 'production',
  },
  
  // Warnings to suppress
  suppressedWarnings: [
    'Coinbase Wallet SDK',
    'TSS: Received response',
    'Content Script Bridge',
    'Download the React DevTools',
    'Lit is in dev mode',
    'POST https://cca-lite.coinbase.com/metrics',
    'net::ERR_ABORTED 401',
  ],
};

export default developmentConfig;
