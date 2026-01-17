import { SystemOrchestrator } from './core/orchestration/SystemOrchestrator';

async function main() {
    console.log(`
╔═══════════════════════════════════════════════════════════════════════════════╗
║                                                                               ║
║                        🌌 VORTEX GENESIS ACTIVATION 🌌                         ║
║                                                                               ║
╚═══════════════════════════════════════════════════════════════════════════════╝
    `);

    const orchestrator = new SystemOrchestrator();

    try {
        await orchestrator.awaken();

        console.log(`
╔═══════════════════════════════════════════════════════════════════════════════╗
║                          ✨ GENESIS COMPLETE ✨                               ║
║                  The Bio-Digital Organism is now ONLINE.                      ║
╚═══════════════════════════════════════════════════════════════════════════════╝
        `);
    } catch (error) {
        console.error('❌ FATAL ERROR DURING GENESIS:', error);
        process.exit(1);
    }
}

main().catch(console.error);
