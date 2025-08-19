// SPDX-License-Identifier: MIT
pragma solidity ^0.8.19;

contract VotingSystem {
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
    
    mapping(uint256 => Poll) public polls;
    uint256 public pollCount = 0;
    
    event PollCreated(uint256 indexed pollId, string question, address indexed creator);
    event VoteCast(uint256 indexed pollId, address indexed voter, uint256 optionIndex);
    event PollEnded(uint256 indexed pollId);
    
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
    
    function createPoll(
        string memory _question,
        string[] memory _options,
        uint256 _durationInHours
    ) public returns (uint256) {
        require(bytes(_question).length > 0, "Question cannot be empty");
        require(_options.length >= 2, "Must have at least 2 options");
        require(_durationInHours > 0, "Duration must be positive");
        
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
        
        emit PollCreated(pollId, _question, msg.sender);
        return pollId;
    }
    
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
        
        emit VoteCast(_pollId, msg.sender, _optionIndex);
    }
    
    function endPoll(uint256 _pollId) public pollExists(_pollId) {
        require(
            msg.sender == polls[_pollId].creator || 
            block.timestamp >= polls[_pollId].endTime, 
            "Only creator can end poll early or poll must be expired"
        );
        require(polls[_pollId].isActive, "Poll already ended");
        
        polls[_pollId].isActive = false;
        emit PollEnded(_pollId);
    }
    
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
    
    function hasVoted(uint256 _pollId, address _voter) public view pollExists(_pollId) returns (bool) {
        return polls[_pollId].hasVoted[_voter];
    }
    
    function getAllPolls() public view returns (PollInfo[] memory) {
        PollInfo[] memory allPolls = new PollInfo[](pollCount);
        for (uint256 i = 0; i < pollCount; i++) {
            allPolls[i] = getPoll(i);
        }
        return allPolls;
    }
}