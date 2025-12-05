import Alert from '../model/Alert';
import { notificationService } from './notification.service';

export class AlertService {
  /**
   * Get user alerts
   */
  async getUserAlerts(userId: string, filters: any): Promise<any> {
    const { type, severity, status, page, limit } = filters;
    const query: any = { user_id: userId };

    if (type) query.type = type;
    if (severity) query.severity = severity;
    if (status) query.status = status;

    const skip = (page - 1) * limit;
    const alerts = await Alert.find(query).sort({ triggered_at: -1 }).skip(skip).limit(limit);

    const total = await Alert.countDocuments(query);

    return {
      alerts,
      total,
      page,
      totalPages: Math.ceil(total / limit),
    };
  }

  /**
   * Configure alert preferences
   */
  async configureAlerts(_userId: string, _config: any): Promise<void> {
    // Save configuration to user preferences
    // This would update the User model's preferences
  }

  /**
   * Mark alert as read
   */
  async markAsRead(alertId: string, userId: string): Promise<any> {
    return await Alert.findOneAndUpdate(
      { _id: alertId, user_id: userId },
      { status: 'read', read_at: new Date() },
      { new: true }
    );
  }

  /**
   * Delete alert
   */
  async deleteAlert(alertId: string, userId: string): Promise<void> {
    await Alert.findOneAndUpdate({ _id: alertId, user_id: userId }, { status: 'archived' });
  }

  /**
   * Create new alert
   */
  async createAlert(alertData: any): Promise<void> {
    const alert = new Alert(alertData);
    await alert.save();

    // Send notification
    await notificationService.sendAlertNotification(alertData.user_id, alert);
  }
}

export const alertService = new AlertService();
