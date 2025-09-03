const express = require('express');
const router = express.Router();
const controller = require('../controllers/notificationController');

router.post('/', controller.create);

router.get('/:userId', controller.getByUser);

router.patch('/read/:notificationId', controller.markAsRead);

router.delete('/:notificationId', controller.delete);

router.get('/', controller.getAll);

module.exports = router;