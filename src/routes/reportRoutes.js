const express = require('express');
const router = express.Router();
const ReportController = require("./../controllers/ReportController.js");


router.get("/geral", ReportController.geralReport.bind(ReportController));
router.get("/finished", ReportController.finishedOrders.bind(ReportController));
router.get("/inProgress", ReportController.inProgressOrders.bind(ReportController));

module.exports = router; 