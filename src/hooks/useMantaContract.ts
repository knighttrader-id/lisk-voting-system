import { useState, useEffect } from 'react';
import { ethers } from 'ethers';
import { Poll, CreatePollData } from '../types';
import { DEFAULT_NETWORK, SUPPORTED_NETWORKS } from '../config/networks';

const MANTA_CONTRACT_ABI = [
  "function createPoll(string memory _question, string[] memory _options, uint256 _durationInHours) public returns (uint256)",
  "function vote(uint256 _pollId, uint256 _optionIndex) public",
  "function endPoll(uint256 _pollId) public",
  "function extendPoll(uint256 _pollId, uint256 _additionalHours) public",
  "function getPoll(uint256 _pollId) public view returns (tuple(uint256 id, string question, string[] options, uint256[] votes, uint256 totalVotes, address creator, bool isActive, uint256 createdAt, uint256 endTime))",
  "function getActivePolls() public view returns (tuple(uint256 id, string question, string[] options, uint256[] votes, uint256 totalVotes, address creator, bool isActive, uint256 createdAt, uint256 endTime)[])",
  "function getPolls(uint256 _offset, uint256 _limit) public view returns (tuple(uint256 id, string question, string[] options, uint256[] votes, uint256 totalVotes, address creator, bool isActive, uint256 createdAt, uint256 endTime)[])",
  "function hasVoted(uint256 _pollId, address _voter) public view returns (bool)",
  "function getUserVote(uint256 _pollId, address _voter) public view returns (uint256)",
  "function getUserPolls(address _user) public view returns (uint256[])",
  "function getUserVotes(address _user) public view returns (uint256[])",
  "function getStats() public view returns (tuple(uint256 totalPolls, uint256 activePolls, uint256 totalVotes, uint256 totalParticipants))",
  "function pollCount() public view returns (uint256)",
  "event PollCreated(uint256 indexed pollId, string question, address indexed creator, uint256 endTime, uint256 optionCount)",
  "event VoteCast(uint256 indexed pollId, address indexed voter, uint256 optionIndex, uint256 timestamp)",
  "event PollEnded(uint256 indexed pollId, uint256 totalVotes, uint256 winningOption)",
  "event PollExtended(uint256 indexed pollId, uint256 newEndTime)"
];

// Deploy contract address on Manta Pacific Testnet
const MANTA_CONTRACT_ADDRESS = "0x742d35cc6634c0532925a3b8d4c9db96c4b4d8b7"; // Replace with actual deployed address

