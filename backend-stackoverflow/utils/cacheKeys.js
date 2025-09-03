const cacheKeys = {
    allUsers: 'cache:allUsers',
    leaderboard: 'leaderboard:global',
    popularTags: 'tags:popular',
    publicProfile: (userId) => `profile:${userId}`,
    questionSearch: (tag = 'all', sort = 'new', q = '') =>
        `search:${tag}:${sort}:${q}`,
};

module.exports = cacheKeys;
