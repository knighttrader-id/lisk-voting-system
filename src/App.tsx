import React, { useState } from 'react';
import { Vote, Github, Shield, Zap, Layers } from 'lucide-react';
import { WalletConnection } from './components/WalletConnection';
import { CreatePoll } from './components/CreatePoll';
import { PollList } from './components/PollList';
import { NetworkStatus } from './components/NetworkStatus';
import { useWeb3 } from './hooks/useWeb3';
import { useLiskContract } from './hooks/useLiskContract';

function App() {
  const { wallet, signer } = useWeb3();
  const { 
    polls, 
    loading, 
    networkSupported, 
    currentNetwork, 
    createPoll, 
    vote, 
    endPoll,
    switchToLiskNetwork 
  } = useLiskContract(signer);
  const [activeTab, setActiveTab] = useState<'polls' | 'create'>('polls');

  // Debug wallet state
  console.log('Wallet state:', wallet);
  console.log('Is connected:', wallet.isConnected);
  console.log('Address:', wallet.address);

  return (
    <div className="min-h-screen bg-gradient-to-br from-purple-900 via-blue-900 to-indigo-900 text-white">
      {/* Header */}
      <header className="border-b border-white/10 backdrop-blur-sm bg-white/5">
        <div className="max-w-6xl mx-auto px-4 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-3">
              <div className="p-2 bg-gradient-to-r from-purple-500 to-blue-500 rounded-lg">
                <Layers className="w-8 h-8" />
              </div>
              <div>
                <h1 className="text-2xl font-bold">LiskVote</h1>
                <p className="text-sm text-white/70">Powered by Lisk Network</p>
              </div>
            </div>
            <div className="flex items-center space-x-4">
              {wallet.isConnected && (
                <NetworkStatus
                  networkSupported={networkSupported}
                  currentNetwork={currentNetwork}
                  onSwitchNetwork={switchToLiskNetwork}
                  loading={loading}
                />
              )}
              <WalletConnection />
            </div>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="max-w-6xl mx-auto px-4 py-8">
        {!wallet.isConnected ? (
          /* WELCOME SCREEN - BEFORE WALLET CONNECTION */
          <div className="text-center py-20">
            <div className="max-w-2xl mx-auto">
              <Layers className="w-20 h-20 mx-auto text-purple-400 mb-6" />
              <h2 className="text-4xl font-bold mb-4">Welcome to LiskVote</h2>
              <p className="text-xl text-white/70 mb-8">
                A secure, transparent, and decentralized voting platform built on Lisk Network
              </p>
              
              <div className="grid md:grid-cols-3 gap-6 mb-12">
                <div className="bg-white/10 backdrop-blur-sm rounded-lg p-6 border border-white/20">
                  <Shield className="w-8 h-8 text-green-400 mx-auto mb-3" />
                  <h3 className="font-semibold mb-2">Secure & Transparent</h3>
                  <p className="text-sm text-white/70">
                    All votes are recorded on Lisk Network, ensuring security and transparency
                  </p>
                </div>
                <div className="bg-white/10 backdrop-blur-sm rounded-lg p-6 border border-white/20">
                  <Zap className="w-8 h-8 text-yellow-400 mx-auto mb-3" />
                  <h3 className="font-semibold mb-2">Fast & Efficient</h3>
                  <p className="text-sm text-white/70">
                    Lightning-fast transactions with low fees on Lisk Network
                  </p>
                </div>
                <div className="bg-white/10 backdrop-blur-sm rounded-lg p-6 border border-white/20">
                  <Vote className="w-8 h-8 text-purple-400 mx-auto mb-3" />
                  <h3 className="font-semibold mb-2">Easy to Use</h3>
                  <p className="text-sm text-white/70">
                    Simple interface for seamless voting experience
                  </p>
                </div>
              </div>

              <div className="text-center">
                <p className="text-white/80 mb-6 text-lg">
                  Connect your wallet to start creating and participating in polls
                </p>
                <WalletConnection />
              </div>
            </div>
          </div>
        ) : (
          /* MAIN APP - AFTER WALLET CONNECTION */
          <div className="space-y-8">
            {/* Network Status Warning */}
            {!networkSupported && (
              <NetworkStatus
                networkSupported={networkSupported}
                currentNetwork={currentNetwork}
                onSwitchNetwork={switchToLiskNetwork}
                loading={loading}
              />
            )}
            
            {/* Navigation */}
            <div className="flex flex-col sm:flex-row items-center justify-between gap-4">
              <h2 className="text-3xl font-bold">
                {activeTab === 'create' ? 'Create New Poll' : 'All Polls'}
              </h2>
              <div className="flex items-center space-x-4">
                <div className="bg-white/10 backdrop-blur-sm rounded-lg p-1 border border-white/20">
                  <button
                    onClick={() => setActiveTab('polls')}
                    className={`px-4 py-2 rounded-md font-medium transition-all duration-200 ${
                      activeTab === 'polls'
                        ? 'bg-gradient-to-r from-purple-500 to-blue-500 text-white'
                        : 'text-white/70 hover:text-white'
                    }`}
                  >
                    📊 View Polls
                  </button>
                  <button
                    onClick={() => setActiveTab('create')}
                    className={`px-4 py-2 rounded-md font-medium transition-all duration-200 ${
                      activeTab === 'create'
                        ? 'bg-gradient-to-r from-green-500 to-emerald-500 text-white'
                        : 'text-white/70 hover:text-white'
                    }`}
                  >
                    ➕ Create Poll
                  </button>
                </div>
              </div>
            </div>

            {/* Content Based on Active Tab */}
            {activeTab === 'create' ? (
              <CreatePoll onCreatePoll={createPoll} loading={loading} />
            ) : (
              <div className="space-y-8">
                {/* Create Poll CTA */}
                <div className="text-center">
                  <button
                    onClick={() => setActiveTab('create')}
                    className="inline-flex items-center space-x-2 bg-gradient-to-r from-green-500 to-emerald-500 hover:from-green-600 hover:to-emerald-600 rounded-lg px-8 py-4 font-bold text-lg transition-all duration-200 transform hover:scale-105 shadow-lg"
                  >
                    <Vote className="w-6 h-6" />
                    <span>🚀 Create New Poll</span>
                  </button>
                </div>

                {/* Polls List */}
                <PollList
                  polls={polls}
                  onVote={vote}
                  onEndPoll={endPoll}
                  userAddress={wallet.address}
                  loading={loading}
                />
              </div>
            )}
          </div>
        )}
      </main>

      {/* Footer */}
      <footer className="border-t border-white/10 backdrop-blur-sm bg-white/5 mt-20">
        <div className="max-w-6xl mx-auto px-4 py-8">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-2 text-white/60">
              <Layers className="w-5 h-5" />
              <span>LiskVote - Powered by Lisk Network</span>
            </div>
            <div className="flex items-center space-x-4">
              <a
                href="https://github.com"
                target="_blank"
                rel="noopener noreferrer"
                className="text-white/60 hover:text-white transition-colors"
              >
                <Github className="w-5 h-5" />
              </a>
              <span className="text-white/40">Built with ❤️ for Privacy</span>
              <span className="text-white/40">Built with ❤️ for Decentralization</span>
            </div>
          </div>
        </div>
      </footer>
    </div>
  );
}

export default App;