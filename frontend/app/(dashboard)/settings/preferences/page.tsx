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
import { authApi } from '@/lib/api/auth.api';
import { getAccessToken } from '@/lib/auth/token';
import { User, UpdatePreferencesPayload, UserPreferences } from '@/types/auth.types';

const UserPreferencesPage = () => {
  const { show: showCustomToast } = useToast();
  const [userPreferences, setUserPreferences] = useState<Partial<UserPreferences>>({
    notification_channels: [],
    theme: 'system', // default value
    // Add other preferences here
  });
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);

  useEffect(() => {
    const fetchUserPreferences = async () => {
      setLoading(true);
      const token = getAccessToken();
      if (!token) {
        showCustomToast("Authentication token not found.", "error");
        setLoading(false);
        return;
      }
      try {
        const response = await authApi.getMe(token); // Assuming getMe returns preferences
        if (response.data?.preferences) {
            setUserPreferences(response.data.preferences);
        }
      } catch (error) {
        showCustomToast("Error fetching user preferences", "error");
      } finally {
        setLoading(false);
      }
    };

    fetchUserPreferences();
  }, []);

  const handleEmailNotificationChange = (checked: boolean) => {
    setUserPreferences((prev) => {
      const currentChannels = (prev.notification_channels || []) as Array<'email' | 'slack' | 'teams'>;
      const updatedChannels: Array<'email' | 'slack' | 'teams'> = checked
        ? [...currentChannels, 'email']
        : currentChannels.filter(channel => channel !== 'email');
      return {
        ...prev,
        notification_channels: updatedChannels,
      };
    });
  };

  const handleSavePreferences = async () => {
    setSaving(true);
    const token = getAccessToken();
    if (!token) {
      showCustomToast("Authentication token not found.", "error");
      setSaving(false);
      return;
    }
    try {
      await authApi.updatePreferences({ preferences: userPreferences }, token);
      showCustomToast("Preferences updated successfully!", "success");
    } catch (error) {
      showCustomToast("Error updating preferences", "error");
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
        title="Preferences"
        description="Customize your application settings and notifications"
        breadcrumbs={[
          { label: "Dashboard", href: "/dashboard" },
          { label: "Settings", href: "/settings" },
          { label: "Preferences" },
        ]}
      />

      <Container>
        <Card>
          <CardHeader>
            <CardTitle>Notification Settings</CardTitle>
            <CardDescription>Control how you receive alerts and updates.</CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="flex items-center justify-between">
              <Label htmlFor="email-notifications">Email Notifications</Label>
              <Switch
                id="email-notifications"
                checked={userPreferences.notification_channels?.includes('email')}
                onCheckedChange={handleEmailNotificationChange}
                disabled={saving}
              />
            </div>
            {/* Add more preference options here */}
            <div className="flex justify-end">
              <Button onClick={handleSavePreferences} disabled={saving}>
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

export default UserPreferencesPage;
