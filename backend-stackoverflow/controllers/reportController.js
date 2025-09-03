const reportService = require('../services/reportService');

exports.createReport = async (req, res, next) => {
    try {
        const { type, targetId, reason } = req.body;
        const reporter = req.user._id;
        const report = await reportService.createReport({ type, targetId, reason, reporter });
        res.status(201).json(report);
    } catch (err) {
        next(err);
    }
};

exports.getAllReports = async (req, res, next) => {
    try {
        const reports = await reportService.getAllReports();
        res.json(reports);
    } catch (err) {
        next(err);
    }
};

exports.resolveReport = async (req, res, next) => {
    try {
        const { reportId } = req.params;
        const { action } = req.body;
        const report = await reportService.resolveReport(reportId, action);

        // reportController.js
        if (action === 'approved') {
            await reportService.handleViolation(report, req.user); // truyền admin user thật vào
        }


        res.json(report);
    } catch (err) {
        next(err);
    }
};


