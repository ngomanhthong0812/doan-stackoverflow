const statsService = require("../services/statsService");

exports.getStats = async (req, res, next) => {
  try {
    const tags = await statsService.getStats();
    res.json(tags);
  } catch (err) {
    next(err);
  }
};
