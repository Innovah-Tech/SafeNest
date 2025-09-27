//SPDX-License-Identifier: MIT
pragma solidity >=0.8.0 <0.9.0;

// import "hardhat/console.sol";

/**
 * SimpleMicroSavings - Simplified mobile-first DeFi savings platform
 * @author SafeNest Team
 */
contract SimpleMicroSavings {
    // State Variables
    address public immutable owner;
    string public platformName = "SimpleMicroSavings - Mobile DeFi Platform";
    
    // User savings accounts
    struct SavingsAccount {
        address user;
        uint256 totalDeposited;
        uint256 totalWithdrawn;
        uint256 currentBalance;
        uint256 lastDepositTime;
        bool isActive;
    }
    
    // Investment strategies
    struct InvestmentStrategy {
        string name;
        uint256 apy; // Annual percentage yield in basis points
        bool isActive;
        uint256 minDeposit;
        uint256 maxDeposit;
    }
    
    // User investment positions
    struct InvestmentPosition {
        address user;
        uint256 strategyId;
        uint256 amount;
        uint256 entryTime;
        bool isActive;
    }
    
    // Emergency fund vault
    struct EmergencyVault {
        address user;
        uint256 balance;
        uint256 lastDepositTime;
        bool isActive;
    }
    
    // Mappings
    mapping(address => SavingsAccount) public userSavingsAccounts;
    mapping(uint256 => InvestmentStrategy) public investmentStrategies;
    mapping(address => InvestmentPosition[]) public userInvestments;
    mapping(address => EmergencyVault) public userEmergencyVaults;
    
    // Platform statistics
    uint256 public totalUsers = 0;
    uint256 public totalDeposited = 0;
    uint256 public totalInvested = 0;
    uint256 public totalEmergencyFunds = 0;
    uint256 public platformFeeRate = 30; // 0.3% in basis points
    uint256 public nextStrategyId = 1;
    
    // Events
    event DepositMade(address indexed user, uint256 amount);
    event WithdrawalMade(address indexed user, uint256 amount);
    event InvestmentMade(address indexed user, uint256 strategyId, uint256 amount);
    event EmergencyDeposit(address indexed user, uint256 amount);
    event EmergencyWithdrawal(address indexed user, uint256 amount);
    
    // Modifiers
    modifier onlyOwner() {
        require(msg.sender == owner, "Not the owner");
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
     * Add investment strategy
     */
    function addInvestmentStrategy(
        string memory _name,
        uint256 _apy,
        uint256 _minDeposit,
        uint256 _maxDeposit
    ) external onlyOwner {
        investmentStrategies[nextStrategyId] = InvestmentStrategy({
            name: _name,
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
    function depositSavings(uint256 _amount) external validAmount(_amount) payable {
        require(msg.value >= _amount, "Insufficient ETH sent");
        
        // Update user savings account
        if (!userSavingsAccounts[msg.sender].isActive) {
            userSavingsAccounts[msg.sender] = SavingsAccount({
                user: msg.sender,
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
        
        totalDeposited += _amount;
        
        emit DepositMade(msg.sender, _amount);
    }
    
    /**
     * Withdraw from savings
     */
    function withdrawSavings(uint256 _amount) external validAmount(_amount) {
        require(
            userSavingsAccounts[msg.sender].currentBalance >= _amount,
            "Insufficient balance"
        );
        
        userSavingsAccounts[msg.sender].totalWithdrawn += _amount;
        userSavingsAccounts[msg.sender].currentBalance -= _amount;
        
        totalDeposited -= _amount;
        
        // Transfer ETH to user
        (bool success, ) = msg.sender.call{value: _amount}("");
        require(success, "Transfer failed");
        
        emit WithdrawalMade(msg.sender, _amount);
    }
    
    /**
     * Invest in DeFi strategy
     */
    function investInStrategy(
        uint256 _strategyId,
        uint256 _amount
    ) external validAmount(_amount) payable {
        InvestmentStrategy storage strategy = investmentStrategies[_strategyId];
        require(strategy.isActive, "Strategy not active");
        require(_amount >= strategy.minDeposit, "Amount below minimum");
        require(_amount <= strategy.maxDeposit, "Amount above maximum");
        require(msg.value >= _amount, "Insufficient ETH sent");
        
        userInvestments[msg.sender].push(InvestmentPosition({
            user: msg.sender,
            strategyId: _strategyId,
            amount: _amount,
            entryTime: block.timestamp,
            isActive: true
        }));
        
        totalInvested += _amount;
        
        emit InvestmentMade(msg.sender, _strategyId, _amount);
    }
    
    /**
     * Deposit to emergency vault
     */
    function depositEmergencyFund(uint256 _amount) external validAmount(_amount) payable {
        require(msg.value >= _amount, "Insufficient ETH sent");
        
        if (!userEmergencyVaults[msg.sender].isActive) {
            userEmergencyVaults[msg.sender] = EmergencyVault({
                user: msg.sender,
                balance: 0,
                lastDepositTime: 0,
                isActive: true
            });
        }
        
        userEmergencyVaults[msg.sender].balance += _amount;
        userEmergencyVaults[msg.sender].lastDepositTime = block.timestamp;
        
        totalEmergencyFunds += _amount;
        
        emit EmergencyDeposit(msg.sender, _amount);
    }
    
    /**
     * Withdraw from emergency vault (instant)
     */
    function withdrawEmergencyFund(uint256 _amount) external validAmount(_amount) {
        require(userEmergencyVaults[msg.sender].isActive, "No emergency vault");
        require(
            userEmergencyVaults[msg.sender].balance >= _amount,
            "Insufficient emergency balance"
        );
        
        userEmergencyVaults[msg.sender].balance -= _amount;
        
        totalEmergencyFunds -= _amount;
        
        // Transfer ETH to user
        (bool success, ) = msg.sender.call{value: _amount}("");
        require(success, "Transfer failed");
        
        emit EmergencyWithdrawal(msg.sender, _amount);
    }
    
    /**
     * Get user's total portfolio value
     */
    function getPortfolioValue(address _user) external view returns (
        uint256 totalSavings,
        uint256 totalInvestments,
        uint256 totalEmergency,
        uint256 totalValue
    ) {
        totalSavings = userSavingsAccounts[_user].currentBalance;
        totalEmergency = userEmergencyVaults[_user].balance;
        
        // Calculate total investments
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
    function getPlatformStats() external view returns (
        uint256 _totalUsers,
        uint256 _totalDeposited,
        uint256 _totalInvested,
        uint256 _totalEmergencyFunds,
        uint256 _platformFeeRate
    ) {
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
     * Withdraw platform fees (only owner)
     */
    function withdrawFees() external onlyOwner {
        uint256 balance = address(this).balance;
        require(balance > 0, "No fees to withdraw");
        
        (bool success, ) = owner.call{value: balance}("");
        require(success, "Failed to withdraw fees");
    }
    
    receive() external payable {}
}
