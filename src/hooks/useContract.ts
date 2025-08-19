import { useState, useEffect } from 'react';
import { ethers } from 'ethers';
import { Poll, CreatePollData } from '../types';

const CONTRACT_ABI = [
  "function createPoll(string memory _question, string[] memory _options, uint256 _durationInHours) public returns (uint256)",
  "function vote(uint256 _pollId, uint256 _optionIndex) public",
  "function getPoll(uint256 _pollId) public view returns (tuple(uint256 id, string question, string[] options, uint256[] votes, uint256 totalVotes, address creator, bool isActive, uint256 createdAt, uint256 endTime))",
  "function getAllPolls() public view returns (tuple(uint256 id, string question, string[] options, uint256[] votes, uint256 totalVotes, address creator, bool isActive, uint256 createdAt, uint256 endTime)[])",
  "function hasVoted(uint256 _pollId, address _voter) public view returns (bool)",
  "function endPoll(uint256 _pollId) public",
  "function pollCount() public view returns (uint256)",
  "event PollCreated(uint256 indexed pollId, string question, address indexed creator)",
  "event VoteCast(uint256 indexed pollId, address indexed voter, uint256 optionIndex)",
  "event PollEnded(uint256 indexed pollId)"
];

// Mock contract address for demo purposes
const CONTRACT_ADDRESS = "0x1234567890123456789012345678901234567890";

export const useContract = (signer: ethers.JsonRpcSigner | null) => {
  const [contract, setContract] = useState<ethers.Contract | null>(null);
  const [polls, setPolls] = useState<Poll[]>([]);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (signer) {
      const contractInstance = new ethers.Contract(CONTRACT_ADDRESS, CONTRACT_ABI, signer);
      setContract(contractInstance);
    }
  }, [signer]);

  const createPoll = async (pollData: CreatePollData): Promise<boolean> => {
    if (!contract) return false;
    
    setLoading(true);
    try {
      // In a real scenario, this would interact with the blockchain
      // For demo purposes, we'll simulate the transaction
      console.log('Creating poll:', pollData);
      
      // Simulate transaction delay
      await new Promise(resolve => setTimeout(resolve, 2000));
      
      // Add mock poll to local state
      const newPoll: Poll = {
        id: polls.length,
        question: pollData.question,
        options: pollData.options,
        votes: new Array(pollData.options.length).fill(0),
        totalVotes: 0,
        creator: await contract.signer.getAddress(),
        isActive: true,
        createdAt: Math.floor(Date.now() / 1000),
        endTime: Math.floor(Date.now() / 1000) + (pollData.duration * 3600),
      };
      
      setPolls(prev => [...prev, newPoll]);
      return true;
    } catch (error) {
      console.error('Error creating poll:', error);
      return false;
    } finally {
      setLoading(false);
    }
  };

  const vote = async (pollId: number, optionIndex: number): Promise<boolean> => {
    if (!contract) return false;
    
    setLoading(true);
    try {
      // In a real scenario, this would interact with the blockchain
      console.log('Voting on poll:', pollId, 'option:', optionIndex);
      
      // Simulate transaction delay
      await new Promise(resolve => setTimeout(resolve, 1500));
      
      // Update local state
      setPolls(prev => prev.map(poll => {
        if (poll.id === pollId) {
          const newVotes = [...poll.votes];
          newVotes[optionIndex]++;
          return {
            ...poll,
            votes: newVotes,
            totalVotes: poll.totalVotes + 1,
          };
        }
        return poll;
      }));
      
      return true;
    } catch (error) {
      console.error('Error voting:', error);
      return false;
    } finally {
      setLoading(false);
    }
  };

  const endPoll = async (pollId: number): Promise<boolean> => {
    if (!contract) return false;
    
    setLoading(true);
    try {
      console.log('Ending poll:', pollId);
      
      // Simulate transaction delay
      await new Promise(resolve => setTimeout(resolve, 1000));
      
      // Update local state
      setPolls(prev => prev.map(poll => {
        if (poll.id === pollId) {
          return { ...poll, isActive: false };
        }
        return poll;
      }));
      
      return true;
    } catch (error) {
      console.error('Error ending poll:', error);
      return false;
    } finally {
      setLoading(false);
    }
  };

  return {
    contract,
    polls,
    loading,
    createPoll,
    vote,
    endPoll,
  };
};