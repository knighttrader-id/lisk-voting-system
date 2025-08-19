# LiskVote - Decentralized Voting on Lisk Network

A secure, transparent, and decentralized voting platform built on Lisk Network.

## 🚀 Features

- **Lisk-Powered**: Built on Lisk Network for scalability and low fees
- **Secure Voting**: Blockchain-based vote recording and verification
- **Real-time Results**: Live vote counting and result visualization
- **User-Friendly**: Simple interface for creating and participating in polls
- **Gas Efficient**: Optimized smart contracts for low transaction costs
- **Mobile Responsive**: Works seamlessly on all devices

## 🌟 Getting Started

### Prerequisites

- Node.js 18+ 
- MetaMask or compatible Web3 wallet
- Access to Lisk Network

### Installation

1. Clone the repository:
```bash
git clone <repository-url>
cd liskvote
```

2. Install dependencies:
```bash
npm install
```

3. Start the development server:
```bash
npm run dev
```

4. Open your browser and navigate to `http://localhost:5173`

### Network Configuration

The app is configured to work with:
- **Lisk Mainnet** (Chain ID: 1135)
- **Lisk Sepolia Testnet** (Chain ID: 4202)

MetaMask will automatically prompt you to add/switch to the correct network.

## 🏗️ Smart Contract

The voting system is powered by the `LiskVotingSystem` smart contract deployed on Lisk Network.

### Contract Features:
- Create polls with multiple options
- Time-limited voting periods
- Vote tracking and prevention of double voting
- Poll extension capabilities
- Comprehensive event logging
- Gas-optimized operations for Lisk Network

### Contract Address:
- **Testnet**: `0x742d35cc6634c0532925a3b8d4c9db96c4b4d8b7`
- **Mainnet**: TBD

## 📱 How to Use

### Creating a Poll:
1. Connect your wallet to Lisk Network
2. Click "Create Poll" 
3. Enter your question and options (2-10 options)
4. Set the poll duration (1 hour to 1 year)
5. Submit the transaction

### Voting:
1. Browse active polls
2. Click on your preferred option
3. Confirm the transaction
4. View real-time results

### Managing Polls:
- **End Early**: Poll creators can end their polls before expiry
- **Extend Duration**: Add more time to active polls
- **View Statistics**: Track participation and results

## 🛠️ Technology Stack

- **Frontend**: React 18, TypeScript, Tailwind CSS
- **Blockchain**: Lisk Network (Ethereum-compatible)
- **Web3**: Ethers.js v6
- **Smart Contracts**: Solidity ^0.8.19
- **Build Tool**: Vite
- **Icons**: Lucide React

## 🔧 Development

### Project Structure:
```
src/
├── components/          # React components
├── hooks/              # Custom React hooks
├── config/             # Network and contract configuration
├── types/              # TypeScript type definitions
└── contracts/          # Smart contract source code
```

### Key Components:
- `useLiskContract`: Hook for smart contract interactions
- `NetworkStatus`: Network detection and switching
- `PollCard`: Individual poll display and voting
- `CreatePoll`: Poll creation interface

## 🌐 Network Details

### Lisk Mainnet:
- **Chain ID**: 1135
- **RPC URL**: https://rpc.api.lisk.com
- **Explorer**: https://blockscout.lisk.com
- **Currency**: LSK

### Lisk Sepolia Testnet:
- **Chain ID**: 4202
- **RPC URL**: https://rpc.sepolia-api.lisk.com
- **Explorer**: https://sepolia-blockscout.lisk.com
- **Currency**: ETH (Testnet)

## 🔐 Security Features

- **Vote Verification**: Each vote is cryptographically verified
- **Double Vote Prevention**: Smart contract prevents multiple votes per address
- **Time-based Security**: Polls automatically expire after set duration
- **Creator Controls**: Poll creators have administrative privileges
- **Emergency Controls**: Contract owner can pause problematic polls

## 🤝 Contributing

1. Fork the repository
2. Create a feature branch: `git checkout -b feature/amazing-feature`
3. Commit your changes: `git commit -m 'Add amazing feature'`
4. Push to the branch: `git push origin feature/amazing-feature`
5. Open a Pull Request

## 📄 License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

## 🙏 Acknowledgments

- Lisk Network team for the scalable blockchain infrastructure
- OpenZeppelin for smart contract security patterns
- React and Ethereum communities for excellent tooling

## 📞 Support

For support and questions:
- Create an issue on GitHub
- Join our Discord community
- Follow us on Twitter

---

**Built with ❤️ for the decentralized future of voting on Lisk Network**