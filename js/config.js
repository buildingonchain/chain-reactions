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

// Example addresses for testing
export const TEST_RECIPIENT = '0xb2fe5d749254211c83e20120dC3731FEC57Fc784'; 