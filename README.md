# Chain Reactions ⛓️🧨

A cross-chain transaction tool that allows you to send transactions across Ethereum, Arbitrum, and Optimism networks simultaneously.

## Features
- Send transactions to multiple networks in one click
- Visual transaction status tracking with burning fuse animation
- Real-time balance updates
- Accessible and keyboard-friendly interface

## Getting Started
1. Visit [your-app-url]
2. Get test ETH from these faucets:
   - [Ethereum Sepolia Faucet](https://sepoliafaucet.com/)
   - [Arbitrum Sepolia Faucet](https://www.alchemy.com/faucets/arbitrum-sepolia)
   - [Optimism Sepolia Faucet](https://app.optimism.io/faucet)
3. Enter your private key
4. Enter recipient address and amount
5. Click "Send Transactions" to start the chain reaction!

## Security Notice
- Only use test networks and test funds
- Never share your private keys
- Never use real/mainnet assets

## Features 🌟

- Sequential transactions across multiple chains (Sepolia, Arbitrum, Optimism)
- Balance verification before transactions
- Transaction confirmation tracking
- Clean, minimalist UI with dark mode
- Detailed transaction status and history
- Gas-optimized transactions

## Prerequisites 📋

- Node.js v16 or higher
- Test ETH on:
  - Sepolia Testnet
  - Arbitrum Sepolia
  - Optimism Sepolia

## Quick Start 🚀

1. Clone the repository:
```bash
git clone https://github.com/yourusername/chain-reactions.git
cd chain-reactions
```

2. Install dependencies:
```bash
npm install
```

3. Configure your environment:
   - Copy `.env.example` to `.env`
   - Add your private key and recipient address

4. Run the application:
```bash
# CLI Version
npm start

# Web Version
npm run web
```

## Network Configuration 🌐

The application supports the following testnets:

- **Sepolia**
  - RPC: https://eth-sepolia.public.blastapi.io
  - ChainID: 11155111

- **Arbitrum Testnet**
  - RPC: https://sepolia-rollup.arbitrum.io/rpc
  - ChainID: 421613

- **Optimism Testnet**
  - RPC: https://sepolia.optimism.io
  - ChainID: 420

## Usage 💡

### CLI Version
The CLI version executes transactions sequentially across all configured networks:

```javascript
// Execute transactions in sequence
await sepoliaReaction.sendTransaction(TEST_RECIPIENT, '0.005');
await arbitrumReaction.sendTransaction(TEST_RECIPIENT, '0.005');
await optimismReaction.sendTransaction(TEST_RECIPIENT, '0.005');
```

### Web Version
The web interface provides a user-friendly way to:
1. Connect your wallet
2. Set recipient address
3. Specify amount
4. Execute transactions
5. Monitor transaction status

## Architecture 🏗️

### Core Components

- **ChainReaction Class**: Handles individual chain interactions
  - Transaction creation and sending
  - Balance checking
  - Transaction confirmation tracking

- **Network Configuration**: Centralized network definitions
  - RPC endpoints
  - Chain IDs
  - Network-specific parameters

### Transaction Flow

1. **Initialization**
   - Connect to networks
   - Verify wallet connection
   - Check balances

2. **Transaction Execution**
   - Create transaction
   - Send and wait for confirmation
   - Verify success

3. **Error Handling**
   - Balance verification
   - Transaction failure recovery
   - Network-specific error handling

## Security 🔒

- Private keys should never be hardcoded
- Use environment variables for sensitive data
- Implement proper error handling
- Verify transaction parameters before sending

## Development 👨‍💻

### Running Tests
```bash
npm test
```

### Building for Production
```bash
npm run build
```

## Contributing 🤝

1. Fork the repository
2. Create your feature branch
3. Commit your changes
4. Push to the branch
5. Create a Pull Request

## License 📄

MIT License - see LICENSE file for details

## Development
To run locally:
```bash
# Using Python's built-in server
python -m http.server 8080

# Or using Node's http-server
npx http-server
```

## License
MIT