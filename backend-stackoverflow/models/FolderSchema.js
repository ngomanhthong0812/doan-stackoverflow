const mongoose = require('mongoose');
const { Schema } = mongoose;

const Folder = new Schema({
    name: { type: String, required: true },
    user: { type: Schema.Types.ObjectId, ref: 'User', required: true },
    questions: [{ type: Schema.Types.ObjectId, ref: 'Question' }],
    createdAt: { type: Date, default: Date.now }
});

module.exports = mongoose.model('Folder', Folder);
