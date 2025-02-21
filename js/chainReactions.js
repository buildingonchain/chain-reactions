class ChainReaction {
    constructor(rpcUrl, chainName) {
        if (!rpcUrl) throw new Error('RPC URL is required');
        if (!chainName) throw new Error('Chain name is required');
        
        this.rpcUrl = rpcUrl;
        this.chainName = chainName;
        this.instance = null;
        this.demos = null; // Add Demos instance
    }

    async initialize(privateKey) {
        try {
            if (!privateKey) throw new Error('Private key is required');
            
            // Add 0x prefix if not present
            const formattedKey = privateKey.startsWith('0x') ? privateKey : `0x${privateKey}`;
            
            console.log(`[${this.chainName}] Initializing with RPC:`, this.rpcUrl);
            
            // Initialize Demos SDK first
            this.demos = new window.DemosSDK({
                privateKey: formattedKey
            });
            console.log(`[${this.chainName}] Demos SDK initialized`);
            
            // Initialize EVM instance
            this.instance = await window.DemosSDK.EVM.create(this.rpcUrl);
            await this.instance.connectWallet(formattedKey);
            
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
            
            // Create Demos transaction first
            const demosTx = await this.demos.createTransaction({
                type: 'transfer',
                chain: this.chainName.toLowerCase(),
                from: this.instance.getAddress(),
                to: recipientAddress,
                value: ethers.utils.parseEther(amount.toString())
            });
            console.log(`[${this.chainName}] Demos transaction created:`, demosTx);

            // Then send chain transaction
            const preparedTx = await this.instance.preparePay(recipientAddress, amount);
            const result = await this.instance.sendSignedTransaction(preparedTx);
            console.log(`[${this.chainName}] Chain transaction sent:`, result);

            return {
                hash: result.hash || result.transactionHash,
                demosHash: demosTx.id, // Use demosTx.id for the hash
                from: this.instance.getAddress(),
                to: recipientAddress
            };
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