"use client";

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { AlertTriangle } from "lucide-react";
import { RedFlag } from "@/types/founder.types";
import { formatDate } from "@/lib/utils/format";

interface RedFlagsListProps {
    redFlags: RedFlag[];
}

export function RedFlagsList({ redFlags }: RedFlagsListProps) {
    const getSeverityVariant = (severity: string) => {
        switch (severity) {
            case "high":
                return "destructive" as const;
            case "medium":
                return "default" as const;
            default:
                return "secondary" as const;
        }
    };

    if (redFlags.length === 0) {
        return null;
    }

    return (
        <Card>
            <CardHeader>
                <CardTitle className="flex items-center gap-2 text-destructive">
                    <AlertTriangle className="h-5 w-5" />
                    Red Flags ({redFlags.length})
                </CardTitle>
            </CardHeader>
            <CardContent className="space-y-3">
                {redFlags.map((flag, index) => (
                    <Alert key={index} variant={getSeverityVariant(flag.severity)}>
                        <div className="flex items-start gap-3">
                            <Badge variant={getSeverityVariant(flag.severity)} className="mt-0.5">
                                {flag.severity}
                            </Badge>
                            <div className="flex-1 space-y-1">
                                                                 <p className="font-medium">{flag.type}</p>                                <AlertDescription>{flag.description}</AlertDescription>
                                <p className="text-xs text-muted-foreground">
                                    Detected: {formatDate(flag.detected_at)}
                                </p>
                            </div>
                        </div>
                    </Alert>
                ))}
            </CardContent>
        </Card>
    );
}