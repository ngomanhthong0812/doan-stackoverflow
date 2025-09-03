const commentService = require('../services/commentService');
const Answer = require('../models/Answer'); // 👈 thêm ở đầu file nếu chưa có
const Comment = require('../models/Comment');

exports.createComment = async (req, res, next) => {
    try {
        const { content, answer, parentComment } = req.body;
        const image = req.file?.path || null;

        const comment = await commentService.createComment({
            content,
            answer,
            parentComment: parentComment || null,
            author: req.user._id,
            image
        });

        if (!parentComment) {
            await Answer.findByIdAndUpdate(answer, { $inc: { commentsCount: 1 } });
        }

        res.status(201).json(comment);
    } catch (err) {
        next(err);
    }
};

exports.getCommentsByAnswer = async (req, res, next) => {
    try {
        const comments = await commentService.getCommentsByAnswer(req.params.answerId);
        res.json(comments);
    } catch (err) {
        next(err);
    }
};

exports.deleteComment = async (req, res, next) => {
    try {
        const commentId = req.params.id;

        const comment = await Comment.findById(commentId);
        if (!comment) return res.status(404).json({ message: 'Comment not found' });


        await commentService.deleteCommentRecursively(commentId);

        await commentService.decreaseAnswerCommentCountIfRoot(comment);


        res.json({ message: 'Comment deleted successfully' });
    } catch (err) {
        next(err);
    }
};

exports.toggleLike = async (req, res, next) => {
    try {
        const result = await commentService.toggleLike(req.params.id, req.user._id);
        res.json(result);
    } catch (err) {
        next(err);
    }
};

exports.getLikeHistory = async (req, res, next) => {
    try {
        const likes = await commentService.getLikeHistory(req.params.id);
        res.json(likes);
    } catch (err) {
        next(err);
    }
};

exports.getAllComments = async (req, res, next) => {
    try {
        const comments = await commentService.getAllComments();
        res.json(comments);
    } catch (err) {
        next(err);
    }
};
