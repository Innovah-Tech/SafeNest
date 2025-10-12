// Contract addresses and ABIs for the MicroSavings platform
// These will be updated after deployment
import { developmentConfig } from "~~/config/development";

export const CONTRACT_ADDRESSES = {
  SimpleMicroSavings: developmentConfig.contracts.SimpleMicroSavings,
  INCLToken: developmentConfig.contracts.INCLToken,
  CommunityPools: developmentConfig.contracts.CommunityPools,
} as const;

export const SIMPLE_MICRO_SAVINGS_ABI = [
  {
    inputs: [{ internalType: "uint256", name: "_amount", type: "uint256" }],
    name: "depositSavings",
    outputs: [],
    stateMutability: "payable",
    type: "function",
  },
  {
    inputs: [
      { internalType: "uint256", name: "_strategyId", type: "uint256" },
      { internalType: "uint256", name: "_amount", type: "uint256" },
    ],
    name: "investInStrategy",
    outputs: [],
    stateMutability: "payable",
    type: "function",
  },
  {
    inputs: [{ internalType: "uint256", name: "_amount", type: "uint256" }],
    name: "depositEmergencyFund",
    outputs: [],
    stateMutability: "payable",
    type: "function",
  },
  {
    inputs: [{ internalType: "uint256", name: "_amount", type: "uint256" }],
    name: "withdrawSavings",
    outputs: [],
    stateMutability: "nonpayable",
    type: "function",
  },
  {
    inputs: [{ internalType: "uint256", name: "_amount", type: "uint256" }],
    name: "withdrawEmergencyFund",
    outputs: [],
    stateMutability: "nonpayable",
    type: "function",
  },
  {
    inputs: [],
    name: "nextStrategyId",
    outputs: [{ internalType: "uint256", name: "", type: "uint256" }],
    stateMutability: "view",
    type: "function",
  },
  {
    inputs: [{ internalType: "address", name: "_user", type: "address" }],
    name: "getPortfolioValue",
    outputs: [
      { internalType: "uint256", name: "totalSavings", type: "uint256" },
      { internalType: "uint256", name: "totalInvestments", type: "uint256" },
      { internalType: "uint256", name: "totalEmergency", type: "uint256" },
      { internalType: "uint256", name: "totalValue", type: "uint256" },
    ],
    stateMutability: "view",
    type: "function",
  },
  {
    inputs: [],
    name: "getPlatformStats",
    outputs: [
      { internalType: "uint256", name: "_totalUsers", type: "uint256" },
      { internalType: "uint256", name: "_totalDeposited", type: "uint256" },
      { internalType: "uint256", name: "_totalInvested", type: "uint256" },
      { internalType: "uint256", name: "_totalEmergencyFunds", type: "uint256" },
      { internalType: "uint256", name: "_platformFeeRate", type: "uint256" },
    ],
    stateMutability: "view",
    type: "function",
  },
] as const;
