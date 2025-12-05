const mongoose = require("mongoose");
const { Schema, model } = mongoose;

const CommentSchema = new Schema({
  userId: { type: Schema.Types.ObjectId, ref: "User", required: true },
  content: { type: String, required: true },
  createdAt: { type: Date, default: Date.now },
});

const SharedFileSchema = new Schema(
  {
    title: { type: String, required: true },
    description: { type: String },
    files: [
      {
        fileName: { type: String, required: true },
        fileUrl: { type: String, required: true },
        uploadedAt: { type: Date, default: Date.now },
        uploadedBy: {
          type: Schema.Types.ObjectId,
          ref: "User",
          required: true,
        },
      },
    ],
    createdBy: { type: Schema.Types.ObjectId, ref: "User", required: true },
    comments: [CommentSchema],
  },
  { timestamps: true }
);

module.exports = model("SharedFile", SharedFileSchema);
