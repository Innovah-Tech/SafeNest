// U2U Solaris Mainnet configuration for SafeNest
export const u2uMainnetConfig = {
  // U2U Solaris Mainnet contract addresses
  contracts: {
    SafeNest: "0xC62c2cD24C2D2fE2d91091344AcfFCfe6157DefC",
    SAFEToken: "0x996cEB391a85d36CDD1e2e838A5dE4049A407db1",
    VaultSystem: "0x09A16F146D9CF82083f181E6238CDF8Be8E8f43F",
    MicroSavings: "0x9E0bF00458e88807f25a7eCf9297Fcc75072d9D0",
    SimpleMicroSavings: "0x904A5c033778eff7CB03b3c1227573C9d62e4330",
    CommunityPools: "0x8DaC034C5Ed072630789aF53a39A090f477bE7e2",
    CommunityPoolsAdvanced: "0xBB19F0E41567e48Aa58F2A17dD903C0cDdc2C02e",
    INCLToken: "0xF028cCA18B4A11C1c93d2FDbc483d9d2ca245624",
  },

  // U2U Solaris Mainnet network configuration
  network: {
    name: "U2U Solaris",
    chainId: 39,
    rpcUrl: "https://rpc-mainnet.u2u.xyz",
    explorer: "https://u2uscan.xyz",
    currency: "U2U",
  },

  // Features enabled for mainnet
  features: {
    enableAnalytics: true,
    enableErrorReporting: true,
    enablePerformanceMonitoring: true,
    enableMainnetMode: true,
  },

  // Contract ABIs will be imported from typechain-types
  abis: {
    // These will be dynamically imported
  },
};

export default u2uMainnetConfig;
