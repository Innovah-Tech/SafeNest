//SPDX-License-Identifier: MIT
pragma solidity >=0.8.0 <0.9.0;

/**
 * InclusiveFinanceTokenomics - Comprehensive tokenomics for $INCL governance token
 * Implements the complete economic model for the Inclusive Finance DApp
 * @author SafeNest Team
 */
contract InclusiveFinanceTokenomics {
    // Token Details
    string public constant name = "Inclusive Finance Token";
    string public constant symbol = "INCL";
    uint8 public constant decimals = 18;
    uint256 public constant TOTAL_SUPPLY = 1_000_000_000 * 10 ** 18; // 1 billion tokens

    // Token Distribution (Total: 1B tokens)
    uint256 public constant COMMUNITY_ALLOCATION = 400_000_000 * 10 ** 18; // 40% - Community rewards, referrals
    uint256 public constant TEAM_ALLOCATION = 150_000_000 * 10 ** 18; // 15% - Team (4-year vesting)
    uint256 public constant TREASURY_ALLOCATION = 200_000_000 * 10 ** 18; // 20% - Protocol treasury
    uint256 public constant LIQUIDITY_ALLOCATION = 100_000_000 * 10 ** 18; // 10% - DEX liquidity
    uint256 public constant PARTNERS_ALLOCATION = 100_000_000 * 10 ** 18; // 10% - Strategic partners
    uint256 public constant EARLY_ADOPTERS = 50_000_000 * 10 ** 18; // 5% - Early users & testers

    // Staking Rewards
    uint256 public constant STAKING_REWARDS_POOL = 300_000_000 * 10 ** 18; // 30% of total supply for staking rewards
    uint256 public constant REWARDS_DURATION = 4 * 365 days; // 4 years of rewards
    uint256 public constant REWARDS_PER_SECOND = STAKING_REWARDS_POOL / REWARDS_DURATION;

    // Fee Structure
    uint256 public constant PROTOCOL_FEE_RATE = 30; // 0.3% in basis points
    uint256 public constant STAKING_FEE_SHARE = 50; // 50% of fees go to stakers
    uint256 public constant TREASURY_FEE_SHARE = 30; // 30% to treasury
    uint256 public constant BURN_FEE_SHARE = 20; // 20% burned (deflationary)

    // Governance Parameters
    uint256 public constant MIN_STAKE_FOR_VOTING = 1000 * 10 ** 18; // 1000 INCL minimum stake
    uint256 public constant VOTING_DURATION = 3 days;
    uint256 public constant EXECUTION_DELAY = 1 days;
    uint256 public constant QUORUM_THRESHOLD = 5; // 5% of total staked tokens

    // Referral System
    uint256 public constant REFERRAL_BONUS_RATE = 100; // 1% of referred user's deposits
    uint256 public constant REFERRAL_DURATION = 365 days; // 1 year of referral rewards
    uint256 public constant MAX_REFERRAL_DEPTH = 3; // 3 levels deep

    // Pension Vault Parameters
    uint256 public constant MIN_PENSION_AGE = 60; // Minimum retirement age
    uint256 public constant MAX_PENSION_AGE = 75; // Maximum retirement age
    uint256 public constant PENSION_VESTING_PERIOD = 10 * 365 days; // 10-year vesting
    uint256 public constant PENSION_YIELD_BOOST = 200; // 2% additional yield for pension deposits

    // Emergency Fund Parameters
    uint256 public constant EMERGENCY_WITHDRAWAL_FEE = 50; // 0.5% fee for instant withdrawal
    uint256 public constant EMERGENCY_INCENTIVE_RATE = 25; // 0.25% bonus for keeping funds parked

    // Mobile Money Integration
    uint256 public constant ROUND_UP_MIN_AMOUNT = 1 * 10 ** 18; // 1 USDC minimum round-up
    uint256 public constant ROUND_UP_MAX_AMOUNT = 10 * 10 ** 18; // 10 USDC maximum round-up
    uint256 public constant MOBILE_MONEY_FEE = 20; // 0.2% fee for mobile money integration

    // Insurance Parameters
    uint256 public constant INSURANCE_PREMIUM_RATE = 10; // 0.1% of yield for insurance
    uint256 public constant INSURANCE_COVERAGE_RATE = 1000; // 10x coverage for insured deposits

    // Community Pool Parameters
    uint256 public constant CHAMA_MIN_MEMBERS = 5;
    uint256 public constant CHAMA_MAX_MEMBERS = 50;
    uint256 public constant CHAMA_YIELD_BOOST = 100; // 1% additional yield for community pools

    // Inflation Protection
    uint256 public constant INFLATION_ADJUSTMENT_PERIOD = 30 days;
    uint256 public constant INFLATION_THRESHOLD = 500; // 5% inflation threshold

    // Cross-Border Transfer
    uint256 public constant CROSS_BORDER_FEE = 100; // 1% fee for cross-border transfers
    uint256 public constant CROSS_BORDER_MIN_AMOUNT = 100 * 10 ** 18; // 100 USDC minimum

    // Premium Features (requires staking)
    uint256 public constant PREMIUM_WITHDRAWAL_STAKE = 10000 * 10 ** 18; // 10k INCL for instant withdrawal
    uint256 public constant PREMIUM_TRANSFER_STAKE = 5000 * 10 ** 18; // 5k INCL for free transfers
    uint256 public constant PREMIUM_INSURANCE_STAKE = 20000 * 10 ** 18; // 20k INCL for premium insurance

    // Yield Strategy Allocation
    uint256 public constant CONSERVATIVE_ALLOCATION = 60; // 60% in low-risk strategies
    uint256 public constant MODERATE_ALLOCATION = 30; // 30% in moderate-risk strategies
    uint256 public constant AGGRESSIVE_ALLOCATION = 10; // 10% in higher-risk strategies

    // Risk Management
    uint256 public constant MAX_SINGLE_DEPOSIT = 10000 * 10 ** 18; // 10k USDC max single deposit
    uint256 public constant MAX_DAILY_DEPOSIT = 50000 * 10 ** 18; // 50k USDC max daily deposit
    uint256 public constant MAX_TOTAL_EXPOSURE = 1000000 * 10 ** 18; // 1M USDC max total exposure

    // Liquidity Mining
    uint256 public constant LIQUIDITY_MINING_REWARDS = 50_000_000 * 10 ** 18; // 50M tokens for liquidity mining
    uint256 public constant LIQUIDITY_MINING_DURATION = 2 * 365 days; // 2 years
    uint256 public constant LIQUIDITY_MINING_RATE = LIQUIDITY_MINING_REWARDS / LIQUIDITY_MINING_DURATION;

    // Educational Rewards
    uint256 public constant EDUCATION_REWARDS = 25_000_000 * 10 ** 18; // 25M tokens for financial education
    uint256 public constant EDUCATION_COMPLETION_BONUS = 100 * 10 ** 18; // 100 INCL per completed module

    // Partnership Rewards
    uint256 public constant PARTNER_REWARDS = 75_000_000 * 10 ** 18; // 75M tokens for partner integrations
    uint256 public constant PARTNER_REFERRAL_BONUS = 500 * 10 ** 18; // 500 INCL per partner referral

    // Events
    event TokenomicsInitialized(uint256 totalSupply, uint256 timestamp);
    event StakingRewardsUpdated(uint256 newRate, uint256 timestamp);
    event FeeStructureUpdated(uint256 protocolFee, uint256 stakingShare, uint256 timestamp);
    event ReferralBonusPaid(address referrer, address referee, uint256 amount, uint256 timestamp);
    event PensionDepositMade(address user, uint256 amount, uint256 retirementAge, uint256 timestamp);
    event EmergencyFundWithdrawal(address user, uint256 amount, uint256 fee, uint256 timestamp);
    event CommunityPoolCreated(address creator, uint256 poolId, uint256 memberCount, uint256 timestamp);
    event InsuranceClaimProcessed(address user, uint256 claimAmount, uint256 timestamp);
    event CrossBorderTransfer(address from, address to, uint256 amount, uint256 fee, uint256 timestamp);
    event PremiumFeatureUnlocked(address user, string feature, uint256 stakeAmount, uint256 timestamp);
    event LiquidityMiningReward(address user, uint256 amount, uint256 timestamp);
    event EducationRewardEarned(address user, string module, uint256 reward, uint256 timestamp);
    event PartnerRewardDistributed(address partner, uint256 amount, uint256 timestamp);

    // Constructor
    constructor() {
        emit TokenomicsInitialized(TOTAL_SUPPLY, block.timestamp);
    }

    // View functions for tokenomics parameters
    function getTokenomicsSummary()
        external
        pure
        returns (
            uint256 totalSupply,
            uint256 communityAllocation,
            uint256 stakingRewardsPool,
            uint256 protocolFeeRate,
            uint256 minStakeForVoting,
            uint256 referralBonusRate
        )
    {
        return (
            TOTAL_SUPPLY,
            COMMUNITY_ALLOCATION,
            STAKING_REWARDS_POOL,
            PROTOCOL_FEE_RATE,
            MIN_STAKE_FOR_VOTING,
            REFERRAL_BONUS_RATE
        );
    }

    function getFeeStructure()
        external
        pure
        returns (uint256 protocolFee, uint256 stakingShare, uint256 treasuryShare, uint256 burnShare)
    {
        return (PROTOCOL_FEE_RATE, STAKING_FEE_SHARE, TREASURY_FEE_SHARE, BURN_FEE_SHARE);
    }

    function getPensionParameters()
        external
        pure
        returns (uint256 minAge, uint256 maxAge, uint256 vestingPeriod, uint256 yieldBoost)
    {
        return (MIN_PENSION_AGE, MAX_PENSION_AGE, PENSION_VESTING_PERIOD, PENSION_YIELD_BOOST);
    }

    function getEmergencyFundParameters() external pure returns (uint256 withdrawalFee, uint256 incentiveRate) {
        return (EMERGENCY_WITHDRAWAL_FEE, EMERGENCY_INCENTIVE_RATE);
    }

    function getMobileMoneyParameters()
        external
        pure
        returns (uint256 minRoundUp, uint256 maxRoundUp, uint256 integrationFee)
    {
        return (ROUND_UP_MIN_AMOUNT, ROUND_UP_MAX_AMOUNT, MOBILE_MONEY_FEE);
    }

    function getInsuranceParameters() external pure returns (uint256 premiumRate, uint256 coverageRate) {
        return (INSURANCE_PREMIUM_RATE, INSURANCE_COVERAGE_RATE);
    }

    function getCommunityPoolParameters()
        external
        pure
        returns (uint256 minMembers, uint256 maxMembers, uint256 yieldBoost)
    {
        return (CHAMA_MIN_MEMBERS, CHAMA_MAX_MEMBERS, CHAMA_YIELD_BOOST);
    }

    function getPremiumFeatureRequirements()
        external
        pure
        returns (uint256 instantWithdrawalStake, uint256 freeTransferStake, uint256 premiumInsuranceStake)
    {
        return (PREMIUM_WITHDRAWAL_STAKE, PREMIUM_TRANSFER_STAKE, PREMIUM_INSURANCE_STAKE);
    }

    function getRiskManagementParameters()
        external
        pure
        returns (uint256 maxSingleDeposit, uint256 maxDailyDeposit, uint256 maxTotalExposure)
    {
        return (MAX_SINGLE_DEPOSIT, MAX_DAILY_DEPOSIT, MAX_TOTAL_EXPOSURE);
    }

    function getRewardPools()
        external
        pure
        returns (uint256 liquidityMiningRewards, uint256 educationRewards, uint256 partnerRewards)
    {
        return (LIQUIDITY_MINING_REWARDS, EDUCATION_REWARDS, PARTNER_REWARDS);
    }
}
