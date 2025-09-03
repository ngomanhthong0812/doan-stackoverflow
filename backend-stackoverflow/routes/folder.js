const express = require('express');
const router = express.Router();
const folderController = require('../controllers/folderController');
const auth = require('../middlewares/authMiddleware');

router.post('/', auth, folderController.createFolder);

router.get('/', auth, folderController.getFolders);

router.get('/find/:name', auth, folderController.findFolderByName);

router.post('/:folderId/add/:questionId', auth, folderController.addQuestion);

router.delete('/:folderId/remove/:questionId', auth, folderController.removeQuestion);

router.delete('/:folderId', auth, folderController.deleteFolder);

module.exports = router;
