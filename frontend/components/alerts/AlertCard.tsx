import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Bell, Check, Trash2 } from "lucide-react";
import { formatRelativeTime } from "@/lib/utils/format";

interface AlertCardProps {
    alert: {
        id: string;
        title: string;
        description: string;
        type: "info" | "warning" | "success" | "error";
        read: boolean;
        created_at: string;
    };
    onMarkAsRead?: (id: string) => void;
    onDelete?: (id: string) => void;
}

export function AlertCard({ alert, onMarkAsRead, onDelete }: AlertCardProps) {
    const getTypeVariant = (type: string) => {
        switch (type) {
            case "success":
                return "default" as const;
            case "warning":
                return "destructive" as const;
            case "error":
                return "destructive" as const;
            default:
                return "secondary" as const;
        }
    };

    return (
        <Card className={alert.read ? "opacity-60" : ""}>
            <CardContent className="pt-6">
                <div className="flex items-start gap-4">
                    <div className="mt-1">
                        <Bell className="h-5 w-5 text-muted-foreground" />
                    </div>

                    <div className="flex-1 space-y-2">
                        <div className="flex items-start justify-between gap-4">
                            <div>
                                <h3 className="font-semibold">{alert.title}</h3>
                                <p className="text-sm text-muted-foreground">
                                    {alert.description}
                                </p>
                            </div>
                            <Badge variant={getTypeVariant(alert.type)}>{alert.type}</Badge>
                        </div>

                        <div className="flex items-center justify-between">
                            <span className="text-xs text-muted-foreground">
                                {formatRelativeTime(alert.created_at)}
                            </span>

                            <div className="flex items-center gap-2">
                                {!alert.read && onMarkAsRead && (
                                    <Button
                                        variant="ghost"
                                        size="sm"
                                        onClick={() => onMarkAsRead(alert.id)}
                                    >
                                        <Check className="h-4 w-4 mr-1" />
                                        Mark as Read
                                    </Button>
                                )}
                                {onDelete && (
                                    <Button
                                        variant="ghost"
                                        size="icon"
                                        onClick={() => onDelete(alert.id)}
                                    >
                                        <Trash2 className="h-4 w-4" />
                                    </Button>
                                )}
                            </div>
                        </div>
                    </div>
                </div>
            </CardContent>
        </Card>
    );
}