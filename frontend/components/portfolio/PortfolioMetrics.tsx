import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { TrendingUp, DollarSign, PieChart, Target } from "lucide-react";
import { formatCurrency } from "@/lib/utils/format";

interface PortfolioMetricsProps {
    metrics: {
        totalInvested: number;
        portfolioValue: number;
        avgIRR: number;
        avgMultiple: number;
        activeCompanies: number;
        exited: number;
    };
}

export function PortfolioMetrics({ metrics }: PortfolioMetricsProps) {
    const unrealizedGain = metrics.portfolioValue - metrics.totalInvested;

    return (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
            <Card>
                <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                    <CardTitle className="text-sm font-medium">Total Invested</CardTitle>
                    <DollarSign className="h-4 w-4 text-muted-foreground" />
                </CardHeader>
                <CardContent>
                    <div className="text-2xl font-bold">{formatCurrency(metrics.totalInvested)}</div>
                    <p className="text-xs text-muted-foreground">
                        Across {metrics.activeCompanies} companies
                    </p>
                </CardContent>
            </Card>

            <Card>
                <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                    <CardTitle className="text-sm font-medium">Portfolio Value</CardTitle>
                    <TrendingUp className="h-4 w-4 text-muted-foreground" />
                </CardHeader>
                <CardContent>
                    <div className="text-2xl font-bold">{formatCurrency(metrics.portfolioValue)}</div>
                    <p className="text-xs text-green-600">
                        +{formatCurrency(unrealizedGain)} unrealized gain
                    </p>
                </CardContent>
            </Card>

            <Card>
                <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                    <CardTitle className="text-sm font-medium">Avg IRR</CardTitle>
                    <Target className="h-4 w-4 text-muted-foreground" />
                </CardHeader>
                <CardContent>
                    <div className="text-2xl font-bold">{metrics.avgIRR}%</div>
                    <p className="text-xs text-muted-foreground">Internal rate of return</p>
                </CardContent>
            </Card>

            <Card>
                <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                    <CardTitle className="text-sm font-medium">Avg Multiple</CardTitle>
                    <PieChart className="h-4 w-4 text-muted-foreground" />
                </CardHeader>
                <CardContent>
                    <div className="text-2xl font-bold">{metrics.avgMultiple}x</div>
                    <p className="text-xs text-muted-foreground">{metrics.exited} exits realized</p>
                </CardContent>
            </Card>
        </div>
    );
}
