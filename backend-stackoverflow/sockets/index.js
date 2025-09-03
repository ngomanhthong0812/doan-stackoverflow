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

const emitToReceiver = (receiverId, event, payload) => {
    const receiver = getUser(receiverId);
    if (receiver) {
        io.to(receiver.socketId).emit(event, payload);
    }
};

function handleSocketConnection(socket) {
    console.log("✅ Socket connected:", socket.id);

    socket.on("newUser", ({ userId, senderName, senderAvatar }) => {
        addNewUser(userId, socket.id, senderName, senderAvatar);
        io.emit("getOnlineUsers", onlineUsers);
    });

    socket.on("sendNotification", ({ senderId, receiverId, senderName, description }) => {
        console.log("📨 Gửi từ:", senderId, "→ đến:", receiverId);
        emitToReceiver(receiverId, "getNotification", {
            senderId,
            senderName,
            description
        });
    });

    socket.on("sendMessage", ({ senderId, receiverId, postId, parentCommentId, senderName, senderAvatar }) => {
        emitToReceiver(receiverId, "getMessage", {
            senderId,
            receiverId,
            postId,
            parentCommentId,
            senderName,
            senderAvatar
        });
    });


    socket.on("disconnect", () => {
        removeUser(socket.id);
        io.emit("getOnlineUsers", onlineUsers);
        console.log("❌ Socket disconnected:", socket.id);
    });

}

let io;
module.exports = (_io) => {
    io = _io;
    io.on("connection", handleSocketConnection);
};

module.exports.getUser = getUser;