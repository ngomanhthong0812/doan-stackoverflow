const Redis = require('ioredis');
require('dotenv').config();

const redis = new Redis(process.env.REDIS_URL);

// ✅ Chỉ log khi không chạy test
if (process.env.NODE_ENV !== 'test') {
    redis.on('connect', () => {
        console.log('✅ Redis connected');
    });

    redis.on('error', (err) => {
        console.error('❌ Redis connection error:', err);
    });
}
redis.close = async () => {
    await redis.quit();
};


module.exports = redis;
