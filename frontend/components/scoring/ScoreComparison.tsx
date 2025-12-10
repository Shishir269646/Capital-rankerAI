"use client";

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Deal } from "@/types/deal.types";
import {
    BarChart,
    Bar,
    XAxis,
    YAxis,
    CartesianGrid,
    Tooltip,
    Legend,
    ResponsiveContainer,
} from "recharts";

interface ScoreComparisonProps {
    deals: Deal[];
}

export function ScoreComparison({ deals }: ScoreComparisonProps) {
    const data = deals
        .filter((deal) => deal.score)
        .map((deal) => ({
            name: deal.name.length > 15 ? deal.name.substring(0, 15) + "..." : deal.name,
            market: deal.score!.breakdown.market_score,
            traction: deal.score!.breakdown.traction_score,
            team: deal.score!.breakdown.team_score,
            financial: deal.score!.breakdown.financial_score,
            overall: deal.score!.investment_fit_score,
        }));

    return (
        <Card>
            <CardHeader>
                <CardTitle>Deal Comparison</CardTitle>
            </CardHeader>
            <CardContent>
                <ResponsiveContainer width="100%" height={400}>
                    <BarChart data={data}>
                        <CartesianGrid strokeDasharray="3 3" />
                        <XAxis dataKey="name" />
                        <YAxis domain={[0, 100]} />
                        <Tooltip />
                        <Legend />
                        <Bar dataKey="market" fill="#3b82f6" name="Market" />
                        <Bar dataKey="traction" fill="#10b981" name="Traction" />
                        <Bar dataKey="team" fill="#f59e0b" name="Team" />
                        <Bar dataKey="financial" fill="#8b5cf6" name="Financial" />
                    </BarChart>
                </ResponsiveContainer>
            </CardContent>
        </Card>
    );
}