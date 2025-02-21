class ChainReaction {
    constructor(rpcUrl, chainName) {
        if (!rpcUrl) throw new Error('RPC URL is required');
        if (!chainName) throw new Error('Chain name is required');
        
        this.rpcUrl = rpcUrl;
        this.chainName = chainName;
        this.instance = null;
        this.demos = null;
    }

    async initialize(privateKey) {
        try {
            if (!privateKey) throw new Error('Private key is required');
            
            // Debug SDK loading
            console.log('DemosSDK:', window.DemosSDK);
            console.log('Demos:', window.Demos);
            console.log('Available globals:', Object.keys(window));
            
            // Add 0x prefix if not present
            const formattedKey = privateKey.startsWith('0x') ? privateKey : `0x${privateKey}`;
            
            console.log(`[${this.chainName}] Initializing with RPC:`, this.rpcUrl);
            
            // Initialize EVM instance
            if (!window.DemosSDK || !window.DemosSDK.EVM) {
                throw new Error('DemosSDK not properly loaded');
            }
            
            this.instance = await window.DemosSDK.EVM.create(this.rpcUrl);
            await this.instance.connectWallet(formattedKey);

            // Initialize Demos connection
            this.demos = new window.Demos();
            await this.demos.connect("https://demosnode.discus.sh");
            const publicKey = await this.demos.connectWallet(formattedKey);
            console.log(`[${this.chainName}] Connected to Demos node with public key:`, publicKey);
            
            // Get wallet address
            const address = this.instance.getAddress();
            console.log(`[${this.chainName}] Wallet initialized with address:`, address);
            
            // Get and display initial balance
            const balance = await this.getBalance(address);
            console.log(`[${this.chainName}] Initial balance:`, balance, 'ETH');

            return address;
        } catch (error) {
            console.error(`[${this.chainName}] Initialization failed:`, error);
            throw error;
        }
    }

    async sendTransaction(recipientAddress, amount) {
        try {
            if (!this.instance || !this.demos) throw new Error('Chain reaction not initialized');
            
            console.log(`[${this.chainName}] Starting transaction process...`);
            
            // First prepare and send the chain transaction
            const preparedTx = await this.instance.preparePay(recipientAddress, amount);
            const result = await this.instance.sendSignedTransaction(preparedTx);
            console.log(`[${this.chainName}] Chain transaction sent:`, result);

            // Create and broadcast Demos transaction
            try {
                const tx = {
                    hash: result.hash || result.transactionHash,
                    chain: this.chainName.toLowerCase(),
                    type: 'transfer',
                    from: this.instance.getAddress(),
                    to: recipientAddress,
                    value: ethers.utils.parseEther(amount.toString()).toString()
                };

                // Two-step broadcast process
                const validityData = await this.demos.confirm(tx);
                console.log(`[${this.chainName}] Demos transaction confirmed:`, validityData);

                const demosTx = await this.demos.broadcast(validityData);
                console.log(`[${this.chainName}] Demos transaction broadcast:`, demosTx);
                
                return {
                    hash: result.hash || result.transactionHash,
                    demosHash: demosTx.id || demosTx.hash,
                    from: this.instance.getAddress(),
                    to: recipientAddress
                };
            } catch (demoserr) {
                console.warn(`[${this.chainName}] Demos broadcast failed:`, demoserr);
                return {
                    hash: result.hash || result.transactionHash,
                    from: this.instance.getAddress(),
                    to: recipientAddress
                };
            }
        } catch (error) {
            console.error(`[${this.chainName}] Transaction failed:`, error);
            throw error;
        }
    }

    async getBalance(address) {
        try {
            if (!this.instance) throw new Error('Chain reaction not initialized');
            const balance = await this.instance.getBalance(address);
            return parseFloat(balance).toFixed(6); // Format to 6 decimal places
        } catch (error) {
            console.error(`[${this.chainName}] Balance check failed:`, error);
            throw error;
        }
    }

    async updateBalance(address, elementId) {
        try {
            const balance = await this.getBalance(address);
            const element = document.getElementById(elementId);
            if (element) {
                element.querySelector('.balance').textContent = `Balance: ${balance} ETH`;
            }
            return balance;
        } catch (error) {
            console.error(`[${this.chainName}] Balance update failed:`, error);
            throw error;
        }
    }
} 