const questionService = require('../services/questionService');
const validateCppQuestion = require('../utils/validateCppQuestion'); // ⬅ thêm dòng này

exports.createQuestion = async (req, res, next) => {
    try {
        const { title, content, tags } = req.body;

        const isCpp = validateCppQuestion(title, content);
        if (!isCpp) {
            return res.status(400).json({
                message: 'Câu hỏi không liên quan đến C++ hoặc thiếu code minh hoạ.'
            });
        }
        const images = req.files?.map(file => file.path) || [];

        const question = await questionService.createQuestion({
            title,
            content,
            tags,
            author: req.user._id,
            images
        });
        res.status(201).json(question);
    } catch (err) {
        next(err);
    }
};

exports.getAllQuestions = async (req, res, next) => {
    try {
        const questions = await questionService.getAllQuestions();
        res.json(questions);
    } catch (err) {
        next(err);
    }
};

exports.toggleUpvote = async (req, res, next) => {
    try {
        const { questionId } = req.params;
        const result = await questionService.toggleUpvote(questionId, req.user._id);
        res.json(result);
    } catch (err) {
        next(err);
    }
};

exports.updateQuestion = async (req, res, next) => {
    try {
        const updated = await questionService.updateQuestion(
            req.params.id,
            req.body,
            req.user._id
        );
        res.json(updated);
    } catch (err) {
        if (err.message === 'NOT_FOUND') {
            return res.status(404).json({ message: 'Question not found' });
        }
        if (err.message === 'FORBIDDEN') {
            return res.status(403).json({ message: 'Permission denied' });
        }
        next(err);
    }
};

exports.deleteQuestion = async (req, res, next) => {
    try {
        await questionService.deleteQuestion(req.params.id, req.user);
        res.json({ message: 'Question deleted successfully' });
    } catch (err) {
        if (err.message === 'NOT_FOUND') {
            return res.status(404).json({ message: 'Question not found' });
        }
        if (err.message === 'FORBIDDEN') {
            return res.status(403).json({ message: 'Permission denied' });
        }
        next(err);
    }
};

exports.searchQuestions = async (req, res, next) => {
    try {
        const { q, sort, tags: tagName } = req.query;
        const questions = await questionService.searchQuestions({
            q,
            sortBy: sort,
            tagName
        });
        res.json(questions);
    } catch (err) {
        next(err);
    }
};

exports.getQuestionsByUser = async (req, res, next) => {
    try {
        const questions = await questionService.getQuestionsByUserIfFollowed(
            req.user._id,
            req.params.id
        );
        res.json(questions);
    } catch (err) {
        if (err.message === 'NOT_ALLOWED') {
            return res.status(403).json({
                message: 'Bạn cần follow người này để xem câu hỏi của họ.'
            });
        }
        next(err);
    }
};
