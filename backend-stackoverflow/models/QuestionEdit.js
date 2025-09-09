const mongoose = require("mongoose");
const Schema = mongoose.Schema;

const questionEditSchema = new Schema(
  {
    question: { type: Schema.Types.ObjectId, ref: "Question", required: true },
    editor: { type: Schema.Types.ObjectId, ref: "User", required: true },
    proposedTitle: { type: String },
    proposedContent: { type: String },
    proposedTags: [{ type: Schema.Types.ObjectId, ref: "Tag" }],
    status: {
      type: String,
      enum: ["pending", "approved", "rejected"],
      default: "pending",
    },
    reviewedBy: { type: Schema.Types.ObjectId, ref: "User" },
    reviewNote: { type: String },
  },
  { timestamps: true }
);

module.exports = mongoose.model("QuestionEdit", questionEditSchema);
