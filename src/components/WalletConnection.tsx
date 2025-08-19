import React from 'react';
import { Wallet, LogOut } from 'lucide-react';
import { useWeb3 } from '../hooks/useWeb3';

export const WalletConnection: React.FC = () => {
  const { wallet, connectWallet, disconnectWallet } = useWeb3();

  const formatAddress = (address: string) => {
    return `${address.slice(0, 6)}...${address.slice(-4)}`;
  };

  if (wallet.isConnected) {
    return (
      <div className="flex items-center space-x-4">
        <div className="flex items-center space-x-2 bg-white/10 backdrop-blur-sm rounded-lg px-4 py-2">
          <Wallet className="w-4 h-4" />
          <span className="text-sm font-medium">
            {formatAddress(wallet.address!)}
          </span>
        </div>
        <button
          onClick={disconnectWallet}
          className="flex items-center space-x-2 bg-red-500/20 hover:bg-red-500/30 backdrop-blur-sm rounded-lg px-4 py-2 transition-all duration-200"
        >
          <LogOut className="w-4 h-4" />
          <span className="text-sm">Disconnect</span>
        </button>
      </div>
    );
  }

  return (
    <button
      onClick={connectWallet}
      className="flex items-center space-x-2 bg-gradient-to-r from-purple-500 to-blue-500 hover:from-purple-600 hover:to-blue-600 rounded-lg px-6 py-3 font-semibold transition-all duration-200 transform hover:scale-105"
    >
      <Wallet className="w-5 h-5" />
      <span>Connect Wallet</span>
    </button>
  );
};