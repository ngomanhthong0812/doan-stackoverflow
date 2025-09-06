let onlineUsers = [];

const addNewUser = (userId, socketId, senderName, senderAvatar) => {
  if (!onlineUsers.some((user) => user.userId === userId)) {
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
  }
};

function handleSocketConnection(socket) {
  console.log("✅ Socket connected:", socket.id);

  socket.on("newUser", ({ userId, senderName, senderAvatar }) => {
    addNewUser(userId, socket.id, senderName, senderAvatar);
    io.emit("getOnlineUsers", onlineUsers);
  });

  // Join room theo postId (question/answer)
  socket.on("joinPost", (postId) => {
    socket.join(postId);
  });

  // Khi có comment mới
  socket.on(
    "newComment",
    ({ senderId, targetType, targetId, targetOwnerId, comment }) => {
      const payload = {
        senderId,
        senderName: comment.authorName,
        content: comment.content,
        commentId: comment._id,
        createdAt: comment.createdAt,
        targetType,
        targetId,
      };

      // Gửi tới tất cả đang xem bài viết này
      io.to(targetId).emit("receiveComment", payload);

      // Gửi notification cho chủ bài viết/answer
      if (senderId !== targetOwnerId) {
        emitToUser(targetOwnerId, "getNotification", {
          senderId,
          description:
            targetType === "question"
              ? `${comment.authorName} đã comment câu hỏi của bạn`
              : `${comment.authorName} đã comment answer của bạn`,
          commentId: comment._id,
          targetType,
          targetId,
        });
      }
    }
  );

  // Khi có reply comment
  socket.on(
    "newReply",
    ({ senderId, commentOwnerId, commentId, senderName }) => {
      if (senderId !== commentOwnerId) {
        emitToUser(commentOwnerId, "getNotification", {
          senderId,
          description: `${senderName} đã trả lời comment của bạn`,
          commentId,
        });
      }
    }
  );

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
