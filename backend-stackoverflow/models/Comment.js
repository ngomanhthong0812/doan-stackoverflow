const mongoose = require('mongoose');
const { Schema } = mongoose; // Thêm dòng này

const commentSchema = new Schema({
    content: { type: String, required: true },
    author: { type: Schema.Types.ObjectId, ref: 'User', required: true },
    answer: { type: Schema.Types.ObjectId, ref: 'Answer', required: true },
    parentComment: { type: Schema.Types.ObjectId, ref: 'Comment', default: null },
    likes: [{
        user: { type: mongoose.Schema.Types.ObjectId, ref: 'User' },
        likedAt: { type: Date, default: Date.now }
    }],
    image: { type: String, default: null },
    createdAt: { type: Date, default: Date.now }
});

module.exports = mongoose.model('Comment', commentSchema);