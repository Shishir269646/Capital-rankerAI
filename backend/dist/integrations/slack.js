"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.slackClient = exports.SlackClient = void 0;
const axios_1 = __importDefault(require("axios"));
const web_api_1 = require("@slack/web-api");
const logger_1 = require("../config/logger");
class SlackClient {
    constructor() {
        const token = process.env.SLACK_BOT_TOKEN || '';
        this.webhookUrl = process.env.SLACK_WEBHOOK_URL || '';
        this.client = new web_api_1.WebClient(token);
    }
    async sendMessage(channel, text, blocks) {
        try {
            const result = await this.client.chat.postMessage({
                channel,
                text,
                blocks,
            });
            logger_1.logger.debug('Slack message sent', {
                channel,
                ts: result.ts,
            });
            return result;
        }
        catch (error) {
            logger_1.logger.error('Failed to send Slack message', {
                channel,
                error: error.message,
            });
            throw new Error(`Slack API error: ${error.message}`);
        }
    }
    async sendWebhookNotification(message) {
        try {
            await axios_1.default.post(this.webhookUrl, message);
            logger_1.logger.debug('Slack webhook notification sent');
        }
        catch (error) {
            logger_1.logger.error('Failed to send Slack webhook notification', {
                error: error.message,
            });
            throw new Error(`Slack webhook error: ${error.message}`);
        }
    }
    async sendAlertNotification(alert) {
        const color = this.getSeverityColor(alert.severity);
        const message = {
            text: `🚨 New Alert: ${alert.title}`,
            attachments: [
                {
                    color,
                    title: alert.title,
                    text: alert.description,
                    fields: [
                        {
                            title: 'Severity',
                            value: alert.severity.toUpperCase(),
                            short: true,
                        },
                        {
                            title: 'Time',
                            value: new Date().toISOString(),
                            short: true,
                        },
                    ],
                    ...(alert.url && {
                        actions: [
                            {
                                type: 'button',
                                text: 'View Details',
                                url: alert.url,
                            },
                        ],
                    }),
                },
            ],
        };
        await this.sendWebhookNotification(message);
    }
    getSeverityColor(severity) {
        const colors = {
            low: '#36a64f',
            medium: '#ff9900',
            high: '#ff6600',
            critical: '#ff0000',
        };
        return colors[severity.toLowerCase()] || '#808080';
    }
    async sendDealScoreNotification(deal) {
        const emoji = deal.score >= 80 ? '🌟' : deal.score >= 60 ? '👍' : '👎';
        const message = {
            text: `${emoji} Deal Scored: ${deal.name}`,
            blocks: [
                {
                    type: 'header',
                    text: {
                        type: 'plain_text',
                        text: `${emoji} New Deal Score: ${deal.name}`,
                    },
                },
                {
                    type: 'section',
                    fields: [
                        {
                            type: 'mrkdwn',
                            text: `*Investment Fit Score:*\n${deal.score}/100`,
                        },
                        {
                            type: 'mrkdwn',
                            text: `*Recommendation:*\n${deal.recommendation.toUpperCase()}`,
                        },
                    ],
                },
                ...(deal.url
                    ? [
                        {
                            type: 'actions',
                            elements: [
                                {
                                    type: 'button',
                                    text: {
                                        type: 'plain_text',
                                        text: 'View Full Analysis',
                                    },
                                    url: deal.url,
                                    style: 'primary',
                                },
                            ],
                        },
                    ]
                    : []),
            ],
        };
        await this.sendWebhookNotification(message);
    }
}
exports.SlackClient = SlackClient;
exports.slackClient = new SlackClient();
//# sourceMappingURL=slack.js.map