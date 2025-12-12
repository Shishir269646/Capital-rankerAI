// src/services/report.service.ts
import { reportQueue } from '../jobs/queue.init';
import { SimpleQueue, Job } from '../lib/queue/simple-queue';
import Report from '../model/Report'; // Removed IReport
import fs from 'fs/promises';
import { CustomError } from '../utils/error.util'; // Removed NotFoundError

export class ReportService {
  private reportQueue: SimpleQueue;

  constructor() {
    this.reportQueue = reportQueue;
  }

  /**
   * Queue report generation
   */
  async queueReportGeneration(reportData: {
    userId?: string;
    reportType: string;
    filters: any;
    dateRange: any;
    format: string;
  }): Promise<Job> {
    const { userId, reportType, filters, dateRange, format } = reportData;

    // 1. Create a Report document in pending state
    const newReport = await Report.create({
      user_id: userId,
      report_type: reportType,
      filters: filters,
      date_range: dateRange,
      format: format,
      status: 'pending',
    });

    // 2. Add the report job to the queue, passing the report's ID
    return await this.reportQueue.add('generate-report', { reportId: newReport._id.toString() });
  }

  /**
   * Get report details and file (if completed)
   */
  async getReport(reportId: string, userId: string): Promise<
    | {
        status: 'pending' | 'processing' | 'failed';
        message: string;
      }
    | {
        fileBuffer: Buffer;
        fileName: string;
        mimeType: string;
      }
  > {
    const report = await Report.findOne({ _id: reportId, user_id: userId });

    if (!report) {
      throw new CustomError(404, 'Report not found or you do not have permission to access it.'); // Changed to CustomError(404, ...)
    }

    if (report.status === 'completed') {
      if (!report.file_path || !report.file_name || !report.mime_type) {
        // This case should ideally not happen if the worker correctly sets all fields
        throw new CustomError(500, 'Generated report data is incomplete.'); // Swapped arguments
      }
      const fileBuffer = await fs.readFile(report.file_path);
      return {
        fileBuffer,
        fileName: report.file_name,
        mimeType: report.mime_type,
      };
    } else {
      return {
        status: report.status,
        message: `Report generation is ${report.status}. Please try again later.`,
      };
    }
  }

  /**
   * Generate deal report (asynchronously)
   */
  async generateDealReport(dealId: string, format: string, userId: string): Promise<Job> {
    // For simplicity, we'll queue this as a 'deal_analysis' report type
    // The actual worker will need to filter by dealId
    const newReport = await Report.create({
      user_id: userId, // Pass userId directly from controller
      report_type: 'deal_analysis', // Or a new type 'deal_report'
      filters: { deal_ids: [dealId] },
      format: format,
      status: 'pending',
    });

    return await this.reportQueue.add('generate-report', { reportId: newReport._id.toString() });
  }
}

export const reportService = new ReportService();
