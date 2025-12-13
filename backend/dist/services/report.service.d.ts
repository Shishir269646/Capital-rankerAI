import { Job } from '../lib/queue/simple-queue';
export declare class ReportService {
    private reportQueue;
    constructor();
    queueReportGeneration(reportData: {
        userId?: string;
        reportType: string;
        filters: any;
        dateRange: any;
        format: string;
    }): Promise<Job>;
    getReport(reportId: string, userId: string): Promise<{
        status: 'pending' | 'processing' | 'failed';
        message: string;
    } | {
        fileBuffer: Buffer;
        fileName: string;
        mimeType: string;
    }>;
    generateDealReport(dealId: string, format: string, userId: string): Promise<Job>;
}
export declare const reportService: ReportService;
//# sourceMappingURL=report.service.d.ts.map