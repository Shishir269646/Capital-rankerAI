"use client";

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { ScoreBreakdown as ScoreBreakdownType } from "@/types/scoring.types";
import {
    RadarChart,
    PolarGrid,
    PolarAngleAxis,
    PolarRadiusAxis,
    Radar,
    ResponsiveContainer,
} from "recharts";

interface ScoreBreakdownProps {
    breakdown: ScoreBreakdownType;
}

export function ScoreBreakdown({ breakdown }: ScoreBreakdownProps) {
    const data = [
        { category: "Market", value: breakdown.market_score },
        { category: "Traction", value: breakdown.traction_score },
        { category: "Team", value: breakdown.team_score },
        { category: "Financial", value: breakdown.financial_score },
    ];

    return (
        <Card>
            <CardHeader>
                <CardTitle>Score Breakdown</CardTitle>
            </CardHeader>
            <CardContent>
                <ResponsiveContainer width="100%" height={300}>
                    <RadarChart data={data}>
                        <PolarGrid />
                        <PolarAngleAxis dataKey="category" />
                        <PolarRadiusAxis angle={90} domain={[0, 100]} />
                        <Radar
                            name="Score"
                            dataKey="value"
                            stroke="#3b82f6"
                            fill="#3b82f6"
                            fillOpacity={0.6}
                        />
                    </RadarChart>
                </ResponsiveContainer>
            </CardContent>
        </Card>
    );
}
