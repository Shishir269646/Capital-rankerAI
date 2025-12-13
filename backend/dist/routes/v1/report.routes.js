"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.reportRouter = void 0;
const express_1 = require("express");
const report_controller_1 = require("../../controllers/report.controller");
const auth_middleware_1 = require("../../middleware/auth.middleware");
const validation_middleware_1 = require("../../middleware/validation.middleware");
const report_validator_1 = require("../../validators/report.validator");
const reportRouter = (0, express_1.Router)();
exports.reportRouter = reportRouter;
reportRouter.use(auth_middleware_1.authMiddleware);
reportRouter.post('/generate', (0, validation_middleware_1.validateRequest)(report_validator_1.generateReportValidator), report_controller_1.reportController.generateReport.bind(report_controller_1.reportController));
reportRouter.get('/:id', report_controller_1.reportController.downloadReport.bind(report_controller_1.reportController));
reportRouter.get('/deals/:dealId', report_controller_1.reportController.getDealReport.bind(report_controller_1.reportController));
//# sourceMappingURL=report.routes.js.map