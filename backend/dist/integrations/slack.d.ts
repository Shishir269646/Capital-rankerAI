export declare class SlackClient {
    private client;
    private webhookUrl;
    constructor();
    sendMessage(channel: string, text: string, blocks?: any[]): Promise<any>;
    sendWebhookNotification(message: {
        text: string;
        attachments?: any[];
        blocks?: any[];
    }): Promise<void>;
    sendAlertNotification(alert: {
        title: string;
        description: string;
        severity: string;
        url?: string;
    }): Promise<void>;
    private getSeverityColor;
    sendDealScoreNotification(deal: {
        name: string;
        score: number;
        recommendation: string;
        url?: string;
    }): Promise<void>;
}
export declare const slackClient: SlackClient;
//# sourceMappingURL=slack.d.ts.map