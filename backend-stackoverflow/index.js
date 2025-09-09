const express = require("express");
const http = require("http");
const { Server } = require("socket.io");
const cors = require("cors");
const cookieParser = require("cookie-parser");
const dotenv = require("dotenv");
const connectDB = require("./config/db");
const errorHandler = require("./middlewares/errorHandler");
// const passport = require('./config/passport');
dotenv.config();

// ==== Khởi tạo Express & Socket.IO ====
const app = express();
const server = http.createServer(app);
const io = new Server(server, {
  cors: {
    origin: "*",
    methods: ["GET", "POST"],
  },
});

// Cho phép truy cập io trong controller
app.set("io", io);

// ==== Middleware ====
app.use(
  cors({
    origin: process.env.AUTH_URL,
    credentials: true,
  })
);
app.use(express.json());
app.use(cookieParser());
// app.use(passport.initialize());
app.use(express.urlencoded({ extended: true }));

// ==== Kết nối DB ====
connectDB().then(async () => {
  console.log("✅ MongoDB connected");

  // ==== Tạo admin mặc định nếu chưa có ====
  const User = require("./models/User");
  const bcrypt = require("bcrypt");

  try {
    const existingAdmin = await User.findOne({ role: "admin" });
    if (!existingAdmin) {
      const hashedPassword = await bcrypt.hash("admin123", 10);
      const admin = new User({
        username: "admin",
        email: "admin@example.com",
        password: hashedPassword,
        role: "admin",
      });
      await admin.save();
      console.log("Admin account created: admin@example.com / admin123");
    } else {
      console.log("Admin account already exists");
    }
  } catch (err) {
    console.error("Error creating admin account:", err);
  }
});

// ==== Routes API ====
app.use("/api/auth", require("./routes/auth"));
app.use("/api/users", require("./routes/user"));
app.use("/api/questions", require("./routes/question"));
app.use("/api/answers", require("./routes/answer"));
app.use("/api/comments", require("./routes/comment"));
app.use("/api/folders", require("./routes/folder"));
app.use("/api/reports", require("./routes/report"));
app.use("/api/notifications", require("./routes/notification"));
app.use("/api/tags", require("./routes/tag"));
app.use("/api/leaderboard", require("./routes/leaderboard"));
app.use("/api/questionEdits", require("./routes/questionEdit"));
app.use("/api/upload", require("./routes/upload"));

// ==== Health check ====
app.get("/", (req, res) => {
  res.send("API is running...");
});

// ==== Xử lý lỗi ====
app.use(errorHandler);

// ==== Gọi socket handler đã tách file ====
require("./sockets")(io);

// ==== Khởi động server ====
const PORT = process.env.PORT || 3000;
server.listen(PORT, () => {
  console.log(`🚀 Server + Socket.IO running on http://localhost:${PORT}`);
});
