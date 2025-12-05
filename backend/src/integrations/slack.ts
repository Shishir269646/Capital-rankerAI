// src/integrations/slack.ts
import axios from 'axios';
import { WebClient } from '@slack/web-api';
import { logger } from '../config/logger';

/**
 * Slack API Client
 */
export class SlackClient {
  private client: WebClient;
  private webhookUrl: string;

  constructor() {
    const token = process.env.SLACK_BOT_TOKEN || '';
    this.webhookUrl = process.env.SLACK_WEBHOOK_URL || '';

    this.client = new WebClient(token);
  }

  async sendMessage(channel: string, text: string, blocks?: any[]): Promise<any> {
    try {
      const result = await this.client.chat.postMessage({
        channel,
        text,
        blocks,
      });

      logger.debug('Slack message sent', {
        channel,
        ts: result.ts,
      });

      return result;
    } catch (error: any) {
      logger.error('Failed to send Slack message', {
        channel,
        error: error.message,
      });
      throw new Error(`Slack API error: ${error.message}`);
    }
  }

  async sendWebhookNotification(message: {
    text: string;
    attachments?: any[];
    blocks?: any[];
  }): Promise<void> {
    try {
      await axios.post(this.webhookUrl, message);
      logger.debug('Slack webhook notification sent');
    } catch (error: any) {
      logger.error('Failed to send Slack webhook notification', {
        error: error.message,
      });
      throw new Error(`Slack webhook error: ${error.message}`);
    }
  }

  async sendAlertNotification(alert: {
    title: string;
    description: string;
    severity: string;
    url?: string;
  }): Promise<void> {
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

  private getSeverityColor(severity: string): string {
    const colors: Record<string, string> = {
      low: '#36a64f',
      medium: '#ff9900',
      high: '#ff6600',
      critical: '#ff0000',
    };
    return colors[severity.toLowerCase()] || '#808080';
  }

  async sendDealScoreNotification(deal: {
    name: string;
    score: number;
    recommendation: string;
    url?: string;
  }): Promise<void> {
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

export const slackClient = new SlackClient();
