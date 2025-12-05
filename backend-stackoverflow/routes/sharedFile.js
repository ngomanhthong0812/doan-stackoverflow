  const express = require("express");
  const authMiddleware = require("../middlewares/authMiddleware");
  const sharedFileController = require("../controllers/sharedFileController");

  const router = express.Router();

  router.get("/", authMiddleware, sharedFileController.getAll);
  router.post("/create", authMiddleware, sharedFileController.createFolder);
  router.post("/:id/upload", authMiddleware, sharedFileController.uploadFiles);
  router.delete("/:id/file", authMiddleware, sharedFileController.deleteFile);
  router.delete("/:id", authMiddleware, sharedFileController.deleteFolder);

  module.exports = router;
