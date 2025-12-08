import { Badge } from "@/components/ui/badge";
import { Bell } from "lucide-react";

interface AlertBadgeProps {
    count: number;
}

export function AlertBadge({ count }: AlertBadgeProps) {
    if (count === 0) return null;

    return (
        <div className="relative inline-block">
            <Bell className="h-5 w-5" />
            <Badge
                variant="destructive"
                className="absolute -top-2 -right-2 h-5 w-5 flex items-center justify-center p-0 text-xs"
            >
                {count > 9 ? "9+" : count}
            </Badge>
        </div>
    );
}
