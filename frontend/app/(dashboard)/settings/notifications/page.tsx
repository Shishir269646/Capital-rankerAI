"use client";

import { useEffect, useState } from 'react';
import { Header } from "@/components/layout/Header";
import { Container } from "@/components/layout/Container";
import { useToast } from "@/components/ui/ToastProvider";
import { LoadingSpinner } from "@/components/shared/LoadingSpinner";
import { Card, CardHeader, CardTitle, CardContent, CardDescription } from "@/components/ui/card";
import { Label } from "@/components/ui/label";
import { Switch } from "@/components/ui/switch";
import { Button } from "@/components/ui/button";
import { alertsApi } from '@/lib/api/alerts.api';
import { getAccessToken } from '@/lib/auth/token';

// Define a type for your notification settings payload
interface NotificationSettingsPayload {
  email_alerts_enabled: boolean;
  push_alerts_enabled: boolean;
  // Add more settings as needed
}

const NotificationSettingsPage = () => {
  const { show: showCustomToast } = useToast();
  const [settings, setSettings] = useState<NotificationSettingsPayload>({
    email_alerts_enabled: false,
    push_alerts_enabled: false,
  });
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);

  // In a real app, you'd likely fetch current settings from the backend
  useEffect(() => {
    const fetchSettings = async () => {
      setLoading(true);
      const token = getAccessToken();
      if (!token) {
        showCustomToast("Authentication token not found.", "error");
        setLoading(false);
        return;
      }
      try {
        // Assuming alertsApi.configureAlerts can also fetch settings if called with no payload
        // Or you might have a dedicated getAlertSettings API call
        // For now, we'll just simulate fetching initial settings
        // const response = await alertsApi.getAlertSettings(token);
        // setSettings(response.data);
        showCustomToast("Initial notification settings loaded (simulated)", "info");
      } catch (error) {
        showCustomToast("Error fetching notification settings", "error");
      } finally {
        setLoading(false);
      }
    };
    fetchSettings();
  }, []);


  const handleSettingChange = (key: keyof NotificationSettingsPayload, value: boolean) => {
    setSettings((prev) => ({
      ...prev,
      [key]: value,
    }));
  };

  const handleSaveSettings = async () => {
    setSaving(true);
    const token = getAccessToken();
    if (!token) {
      showCustomToast("Authentication token not found.", "error");
      setSaving(false);
      return;
    }
    try {
      // Assuming configureAlerts takes the entire settings object
      await alertsApi.configureAlerts(settings, token);
      showCustomToast("Notification settings updated successfully!", "success");
    } catch (error) {
      showCustomToast("Error updating notification settings", "error");
    } finally {
      setSaving(false);
    }
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center h-full">
        <LoadingSpinner size="lg" />
      </div>
    );
  }

  return (
    <div>
      <Header
        title="Notification Settings"
        description="Manage your alert and notification preferences"
        breadcrumbs={[
          { label: "Dashboard", href: "/dashboard" },
          { label: "Settings", href: "/settings" },
          { label: "Notifications" },
        ]}
      />

      <Container>
        <Card>
          <CardHeader>
            <CardTitle>Alert Preferences</CardTitle>
            <CardDescription>Configure how you receive important alerts.</CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="flex items-center justify-between">
              <Label htmlFor="email-alerts">Email Alerts</Label>
              <Switch
                id="email-alerts"
                checked={settings.email_alerts_enabled}
                onCheckedChange={(checked) => handleSettingChange('email_alerts_enabled', checked)}
                disabled={saving}
              />
            </div>
            <div className="flex items-center justify-between">
              <Label htmlFor="push-alerts">Push Notifications</Label>
              <Switch
                id="push-alerts"
                checked={settings.push_alerts_enabled}
                onCheckedChange={(checked) => handleSettingChange('push_alerts_enabled', checked)}
                disabled={saving}
              />
            </div>
            {/* Add more notification settings here */}
            <div className="flex justify-end">
              <Button onClick={handleSaveSettings} disabled={saving}>
                {saving ? (
                  <>
                    <LoadingSpinner size="sm" className="mr-2" />
                    Saving...
                  </>
                ) : (
                  "Save Changes"
                )}
              </Button>
            </div>
          </CardContent>
        </Card>
      </Container>
    </div>
  );
};

export default NotificationSettingsPage;
