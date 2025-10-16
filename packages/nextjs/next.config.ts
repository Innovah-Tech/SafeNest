import type { NextConfig } from "next";

const withBundleAnalyzer = require("@next/bundle-analyzer")({
  enabled: process.env.ANALYZE === "true",
});

const nextConfig: NextConfig = {
  /* config options here */
  reactStrictMode: true,
  // Force fresh deployment
  experimental: {
    // Enable experimental features if needed
    optimizePackageImports: ["@heroicons/react", "@rainbow-me/rainbowkit", "viem", "wagmi"],
    turbo: {
      rules: {
        "*.svg": {
          loaders: ["@svgr/webpack"],
          as: "*.js",
        },
      },
    },
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
  // Optimize bundle size and build performance
  webpack: (config, { dev, isServer, webpack }) => {
    // Suppress Coinbase Wallet SDK warnings in development
    if (dev) {
      config.ignoreWarnings = [
        /Failed to parse source map/,
        /Coinbase Wallet SDK/,
        /TSS: Received response/,
        /Content Script Bridge/,
        /webpack\.cache\.PackFileCacheStrategy/,
      ];
    }

    // Fix webpack caching issues on Windows
    if (dev) {
      config.cache = {
        type: "filesystem",
        buildDependencies: {
          config: [__filename],
        },
        // Disable pack file cache on Windows to avoid rename issues
        ...(process.platform === "win32" && {
          cacheDirectory: ".next/cache/webpack",
          compression: false,
        }),
      };
    }

    // Optimize for production builds
    if (!dev && !isServer) {
      // Enable tree shaking
      config.optimization.usedExports = true;
      config.optimization.sideEffects = false;

      // Split chunks more efficiently
      config.optimization.splitChunks = {
        chunks: "all",
        cacheGroups: {
          default: false,
          vendors: false,
          // Web3 libraries
          web3: {
            name: "web3",
            chunks: "all",
            test: /[\\/]node_modules[\\/](@rainbow-me|wagmi|viem|@tanstack)[\\/]/,
            priority: 20,
          },
          // React libraries
          react: {
            name: "react",
            chunks: "all",
            test: /[\\/]node_modules[\\/](react|react-dom)[\\/]/,
            priority: 30,
          },
          // UI libraries
          ui: {
            name: "ui",
            chunks: "all",
            test: /[\\/]node_modules[\\/](@heroicons|daisyui|tailwindcss)[\\/]/,
            priority: 25,
          },
          // Common libraries
          common: {
            name: "common",
            chunks: "all",
            test: /[\\/]node_modules[\\/]/,
            priority: 10,
            minChunks: 2,
          },
        },
      };
    }

    // Add fallbacks for Node.js modules
    config.resolve.fallback = {
      ...config.resolve.fallback,
      fs: false,
      net: false,
      tls: false,
      crypto: false,
    };

    // Optimize module resolution
    config.resolve.modules = ["node_modules"];
    config.resolve.extensions = [".js", ".jsx", ".ts", ".tsx", ".json"];

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

export default withBundleAnalyzer(nextConfig);
