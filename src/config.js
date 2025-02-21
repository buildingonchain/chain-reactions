import dotenv from 'dotenv';
import { readFileSync } from 'fs';

// Force reload the .env file
const envConfig = dotenv.parse(readFileSync('.env'));
console.log('Raw .env file contents:', envConfig);

// Debug private key format
const rawPrivateKey = envConfig.PRIVATE_KEY || process.env.PRIVATE_KEY;
console.log('Private key debug:', {
    fromEnvConfig: envConfig.PRIVATE_KEY,
    fromProcessEnv: process.env.PRIVATE_KEY,
    final: rawPrivateKey
});

export const NETWORKS = {
  SEPOLIA: {
    name: 'Sepolia',
    rpc: 'https://eth-sepolia.public.blastapi.io',
    chainId: 11155111,
    symbol: 'ETH',
    decimals: 18
  },
  ARBITRUM_TESTNET: {
    name: 'Arbitrum Testnet',
    rpc: 'https://sepolia-rollup.arbitrum.io/rpc',
    chainId: 421613,
    symbol: 'ETH',
    decimals: 18
  },
  OPTIMISM_TESTNET: {
    name: 'Optimism Testnet',
    rpc: 'https://sepolia.optimism.io',
    chainId: 420,
    symbol: 'ETH',
    decimals: 18
  }
};

// Direct values for testing - in production these would come from environment variables
export const PRIVATE_KEY = '40cab98fe5ab1e0fddaab0cad0c08d593f5610a48ced74524fc5555d1b2c1e8b';
export const TEST_RECIPIENT = '0xb2fe5d749254211c83e20120dC3731FEC57Fc784'; 