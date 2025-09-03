const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const answerSchema = new Schema({
    content: { type: String, required: true },
    question: { type: Schema.Types.ObjectId, ref: 'Question', required: true },
    author: { type: Schema.Types.ObjectId, ref: 'User', required: true },
    isAccepted: { type: Boolean, default: false },
    commentsCount: { type: Number, default: 0 }, // 👈 Thêm dòng này
    likes: [{
        user: { type: mongoose.Schema.Types.ObjectId, ref: 'User' },
        likedAt: { type: Date, default: Date.now }
    }],
    image: { type: String, default: null },

    createdAt: { type: Date, default: Date.now },
});

module.exports = mongoose.model('Answer', answerSchema);
