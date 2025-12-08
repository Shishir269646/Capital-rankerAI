"use client";

import { useState } from "react";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Header } from "@/components/layout/Header";
import { Container } from "@/components/layout/Container";
import { Bell, CheckCheck, Trash2 } from "lucide-react";
import { formatRelativeTime } from "@/lib/utils/format";

interface Alert {
    id: string;
    title: string;
    description: string;
    type: "info" | "warning" | "success";
    read: boolean;
    created_at: string;
}

export default function AlertsPage() {
    const [alerts, setAlerts] = useState<Alert[]>([
        {
            id: "1",
            title: "New deal scored",
            description: "Acme Corp has been evaluated with a score of 85",
            type: "success",
            read: false,
            created_at: new Date(Date.now() - 3600000).toISOString(),
        },
        {
            id: "2",
            title: "Thesis match found",
            description: "TechCo matches your AI/ML investment thesis",
            type: "info",
            read: false,
            created_at: new Date(Date.now() - 7200000).toISOString(),
        },
        {
            id: "3",
            title: "Red flag detected",
            description: "Founder background check found concerning information",
            type: "warning",
            read: true,
            created_at: new Date(Date.now() - 86400000).toISOString(),
        },
    ]);

    const handleMarkAsRead = (id: string) => {
        setAlerts(alerts.map(a => a.id === id ? { ...a, read: true } : a));
    };

    const handleMarkAllAsRead = () => {
        setAlerts(alerts.map(a => ({ ...a, read: true })));
    };

    const handleDelete = (id: string) => {
        setAlerts(alerts.filter(a => a.id !== id));
    };

    const unreadCount = alerts.filter(a => !a.read).length;

    return (
        <div>
            <Header
                title="Alerts"
                description={`${unreadCount} unread notification${unreadCount !== 1 ? 's' : ''}`
                }
                breadcrumbs={
                    [
                        { label: "Dashboard", href: "/dashboard" },
                        { label: "Alerts" },
                    ]}
                action={
                    unreadCount > 0 && (
                        <Button onClick={handleMarkAllAsRead} variant="outline" >
                            <CheckCheck className="mr-2 h-4 w-4" />
                            Mark All as Read
                        </Button>
                    )
                }
            />

            < Container >
                <div className="space-y-4" >
                    {
                        alerts.map((alert) => (
                            <Card key={alert.id} className={alert.read ? "opacity-60" : ""} >
                                <CardContent className="pt-6" >
                                    <div className="flex items-start gap-4" >
                                        <div className="mt-1" >
                                            <Bell className="h-5 w-5 text-muted-foreground" />
                                        </div>

                                        < div className="flex-1 space-y-2" >
                                            <div className="flex items-start justify-between" >
                                                <div>
                                                    <h3 className="font-semibold" > {alert.title} </h3>
                                                    < p className="text-sm text-muted-foreground" >
                                                        {alert.description}
                                                    </p>
                                                </div>
                                                < Badge
                                                    variant={
                                                        alert.type === "success"
                                                            ? "default"
                                                            : alert.type === "warning"
                                                                ? "destructive"
                                                                : "secondary"
                                                    }
                                                >
                                                    {alert.type}
                                                </Badge>
                                            </div>

                                            < div className="flex items-center justify-between" >
                                                <span className="text-xs text-muted-foreground" >
                                                    {formatRelativeTime(alert.created_at)
                                                    }
                                                </span>

                                                < div className="flex items-center gap-2" >
                                                    {!alert.read && (
                                                        <Button
                                                            variant="ghost"
                                                            size="sm"
                                                            onClick={() => handleMarkAsRead(alert.id)}
                                                        >
                                                            Mark as Read
                                                        </Button>
                                                    )}
                                                    <Button
                                                        variant="ghost"
                                                        size="icon"
                                                        onClick={() => handleDelete(alert.id)}
                                                    >
                                                        <Trash2 className="h-4 w-4" />
                                                    </Button>
                                                </div>
                                            </div>
                                        </div>
                                    </div>
                                </CardContent>
                            </Card>
                        ))}
                </div>
            </Container>
        </div>
    );
}
