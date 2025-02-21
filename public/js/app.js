// Remove imports, define networks at the top
const NETWORKS = {
    SEPOLIA: {
        name: 'Sepolia',
        rpc: 'https://eth-sepolia.public.blastapi.io',
        chainId: 11155111
    },
    ARBITRUM_TESTNET: {
        name: 'Arbitrum Testnet',
        rpc: 'https://sepolia-rollup.arbitrum.io/rpc',
        chainId: 421613
    },
    OPTIMISM_TESTNET: {
        name: 'Optimism Testnet',
        rpc: 'https://sepolia.optimism.io',
        chainId: 420
    }
};

class ChainReactionUI {
    constructor() {
        this.privateKeyInput = document.getElementById('privateKey');
        this.sendButton = document.getElementById('sendTransaction');
        this.recipientInput = document.getElementById('recipient');
        this.amountInput = document.getElementById('amount');
        
        this.networks = {
            sepolia: new ChainReaction(NETWORKS.SEPOLIA.rpc, NETWORKS.SEPOLIA.name),
            arbitrum: new ChainReaction(NETWORKS.ARBITRUM_TESTNET.rpc, NETWORKS.ARBITRUM_TESTNET.name),
            optimism: new ChainReaction(NETWORKS.OPTIMISM_TESTNET.rpc, NETWORKS.OPTIMISM_TESTNET.name)
        };

        this.setupEventListeners();
    }

    setupEventListeners() {
        // Initialize immediately on private key input
        this.privateKeyInput.addEventListener('input', () => this.initializeWallet());
        this.sendButton.addEventListener('click', () => this.sendTransactions());
        
        // Input validation
        this.recipientInput.addEventListener('input', (e) => {
            if (e.target.value && !ethers.utils.isAddress(e.target.value)) {
                e.target.classList.add('error');
            } else {
                e.target.classList.remove('error');
            }
        });

        // Announce status changes
        const announceStatus = (network, status) => {
            const announcement = `${network} network status: ${status}`;
            const ariaLive = document.createElement('div');
            ariaLive.setAttribute('role', 'status');
            ariaLive.setAttribute('aria-live', 'polite');
            ariaLive.classList.add('sr-only');
            ariaLive.textContent = announcement;
            document.body.appendChild(ariaLive);
            setTimeout(() => ariaLive.remove(), 1000);
        };

        // Add keyboard support for inputs
        this.recipientInput.addEventListener('keydown', (e) => {
            if (e.key === 'Enter') {
                this.amountInput.focus();
            }
        });

        this.amountInput.addEventListener('keydown', (e) => {
            if (e.key === 'Enter') {
                this.sendButton.focus();
            }
        });
    }

    async initializeWallet() {
        const privateKey = this.privateKeyInput.value.trim();
        if (!privateKey || privateKey.length !== 64) {
            // Reset network statuses
            Object.keys(this.networks).forEach(networkId => {
                const networkElement = document.getElementById(networkId);
                networkElement.querySelector('.status').textContent = 'Ready';
                networkElement.querySelector('.balance').textContent = 'Balance: -- ETH';
            });
            return;
        }

        // Initialize all networks
        for (const [networkId, reaction] of Object.entries(this.networks)) {
            const networkElement = document.getElementById(networkId);
            const statusElement = networkElement.querySelector('.status');
            
            try {
                statusElement.textContent = 'Connecting...';
                const address = await reaction.initialize(privateKey);
                await reaction.updateBalance(address, networkId);
                statusElement.textContent = 'Connected';
                statusElement.className = 'status success';
            } catch (error) {
                console.error(`Error initializing ${networkId}:`, error);
                statusElement.textContent = 'Error';
                statusElement.className = 'status error';
            }
        }
    }

    async sendTransactions() {
        const recipient = this.recipientInput.value;
        const amount = this.amountInput.value;

        // Validation
        if (!recipient || !ethers.utils.isAddress(recipient)) {
            alert('Please enter a valid recipient address');
            return;
        }

        if (!amount || amount <= 0) {
            alert('Please enter a valid amount');
            return;
        }

        this.sendButton.disabled = true;
        const fuseLine = document.querySelector('.fuse-line');
        const congratsMessage = document.getElementById('congratsMessage');
        congratsMessage.style.display = 'none';
        fuseLine.classList.remove('burning');
        
        try {
            // Execute transactions in sequence
            for (const [networkId, reaction] of Object.entries(this.networks)) {
                const networkElement = document.getElementById(networkId);
                const statusElement = networkElement.querySelector('.status');
                
                try {
                    statusElement.textContent = 'Pending';
                    statusElement.className = 'status pending';
                    
                    const receipt = await reaction.sendTransaction(recipient, amount);
                    
                    // Update balance after transaction
                    await reaction.updateBalance(receipt.from, networkId);
                    
                    statusElement.textContent = 'Success';
                    statusElement.className = 'status success';
                    networkElement.classList.add('boom');
                    
                    // Advance the fuse
                    fuseLine.classList.add('burning');
                } catch (error) {
                    console.error(`Error in ${networkId} transaction:`, error);
                    statusElement.textContent = 'Failed';
                    statusElement.className = 'status error';
                    break;
                }
            }

            // Show congratulations if all transactions succeeded
            const allSuccess = Array.from(document.querySelectorAll('.status'))
                .every(el => el.classList.contains('success'));
            
            if (allSuccess) {
                congratsMessage.style.display = 'block';
            }
        } finally {
            this.sendButton.disabled = false;
        }
    }
} 