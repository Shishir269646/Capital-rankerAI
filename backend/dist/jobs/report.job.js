"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.ReportJob = void 0;
const queue_init_1 = require("./queue.init");
const Report_1 = __importDefault(require("../model/Report"));
const logger_1 = require("../config/logger");
const path_1 = __importDefault(require("path"));
const promises_1 = __importDefault(require("fs/promises"));
const xlsx_1 = __importDefault(require("xlsx"));
const deal_service_1 = require("../services/deal.service");
const portfolio_service_1 = require("../services/portfolio.service");
class ReportJob {
    static initialize() {
        logger_1.logger.info('Initializing Report job processor...');
        queue_init_1.reportQueue.process('generate-report', async (job) => {
            const { reportId } = job.data;
            logger_1.logger.info(`Processing report ${reportId}`);
            let report = null;
            try {
                report = await Report_1.default.findById(reportId);
                if (!report) {
                    logger_1.logger.error(`Report ${reportId} not found.`);
                    return;
                }
                report.status = 'processing';
                await report.save();
                let fileBuffer;
                let fileName;
                let mimeType;
                const tempDir = path_1.default.join(process.cwd(), 'temp', 'reports');
                await promises_1.default.mkdir(tempDir, { recursive: true });
                switch (report.report_type) {
                    case 'deal_analysis':
                        const deals = await deal_service_1.dealService.exportDeals(report.format, report.filters);
                        fileBuffer = deals;
                        fileName = `deal_analysis_${reportId}.${report.format}`;
                        mimeType = report.format === 'csv' ? 'text/csv' : 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet';
                        break;
                    case 'portfolio_summary':
                        const portfolioSummary = await portfolio_service_1.portfolioService.getPortfolioAnalytics(report.user_id.toString());
                        const worksheet = xlsx_1.default.utils.json_to_sheet([portfolioSummary]);
                        const workbook = xlsx_1.default.utils.book_new();
                        xlsx_1.default.utils.book_append_sheet(workbook, worksheet, 'PortfolioSummary');
                        fileBuffer = xlsx_1.default.write(workbook, {
                            type: 'buffer',
                            bookType: report.format,
                        });
                        fileName = `portfolio_summary_${reportId}.${report.format}`;
                        mimeType = report.format === 'csv' ? 'text/csv' : 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet';
                        break;
                    case 'investment_thesis':
                        fileBuffer = Buffer.from('Investment Thesis Report Placeholder');
                        fileName = `investment_thesis_${reportId}.${report.format}`;
                        mimeType = 'text/plain';
                        break;
                    case 'custom':
                        fileBuffer = Buffer.from('Custom Report Placeholder');
                        fileName = `custom_report_${reportId}.${report.format}`;
                        mimeType = 'text/plain';
                        break;
                    default:
                        throw new Error(`Unsupported report type: ${report.report_type}`);
                }
                const filePath = path_1.default.join(tempDir, fileName);
                await promises_1.default.writeFile(filePath, fileBuffer);
                report.file_path = filePath;
                report.file_name = fileName;
                report.mime_type = mimeType;
                report.generated_at = new Date();
                report.status = 'completed';
                await report.save();
                logger_1.logger.info(`Report ${reportId} generated and saved to ${filePath}`);
            }
            catch (error) {
                logger_1.logger.error(`Error processing report ${reportId}: ${error.message}`);
                if (report) {
                    report.status = 'failed';
                    await report.save();
                }
            }
        });
        queue_init_1.reportQueue.on('failed', (job, err) => {
            logger_1.logger.error(`Report job ${job.data.reportId} failed: ${err.message}`);
        });
        queue_init_1.reportQueue.on('error', (err) => {
            logger_1.logger.error(`Report queue error: ${err.message}`);
        });
    }
    static async shutdown() {
        logger_1.logger.info('Shutting down Report job processor...');
        logger_1.logger.info('Report job processor shut down.');
    }
}
exports.ReportJob = ReportJob;
//# sourceMappingURL=report.job.js.map