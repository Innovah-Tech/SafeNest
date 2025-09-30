# U2U Network Nebulas Configuration

## Network Details
- **Name**: U2U Network Nebulas
- **Chain ID**: 2484
- **RPC URL**: https://rpc-nebulas-testnet.u2u.xyz
- **WebSocket**: wss://ws-nebulas-testnet.u2u.xyz
- **Block Explorer**: https://testnet.u2uscan.xyz

## Environment Variables

Create a `.env` file in the `packages/hardhat` directory with the following variables:

```bash
# Deployer Private Key
__RUNTIME_DEPLOYER_PRIVATE_KEY=0x496c76eda702917e6b681dffa3958cc44cc8cb7214111fc749fb0f8947717c1e

# Alchemy API Key (optional - uses default if not provided)
# Get your own at: https://dashboard.alchemyapi.io
ALCHEMY_API_KEY=oKxs-03sij-U_N0iOlrSsZFr29-IqbuF

# Etherscan API Key (for contract verification)
# Get your own at: https://etherscan.io/apis
ETHERSCAN_V2_API_KEY=DNXJA8RX2Q3VZ4URQIWP7Z68CJXQZSC6AW
```

## Deployment Commands

To deploy to U2U Network Nebulas:

```bash
# Deploy contracts to U2U Network Nebulas
yarn deploy --network u2uNebulas

# Start the frontend (will connect to U2U Network Nebulas)
yarn start
```

## Getting U2U Testnet Tokens

You can get testnet U2U tokens from the U2U faucet or bridge them from other testnets.
