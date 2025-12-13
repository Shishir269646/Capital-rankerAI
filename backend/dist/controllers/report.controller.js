"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.reportController = exports.ReportController = void 0;
const report_service_1 = require("../services/report.service");
const response_util_1 = require("../utils/response.util");
class ReportController {
    async generateReport(req, res, next) {
        try {
            const userId = req.user?.userId;
            if (!userId) {
                return next((0, response_util_1.errorResponse)('User not authenticated', 401));
            }
            const { report_type, filters, date_range, format = 'pdf' } = req.body;
            const job = await report_service_1.reportService.queueReportGeneration({
                userId,
                reportType: report_type,
                filters,
                dateRange: date_range,
                format,
            });
            res.status(202).json((0, response_util_1.successResponse)('Report generation queued', {
                report_id: job.id,
                status: 'pending',
            }));
        }
        catch (error) {
            next(error);
        }
    }
    async downloadReport(req, res, next) {
        try {
            const { id } = req.params;
            const userId = req.user?.userId;
            if (!userId) {
                return next((0, response_util_1.errorResponse)('User not authenticated', 401));
            }
            const reportResult = await report_service_1.reportService.getReport(id, userId);
            if ('status' in reportResult) {
                res.status(200).json((0, response_util_1.successResponse)(reportResult.message, { status: reportResult.status }));
                return;
            }
            res.setHeader('Content-Type', reportResult.mimeType);
            res.setHeader('Content-Disposition', `attachment; filename="${reportResult.fileName}"`);
            res.send(reportResult.fileBuffer);
        }
        catch (error) {
            next(error);
        }
    }
    async getDealReport(req, res, next) {
        try {
            const { dealId } = req.params;
            const userId = req.user?.userId;
            if (!userId) {
                return next((0, response_util_1.errorResponse)('User not authenticated', 401));
            }
            const { format = 'pdf' } = req.query;
            const job = await report_service_1.reportService.generateDealReport(dealId, format, userId);
            res.status(202).json((0, response_util_1.successResponse)('Deal report generation queued', {
                report_id: job.id,
                status: 'pending',
            }));
        }
        catch (error) {
            next(error);
        }
    }
}
exports.ReportController = ReportController;
exports.reportController = new ReportController();
//# sourceMappingURL=report.controller.js.map