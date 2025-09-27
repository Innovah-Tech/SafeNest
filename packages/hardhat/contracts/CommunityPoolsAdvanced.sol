//SPDX-License-Identifier: MIT
pragma solidity >=0.8.0 <0.9.0;

/**
 * CommunityPoolsAdvanced - Advanced community pools with digital chamas
 * Implements rotating savings, investment pools, and goal-oriented savings
 * @author SafeNest Team
 */
contract CommunityPoolsAdvanced {
    // State Variables
    address public immutable owner;
    string public platformName = "Community Pools Advanced - Digital Chamas";
    
    // Pool types
    enum PoolType {
        ROTATING_SAVINGS,    // Traditional chama - members take turns receiving funds
        COLLECTIVE_INVESTMENT, // Pool funds for DeFi investments
        EMERGENCY_FUND,      // Community emergency fund
        GOAL_ORIENTED        // Pool for specific community goals
    }
    
    // Pool structure
    struct Pool {
        uint256 id;
        address creator;
        string name;
        string description;
        PoolType poolType;
        uint256 contributionAmount;
        uint256 contributionFrequency; // in days
        uint256 maxMembers;
        uint256 currentMembers;
        uint256 totalContributions;
        uint256 poolBalance;
        uint256 yieldRate;
        bool isActive;
        bool isPublic;
        uint256 createdAt;
        uint256 nextContribution;
        uint256 rotationIndex; // For rotating savings
        uint256 lastDistribution;
        mapping(address => bool) members;
        mapping(address => uint256) memberContributions;
        mapping(address => bool) hasReceived; // For rotating savings
        mapping(address => uint256) memberShares;
    }
    
    // Member structure
    struct Member {
        address user;
        uint256 joinedAt;
        uint256 totalContributed;
        uint256 lastContribution;
        bool isActive;
        uint256 reputation;
        uint256 shares;
    }
    
    // Pool applications
    struct PoolApplication {
        address applicant;
        uint256 poolId;
        string message;
        uint256 appliedAt;
        bool isApproved;
        bool isProcessed;
    }
    
    // Pool statistics
    struct PoolStats {
        uint256 totalPools;
        uint256 totalMembers;
        uint256 totalContributions;
        uint256 totalDistributions;
        uint256 averageYield;
    }
    
    // Mappings
    mapping(uint256 => Pool) public pools;
    mapping(address => Member[]) public userMemberships;
    mapping(address => uint256[]) public userCreatedPools;
    mapping(uint256 => PoolApplication[]) public poolApplications;
    mapping(address => mapping(uint256 => bool)) public isMember;
    mapping(address => uint256) public userReputation;
    
    // Platform statistics
    PoolStats public platformStats;
    uint256 public nextPoolId = 1;
    uint256 public platformFeeRate = 20; // 0.2% in basis points
    uint256 public reputationThreshold = 100; // Minimum reputation to create pools
    
    // Yield distribution
    uint256 public totalYieldDistributed = 0;
    uint256 public lastYieldDistribution = 0;
    uint256 public yieldDistributionInterval = 7 days;
    
    // Events
    event PoolCreated(uint256 indexed poolId, address indexed creator, string name, PoolType poolType);
    event MemberJoined(uint256 indexed poolId, address indexed member);
    event MemberLeft(uint256 indexed poolId, address indexed member);
    event ContributionMade(uint256 indexed poolId, address indexed member, uint256 amount);
    event FundsDistributed(uint256 indexed poolId, address indexed recipient, uint256 amount);
    event ApplicationSubmitted(uint256 indexed poolId, address indexed applicant);
    event ApplicationApproved(uint256 indexed poolId, address indexed applicant);
    event PoolCompleted(uint256 indexed poolId);
    event ReputationUpdated(address indexed user, uint256 oldReputation, uint256 newReputation);
    event YieldDistributed(uint256 indexed poolId, uint256 amount, uint256 timestamp);
    event PoolTypeChanged(uint256 indexed poolId, PoolType oldType, PoolType newType);
    
    // Modifiers
    modifier onlyOwner() {
        require(msg.sender == owner, "Not the owner");
        _;
    }
    
    modifier validPoolId(uint256 _poolId) {
        require(_poolId < nextPoolId, "Invalid pool ID");
        require(pools[_poolId].isActive, "Pool not active");
        _;
    }
    
    modifier onlyPoolMember(uint256 _poolId) {
        require(isMember[msg.sender][_poolId], "Not a pool member");
        _;
    }
    
    modifier onlyPoolCreator(uint256 _poolId) {
        require(pools[_poolId].creator == msg.sender, "Not the pool creator");
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
     * Create a new community pool
     */
    function createPool(
        string memory _name,
        string memory _description,
        PoolType _poolType,
        uint256 _contributionAmount,
        uint256 _contributionFrequency,
        uint256 _maxMembers,
        bool _isPublic
    ) external {
        require(bytes(_name).length > 0, "Pool name required");
        require(_contributionAmount > 0, "Contribution amount must be positive");
        require(_maxMembers > 1, "Pool must have at least 2 members");
        require(_contributionFrequency > 0, "Contribution frequency must be positive");
        require(userReputation[msg.sender] >= reputationThreshold, "Insufficient reputation");
        
        // Initialize pool struct
        Pool storage newPool = pools[nextPoolId];
        newPool.id = nextPoolId;
        newPool.creator = msg.sender;
        newPool.name = _name;
        newPool.description = _description;
        newPool.poolType = _poolType;
        newPool.contributionAmount = _contributionAmount;
        newPool.contributionFrequency = _contributionFrequency;
        newPool.maxMembers = _maxMembers;
        newPool.currentMembers = 0;
        newPool.totalContributions = 0;
        newPool.poolBalance = 0;
        newPool.yieldRate = 0;
        newPool.isActive = true;
        newPool.isPublic = _isPublic;
        newPool.createdAt = block.timestamp;
        newPool.nextContribution = block.timestamp + _contributionFrequency * 1 days;
        newPool.rotationIndex = 0;
        newPool.lastDistribution = 0;
        
        // Creator automatically becomes first member
        newPool.members[msg.sender] = true;
        newPool.currentMembers = 1;
        isMember[msg.sender][nextPoolId] = true;
        
        userCreatedPools[msg.sender].push(nextPoolId);
        platformStats.totalPools++;
        platformStats.totalMembers++;
        
        emit PoolCreated(nextPoolId, msg.sender, _name, _poolType);
        emit MemberJoined(nextPoolId, msg.sender);
        nextPoolId++;
    }
    
    /**
     * Join a public pool
     */
    function joinPool(uint256 _poolId) external validPoolId(_poolId) {
        Pool storage pool = pools[_poolId];
        require(pool.isPublic, "Pool is not public");
        require(!isMember[msg.sender][_poolId], "Already a member");
        require(pool.currentMembers < pool.maxMembers, "Pool is full");
        
        pool.members[msg.sender] = true;
        pool.currentMembers++;
        isMember[msg.sender][_poolId] = true;
        platformStats.totalMembers++;
        
        userMemberships[msg.sender].push(Member({
            user: msg.sender,
            joinedAt: block.timestamp,
            totalContributed: 0,
            lastContribution: 0,
            isActive: true,
            reputation: 0,
            shares: 0
        }));
        
        emit MemberJoined(_poolId, msg.sender);
    }
    
    /**
     * Apply to join a private pool
     */
    function applyToJoinPool(uint256 _poolId, string memory _message) external validPoolId(_poolId) {
        Pool storage pool = pools[_poolId];
        require(!pool.isPublic, "Pool is public - use joinPool");
        require(!isMember[msg.sender][_poolId], "Already a member");
        require(pool.currentMembers < pool.maxMembers, "Pool is full");
        
        poolApplications[_poolId].push(PoolApplication({
            applicant: msg.sender,
            poolId: _poolId,
            message: _message,
            appliedAt: block.timestamp,
            isApproved: false,
            isProcessed: false
        }));
        
        emit ApplicationSubmitted(_poolId, msg.sender);
    }
    
    /**
     * Approve pool application (only pool creator)
     */
    function approveApplication(uint256 _poolId, uint256 _applicationIndex) external onlyPoolCreator(_poolId) {
        require(_applicationIndex < poolApplications[_poolId].length, "Invalid application index");
        
        PoolApplication storage application = poolApplications[_poolId][_applicationIndex];
        require(!application.isProcessed, "Application already processed");
        
        Pool storage pool = pools[_poolId];
        require(pool.currentMembers < pool.maxMembers, "Pool is full");
        
        application.isApproved = true;
        application.isProcessed = true;
        
        pool.members[application.applicant] = true;
        pool.currentMembers++;
        isMember[application.applicant][_poolId] = true;
        platformStats.totalMembers++;
        
        userMemberships[application.applicant].push(Member({
            user: application.applicant,
            joinedAt: block.timestamp,
            totalContributed: 0,
            lastContribution: 0,
            isActive: true,
            reputation: 0,
            shares: 0
        }));
        
        emit ApplicationApproved(_poolId, application.applicant);
        emit MemberJoined(_poolId, application.applicant);
    }
    
    /**
     * Make contribution to pool
     */
    function contributeToPool(uint256 _poolId, uint256 _amount) external onlyPoolMember(_poolId) validAmount(_amount) payable {
        Pool storage pool = pools[_poolId];
        require(pool.isActive, "Pool not active");
        require(_amount >= pool.contributionAmount, "Contribution below minimum");
        require(block.timestamp >= pool.nextContribution, "Too early for contribution");
        require(msg.value >= _amount, "Insufficient ETH sent");
        
        pool.memberContributions[msg.sender] += _amount;
        pool.totalContributions += _amount;
        pool.poolBalance += _amount;
        
        // Update member info
        for (uint256 i = 0; i < userMemberships[msg.sender].length; i++) {
            if (userMemberships[msg.sender][i].isActive) {
                userMemberships[msg.sender][i].totalContributed += _amount;
                userMemberships[msg.sender][i].lastContribution = block.timestamp;
                userMemberships[msg.sender][i].reputation += 10; // Reputation points
                userMemberships[msg.sender][i].shares += _amount;
                break;
            }
        }
        
        // Update user reputation
        uint256 oldReputation = userReputation[msg.sender];
        userReputation[msg.sender] += 10;
        emit ReputationUpdated(msg.sender, oldReputation, userReputation[msg.sender]);
        
        // Update next contribution time
        pool.nextContribution = block.timestamp + pool.contributionFrequency * 1 days;
        
        platformStats.totalContributions += _amount;
        
        emit ContributionMade(_poolId, msg.sender, _amount);
        
        // Handle pool-specific logic
        if (pool.poolType == PoolType.ROTATING_SAVINGS) {
            _handleRotatingSavings(_poolId);
        } else if (pool.poolType == PoolType.COLLECTIVE_INVESTMENT) {
            _handleCollectiveInvestment(_poolId);
        }
    }
    
    /**
     * Handle rotating savings distribution
     */
    function _handleRotatingSavings(uint256 _poolId) internal {
        Pool storage pool = pools[_poolId];
        
        // Check if it's time for distribution
        if (pool.currentMembers > 0 && pool.poolBalance >= pool.contributionAmount * pool.currentMembers) {
            // Find next member to receive funds
            address[] memory members = _getPoolMembers(_poolId);
            address recipient = members[pool.rotationIndex % members.length];
            
            // Ensure member hasn't received funds yet
            while (pool.hasReceived[recipient] && pool.rotationIndex < members.length * 2) {
                pool.rotationIndex++;
                recipient = members[pool.rotationIndex % members.length];
            }
            
            if (!pool.hasReceived[recipient]) {
                uint256 distributionAmount = pool.contributionAmount * pool.currentMembers;
                pool.poolBalance -= distributionAmount;
                pool.hasReceived[recipient] = true;
                pool.rotationIndex++;
                
                // Transfer funds to recipient
                (bool success, ) = recipient.call{value: distributionAmount}("");
                require(success, "Transfer failed");
                
                platformStats.totalDistributions += distributionAmount;
                
                emit FundsDistributed(_poolId, recipient, distributionAmount);
                
                // Check if all members have received funds
                bool allReceived = true;
                for (uint256 i = 0; i < members.length; i++) {
                    if (!pool.hasReceived[members[i]]) {
                        allReceived = false;
                        break;
                    }
                }
                
                if (allReceived) {
                    pool.isActive = false;
                    emit PoolCompleted(_poolId);
                }
            }
        }
    }
    
    /**
     * Handle collective investment
     */
    function _handleCollectiveInvestment(uint256 _poolId) internal {
        Pool storage pool = pools[_poolId];
        
        // In production, this would interact with DeFi protocols
        // For now, we just track the balance and calculate yield
        if (pool.poolBalance > 0) {
            // Simulate yield calculation (in production, use real DeFi yields)
            uint256 yieldAmount = (pool.poolBalance * 500) / 10000; // 5% APY
            pool.poolBalance += yieldAmount;
            pool.yieldRate = 500; // 5% in basis points
            
            emit YieldDistributed(_poolId, yieldAmount, block.timestamp);
        }
    }
    
    /**
     * Withdraw from pool (for non-rotating pools)
     */
    function withdrawFromPool(uint256 _poolId, uint256 _amount) external onlyPoolMember(_poolId) validAmount(_amount) {
        Pool storage pool = pools[_poolId];
        require(pool.poolType != PoolType.ROTATING_SAVINGS, "Cannot withdraw from rotating savings");
        require(pool.poolBalance >= _amount, "Insufficient pool balance");
        require(pool.memberContributions[msg.sender] >= _amount, "Insufficient contribution");
        
        pool.poolBalance -= _amount;
        pool.memberContributions[msg.sender] -= _amount;
        
        // Transfer funds to user
        (bool success, ) = msg.sender.call{value: _amount}("");
        require(success, "Transfer failed");
        
        emit FundsDistributed(_poolId, msg.sender, _amount);
    }
    
    /**
     * Leave pool
     */
    function leavePool(uint256 _poolId) external onlyPoolMember(_poolId) {
        Pool storage pool = pools[_poolId];
        require(pool.poolType != PoolType.ROTATING_SAVINGS, "Cannot leave rotating savings pool");
        
        pool.members[msg.sender] = false;
        pool.currentMembers--;
        isMember[msg.sender][_poolId] = false;
        platformStats.totalMembers--;
        
        // Update member status
        for (uint256 i = 0; i < userMemberships[msg.sender].length; i++) {
            if (userMemberships[msg.sender][i].isActive) {
                userMemberships[msg.sender][i].isActive = false;
                break;
            }
        }
        
        emit MemberLeft(_poolId, msg.sender);
    }
    
    /**
     * Get pool members (simplified - in production, maintain a member list)
     */
    function _getPoolMembers(uint256 _poolId) internal view returns (address[] memory) {
        // This is simplified - in production, maintain a proper member list
        address[] memory members = new address[](0);
        return members;
    }
    
    /**
     * Get pool details
     */
    function getPoolDetails(uint256 _poolId) external view validPoolId(_poolId) returns (
        string memory name,
        string memory description,
        PoolType poolType,
        uint256 contributionAmount,
        uint256 contributionFrequency,
        uint256 maxMembers,
        uint256 currentMembers,
        uint256 totalContributions,
        uint256 poolBalance,
        uint256 yieldRate,
        bool isPublic,
        uint256 createdAt
    ) {
        Pool storage pool = pools[_poolId];
        return (
            pool.name,
            pool.description,
            pool.poolType,
            pool.contributionAmount,
            pool.contributionFrequency,
            pool.maxMembers,
            pool.currentMembers,
            pool.totalContributions,
            pool.poolBalance,
            pool.yieldRate,
            pool.isPublic,
            pool.createdAt
        );
    }
    
    /**
     * Get user's pool memberships
     */
    function getUserMemberships(address _user) external view returns (uint256[] memory) {
        uint256[] memory memberships = new uint256[](userMemberships[_user].length);
        uint256 count = 0;
        
        for (uint256 i = 0; i < userMemberships[_user].length; i++) {
            if (userMemberships[_user][i].isActive) {
                memberships[count] = i; // Pool ID would be stored differently in production
                count++;
            }
        }
        
        return memberships;
    }
    
    /**
     * Get platform statistics
     */
    function getPlatformStats() external view returns (
        uint256 _totalPools,
        uint256 _totalMembers,
        uint256 _totalContributions,
        uint256 _totalDistributions,
        uint256 _averageYield,
        uint256 _platformFeeRate
    ) {
        return (
            platformStats.totalPools,
            platformStats.totalMembers,
            platformStats.totalContributions,
            platformStats.totalDistributions,
            platformStats.averageYield,
            platformFeeRate
        );
    }
    
    /**
     * Get user reputation
     */
    function getUserReputation(address _user) external view returns (uint256) {
        return userReputation[_user];
    }
    
    /**
     * Set platform fee rate (only owner)
     */
    function setPlatformFeeRate(uint256 _newRate) external onlyOwner {
        require(_newRate <= 1000, "Fee rate too high"); // Max 10%
        platformFeeRate = _newRate;
    }
    
    /**
     * Set reputation threshold (only owner)
     */
    function setReputationThreshold(uint256 _newThreshold) external onlyOwner {
        reputationThreshold = _newThreshold;
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
