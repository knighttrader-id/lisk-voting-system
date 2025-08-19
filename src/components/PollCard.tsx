import React, { useState } from 'react';
import { Clock, User, Vote, TrendingUp, StopCircle, CheckCircle2, AlertCircle } from 'lucide-react';
import { Poll } from '../types';

interface PollCardProps {
  poll: Poll;
  onVote: (pollId: number, optionIndex: number) => Promise<boolean>;
  onEndPoll: (pollId: number) => Promise<boolean>;
  userAddress: string | null;
  loading: boolean;
}

export const PollCard: React.FC<PollCardProps> = ({
  poll,
  onVote,
  onEndPoll,
  userAddress,
  loading
}) => {
  const [selectedOption, setSelectedOption] = useState<number | null>(null);
  const [hasVoted, setHasVoted] = useState(false);
  const [isVoting, setIsVoting] = useState(false);

  const formatTimeRemaining = (endTime: number) => {
    const now = Math.floor(Date.now() / 1000);
    const remaining = endTime - now;
    
    if (remaining <= 0) return 'Ended';
    
    const hours = Math.floor(remaining / 3600);
    const minutes = Math.floor((remaining % 3600) / 60);
    
    if (hours > 0) {
      return `${hours}h ${minutes}m remaining`;
    }
    return `${minutes}m remaining`;
  };

  const formatAddress = (address: string) => {
    return `${address.slice(0, 6)}...${address.slice(-4)}`;
  };

  const handleVote = async (optionIndex: number) => {
    if (hasVoted || !poll.isActive) return;
    
    setIsVoting(true);
    setSelectedOption(optionIndex);
    const success = await onVote(poll.id, optionIndex);
    if (success) {
      setHasVoted(true);
    }
    setIsVoting(false);
  };

  const isCreator = userAddress && userAddress.toLowerCase() === poll.creator.toLowerCase();
  const isEnded = !poll.isActive || Math.floor(Date.now() / 1000) >= poll.endTime;

  return (
    <div className="bg-white/10 backdrop-blur-sm rounded-xl p-6 border border-white/20 hover:border-white/30 transition-all duration-200">
      <div className="flex items-start justify-between mb-4">
        <h3 className="text-xl font-bold text-white leading-tight">{poll.question}</h3>
        {isCreator && poll.isActive && !isEnded && (
          <button
            onClick={() => onEndPoll(poll.id)}
            disabled={loading}
            className="flex items-center space-x-1 text-red-400 hover:text-red-300 transition-colors"
          >
            <StopCircle className="w-4 h-4" />
            <span className="text-sm">End</span>
          </button>
        )}
      </div>
      
      <div className="flex items-center space-x-4 text-sm text-white/70 mb-6">
        <div className="flex items-center space-x-1">
          <User className="w-4 h-4" />
          <span>{formatAddress(poll.creator)}</span>
        </div>
        <div className="flex items-center space-x-1">
          <Clock className="w-4 h-4" />
          <span>{formatTimeRemaining(poll.endTime)}</span>
        </div>
        <div className="flex items-center space-x-1">
          <Vote className="w-4 h-4" />
          <span>{poll.totalVotes} votes</span>
        </div>
      </div>

      <div className="space-y-3">
        {poll.options.map((option, index) => {
          const votePercentage = poll.totalVotes > 0 
            ? Math.round((poll.votes[index] / poll.totalVotes) * 100) 
            : 0;
          
          const isSelected = selectedOption === index && isVoting;
          const canVote = !hasVoted && poll.isActive && !isEnded && userAddress;
          const isWinning = poll.totalVotes > 0 && poll.votes[index] === Math.max(...poll.votes);

          return (
            <div key={index} className="relative">
              <button
                onClick={() => canVote && handleVote(index)}
                disabled={!canVote || loading || isVoting}
                className={`w-full text-left p-4 rounded-lg border transition-all duration-200 ${
                  canVote
                    ? 'border-white/20 hover:border-purple-400 hover:bg-white/20 cursor-pointer transform hover:scale-[1.02]'
                    : 'border-white/10 cursor-not-allowed'
                } ${isSelected ? 'ring-2 ring-purple-400 bg-purple-500/20' : ''} ${
                  isWinning && poll.totalVotes > 0 ? 'ring-1 ring-green-400/50' : ''
                }`}
              >
                <div className="flex justify-between items-center mb-2">
                  <div className="flex items-center space-x-2">
                    <span className="font-medium text-white">{option}</span>
                    {isWinning && poll.totalVotes > 0 && (
                      <CheckCircle2 className="w-4 h-4 text-green-400" />
                    )}
                  </div>
                  <div className="flex items-center space-x-2">
                    <span className="text-sm text-white/70">{poll.votes[index]} votes</span>
                    <span className={`text-sm font-bold ${
                      isWinning && poll.totalVotes > 0 ? 'text-green-300' : 'text-purple-300'
                    }`}>
                      {votePercentage}%
                    </span>
                  </div>
                </div>
                
                <div className="w-full bg-white/10 rounded-full h-2 overflow-hidden">
                  <div
                    className={`h-full transition-all duration-500 ease-out ${
                      isWinning && poll.totalVotes > 0
                        ? 'bg-gradient-to-r from-green-500 to-emerald-500'
                        : 'bg-gradient-to-r from-purple-500 to-blue-500'
                    }`}
                    style={{ width: `${votePercentage}%` }}
                  />
                </div>
                
                {isSelected && isVoting && (
                  <div className="absolute inset-0 bg-purple-500/20 rounded-lg flex items-center justify-center">
                    <div className="flex items-center space-x-2 text-purple-300">
                      <div className="animate-spin rounded-full h-4 w-4 border-2 border-purple-300 border-t-transparent"></div>
                      <span className="text-sm font-medium">Voting...</span>
                    </div>
                  </div>
                )}
              </button>
            </div>
          );
        })}
      </div>

      {!userAddress && poll.isActive && !isEnded && (
        <div className="mt-4 p-3 bg-yellow-500/20 border border-yellow-500/30 rounded-lg">
          <div className="flex items-center space-x-2 text-yellow-300">
            <AlertCircle className="w-4 h-4" />
            <span className="text-sm font-medium">Connect your wallet to vote</span>
          </div>
        </div>
      )}

      {isEnded && (
        <div className="mt-4 p-3 bg-red-500/20 border border-red-500/30 rounded-lg">
          <div className="flex items-center space-x-2 text-red-300">
            <StopCircle className="w-4 h-4" />
            <span className="text-sm font-medium">This poll has ended</span>
          </div>
        </div>
      )}

      {hasVoted && poll.isActive && (
        <div className="mt-4 p-3 bg-green-500/20 border border-green-500/30 rounded-lg">
          <div className="flex items-center space-x-2 text-green-300">
            <CheckCircle2 className="w-4 h-4" />
            <span className="text-sm font-medium">You have voted on this poll</span>
          </div>
        </div>
      )}
    </div>
  );
};