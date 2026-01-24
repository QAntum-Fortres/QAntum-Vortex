import { Logger } from '../utils/Logger';

interface Agent {
    name: string;
    role: string;
    start: () => Promise<void>;
}

export class SwarmQueen {
    private agents: Map<string, Agent> = new Map();
    private logger: Logger;

    constructor() {
        this.logger = Logger.getInstance();
        this.initializeSwarm();
    }

    private initializeSwarm() {
        this.registerAgent('INTELLIGENCE', 'Brain');
        this.registerAgent('OMEGA', 'Time Keepers');
        this.registerAgent('PHYSICS', 'Optimization');
        this.registerAgent('FORTRESS', 'Security');
        this.registerAgent('BIOLOGY', 'Evolution');
        this.registerAgent('GUARDIANS', 'Health');
        this.registerAgent('REALITY', 'Revenue');
        this.registerAgent('CHEMISTRY', 'Integration');
    }

    private registerAgent(name: string, role: string) {
        this.agents.set(name, {
            name,
            role,
            start: async () => {
                this.logger.log(`[SWARM] ${name} (${role}) activated.`);
            }
        });
    }

    public async awaken(): Promise<void> {
        this.logger.log('👑 THE SWARM QUEEN IS AWAKENING...');

        for (const agent of this.agents.values()) {
            await agent.start();
        }

        this.logger.log('🐝 SWARM OPERATIONAL. HIVE MIND ACTIVE.');
    }
}
