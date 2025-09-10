const mongoose = require("mongoose");

const BadgeSchema = new mongoose.Schema({
  type: { type: String, enum: ["bronze", "silver", "gold"], required: true },
  name: { type: String, required: true },
  description: { type: String },
  points: { type: Number, required: true },
});

module.exports = mongoose.model("Badge", BadgeSchema);
