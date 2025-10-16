import { wagmiConnectors } from "./wagmiConnectors";
import { http } from "viem";
import { hardhat } from "viem/chains";
import { createConfig } from "wagmi";
import scaffoldConfig from "~~/scaffold.config";

const { targetNetworks } = scaffoldConfig;

// Use all configured networks (Hardhat local + U2U networks)
export const enabledChains = targetNetworks;

export const simpleWagmiConfig = createConfig({
  chains: enabledChains as any, // Type assertion to handle the chain array
  connectors: wagmiConnectors(),
  ssr: true,
  transports: {
    [hardhat.id]: http("http://localhost:8545"), // Local Hardhat
    [39]: http("https://rpc-mainnet.u2u.xyz"), // U2U Solaris
    [2484]: http("https://rpc-nebulas-testnet.u2u.xyz"), // U2U Nebulas
  },
});
