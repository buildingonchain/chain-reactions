// Create SDK implementation
window.DemosSDK = {
    EVM: {
        async create(rpcUrl) {
            const provider = new ethers.providers.JsonRpcProvider(rpcUrl);
            return {
                provider,
                wallet: null,
                async connectWallet(privateKey) {
                    this.wallet = new ethers.Wallet(privateKey, this.provider);
                },
                getAddress() {
                    return this.wallet.address;
                },
                async getBalance(address) {
                    const balance = await this.provider.getBalance(address);
                    return ethers.utils.formatEther(balance);
                },
                async preparePay(to, amount) {
                    return {
                        to,
                        value: ethers.utils.parseEther(amount.toString()),
                        gasLimit: 21000
                    };
                },
                async sendSignedTransaction(tx) {
                    const transaction = await this.wallet.sendTransaction(tx);
                    const receipt = await transaction.wait();
                    return receipt;
                }
            };
        }
    }
}; 