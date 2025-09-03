const Question = require('../models/Question');
const Answer = require('../models/Answer');
const answerService = require('./answerService');
const User = require('../models/User');
const cacheKeys = require('../utils/cacheKeys');
const cache = require('../services/cacheService');
const Tag = require('../models/Tag'); // Thêm ở đầu


exports.createQuestion = async ({ title, content, tags, author, images }) => {
    const question = await Question.create({ title, content, tags, author, images });
    await User.findByIdAndUpdate(author, { $inc: { reputation: 5 } });
    await cache.del(cacheKeys.popularTags);
    return question;
};

exports.getAllQuestions = async () => {
    return await Question.find()
        .populate('author', 'username avatar reputation')
        .populate('tags')
        .sort({ createdAt: -1 });
};

exports.getQuestionById = async (id) => {
    return await Question.findById(id)
        .populate('author', 'username avatar')
        .populate('tags');
};

exports.incrementAnswersCount = async (questionId) => {
    return await Question.findByIdAndUpdate(
        questionId,
        { $inc: { answersCount: 1 } },
        { new: true }
    );
};

exports.incrementViews = async (questionId) => {
    return await Question.findByIdAndUpdate(
        questionId,
        { $inc: { views: 1 } },
        { new: true }
    );
};

exports.toggleUpvote = async (questionId, userId) => {
    const question = await Question.findById(questionId);
    if (!question) throw new Error('Question not found');

    const index = question.upvotes.indexOf(userId);

    if (index === -1) {
        question.upvotes.push(userId);
    } else {
        question.upvotes.splice(index, 1);
    }

    await question.save();

    return {
        upvoted: index === -1,
        count: question.upvotes.length,
    };
};

exports.updateQuestion = async (id, data, userId) => {
    const question = await Question.findById(id)
        .populate('author', 'username avatar')
        .populate('tags');
    if (!question) throw new Error('NOT_FOUND');

    if (question.author.toString() !== userId.toString()) {
        throw new Error('FORBIDDEN');
    }
    const updateQuestion = await Question.findByIdAndUpdate(id, data, { new: true });
    if (data.tags) {
        await cache.del(cacheKeys.popularTags);
    }
    return updateQuestion;
};

exports.deleteQuestion = async (id, user) => {
    const question = await Question.findById(id);
    if (!question) throw new Error('NOT_FOUND');

    const isOwner = question.author.toString() === user._id.toString();
    const isAdmin = user.role === 'admin';
    if (!isOwner && !isAdmin) throw new Error('FORBIDDEN');

    const answers = await Answer.find({ question: id });
    for (const answer of answers) {
        await answerService.deleteAnswerById(answer._id);
    }
    await question.deleteOne();
    await cache.del(cacheKeys.popularTags);

    return { deleted: true };
};
exports.searchQuestions = async ({ q, sortBy, tagName }) => {
    const tagKey = tagName || 'all';
    const sortKey = sortBy || 'new';
    const queryKey = q || '';

    const key = cacheKeys.questionSearch(tagKey, sortKey, queryKey);
    const cached = await cache.get(key);
    if (cached) return cached;

    const filter = {};

    if (tagName) {
        const tag = await Tag.findOne({ name: tagName });
        if (tag) {
            filter.tags = tag._id;
        } else {
            return [];
        }
    }

    if (q) {
        filter.title = { $regex: q, $options: 'i' };
    }

    let sortOption = { createdAt: -1 };
    if (sortBy === 'views') sortOption = { views: -1 };
    if (sortBy === 'votes') sortOption = { upvotesCount: -1 };

    const questions = await Question.aggregate([
        { $match: filter },
        {
            $addFields: {
                upvotesCount: { $size: '$upvotes' }
            }
        },
        { $sort: sortOption },
        { $limit: 50 }
    ]);

    await cache.set(key, questions, 60); // TTL: 60s
    return questions;
};


exports.getQuestionsByUserIfFollowed = async (currentUserId, targetUserId) => {
    const currentUser = await User.findById(currentUserId);

    const isFollowing = currentUser.following.includes(targetUserId);

    if (!isFollowing && currentUserId.toString() !== targetUserId.toString()) {
        throw new Error('NOT_ALLOWED');
    }

    const questions = await Question.find({ author: targetUserId })
        .populate('tags')
        .populate('author', 'username avatar reputation')
        .sort({ createdAt: -1 });

    return questions;
};
