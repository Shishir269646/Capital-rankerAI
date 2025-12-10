"use client";

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { cn } from "@/lib/utils";

interface GaugeChartProps {
    value: number;
    max?: number;
    title?: string;
    size?: "sm" | "md" | "lg";
}

export function GaugeChart({ value, max = 100, title, size = "md" }: GaugeChartProps) {
    const percentage = (value / max) * 100;
    const getColor = (val: number) => {
        if (val >= 80) return "#10b981";
        if (val >= 60) return "#f59e0b";
        return "#ef4444";
    };

    const sizeClasses = {
        sm: "w-32 h-32",
        md: "w-48 h-48",
        lg: "w-64 h-64",
    };

    const radius = size === "lg" ? 100 : size === "md" ? 75 : 50;
    const circumference = 2 * Math.PI * radius;
    const offset = circumference - (percentage / 100) * circumference;

    return (
        <Card>
            {title && (
                <CardHeader>
                    <CardTitle>{title}</CardTitle>
                </CardHeader>
            )}
            <CardContent className="flex justify-center">
                <div className={cn("relative", sizeClasses[size])}>
                    <svg className="transform -rotate-90 w-full h-full">
                        <circle
                            cx="50%"
                            cy="50%"
                            r={radius}
                            stroke="#e5e7eb"
                            strokeWidth="12"
                            fill="none"
                        />
                        <circle
                            cx="50%"
                            cy="50%"
                            r={radius}
                            stroke={getColor(value)}
                            strokeWidth="12"
                            fill="none"
                            strokeDasharray={circumference}
                            strokeDashoffset={offset}
                            strokeLinecap="round"
                            className="transition-all duration-1000 ease-out"
                        />
                    </svg>
                    <div className="absolute inset-0 flex items-center justify-center">
                        <div className="text-center">
                            <span className={cn("font-bold", size === "lg" ? "text-5xl" : size === "md" ? "text-3xl" : "text-2xl")}>
                                {value}
                            </span>
                            <p className="text-sm text-muted-foreground">/{max}</p>
                        </div>
                    </div>
                </div>
            </CardContent>
        </Card>
    );
}
