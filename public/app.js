// Connect to WebSocket
const protocol = window.location.protocol === 'https:' ? 'wss:' : 'ws:';
const ws = new WebSocket(`${protocol}//${window.location.host}`);

// DOM Elements
const els = {
    systemHealth: document.getElementById('system-health'),
    healthIndicator: document.getElementById('health-indicator'),
    activeModules: document.getElementById('active-modules'),
    entropyScore: document.getElementById('entropy-score'),
    consensusRate: document.getElementById('consensus-rate'),
    livenessTokens: document.getElementById('liveness-tokens'),
    uptime: document.getElementById('uptime'),
    securityLog: document.getElementById('security-log')
};

// Charts Configuration
let healingChartInstance;
let vitalityChartInstance;

function initCharts() {
    // Healing Chart (Line)
    const ctxHealing = document.getElementById('healingChart').getContext('2d');
    healingChartInstance = new Chart(ctxHealing, {
        type: 'line',
        data: {
            labels: Array(10).fill(''),
            datasets: [{
                label: 'Healing Duration (ms)',
                data: Array(10).fill(0),
                borderColor: '#a855f7',
                backgroundColor: 'rgba(168, 85, 247, 0.1)',
                borderWidth: 2,
                tension: 0.4,
                fill: true
            }]
        },
        options: {
            responsive: true,
            plugins: { legend: { display: false } },
            scales: {
                y: { beginAtZero: true, grid: { color: 'rgba(255,255,255,0.05)' } },
                x: { grid: { display: false } }
            },
            animation: { duration: 0 }
        }
    });

    // Vitality Chart (Doughnut)
    const ctxVitality = document.getElementById('vitalityChart').getContext('2d');
    vitalityChartInstance = new Chart(ctxVitality, {
        type: 'doughnut',
        data: {
            labels: ['Healthy', 'Recovering', 'Critical'],
            datasets: [{
                data: [85, 10, 5],
                backgroundColor: ['#10b981', '#f59e0b', '#ef4444'],
                borderWidth: 0
            }]
        },
        options: {
            responsive: true,
            cutout: '70%',
            plugins: { legend: { position: 'bottom', labels: { color: '#94a3b8' } } }
        }
    });
}

// Format Time
function formatTime(ms) {
    const seconds = Math.floor((ms / 1000) % 60);
    const minutes = Math.floor((ms / (1000 * 60)) % 60);
    const hours = Math.floor((ms / (1000 * 60 * 60)) % 24);

    const pad = (n) => n.toString().padStart(2, '0');
    return `UPTIME: ${pad(hours)}:${pad(minutes)}:${pad(seconds)}`;
}

// WebSocket Event Handling
ws.onopen = () => {
    console.log('Connected to Vortex Genesis Hive Mind');
    initCharts();
};

ws.onmessage = (event) => {
    const data = JSON.parse(event.data);

    if (data.type === 'METRICS_UPDATE') {
        updateDashboard(data);
    }
};

ws.onclose = () => {
    console.log('Disconnected from Hive Mind');
    els.systemHealth.innerText = 'DISCONNECTED';
    els.healthIndicator.className = 'status-indicator critical';
};

function updateDashboard(data) {
    // 1. Update Text Stats
    els.systemHealth.innerText = data.systemHealth;
    els.healthIndicator.className = `status-indicator ${data.systemHealth.toLowerCase()}`;

    els.activeModules.innerText = data.activeModules;

    // Calculate pseudo-entropy based on active modules (just for visual variation)
    const entropy = (1 - (data.activeModules / 300)).toFixed(2);
    els.entropyScore.innerText = entropy;

    els.consensusRate.innerText = `${data.consensusRate}%`;
    els.livenessTokens.innerText = data.livenessTokens.issued;

    els.uptime.innerText = formatTime(data.uptime);

    // 2. Update Charts
    if (healingChartInstance) {
        // Shift data
        const currentData = healingChartInstance.data.datasets[0].data;
        currentData.shift();
        currentData.push(data.healingOperations.durationMs);
        healingChartInstance.update();
    }

    if (vitalityChartInstance) {
        // Randomly fluctuate distribution slightly based on system health
        if (data.systemHealth === 'HEALTHY') {
            vitalityChartInstance.data.datasets[0].data = [85, 10, 5];
        } else {
            vitalityChartInstance.data.datasets[0].data = [60, 30, 10];
        }
        vitalityChartInstance.update();
    }

    // 3. Update Security Log if threat detected
    if (data.securityThreats.detected) {
        const timestamp = new Date().toLocaleTimeString();
        const msg = `[${timestamp}] SECURITY ALERT: ${data.securityThreats.type} BLOCKED`;
        els.securityLog.innerText = msg;

        // Clear after 3 seconds
        setTimeout(() => {
            if (els.securityLog.innerText === msg) {
                els.securityLog.innerText = '';
            }
        }, 3000);
    }
}

// Particle Effect (Simplified)
const particlesContainer = document.getElementById('particles');
for (let i = 0; i < 50; i++) {
    const p = document.createElement('div');
    p.style.position = 'absolute';
    p.style.left = Math.random() * 100 + '%';
    p.style.top = Math.random() * 100 + '%';
    p.style.width = Math.random() * 4 + 'px';
    p.style.height = p.style.width;
    p.style.background = 'rgba(168, 85, 247, 0.3)';
    p.style.borderRadius = '50%';
    p.style.animation = `float ${10 + Math.random() * 20}s infinite linear`;
    particlesContainer.appendChild(p);
}

// Inject float keyframes
const styleSheet = document.createElement("style");
styleSheet.innerText = `
@keyframes float {
    0% { transform: translateY(0) translateX(0); opacity: 0; }
    50% { opacity: 0.5; }
    100% { transform: translateY(-100vh) translateX(20px); opacity: 0; }
}
`;
document.head.appendChild(styleSheet);
