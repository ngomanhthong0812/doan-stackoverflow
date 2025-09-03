const mongoose = require('mongoose');

const notificationSchema = new mongoose.Schema({
    senderId: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
    senderName: { type: String }, // 👈 thêm dòng này
    receiverId: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
    type: { type: String, required: true },
    postId: { type: mongoose.Schema.Types.ObjectId, ref: 'Post', default: null },
    commentId: { type: mongoose.Schema.Types.ObjectId, ref: 'Comment', default: null },
    link: { type: String },
    description: { type: String },
    isRead: { type: Boolean, default: false },
    createdAt: { type: Date, default: Date.now }
});

module.exports = mongoose.model('Notification', notificationSchema);