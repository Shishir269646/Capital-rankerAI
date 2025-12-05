import nodemailer from 'nodemailer';

export class NotificationService {
  private transporter: nodemailer.Transporter;

  constructor() {
    this.transporter = nodemailer.createTransport({
      host: process.env.SMTP_HOST,
      port: Number(process.env.SMTP_PORT),
      auth: {
        user: process.env.SMTP_USER,
        pass: process.env.SMTP_PASS,
      },
    });
  }

  /**
   * Send alert notification
   */
  async sendAlertNotification(_userId: string, _alert: any): Promise<void> {
    // Implementation for email/slack notification
  }

  /**
   * Send email
   */
  async sendEmail(to: string, subject: string, html: string): Promise<void> {
    await this.transporter.sendMail({
      from: process.env.SMTP_USER,
      to,
      subject,
      html,
    });
  }
}

export const notificationService = new NotificationService();
