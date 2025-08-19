export const NETWORKS = {
  LISK_MAINNET: {
    chainId: 1135,
    name: 'Lisk',
    rpcUrl: 'https://rpc.api.lisk.com',
    blockExplorer: 'https://blockscout.lisk.com',
    nativeCurrency: {
      name: 'Lisk',
      symbol: 'LSK',
      decimals: 18,
    },
  },
  LISK_SEPOLIA_TESTNET: {
    chainId: 4202,
    name: 'Lisk Sepolia Testnet',
    rpcUrl: 'https://rpc.sepolia-api.lisk.com',
    blockExplorer: 'https://sepolia-blockscout.lisk.com',
    nativeCurrency: {
      name: 'Sepolia Ether',
      symbol: 'ETH',
      decimals: 18,
    },
  },
};

export const SUPPORTED_NETWORKS = [
  NETWORKS.LISK_MAINNET,
  NETWORKS.LISK_SEPOLIA_TESTNET,
];

export const DEFAULT_NETWORK = NETWORKS.LISK_SEPOLIA_TESTNET;