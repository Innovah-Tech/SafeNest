//SPDX-License-Identifier: MIT
pragma solidity >=0.8.0 <0.9.0;

// import "hardhat/console.sol";

/**
 * INCL Token - Governance token for MicroSavings platform
 * Enables community governance and fee sharing
 * @author SafeNest Team
 */
contract INCLToken {
    // Token details
    string public name = "Inclusive Finance Token";
    string public symbol = "INCL";
    uint8 public decimals = 18;
    uint256 public totalSupply;

    // Owner and platform
    address public immutable owner;
    address public platformContract;

    // Balances and allowances
    mapping(address => uint256) public balanceOf;
    mapping(address => mapping(address => uint256)) public allowance;

    // Staking for governance
    struct Stake {
        uint256 amount;
        uint256 timestamp;
        uint256 lockPeriod;
        bool isActive;
    }

    mapping(address => Stake[]) public userStakes;
    mapping(address => uint256) public totalStaked;

    // Governance
    struct Proposal {
        uint256 id;
        address proposer;
        string title;
        string description;
        uint256 forVotes;
        uint256 againstVotes;
        uint256 startTime;
        uint256 endTime;
        bool executed;
        bool isActive;
    }

    mapping(uint256 => Proposal) public proposals;
    mapping(address => mapping(uint256 => bool)) public hasVoted;
    uint256 public nextProposalId = 1;
    uint256 public votingPowerThreshold = 1000 * 10 ** 18; // 1000 INCL tokens
    uint256 public proposalDuration = 3 days;

    // Fee sharing
    uint256 public totalFeesCollected = 0;
    mapping(address => uint256) public userFeeShare;
    uint256 public lastFeeDistribution = 0;
    uint256 public feeDistributionInterval = 7 days;

    // Events
    event Transfer(address indexed from, address indexed to, uint256 value);
    event Approval(address indexed owner, address indexed spender, uint256 value);
    event TokensMinted(address indexed to, uint256 amount);
    event TokensBurned(address indexed from, uint256 amount);
    event Staked(address indexed user, uint256 amount, uint256 lockPeriod);
    event Unstaked(address indexed user, uint256 amount);
    event ProposalCreated(uint256 indexed proposalId, address indexed proposer, string title);
    event VoteCast(address indexed voter, uint256 indexed proposalId, bool support, uint256 votes);
    event ProposalExecuted(uint256 indexed proposalId);
    event FeeDistributed(address indexed user, uint256 amount);

    // Modifiers
    modifier onlyOwner() {
        require(msg.sender == owner, "Not the owner");
        _;
    }

    modifier onlyPlatform() {
        require(msg.sender == platformContract, "Not the platform contract");
        _;
    }

    modifier validAmount(uint256 _amount) {
        require(_amount > 0, "Amount must be greater than 0");
        _;
    }

    // Constructor
    constructor() {
        owner = msg.sender;
        totalSupply = 1000000000 * 10 ** 18; // 1 billion tokens
        balanceOf[msg.sender] = totalSupply;
        emit Transfer(address(0), msg.sender, totalSupply);
    }

    /**
     * Set platform contract address
     */
    function setPlatformContract(address _platform) external onlyOwner {
        platformContract = _platform;
    }

    /**
     * Transfer tokens
     */
    function transfer(address _to, uint256 _value) external returns (bool) {
        require(balanceOf[msg.sender] >= _value, "Insufficient balance");
        require(_to != address(0), "Invalid recipient");

        balanceOf[msg.sender] -= _value;
        balanceOf[_to] += _value;

        emit Transfer(msg.sender, _to, _value);
        return true;
    }

    /**
     * Approve spender
     */
    function approve(address _spender, uint256 _value) external returns (bool) {
        allowance[msg.sender][_spender] = _value;
        emit Approval(msg.sender, _spender, _value);
        return true;
    }

    /**
     * Transfer from (for allowances)
     */
    function transferFrom(address _from, address _to, uint256 _value) external returns (bool) {
        require(balanceOf[_from] >= _value, "Insufficient balance");
        require(allowance[_from][msg.sender] >= _value, "Insufficient allowance");
        require(_to != address(0), "Invalid recipient");

        balanceOf[_from] -= _value;
        balanceOf[_to] += _value;
        allowance[_from][msg.sender] -= _value;

        emit Transfer(_from, _to, _value);
        return true;
    }

    /**
     * Mint tokens (only platform can mint as rewards)
     */
    function mint(address _to, uint256 _amount) external onlyPlatform validAmount(_amount) {
        totalSupply += _amount;
        balanceOf[_to] += _amount;
        emit TokensMinted(_to, _amount);
        emit Transfer(address(0), _to, _amount);
    }

    /**
     * Burn tokens
     */
    function burn(uint256 _amount) external validAmount(_amount) {
        require(balanceOf[msg.sender] >= _amount, "Insufficient balance");

        balanceOf[msg.sender] -= _amount;
        totalSupply -= _amount;
        emit TokensBurned(msg.sender, _amount);
        emit Transfer(msg.sender, address(0), _amount);
    }

    /**
     * Stake tokens for governance power
     */
    function stake(uint256 _amount, uint256 _lockPeriod) external validAmount(_amount) {
        require(balanceOf[msg.sender] >= _amount, "Insufficient balance");
        require(_lockPeriod >= 30 days, "Minimum lock period is 30 days");
        require(_lockPeriod <= 365 days, "Maximum lock period is 365 days");

        balanceOf[msg.sender] -= _amount;
        totalStaked[msg.sender] += _amount;

        userStakes[msg.sender].push(
            Stake({ amount: _amount, timestamp: block.timestamp, lockPeriod: _lockPeriod, isActive: true })
        );

        emit Staked(msg.sender, _amount, _lockPeriod);
    }

    /**
     * Unstake tokens (after lock period)
     */
    function unstake(uint256 _stakeIndex) external {
        require(_stakeIndex < userStakes[msg.sender].length, "Invalid stake index");

        Stake storage userStake = userStakes[msg.sender][_stakeIndex];
        require(userStake.isActive, "Stake not active");
        require(block.timestamp >= userStake.timestamp + userStake.lockPeriod, "Stake still locked");

        userStake.isActive = false;
        totalStaked[msg.sender] -= userStake.amount;
        balanceOf[msg.sender] += userStake.amount;

        emit Unstaked(msg.sender, userStake.amount);
    }

    /**
     * Get user's voting power
     */
    function getVotingPower(address _user) external view returns (uint256) {
        uint256 power = 0;

        for (uint256 i = 0; i < userStakes[msg.sender].length; i++) {
            if (userStakes[msg.sender][i].isActive) {
                // Longer lock periods give more voting power
                uint256 multiplier = 100 + (userStakes[msg.sender][i].lockPeriod / 30 days) * 10;
                power += (userStakes[msg.sender][i].amount * multiplier) / 100;
            }
        }

        return power;
    }

    /**
     * Create governance proposal
     */
    function createProposal(string memory _title, string memory _description) external {
        require(totalStaked[msg.sender] >= votingPowerThreshold, "Insufficient voting power");

        proposals[nextProposalId] = Proposal({
            id: nextProposalId,
            proposer: msg.sender,
            title: _title,
            description: _description,
            forVotes: 0,
            againstVotes: 0,
            startTime: block.timestamp,
            endTime: block.timestamp + proposalDuration,
            executed: false,
            isActive: true
        });

        emit ProposalCreated(nextProposalId, msg.sender, _title);
        nextProposalId++;
    }

    /**
     * Vote on proposal
     */
    function vote(uint256 _proposalId, bool _support) external {
        Proposal storage proposal = proposals[_proposalId];
        require(proposal.isActive, "Proposal not active");
        require(block.timestamp <= proposal.endTime, "Voting period ended");
        require(!hasVoted[msg.sender][_proposalId], "Already voted");

        uint256 votingPower = this.getVotingPower(msg.sender);
        require(votingPower > 0, "No voting power");

        hasVoted[msg.sender][_proposalId] = true;

        if (_support) {
            proposal.forVotes += votingPower;
        } else {
            proposal.againstVotes += votingPower;
        }

        emit VoteCast(msg.sender, _proposalId, _support, votingPower);
    }

    /**
     * Execute proposal (if passed)
     */
    function executeProposal(uint256 _proposalId) external {
        Proposal storage proposal = proposals[_proposalId];
        require(proposal.isActive, "Proposal not active");
        require(block.timestamp > proposal.endTime, "Voting period not ended");
        require(!proposal.executed, "Proposal already executed");
        require(proposal.forVotes > proposal.againstVotes, "Proposal not passed");

        proposal.executed = true;
        proposal.isActive = false;

        emit ProposalExecuted(_proposalId);
    }

    /**
     * Collect platform fees (only platform contract)
     */
    function collectFees(uint256 _amount) external onlyPlatform {
        totalFeesCollected += _amount;
    }

    /**
     * Distribute fees to token holders (simplified)
     */
    function distributeFees() external {
        require(block.timestamp >= lastFeeDistribution + feeDistributionInterval, "Distribution interval not met");

        // Simplified fee distribution - in production, implement proper staker iteration
        lastFeeDistribution = block.timestamp;
        totalFeesCollected = 0;
    }

    /**
     * Claim fee rewards
     */
    function claimFeeRewards() external {
        uint256 rewards = userFeeShare[msg.sender];
        require(rewards > 0, "No rewards to claim");

        userFeeShare[msg.sender] = 0;
        balanceOf[msg.sender] += rewards;

        emit Transfer(address(0), msg.sender, rewards);
    }

    /**
     * Get proposal details
     */
    function getProposal(
        uint256 _proposalId
    )
        external
        view
        returns (
            address proposer,
            string memory title,
            string memory description,
            uint256 forVotes,
            uint256 againstVotes,
            uint256 startTime,
            uint256 endTime,
            bool executed,
            bool isActive
        )
    {
        Proposal memory proposal = proposals[_proposalId];
        return (
            proposal.proposer,
            proposal.title,
            proposal.description,
            proposal.forVotes,
            proposal.againstVotes,
            proposal.startTime,
            proposal.endTime,
            proposal.executed,
            proposal.isActive
        );
    }

    /**
     * Get user's staking info
     */
    function getUserStakes(
        address _user
    ) external view returns (uint256 totalStakedAmount, uint256 activeStakes, uint256 totalVotingPower) {
        totalStakedAmount = totalStaked[_user];
        activeStakes = 0;
        totalVotingPower = 0;

        for (uint256 i = 0; i < userStakes[_user].length; i++) {
            if (userStakes[_user][i].isActive) {
                activeStakes++;
                uint256 multiplier = 100 + (userStakes[_user][i].lockPeriod / 30 days) * 10;
                totalVotingPower += (userStakes[_user][i].amount * multiplier) / 100;
            }
        }
    }
}
