"use client";

import { Line, LineChart as RechartsLineChart, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer } from "recharts";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

interface LineChartProps {
    data: any[];
    xKey: string;
    yKey: string;
    title?: string;
    color?: string;
}

export function LineChart({ data, xKey, yKey, title, color = "#3b82f6" }: LineChartProps) {
    return (
        <Card>
            {title && (
                <CardHeader>
                    <CardTitle>{title}</CardTitle>
                </CardHeader>
            )}
            <CardContent>
                <ResponsiveContainer width="100%" height={300}>
                    <RechartsLineChart data={data}>
                        <CartesianGrid strokeDasharray="3 3" />
                        <XAxis dataKey={xKey} />
                        <YAxis />
                        <Tooltip />
                        <Legend />
                        <Line type="monotone" dataKey={yKey} stroke={color} strokeWidth={2} />
                    </RechartsLineChart>
                </ResponsiveContainer>
            </CardContent>
        </Card>
    );
}
