// backend/src/jobs/report.job.ts
import { reportQueue } from './queue.init';
import Report, { IReport } from '../model/Report';
import { Job } from '../lib/queue/simple-queue';
import { logger } from '../config/logger';
import path from 'path';
import fs from 'fs/promises';
import XLSX from 'xlsx';
import { dealService } from '../services/deal.service';
import { portfolioService } from '../services/portfolio.service';


export class ReportJob {
  public static initialize(): void {
    logger.info('Initializing Report job processor...');

    reportQueue.process('generate-report', async (job: Job) => {
      const { reportId } = job.data;
      logger.info(`Processing report ${reportId}`);

      let report: IReport | null = null;
      try {
        report = await Report.findById(reportId);
        if (!report) {
          logger.error(`Report ${reportId} not found.`);
          return;
        }

        report.status = 'processing';
        await report.save();

        let fileBuffer: Buffer;
        let fileName: string;
        let mimeType: string;
        const tempDir = path.join(process.cwd(), 'temp', 'reports');
        await fs.mkdir(tempDir, { recursive: true });

        switch (report.report_type) {
          case 'deal_analysis':
            // Assuming filters.deal_ids contains the deal IDs
            // For simplicity, generate a single CSV/XLSX for now
            const deals = await dealService.exportDeals(
              report.format as 'csv' | 'xlsx',
              report.filters
            );
            fileBuffer = deals;
            fileName = `deal_analysis_${reportId}.${report.format}`;
            mimeType = report.format === 'csv' ? 'text/csv' : 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet';
            break;

          case 'portfolio_summary':
            // For portfolio summary, we'll need to fetch portfolio data for the user
            // and then format it. This is a simplified example.
            const portfolioSummary = await portfolioService.getPortfolioAnalytics(report.user_id.toString());
            const worksheet = XLSX.utils.json_to_sheet([portfolioSummary]);
            const workbook = XLSX.utils.book_new();
            XLSX.utils.book_append_sheet(workbook, worksheet, 'PortfolioSummary');
            fileBuffer = XLSX.write(workbook, {
              type: 'buffer',
              bookType: report.format as 'csv' | 'xlsx',
            });
            fileName = `portfolio_summary_${reportId}.${report.format}`;
            mimeType = report.format === 'csv' ? 'text/csv' : 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet';
            break;

          case 'investment_thesis':
            // This would involve fetching investor thesis and related deals/founders
            // For now, let's generate a placeholder
            fileBuffer = Buffer.from('Investment Thesis Report Placeholder');
            fileName = `investment_thesis_${reportId}.${report.format}`;
            mimeType = 'text/plain'; // Placeholder for text
            break;

          case 'custom':
            // Handle custom report logic here
            fileBuffer = Buffer.from('Custom Report Placeholder');
            fileName = `custom_report_${reportId}.${report.format}`;
            mimeType = 'text/plain';
            break;

          default:
            throw new Error(`Unsupported report type: ${report.report_type}`);
        }

        const filePath = path.join(tempDir, fileName);
        await fs.writeFile(filePath, fileBuffer);

        report.file_path = filePath;
        report.file_name = fileName;
        report.mime_type = mimeType;
        report.generated_at = new Date();
        report.status = 'completed';
        await report.save();

        logger.info(`Report ${reportId} generated and saved to ${filePath}`);
      } catch (error: any) {
        logger.error(`Error processing report ${reportId}: ${error.message}`);
        if (report) {
          report.status = 'failed';
          await report.save();
        }
      }
    });

    reportQueue.on('failed', (job: Job, err: Error) => {
      logger.error(`Report job ${job.data.reportId} failed: ${err.message}`);
    });

    reportQueue.on('error', (err: Error) => {
      logger.error(`Report queue error: ${err.message}`);
    });
  }

  public static async shutdown(): Promise<void> {
    logger.info('Shutting down Report job processor...');
    // await reportQueue.close(); // SimpleQueue does not have a close method
    logger.info('Report job processor shut down.');
  }
}
