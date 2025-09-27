//SPDX-License-Identifier: MIT
pragma solidity >=0.8.0 <0.9.0;

/**
 * InclusiveFinanceFlow - Complete smart contract flow for deposit → yield → pension vault
 * Implements the full user journey from micro-savings to retirement planning
 * @author SafeNest Team
 */
contract InclusiveFinanceFlow {
    // State Variables
    address public immutable owner;
    string public platformName = "Inclusive Finance - Complete DeFi Flow";
    
    // User Account Structure
    struct UserAccount {
        address user;
        uint256 totalDeposited;
        uint256 totalWithdrawn;
        uint256 currentBalance;
        uint256 emergencyFund;
        uint256 pensionFund;
        uint256 communityPoolShares;
        uint256 lastDepositTime;
        uint256 lastWithdrawalTime;
        bool isActive;
        bool hasInsurance;
        bool isPremiumUser;
        uint256 referralCount;
        uint256 totalReferralRewards;
        uint256 educationScore;
        uint256 riskProfile; // 1=Conservative, 2=Moderate, 3=Aggressive
    }
    
    // Pension Vault Structure
    struct PensionVault {
        address user;
        uint256 totalDeposited;
        uint256 currentValue;
        uint256 retirementAge;
        uint256 vestingStartTime;
        uint256 vestingEndTime;
        bool isVesting;
        bool isWithdrawn;
        uint256 monthlyWithdrawalAmount;
        uint256 lastWithdrawalTime;
    }
    
    // Emergency Fund Structure
    struct EmergencyFund {
        address user;
        uint256 balance;
        uint256 lastDepositTime;
        uint256 withdrawalCount;
        uint256 totalWithdrawn;
        bool isActive;
        uint256 incentiveEarned;
    }
    
    // Community Pool Structure
    struct CommunityPool {
        uint256 id;
        address creator;
        string name;
        uint256 totalDeposits;
        uint256 memberCount;
        uint256 yieldRate;
        bool isActive;
        uint256 createdAt;
        mapping(address => uint256) memberShares;
        mapping(address => bool) isMember;
    }
    
    // Yield Strategy Structure
    struct YieldStrategy {
        uint256 id;
        string name;
        address strategyContract;
        uint256 apy;
        uint256 riskLevel; // 1=Low, 2=Medium, 3=High
        bool isActive;
        uint256 minDeposit;
        uint256 maxDeposit;
        uint256 totalDeposited;
        uint256 currentYield;
    }
    
    // Insurance Policy Structure
    struct InsurancePolicy {
        address user;
        uint256 coverageAmount;
        uint256 premiumRate;
        uint256 coverageStartTime;
        uint256 coverageEndTime;
        bool isActive;
        uint256 claimsCount;
        uint256 totalClaimsPaid;
    }
    
    // Referral Structure
    struct ReferralData {
        address referrer;
        address referee;
        uint256 depositAmount;
        uint256 rewardAmount;
        uint256 timestamp;
        bool isPaid;
    }
    
    // Mappings
    mapping(address => UserAccount) public userAccounts;
    mapping(address => PensionVault) public pensionVaults;
    mapping(address => EmergencyFund) public emergencyFunds;
    mapping(uint256 => CommunityPool) public communityPools;
    mapping(uint256 => YieldStrategy) public yieldStrategies;
    mapping(address => InsurancePolicy) public insurancePolicies;
    mapping(address => address) public referrers; // referee => referrer
    mapping(address => ReferralData[]) public referralHistory;
    
    // Platform Statistics
    uint256 public totalUsers = 0;
    uint256 public totalDeposited = 0;
    uint256 public totalWithdrawn = 0;
    uint256 public totalEmergencyFunds = 0;
    uint256 public totalPensionFunds = 0;
    uint256 public totalCommunityPools = 0;
    uint256 public totalInsurancePolicies = 0;
    uint256 public totalReferralRewards = 0;
    
    // Platform Parameters
    uint256 public platformFeeRate = 30; // 0.3%
    uint256 public emergencyWithdrawalFee = 50; // 0.5%
    uint256 public pensionYieldBoost = 200; // 2%
    uint256 public referralBonusRate = 100; // 1%
    uint256 public insurancePremiumRate = 10; // 0.1%
    uint256 public communityPoolYieldBoost = 100; // 1%
    
    // Counters
    uint256 public nextCommunityPoolId = 1;
    uint256 public nextYieldStrategyId = 1;
    
    // Events
    event UserRegistered(address indexed user, address indexed referrer, uint256 timestamp);
    event DepositMade(address indexed user, uint256 amount, uint256 emergencyAmount, uint256 pensionAmount, uint256 timestamp);
    event WithdrawalMade(address indexed user, uint256 amount, uint256 fee, uint256 timestamp);
    event EmergencyWithdrawal(address indexed user, uint256 amount, uint256 fee, uint256 timestamp);
    event PensionDeposit(address indexed user, uint256 amount, uint256 retirementAge, uint256 timestamp);
    event PensionWithdrawal(address indexed user, uint256 amount, uint256 timestamp);
    event CommunityPoolJoined(address indexed user, uint256 poolId, uint256 amount, uint256 timestamp);
    event CommunityPoolCreated(address indexed creator, uint256 poolId, string name, uint256 timestamp);
    event YieldStrategyAdded(uint256 indexed strategyId, string name, uint256 apy, uint256 riskLevel, uint256 timestamp);
    event InsurancePolicyPurchased(address indexed user, uint256 coverageAmount, uint256 premiumRate, uint256 timestamp);
    event InsuranceClaimProcessed(address indexed user, uint256 claimAmount, uint256 timestamp);
    event ReferralRewardPaid(address indexed referrer, address indexed referee, uint256 amount, uint256 timestamp);
    event PremiumFeatureUnlocked(address indexed user, string feature, uint256 timestamp);
    event RiskProfileUpdated(address indexed user, uint256 oldProfile, uint256 newProfile, uint256 timestamp);
    event EducationScoreUpdated(address indexed user, uint256 oldScore, uint256 newScore, uint256 timestamp);
    
    // Modifiers
    modifier onlyOwner() {
        require(msg.sender == owner, "Not the owner");
        _;
    }
    
    modifier validUser(address _user) {
        require(userAccounts[_user].isActive, "User not registered");
        _;
    }
    
    modifier validAmount(uint256 _amount) {
        require(_amount > 0, "Amount must be greater than 0");
        _;
    }
    
    // Constructor
    constructor() {
        owner = msg.sender;
    }
    
    /**
     * Register a new user with optional referrer
     */
    function registerUser(address _referrer) external {
        require(!userAccounts[msg.sender].isActive, "User already registered");
        
        userAccounts[msg.sender] = UserAccount({
            user: msg.sender,
            totalDeposited: 0,
            totalWithdrawn: 0,
            currentBalance: 0,
            emergencyFund: 0,
            pensionFund: 0,
            communityPoolShares: 0,
            lastDepositTime: 0,
            lastWithdrawalTime: 0,
            isActive: true,
            hasInsurance: false,
            isPremiumUser: false,
            referralCount: 0,
            totalReferralRewards: 0,
            educationScore: 0,
            riskProfile: 1 // Default to conservative
        });
        
        // Set referrer if provided and valid
        if (_referrer != address(0) && _referrer != msg.sender && userAccounts[_referrer].isActive) {
            referrers[msg.sender] = _referrer;
            userAccounts[_referrer].referralCount++;
        }
        
        totalUsers++;
        
        emit UserRegistered(msg.sender, _referrer, block.timestamp);
    }
    
    /**
     * Make a deposit with automatic allocation to emergency fund and pension
     */
    function makeDeposit(
        uint256 _emergencyPercentage, // Percentage for emergency fund (0-100)
        uint256 _pensionPercentage,   // Percentage for pension (0-100)
        uint256 _retirementAge        // Retirement age for pension (60-75)
    ) external payable validUser(msg.sender) validAmount(msg.value) {
        require(_emergencyPercentage + _pensionPercentage <= 100, "Percentages exceed 100%");
        require(_retirementAge >= 60 && _retirementAge <= 75, "Invalid retirement age");
        
        uint256 totalAmount = msg.value;
        uint256 emergencyAmount = (totalAmount * _emergencyPercentage) / 100;
        uint256 pensionAmount = (totalAmount * _pensionPercentage) / 100;
        uint256 savingsAmount = totalAmount - emergencyAmount - pensionAmount;
        
        // Update user account
        UserAccount storage account = userAccounts[msg.sender];
        account.totalDeposited += totalAmount;
        account.currentBalance += savingsAmount;
        account.lastDepositTime = block.timestamp;
        
        // Handle emergency fund
        if (emergencyAmount > 0) {
            if (!emergencyFunds[msg.sender].isActive) {
                emergencyFunds[msg.sender] = EmergencyFund({
                    user: msg.sender,
                    balance: 0,
                    lastDepositTime: 0,
                    withdrawalCount: 0,
                    totalWithdrawn: 0,
                    isActive: true,
                    incentiveEarned: 0
                });
            }
            emergencyFunds[msg.sender].balance += emergencyAmount;
            emergencyFunds[msg.sender].lastDepositTime = block.timestamp;
            account.emergencyFund += emergencyAmount;
            totalEmergencyFunds += emergencyAmount;
        }
        
        // Handle pension fund
        if (pensionAmount > 0) {
            if (pensionVaults[msg.sender].vestingStartTime == 0) {
                pensionVaults[msg.sender] = PensionVault({
                    user: msg.sender,
                    totalDeposited: 0,
                    currentValue: 0,
                    retirementAge: _retirementAge,
                    vestingStartTime: block.timestamp,
                    vestingEndTime: block.timestamp + (10 * 365 days), // 10-year vesting
                    isVesting: true,
                    isWithdrawn: false,
                    monthlyWithdrawalAmount: 0,
                    lastWithdrawalTime: 0
                });
            }
            pensionVaults[msg.sender].totalDeposited += pensionAmount;
            pensionVaults[msg.sender].currentValue += pensionAmount;
            account.pensionFund += pensionAmount;
            totalPensionFunds += pensionAmount;
            
            emit PensionDeposit(msg.sender, pensionAmount, _retirementAge, block.timestamp);
        }
        
        // Process referral reward
        if (referrers[msg.sender] != address(0)) {
            uint256 referralReward = (totalAmount * referralBonusRate) / 10000;
            address referrer = referrers[msg.sender];
            
            userAccounts[referrer].totalReferralRewards += referralReward;
            totalReferralRewards += referralReward;
            
            referralHistory[referrer].push(ReferralData({
                referrer: referrer,
                referee: msg.sender,
                depositAmount: totalAmount,
                rewardAmount: referralReward,
                timestamp: block.timestamp,
                isPaid: false
            }));
            
            emit ReferralRewardPaid(referrer, msg.sender, referralReward, block.timestamp);
        }
        
        totalDeposited += totalAmount;
        
        emit DepositMade(msg.sender, totalAmount, emergencyAmount, pensionAmount, block.timestamp);
    }
    
    /**
     * Withdraw from regular savings
     */
    function withdrawSavings(uint256 _amount) external validUser(msg.sender) validAmount(_amount) {
        UserAccount storage account = userAccounts[msg.sender];
        require(account.currentBalance >= _amount, "Insufficient balance");
        
        account.currentBalance -= _amount;
        account.totalWithdrawn += _amount;
        account.lastWithdrawalTime = block.timestamp;
        
        totalWithdrawn += _amount;
        
        // Transfer ETH to user
        (bool success, ) = msg.sender.call{value: _amount}("");
        require(success, "Transfer failed");
        
        emit WithdrawalMade(msg.sender, _amount, 0, block.timestamp);
    }
    
    /**
     * Emergency withdrawal with fee
     */
    function emergencyWithdrawal(uint256 _amount) external validUser(msg.sender) validAmount(_amount) {
        EmergencyFund storage emergency = emergencyFunds[msg.sender];
        require(emergency.isActive, "No emergency fund");
        require(emergency.balance >= _amount, "Insufficient emergency balance");
        
        uint256 fee = (_amount * emergencyWithdrawalFee) / 10000;
        uint256 netAmount = _amount - fee;
        
        emergency.balance -= _amount;
        emergency.withdrawalCount++;
        emergency.totalWithdrawn += _amount;
        
        userAccounts[msg.sender].emergencyFund -= _amount;
        totalEmergencyFunds -= _amount;
        
        // Transfer net amount to user
        (bool success, ) = msg.sender.call{value: netAmount}("");
        require(success, "Transfer failed");
        
        emit EmergencyWithdrawal(msg.sender, _amount, fee, block.timestamp);
    }
    
    /**
     * Withdraw from pension vault (only after retirement age and vesting period)
     */
    function withdrawPension(uint256 _amount) external validUser(msg.sender) validAmount(_amount) {
        PensionVault storage pension = pensionVaults[msg.sender];
        require(pension.isVesting, "No pension vault");
        require(!pension.isWithdrawn, "Pension already withdrawn");
        require(block.timestamp >= pension.vestingEndTime, "Vesting period not completed");
        
        // Check retirement age (simplified - in production, use oracle for age verification)
        require(block.timestamp >= pension.vestingStartTime + (pension.retirementAge * 365 days), "Not retirement age");
        
        require(pension.currentValue >= _amount, "Insufficient pension balance");
        
        pension.currentValue -= _amount;
        pension.lastWithdrawalTime = block.timestamp;
        
        userAccounts[msg.sender].pensionFund -= _amount;
        totalPensionFunds -= _amount;
        
        // Transfer to user
        (bool success, ) = msg.sender.call{value: _amount}("");
        require(success, "Transfer failed");
        
        emit PensionWithdrawal(msg.sender, _amount, block.timestamp);
    }
    
    /**
     * Create a community pool (digital chama)
     */
    function createCommunityPool(string memory _name) external validUser(msg.sender) {
        CommunityPool storage pool = communityPools[nextCommunityPoolId];
        pool.id = nextCommunityPoolId;
        pool.creator = msg.sender;
        pool.name = _name;
        pool.totalDeposits = 0;
        pool.memberCount = 0;
        pool.yieldRate = 0;
        pool.isActive = true;
        pool.createdAt = block.timestamp;
        
        // Creator automatically becomes first member
        pool.isMember[msg.sender] = true;
        pool.memberCount = 1;
        
        totalCommunityPools++;
        
        emit CommunityPoolCreated(msg.sender, nextCommunityPoolId, _name, block.timestamp);
        nextCommunityPoolId++;
    }
    
    /**
     * Join a community pool
     */
    function joinCommunityPool(uint256 _poolId, uint256 _amount) external payable validUser(msg.sender) validAmount(_amount) {
        require(msg.value >= _amount, "Insufficient ETH sent");
        require(_poolId < nextCommunityPoolId, "Invalid pool ID");
        
        CommunityPool storage pool = communityPools[_poolId];
        require(pool.isActive, "Pool not active");
        require(!pool.isMember[msg.sender], "Already a member");
        require(pool.memberCount < 50, "Pool is full");
        
        pool.isMember[msg.sender] = true;
        pool.memberShares[msg.sender] = _amount;
        pool.totalDeposits += _amount;
        pool.memberCount++;
        
        userAccounts[msg.sender].communityPoolShares += _amount;
        
        emit CommunityPoolJoined(msg.sender, _poolId, _amount, block.timestamp);
    }
    
    /**
     * Purchase insurance policy
     */
    function purchaseInsurance(uint256 _coverageAmount) external validUser(msg.sender) validAmount(_coverageAmount) {
        require(!insurancePolicies[msg.sender].isActive, "Insurance already active");
        
        insurancePolicies[msg.sender] = InsurancePolicy({
            user: msg.sender,
            coverageAmount: _coverageAmount,
            premiumRate: insurancePremiumRate,
            coverageStartTime: block.timestamp,
            coverageEndTime: block.timestamp + (365 days), // 1 year coverage
            isActive: true,
            claimsCount: 0,
            totalClaimsPaid: 0
        });
        
        userAccounts[msg.sender].hasInsurance = true;
        totalInsurancePolicies++;
        
        emit InsurancePolicyPurchased(msg.sender, _coverageAmount, insurancePremiumRate, block.timestamp);
    }
    
    /**
     * Update user risk profile
     */
    function updateRiskProfile(uint256 _newProfile) external validUser(msg.sender) {
        require(_newProfile >= 1 && _newProfile <= 3, "Invalid risk profile");
        
        uint256 oldProfile = userAccounts[msg.sender].riskProfile;
        userAccounts[msg.sender].riskProfile = _newProfile;
        
        emit RiskProfileUpdated(msg.sender, oldProfile, _newProfile, block.timestamp);
    }
    
    /**
     * Update education score (called by education system)
     */
    function updateEducationScore(address _user, uint256 _newScore) external onlyOwner {
        require(userAccounts[_user].isActive, "User not registered");
        
        uint256 oldScore = userAccounts[_user].educationScore;
        userAccounts[_user].educationScore = _newScore;
        
        // Unlock premium features based on education score
        if (_newScore >= 100 && !userAccounts[_user].isPremiumUser) {
            userAccounts[_user].isPremiumUser = true;
            emit PremiumFeatureUnlocked(_user, "Premium User", 0, block.timestamp);
        }
        
        emit EducationScoreUpdated(_user, oldScore, _newScore, block.timestamp);
    }
    
    /**
     * Get user's complete portfolio
     */
    function getUserPortfolio(address _user) external view returns (
        uint256 totalBalance,
        uint256 emergencyFund,
        uint256 pensionFund,
        uint256 communityShares,
        uint256 referralRewards,
        uint256 educationScore,
        uint256 riskProfile,
        bool hasInsurance,
        bool isPremiumUser
    ) {
        UserAccount memory account = userAccounts[_user];
        EmergencyFund memory emergency = emergencyFunds[_user];
        PensionVault memory pension = pensionVaults[_user];
        
        return (
            account.currentBalance,
            emergency.balance,
            pension.currentValue,
            account.communityPoolShares,
            account.totalReferralRewards,
            account.educationScore,
            account.riskProfile,
            account.hasInsurance,
            account.isPremiumUser
        );
    }
    
    /**
     * Get platform statistics
     */
    function getPlatformStats() external view returns (
        uint256 _totalUsers,
        uint256 _totalDeposited,
        uint256 _totalWithdrawn,
        uint256 _totalEmergencyFunds,
        uint256 _totalPensionFunds,
        uint256 _totalCommunityPools,
        uint256 _totalInsurancePolicies,
        uint256 _totalReferralRewards
    ) {
        return (
            totalUsers,
            totalDeposited,
            totalWithdrawn,
            totalEmergencyFunds,
            totalPensionFunds,
            totalCommunityPools,
            totalInsurancePolicies,
            totalReferralRewards
        );
    }
    
    /**
     * Owner functions for platform management
     */
    function setPlatformFeeRate(uint256 _newRate) external onlyOwner {
        require(_newRate <= 1000, "Fee rate too high");
        platformFeeRate = _newRate;
    }
    
    function setEmergencyWithdrawalFee(uint256 _newFee) external onlyOwner {
        require(_newFee <= 1000, "Fee too high");
        emergencyWithdrawalFee = _newFee;
    }
    
    function setReferralBonusRate(uint256 _newRate) external onlyOwner {
        require(_newRate <= 1000, "Rate too high");
        referralBonusRate = _newRate;
    }
    
    function withdrawPlatformFees() external onlyOwner {
        uint256 balance = address(this).balance;
        require(balance > 0, "No fees to withdraw");
        
        (bool success, ) = owner.call{value: balance}("");
        require(success, "Failed to withdraw fees");
    }
    
    receive() external payable {}
}
