// SPDX-License-Identifier: MIT
pragma solidity ^0.8.19;

/**
 * @title LiskVotingSystem
 * @dev A decentralized voting system optimized for Lisk Network
 * @author VoteChain Team
 */
contract LiskVotingSystem {
    struct Poll {
        string question;
        string[] options;
        uint256[] votes;
        uint256 totalVotes;
        address creator;
        bool isActive;
        uint256 createdAt;
        uint256 endTime;
        mapping(address => bool) hasVoted;
        mapping(address => uint256) voterChoice;
    }
    
    struct PollInfo {
        uint256 id;
        string question;
        string[] options;
        uint256[] votes;
        uint256 totalVotes;
        address creator;
        bool isActive;
        uint256 createdAt;
        uint256 endTime;
    }
    
    struct PollStats {
        uint256 totalPolls;
        uint256 activePolls;
        uint256 totalVotes;
        uint256 totalParticipants;
    }
    
    mapping(uint256 => Poll) public polls;
    mapping(address => uint256[]) public userPolls;
    mapping(address => uint256[]) public userVotes;
    
    uint256 public pollCount = 0;
    uint256 public totalVotesCast = 0;
    address public owner;
    
    // Events optimized for Lisk Network
    event PollCreated(
        uint256 indexed pollId, 
        string question, 
        address indexed creator,
        uint256 endTime,
        uint256 optionCount
    );
    
    event VoteCast(
        uint256 indexed pollId, 
        address indexed voter, 
        uint256 optionIndex,
        uint256 timestamp
    );
    
    event PollEnded(
        uint256 indexed pollId,
        uint256 totalVotes,
        uint256 winningOption
    );
    
    event PollExtended(
        uint256 indexed pollId,
        uint256 newEndTime
    );
    
    modifier onlyOwner() {
        require(msg.sender == owner, "Only owner can call this function");
        _;
    }
    
    modifier pollExists(uint256 _pollId) {
        require(_pollId < pollCount, "Poll does not exist");
        _;
    }
    
    modifier pollActive(uint256 _pollId) {
        require(polls[_pollId].isActive, "Poll is not active");
        require(block.timestamp < polls[_pollId].endTime, "Poll has ended");
        _;
    }
    
    modifier hasNotVoted(uint256 _pollId) {
        require(!polls[_pollId].hasVoted[msg.sender], "You have already voted");
        _;
    }
    
    constructor() {
        owner = msg.sender;
    }
    
    /**
     * @dev Create a new poll with enhanced features for Lisk Network
     */
    function createPoll(
        string memory _question,
        string[] memory _options,
        uint256 _durationInHours
    ) public returns (uint256) {
        require(bytes(_question).length > 0, "Question cannot be empty");
        require(_options.length >= 2, "Must have at least 2 options");
        require(_options.length <= 10, "Maximum 10 options allowed");
        require(_durationInHours > 0 && _durationInHours <= 8760, "Duration must be between 1 hour and 1 year");
        
        // Validate options
        for (uint256 i = 0; i < _options.length; i++) {
            require(bytes(_options[i]).length > 0, "Option cannot be empty");
        }
        
        uint256 pollId = pollCount++;
        Poll storage newPoll = polls[pollId];
        
        newPoll.question = _question;
        newPoll.options = _options;
        newPoll.votes = new uint256[](_options.length);
        newPoll.totalVotes = 0;
        newPoll.creator = msg.sender;
        newPoll.isActive = true;
        newPoll.createdAt = block.timestamp;
        newPoll.endTime = block.timestamp + (_durationInHours * 1 hours);
        
        // Track user's polls
        userPolls[msg.sender].push(pollId);
        
        emit PollCreated(pollId, _question, msg.sender, newPoll.endTime, _options.length);
        return pollId;
    }
    
    /**
     * @dev Cast a vote on a poll
     */
    function vote(uint256 _pollId, uint256 _optionIndex) 
        public 
        pollExists(_pollId) 
        pollActive(_pollId) 
        hasNotVoted(_pollId) 
    {
        require(_optionIndex < polls[_pollId].options.length, "Invalid option");
        
        polls[_pollId].votes[_optionIndex]++;
        polls[_pollId].totalVotes++;
        polls[_pollId].hasVoted[msg.sender] = true;
        polls[_pollId].voterChoice[msg.sender] = _optionIndex;
        
        // Track user's votes
        userVotes[msg.sender].push(_pollId);
        totalVotesCast++;
        
        emit VoteCast(_pollId, msg.sender, _optionIndex, block.timestamp);
    }
    
    /**
     * @dev End a poll (only creator or after expiry)
     */
    function endPoll(uint256 _pollId) public pollExists(_pollId) {
        require(
            msg.sender == polls[_pollId].creator || 
            block.timestamp >= polls[_pollId].endTime, 
            "Only creator can end poll early or poll must be expired"
        );
        require(polls[_pollId].isActive, "Poll already ended");
        
        polls[_pollId].isActive = false;
        
        // Find winning option
        uint256 winningOption = 0;
        uint256 maxVotes = polls[_pollId].votes[0];
        for (uint256 i = 1; i < polls[_pollId].votes.length; i++) {
            if (polls[_pollId].votes[i] > maxVotes) {
                maxVotes = polls[_pollId].votes[i];
                winningOption = i;
            }
        }
        
        emit PollEnded(_pollId, polls[_pollId].totalVotes, winningOption);
    }
    
    /**
     * @dev Extend poll duration (only creator)
     */
    function extendPoll(uint256 _pollId, uint256 _additionalHours) 
        public 
        pollExists(_pollId) 
        pollActive(_pollId) 
    {
        require(msg.sender == polls[_pollId].creator, "Only creator can extend poll");
        require(_additionalHours > 0 && _additionalHours <= 168, "Extension must be between 1 hour and 1 week");
        
        polls[_pollId].endTime += (_additionalHours * 1 hours);
        emit PollExtended(_pollId, polls[_pollId].endTime);
    }
    
    /**
     * @dev Get poll information
     */
    function getPoll(uint256 _pollId) public view pollExists(_pollId) returns (PollInfo memory) {
        Poll storage poll = polls[_pollId];
        return PollInfo({
            id: _pollId,
            question: poll.question,
            options: poll.options,
            votes: poll.votes,
            totalVotes: poll.totalVotes,
            creator: poll.creator,
            isActive: poll.isActive,
            createdAt: poll.createdAt,
            endTime: poll.endTime
        });
    }
    
    /**
     * @dev Check if user has voted on a poll
     */
    function hasVoted(uint256 _pollId, address _voter) public view pollExists(_pollId) returns (bool) {
        return polls[_pollId].hasVoted[_voter];
    }
    
    /**
     * @dev Get user's vote choice for a poll
     */
    function getUserVote(uint256 _pollId, address _voter) public view pollExists(_pollId) returns (uint256) {
        require(polls[_pollId].hasVoted[_voter], "User has not voted");
        return polls[_pollId].voterChoice[_voter];
    }
    
    /**
     * @dev Get all polls (paginated for gas efficiency)
     */
    function getPolls(uint256 _offset, uint256 _limit) public view returns (PollInfo[] memory) {
        require(_limit > 0 && _limit <= 50, "Limit must be between 1 and 50");
        require(_offset < pollCount, "Offset out of bounds");
        
        uint256 end = _offset + _limit;
        if (end > pollCount) {
            end = pollCount;
        }
        
        PollInfo[] memory result = new PollInfo[](end - _offset);
        for (uint256 i = _offset; i < end; i++) {
            result[i - _offset] = getPoll(i);
        }
        return result;
    }
    
    /**
     * @dev Get active polls only
     */
    function getActivePolls() public view returns (PollInfo[] memory) {
        uint256 activeCount = 0;
        
        // Count active polls
        for (uint256 i = 0; i < pollCount; i++) {
            if (polls[i].isActive && block.timestamp < polls[i].endTime) {
                activeCount++;
            }
        }
        
        PollInfo[] memory activePolls = new PollInfo[](activeCount);
        uint256 index = 0;
        
        // Populate active polls
        for (uint256 i = 0; i < pollCount; i++) {
            if (polls[i].isActive && block.timestamp < polls[i].endTime) {
                activePolls[index] = getPoll(i);
                index++;
            }
        }
        
        return activePolls;
    }
    
    /**
     * @dev Get polls created by a user
     */
    function getUserPolls(address _user) public view returns (uint256[] memory) {
        return userPolls[_user];
    }
    
    /**
     * @dev Get polls voted on by a user
     */
    function getUserVotes(address _user) public view returns (uint256[] memory) {
        return userVotes[_user];
    }
    
    /**
     * @dev Get platform statistics
     */
    function getStats() public view returns (PollStats memory) {
        uint256 activeCount = 0;
        uint256 uniqueParticipants = 0;
        
        for (uint256 i = 0; i < pollCount; i++) {
            if (polls[i].isActive && block.timestamp < polls[i].endTime) {
                activeCount++;
            }
        }
        
        return PollStats({
            totalPolls: pollCount,
            activePolls: activeCount,
            totalVotes: totalVotesCast,
            totalParticipants: uniqueParticipants
        });
    }
    
    /**
     * @dev Emergency pause (only owner)
     */
    function emergencyPause(uint256 _pollId) public onlyOwner pollExists(_pollId) {
        polls[_pollId].isActive = false;
        emit PollEnded(_pollId, polls[_pollId].totalVotes, 0);
    }
}