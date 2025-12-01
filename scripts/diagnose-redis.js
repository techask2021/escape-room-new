/**
 * Redis Cache Diagnostic Tool
 * 
 * This file helps diagnose and test Redis cache issues
 * Run: `node scripts/diagnose-cache.js` (after building)
 */

const https = require('https');

// Configuration
const UPSTASH_URL = process.env.UPSTASH_REDIS_REST_URL || '';
const UPSTASH_TOKEN = process.env.UPSTASH_REDIS_REST_TOKEN || '';
const CACHE_SECRET = process.env.CACHE_INVALIDATION_SECRET || '';

console.log('🔍 Redis Cache Diagnostic Tool\n');

// Test 1: Environment Variables
console.log('1️⃣  Environment Variables Check:');
if (!UPSTASH_URL) {
    console.log('❌ UPSTASH_REDIS_REST_URL is missing');
} else {
    console.log('✅ UPSTASH_REDIS_REST_URL is set');
}

if (!UPSTASH_TOKEN) {
    console.log('❌ UPSTASH_REDIS_REST_TOKEN is missing');
} else {
    console.log('✅ UPSTASH_REDIS_REST_TOKEN is set');
}

if (!CACHE_SECRET) {
    console.log('⚠️  CACHE_INVALIDATION_SECRET is missing (not critical)');
} else {
    console.log('✅ CACHE_INVALIDATION_SECRET is set');
}

// Test 2: Connection Test
console.log('\n2️⃣  Connection Test:');
async function testConnection() {
    try {
        const response = await redisCommand('PING');
        console.log('✅ Redis connection successful');
        console.log(`   Response: ${response}`);
    } catch (error) {
        console.log('❌ Redis connection failed');
        console.log(`   Error: ${error.message}`);
    }
}

// Test 3: Memory Stats
console.log('\n3️⃣  Memory Usage:');
async function checkMemory() {
    try {
        const response = await redisCommand('INFO MEMORY');
        const lines = response.split('\r\n');
        const used = lines.find(l => l.startsWith('used_memory_human'));
        const maxMemory = lines.find(l => l.startsWith('maxmemory_human'));
        
        if (used) console.log(`✅ ${used}`);
        if (maxMemory) console.log(`   ${maxMemory}`);
    } catch (error) {
        console.log('❌ Could not fetch memory info');
    }
}

// Test 4: Key Count
console.log('\n4️⃣  Cache Keys:');
async function countKeys() {
    try {
        const all = await redisCommand('DBSIZE');
        const rooms = await redisCommand('KEYS escape-rooms:*');
        const blog = await redisCommand('KEYS blog:*');
        
        console.log(`✅ Total keys: ${all}`);
        console.log(`   Room cache keys: ${rooms.split(',').length}`);
        console.log(`   Blog cache keys: ${blog.split(',').length}`);
    } catch (error) {
        console.log('❌ Could not fetch key count');
    }
}

// Test 5: Sample Data
console.log('\n5️⃣  Sample Data Test:');
async function testSampleData() {
    try {
        const testKey = 'test:diagnostic:' + Date.now();
        const testData = { test: 'data', timestamp: new Date().toISOString() };
        
        // Write
        await redisCommand('SET', [testKey, JSON.stringify(testData)]);
        console.log('✅ Successfully wrote test data to Redis');
        
        // Read
        const retrieved = await redisCommand('GET', [testKey]);
        console.log(`✅ Successfully read test data from Redis`);
        
        // Delete
        await redisCommand('DEL', [testKey]);
        console.log('✅ Successfully deleted test data');
    } catch (error) {
        console.log('❌ Sample data test failed');
        console.log(`   Error: ${error.message}`);
    }
}

// Redis Command Helper
function redisCommand(command, args = []) {
    return new Promise((resolve, reject) => {
        const url = new URL(UPSTASH_URL);
        const path = `/` + [command, ...args].join('/');
        
        const options = {
            hostname: url.hostname,
            port: url.port || 443,
            path: path,
            method: 'GET',
            headers: {
                'Authorization': `Bearer ${UPSTASH_TOKEN}`,
                'Content-Type': 'application/json',
            },
        };

        const req = https.request(options, (res) => {
            let data = '';
            res.on('data', chunk => data += chunk);
            res.on('end', () => {
                try {
                    const json = JSON.parse(data);
                    resolve(json.result || json);
                } catch {
                    resolve(data);
                }
            });
        });

        req.on('error', reject);
        req.setTimeout(5000, () => {
            req.destroy();
            reject(new Error('Request timeout'));
        });
        req.end();
    });
}

// Run all tests
async function runDiagnostics() {
    try {
        await testConnection();
        await checkMemory();
        await countKeys();
        await testSampleData();
        
        console.log('\n✅ Diagnostic complete!\n');
    } catch (error) {
        console.error('\n❌ Diagnostic failed:', error);
    }
}

// Run if executed directly
if (require.main === module) {
    runDiagnostics();
}

module.exports = { testConnection, checkMemory, countKeys, testSampleData };
