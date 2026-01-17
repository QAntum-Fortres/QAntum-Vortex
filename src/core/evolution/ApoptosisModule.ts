import * as crypto from 'crypto';
import { LivenessTokenManager } from './LivenessTokenManager';
import { Database } from '../sys/Database';
import { Logger } from '../../utils/Logger';

export class ApoptosisModule {
    private tokenManager: LivenessTokenManager;
    private db: Database;
    private logger: Logger;

    constructor() {
        this.tokenManager = LivenessTokenManager.getInstance();
        this.db = Database.getInstance();
        this.logger = Logger.getInstance();
    }

    public async registerVitality(moduleId: string, livenessToken: string): Promise<void> {
        try {
            // 1. Parse token
            const decoded = Buffer.from(livenessToken, 'base64').toString('utf-8');
            const parts = decoded.split(':');

            if (parts.length !== 4) {
                throw new Error('Invalid token format');
            }

            const [tokenModuleId, timestampStr, status, providedSignature] = parts;

            // 2. Verify Module ID (prevents spoofing)
            if (tokenModuleId !== moduleId) {
                throw new Error(`Module ID mismatch: expected ${moduleId}, got ${tokenModuleId}`);
            }

            // 3. Validate Timestamp (prevents replay attacks)
            const tokenTimestamp = parseInt(timestampStr, 10);
            const now = Date.now();
            const tokenAgeMs = now - tokenTimestamp;
            const MAX_TOKEN_AGE_MS = 5 * 60 * 1000; // 5 minutes

            if (tokenAgeMs > MAX_TOKEN_AGE_MS) {
                throw new Error(`LivenessToken expired: ${tokenAgeMs / 1000}s old`);
            }

            if (tokenTimestamp > now + 60000) {
                throw new Error('LivenessToken from future - clock skew attack detected');
            }

            // 4. Verify HMAC Signature (prevents forgery)
            const secret = this.tokenManager.getSecret();
            const expectedSignature = crypto
                .createHmac('sha256', secret)
                .update(`${tokenModuleId}:${timestampStr}:${status}`)
                .digest('hex');

            if (providedSignature !== expectedSignature) {
                throw new Error('LivenessToken signature verification FAILED');
            }

            // 5. Reset entropy and update lastActive
            await this.db.query(
                `UPDATE module_vitality
                 SET last_active = NOW(), entropy_score = 0.0
                 WHERE module_id = $1`,
                [moduleId]
            );

            this.logger.log(`Vitality registered for ${moduleId}`);

        } catch (error) {
            this.logger.error(`Security Alert in ApoptosisModule`, error);
            throw error;
        }
    }
}
