"use client";

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { cn } from "@/lib/utils/cn";

interface HeatMapProps {
    data: Array<{ x: string; y: string; value: number }>;
    title?: string;
}

export function HeatMap({ data, title }: HeatMapProps) {
    const getColor = (value: number) => {
        if (value >= 80) return "bg-green-500";
        if (value >= 60) return "bg-yellow-500";
        if (value >= 40) return "bg-orange-500";
        return "bg-red-500";
    };

    const xLabels = [...new Set(data.map(d => d.x))];
    const yLabels = [...new Set(data.map(d => d.y))];

    return (
        <Card>
            {title && (
                <CardHeader>
                    <CardTitle>{title}</CardTitle>
                </CardHeader>
            )}
            <CardContent>
                <div className="overflow-x-auto">
                    <div className="inline-grid gap-1" style={{ gridTemplateColumns: `auto repeat(${xLabels.length}, 1fr)` }}>
                        <div />
                        {xLabels.map(label => (
                            <div key={label} className="text-xs text-center font-medium p-2">
                                {label}
                            </div>
                        ))}
                        {yLabels.map(yLabel => (
                            <>
                                <div key={yLabel} className="text-xs font-medium p-2">
                                    {yLabel}
                                </div>
                                {xLabels.map(xLabel => {
                                    const cell = data.find(d => d.x === xLabel && d.y === yLabel);
                                    return (
                                        <div
                                            key={`${xLabel}-${yLabel}`}
                                            className={cn(
                                                "h-12 w-12 flex items-center justify-center text-white font-bold text-sm rounded",
                                                getColor(cell?.value || 0)
                                            )}
                                        >
                                            {cell?.value || 0}
                                        </div>
                                    );
                                })}
                            </>
                        ))}
                    </div>
                </div>
            </CardContent>
        </Card>
    );
}
