const redis = require('../utils/redis');

const cacheService = {
    async get(key) {
        const cached = await redis.get(key);
        return cached ? JSON.parse(cached) : null;
    },

    async set(key, data, ttl = 60) {
        await redis.set(key, JSON.stringify(data), 'EX', ttl);
    },

    async del(key) {
        await redis.del(key);
    }
};

module.exports = cacheService;
