# 🏦 SafeNest - Inclusive Finance DApp

<h4 align="center">
  <a href="https://docs.scaffoldeth.io">Documentation</a> |
  <a href="https://scaffoldeth.io">Website</a> |
  <a href="#features">Features</a> |
  <a href="#tokenomics">Tokenomics</a>
</h4>

🌍 **A mobile-first DeFi super-wallet for emerging markets** that combines micro-savings, community pools, and retirement planning to empower financial inclusion worldwide.

⚙️ Built using NextJS, RainbowKit, Hardhat, Wagmi, Viem, and Typescript with a focus on emerging markets and financial inclusion.

## 🌟 Core Problem

Millions of people are unbanked or underbanked but own smartphones. They need:
- Safe savings with tiny daily amounts
- Small investment opportunities  
- Retirement planning without access to pension schemes
- Protection against inflation eroding cash savings

## 💡 DApp Vision

SafeNest is a mobile-first wallet that combines:

### 🏦 **Micro-Savings Vault**
- Deposit as little as $0.01 daily/weekly
- Automatic allocation to emergency funds and pensions
- Round-up features for everyday spending
- Auto-yield deployment to low-risk DeFi strategies

### 🏛️ **Pension Nest**
- Automatic long-term retirement savings
- 10-year vesting with 2% yield boost
- Time-locked withdrawals (minimum 1 year)
- Monthly withdrawal after retirement age (60-75)

### 🚨 **Emergency Vault**
- Liquid savings with instant withdrawal
- 0.5% fee for instant access
- 0.25% incentive for keeping funds parked
- Optional micro-insurance coverage

### 👥 **Community Pools (Digital Chamas)**
- Traditional rotating savings groups
- Collective investment pools
- Community emergency funds
- Goal-oriented savings pools

## 🪙 $SAFE Tokenomics

### **Token Distribution (1B Total Supply)**
- **40% Community Rewards** (400M) - Referrals, education, liquidity mining
- **20% Protocol Treasury** (200M) - Development, partnerships, operations  
- **15% Team & Advisors** (150M) - 4-year vesting schedule
- **10% DEX Liquidity** (100M) - Initial liquidity provision
- **10% Strategic Partners** (100M) - SACCOs, NGOs, mobile money providers
- **5% Early Adopters** (50M) - Beta testers, early users

### **Staking Rewards (300M SAFE over 4 years)**
- **Basic Tier**: 1,000 SAFE minimum, 1x voting power
- **Silver Tier**: 5,000 SAFE minimum, 1.5x voting power, premium withdrawals
- **Gold Tier**: 10,000 SAFE minimum, 2x voting power, free transfers
- **Platinum Tier**: 50,000 SAFE minimum, 3x voting power, governance proposals

### **Premium Features (Unlocked with $SAFE Staking)**
- **Premium Vault Access**: 10,000 SAFE stake
- **Instant Withdrawal**: 5,000 SAFE stake  
- **Free Transfers**: 2,000 SAFE stake
- **Premium Insurance**: 15,000 SAFE stake

## 💰 Protocol Fees & Rewards

### **Fee Structure (0.1-0.3% on yield)**
- **Protocol Fee**: 0.2% default (0.1-0.3% range)
- **Fee Distribution**: 60% to stakers, 25% to treasury, 15% burned
- **Emergency Withdrawal**: 0.5% fee for instant access
- **Cross-Border Transfer**: 1% fee (free for premium users)

### **Referral & Community Rewards**
- **Referral Bonus**: 1% of referred user's deposits
- **Education Rewards**: 100 SAFE per completed module
- **Pool Creation**: 500 SAFE for creating community pools
- **Active User**: 50 SAFE for weekly activity
- **Liquidity Mining**: 50M SAFE over 2 years

## 🏛️ Governance via $SAFE Staking

### **Voting Parameters**
- **Minimum Stake**: 1,000 SAFE for voting
- **Voting Duration**: 3 days
- **Execution Delay**: 1 day
- **Quorum Threshold**: 5% of total staked

### **Governance Rights**
- Vote on portfolio strategies and yield optimization
- Propose new features and products
- Adjust protocol fees and parameters
- Approve strategic partnerships

## 🚀 Key Features

### **Stablecoin Base**
- USDC, DAI, and local currency-pegged tokens
- Reduces volatility and crypto complexity
- Mobile money integration (M-Pesa, Airtel Money)

### **Auto-Yield**
- Automatic deployment to low-risk DeFi strategies
- Aave, Compound, Curve, Yearn integration
- Risk-adjusted portfolio allocation

