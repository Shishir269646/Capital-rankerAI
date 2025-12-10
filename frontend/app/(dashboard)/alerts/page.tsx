"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { Header } from "@/components/layout/Header";
import { Container } from "@/components/layout/Container";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { useToast } from "@/components/ui/ToastProvider";
import { LoadingSpinner } from "@/components/shared/LoadingSpinner";
import { Bell, BellOff, Trash2, AlertCircle } from "lucide-react";
import { alertsApi } from "@/lib/api/alerts.api";
import { getAccessToken } from "@/lib/auth/token";
import { Alert } from "@/types/alert.types";
import { EmptyState } from "@/components/shared/EmptyState";

export default function AlertsPage() {
    const { show: showCustomToast } = useToast();
    const [alerts, setAlerts] = useState<Alert[]>([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        loadAlerts();
    }, []);

    const loadAlerts = async () => {
        setLoading(true);
        const token = getAccessToken();
        if (!token) {
            showCustomToast("Authentication token not found.", "error");
            setLoading(false);
            return;
        }
        try {
            const response = await alertsApi.getAllAlerts(token);
            setAlerts(response.results);
        } catch (error) {
            showCustomToast("Error fetching alerts", "error");
        } finally {
            setLoading(false);
        }
    };

    const handleMarkAllAsRead = async () => {
        showCustomToast("Mark all as read (not yet implemented)", "info");
    };

    const handleMarkAsRead = async (alertId: string) => {
        const token = getAccessToken();
        if (!token) {
            showCustomToast("Authentication token not found.", "error");
            return;
        }
        try {
            await alertsApi.markAsRead(alertId, token);
            showCustomToast("Alert marked as read", "success");
            loadAlerts();
        } catch (error) {
            showCustomToast("Error marking alert as read", "error");
        }
    };

    const handleDelete = async (alertId: string) => {
        const token = getAccessToken();
        if (!token) {
            showCustomToast("Authentication token not found.", "error");
            return;
        }
        try {
            await alertsApi.deleteAlert(alertId, token);
            showCustomToast("Alert deleted", "success");
            loadAlerts();
        } catch (error) {
            showCustomToast("Error deleting alert", "error");
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
                title="Alerts"
                description="Stay informed about important events and updates"
                breadcrumbs={[{ label: "Dashboard", href: "/dashboard" }, { label: "Alerts" }]}
                action={
                    <Button onClick={handleMarkAllAsRead} variant="outline" >
                        <BellOff className="mr-2 h-4 w-4" />
                        Mark All as Read
                    </Button>
                }
            />

            <Container>
                {alerts.length === 0 ? (
                    <EmptyState
                        icon={Bell}
                        title="No alerts"
                        description="You're all caught up! No new alerts to show."
                    />
                ) : (
                    <div className="space-y-4">
                        {alerts.map((alert) => (
                            <Card key={alert.id}>
                                <CardContent className="flex items-center justify-between p-4">
                                    <div className="flex items-center space-x-4">
                                        <AlertCircle className="h-6 w-6 text-primary" />
                                        <div>
                                            <p className="font-semibold">{alert.title}</p>
                                            <p className="text-sm text-muted-foreground">{alert.description}</p>
                                        </div>
                                    </div>
                                    <div className="flex space-x-2">
                                        {alert.status === 'unread' && (
                                            <Button
                                                variant="outline"
                                                size="sm"
                                                onClick={() => handleMarkAsRead(alert.id)}
                                            >
                                                Mark as Read
                                            </Button>
                                        )}
                                        <Button
                                            variant="destructive"
                                            size="sm"
                                            onClick={() => handleDelete(alert.id)}
                                        >
                                            <Trash2 className="h-4 w-4 mr-2" /> Delete
                                        </Button>
                                    </div>
                                </CardContent>
                            </Card>
                        ))}
                    </div>
                )}
            </Container>
        </div>
    );
}