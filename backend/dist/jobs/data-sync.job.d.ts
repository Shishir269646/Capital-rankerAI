export declare class DataSyncJob {
    private static jobs;
    static scheduleDealRoomSync(): void;
    static scheduleCrunchbaseSync(): void;
    static scheduleWeeklyRefresh(): void;
    static runJobNow(jobName: string): Promise<void>;
    static cancelJob(jobName: string): void;
    static cancelAllJobs(): void;
    static getJobStatus(jobName: string): any;
    static initialize(): void;
}
export declare class AlertJob {
    private static jobs;
    static scheduleScoreMonitoring(): void;
    static scheduleAlertCleanup(): void;
    static initialize(): void;
    static cancelAllJobs(): void;
}
export declare function initializeJobs(): void;
export declare function shutdownJobs(): void;
//# sourceMappingURL=data-sync.job.d.ts.map