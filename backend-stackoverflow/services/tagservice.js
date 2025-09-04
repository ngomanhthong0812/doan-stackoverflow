const Tag = require("../models/Tag");
const Question = require("../models/Question");
const cache = require("../services/cacheService");
const cacheKeys = require("../utils/cacheKeys");

exports.getAllTags = async ({
  page = 1,
  perPage = 20,
  sortBy = "popular",
  search = "",
}) => {
  const match = {};
  if (search) {
    match.name = { $regex: search, $options: "i" };
  }

  let sortOption = {};
  switch (sortBy) {
    case "name":
      sortOption = { name: 1, _id: 1 };
      break;
    case "new":
      sortOption = { createdAt: -1, _id: 1 };
      break;
    case "popular":
    default:
      sortOption = { questionCount: -1, createdAt: -1, _id: 1 };
      break;
  }

  const now = new Date();
  const todayStart = new Date(now.getFullYear(), now.getMonth(), now.getDate());
  const weekStart = new Date(
    now.getFullYear(),
    now.getMonth(),
    now.getDate() - now.getDay()
  );

  const result = await Tag.aggregate([
    { $match: match },
    {
      $lookup: {
        from: "questions",
        localField: "_id",
        foreignField: "tags", // fix đúng schema
        as: "questions",
      },
    },
    {
      $addFields: {
        questionCount: { $size: "$questions" },
        questionStats: {
          total: { $size: "$questions" },
          today: {
            $size: {
              $filter: {
                input: "$questions",
                as: "q",
                cond: { $gte: ["$$q.createdAt", todayStart] },
              },
            },
          },
          week: {
            $size: {
              $filter: {
                input: "$questions",
                as: "q",
                cond: { $gte: ["$$q.createdAt", weekStart] },
              },
            },
          },
        },
      },
    },
    {
      $project: {
        questions: 0,
      },
    },
    {
      $facet: {
        data: [
          { $sort: sortOption },
          { $skip: (page - 1) * perPage },
          { $limit: perPage },
        ],
        totalCount: [{ $count: "count" }],
      },
    },
  ]);

  const tags = result[0].data;
  const total = result[0].totalCount[0]?.count || 0;

  return {
    data: tags,
    pagination: {
      page: Number(page),
      perPage: Number(perPage),
      total,
      totalPages: Math.ceil(total / perPage),
    },
  };
};

exports.createTag = async ({ name, description }) => {
  const exists = await Tag.findOne({ name: name.toLowerCase().trim() });
  if (exists) throw new Error("TAG_EXISTS");
  return await Tag.create({ name: name.trim(), description });
};

exports.updateTag = async (id, data) => {
  return await Tag.findByIdAndUpdate(id, data, { new: true });
};

exports.deleteTag = async (id) => {
  return await Tag.findByIdAndDelete(id);
};

exports.getQuestionsByTag = async (tagId) => {
  return await Question.find({ tags: tagId })
    .populate("tags")
    .populate("author", "username avatar reputation");
};

exports.getPopularTags = async (limit = 10) => {
  const cached = await cache.get(cacheKeys.popularTags);
  if (cached) return cached;
  const agg = await Question.aggregate([
    { $unwind: "$tags" },
    { $group: { _id: "$tags", count: { $sum: 1 } } },
    { $sort: { count: -1 } },
    { $limit: limit },
    {
      $lookup: {
        from: "tags",
        localField: "_id",
        foreignField: "_id",
        as: "tag",
      },
    },
    { $unwind: "$tag" },
    {
      $project: {
        _id: "$tag._id",
        name: "$tag.name",
        description: "$tag.description",
        count: 1,
      },
    },
  ]);

  await cache.set(cacheKeys.popularTags, agg, 120);
  return agg;
};
