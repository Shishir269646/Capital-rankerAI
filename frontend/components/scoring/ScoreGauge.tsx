"use client";

import { Card, CardContent } from "@/components/ui/card";
import { cn } from "@/lib/utils";

interface ScoreGaugeProps {
    score: number;
    size?: "sm" | "md" | "lg";
    showLabel?: boolean;
}

export function ScoreGauge({ score, size = "md", showLabel = true }: ScoreGaugeProps) {
    const getColor = (score: number) => {
        if (score >= 80) return "#10b981"; // green
        if (score >= 60) return "#f59e0b"; // yellow
        return "#ef4444"; // red
    };

    const sizeClasses = {
        sm: "w-24 h-24",
        md: "w-32 h-32",
        lg: "w-48 h-48",
    };

    const radius = size === "lg" ? 70 : size === "md" ? 55 : 40;
    const circumference = 2 * Math.PI * radius;
    const offset = circumference - (score / 100) * circumference;

    return (
        <div className="flex flex-col items-center gap-2">
            <div className={cn("relative", sizeClasses[size])}>
                <svg className="transform -rotate-90 w-full h-full">
                    {/* Background circle */}
                    <circle
                        cx="50%"
                        cy="50%"
                        r={radius}
                        stroke="#e5e7eb"
                        strokeWidth="8"
                        fill="none"
                    />
                    {/* Progress circle */}
                    <circle
                        cx="50%"
                        cy="50%"
                        r={radius}
                        stroke={getColor(score)}
                        strokeWidth="8"
                        fill="none"
                        strokeDasharray={circumference}
                        strokeDashoffset={offset}
                        strokeLinecap="round"
                        className="transition-all duration-1000 ease-out"
                    />
                </svg>
                <div className="absolute inset-0 flex items-center justify-center">
                    <span className={cn(
                        "font-bold",
                        size === "lg" ? "text-4xl" : size === "md" ? "text-2xl" : "text-xl"
                    )}>
                        {score}
                    </span>
                </div>
            </div>
            {showLabel && (
                <p className="text-sm text-muted-foreground">Investment Score</p>
            )}
        </div>
    );
}