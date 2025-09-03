const express = require('express');
const router = express.Router();
const reportController = require('../controllers/reportController');
const authMiddleware = require('../middlewares/authMiddleware');


router.post('/', authMiddleware, reportController.createReport);

router.get('/', authMiddleware, reportController.getAllReports);

router.post('/:reportId/resolve', authMiddleware, reportController.resolveReport);

module.exports = router;
