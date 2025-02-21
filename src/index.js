import { NETWORKS, PRIVATE_KEY, TEST_RECIPIENT } from './config.js';
import { ChainReaction } from './chainReactions.js';

async function main() {
    try {
        // Initialize chain reactions
        const sepoliaReaction = new ChainReaction(NETWORKS.SEPOLIA.rpc, NETWORKS.SEPOLIA.name);
        const arbitrumReaction = new ChainReaction(NETWORKS.ARBITRUM_TESTNET.rpc, NETWORKS.ARBITRUM_TESTNET.name);
        const optimismReaction = new ChainReaction(NETWORKS.OPTIMISM_TESTNET.rpc, NETWORKS.OPTIMISM_TESTNET.name);

        // Initialize all chains
        console.log('Initializing chains...');
        await Promise.all([
            sepoliaReaction.initialize(PRIVATE_KEY),
            arbitrumReaction.initialize(PRIVATE_KEY),
            optimismReaction.initialize(PRIVATE_KEY)
        ]);

        // Execute transactions in sequence
        console.log('\nExecuting chain reactions...');
        
        // Sepolia -> Arbitrum -> Optimism
        await sepoliaReaction.sendTransaction(TEST_RECIPIENT, '0.005');
        await arbitrumReaction.sendTransaction(TEST_RECIPIENT, '0.005');
        await optimismReaction.sendTransaction(TEST_RECIPIENT, '0.005');

        console.log('\n🎉 All chain reactions completed successfully! 🎉');

    } catch (error) {
        console.error('\n❌ Error in chain reaction sequence:', error.message);
        process.exit(1);
    }
}

main(); 