import { useState, useEffect, useCallback } from 'react';
import { ethers } from 'ethers';
import { WalletState } from '../types';

declare global {
  interface Window {
    ethereum?: any;
  }
}

export const useWeb3 = () => {
  const [wallet, setWallet] = useState<WalletState>({
    isConnected: false,
    address: null,
    chainId: null,
  });
  const [provider, setProvider] = useState<ethers.BrowserProvider | null>(null);
  const [signer, setSigner] = useState<ethers.JsonRpcSigner | null>(null);

  // Check if wallet is already connected on page load
  useEffect(() => {
    const checkConnection = async () => {
      if (window.ethereum) {
        try {
          const accounts = await window.ethereum.request({
            method: 'eth_accounts',
          });
          
          if (accounts.length > 0) {
            const provider = new ethers.BrowserProvider(window.ethereum);
            const signer = await provider.getSigner();
            const network = await provider.getNetwork();

            setProvider(provider);
            setSigner(signer);
            setWallet({
              isConnected: true,
              address: accounts[0],
              chainId: Number(network.chainId),
            });
          }
        } catch (error) {
          console.error('Failed to check wallet connection:', error);
        }
      }
    };

    checkConnection();
  }, []);

  const connectWallet = useCallback(async () => {
    if (!window.ethereum) {
      alert('Please install MetaMask!');
      return;
    }

    try {
      const accounts = await window.ethereum.request({
        method: 'eth_requestAccounts',
      });
      
      const provider = new ethers.BrowserProvider(window.ethereum);
      const signer = await provider.getSigner();
      const network = await provider.getNetwork();

      setProvider(provider);
      setSigner(signer);
      setWallet({
        isConnected: true,
        address: accounts[0],
        chainId: Number(network.chainId),
      });
    } catch (error) {
      console.error('Failed to connect wallet:', error);
    }
  }, []);

  const disconnectWallet = useCallback(() => {
    setWallet({
      isConnected: false,
      address: null,
      chainId: null,
    });
    setProvider(null);
    setSigner(null);
  }, []);

  useEffect(() => {
    if (window.ethereum) {
      window.ethereum.on('accountsChanged', (accounts: string[]) => {
        if (accounts.length === 0) {
          disconnectWallet();
        } else {
          setWallet(prev => ({ ...prev, address: accounts[0] }));
        }
      });

      window.ethereum.on('chainChanged', (chainId: string) => {
        setWallet(prev => ({ ...prev, chainId: parseInt(chainId, 16) }));
      });
    }

    return () => {
      if (window.ethereum) {
        window.ethereum.removeAllListeners('accountsChanged');
        window.ethereum.removeAllListeners('chainChanged');
      }
    };
  }, [disconnectWallet]);

  return {
    wallet,
    provider,
    signer,
    connectWallet,
    disconnectWallet,
  };
};