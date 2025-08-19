import React from 'react';
import { BarChart3, Users } from 'lucide-react';
import { Poll } from '../types';
import { PollCard } from './PollCard';

interface PollListProps {
  polls: Poll[];
  onVote: (pollId: number, optionIndex: number) => Promise<boolean>;
  onEndPoll: (pollId: number) => Promise<boolean>;
  userAddress: string | null;
  loading: boolean;
}

export const PollList: React.FC<PollListProps> = ({
  polls,
  onVote,
  onEndPoll,
  userAddress,
  loading
}) => {
  if (polls.length === 0) {
    return (
      <div className="text-center py-12">
        <BarChart3 className="w-16 h-16 mx-auto text-white/40 mb-4" />
        <h3 className="text-xl font-semibold text-white/70 mb-2">No polls yet</h3>
        <p className="text-white/50">Create the first poll to get started!</p>
      </div>
    );
  }

  const activePolls = polls.filter(poll => poll.isActive && Math.floor(Date.now() / 1000) < poll.endTime);
  const endedPolls = polls.filter(poll => !poll.isActive || Math.floor(Date.now() / 1000) >= poll.endTime);

  return (
    <div className="space-y-8">
      {activePolls.length > 0 && (
        <div>
          <h2 className="text-2xl font-bold mb-6 flex items-center space-x-2">
            <Users className="w-6 h-6 text-green-400" />
            <span>Active Polls ({activePolls.length})</span>
          </h2>
          <div className="grid gap-6 md:grid-cols-2">
            {activePolls.map((poll) => (
              <PollCard
                key={poll.id}
                poll={poll}
                onVote={onVote}
                onEndPoll={onEndPoll}
                userAddress={userAddress}
                loading={loading}
              />
            ))}
          </div>
        </div>
      )}

      {endedPolls.length > 0 && (
        <div>
          <h2 className="text-2xl font-bold mb-6 flex items-center space-x-2">
            <BarChart3 className="w-6 h-6 text-gray-400" />
            <span>Ended Polls ({endedPolls.length})</span>
          </h2>
          <div className="grid gap-6 md:grid-cols-2">
            {endedPolls.map((poll) => (
              <PollCard
                key={poll.id}
                poll={poll}
                onVote={onVote}
                onEndPoll={onEndPoll}
                userAddress={userAddress}
                loading={loading}
              />
            ))}
          </div>
        </div>
      )}
    </div>
  );
};