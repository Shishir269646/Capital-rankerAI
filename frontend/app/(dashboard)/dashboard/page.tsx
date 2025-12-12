"use client";

import { useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { AppDispatch, RootState } from "@/store";
import { getDealStats, getTopRankedDeals, selectDealStats, selectTopRankedDeals, selectDealsLoading } from "@/store/slices/dealsSlice";
import { fetchFounders, selectFounders, selectFoundersPagination, selectFoundersLoading } from "@/store/slices/foundersSlice";
import { fetchPortfolioAnalytics, selectPortfolioAnalytics, selectPortfolioLoading } from "@/store/slices/portfolioSlice";
import {
    Home,
    Folder,
    Award,
    Star,
    AlertCircle,
    BarChart,
    Users,
    Activity,
    Settings,
    TrendingUp,
    TrendingDown,
} from "lucide-react";
import { Header } from "@/components/layout/Header";
import { Container } from "@/components/layout/Container";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { useToast } from "@/components/ui/ToastProvider";
import { EmptyState } from "@/components/shared/EmptyState";
import { LoadingSpinner } from "@/components/shared/LoadingSpinner";
import { PieChart, Pie, Cell, ResponsiveContainer, Legend, Tooltip } from "recharts";
import type { Deal } from "@/types/deal.types";
import type { Founder } from "@/types/founder.types";

export default function DashboardPage() {
    const router = useRouter();
    const dispatch = useDispatch<AppDispatch>();
    const { show: showCustomToast } = useToast();

    // Selectors
    const dealsStats = useSelector(selectDealStats);
    const topDeals = useSelector(selectTopRankedDeals);
    const dealsLoading = useSelector(selectDealsLoading);

    const latestFounders = useSelector(selectFounders);
    const foundersPagination = useSelector(selectFoundersPagination);
    const foundersLoading = useSelector(selectFoundersLoading);

    const portfolioStats = useSelector(selectPortfolioAnalytics);
    const portfolioLoading = useSelector(selectPortfolioLoading);
    
    const loading = dealsLoading || foundersLoading || portfolioLoading;

    useEffect(() => {
        dispatch(getDealStats());
        dispatch(getTopRankedDeals({ limit: 5 }));
        dispatch(fetchFounders({ limit: 5, sort_by: "created_at", sort_order: "desc" }));
        dispatch(fetchPortfolioAnalytics());
    }, [dispatch]);

    const dealStatusData = [
        { name: "Scored", value: dealsStats?.scored || 0, color: "#82ca9d" },
        { name: "Pending", value: dealsStats?.pending || 0, color: "#ffc658" },
        { name: "Invested", value: dealsStats?.invested || 0, color: "#8884d8" },
    ];

    if (loading && !dealsStats && !portfolioStats) {
        return (
            <div className="flex items-center justify-center h-full">
                <LoadingSpinner size="lg" />
            </div>
        );
    }

    return (
        <div>
            <Header
                title="Dashboard"
                description="Overview of your investment pipeline and portfolio"
                breadcrumbs={[{ label: "Dashboard" }]}
            />

            <Container>
                <div className="space-y-6">
                    {/* Key Metrics */}
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
                        <Card>
                            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                                <CardTitle className="text-sm font-medium">Total Deals</CardTitle>
                                <Folder className="h-4 w-4 text-muted-foreground" />
                            </CardHeader>
                            <CardContent>
                                <div className="text-2xl font-bold">{dealsStats?.total || 0}</div>
                                <p className="text-xs text-muted-foreground">
                                    {dealsStats?.scored || 0} scored, {dealsStats?.pending || 0} pending
                                </p>
                            </CardContent>
                        </Card>

                        <Card>
                            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                                <CardTitle className="text-sm font-medium">Total Founders</CardTitle>
                                <Users className="h-4 w-4 text-muted-foreground" />
                            </CardHeader>
                            <CardContent>
                                <div className="text-2xl font-bold">{foundersPagination?.totalResults || 0}</div>
                                <p className="text-xs text-muted-foreground">
                                    Across all deals
                                </p>
                            </CardContent>
                        </Card>

                        <Card>
                            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                                <CardTitle className="text-sm font-medium">
                                    Total Investments
                                </CardTitle>
                                <Activity className="h-4 w-4 text-muted-foreground" />
                            </CardHeader>
                            <CardContent>
                                <div className="text-2xl font-bold">
                                    {portfolioStats?.totalInvestments || 0}
                                </div>
                                <p className="text-xs text-muted-foreground">
                                    {portfolioStats?.totalValue > 0 ? `Value: $${portfolioStats.totalValue.toLocaleString()}` : "No active portfolio"}
                                </p>
                            </CardContent>
                        </Card>

                        <Card>
                            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                                <CardTitle className="text-sm font-medium">
                                    Portfolio Performance
                                </CardTitle>
                                {(portfolioStats?.totalGainLoss || 0) >= 0 ? (
                                    <TrendingUp className="h-4 w-4 text-green-500" />
                                ) : (
                                    <TrendingDown className="h-4 w-4 text-red-500" />
                                )}
                            </CardHeader>
                            <CardContent>
                                <div className="text-2xl font-bold">
                                    {(portfolioStats?.totalGainLoss || 0) >= 0 ? "+" : "-"}
                                    {portfolioStats?.gainLossPercentage || 0}%
                                </div>
                                <p className="text-xs text-muted-foreground">
                                    {(portfolioStats?.totalGainLoss || 0) >= 0 ? "Gain" : "Loss"}: $
                                    {Math.abs(portfolioStats?.totalGainLoss || 0).toLocaleString()}
                                </p>
                            </CardContent>
                        </Card>
                    </div>

                    <div className="grid grid-cols-1 lg:grid-cols-3 gap-4">
                        {/* Deal Status Distribution */}
                        <Card className="lg:col-span-2">
                            <CardHeader>
                                <CardTitle>Deal Status Distribution</CardTitle>
                            </CardHeader>
                            <CardContent className="h-72">
                                {(dealsStats?.total || 0) > 0 ? (
                                    <ResponsiveContainer width="100%" height="100%">
                                        <PieChart>
                                            <Pie
                                                data={dealStatusData}
                                                cx="50%"
                                                cy="50%"
                                                innerRadius={60}
                                                outerRadius={80}
                                                fill="#8884d8"
                                                dataKey="value"
                                                labelLine={false}
                                            >
                                                {dealStatusData.map((entry, index) => (
                                                    <Cell key={`cell-${index}`} fill={entry.color} />
                                                ))}
                                            </Pie>
                                            <Tooltip />
                                            <Legend />
                                        </PieChart>
                                    </ResponsiveContainer>
                                ) : (
                                    <EmptyState title="No Deals Data" description="Add deals to see distribution" />
                                )}
                            </CardContent>
                        </Card>

                        {/* Quick Actions */}
                        <Card>
                            <CardHeader>
                                <CardTitle>Quick Actions</CardTitle>
                            </CardHeader>
                            <CardContent className="space-y-2">
                                <Button className="w-full" onClick={() => router.push("/deals/new")}>
                                    Add New Deal
                                </Button>
                                <Button variant="outline" className="w-full" onClick={() => router.push("/deals")}>
                                    View All Deals
                                </Button>
                                <Button variant="outline" className="w-full" onClick={() => router.push("/scoring")}>
                                    Score Deals
                                </Button>
                                <Button variant="outline" className="w-full" onClick={() => router.push("/reports/generate")}>
                                    Generate Report
                                </Button>
                            </CardContent>
                        </Card>
                    </div>

                    {/* Top Ranked Deals */}
                    <Card>
                        <CardHeader className="flex flex-row items-center justify-between">
                            <CardTitle>Top Ranked Deals</CardTitle>
                            <Button variant="ghost" onClick={() => router.push("/deals")}>
                                View All
                            </Button>
                        </CardHeader>
                        <CardContent>
                            {topDeals && topDeals.length > 0 ? (
                                <div className="space-y-4">
                                    {topDeals.map((deal: Deal) => (
                                        <div key={deal.id} className="flex items-center justify-between">
                                            <Link href={`/deals/${deal.id}`} className="flex-1 hover:underline">
                                                <p className="font-medium">{deal.name}</p>
                                                <p className="text-sm text-muted-foreground">{deal.sector.join(", ")}</p>
                                            </Link>
                                            {deal.score?.investment_fit_score && (
                                                <Badge>Score: {deal.score.investment_fit_score}</Badge>
                                            )}
                                        </div>
                                    ))}
                                </div>
                            ) : (
                                <EmptyState title="No Top Deals" description="Score more deals to see top performers" />
                            )}
                        </CardContent>
                    </Card>

                    {/* Latest Founders */}
                    <Card>
                        <CardHeader className="flex flex-row items-center justify-between">
                            <CardTitle>Latest Founders</CardTitle>
                            <Button variant="ghost" onClick={() => router.push("/founders")}>
                                View All
                            </Button>
                        </CardHeader>
                        <CardContent>
                            {latestFounders.length > 0 ? (
                                <div className="space-y-4">
                                    {latestFounders.map((founder: Founder) => (
                                        <div key={founder.id} className="flex items-center justify-between">
                                            <Link href={`/founders/${founder.id}`} className="flex-1 hover:underline">
                                                <p className="font-medium">{founder.name}</p>
                                                <p className="text-sm text-muted-foreground">{founder.role}</p>
                                            </Link>
                                            {founder.founder_score?.overall_score && (
                                                <Badge>Score: {founder.founder_score.overall_score}</Badge>
                                            )}
                                        </div>
                                    ))}
                                </div>
                            ) : (
                                <EmptyState title="No Founders" description="Add founders to see their profiles" />
                            )}
                        </CardContent>
                    </Card>
                </div>
            </Container>
        </div>
    );
}