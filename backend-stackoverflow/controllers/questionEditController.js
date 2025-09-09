const {
  getPendingEdits,
  getQuestionEditById,
  approveQuestionEdit,
  rejectQuestionEdit,
} = require("../services/questionEditService");

exports.getPendingEdits = async (req, res, next) => {
  try {
    const question = await getPendingEdits(req.params.id, req.query.status);
    res.status(201).json(question);
  } catch (err) {
    next(err);
  }
};

// Lấy chi tiết 1 edit
exports.getQuestionEditById = async (req, res, next) => {
  try {
    const edit = await getQuestionEditById(req.params.editId);
    res.status(200).json(edit);
  } catch (err) {
    next(err);
  }
};

// Approve edit
exports.approveQuestionEdit = async (req, res, next) => {
  try {
    const authorId = req.user._id;
    const edit = await approveQuestionEdit(req.params.editId, authorId);
    res.status(200).json(edit);
  } catch (err) {
    next(err);
  }
};

// Reject edit
exports.rejectQuestionEdit = async (req, res, next) => {
  try {
    const authorId = req.user._id;
    const edit = await rejectQuestionEdit(req.params.editId, authorId);
    res.status(200).json(edit);
  } catch (err) {
    next(err);
  }
};
