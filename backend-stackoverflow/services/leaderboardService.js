const Question = require('../models/Question');
const Answer = require('../models/Answer');
const User = require('../models/User');
const cache = require('../services/cacheService');
const cacheKeys = require('../utils/cacheKeys');

exports.getTopQuestionsByUpvotes = async () => {
    return await Question.find()
        .sort({ upvotes: -1 })
        .limit(3)
        .populate('author', 'username avatar createdAt')
        .lean();
};

exports.getTopQuestionsByAnswers = async () => {
    return await Question.find()
        .sort({ answersCount: -1 })
        .limit(3)
        .populate('author', 'username avatar createdAt')
        .lean();
};

exports.getTopUsersByQuestions = async () => {
    const agg = await Question.aggregate([
        { $group: { _id: '$author', questionCount: { $sum: 1 } } },
        { $sort: { questionCount: -1 } },
        { $limit: 3 },
        {
            $lookup: {
                from: 'users',
                localField: '_id',
                foreignField: '_id',
                as: 'user'
            }
        },
        { $unwind: '$user' },
        {
            $project: {
                _id: '$user._id',
                username: '$user.username',
                avatar: '$user.avatar',
                createdAt: '$user.createdAt',
                questionCount: 1
            }
        }
    ]);
    return agg;
};

exports.getTopUsersByFollowers = async () => {
    return await User.aggregate([
        {
            $project: {
                username: 1,
                avatar: 1,
                createdAt: 1,
                followersCount: {
                    $cond: {
                        if: { $isArray: '$followers' },
                        then: { $size: '$followers' },
                        else: 0
                    }
                }
            }

        },
        { $sort: { followersCount: -1 } },
        { $limit: 3 }
    ]);
};

exports.getTopAnswersByLikes = async () => {
    const top = await Answer.aggregate([
        {
            $project: {
                content: 1,
                likeCount: { $size: '$likes' },
                author: 1
            }
        },
        { $sort: { likeCount: -1 } },
        { $limit: 3 }
    ]);

    return await Answer.populate(top, { path: 'author', select: 'username avatar createdAt' });
};

exports.getLeaderboard = async () => {
    const cached = await cache.get(cacheKeys.leaderboard);
    if (cached) return cached;

    const result = {
        topQuestionsByUpvotes: await exports.getTopQuestionsByUpvotes(),
        topQuestionsByAnswers: await exports.getTopQuestionsByAnswers(),
        topUsersByQuestions: await exports.getTopUsersByQuestions(),
        topUsersByFollowers: await exports.getTopUsersByFollowers(),
        topAnswersByLikes: await exports.getTopAnswersByLikes(),
    };
    console.log('[DEBUG] Đang lưu leaderboard vào Redis...');

    await cache.set(cacheKeys.leaderboard, result, 120); // TTL = 2 phút
    console.log('[DEBUG] Lưu leaderboard thành công vào Redis');

    return result;
};