export class Logger {
    private static instance: Logger;

    private constructor() {}

    public static getInstance(): Logger {
        if (!Logger.instance) {
            Logger.instance = new Logger();
        }
        return Logger.instance;
    }

    public log(message: string, context?: any): void {
        console.log(`[INFO] ${message}`, context ? JSON.stringify(context) : '');
    }

    public warn(message: string, context?: any): void {
        console.warn(`[WARN] ${message}`, context ? JSON.stringify(context) : '');
    }

    public error(message: string, context?: any): void {
        console.error(`[ERROR] ${message}`, context ? JSON.stringify(context) : '');
    }
}
