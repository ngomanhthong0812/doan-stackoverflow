const mongoose = require("mongoose");
const { Schema } = mongoose; // Thêm dòng này

const commentSchema = new Schema({
  content: { type: String, required: true },
  author: { type: Schema.Types.ObjectId, ref: "User", required: true },
  parentType: { type: String, enum: ["Question", "Answer"], required: true },
  parentId: {
    type: Schema.Types.ObjectId,
    required: true,
    refPath: "parentType",
  },
  parentComment: { type: Schema.Types.ObjectId, ref: "Comment", default: null },
  likes: [
    {
      user: { type: mongoose.Schema.Types.ObjectId, ref: "User" },
      likedAt: { type: Date, default: Date.now },
    },
  ],
  image: { type: String, default: null },
  createdAt: { type: Date, default: Date.now },
});

module.exports = mongoose.model("Comment", commentSchema);
