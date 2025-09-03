const Report = require('../models/Report');
const Question = require('../models/Question');
const Answer = require('../models/Answer');
const Comment = require('../models/Comment');
const User = require('../models/User');
const questionService = require('./questionService');
const answerService = require('./answerService');
const commentService = require('./commentService');


exports.createReport = async ({ type, targetId, reason, reporter }) => {
    return await Report.create({ type, targetId, reason, reporter });
};

exports.getAllReports = async () => {
    return await Report.find().populate('reporter', 'username').sort({ createdAt: -1 });
};

exports.resolveReport = async (reportId, action) => {
    return await Report.findByIdAndUpdate(reportId, { status: action }, { new: true });
};

exports.handleViolation = async (report, adminUser) => {
    let contentAuthor = null;
    if (report.type === 'question') {
        const q = await Question.findById(report.targetId);
        if (!q) return;
        contentAuthor = q.author;
        await User.findByIdAndUpdate(contentAuthor, { $inc: { reputation: -10 } });
        await questionService.deleteQuestion(q._id, adminUser || { _id: 'admin', role: 'admin' });

    }
    if (report.type === 'answer') {
        const a = await Answer.findById(report.targetId);
        if (!a) return;
        contentAuthor = a.author;
        await User.findByIdAndUpdate(contentAuthor, { $inc: { reputation: -15 } });
        await answerService.deleteAnswerById(a._id);

    }
    if (report.type === 'comment') {
        const c = await Comment.findById(report.targetId);
        if (!c) return;
        contentAuthor = c.author;
        await User.findByIdAndUpdate(contentAuthor, { $inc: { reputation: -5 } });
        await commentService.deleteCommentRecursively(c._id);

    }
};

