const express = require("express");
const router = express.Router();
const commentController = require("../controllers/commentController");
const authMiddleware = require("../middlewares/authMiddleware");
const upload = require("../middlewares/upload");

router.get("/", commentController.getComments);
router.post(
  "/",
  authMiddleware,
  upload.single("image"),
  commentController.createComment
);

router.get("/:answerId", commentController.getCommentsByAnswer);

router.delete("/:id", authMiddleware, commentController.deleteComment);

router.post("/:id/like", authMiddleware, commentController.toggleLike);

router.get("/:id/likes", commentController.getLikeHistory);

module.exports = router;
