//SPDX-License-Identifier: MIT
pragma solidity >=0.8.0 <0.9.0;

/**
 * SAFEToken - Governance token for SafeNest platform
 * Enables premium features, governance, and fee sharing
 * @author SafeNest Team
 */
contract SAFEToken {
    // Token Details
    string public constant name = "SafeNest Token";
    string public constant symbol = "SAFE";
    uint8 public constant decimals = 18;
    uint256 public constant TOTAL_SUPPLY = 1_000_000_000 * 10 ** 18; // 1 billion tokens

    // Token Distribution
    uint256 public constant COMMUNITY_ALLOCATION = 400_000_000 * 10 ** 18; // 40%
    uint256 public constant TEAM_ALLOCATION = 150_000_000 * 10 ** 18; // 15%
    uint256 public constant TREASURY_ALLOCATION = 200_000_000 * 10 ** 18; // 20%
    uint256 public constant LIQUIDITY_ALLOCATION = 100_000_000 * 10 ** 18; // 10%
    uint256 public constant PARTNERS_ALLOCATION = 100_000_000 * 10 ** 18; // 10%
    uint256 public constant EARLY_ADOPTERS = 50_000_000 * 10 ** 18; // 5%

    // Staking Parameters
    uint256 public constant STAKING_REWARDS_POOL = 300_000_000 * 10 ** 18; // 30% for staking rewards
    uint256 public constant REWARDS_DURATION = 4 * 365 days; // 4 years
    uint256 public constant REWARDS_PER_SECOND = STAKING_REWARDS_POOL / REWARDS_DURATION;

    // Premium Feature Requirements
    uint256 public constant PREMIUM_VAULT_STAKE = 10000 * 10 ** 18; // 10k SAFE for premium vaults
    uint256 public constant PREMIUM_WITHDRAWAL_STAKE = 5000 * 10 ** 18; // 5k SAFE for instant withdrawal
    uint256 public constant PREMIUM_TRANSFER_STAKE = 2000 * 10 ** 18; // 2k SAFE for free transfers
    uint256 public constant PREMIUM_INSURANCE_STAKE = 15000 * 10 ** 18; // 15k SAFE for premium insurance

    // Governance Parameters
    uint256 public constant MIN_STAKE_FOR_VOTING = 1000 * 10 ** 18; // 1k SAFE minimum
    uint256 public constant VOTING_DURATION = 3 days;
    uint256 public constant EXECUTION_DELAY = 1 days;
    uint256 public constant QUORUM_THRESHOLD = 5; // 5% of total staked

    // Referral System
    uint256 public constant REFERRAL_BONUS_RATE = 100; // 1% of referred user's deposits
    uint256 public constant REFERRAL_DURATION = 365 days; // 1 year
    uint256 public constant MAX_REFERRAL_DEPTH = 3; // 3 levels deep

    // Community Rewards
    uint256 public constant COMMUNITY_REWARDS_POOL = 100_000_000 * 10 ** 18; // 100M for community rewards
    uint256 public constant EDUCATION_REWARD = 100 * 10 ** 18; // 100 SAFE per education module
    uint256 public constant POOL_CREATION_REWARD = 500 * 10 ** 18; // 500 SAFE for creating pools
    uint256 public constant ACTIVE_USER_REWARD = 50 * 10 ** 18; // 50 SAFE for active users

    // Protocol Fee Structure
    uint256 public constant MIN_PROTOCOL_FEE = 10; // 0.1% minimum
    uint256 public constant MAX_PROTOCOL_FEE = 30; // 0.3% maximum
    uint256 public constant DEFAULT_PROTOCOL_FEE = 20; // 0.2% default

    // Fee Distribution
    uint256 public constant STAKERS_FEE_SHARE = 60; // 60% to stakers
    uint256 public constant TREASURY_FEE_SHARE = 25; // 25% to treasury
    uint256 public constant BURN_FEE_SHARE = 15; // 15% burned (deflationary)

    // State Variables
    address public immutable owner;
    address public platformContract;

    mapping(address => uint256) public balanceOf;
    mapping(address => mapping(address => uint256)) public allowance;
    mapping(address => bool) public isMinter;

    // Staking
    struct Stake {
        uint256 amount;
        uint256 timestamp;
        uint256 lockPeriod;
        bool isActive;
    }

    mapping(address => Stake[]) public userStakes;
    mapping(address => uint256) public totalStaked;
    uint256 public totalStakedSupply = 0;

    // Governance
    struct Proposal {
        uint256 id;
        address proposer;
        string title;
        string description;
        uint256 startTime;
        uint256 endTime;
        uint256 forVotes;
        uint256 againstVotes;
        bool executed;
        mapping(address => bool) hasVoted;
    }

    mapping(uint256 => Proposal) public proposals;
    uint256 public nextProposalId = 1;

    // Referral System
    mapping(address => address) public referrers;
    mapping(address => uint256) public referralCount;
    mapping(address => uint256) public totalReferralRewards;

    // Community Rewards
    mapping(address => uint256) public educationScore;
    mapping(address => uint256) public communityRewards;
    mapping(address => bool) public hasCreatedPool;
    mapping(address => uint256) public lastActiveTime;

    // Events
    event Transfer(address indexed from, address indexed to, uint256 value);
    event Approval(address indexed owner, address indexed spender, uint256 value);
    event Staked(address indexed user, uint256 amount, uint256 lockPeriod);
    event Unstaked(address indexed user, uint256 amount);
    event ProposalCreated(uint256 indexed proposalId, address indexed proposer, string title);
    event VoteCast(uint256 indexed proposalId, address indexed voter, bool support, uint256 votes);
    event ProposalExecuted(uint256 indexed proposalId);
    event ReferralRewardPaid(address indexed referrer, address indexed referee, uint256 amount);
    event CommunityRewardEarned(address indexed user, string rewardType, uint256 amount);
    event PremiumFeatureUnlocked(address indexed user, string feature, uint256 stakeAmount);
    event ProtocolFeeUpdated(uint256 oldFee, uint256 newFee);
    event FeeDistributed(uint256 stakersAmount, uint256 treasuryAmount, uint256 burnAmount);

    // Modifiers
    modifier onlyOwner() {
        require(msg.sender == owner, "Not the owner");
        _;
    }

    modifier onlyMinter() {
        require(isMinter[msg.sender] || msg.sender == owner, "Not a minter");
        _;
    }

    modifier validAddress(address _addr) {
        require(_addr != address(0), "Invalid address");
        _;
    }

    // Constructor
    constructor() {
        owner = msg.sender;
        balanceOf[owner] = TOTAL_SUPPLY;
        emit Transfer(address(0), owner, TOTAL_SUPPLY);
    }

    // ERC20 Functions
    function transfer(address _to, uint256 _value) external returns (bool) {
        require(_to != address(0), "Transfer to zero address");
        require(balanceOf[msg.sender] >= _value, "Insufficient balance");

        balanceOf[msg.sender] -= _value;
        balanceOf[_to] += _value;

        emit Transfer(msg.sender, _to, _value);
        return true;
    }

    function approve(address _spender, uint256 _value) external returns (bool) {
        allowance[msg.sender][_spender] = _value;
        emit Approval(msg.sender, _spender, _value);
        return true;
    }

    function transferFrom(address _from, address _to, uint256 _value) external returns (bool) {
        require(_to != address(0), "Transfer to zero address");
        require(balanceOf[_from] >= _value, "Insufficient balance");
        require(allowance[_from][msg.sender] >= _value, "Insufficient allowance");

        balanceOf[_from] -= _value;
        balanceOf[_to] += _value;
        allowance[_from][msg.sender] -= _value;

        emit Transfer(_from, _to, _value);
        return true;
    }

    // Staking Functions
    function stake(uint256 _amount, uint256 _lockPeriod) external {
        require(balanceOf[msg.sender] >= _amount, "Insufficient balance");
        require(_lockPeriod >= 30 days, "Minimum lock period is 30 days");
        require(_lockPeriod <= 365 days, "Maximum lock period is 1 year");

        balanceOf[msg.sender] -= _amount;
        totalStaked[msg.sender] += _amount;
        totalStakedSupply += _amount;

        userStakes[msg.sender].push(
            Stake({ amount: _amount, timestamp: block.timestamp, lockPeriod: _lockPeriod, isActive: true })
        );

        emit Staked(msg.sender, _amount, _lockPeriod);
    }

    function unstake(uint256 _stakeIndex) external {
        require(_stakeIndex < userStakes[msg.sender].length, "Invalid stake index");

        Stake storage userStake = userStakes[msg.sender][_stakeIndex];
        require(userStake.isActive, "Stake not active");
        require(block.timestamp >= userStake.timestamp + userStake.lockPeriod, "Stake still locked");

        userStake.isActive = false;
        totalStaked[msg.sender] -= userStake.amount;
        totalStakedSupply -= userStake.amount;
        balanceOf[msg.sender] += userStake.amount;

        emit Unstaked(msg.sender, userStake.amount);
    }

    // Governance Functions
    function createProposal(string memory _title, string memory _description) external {
        require(totalStaked[msg.sender] >= MIN_STAKE_FOR_VOTING, "Insufficient stake for proposal");

        Proposal storage proposal = proposals[nextProposalId];
        proposal.id = nextProposalId;
        proposal.proposer = msg.sender;
        proposal.title = _title;
        proposal.description = _description;
        proposal.startTime = block.timestamp;
        proposal.endTime = block.timestamp + VOTING_DURATION;
        proposal.forVotes = 0;
        proposal.againstVotes = 0;
        proposal.executed = false;

        emit ProposalCreated(nextProposalId, msg.sender, _title);
        nextProposalId++;
    }

    function vote(uint256 _proposalId, bool _support) external {
        require(_proposalId < nextProposalId, "Invalid proposal");
        Proposal storage proposal = proposals[_proposalId];
        require(block.timestamp >= proposal.startTime, "Voting not started");
        require(block.timestamp <= proposal.endTime, "Voting ended");
        require(!proposal.hasVoted[msg.sender], "Already voted");
        require(totalStaked[msg.sender] > 0, "No stake to vote");

        proposal.hasVoted[msg.sender] = true;
        uint256 votes = totalStaked[msg.sender];

        if (_support) {
            proposal.forVotes += votes;
        } else {
            proposal.againstVotes += votes;
        }

        emit VoteCast(_proposalId, msg.sender, _support, votes);
    }

    function executeProposal(uint256 _proposalId) external {
        require(_proposalId < nextProposalId, "Invalid proposal");
        Proposal storage proposal = proposals[_proposalId];
        require(block.timestamp > proposal.endTime, "Voting not ended");
        require(!proposal.executed, "Already executed");
        require(proposal.forVotes > proposal.againstVotes, "Proposal rejected");
        require(proposal.forVotes >= (totalStakedSupply * QUORUM_THRESHOLD) / 100, "Quorum not met");

        proposal.executed = true;
        emit ProposalExecuted(_proposalId);
    }

    // Referral System
    function setReferrer(address _referrer) external {
        require(_referrer != address(0), "Invalid referrer");
        require(_referrer != msg.sender, "Cannot refer yourself");
        require(referrers[msg.sender] == address(0), "Referrer already set");

        referrers[msg.sender] = _referrer;
        referralCount[_referrer]++;
    }

    function payReferralReward(address _referee, uint256 _depositAmount) external onlyMinter {
        address referrer = referrers[_referee];
        if (referrer != address(0)) {
            uint256 reward = (_depositAmount * REFERRAL_BONUS_RATE) / 10000;
            totalReferralRewards[referrer] += reward;
            balanceOf[referrer] += reward;

            emit ReferralRewardPaid(referrer, _referee, reward);
        }
    }

    // Community Rewards
    function earnEducationReward(address _user) external onlyMinter {
        educationScore[_user] += 100;
        communityRewards[_user] += EDUCATION_REWARD;
        balanceOf[_user] += EDUCATION_REWARD;

        emit CommunityRewardEarned(_user, "Education", EDUCATION_REWARD);
    }

    function earnPoolCreationReward(address _user) external onlyMinter {
        if (!hasCreatedPool[_user]) {
            hasCreatedPool[_user] = true;
            communityRewards[_user] += POOL_CREATION_REWARD;
            balanceOf[_user] += POOL_CREATION_REWARD;

            emit CommunityRewardEarned(_user, "Pool Creation", POOL_CREATION_REWARD);
        }
    }

    function earnActiveUserReward(address _user) external onlyMinter {
        if (block.timestamp - lastActiveTime[_user] >= 7 days) {
            lastActiveTime[_user] = block.timestamp;
            communityRewards[_user] += ACTIVE_USER_REWARD;
            balanceOf[_user] += ACTIVE_USER_REWARD;

            emit CommunityRewardEarned(_user, "Active User", ACTIVE_USER_REWARD);
        }
    }

    // Premium Features
    function checkPremiumVaultAccess(address _user) external view returns (bool) {
        return totalStaked[_user] >= PREMIUM_VAULT_STAKE;
    }

    function checkPremiumWithdrawalAccess(address _user) external view returns (bool) {
        return totalStaked[_user] >= PREMIUM_WITHDRAWAL_STAKE;
    }

    function checkPremiumTransferAccess(address _user) external view returns (bool) {
        return totalStaked[_user] >= PREMIUM_TRANSFER_STAKE;
    }

    function checkPremiumInsuranceAccess(address _user) external view returns (bool) {
        return totalStaked[_user] >= PREMIUM_INSURANCE_STAKE;
    }

    // Admin Functions
    function setPlatformContract(address _platformContract) external onlyOwner {
        platformContract = _platformContract;
        isMinter[_platformContract] = true;
    }

    function setMinter(address _minter, bool _status) external onlyOwner {
        isMinter[_minter] = _status;
    }

    function mint(address _to, uint256 _amount) external onlyMinter {
        balanceOf[_to] += _amount;
        emit Transfer(address(0), _to, _amount);
    }

    // View Functions
    function getStakingInfo(
        address _user
    ) external view returns (uint256 totalStakedAmount, uint256 activeStakes, uint256 totalRewards) {
        return (totalStaked[_user], userStakes[_user].length, communityRewards[_user]);
    }

    function getGovernanceInfo()
        external
        view
        returns (uint256 totalStakedSupplyValue, uint256 minStakeForVoting, uint256 quorumThreshold)
    {
        return (totalStakedSupply, MIN_STAKE_FOR_VOTING, QUORUM_THRESHOLD);
    }

    function getReferralInfo(
        address _user
    ) external view returns (address referrer, uint256 userReferralCount, uint256 totalRewards) {
        return (referrers[_user], referralCount[_user], totalReferralRewards[_user]);
    }
}
