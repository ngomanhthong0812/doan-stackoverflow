const folderService = require('../services/folderService');

exports.createFolder = async (req, res, next) => {
    try {
        const folder = await folderService.createFolder(req.user._id, req.body.name);
        res.status(201).json(folder);
    } catch (err) {
        if (err.message === 'FOLDER_EXISTS') {
            return res.status(400).json({ message: 'Folder already exists' });
        }
        next(err);
    }
};

exports.getFolders = async (req, res, next) => {
    try {
        const folders = await folderService.getFoldersByUser(req.user._id);
        res.json(folders);
    } catch (err) {
        next(err);
    }
};

exports.findFolderByName = async (req, res, next) => {
    try {
        const folder = await folderService.findFolderByName(req.user._id, req.params.name);
        if (!folder) return res.status(404).json({ message: 'Folder not found' });
        res.json(folder);
    } catch (err) {
        next(err);
    }
};

exports.addQuestion = async (req, res, next) => {
    try {
        const folder = await folderService.addQuestionToFolder(req.params.folderId, req.params.questionId);
        res.json(folder);
    } catch (err) {
        if (err.message === 'NOT_FOUND') {
            return res.status(404).json({ message: 'Folder not found' });
        }
        next(err);
    }
};

exports.removeQuestion = async (req, res, next) => {
    try {
        const folder = await folderService.removeQuestionFromFolder(req.params.folderId, req.params.questionId);
        res.json(folder);
    } catch (err) {
        if (err.message === 'NOT_FOUND') {
            return res.status(404).json({ message: 'Folder not found' });
        }
        next(err);
    }
};

exports.deleteFolder = async (req, res, next) => {
    try {
        await folderService.deleteFolder(req.params.folderId);
        res.json({ message: 'Folder deleted successfully' });
    } catch (err) {
        next(err);
    }
};
