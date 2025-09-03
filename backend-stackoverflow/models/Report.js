// models/Report.js
const mongoose = require('mongoose');
const { Schema } = mongoose;

const reportSchema = new Schema({
    type: { type: String, enum: ['question', 'answer', 'comment'], required: true },
    targetId: { type: Schema.Types.ObjectId, required: true }, // Id của bài bị report
    reporter: { type: Schema.Types.ObjectId, ref: 'User', required: true }, // Người report
    reason: { type: String, required: true },
    status: { type: String, enum: ['pending', 'approved', 'rejected'], default: 'pending' },
    createdAt: { type: Date, default: Date.now }
});

module.exports = mongoose.model('Report', reportSchema);
