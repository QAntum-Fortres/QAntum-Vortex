const fs = require('fs');
const path = require('path');

const DOMAINS = ['UI', 'NETWORK', 'LOGIC', 'DATABASE'];
const STRATEGIES = ['NeuralMapEngine', 'HydraNetwork', 'EvolutionaryHardening', 'Restart'];

const ERROR_PATTERNS = {
    'UI': ['Element not found', 'Visual regression detected', 'Layout shift', 'CSS selector failed'],
    'NETWORK': ['Connection timeout', 'ECONNREFUSED', '502 Bad Gateway', 'Socket hang up'],
    'LOGIC': ['SyntaxError: Unexpected token', 'TypeError: undefined is not a function', 'ReferenceError', 'Stack overflow'],
    'DATABASE': ['Connection pool exhausted', 'Deadlock detected', 'Constraint violation', 'Query timeout']
};

const SUCCESS_RATES = {
    'UI': { 'NeuralMapEngine': 0.95, 'Restart': 0.3, 'HydraNetwork': 0.0, 'EvolutionaryHardening': 0.1 },
    'NETWORK': { 'HydraNetwork': 0.98, 'Restart': 0.5, 'NeuralMapEngine': 0.0, 'EvolutionaryHardening': 0.0 },
    'LOGIC': { 'EvolutionaryHardening': 0.92, 'Restart': 0.4, 'NeuralMapEngine': 0.0, 'HydraNetwork': 0.0 },
    'DATABASE': { 'Restart': 0.8, 'HydraNetwork': 0.2, 'NeuralMapEngine': 0.0, 'EvolutionaryHardening': 0.05 }
};

function generateData(count) {
    const data = [];
    const now = Date.now();

    for (let i = 0; i < count; i++) {
        const domain = DOMAINS[Math.floor(Math.random() * DOMAINS.length)];
        const errors = ERROR_PATTERNS[domain];
        const errorMessage = errors[Math.floor(Math.random() * errors.length)];

        // Randomly pick a strategy, but favor the "correct" ones slightly to simulate real history where we try good things more often
        // but for training data we want a mix to show what fails too.
        const strategy = STRATEGIES[Math.floor(Math.random() * STRATEGIES.length)];

        const successProb = SUCCESS_RATES[domain][strategy] || 0.1;
        const success = Math.random() < successProb;

        const duration = Math.floor(Math.random() * 1000) + 100;

        data.push({
            id: i + 1,
            module_id: `module-${Math.floor(Math.random() * 100)}`,
            domain: domain,
            success: success,
            duration_ms: duration,
            strategy: strategy,
            error_message: errorMessage,
            healed_at: new Date(now - Math.floor(Math.random() * 10000000000)).toISOString()
        });
    }
    return data;
}

const dataset = generateData(1000);
fs.writeFileSync(path.join(__dirname, '../data/healing_history.json'), JSON.stringify(dataset, null, 2));
console.log('Generated 1000 records in data/healing_history.json');
