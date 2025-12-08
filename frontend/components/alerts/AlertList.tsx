import { AlertCard } from "./AlertCard";
import { EmptyState } from "../shared/EmptyState";
import { Bell } from "lucide-react";

interface Alert {
    id: string;
    title: string;
    description: string;
    type: "info" | "warning" | "success" | "error";
    read: boolean;
    created_at: string;
}

interface AlertListProps {
    alerts: Alert[];
    onMarkAsRead?: (id: string) => void;
    onDelete?: (id: string) => void;
}

export function AlertList({ alerts, onMarkAsRead, onDelete }: AlertListProps) {
    if (alerts.length === 0) {
        return (
            <EmptyState
                icon={Bell}
                title="No alerts"
                description="You're all caught up! No new alerts."
            />
        );
    }

    return (
        <div className="space-y-4">
            {alerts.map((alert) => (
                <AlertCard
                    key={alert.id}
                    alert={alert}
                    onMarkAsRead={onMarkAsRead}
                    onDelete={onDelete}
                />
            ))}
        </div>
    );
}
