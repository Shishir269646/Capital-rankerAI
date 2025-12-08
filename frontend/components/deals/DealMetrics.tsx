"use client";

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Deal } from "@/types/deal.types";
import { formatCurrency } from "@/lib/utils/format";
import { TrendingUp, DollarSign, Users, Calendar } from "lucide-react";

interface DealMetricsProps {
    deal: Deal;
}

export function DealMetrics({ deal }: DealMetricsProps) {
    const metrics = [
        {
            title: "Annual Revenue",
            value: formatCurrency(deal.metrics.revenue),
            icon: DollarSign,
            trend: `${deal.metrics.revenue_growth_rate}% YoY`,
            trendUp: deal.metrics.revenue_growth_rate > 0,
        },
        {
            title: "Monthly Burn Rate",
            value: deal.metrics.burn_rate ? formatCurrency(deal.metrics.burn_rate) : "N/A",
            icon: TrendingUp,
            subtext: deal.metrics.runway_months ? `${deal.metrics.runway_months} months runway` : undefined,
        },
        {
            title: "Team Size",
            value: deal.team_size?.toString() || "N/A",
            icon: Users,
            subtext: "Employees",
        },
        {
            title: "Founded",
            value: deal.founded_year?.toString() || "N/A",
            icon: Calendar,
            subtext: deal.founded_year ? `${new Date().getFullYear() - deal.founded_year} years old` : undefined,
        },
    ];

    return (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4" >
            {
                metrics.map((metric, index) => (
                    <Card key={index} >
                        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2" >
                            <CardTitle className="text-sm font-medium" > {metric.title} </CardTitle>
                            < metric.icon className="h-4 w-4 text-muted-foreground" />
                        </CardHeader>
                        < CardContent >
                            <div className="text-2xl font-bold" > {metric.value} </div>
                            {
                                metric.trend && (
                                    <p className={`text-xs ${metric.trendUp ? 'text-green-600' : 'text-red-600'} flex items-center gap-1 mt-1`} >
                                        <TrendingUp className={`h-3 w-3 ${!metric.trendUp && 'rotate-180'}`} />
                                        {metric.trend}
                                    </p>
                                )
                            }
                            {
                                metric.subtext && (
                                    <p className="text-xs text-muted-foreground mt-1" > {metric.subtext} </p>
                                )
                            }
                        </CardContent>
                    </Card>
                ))}
        </div>
    );
}
