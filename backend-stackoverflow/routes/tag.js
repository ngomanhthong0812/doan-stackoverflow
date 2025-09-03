const express = require('express');
const router = express.Router();
const tagController = require('../controllers/tagController');
const auth = require('../middlewares/authMiddleware'); // nếu muốn bảo vệ tạo/xoá/sửa


router.get('/', tagController.getAllTags);

router.get('/:id/questions', tagController.getQuestionsByTag);

router.post('/', auth, tagController.createTag);

router.put('/:id', auth, tagController.updateTag);

router.delete('/:id', auth, tagController.deleteTag);

router.get('/popular', tagController.getPopularTags);

module.exports = router;
