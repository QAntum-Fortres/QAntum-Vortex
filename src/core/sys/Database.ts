export class Database {
    private static instance: Database;
    private store: Map<string, any> = new Map();

    private constructor() {}

    public static getInstance(): Database {
        if (!Database.instance) {
            Database.instance = new Database();
        }
        return Database.instance;
    }

    public async query(text: string, params: any[]): Promise<any> {
        // Mock implementation
        // console.log(`[DB] Executing: ${text}`, params);

        if (text.includes('UPDATE module_vitality')) {
            const moduleId = params[0];
            this.store.set(moduleId, { lastActive: new Date(), entropy: 0 });
            return { rowCount: 1 };
        }

        return { rows: [] };
    }
}
