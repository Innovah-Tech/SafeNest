import { http } from "viem";
import { hardhat } from "viem/chains";
import { createConfig } from "wagmi";
import { injected } from "wagmi/connectors";
import scaffoldConfig from "~~/scaffold.config";

const { targetNetworks } = scaffoldConfig;

// Use only hardhat for local development to avoid dependency issues
export const enabledChains = targetNetworks.filter(network => network.id === 31337);

export const simpleWagmiConfig = createConfig({
  chains: enabledChains,
  connectors: [injected()],
  ssr: true,
  transports: {
    [hardhat.id]: http(),
  },
});
