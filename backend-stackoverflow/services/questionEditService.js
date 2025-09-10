const QuestionEdit = require("../models/QuestionEdit");
const Question = require("../models/Question");
const User = require("../models/User");

// Lấy danh sách edit pending
exports.getPendingEdits = async (questionId, status = null) => {
  const query = { question: questionId };
  if (status) {
    query.status = status;
  }

  return await QuestionEdit.find(query)
    .populate("editor", "username avatar")
    .populate("proposedTags", "name description")
    .sort({ createdAt: -1 });
};

// Lấy chi tiết 1 edit
exports.getQuestionEditById = async (editId) => {
  return await QuestionEdit.findById(editId)
    .populate("editor", "username avatar")
    .populate("proposedTags", "name")
    .populate("question", "title content tags");
};

// Approve edit
exports.approveQuestionEdit = async (editId, authorId) => {
  const edit = await QuestionEdit.findById(editId);
  if (!edit) throw new Error("NOT_FOUND");

  const question = await Question.findById(edit.question);
  if (!question) throw new Error("NOT_FOUND");

  if (question.author.toString() !== authorId.toString()) {
    throw new Error("FORBIDDEN");
  }

  // Update question
  question.title = edit.proposedTitle || question.title;
  question.content = edit.proposedContent || question.content;
  question.tags = edit.proposedTags || question.tags;
  await question.save();

  // Mark edit approved
  edit.status = "approved";
  edit.reviewedBy = authorId;
  await edit.save();
  if (edit.editor) {
    await User.findByIdAndUpdate(edit.editor, { $inc: { reputation: 5 } });
  }
  return edit;
};

// Reject edit
exports.rejectQuestionEdit = async (editId, authorId) => {
  const edit = await QuestionEdit.findById(editId);
  if (!edit) throw new Error("NOT_FOUND");

  const question = await Question.findById(edit.question);
  if (!question) throw new Error("NOT_FOUND");

  if (question.author.toString() !== authorId.toString()) {
    throw new Error("FORBIDDEN");
  }

  // Mark edit rejected
  edit.status = "rejected";
  edit.reviewedBy = authorId;
  await edit.save();

  if (edit.editor) {
    await User.findByIdAndUpdate(edit.editor, { $inc: { reputation: -2 } });
  }

  return edit;
};
