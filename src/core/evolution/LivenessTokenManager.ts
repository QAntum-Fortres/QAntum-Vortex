import * as crypto from 'crypto';

export class LivenessTokenManager {
  private static instance: LivenessTokenManager;
  private readonly TOKEN_SECRET: string;

  private constructor() {
    // Priority: Environment variable > Ephemeral random
    this.TOKEN_SECRET = process.env.LIVENESS_TOKEN_SECRET ||
      crypto.randomBytes(32).toString('hex');

    if (!process.env.LIVENESS_TOKEN_SECRET) {
      console.warn('⚠️ LIVENESS_TOKEN_SECRET not set! Using ephemeral secret.');
      console.warn('⚠️ Tokens will become invalid on restart.');
    }
  }

  public static getInstance(): LivenessTokenManager {
    if (!LivenessTokenManager.instance) {
      LivenessTokenManager.instance = new LivenessTokenManager();
    }
    return LivenessTokenManager.instance;
  }

  public getSecret(): string {
    return this.TOKEN_SECRET;
  }
}
