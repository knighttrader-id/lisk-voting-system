export interface Poll {
  id: number;
  question: string;
  options: string[];
  votes: number[];
  totalVotes: number;
  creator: string;
  isActive: boolean;
  createdAt: number;
  endTime: number;
}

export interface CreatePollData {
  question: string;
  options: string[];
  duration: number;
}

export interface WalletState {
  isConnected: boolean;
  address: string | null;
  chainId: number | null;
}