const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const questionSchema = new Schema({
    title: { type: String, required: true },
    content: { type: String, required: true },
    author: { type: Schema.Types.ObjectId, ref: 'User', required: true },
    tags: [{ type: Schema.Types.ObjectId, ref: 'Tag' }],
    upvotes: [{ type: Schema.Types.ObjectId, ref: 'User' }],
    views: { type: Number, default: 0 },
    answersCount: { type: Number, default: 0 },
    images: {
        type: [String],
        default: []
    },
    createdAt: { type: Date, default: Date.now },
});

module.exports = mongoose.model('Question', questionSchema);
