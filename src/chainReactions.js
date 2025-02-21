import { EVM } from "@kynesyslabs/demosdk/xm-websdk";
import { DemosWork } from "@kynesyslabs/demosdk/demoswork";
import { ethers } from 'ethers';
import dotenv from 'dotenv';

dotenv.config();

export class ChainReaction {
  constructor(rpcUrl, chainName) {
    if (!rpcUrl) throw new Error('RPC URL is required');
    if (!chainName) throw new Error('Chain name is required');
    
    this.rpcUrl = rpcUrl;
    this.chainName = chainName;
    this.instance = null;
    this.work = new DemosWork();
  }

  async initialize(privateKey) {
    try {
      if (!privateKey) throw new Error('Private key is required');
      
      console.log(`Initializing ${this.chainName} with RPC: ${this.rpcUrl}`);
      this.instance = await EVM.create(this.rpcUrl);
      await this.instance.connectWallet(privateKey);
      
      const address = this.instance.getAddress();
      console.log(`${this.chainName} handler initialized with address: ${address}`);
      
      const balance = await this.getBalance(address);
      console.log(`${this.chainName} balance: ${balance} ETH`);
    } catch (error) {
      console.error(`Error initializing ${this.chainName}:`, error);
      throw error;
    }
  }

  createTransactionStep(recipientAddress, amount) {
    return {
      id: `step_${this.chainName}_tx`,
      context: "xm",
      content: {
        chain: this.chainName,
        to: recipientAddress,
        value: ethers.utils.parseEther(amount.toString()),
        gasLimit: 21000
      },
      description: `Send ${amount} ETH on ${this.chainName} to ${recipientAddress}`,
      critical: true,
      depends_on: []
    };
  }

  async sendTransaction(recipientAddress, amount) {
    try {
      if (!this.instance) throw new Error('Chain reaction not initialized');
      if (!recipientAddress) throw new Error('Recipient address is required');
      if (!amount) throw new Error('Amount is required');

      // Check balance before sending
      const senderAddress = this.instance.getAddress();
      const balance = await this.getBalance(senderAddress);
      const amountInEth = parseFloat(amount);
      
      if (balance < amountInEth) {
        throw new Error(`Insufficient balance on ${this.chainName}. Have: ${balance} ETH, Need: ${amountInEth} ETH`);
      }

      // Create and send transaction
      const provider = new ethers.providers.JsonRpcProvider(this.rpcUrl);
      const wallet = new ethers.Wallet(this.instance.wallet.privateKey, provider);
      
      console.log(`\nSending ${amount} ETH on ${this.chainName} to ${recipientAddress}`);
      const tx = await wallet.sendTransaction({
        to: recipientAddress,
        value: ethers.utils.parseEther(amount.toString()),
        gasLimit: 21000
      });
      console.log(`${this.chainName} transaction sent:`, tx.hash);

      // Wait for confirmation
      const receipt = await tx.wait();
      console.log(`${this.chainName} transaction confirmed in block:`, receipt.blockNumber);

      return receipt;
    } catch (error) {
      console.error(`Error in ${this.chainName} transaction:`, error);
      throw error;
    }
  }

  async getBalance(address) {
    if (!this.instance) throw new Error('Chain reaction not initialized');
    return await this.instance.getBalance(address);
  }

  async waitForConfirmation(txHash) {
    return new Promise((resolve) => {
      const checkConfirmation = async () => {
        try {
          if (!txHash) {
            throw new Error('Transaction hash is undefined');
          }
          const provider = new ethers.providers.JsonRpcProvider(this.rpcUrl);
          const receipt = await provider.getTransactionReceipt(txHash);
          if (receipt) {
            console.log(`Transaction confirmed on ${this.chainName}:`, {
              hash: receipt.transactionHash,
              from: receipt.from,
              to: receipt.to,
              blockNumber: receipt.blockNumber
            });
            resolve(receipt);
          } else {
            setTimeout(checkConfirmation, 5000);
          }
        } catch (error) {
          console.error(`Error checking confirmation on ${this.chainName}:`, error);
          setTimeout(checkConfirmation, 5000);
        }
      };
      checkConfirmation();
    });
  }
} 