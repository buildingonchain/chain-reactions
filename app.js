import { ChainReaction } from '/src/chainReactions.js';
import { NETWORKS } from '/src/config.js';

class ChainReactionUI {
    constructor() {
        this.initializeElements();
        this.initializeEventListeners();
        this.reactions = {};
    }

    initializeElements() {
        this.privateKeyInput = document.getElementById('privateKey');
        this.recipientInput = document.getElementById('recipient');
        this.amountInput = document.getElementById('amount');
        this.startButton = document.getElementById('startReaction');
        this.statusBox = document.getElementById('status');
    }

    initializeEventListeners() {
        this.startButton.addEventListener('click', () => this.startChainReaction());
    }

    updateStatus(message, isError = false) {
        const statusElement = document.createElement('div');
        statusElement.textContent = message;
        statusElement.style.color = isError ? 'red' : 'black';
        this.statusBox.appendChild(statusElement);
        this.statusBox.scrollTop = this.statusBox.scrollHeight;
    }

    updateNetworkStatus(network, status, txHash = '') {
        const networkElement = document.querySelector(`.network.${network.toLowerCase()}`);
        const statusElement = networkElement.querySelector('.status');
        const txHashElement = networkElement.querySelector('.tx-hash');

        statusElement.className = `status ${status.toLowerCase()}`;
        statusElement.textContent = status;
        txHashElement.textContent = txHash;
    }

    async startChainReaction() {
        const privateKey = this.privateKeyInput.value;
        const recipient = this.recipientInput.value;
        const amount = this.amountInput.value;

        if (!privateKey || !recipient || !amount) {
            this.updateStatus('Please fill in all fields', true);
            return;
        }

        this.startButton.disabled = true;
        this.updateStatus('Starting chain reaction...');

        try {
            // Reset network statuses
            ['sepolia', 'arbitrum', 'optimism'].forEach(network => {
                this.updateNetworkStatus(network, 'pending', '');
            });

            this.updateStatus('Initializing connections...');
            
            // Initialize reactions with more detailed logging
            this.reactions.sepolia = new ChainReaction(NETWORKS.SEPOLIA.rpc, NETWORKS.SEPOLIA.name);
            this.reactions.arbitrum = new ChainReaction(NETWORKS.ARBITRUM_TESTNET.rpc, NETWORKS.ARBITRUM_TESTNET.name);
            this.reactions.optimism = new ChainReaction(NETWORKS.OPTIMISM_TESTNET.rpc, NETWORKS.OPTIMISM_TESTNET.name);

            // Initialize wallets with logging
            this.updateStatus('Connecting wallets...');
            await this.reactions.sepolia.initialize(privateKey);
            this.updateStatus('Sepolia wallet connected');
            
            await this.reactions.arbitrum.initialize(privateKey);
            this.updateStatus('Arbitrum wallet connected');
            
            await this.reactions.optimism.initialize(privateKey);
            this.updateStatus('Optimism wallet connected');

            // Check balance before proceeding
            const sepoliaBalance = await this.reactions.sepolia.getBalance(await this.reactions.sepolia.instance.getAddress());
            this.updateStatus(`Current Sepolia balance: ${sepoliaBalance} ETH`);

            // Execute transactions in sequence with more detailed logging
            await this.executeTransaction('sepolia', recipient, amount);
            await this.executeTransaction('arbitrum', recipient, amount);
            await this.executeTransaction('optimism', recipient, amount);

            this.updateStatus('🎉 You successfully managed to cause your first set of chain reactions! 🎉');
        } catch (error) {
            console.error('Chain reaction error:', error);
            this.updateStatus(`Error: ${error.message}`, true);
            this.updateNetworkStatus(error.network || 'all', 'error');
        } finally {
            this.startButton.disabled = false;
        }
    }

    async executeTransaction(network, recipient, amount) {
        try {
            this.updateStatus(`Preparing transaction on ${network}...`);
            this.updateNetworkStatus(network, 'pending');

            // Log the transaction parameters
            this.updateStatus(`Transaction details for ${network}:
                To: ${recipient}
                Amount: ${amount} ETH
            `);

            const tx = await this.reactions[network].sendTransaction(recipient, amount);
            this.updateStatus(`Transaction created on ${network}:`, tx);
            this.updateStatus(`Transaction sent on ${network}: ${tx.hash}`);
            this.updateNetworkStatus(network, 'pending', tx.hash);

            this.updateStatus(`Waiting for confirmation on ${network}...`);
            await this.reactions[network].waitForConfirmation(tx.hash);
            this.updateStatus(`Transaction confirmed on ${network}`);
            this.updateNetworkStatus(network, 'success', tx.hash);
        } catch (error) {
            this.updateStatus(`Error on ${network}: ${error.message}`, true);
            error.network = network;
            throw error;
        }
    }
}

// Initialize the UI when the page loads
window.addEventListener('load', () => {
    new ChainReactionUI();
}); 