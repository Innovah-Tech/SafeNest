//SPDX-License-Identifier: MIT
pragma solidity >=0.8.0 <0.9.0;

// Useful for debugging. Remove when deploying to a live network.
import "hardhat/console.sol";

// Use openzeppelin to inherit battle-tested implementations (ERC20, ERC721, etc)
// import "@openzeppelin/contracts/access/Ownable.sol";
// import "@openzeppelin/contracts/security/ReentrancyGuard.sol";

/**
 * SafeNest - A decentralized help and support system
 * Allows users to request help, provide assistance, and manage community support
 * @author SafeNest Team
 */
contract SafeNest {
    // State Variables
    address public immutable owner;
    string public platformName = "SafeNest - Decentralized Help Platform";
    uint256 public totalHelpRequests = 0;
    uint256 public totalHelpProvided = 0;
    uint256 public platformFee = 0.01 ether; // 0.01 ETH fee for premium help requests
    
    // Help Request Structure
    struct HelpRequest {
        uint256 id;
        address requester;
        string title;
        string description;
        string category;
        uint256 reward;
        bool isResolved;
        bool isPremium;
        uint256 createdAt;
        address helper;
        string solution;
        uint256 resolvedAt;
    }
    
    // User Profile Structure
    struct UserProfile {
        string name;
        string bio;
        uint256 helpRequestsCount;
        uint256 helpProvidedCount;
        uint256 reputation;
        bool isVerified;
        string[] skills;
    }
    
    // Mappings
    mapping(uint256 => HelpRequest) public helpRequests;
    mapping(address => UserProfile) public userProfiles;
    mapping(address => uint256[]) public userHelpRequests;
    mapping(address => uint256[]) public userHelpProvided;
    mapping(string => uint256[]) public categoryRequests;
    mapping(address => bool) public isHelper;
    
    // Events
    event HelpRequestCreated(
        uint256 indexed requestId,
        address indexed requester,
        string title,
        string category,
        uint256 reward,
        bool isPremium
    );
    
    event HelpRequestResolved(
        uint256 indexed requestId,
        address indexed helper,
        string solution
    );
    
    event UserProfileUpdated(address indexed user, string name, string bio);
    event HelperRegistered(address indexed helper, string[] skills);
    event RewardClaimed(uint256 indexed requestId, address indexed helper, uint256 amount);
    
    // Constructor
    constructor() {
        owner = msg.sender;
    }
    
    // Modifiers
    modifier onlyOwner() {
        require(msg.sender == owner, "Not the owner");
        _;
    }
    
    modifier onlyHelper() {
        require(isHelper[msg.sender], "Not a registered helper");
        _;
    }
    
    modifier validRequestId(uint256 _requestId) {
        require(_requestId < totalHelpRequests, "Invalid request ID");
        _;
    }
    
    modifier onlyRequesterOrHelper(uint256 _requestId) {
        HelpRequest storage request = helpRequests[_requestId];
        require(
            msg.sender == request.requester || msg.sender == request.helper,
            "Not authorized"
        );
        _;
    }

    /**
     * Create a new help request
     */
    function createHelpRequest(
        string memory _title,
        string memory _description,
        string memory _category,
        bool _isPremium
    ) public payable returns (uint256) {
        require(bytes(_title).length > 0, "Title cannot be empty");
        require(bytes(_description).length > 0, "Description cannot be empty");
        require(bytes(_category).length > 0, "Category cannot be empty");
        
        if (_isPremium) {
            require(msg.value >= platformFee, "Insufficient fee for premium request");
        }
        
        uint256 requestId = totalHelpRequests;
        uint256 reward = _isPremium ? msg.value - platformFee : 0;
        
        helpRequests[requestId] = HelpRequest({
            id: requestId,
            requester: msg.sender,
            title: _title,
            description: _description,
            category: _category,
            reward: reward,
            isResolved: false,
            isPremium: _isPremium,
            createdAt: block.timestamp,
            helper: address(0),
            solution: "",
            resolvedAt: 0
        });
        
        userHelpRequests[msg.sender].push(requestId);
        categoryRequests[_category].push(requestId);
        totalHelpRequests++;
        
        emit HelpRequestCreated(requestId, msg.sender, _title, _category, reward, _isPremium);
        
        return requestId;
    }
    
    /**
     * Register as a helper
     */
    function registerAsHelper(string memory _name, string memory _bio, string[] memory _skills) public {
        require(bytes(_name).length > 0, "Name cannot be empty");
        require(_skills.length > 0, "Must provide at least one skill");
        
        userProfiles[msg.sender] = UserProfile({
            name: _name,
            bio: _bio,
            helpRequestsCount: 0,
            helpProvidedCount: 0,
            reputation: 0,
            isVerified: false,
            skills: _skills
        });
        
        isHelper[msg.sender] = true;
        
        emit HelperRegistered(msg.sender, _skills);
    }
    
    /**
     * Provide help for a request
     */
    function provideHelp(uint256 _requestId, string memory _solution) 
        public 
        onlyHelper 
        validRequestId(_requestId) 
    {
        HelpRequest storage request = helpRequests[_requestId];
        require(!request.isResolved, "Request already resolved");
        require(request.helper == address(0), "Request already assigned");
        
        request.helper = msg.sender;
        request.solution = _solution;
        request.isResolved = true;
        request.resolvedAt = block.timestamp;
        
        // Update user stats
        userProfiles[msg.sender].helpProvidedCount++;
        userProfiles[request.requester].helpRequestsCount++;
        userProfiles[msg.sender].reputation += 10; // Reputation points for helping
        
        totalHelpProvided++;
        
        // Transfer reward to helper
        if (request.reward > 0) {
            (bool success, ) = msg.sender.call{value: request.reward}("");
            require(success, "Failed to transfer reward");
        }
        
        userHelpProvided[msg.sender].push(_requestId);
        
        emit HelpRequestResolved(_requestId, msg.sender, _solution);
        emit RewardClaimed(_requestId, msg.sender, request.reward);
    }
    
    /**
     * Get help request details
     */
    function getHelpRequest(uint256 _requestId) 
        public 
        view 
        validRequestId(_requestId) 
        returns (HelpRequest memory) 
    {
        return helpRequests[_requestId];
    }
    
    /**
     * Get user profile
     */
    function getUserProfile(address _user) public view returns (UserProfile memory) {
        return userProfiles[_user];
    }
    
    /**
     * Get help requests by category
     */
    function getHelpRequestsByCategory(string memory _category) 
        public 
        view 
        returns (uint256[] memory) 
    {
        return categoryRequests[_category];
    }
    
    /**
     * Get user's help requests
     */
    function getUserHelpRequests(address _user) public view returns (uint256[] memory) {
        return userHelpRequests[_user];
    }
    
    /**
     * Get user's help provided
     */
    function getUserHelpProvided(address _user) public view returns (uint256[] memory) {
        return userHelpProvided[_user];
    }
    
    /**
     * Update user profile
     */
    function updateProfile(string memory _name, string memory _bio) public {
        require(bytes(_name).length > 0, "Name cannot be empty");
        
        userProfiles[msg.sender].name = _name;
        userProfiles[msg.sender].bio = _bio;
        
        emit UserProfileUpdated(msg.sender, _name, _bio);
    }
    
    /**
     * Verify a helper (only owner)
     */
    function verifyHelper(address _helper) public onlyOwner {
        require(isHelper[_helper], "User is not a helper");
        userProfiles[_helper].isVerified = true;
    }
    
    /**
     * Set platform fee (only owner)
     */
    function setPlatformFee(uint256 _newFee) public onlyOwner {
        platformFee = _newFee;
    }
    
    /**
     * Withdraw platform fees (only owner)
     */
    function withdrawFees() public onlyOwner {
        uint256 balance = address(this).balance;
        require(balance > 0, "No fees to withdraw");
        
        (bool success, ) = owner.call{value: balance}("");
        require(success, "Failed to withdraw fees");
    }
    
    /**
     * Get platform statistics
     */
    function getPlatformStats() public view returns (
        uint256 _totalRequests,
        uint256 _totalHelpProvided,
        uint256 _totalHelpers,
        uint256 _platformBalance
    ) {
        return (
            totalHelpRequests,
            totalHelpProvided,
            // Note: This is a simplified count - in production, you'd want to track this properly
            totalHelpRequests, // Placeholder for total helpers
            address(this).balance
        );
    }

    /**
     * Function that allows the contract to receive ETH
     */
    receive() external payable {}
}
