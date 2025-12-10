"use client";

import { useEffect, useState } from 'react';
import { Header } from "@/components/layout/Header";
import { Container } from "@/components/layout/Container";
import { useToast } from "@/components/ui/ToastProvider";
import { LoadingSpinner } from "@/components/shared/LoadingSpinner";
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { authApi } from '@/lib/api/auth.api';
import { getAccessToken } from '@/lib/auth/token';
import { User } from '@/types/auth.types';

const UserProfilePage = () => {
  const { show: showCustomToast } = useToast();
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);
  const [currentPassword, setCurrentPassword] = useState('');
  const [newPassword, setNewPassword] = useState('');
  const [confirmNewPassword, setConfirmNewPassword] = useState('');

  const handleChangePassword = async () => {
    if (newPassword !== confirmNewPassword) {
      showCustomToast("New password and confirmation do not match.", "error");
      return;
    }
    const token = getAccessToken();
    if (!token) {
      showCustomToast("Authentication token not found.", "error");
      return;
    }
    try {
      await authApi.changePassword({ currentPassword, newPassword }, token);
      showCustomToast("Password changed successfully.", "success");
      setCurrentPassword('');
      setNewPassword('');
      setConfirmNewPassword('');
    } catch (error: any) {
      const errorMessage = error.response?.data?.message || "Error changing password.";
      showCustomToast(errorMessage, "error");
    }
  };

  useEffect(() => {
    const fetchUserProfile = async () => {
      setLoading(true);
      const token = getAccessToken();
      if (!token) {
        showCustomToast("Authentication token not found.", "error");
        setLoading(false);
        return;
      }
      try {
        const response = await authApi.getMe(token);
        setUser(response.data);
      } catch (error) {
        showCustomToast("Error fetching user profile", "error");
      } finally {
        setLoading(false);
      }
    };

    fetchUserProfile();
  }, []);

  if (loading) {
    return (
      <div className="flex items-center justify-center h-full">
        <LoadingSpinner size="lg" />
      </div>
    );
  }

  if (!user) {
    return (
      <Container>
        <div className="text-center py-10">
          <h2 className="text-2xl font-bold">User Profile Not Found</h2>
          <p className="text-muted-foreground">Could not load user profile data.</p>
        </div>
      </Container>
    );
  }

  return (
    <div>
      <Header
        title="Profile Settings"
        description="Manage your personal information and account details"
        breadcrumbs={[
          { label: "Dashboard", href: "/dashboard" },
          { label: "Settings", href: "/settings" },
          { label: "Profile" },
        ]}
      />

      <Container>
        <Card>
          <CardHeader>
            <CardTitle>Personal Information</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <Label htmlFor="name">Name</Label>
                <Input id="name" value={user.name} readOnly />
              </div>
              <div>
                <Label htmlFor="email">Email</Label>
                <Input id="email" value={user.email} readOnly />
              </div>
            </div>
            {/* Add more profile fields as needed */}
          </CardContent>
        </Card>

        <Card className="mt-6">
          <CardHeader>
            <CardTitle>Change Password</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="grid grid-cols-1 gap-4">
              <div>
                <Label htmlFor="current-password">Current Password</Label>
                <Input
                  id="current-password"
                  type="password"
                  value={currentPassword}
                  onChange={(e) => setCurrentPassword(e.target.value)}
                />
              </div>
              <div>
                <Label htmlFor="new-password">New Password</Label>
                <Input
                  id="new-password"
                  type="password"
                  value={newPassword}
                  onChange={(e) => setNewPassword(e.target.value)}
                />
              </div>
              <div>
                <Label htmlFor="confirm-new-password">Confirm New Password</Label>
                <Input
                  id="confirm-new-password"
                  type="password"
                  value={confirmNewPassword}
                  onChange={(e) => setConfirmNewPassword(e.target.value)}
                />
              </div>
            </div>
            <Button onClick={handleChangePassword}>Change Password</Button>
          </CardContent>
        </Card>
      </Container>
    </div>
  );
};

export default UserProfilePage;
