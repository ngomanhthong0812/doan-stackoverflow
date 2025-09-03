const leaderboardService = require('../services/leaderboardService');

exports.getLeaderboard = async (req, res, next) => {
    try {
        const result = await leaderboardService.getLeaderboard();
        res.json(result);
    } catch (err) {
        next(err);
    }
};