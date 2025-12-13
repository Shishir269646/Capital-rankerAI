export declare class AlertService {
    getUserAlerts(userId: string, filters: any): Promise<any>;
    configureAlerts(userId: string, config: any): Promise<void>;
    markAsRead(alertId: string, userId: string): Promise<any>;
    deleteAlert(alertId: string, userId: string): Promise<void>;
    createAlert(alertData: any): Promise<void>;
}
export declare const alertService: AlertService;
//# sourceMappingURL=alert.service.d.ts.map