"use client";

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Line, LineChart, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from "recharts";

const mockData = [
    { date: "Jan 1", score: 65 },
    { date: "Jan 15", score: 70 },
    { date: "Feb 1", score: 75 },
    { date: "Feb 15", score: 78 },
    { date: "Mar 1", score: 82 },
    { date: "Mar 15", score: 85 },
];

interface ScoreHistoryProps {
    dealId: string;
}

export function ScoreHistory({ dealId }: ScoreHistoryProps) {
    return (
        <Card>
            <CardHeader>
                <CardTitle>Score History </CardTitle>
            </CardHeader>
            < CardContent >
                <ResponsiveContainer width="100%" height={300} >
                    <LineChart data={mockData}>
                        <CartesianGrid strokeDasharray="3 3" />
                        <XAxis dataKey="date" />
                        <YAxis domain={[0, 100]} />
                        < Tooltip />
                        <Line
                            type="monotone"
                            dataKey="score"
                            stroke="#3b82f6"
                            strokeWidth={2}
                            dot={{ fill: "#3b82f6", r: 4 }
                            }
                        />
                    </LineChart>
                </ResponsiveContainer>
            </CardContent>
        </Card>
    );
}
