const Question = require("../models/Question");
const Answer = require("../models/Answer");
const answerService = require("./answerService");
const User = require("../models/User");
const cacheKeys = require("../utils/cacheKeys");
const cache = require("../services/cacheService");
const Tag = require("../models/Tag"); // Thêm ở đầu
const QuestionEdit = require("../models/QuestionEdit");

exports.createQuestion = async ({ title, content, tags, author }) => {
  const question = await Question.create({
    title,
    content,
    tags,
    author,
  });
  await User.findByIdAndUpdate(author, { $inc: { reputation: 5 } });
  await cache.del(cacheKeys.popularTags);
  return question;
};

exports.getAllQuestions = async ({
  page = 1,
  perPage = 15,
  noAnswers = false,
  sortedBy = "newest",
}) => {
  const skip = (page - 1) * perPage;

  const filter = {};

  if (noAnswers) filter.answersCount = 0;

  let sortOption = {};

  switch (sortedBy) {
    case "newest":
      sortOption = { createdAt: -1 }; // mới nhất
      break;

    case "recent": // hoạt động gần đây (ví dụ: sort theo updatedAt, nếu có)
      sortOption = { updatedAt: -1 };
      break;

    case "highest": // điểm cao nhất (dựa trên số upvotes)
      sortOption = { upvotesCount: -1, createdAt: -1 };
      break;

    case "frequent": // nhiều câu trả lời nhất
      sortOption = { answersCount: -1, createdAt: -1 };
      break;

    case "bounty": // chưa có bounty thì tạm sort theo views nhiều
      sortOption = { views: -1, createdAt: -1 };
      break;

    case "trending": // trending = nhiều views + nhiều upvotes
      sortOption = { views: -1, upvotesCount: -1, createdAt: -1 };
      break;

    case "activity": // nhiều hoạt động (trả lời nhiều + lượt vote nhiều)
      sortOption = { answersCount: -1, upvotesCount: -1, createdAt: -1 };
      break;

    default:
      sortOption = { createdAt: -1 }; // fallback
      break;
  }

  const [questions, totalQuestions] = await Promise.all([
    Question.aggregate([
      { $match: filter },
      {
        $addFields: {
          upvotesCount: { $size: "$upvotes" },
        },
      },
      { $sort: sortOption },
      { $skip: skip },
      { $limit: perPage },
      {
        $lookup: {
          from: "users",
          localField: "author",
          foreignField: "_id",
          as: "author",
        },
      },
      { $unwind: { path: "$author", preserveNullAndEmptyArrays: true } },
      {
        $lookup: {
          from: "tags",
          localField: "tags",
          foreignField: "_id",
          as: "tags",
        },
      },
      {
        $project: {
          "author.password": 0,
          "author.email": 0,
        },
      },
    ]),
    Question.countDocuments(filter),
  ]);

  return {
    data: questions,
    pagination: {
      page,
      perPage,
      totalQuestions,
      totalPages: Math.ceil(totalQuestions / perPage),
    },
  };
};

exports.getQuestionById = async (id) => {
  return await Question.findById(id)
    .populate("author", "username avatar")
    .populate("tags");
};

exports.incrementAnswersCount = async (questionId) => {
  return await Question.findByIdAndUpdate(
    questionId,
    { $inc: { answersCount: 1 } },
    { new: true }
  );
};

exports.incrementViews = async (questionId) => {
  return await Question.findByIdAndUpdate(
    questionId,
    { $inc: { views: 1 } },
    { new: true }
  );
};

exports.toggleUpvote = async (questionId, userId) => {
  const question = await Question.findById(questionId);
  if (!question) throw new Error("Question not found");

  const index = question.upvotes.indexOf(userId);

  if (index === -1) {
    question.upvotes.push(userId);
  } else {
    question.upvotes.splice(index, 1);
  }

  await question.save();

  return {
    upvoted: index === -1,
    count: question.upvotes.length,
  };
};

exports.updateQuestion = async (id, data, userId) => {
  const question = await Question.findById(id)
    .populate("author", "_id username avatar")
    .populate("tags");
  if (!question) throw new Error("NOT_FOUND");

  let updatedQuestion = null;
  let editStatus = "pending";

  if (question.author._id.toString() === userId.toString()) {
    updatedQuestion = await Question.findByIdAndUpdate(id, data, { new: true });
    editStatus = "approved";
  } else {
    updatedQuestion = question;
  }

  // Tạo QuestionEdit để lưu lịch sử
  await QuestionEdit.create({
    question: id,
    editor: userId,
    proposedTitle: data.title,
    proposedContent: data.content,
    proposedImages: data.images || [],
    proposedTags: data.tags || [],
    status: editStatus,
    reviewedBy: editStatus === "approved" ? userId : null,
  });

  if (data.tags && question.author._id.toString() === userId.toString()) {
    await cache.del(cacheKeys.popularTags);
  }

  return updatedQuestion;
};

exports.deleteQuestion = async (id, user) => {
  const question = await Question.findById(id);
  if (!question) throw new Error("NOT_FOUND");

  const isOwner = question.author.toString() === user._id.toString();
  const isAdmin = user.role === "admin";
  if (!isOwner && !isAdmin) throw new Error("FORBIDDEN");

  const answers = await Answer.find({ question: id });
  for (const answer of answers) {
    await answerService.deleteAnswerById(answer._id);
  }
  await question.deleteOne();
  await cache.del(cacheKeys.popularTags);

  return { deleted: true };
};
exports.searchQuestions = async ({ q, sortBy, tagName }) => {
  const tagKey = tagName || "all";
  const sortKey = sortBy || "new";
  const queryKey = q || "";

  const key = cacheKeys.questionSearch(tagKey, sortKey, queryKey);
  const cached = await cache.get(key);
  if (cached) return cached;

  const filter = {};

  if (tagName) {
    const tag = await Tag.findOne({ name: tagName });
    if (tag) {
      filter.tags = tag._id;
    } else {
      return [];
    }
  }

  if (q) {
    filter.title = { $regex: q, $options: "i" };
  }

  let sortOption = { createdAt: -1 };
  if (sortBy === "views") sortOption = { views: -1 };
  if (sortBy === "votes") sortOption = { upvotesCount: -1 };

  const questions = await Question.aggregate([
    { $match: filter },
    {
      $addFields: {
        upvotesCount: { $size: "$upvotes" },
      },
    },
    { $sort: sortOption },
    { $limit: 50 },
  ]);

  await cache.set(key, questions, 60); // TTL: 60s
  return questions;
};

exports.getQuestionsByUserIfFollowed = async (currentUserId, targetUserId) => {
  const currentUser = await User.findById(currentUserId);

  const isFollowing = currentUser.following.includes(targetUserId);

  if (!isFollowing && currentUserId.toString() !== targetUserId.toString()) {
    throw new Error("NOT_ALLOWED");
  }

  const questions = await Question.find({ author: targetUserId })
    .populate("tags")
    .populate("author", "username avatar reputation")
    .sort({ createdAt: -1 });

  return questions;
};

exports.getQuestionsById = async (id) => {
  const question = await Question.findById(id)
    .populate("tags")
    .populate("author", "username avatar reputation");

  return question;
};
