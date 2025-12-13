export declare class NotificationService {
    private transporter;
    constructor();
    sendAlertNotification(_userId: string, _alert: any): Promise<void>;
    sendEmail(to: string, subject: string, html: string): Promise<void>;
}
export declare const notificationService: NotificationService;
//# sourceMappingURL=notification.service.d.ts.map