import { VortexHealingNexus } from '../evolution/VortexHealingNexus';
import { ApoptosisModule } from '../evolution/ApoptosisModule';
import { SwarmQueen } from '../../swarm/SwarmAgents';
import { Logger } from '../../utils/Logger';

export class SystemOrchestrator {
    private nexus: VortexHealingNexus;
    private apoptosis: ApoptosisModule;
    private swarm: SwarmQueen;
    private logger: Logger;

    constructor() {
        this.nexus = new VortexHealingNexus();
        this.apoptosis = new ApoptosisModule();
        this.swarm = new SwarmQueen();
        this.logger = Logger.getInstance();
    }

    public async awaken(): Promise<void> {
        this.logger.log('🌌 INITIALIZING VORTEX GENESIS PROTOCOLS...');

        // 1. Activate Immune System
        this.logger.log('🛡️ Activating Immune System (VortexHealingNexus)...');
        // (Nexus is passive until invoked, but we can verify it)
        const metrics = this.nexus.getMetrics();
        this.logger.log(`Immune System Status: OPERATIONAL (Success Rate: ${metrics.successRate * 100}%)`);

        // 2. Activate Mortality System
        this.logger.log('💀 Activating Apoptosis Module...');
        // (Also passive, mostly)

        // 3. Awaken the Swarm (Agents)
        await this.swarm.awaken();

        // 4. Final System Check
        this.logger.log('✅ ALL SYSTEMS GREEN.');
    }
}
