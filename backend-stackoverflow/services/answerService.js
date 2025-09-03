const Answer = require('../models/Answer');
const commentService = require('./commentService');
const User = require('../models/User');

exports.createAnswer = async ({ content, question, author, image }) => {
    const answer = await Answer.create({ content, question, author, image });
    await User.findByIdAndUpdate(author, { $inc: { reputation: 10 } });
    return answer;
};

exports.getAnswersByQuestion = async (questionId) => {
    return await Answer.find({ question: questionId })
        .populate('author', 'username avatar reputation')
        .sort({ createdAt: -1 });
};

exports.deleteAnswerById = async (answerId) => {
    const answer = await Answer.findById(answerId);
    if (!answer) return null;

    await commentService.deleteCommentsByAnswer(answerId);
    await Answer.findByIdAndDelete(answerId);

    return answer;
};

exports.toggleLike = async (answerId, userId) => {
    const answer = await Answer.findById(answerId);
    if (!answer) throw new Error('Answer not found');
    if (answer.author.toString() === userId.toString()) throw new Error('Không thể like bài của mình');

    const likeIndex = answer.likes.findIndex(like => like.user.toString() === userId.toString());
    let liked;
    if (likeIndex === -1) {
        // Chưa like -> thêm like
        answer.likes.push({ user: userId });
        liked = true;
        await User.findByIdAndUpdate(answer.author, { $inc: { reputation: 2 } });
    } else {
        // Đã like -> bỏ like
        answer.likes.splice(likeIndex, 1);
        liked = false;
        await User.findByIdAndUpdate(answer.author, { $inc: { reputation: -2 } });
    }
    await answer.save();
    return { liked, likeCount: answer.likes.length };
};

exports.getLikeHistory = async (answerId) => {
    const answer = await Answer.findById(answerId).populate('likes.user', 'username avatar');
    if (!answer) throw new Error('Answer not found');
    return answer.likes;
};

exports.updateAnswer = async (answerId, newContent, userId) => {
    const answer = await Answer.findById(answerId);
    if (!answer) throw new Error('NOT_FOUND');

    if (answer.author.toString() !== userId.toString()) {
        throw new Error('FORBIDDEN');
    }

    answer.content = newContent;
    await answer.save();

    return answer;
};

exports.getAllAnswers = async () => {
    return await Answer.find()
        .populate('author', 'username avatar reputation')
        .populate('question', 'title')
        .sort({ createdAt: -1 });
};

