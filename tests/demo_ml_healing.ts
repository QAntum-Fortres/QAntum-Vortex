import { VortexHealingNexus } from '../src/core/evolution/VortexHealingNexus';

async function runDemo() {
    console.log('╔════════════════════════════════════════════════════╗');
    console.log('║   VORTEX GENESIS: HEALING INTELLIGENCE DEMO        ║');
    console.log('╚════════════════════════════════════════════════════╝');

    const nexus = new VortexHealingNexus();

    // Initialize (Load Data + Train)
    console.log('\n[System] Initializing Neural Cores...');
    await nexus.initialize();

    // Scenario 1: Network Crash
    console.log('\n════════ SCENARIO 1: CRITICAL NETWORK FAILURE ════════');
    console.log('[Simulation] Agent reports sporadic connection drops and 502 errors.');
    await nexus.initiateHealing('NETWORK', { error: 'Connection timeout: 502 Bad Gateway from upstream' });

    // Scenario 2: UI Glitch
    console.log('\n════════ SCENARIO 2: UI LAYOUT REGRESSION ════════');
    console.log('[Simulation] Visual regression detected in Sovereign Market dashboard.');
    await nexus.initiateHealing('UI', { error: 'Visual regression detected: Element overlap in .trading-view' });

    // Scenario 3: Logic Bug
    console.log('\n════════ SCENARIO 3: LOGIC SYNTAX ERROR ════════');
    console.log('[Simulation] Production code threw a SyntaxError after hot-patch.');
    await nexus.initiateHealing('LOGIC', { error: 'SyntaxError: Unexpected token } in trade-executor.ts' });

    // Scenario 4: Database Deadlock
    console.log('\n════════ SCENARIO 4: DATABASE CONGESTION ════════');
    console.log('[Simulation] High contention causing deadlocks in order table.');
    await nexus.initiateHealing('DATABASE', { error: 'Deadlock detected during transaction commit' });

    console.log('\n╔════════════════════════════════════════════════════╗');
    console.log('║             DEMONSTRATION COMPLETE                 ║');
    console.log('╚════════════════════════════════════════════════════╝');
}

runDemo().catch(console.error);
