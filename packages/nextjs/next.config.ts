import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  /* config options here */
  reactStrictMode: true,
  // Force fresh deployment
  experimental: {
    // Enable experimental features if needed
  },
  // Suppress hydration warnings for browser extensions
  onDemandEntries: {
    // period (in ms) where the server will keep pages in the buffer
    maxInactiveAge: 25 * 1000,
    // number of pages that should be kept simultaneously without being disposed
    pagesBufferLength: 2,
  },
  // Suppress console warnings in production
  compiler: {
    removeConsole:
      process.env.NODE_ENV === "production"
        ? {
            exclude: ["error", "warn"],
          }
        : false,
  },
  // Optimize bundle size
  webpack: (config, { dev, isServer }) => {
    // Suppress Coinbase Wallet SDK warnings in development
    if (dev) {
      config.ignoreWarnings = [
        /Failed to parse source map/,
        /Coinbase Wallet SDK/,
        /TSS: Received response/,
        /Content Script Bridge/,
      ];
    }

    return config;
  },
  // Environment variables
  env: {
    CUSTOM_KEY: process.env.CUSTOM_KEY,
  },
  // Headers for security
  async headers() {
    return [
      {
        source: "/(.*)",
        headers: [
          {
            key: "X-Frame-Options",
            value: "DENY",
          },
          {
            key: "X-Content-Type-Options",
            value: "nosniff",
          },
          {
            key: "Referrer-Policy",
            value: "origin-when-cross-origin",
          },
        ],
      },
    ];
  },
};

export default nextConfig;
