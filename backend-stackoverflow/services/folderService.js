const Folder = require('../models/FolderSchema');

exports.createFolder = async (userId, name) => {
    const exists = await Folder.findOne({ user: userId, name });
    if (exists) throw new Error('FOLDER_EXISTS');

    return await Folder.create({ user: userId, name });
};

exports.getFoldersByUser = async (userId) => {
    return await Folder.find({ user: userId }).populate('questions');
};

exports.findFolderByName = async (userId, name) => {
    return await Folder.findOne({ user: userId, name }).populate('questions');
};

exports.addQuestionToFolder = async (folderId, questionId) => {
    const folder = await Folder.findById(folderId);
    if (!folder) throw new Error('NOT_FOUND');

    if (!folder.questions.includes(questionId)) {
        folder.questions.push(questionId);
        await folder.save();
    }

    return folder;
};

exports.removeQuestionFromFolder = async (folderId, questionId) => {
    const folder = await Folder.findById(folderId);
    if (!folder) throw new Error('NOT_FOUND');

    folder.questions = folder.questions.filter(qid => qid.toString() !== questionId);
    await folder.save();

    return folder;
};

exports.deleteFolder = async (folderId) => {
    return await Folder.findByIdAndDelete(folderId);
};
