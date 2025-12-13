"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.reportService = exports.ReportService = void 0;
const queue_init_1 = require("../jobs/queue.init");
const Report_1 = __importDefault(require("../model/Report"));
const promises_1 = __importDefault(require("fs/promises"));
const error_util_1 = require("../utils/error.util");
class ReportService {
    constructor() {
        this.reportQueue = queue_init_1.reportQueue;
    }
    async queueReportGeneration(reportData) {
        const { userId, reportType, filters, dateRange, format } = reportData;
        const newReport = await Report_1.default.create({
            user_id: userId,
            report_type: reportType,
            filters: filters,
            date_range: dateRange,
            format: format,
            status: 'pending',
        });
        return await this.reportQueue.add('generate-report', { reportId: newReport._id.toString() });
    }
    async getReport(reportId, userId) {
        const report = await Report_1.default.findOne({ _id: reportId, user_id: userId });
        if (!report) {
            throw new error_util_1.CustomError(404, 'Report not found or you do not have permission to access it.');
        }
        if (report.status === 'completed') {
            if (!report.file_path || !report.file_name || !report.mime_type) {
                throw new error_util_1.CustomError(500, 'Generated report data is incomplete.');
            }
            const fileBuffer = await promises_1.default.readFile(report.file_path);
            return {
                fileBuffer,
                fileName: report.file_name,
                mimeType: report.mime_type,
            };
        }
        else {
            return {
                status: report.status,
                message: `Report generation is ${report.status}. Please try again later.`,
            };
        }
    }
    async generateDealReport(dealId, format, userId) {
        const newReport = await Report_1.default.create({
            user_id: userId,
            report_type: 'deal_analysis',
            filters: { deal_ids: [dealId] },
            format: format,
            status: 'pending',
        });
        return await this.reportQueue.add('generate-report', { reportId: newReport._id.toString() });
    }
}
exports.ReportService = ReportService;
exports.reportService = new ReportService();
//# sourceMappingURL=report.service.js.map