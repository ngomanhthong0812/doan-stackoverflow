const Notification = require('../models/Notification');

exports.createNotification = async (data) => {
    return await Notification.create(data);
};

exports.getNotificationsForUser = async (userId) => {
    return await Notification.find({ receiverId: userId }).sort({ createdAt: -1 });
};

exports.getAllNotifications = async () => {
    return await Notification.find().sort({ createdAt: -1 });
};

exports.markAsRead = async (notificationId) => {
    return await Notification.findByIdAndUpdate(notificationId, { isRead: true }, { new: true });
};

exports.deleteNotification = async (notificationId) => {
    return await Notification.findByIdAndDelete(notificationId);
};