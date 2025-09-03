const express = require('express');
const router = express.Router();
const answerController = require('../controllers/answerController');
const authMiddleware = require('../middlewares/authMiddleware');
const upload = require('../middlewares/upload');

router.post('/', authMiddleware, upload.single('image'), answerController.createAnswer);

router.get('/:questionId', answerController.getAnswersByQuestion);

router.delete('/:id', authMiddleware, answerController.deleteAnswer);

router.post('/:id/like', authMiddleware, answerController.toggleLike);

router.get('/:id/likes', answerController.getLikeHistory);

router.put('/:id', authMiddleware, answerController.updateAnswer);

router.get('/', answerController.getAllAnswers);

module.exports = router;