export const useMantaContract = (signer: ethers.JsonRpcSigner | null) => {
  const [contract, setContract] = useState<ethers.Contract | null>(null);
  const [polls, setPolls] = useState<Poll[]>([]);
  const [loading, setLoading] = useState(false);
  const [networkSupported, setNetworkSupported] = useState(true);
  const [currentNetwork, setCurrentNetwork] = useState<any>(null);

  useEffect(() => {
    if (signer) {
      const contractInstance = new ethers.Contract(MANTA_CONTRACT_ADDRESS, MANTA_CONTRACT_ABI, signer);
      setContract(contractInstance);
      checkNetwork();
    }
  }, [signer]);

  // Second useEffect to load polls only when network is supported
  useEffect(() => {
    if (contract && networkSupported) {
      loadPolls();
    } else if (contract && !networkSupported) {
      // Clear polls if network is not supported
      setPolls([]);
    }
  }, [contract, networkSupported]);

  const checkNetwork = async () => {
    if (!signer) return;
    
    try {
      const network = await signer.provider.getNetwork();
      const chainId = Number(network.chainId);
      
      const supportedNetwork = SUPPORTED_NETWORKS.find(net => net.chainId === chainId);
      setNetworkSupported(!!supportedNetwork);
      setCurrentNetwork(supportedNetwork || { chainId, name: 'Unknown Network' });
      
      if (!supportedNetwork) {
        console.warn('Unsupported network. Please switch to Manta Pacific.');
      }
    } catch (error) {
      console.error('Error checking network:', error);
      setNetworkSupported(false);
    }
  };

  const switchToMantaNetwork = async () => {
    if (!window.ethereum) return false;

    try {
      await window.ethereum.request({
        method: 'wallet_switchEthereumChain',
        params: [{ chainId: `0x${DEFAULT_NETWORK.chainId.toString(16)}` }],
      });
      return true;
    } catch (switchError: any) {
      // This error code indicates that the chain has not been added to MetaMask
      if (switchError.code === 4902) {
        try {
          await window.ethereum.request({
            method: 'wallet_addEthereumChain',
            params: [
              {
                chainId: `0x${DEFAULT_NETWORK.chainId.toString(16)}`,
                chainName: DEFAULT_NETWORK.name,
                rpcUrls: [DEFAULT_NETWORK.rpcUrl],
                nativeCurrency: DEFAULT_NETWORK.nativeCurrency,
                blockExplorerUrls: [DEFAULT_NETWORK.blockExplorer],
              },
            ],
          });
          return true;
        } catch (addError) {
          console.error('Error adding network:', addError);
          // User rejected adding network - this is expected behavior
          return false;
        }
      }
      // User rejected switching network - this is expected behavior
      if (switchError.code !== 4001) {
        console.error('Error switching network:', switchError);
      }
      return false;
    }
  };

  const loadPolls = async () => {
    if (!contract) return;
    
    setLoading(true);
    try {
      // Check if contract is deployed at the address
      const contractCode = await contract.runner.provider.getCode(MANTA_CONTRACT_ADDRESS);
      if (contractCode === '0x') {
        console.error('Contract not found at address:', MANTA_CONTRACT_ADDRESS, 'on current network');
        setPolls([]);
        return;
      }
      
      // Get active polls from Manta contract
      const activePolls = await contract.getActivePolls();
      
      // Convert contract data to our Poll interface
      const formattedPolls: Poll[] = activePolls.map((poll: any) => ({
        id: Number(poll.id),
        question: poll.question,
        options: poll.options,
        votes: poll.votes.map((v: any) => Number(v)),
        totalVotes: Number(poll.totalVotes),
        creator: poll.creator,
        isActive: poll.isActive,
        createdAt: Number(poll.createdAt),
        endTime: Number(poll.endTime),
      }));
      
      setPolls(formattedPolls);
    } catch (error) {
      console.error('Error loading polls from Manta:', error);
      // Fallback to empty array if contract call fails
      setPolls([]);
    } finally {
      setLoading(false);
    }
  };

  const createPoll = async (pollData: CreatePollData): Promise<boolean> => {
    if (!contract || !networkSupported) {
      if (!networkSupported) {
        const switched = await switchToMantaNetwork();
        if (!switched) return false;
      }
      return false;
    }
    
    setLoading(true);
    try {
      console.log('Creating poll on Manta Network:', pollData);
      
      // Call the smart contract
      const tx = await contract.createPoll(
        pollData.question,
        pollData.options,
        pollData.duration
      );
      
      console.log('Transaction sent:', tx.hash);
      
      // Wait for transaction confirmation
      const receipt = await tx.wait();
      console.log('Transaction confirmed:', receipt);
      
      // Reload polls to get the new one
      await loadPolls();
      
      return true;
    } catch (error: any) {
      console.error('Error creating poll on Manta:', error);
      
      // Handle specific error cases
      if (error.code === 'INSUFFICIENT_FUNDS') {
        alert('Insufficient funds for transaction. Please add more ETH to your wallet.');
      } else if (error.code === 'USER_REJECTED') {
        console.log('User rejected transaction');
      } else {
        alert(`Error creating poll: ${error.message || 'Unknown error'}`);
      }
      
      return false;
    } finally {
      setLoading(false);
    }
  };

  const vote = async (pollId: number, optionIndex: number): Promise<boolean> => {
    if (!contract || !networkSupported) return false;
    
    setLoading(true);
    try {
      console.log('Voting on Manta Network - Poll:', pollId, 'Option:', optionIndex);
      
      // Check if user has already voted
      const userAddress = await contract.signer.getAddress();
      const hasVotedAlready = await contract.hasVoted(pollId, userAddress);
      
      if (hasVotedAlready) {
        alert('You have already voted on this poll!');
        return false;
      }
      
      // Cast vote on blockchain
      const tx = await contract.vote(pollId, optionIndex);
      console.log('Vote transaction sent:', tx.hash);
      
      // Wait for confirmation
      const receipt = await tx.wait();
      console.log('Vote confirmed:', receipt);
      
      // Reload polls to get updated vote counts
      await loadPolls();
      
      return true;
    } catch (error: any) {
      console.error('Error voting on Manta:', error);
      
      if (error.code === 'INSUFFICIENT_FUNDS') {
        alert('Insufficient funds for voting transaction.');
      } else if (error.code === 'USER_REJECTED') {
        console.log('User rejected vote transaction');
      } else {
        alert(`Error voting: ${error.message || 'Unknown error'}`);
      }
      
      return false;
    } finally {
      setLoading(false);
    }
  };

  const endPoll = async (pollId: number): Promise<boolean> => {
    if (!contract || !networkSupported) return false;
    
    setLoading(true);
    try {
      console.log('Ending poll on Manta Network:', pollId);
      
      const tx = await contract.endPoll(pollId);
      console.log('End poll transaction sent:', tx.hash);
      
      const receipt = await tx.wait();
      console.log('End poll confirmed:', receipt);
      
      // Reload polls
      await loadPolls();
      
      return true;
    } catch (error: any) {
      console.error('Error ending poll on Manta:', error);
      alert(`Error ending poll: ${error.message || 'Unknown error'}`);
      return false;
    } finally {
      setLoading(false);
    }
  };

  const extendPoll = async (pollId: number, additionalHours: number): Promise<boolean> => {
    if (!contract || !networkSupported) return false;
    
    setLoading(true);
    try {
      const tx = await contract.extendPoll(pollId, additionalHours);
      await tx.wait();
      await loadPolls();
      return true;
    } catch (error: any) {
      console.error('Error extending poll:', error);
      alert(`Error extending poll: ${error.message || 'Unknown error'}`);
      return false;
    } finally {
      setLoading(false);
    }
  };

  return {
    contract,
    polls,
    loading,
    networkSupported,
    currentNetwork,
    createPoll,
    vote,
    endPoll,
    extendPoll,
    switchToMantaNetwork,
    loadPolls,
  };
};