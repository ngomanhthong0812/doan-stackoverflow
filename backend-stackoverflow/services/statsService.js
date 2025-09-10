const User = require("../models/User");
const Question = require("../models/Question");
const Answer = require("../models/Answer");

exports.getStats = async () => {
  // Tổng user
  const totalUsers = await User.countDocuments();

  // Tổng question
  const totalQuestions = await Question.countDocuments();

  // Top tags
  const topTagsAgg = await Question.aggregate([
    { $unwind: "$tags" },
    {
      $group: {
        _id: "$tags",
        count: { $sum: 1 },
      },
    },
    {
      $lookup: {
        from: "tags",
        localField: "_id",
        foreignField: "_id",
        as: "tagInfo",
      },
    },
    { $unwind: "$tagInfo" },
    { $sort: { count: -1 } },
    { $limit: 10 },
    {
      $project: {
        _id: 0,
        name: "$tagInfo.name",
        count: 1,
      },
    },
  ]);

  // Top users theo số lượng answer (bỏ isAccepted)
  const topUsersAgg = await Answer.aggregate([
    {
      $group: {
        _id: "$author",
        answersCount: { $sum: 1 },
      },
    },
    {
      $lookup: {
        from: "users",
        localField: "_id",
        foreignField: "_id",
        as: "userInfo",
      },
    },
    { $unwind: "$userInfo" },
    { $sort: { answersCount: -1 } },
    { $limit: 10 },
    {
      $project: {
        _id: 0,
        username: "$userInfo.username",
        reputation: "$userInfo.reputation",
        answersCount: 1,
      },
    },
  ]);

  // Activity week
  const now = new Date();
  const activityWeek = [];
  for (let i = 6; i >= 0; i--) {
    const dayStart = new Date(now);
    dayStart.setDate(now.getDate() - i);
    dayStart.setHours(0, 0, 0, 0);

    const dayEnd = new Date(dayStart);
    dayEnd.setHours(23, 59, 59, 999);

    const users = await User.countDocuments({
      createdAt: { $gte: dayStart, $lte: dayEnd },
    });

    const questions = await Question.countDocuments({
      createdAt: { $gte: dayStart, $lte: dayEnd },
    });

    activityWeek.push({
      day: dayStart.toLocaleDateString("en-US", { weekday: "short" }),
      users,
      questions,
    });
  }

  // Activity month
  const activityMonth = [];
  for (let i = 29; i >= 0; i--) {
    const dayStart = new Date(now);
    dayStart.setDate(now.getDate() - i);
    dayStart.setHours(0, 0, 0, 0);

    const dayEnd = new Date(dayStart);
    dayEnd.setHours(23, 59, 59, 999);

    const users = await User.countDocuments({
      createdAt: { $gte: dayStart, $lte: dayEnd },
    });

    const questions = await Question.countDocuments({
      createdAt: { $gte: dayStart, $lte: dayEnd },
    });

    activityMonth.push({
      day: `Day ${30 - i}`,
      users,
      questions,
    });
  }

  return {
    totalUsers,
    totalQuestions,
    topTags: topTagsAgg,
    topUsers: topUsersAgg,
    activityData: {
      week: activityWeek,
      month: activityMonth,
    },
  };
};
