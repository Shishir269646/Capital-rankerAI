"use client";

import { useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { AppDispatch, RootState } from "@/store";
import { getAllAlerts, markAsRead, deleteAlert, selectCurrentAlerts, selectAlertsLoading, selectAlertsError } from "@/store/slices/alertsSlice";
import { Header } from "@/components/layout/Header";
import { Container } from "@/components/layout/Container";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { useToast } from "@/components/ui/ToastProvider";
import { LoadingSpinner } from "@/components/shared/LoadingSpinner";
import { Bell, BellOff, Trash2, AlertCircle } from "lucide-react";
import { EmptyState } from "@/components/shared/EmptyState";
import { Alert } from "@/types/alert.types";

export default function AlertsPage() {
    const dispatch = useDispatch<AppDispatch>();
    const { show: showCustomToast } = useToast();

    const alerts = useSelector(selectCurrentAlerts);
    const loading = useSelector(selectAlertsLoading);
    const error = useSelector(selectAlertsError);

    useEffect(() => {
        dispatch(getAllAlerts(undefined));
    }, [dispatch]);

    useEffect(() => {
        if (error) {
            showCustomToast(`Error: ${error}`, "error");
        }
    }, [error, showCustomToast]);

    const handleMarkAllAsRead = async () => {
        showCustomToast("Mark all as read (not yet implemented)", "info");
    };

    const handleMarkAsRead = async (alertId: string) => {
        await dispatch(markAsRead(alertId));
        showCustomToast("Alert marked as read", "success");
    };

    const handleDelete = async (alertId: string) => {
        await dispatch(deleteAlert(alertId));
        showCustomToast("Alert deleted", "success");
    };

    if (loading && alerts.length === 0) {
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
                    <Button onClick={handleMarkAllAsRead} variant="outline">
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
                        {alerts.map((alert: Alert) => (
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