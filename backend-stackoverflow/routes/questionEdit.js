const express = require("express");
const router = express.Router();
const questionEditController = require("../controllers/questionEditController");
const authMiddleware = require("../middlewares/authMiddleware");

router.post("/:id", authMiddleware, questionEditController.getPendingEdits);
router.get("/:editId", authMiddleware, questionEditController.getQuestionEditById);
router.post("/:editId/approve", authMiddleware, questionEditController.approveQuestionEdit);
router.post("/:editId/reject", authMiddleware, questionEditController.rejectQuestionEdit);


module.exports = router;
