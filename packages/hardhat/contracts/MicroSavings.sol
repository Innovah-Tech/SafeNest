//SPDX-License-Identifier: MIT
pragma solidity >=0.8.0 <0.9.0;

// import "hardhat/console.sol";

/**
 * MicroSavings - Mobile-first DeFi savings and investment platform
 * Enables micro-savings, micro-investments, and on-chain micro-pensions
 * @author SafeNest Team
 */
contract MicroSavings {
    // State Variables
    address public immutable owner;
    string public platformName = "MicroSavings - Mobile DeFi Platform";

    // Supported stablecoins
    mapping(address => bool) public supportedStablecoins;
    mapping(address => uint256) public stablecoinDecimals;

    // User savings accounts
    struct SavingsAccount {
        address user;
        address stablecoin;
        uint256 totalDeposited;
        uint256 totalWithdrawn;
        uint256 currentBalance;
        uint256 lastDepositTime;
        bool isActive;
    }

    // Investment strategies
    struct InvestmentStrategy {
        string name;
        address strategyContract;
        uint256 apy; // Annual percentage yield in basis points (100 = 1%)
        bool isActive;
        uint256 minDeposit;
        uint256 maxDeposit;
    }

    // User investment positions
    struct InvestmentPosition {
        address user;
        uint256 strategyId;
        address stablecoin;
        uint256 amount;
        uint256 shares;
        uint256 entryTime;
        bool isActive;
    }

    // Emergency fund vault
    struct EmergencyVault {
        address user;
        address stablecoin;
        uint256 balance;
        uint256 lastDepositTime;
        uint256 withdrawalCount;
        bool isActive;
    }

    // Goal tracking
    struct SavingsGoal {
        address user;
        string goalName;
        uint256 targetAmount;
        uint256 currentAmount;
        uint256 deadline;
        bool isCompleted;
        uint256 createdAt;
    }

    // Mappings
    mapping(address => SavingsAccount) public userSavingsAccounts;
    mapping(address => mapping(address => uint256)) public userStablecoinBalances;
    mapping(uint256 => InvestmentStrategy) public investmentStrategies;
    mapping(address => InvestmentPosition[]) public userInvestments;
    mapping(address => EmergencyVault) public userEmergencyVaults;
    mapping(address => SavingsGoal[]) public userGoals;

    // Platform statistics
    uint256 public totalUsers = 0;
    uint256 public totalDeposited = 0;
    uint256 public totalInvested = 0;
    uint256 public totalEmergencyFunds = 0;
    uint256 public platformFeeRate = 30; // 0.3% in basis points
    uint256 public nextStrategyId = 1;

    // Events
    event StablecoinAdded(address indexed stablecoin, uint256 decimals);
    event DepositMade(address indexed user, address indexed stablecoin, uint256 amount);
    event WithdrawalMade(address indexed user, address indexed stablecoin, uint256 amount);
    event InvestmentMade(address indexed user, uint256 strategyId, uint256 amount);
    event InvestmentWithdrawn(address indexed user, uint256 strategyId, uint256 amount);
    event EmergencyDeposit(address indexed user, address indexed stablecoin, uint256 amount);
    event EmergencyWithdrawal(address indexed user, address indexed stablecoin, uint256 amount);
    event GoalCreated(address indexed user, string goalName, uint256 targetAmount);
    event GoalUpdated(address indexed user, string goalName, uint256 currentAmount);
    event GoalCompleted(address indexed user, string goalName);

    // Modifiers
    modifier onlyOwner() {
        require(msg.sender == owner, "Not the owner");
        _;
    }

    modifier validStablecoin(address _stablecoin) {
        require(supportedStablecoins[_stablecoin], "Unsupported stablecoin");
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
     * Add supported stablecoin
     */
    function addStablecoin(address _stablecoin, uint256 _decimals) external onlyOwner {
        supportedStablecoins[_stablecoin] = true;
        stablecoinDecimals[_stablecoin] = _decimals;
        emit StablecoinAdded(_stablecoin, _decimals);
    }

    /**
     * Add investment strategy
     */
    function addInvestmentStrategy(
        string memory _name,
        address _strategyContract,
        uint256 _apy,
        uint256 _minDeposit,
        uint256 _maxDeposit
    ) external onlyOwner {
        investmentStrategies[nextStrategyId] = InvestmentStrategy({
            name: _name,
            strategyContract: _strategyContract,
            apy: _apy,
            isActive: true,
            minDeposit: _minDeposit,
            maxDeposit: _maxDeposit
        });
        nextStrategyId++;
    }

    /**
     * Make micro-savings deposit
     */
    function depositSavings(
        address _stablecoin,
        uint256 _amount
    ) external validStablecoin(_stablecoin) validAmount(_amount) {
        // Transfer stablecoin from user
        // Note: In production, you'd use IERC20(_stablecoin).transferFrom(msg.sender, address(this), _amount)

        // Update user savings account
        if (!userSavingsAccounts[msg.sender].isActive) {
            userSavingsAccounts[msg.sender] = SavingsAccount({
                user: msg.sender,
                stablecoin: _stablecoin,
                totalDeposited: 0,
                totalWithdrawn: 0,
                currentBalance: 0,
                lastDepositTime: 0,
                isActive: true
            });
            totalUsers++;
        }

        userSavingsAccounts[msg.sender].totalDeposited += _amount;
        userSavingsAccounts[msg.sender].currentBalance += _amount;
        userSavingsAccounts[msg.sender].lastDepositTime = block.timestamp;
        userStablecoinBalances[msg.sender][_stablecoin] += _amount;

        totalDeposited += _amount;

        emit DepositMade(msg.sender, _stablecoin, _amount);
    }

    /**
     * Withdraw from savings
     */
    function withdrawSavings(
        address _stablecoin,
        uint256 _amount
    ) external validStablecoin(_stablecoin) validAmount(_amount) {
        require(userStablecoinBalances[msg.sender][_stablecoin] >= _amount, "Insufficient balance");

        userSavingsAccounts[msg.sender].totalWithdrawn += _amount;
        userSavingsAccounts[msg.sender].currentBalance -= _amount;
        userStablecoinBalances[msg.sender][_stablecoin] -= _amount;

        totalDeposited -= _amount;

        // Transfer stablecoin to user
        // Note: In production, you'd use IERC20(_stablecoin).transfer(msg.sender, _amount)

        emit WithdrawalMade(msg.sender, _stablecoin, _amount);
    }

    /**
     * Invest in DeFi strategy
     */
    function investInStrategy(
        uint256 _strategyId,
        address _stablecoin,
        uint256 _amount
    ) external validStablecoin(_stablecoin) validAmount(_amount) {
        InvestmentStrategy storage strategy = investmentStrategies[_strategyId];
        require(strategy.isActive, "Strategy not active");
        require(_amount >= strategy.minDeposit, "Amount below minimum");
        require(_amount <= strategy.maxDeposit, "Amount above maximum");
        require(userStablecoinBalances[msg.sender][_stablecoin] >= _amount, "Insufficient balance");

        // Calculate shares (simplified - in production, use proper share calculation)
        uint256 shares = (_amount * 1e18) / 1e18; // 1:1 for simplicity

        userInvestments[msg.sender].push(
            InvestmentPosition({
                user: msg.sender,
                strategyId: _strategyId,
                stablecoin: _stablecoin,
                amount: _amount,
                shares: shares,
                entryTime: block.timestamp,
                isActive: true
            })
        );

        userStablecoinBalances[msg.sender][_stablecoin] -= _amount;
        totalInvested += _amount;

        emit InvestmentMade(msg.sender, _strategyId, _amount);
    }

    /**
     * Withdraw from investment
     */
    function withdrawFromInvestment(uint256 _positionIndex, uint256 _shares) external validAmount(_shares) {
        require(_positionIndex < userInvestments[msg.sender].length, "Invalid position index");

        InvestmentPosition storage position = userInvestments[msg.sender][_positionIndex];
        require(position.isActive, "Position not active");
        require(position.shares >= _shares, "Insufficient shares");

        // Calculate withdrawal amount (simplified)
        uint256 withdrawalAmount = (position.amount * _shares) / position.shares;

        position.shares -= _shares;
        position.amount -= withdrawalAmount;

        if (position.shares == 0) {
            position.isActive = false;
        }

        userStablecoinBalances[msg.sender][position.stablecoin] += withdrawalAmount;
        totalInvested -= withdrawalAmount;

        emit InvestmentWithdrawn(msg.sender, position.strategyId, withdrawalAmount);
    }

    /**
     * Deposit to emergency vault
     */
    function depositEmergencyFund(
        address _stablecoin,
        uint256 _amount
    ) external validStablecoin(_stablecoin) validAmount(_amount) {
        require(userStablecoinBalances[msg.sender][_stablecoin] >= _amount, "Insufficient balance");

        if (!userEmergencyVaults[msg.sender].isActive) {
            userEmergencyVaults[msg.sender] = EmergencyVault({
                user: msg.sender,
                stablecoin: _stablecoin,
                balance: 0,
                lastDepositTime: 0,
                withdrawalCount: 0,
                isActive: true
            });
        }

        userEmergencyVaults[msg.sender].balance += _amount;
        userEmergencyVaults[msg.sender].lastDepositTime = block.timestamp;
        userStablecoinBalances[msg.sender][_stablecoin] -= _amount;

        totalEmergencyFunds += _amount;

        emit EmergencyDeposit(msg.sender, _stablecoin, _amount);
    }

    /**
     * Withdraw from emergency vault (instant)
     */
    function withdrawEmergencyFund(
        address _stablecoin,
        uint256 _amount
    ) external validStablecoin(_stablecoin) validAmount(_amount) {
        require(userEmergencyVaults[msg.sender].isActive, "No emergency vault");
        require(userEmergencyVaults[msg.sender].balance >= _amount, "Insufficient emergency balance");

        userEmergencyVaults[msg.sender].balance -= _amount;
        userEmergencyVaults[msg.sender].withdrawalCount++;
        userStablecoinBalances[msg.sender][_stablecoin] += _amount;

        totalEmergencyFunds -= _amount;

        emit EmergencyWithdrawal(msg.sender, _stablecoin, _amount);
    }

    /**
     * Create savings goal
     */
    function createSavingsGoal(
        string memory _goalName,
        uint256 _targetAmount,
        uint256 _deadline
    ) external validAmount(_targetAmount) {
        require(_deadline > block.timestamp, "Deadline must be in the future");

        userGoals[msg.sender].push(
            SavingsGoal({
                user: msg.sender,
                goalName: _goalName,
                targetAmount: _targetAmount,
                currentAmount: 0,
                deadline: _deadline,
                isCompleted: false,
                createdAt: block.timestamp
            })
        );

        emit GoalCreated(msg.sender, _goalName, _targetAmount);
    }

    /**
     * Update goal progress
     */
    function updateGoalProgress(uint256 _goalIndex, uint256 _additionalAmount) external validAmount(_additionalAmount) {
        require(_goalIndex < userGoals[msg.sender].length, "Invalid goal index");

        SavingsGoal storage goal = userGoals[msg.sender][_goalIndex];
        require(!goal.isCompleted, "Goal already completed");

        goal.currentAmount += _additionalAmount;

        if (goal.currentAmount >= goal.targetAmount) {
            goal.isCompleted = true;
            emit GoalCompleted(msg.sender, goal.goalName);
        }

        emit GoalUpdated(msg.sender, goal.goalName, goal.currentAmount);
    }

    /**
     * Get user's total portfolio value
     */
    function getPortfolioValue(
        address _user
    )
        external
        view
        returns (uint256 totalSavings, uint256 totalInvestments, uint256 totalEmergency, uint256 totalValue)
    {
        totalSavings = userSavingsAccounts[_user].currentBalance;
        totalEmergency = userEmergencyVaults[_user].balance;

        // Calculate total investments (simplified to avoid stack too deep)
        InvestmentPosition[] memory investments = userInvestments[_user];
        for (uint256 i = 0; i < investments.length; i++) {
            if (investments[i].isActive) {
                totalInvestments += investments[i].amount;
            }
        }

        totalValue = totalSavings + totalInvestments + totalEmergency;
    }

    /**
     * Get platform statistics
     */
    function getPlatformStats()
        external
        view
        returns (
            uint256 _totalUsers,
            uint256 _totalDeposited,
            uint256 _totalInvested,
            uint256 _totalEmergencyFunds,
            uint256 _platformFeeRate
        )
    {
        return (totalUsers, totalDeposited, totalInvested, totalEmergencyFunds, platformFeeRate);
    }

    /**
     * Set platform fee rate (only owner)
     */
    function setPlatformFeeRate(uint256 _newRate) external onlyOwner {
        require(_newRate <= 1000, "Fee rate too high"); // Max 10%
        platformFeeRate = _newRate;
    }

    /**
     * Emergency function to pause platform (only owner)
     */
    function emergencyPause() external onlyOwner {
        // In production, implement pausable functionality
        // This would prevent new deposits/withdrawals
    }
}
