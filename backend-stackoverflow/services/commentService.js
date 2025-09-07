const Comment = require("../models/Comment");
const User = require("../models/User");

exports.toggleLike = async (commentId, userId) => {
  const comment = await Comment.findById(commentId);
  if (!comment) throw new Error("Comment not found");
  //   if (comment.author.toString() === userId.toString())
  //     throw new Error("Không thể like bình luận của mình");

  const likeIndex = comment.likes.findIndex(
    (like) => like.user.toString() === userId.toString()
  );
  let liked;
  if (likeIndex === -1) {
    comment.likes.push({ user: userId });
    liked = true;
    await User.findByIdAndUpdate(comment.author, { $inc: { reputation: 2 } });
  } else {
    comment.likes.splice(likeIndex, 1);
    liked = false;
    await User.findByIdAndUpdate(comment.author, { $inc: { reputation: -2 } });
  }
  await comment.save();
  return { liked, likeCount: comment.likes.length };
};

exports.getLikeHistory = async (commentId) => {
  const comment = await Comment.findById(commentId).populate(
    "likes.user",
    "username avatar"
  );
  if (!comment) throw new Error("Comment not found");
  return comment.likes;
};

exports.createComment = async ({
  content,
  parentType,
  parentComment,
  author,
  parentId,
}) => {
  const comment = await Comment.create({
    content,
    parentType,
    parentId,
    parentComment,
    author,
  });
  await User.findByIdAndUpdate(author, { $inc: { reputation: 2 } });
  const populated = await comment.populate(
    "author",
    "username avatar reputation"
  );
  return populated;
};

exports.getCommentsByAnswer = async (answerId) => {
  return Comment.find({ answer: answerId })
    .populate("author", "username avatar reputation")
    .sort({ createdAt: 1 });
};

exports.deleteComment = async (id) => {
  return Comment.findByIdAndDelete(id);
};

exports.deleteCommentRecursively = async (commentId) => {
  const childComments = await Comment.find({ parentComment: commentId });
  for (const child of childComments) {
    await exports.deleteCommentRecursively(child._id);
  }
  await Comment.findByIdAndDelete(commentId);
};

exports.deleteCommentsByAnswer = async (answerId) => {
  const comments = await Comment.find({ answer: answerId });
  for (const comment of comments) {
    await exports.deleteCommentRecursively(comment._id);
  }
};

exports.decreaseAnswerCommentCountIfRoot = async (comment) => {
  if (!comment.parentComment) {
    const Answer = require("../models/Answer");
    await Answer.findByIdAndUpdate(comment.answer, {
      $inc: { commentsCount: -1 },
    });
  }
};

exports.getAllComments = async () => {
  return await Comment.find()
    .populate("author", "username avatar")
    .populate("answer") // hoặc .populate({ path: 'answer', select: 'content' }) nếu cần gọn
    .sort({ createdAt: -1 });
};

exports.getComments = async ({
  parentType,
  parentId,
  page = 1,
  perPage = 20,
}) => {
  const skip = (page - 1) * perPage;

  // Lấy comment gốc (không có parentComment)
  const rootComments = await Comment.find({
    parentType,
    parentId,
    parentComment: null,
  })
    .populate("author", "username avatar")
    .sort({ createdAt: -1 })
    .skip(skip)
    .limit(perPage)
    .lean();

  const allReplies = await Comment.find({
    parentType,
    parentId,
    parentComment: { $ne: null },
  })
    .populate("author", "username avatar")
    .sort({ createdAt: 1 })
    .lean();

  const replyMap = {};
  allReplies.forEach((r) => {
    const parentId = r.parentComment?.toString();
    if (!replyMap[parentId]) replyMap[parentId] = [];
    replyMap[parentId].push(r);
  });

  // Hàm đệ quy gắn children
  function attachChildren(comment) {
    const children = replyMap[comment._id.toString()] || [];
    return {
      ...comment,
      children: children.map(attachChildren),
    };
  }

  const data = rootComments.map(attachChildren);

  const total = await Comment.countDocuments({
    parentType,
    parentId,
    parentComment: null,
  });

  return {
    data,
    total,
    page,
    perPage,
    totalPages: Math.ceil(total / perPage),
  };
};
