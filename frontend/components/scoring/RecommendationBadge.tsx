import { Badge } from "@/components/ui/badge";
import { TrendingUp, Target, AlertCircle, TrendingDown } from "lucide-react";

interface RecommendationBadgeProps {
    recommendation: 'pass' | 'watch' | 'consider' | 'strong-consider' | 'pursue';
    size?: "sm" | "md" | "lg";
}

export function RecommendationBadge({ recommendation, size = "md" }: RecommendationBadgeProps) {
    const config = {
        'strong-consider': {
            label: "Strong Consider",
            icon: TrendingUp,
            variant: "default" as const,
        },
        'consider': {
            label: "Consider",
            icon: Target,
            variant: "secondary" as const,
        },
        'watch': {
            label: "Watch",
            icon: AlertCircle,
            variant: "secondary" as const,
        },
        'pass': {
            label: "Pass",
            icon: TrendingDown,
            variant: "destructive" as const,
        },
        'pursue': {
            label: "Pursue",
            icon: TrendingUp,
            variant: "default" as const,
        },
    };

    const { label, icon: Icon, variant } = config[recommendation] || config.pass;

    return (
        <Badge variant={variant} className={size === "lg" ? "px-4 py-2 text-base" : size === "sm" ? "px-2 py-1 text-xs" : ""
        }>
            <Icon className={`mr-2 ${size === "lg" ? "h-5 w-5" : "h-4 w-4"}`} />
            {label}
        </Badge>
    );
}
