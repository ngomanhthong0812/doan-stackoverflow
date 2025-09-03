const tagService = require('../services/tagservice');

exports.getAllTags = async (req, res, next) => {
    try {
         const {
           page = 1,
           perPage = 20,
           sortBy = "popular",
           search = "",
         } = req.query;
         const tags = await tagService.getAllTags({
           page: Number(page),
           perPage: Number(perPage),
           sortBy,
           search,
         });
        res.json(tags);
    } catch (err) {
        next(err);
    }
};

exports.createTag = async (req, res, next) => {
    try {
        const { name, description } = req.body;
        const tag = await tagService.createTag({ name, description });
        res.status(201).json(tag);
    } catch (err) {
        if (err.message === 'TAG_EXISTS') {
            return res.status(400).json({ message: 'Tag already exists' });
        }
        next(err);
    }
};

exports.updateTag = async (req, res, next) => {
    try {
        const updated = await tagService.updateTag(req.params.id, req.body);
        if (!updated) return res.status(404).json({ message: 'Tag not found' });
        res.json(updated);
    } catch (err) {
        next(err);
    }
};

exports.deleteTag = async (req, res, next) => {
    try {
        const deleted = await tagService.deleteTag(req.params.id);
        if (!deleted) return res.status(404).json({ message: 'Tag not found' });
        res.json({ message: 'Tag deleted successfully' });
    } catch (err) {
        next(err);
    }
};

exports.getQuestionsByTag = async (req, res, next) => {
    try {
        const tagId = req.params.id;
        const questions = await tagService.getQuestionsByTag(tagId);
        res.json(questions);
    } catch (err) {
        next(err);
    }
};

exports.getPopularTags = async (req, res, next) => {
    try {
        const tags = await tagService.getPopularTags();
        res.json(tags);
    } catch (err) {
        next(err);
    }
};