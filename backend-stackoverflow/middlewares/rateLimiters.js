const rateLimit = require('express-rate-limit');

exports.authLimiter = rateLimit({
    windowMs: 5 * 60 * 1000,
    max: 20,
    message: 'Quá nhiều lần đăng nhập hoặc đăng ký. Vui lòng thử lại sau.'
});

exports.userLimiter = rateLimit({
    windowMs: 1 * 60 * 1000,
    max: 20,
    message: 'Bạn đang thao tác quá nhanh trên user.'
});

exports.questionLimiter = rateLimit({
    windowMs: 10 * 60 * 1000,
    max: 3,
    message: 'Bạn tạo quá nhiều câu hỏi trong thời gian ngắn.'
});

exports.answerLimiter = rateLimit({
    windowMs: 5 * 60 * 1000,
    max: 10,
    message: 'Bạn trả lời quá nhanh. Hãy chờ một chút.'
});

exports.commentLimiter = rateLimit({
    windowMs: 5 * 60 * 1000,
    max: 10,
    message: 'Bạn đang bình luận quá nhanh. Hãy chờ một chút.'
});

exports.reportLimiter = rateLimit({
    windowMs: 15 * 60 * 1000,
    max: 5,
    message: 'Bạn gửi quá nhiều báo cáo. Vui lòng chờ xử lý.'
});

exports.notificationLimiter = rateLimit({
    windowMs: 5 * 60 * 1000,
    max: 20,
    message: 'Bạn đang thao tác thông báo quá nhanh.'
});

exports.folderLimiter = rateLimit({
    windowMs: 10 * 60 * 1000,
    max: 15,
    message: 'Bạn thao tác với thư mục quá nhiều lần.'
});

exports.tagLimiter = rateLimit({
    windowMs: 10 * 60 * 1000,
    max: 20,
    message: 'Thao tác với tag đang bị giới hạn.'
});

exports.leaderboardLimiter = rateLimit({
    windowMs: 1 * 60 * 1000,
    max: 10,
    message: 'Đang tải bảng xếp hạng quá thường xuyên.'
});
