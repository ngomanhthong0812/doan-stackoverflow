const { createNotification } = require("../services/notificationService");

let onlineUsers = [];

const addNewUser = (userId, socketId, senderName, senderAvatar) => {
  const existingUser = onlineUsers.find((user) => user.userId === userId);

  if (existingUser) {
    // Cập nhật socketId mới nếu user đã tồn tại
    existingUser.socketId = socketId;
    existingUser.senderName = senderName;
    existingUser.senderAvatar = senderAvatar;
  } else {
    // Thêm user mới
    onlineUsers.push({ userId, socketId, senderName, senderAvatar });
  }
};

const removeUser = (socketId) => {
  onlineUsers = onlineUsers.filter((user) => user.socketId !== socketId);
};

const getUser = (userId) => {
  return onlineUsers.find((user) => user.userId === userId);
};

const emitToUser = (userId, event, payload) => {
  const user = getUser(userId);
  if (user) {
    io.to(user.socketId).emit(event, payload);
  } else {
    console.log(`User ${userId} không online`);
  }
};

function handleSocketConnection(socket) {
  console.log("✅ Socket connected:", socket.id);

  socket.on("newUser", ({ userId, senderName, senderAvatar }) => {
    addNewUser(userId, socket.id, senderName, senderAvatar);
    io.emit("getOnlineUsers", onlineUsers);
  });

  socket.on("joinQuestion", ({ parentId, parentType }) => {
    socket.join(`${parentType}_${parentId}`);
  });

  socket.on("joinComment", (commentId) => {
    socket.join(`comment_${commentId}`);
    console.log(`Socket ${socket.id} joined comment_${commentId}`);
  });

  // Khi có comment mới
  socket.on(
    "newComment",
    async ({ parentType, parentId, newComment, targetOwnerId, questionId }) => {
      // Gửi tới tất cả đang xem post/answer này
      io.to(`${parentType}_${parentId}`).emit("receiveComment", {
        newComment,
        parentType,
        parentId,
      });

      // Gửi notification cho chủ post/answer
      if (newComment.author._id !== targetOwnerId) {
        const payload = {
          senderId: newComment.author._id,
          senderName: newComment.author.username,
          receiverId: targetOwnerId,
          type: "comment",
          postId: questionId,
          commentId: newComment._id,
          link: `/questions/${parentId}`,
          description:
            parentType === "Question"
              ? `${newComment.author.username} đã bình luận câu hỏi của bạn`
              : `${newComment.author.username} đã bình luận câu trả lời của bạn`,
          isRead: false,
          createdAt: new Date(),
        };
        const notification = await createNotification(payload);
        emitToUser(targetOwnerId, "getNotification", notification);
      }
    }
  );

  // Khi có reply comment
  socket.on(
    "newReply",
    async ({
      parentType,
      parentId,
      newComment,
      commentOwnerId,
      questionId,
    }) => {
      io.to(`${parentType}_${parentId}`).emit("receiveReply", {
        newComment,
        parentType,
        parentId,
      });

      // Gửi notification cho chủ comment
      if (newComment.author._id !== commentOwnerId) {
        const payload = {
          senderId: newComment.author._id,
          senderName: newComment.author.username,
          receiverId: commentOwnerId,
          type: "reply",
          postId: questionId,
          commentId: newComment._id,
          link: `/questions/${parentId}#comment-${newComment._id}`,
          description: `${newComment.author.username} đã trả lời bình luận của bạn`,
          isRead: false,
          createdAt: new Date(),
        };

        const notification = await createNotification(payload);
        emitToUser(commentOwnerId, "getNotification", notification);
      }
    }
  );

  // Khi có like mới
  socket.on(
    "newLike",
    async ({
      parentType,
      parentId,
      newLike,
      targetOwnerId,
      commentId,
      questionId,
    }) => {
      if (newLike.userId !== targetOwnerId) {
        const payload = {
          senderId: newLike.userId,
          senderName: newLike.username,
          receiverId: targetOwnerId,
          type: "like",
          postId: questionId,
          link:
            parentType === "Question"
              ? `/questions/${parentId}`
              : parentType === "Answer"
              ? `/questions/${parentId}#answer-${parentId}`
              : `/questions/${parentId}#comment-${commentId}`,
          description:
            parentType === "Question"
              ? `${newLike.username} đã thích câu hỏi của bạn`
              : parentType === "Answer"
              ? `${newLike.username} đã thích câu trả lời của bạn`
              : `${newLike.username} đã thích bình luận của bạn`,
          isRead: false,
          createdAt: new Date(),
        };

        const notification = await createNotification(payload);
        emitToUser(targetOwnerId, "getNotification", notification);
      }
    }
  );

  // Khi có answer mới
  socket.on("newAnswer", async ({ questionId, newAnswer, questionOwnerId }) => {
    if (newAnswer.author._id !== questionOwnerId) {
      const payload = {
        senderId: newAnswer.author._id,
        senderName: newAnswer.author.username,
        receiverId: questionOwnerId,
        type: "answer",
        postId: questionId,
        link: `/questions/${questionId}#answer-${newAnswer._id}`,
        description: `${newAnswer.author.username} đã trả lời câu hỏi của bạn`,
        isRead: false,
        createdAt: new Date(),
      };

      const notification = await createNotification(payload);
      emitToUser(questionOwnerId, "getNotification", notification);
    }
  });

  socket.on("disconnect", () => {
    removeUser(socket.id);
    io.emit("getOnlineUsers", onlineUsers);
    console.log("Socket disconnected:", socket.id);
  });
}
let io;
module.exports = (_io) => {
  io = _io;
  io.on("connection", handleSocketConnection);
};

module.exports.getUser = getUser;
