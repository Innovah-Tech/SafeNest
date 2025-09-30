//SPDX-License-Identifier: MIT
pragma solidity >=0.8.0 <0.9.0;

/**
 * VaultSystem - Comprehensive vault system for SafeNest platform
 * Implements micro-savings, pension nest, and emergency vaults
 * @author SafeNest Team
 */
contract VaultSystem {
    // State Variables
    address public immutable owner;
    address public safeToken;
    string public platformName = "SafeNest Vault System";
    
    // Vault Types
    enum VaultType {
        MICRO_SAVINGS,    // Daily/weekly micro-savings
        PENSION_NEST,     // Long-term retirement savings
        EMERGENCY_VAULT   // Liquid emergency fund
    }
    
    // User Vault Structure
    struct UserVault {
        address user;
        VaultType vaultType;
        uint256 totalDeposited;
        uint256 currentBalance;
        uint256 totalWithdrawn;
        uint256 lastDepositTime;
        uint256 lastWithdrawalTime;
        uint256 yieldEarned;
        bool isActive;
        uint256 autoDepositAmount;
        uint256 autoDepositFrequency; // in days
        uint256 nextAutoDeposit;
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
    
    // Mappings
    mapping(address => mapping(VaultType => UserVault)) public userVaults;
    mapping(uint256 => YieldStrategy) public yieldStrategies;
    mapping(address => InsurancePolicy) public insurancePolicies;
    mapping(address => bool) public hasPremiumAccess;
    
    // Platform Statistics
    uint256 public totalUsers = 0;
    uint256 public totalDeposited = 0;
    uint256 public totalWithdrawn = 0;
    uint256 public totalYieldEarned = 0;
    uint256 public totalInsurancePolicies = 0;
    
    // Platform Parameters
    uint256 public protocolFeeRate = 20; // 0.2% in basis points
    uint256 public emergencyWithdrawalFee = 50; // 0.5%
    uint256 public pensionYieldBoost = 200; // 2%
    uint256 public microSavingsYieldBoost = 100; // 1%
    uint256 public emergencyIncentiveRate = 25; // 0.25%
    
    // Counters
    uint256 public nextYieldStrategyId = 1;
    
    // Events
    event VaultCreated(address indexed user, VaultType vaultType, uint256 timestamp);
    event DepositMade(address indexed user, VaultType vaultType, uint256 amount, uint256 timestamp);
    event WithdrawalMade(address indexed user, VaultType vaultType, uint256 amount, uint256 fee, uint256 timestamp);
    event AutoDepositEnabled(address indexed user, VaultType vaultType, uint256 amount, uint256 frequency);
    event AutoDepositExecuted(address indexed user, VaultType vaultType, uint256 amount, uint256 timestamp);
    event YieldStrategyAdded(uint256 indexed strategyId, string name, uint256 apy, uint256 riskLevel);
    event YieldEarned(address indexed user, VaultType vaultType, uint256 amount, uint256 timestamp);
    event InsurancePolicyPurchased(address indexed user, uint256 coverageAmount, uint256 premiumRate);
    event InsuranceClaimProcessed(address indexed user, uint256 claimAmount, uint256 timestamp);
    event PremiumAccessGranted(address indexed user, string feature, uint256 timestamp);
    event ProtocolFeeUpdated(uint256 oldFee, uint256 newFee);
    event EmergencyWithdrawal(address indexed user, uint256 amount, uint256 fee, uint256 timestamp);
    
    // Modifiers
    modifier onlyOwner() {
        require(msg.sender == owner, "Not the owner");
        _;
    }
    
    modifier validVaultType(VaultType _vaultType) {
        require(_vaultType >= VaultType.MICRO_SAVINGS && _vaultType <= VaultType.EMERGENCY_VAULT, "Invalid vault type");
        _;
    }
    
    modifier validAmount(uint256 _amount) {
        require(_amount > 0, "Amount must be greater than 0");
        _;
    }
    
    modifier hasVault(address _user, VaultType _vaultType) {
        require(userVaults[_user][_vaultType].isActive, "Vault not active");
        _;
    }
    
    // Constructor
    constructor(address _safeToken) {
        owner = msg.sender;
        safeToken = _safeToken;
    }
    
    /**
     * Create a new vault
     */
    function createVault(VaultType _vaultType) external validVaultType(_vaultType) {
        require(!userVaults[msg.sender][_vaultType].isActive, "Vault already exists");
        
        userVaults[msg.sender][_vaultType] = UserVault({
            user: msg.sender,
            vaultType: _vaultType,
            totalDeposited: 0,
            currentBalance: 0,
            totalWithdrawn: 0,
            lastDepositTime: 0,
            lastWithdrawalTime: 0,
            yieldEarned: 0,
            isActive: true,
            autoDepositAmount: 0,
            autoDepositFrequency: 0,
            nextAutoDeposit: 0
        });
        
        totalUsers++;
        
        emit VaultCreated(msg.sender, _vaultType, block.timestamp);
    }
    
    /**
     * Make a deposit to vault
     */
    function depositToVault(VaultType _vaultType, uint256 _amount) external validVaultType(_vaultType) validAmount(_amount) payable {
        require(userVaults[msg.sender][_vaultType].isActive, "Vault not active");
        require(msg.value >= _amount, "Insufficient ETH sent");
        
        UserVault storage vault = userVaults[msg.sender][_vaultType];
        
        // Apply vault-specific logic
        if (_vaultType == VaultType.MICRO_SAVINGS) {
            require(_amount >= 0.001 ether, "Minimum deposit for micro-savings is 0.001 ETH");
        } else if (_vaultType == VaultType.PENSION_NEST) {
            require(_amount >= 0.01 ether, "Minimum deposit for pension nest is 0.01 ETH");
        } else if (_vaultType == VaultType.EMERGENCY_VAULT) {
            require(_amount >= 0.005 ether, "Minimum deposit for emergency vault is 0.005 ETH");
        }
        
        vault.totalDeposited += _amount;
        vault.currentBalance += _amount;
        vault.lastDepositTime = block.timestamp;
        
        totalDeposited += _amount;
        
        emit DepositMade(msg.sender, _vaultType, _amount, block.timestamp);
    }
    
    /**
     * Withdraw from vault
     */
    function withdrawFromVault(VaultType _vaultType, uint256 _amount) external validVaultType(_vaultType) validAmount(_amount) hasVault(msg.sender, _vaultType) {
        UserVault storage vault = userVaults[msg.sender][_vaultType];
        require(vault.currentBalance >= _amount, "Insufficient balance");
        
        uint256 fee = 0;
        
        // Apply vault-specific withdrawal logic
        if (_vaultType == VaultType.EMERGENCY_VAULT) {
            // Emergency vault has instant withdrawal with small fee
            fee = (_amount * emergencyWithdrawalFee) / 10000;
        } else if (_vaultType == VaultType.PENSION_NEST) {
            // Pension nest has time-locked withdrawals
            require(block.timestamp >= vault.lastDepositTime + 365 days, "Pension withdrawals locked for 1 year");
        }
        
        uint256 netAmount = _amount - fee;
        
        vault.currentBalance -= _amount;
        vault.totalWithdrawn += _amount;
        vault.lastWithdrawalTime = block.timestamp;
        
        totalWithdrawn += _amount;
        
        // Transfer funds to user
        (bool success, ) = msg.sender.call{value: netAmount}("");
        require(success, "Transfer failed");
        
        emit WithdrawalMade(msg.sender, _vaultType, _amount, fee, block.timestamp);
    }
    
    /**
     * Enable auto-deposit for vault
     */
    function enableAutoDeposit(
        VaultType _vaultType,
        uint256 _amount,
        uint256 _frequency
    ) external validVaultType(_vaultType) hasVault(msg.sender, _vaultType) {
        require(_amount > 0, "Auto-deposit amount must be positive");
        require(_frequency >= 1, "Frequency must be at least 1 day");
        require(_frequency <= 365, "Frequency cannot exceed 1 year");
        
        UserVault storage vault = userVaults[msg.sender][_vaultType];
        vault.autoDepositAmount = _amount;
        vault.autoDepositFrequency = _frequency;
        vault.nextAutoDeposit = block.timestamp + _frequency * 1 days;
        
        emit AutoDepositEnabled(msg.sender, _vaultType, _amount, _frequency);
    }
    
    /**
     * Execute auto-deposit (called by user or automated system)
     */
    function executeAutoDeposit(VaultType _vaultType) external payable validVaultType(_vaultType) hasVault(msg.sender, _vaultType) {
        UserVault storage vault = userVaults[msg.sender][_vaultType];
        require(vault.autoDepositAmount > 0, "Auto-deposit not enabled");
        require(block.timestamp >= vault.nextAutoDeposit, "Auto-deposit not due yet");
        require(msg.value >= vault.autoDepositAmount, "Insufficient ETH for auto-deposit");
        
        vault.totalDeposited += vault.autoDepositAmount;
        vault.currentBalance += vault.autoDepositAmount;
        vault.lastDepositTime = block.timestamp;
        vault.nextAutoDeposit = block.timestamp + vault.autoDepositFrequency * 1 days;
        
        totalDeposited += vault.autoDepositAmount;
        
        emit AutoDepositExecuted(msg.sender, _vaultType, vault.autoDepositAmount, block.timestamp);
    }
    
    /**
     * Add yield strategy
     */
    function addYieldStrategy(
        string memory _name,
        address _strategyContract,
        uint256 _apy,
        uint256 _riskLevel,
        uint256 _minDeposit,
        uint256 _maxDeposit
    ) external onlyOwner {
        require(_apy > 0, "APY must be positive");
        require(_riskLevel >= 1 && _riskLevel <= 3, "Risk level must be 1-3");
        require(_minDeposit > 0, "Minimum deposit must be positive");
        
        yieldStrategies[nextYieldStrategyId] = YieldStrategy({
            id: nextYieldStrategyId,
            name: _name,
            strategyContract: _strategyContract,
            apy: _apy,
            riskLevel: _riskLevel,
            isActive: true,
            minDeposit: _minDeposit,
            maxDeposit: _maxDeposit,
            totalDeposited: 0
        });
        
        emit YieldStrategyAdded(nextYieldStrategyId, _name, _apy, _riskLevel);
        nextYieldStrategyId++;
    }
    
    /**
     * Calculate and distribute yield
     */
    function calculateYield(address _user, VaultType _vaultType) external validVaultType(_vaultType) hasVault(_user, _vaultType) {
        UserVault storage vault = userVaults[_user][_vaultType];
        require(vault.currentBalance > 0, "No balance to calculate yield");
        
        // Calculate yield based on vault type and strategy
        uint256 baseYield = 0;
        uint256 yieldBoost = 0;
        
        if (_vaultType == VaultType.MICRO_SAVINGS) {
            baseYield = (vault.currentBalance * 300) / 10000; // 3% base APY
            yieldBoost = (vault.currentBalance * microSavingsYieldBoost) / 10000; // 1% boost
        } else if (_vaultType == VaultType.PENSION_NEST) {
            baseYield = (vault.currentBalance * 500) / 10000; // 5% base APY
            yieldBoost = (vault.currentBalance * pensionYieldBoost) / 10000; // 2% boost
        } else if (_vaultType == VaultType.EMERGENCY_VAULT) {
            baseYield = (vault.currentBalance * 200) / 10000; // 2% base APY
            yieldBoost = (vault.currentBalance * emergencyIncentiveRate) / 10000; // 0.25% boost
        }
        
        uint256 totalYield = baseYield + yieldBoost;
        uint256 protocolFee = (totalYield * protocolFeeRate) / 10000;
        uint256 netYield = totalYield - protocolFee;
        
        vault.currentBalance += netYield;
        vault.yieldEarned += netYield;
        totalYieldEarned += netYield;
        
        emit YieldEarned(_user, _vaultType, netYield, block.timestamp);
    }
    
    /**
     * Purchase insurance policy
     */
    function purchaseInsurance(uint256 _coverageAmount) external validAmount(_coverageAmount) {
        require(!insurancePolicies[msg.sender].isActive, "Insurance already active");
        
        insurancePolicies[msg.sender] = InsurancePolicy({
            user: msg.sender,
            coverageAmount: _coverageAmount,
            premiumRate: 10, // 0.1% premium
            coverageStartTime: block.timestamp,
            coverageEndTime: block.timestamp + 365 days,
            isActive: true,
            claimsCount: 0,
            totalClaimsPaid: 0
        });
        
        totalInsurancePolicies++;
        
        emit InsurancePolicyPurchased(msg.sender, _coverageAmount, 10);
    }
    
    /**
     * Process insurance claim
     */
    function processInsuranceClaim(uint256 _claimAmount) external {
        InsurancePolicy storage policy = insurancePolicies[msg.sender];
        require(policy.isActive, "No active insurance policy");
        require(block.timestamp <= policy.coverageEndTime, "Insurance expired");
        require(_claimAmount <= policy.coverageAmount, "Claim exceeds coverage");
        
        policy.claimsCount++;
        policy.totalClaimsPaid += _claimAmount;
        
        // Transfer claim amount to user
        (bool success, ) = msg.sender.call{value: _claimAmount}("");
        require(success, "Transfer failed");
        
        emit InsuranceClaimProcessed(msg.sender, _claimAmount, block.timestamp);
    }
    
    /**
     * Check premium access
     */
    function checkPremiumAccess(address _user) external view returns (bool) {
        return hasPremiumAccess[_user];
    }
    
    /**
     * Grant premium access (called by SAFE token contract)
     */
    function grantPremiumAccess(address _user) external {
        require(msg.sender == safeToken, "Only SAFE token can grant premium access");
        hasPremiumAccess[_user] = true;
        
        emit PremiumAccessGranted(_user, "Premium Vault Access", block.timestamp);
    }
    
    /**
     * Get vault details
     */
    function getVaultDetails(address _user, VaultType _vaultType) external view validVaultType(_vaultType) returns (
        uint256 vaultTotalDeposited,
        uint256 currentBalance,
        uint256 vaultTotalWithdrawn,
        uint256 yieldEarned,
        uint256 lastDepositTime,
        uint256 lastWithdrawalTime,
        bool isActive,
        uint256 autoDepositAmount,
        uint256 autoDepositFrequency
    ) {
        UserVault memory vault = userVaults[_user][_vaultType];
        return (
            vault.totalDeposited,
            vault.currentBalance,
            vault.totalWithdrawn,
            vault.yieldEarned,
            vault.lastDepositTime,
            vault.lastWithdrawalTime,
            vault.isActive,
            vault.autoDepositAmount,
            vault.autoDepositFrequency
        );
    }
    
    /**
     * Get platform statistics
     */
    function getPlatformStats() external view returns (
        uint256 _totalUsers,
        uint256 _totalDeposited,
        uint256 _totalWithdrawn,
        uint256 _totalYieldEarned,
        uint256 _totalInsurancePolicies,
        uint256 _protocolFeeRate
    ) {
        return (
            totalUsers,
            totalDeposited,
            totalWithdrawn,
            totalYieldEarned,
            totalInsurancePolicies,
            protocolFeeRate
        );
    }
    
    /**
     * Admin functions
     */
    function setProtocolFeeRate(uint256 _newRate) external onlyOwner {
        require(_newRate >= 10 && _newRate <= 30, "Fee rate must be between 0.1% and 0.3%");
        uint256 oldRate = protocolFeeRate;
        protocolFeeRate = _newRate;
        emit ProtocolFeeUpdated(oldRate, _newRate);
    }
    
    function setEmergencyWithdrawalFee(uint256 _newFee) external onlyOwner {
        require(_newFee <= 100, "Fee cannot exceed 1%");
        emergencyWithdrawalFee = _newFee;
    }
    
    function setPensionYieldBoost(uint256 _newBoost) external onlyOwner {
        require(_newBoost <= 500, "Boost cannot exceed 5%");
        pensionYieldBoost = _newBoost;
    }
    
    function setMicroSavingsYieldBoost(uint256 _newBoost) external onlyOwner {
        require(_newBoost <= 200, "Boost cannot exceed 2%");
        microSavingsYieldBoost = _newBoost;
    }
    
    function withdrawPlatformFees() external onlyOwner {
        uint256 balance = address(this).balance;
        require(balance > 0, "No fees to withdraw");
        
        (bool success, ) = owner.call{value: balance}("");
        require(success, "Failed to withdraw fees");
    }
    
    receive() external payable {}
}
