"use client";

import { Radar, RadarChart as RechartsRadarChart, PolarGrid, PolarAngleAxis, PolarRadiusAxis, ResponsiveContainer } from "recharts";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

interface RadarChartProps {
    data: any[];
    title?: string;
    color?: string;
}

export function RadarChart({ data, title, color = "#3b82f6" }: RadarChartProps) {
    return (
        <Card>
            {title && (
                <CardHeader>
                    <CardTitle>{title}</CardTitle>
                </CardHeader>
            )}
            <CardContent>
                <ResponsiveContainer width="100%" height={300}>
                    <RechartsRadarChart data={data}>
                        <PolarGrid />
                        <PolarAngleAxis dataKey="category" />
                        <PolarRadiusAxis angle={90} domain={[0, 100]} />
                        <Radar name="Score" dataKey="value" stroke={color} fill={color} fillOpacity={0.6} />
                    </RechartsRadarChart>
                </ResponsiveContainer>
            </CardContent>
        </Card>
    );
}
