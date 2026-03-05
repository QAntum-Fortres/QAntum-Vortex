import express from 'express';
import { WebSocketServer, WebSocket } from 'ws';
import http from 'http';
import path from 'path';

// --- Configuration ---
const PORT = process.env.PORT || 3000;

// --- Mock Metric Generator ---
class MockMetricGenerator {
  private startTime: number;

  constructor() {
    this.startTime = Date.now();
  }

  generate() {
    return {
      type: 'METRICS_UPDATE',
      timestamp: Date.now(),
      uptime: this.getUptime(),
      systemHealth: this.getSystemHealth(),
      activeModules: this.getActiveModules(),
      healingOperations: this.getHealingOperations(),
      livenessTokens: this.getLivenessTokens(),
      consensusRate: this.getConsensusRate(),
      apoptosisPhase: this.getApoptosisPhase(),
      securityThreats: this.getSecurityThreats()
    };
  }

  private getUptime() {
    const diff = Date.now() - this.startTime;
    return diff;
  }

  private getSystemHealth() {
    // 95% chance of being HEALTHY, 5% DEGRADED
    return Math.random() > 0.95 ? 'DEGRADED' : 'HEALTHY';
  }

  private getActiveModules() {
    // Fluctuate around 243
    return 240 + Math.floor(Math.random() * 10);
  }

  private getHealingOperations() {
    const domains = ['UI', 'NETWORK', 'LOGIC', 'DATABASE'];
    const domain = domains[Math.floor(Math.random() * domains.length)];
    const success = Math.random() > 0.05; // 95% success rate
    return {
      domain,
      success,
      durationMs: Math.floor(Math.random() * 500) + 100,
      totalAttempts: 1200 + Math.floor(Math.random() * 100)
    };
  }

  private getLivenessTokens() {
    return {
      issued: 1150 + Math.floor(Math.random() * 50),
      rejected: 40 + Math.floor(Math.random() * 10),
      recentType: Math.random() > 0.9 ? 'FORGED_ATTEMPT' : 'VALID_ISSUANCE'
    };
  }

  private getConsensusRate() {
    // Between 98.0% and 99.9%
    return (98 + Math.random() * 1.9).toFixed(2);
  }

  private getApoptosisPhase() {
    return Math.floor(Math.random() * 7) + 1;
  }

  private getSecurityThreats() {
      // Simulate blocked threats
      const threats = ['Forged Token', 'Replay Attack', 'ID Spoofing', 'Clock Skew'];
      const blocked = Math.random() > 0.7; // 30% chance of a threat event report
      return {
          detected: blocked,
          type: blocked ? threats[Math.floor(Math.random() * threats.length)] : null,
          action: 'BLOCKED'
      };
  }
}

// --- Server Setup ---
const app = express();
const server = http.createServer(app);
const wss = new WebSocketServer({ server });
const generator = new MockMetricGenerator();

// Serve static files
app.use(express.static(path.join(__dirname, '../public')));

// WebSocket handling
wss.on('connection', (ws) => {
  console.log('Client connected');

  // Send immediate update
  ws.send(JSON.stringify(generator.generate()));

  ws.on('close', () => {
    console.log('Client disconnected');
  });
});

// Broadcast loop
setInterval(() => {
  const data = generator.generate();
  const message = JSON.stringify(data);

  wss.clients.forEach((client) => {
    if (client.readyState === WebSocket.OPEN) {
      client.send(message);
    }
  });
}, 2000); // 2 seconds update interval

// Start server
server.listen(PORT, () => {
  console.log(`Server running on http://localhost:${PORT}`);
});
