"use client";

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Line, LineChart, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from "recharts";

const mockData = [
    { month: "Jan", value: 2500000 },
    { month: "Feb", value: 2700000 },
    { month: "Mar", value: 3100000 },
    { month: "Apr", value: 3500000 },
    { month: "May", value: 3800000 },
    { month: "Jun", value: 4200000 },
];

export function PortfolioChart() {
    return (
        <Card>
            <CardHeader>
                <CardTitle>Portfolio Performance</CardTitle>
            </CardHeader>
            <CardContent>
                <ResponsiveContainer width="100%" height={300}>
                    <LineChart data={mockData}>
                        <CartesianGrid strokeDasharray="3 3" />
                        <XAxis dataKey="month" />
                        <YAxis />
                        <Tooltip formatter={(value) => `$${(Number(value) / 1000000).toFixed(1)}M`} />
                        <Line type="monotone" dataKey="value" stroke="#3b82f6" strokeWidth={2} />
                    </LineChart>
                </ResponsiveContainer>
            </CardContent>
        </Card>
    );
}