### **Smart Goal Tracking**
- Visual progress bars for education, healthcare, retirement
- Milestone rewards and community accountability
- Gamified financial literacy

### **Insurance Add-Ons**
- Optional micro-insurance premiums (0.1% of yield)
- 10x coverage for insured deposits
- Automated claims processing

## 📱 Mobile-First Design

### **Progressive Web App**
- Works on any smartphone
- Offline functionality for low-data regions
- SMS fallback for critical operations

### **Emerging Markets Focus**
- Local language support
- Mobile money integration
- Low minimum deposits ($0.01)
- Community-driven features

## 🛠️ Tech Stack

- **Blockchain**: Ethereum, Polygon, Base, Celo
- **Frontend**: Next.js, React, Tailwind CSS, DaisyUI
- **Web3**: Wagmi, RainbowKit, Viem
- **Smart Contracts**: Solidity, Hardhat
- **Oracles**: Chainlink, Pyth
- **Mobile**: Progressive Web App, Flutter (future)

## 🚀 Quickstart

### Prerequisites
- [Node (>= v20.18.3)](https://nodejs.org/en/download/)
- [Yarn](https://yarnpkg.com/getting-started/install)
- [Git](https://git-scm.com/downloads)

### Installation

1. **Clone the repository:**
```bash
git clone https://github.com/Usernyagah/SafeNest.git
cd SafeNest
```

2. **Install dependencies:**
```bash
yarn install
```

3. **Start local blockchain:**
```bash
yarn chain
```

4. **Deploy contracts:**
```bash
yarn deploy
```

5. **Start frontend:**
```bash
yarn start
```

Visit your app at: `http://localhost:3000`

## 📁 Project Structure

```
SafeNest/
├── packages/
│   ├── hardhat/                 # Smart contracts
│   │   ├── contracts/
│   │   │   ├── SAFEToken.sol           # Governance token
│   │   │   ├── VaultSystem.sol         # Main vault system
│   │   │   ├── CommunityPoolsAdvanced.sol # Digital chamas
│   │   │   └── InclusiveFinanceFlow.sol   # Complete user flow
│   │   ├── deploy/              # Deployment scripts
│   │   └── test/                # Contract tests
│   └── nextjs/                  # Frontend application
│       ├── app/
│       │   ├── savings/         # Micro-savings interface
│       │   ├── community/       # Community pools
│       │   ├── tokenomics/      # Tokenomics visualization
│       │   └── help/            # Help system
│       ├── components/          # Reusable components
│       └── utils/               # Utilities and helpers
├── docs/                        # Documentation
└── README.md                    # This file
```

## 🧪 Testing

Run smart contract tests:
```bash
yarn hardhat:test
```

Run frontend tests:
```bash
yarn test
```

## 🌍 Go-To-Market Strategy

### **Pilot Regions**
- **Kenya**: High mobile money penetration (M-Pesa)
- **Nigeria**: Large unbanked population
- **Philippines**: Strong remittance culture

### **Community Partners**
- SACCOs (Savings and Credit Cooperatives)
- Micro-finance NGOs
- Gig-worker unions
- Mobile money providers

### **Incentives**
- First users receive bonus yield for 3-6 months
- Referral bonuses in stablecoins
- Education rewards in $SAFE tokens

## ⚡ Competitive Edge

- **Bridges DeFi with Real-World**: Traditional micro-finance + modern DeFi
- **Future Security**: Pension planning for underserved populations
- **Stablecoin Base**: Reduces crypto complexity
- **Mobile-First**: Designed for smartphone users
- **Community-Driven**: Digital chamas and collective growth

## 🤝 Contributing

We welcome contributions to SafeNest! Please see [CONTRIBUTING.md](CONTRIBUTING.md) for guidelines.

### **Areas for Contribution**
- Smart contract development
- Frontend improvements
- Mobile app development
- Documentation
- Community outreach
- Partnership development

## 📄 License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

## 🙏 Acknowledgments

- Scaffold-ETH 2 for the development framework
- OpenZeppelin for security standards
- The DeFi community for inspiration
- Emerging markets for the vision

## 📞 Contact

- **Website**: [SafeNest.io](https://safenest.io)
- **Twitter**: [@SafeNestDeFi](https://twitter.com/SafeNestDeFi)
- **Discord**: [SafeNest Community](https://discord.gg/safenest)
- **Email**: hello@safenest.io

---

**Built with ❤️ for financial inclusion worldwide**