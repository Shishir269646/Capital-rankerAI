"use client";

import { useEffect, useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Header } from "@/components/layout/Header";
import { Container } from "@/components/layout/Container";
import { DealCard } from "@/components/deals/DealCard";
import { LoadingSpinner } from "@/components/shared/LoadingSpinner";
import {
    Briefcase,
    TrendingUp,
    Users,
    Bell,
    Plus,
    ArrowRight,
} from "lucide-react";
import { Deal } from "@/types/deal.types";
import { useRouter } from "next/navigation";
import { dealsApi } from "@/lib/api/deals.api";
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from "recharts";

export default function DashboardPage() {
    const router = useRouter();
    const [recentDeals, setRecentDeals] = useState<Deal[]>([]);
    const [loading, setLoading] = useState(true);
    const [stats, setStats] = useState({
        totalDeals: 0,
        avgScore: 0,
        pendingReviews: 0,
        alertsCount: 3,
    });

    useEffect(() => {
        loadDashboardData();
    }, []);

    const loadDashboardData = async () => {
        try {
            setLoading(true);
            // Load recent deals
            const deals = await dealsApi.getDeals({ limit: 6 });
            setRecentDeals(deals.slice(0, 6));

            // Calculate stats
            const scoredDeals = deals.filter(d => d.score);
            const avgScore = scoredDeals.reduce((sum, d) => sum + (d.score?.investment_fit_score || 0), 0) / scoredDeals.length;

            setStats({
                totalDeals: deals.length,
                avgScore: Math.round(avgScore),
                pendingReviews: deals.filter(d => !d.score).length,
                alertsCount: 3,
            });
        } catch (error) {
            console.error("Failed to load dashboard data:", error);
        } finally {
            setLoading(false);
        }
    };

    const scoreDistribution = [
        { range: "0-20", count: 5 },
        { range: "21-40", count: 12 },
        { range: "41-60", count: 23 },
        { range: "61-80", count: 35 },
        { range: "81-100", count: 18 },
    ];

    if (loading) {
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
                description="Overview of your investment pipeline"
                action={
                    <Button onClick={() => router.push("/deals/new")}>
                        <Plus className="mr-2 h-4 w-4" />
                        Add Deal
                    </Button>
                }
            />

            <Container>
                <div className="space-y-6">
                    {/* Stats Grid */}
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
                        <Card>
                            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                                <CardTitle className="text-sm font-medium">Total Deals</CardTitle>
                                <Briefcase className="h-4 w-4 text-muted-foreground" />
                            </CardHeader>
                            <CardContent>
                                <div className="text-2xl font-bold">{stats.totalDeals}</div>
                                <p className="text-xs text-muted-foreground">
                                    +12% from last month
                                </p>
                            </CardContent>
                        </Card>

                        <Card>
                            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                                <CardTitle className="text-sm font-medium">Avg Score</CardTitle>
                                <TrendingUp className="h-4 w-4 text-muted-foreground" />
                            </CardHeader>
                            <CardContent>
                                <div className="text-2xl font-bold">{stats.avgScore}</div>
                                <p className="text-xs text-muted-foreground">
                                    +5 points from last month
                                </p>
                            </CardContent>
                        </Card>

                        <Card>
                            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                                <CardTitle className="text-sm font-medium">Pending Reviews</CardTitle>
                                <Users className="h-4 w-4 text-muted-foreground" />
                            </CardHeader>
                            <CardContent>
                                <div className="text-2xl font-bold">{stats.pendingReviews}</div>
                                <p className="text-xs text-muted-foreground">
                                    Awaiting scoring
                                </p>
                            </CardContent>
                        </Card>

                        <Card>
                            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                                <CardTitle className="text-sm font-medium">Active Alerts</CardTitle>
                                <Bell className="h-4 w-4 text-muted-foreground" />
                            </CardHeader>
                            <CardContent>
                                <div className="text-2xl font-bold">{stats.alertsCount}</div>
                                <p className="text-xs text-muted-foreground">
                                    Requires attention
                                </p>
                            </CardContent>
                        </Card>
                    </div>

                    {/* Score Distribution Chart */}
                    <Card>
                        <CardHeader>
                            <CardTitle>Score Distribution</CardTitle>
                        </CardHeader>
                        <CardContent>
                            <ResponsiveContainer width="100%" height={300}>
                                <BarChart data={scoreDistribution}>
                                    <CartesianGrid strokeDasharray="3 3" />
                                    <XAxis dataKey="range" />
                                    <YAxis />
                                    <Tooltip />
                                    <Bar dataKey="count" fill="#3b82f6" />
                                </BarChart>
                            </ResponsiveContainer>
                        </CardContent>
                    </Card>

                    {/* Recent Deals */}
                    <div>
                        <div className="flex items-center justify-between mb-4">
                            <h2 className="text-2xl font-bold">Recent Deals</h2>
                            <Button variant="ghost" onClick={() => router.push("/deals")}>
                                View All
                                <ArrowRight className="ml-2 h-4 w-4" />
                            </Button>
                        </div>

                        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                            {recentDeals.map((deal) => (
                                <DealCard
                                    key={deal.id}
                                    deal={deal}
                                    onScore={(id) => router.push(`/scoring?dealId=${id}`)}
                                />
                            ))}
                        </div>
                    </div>

                    {/* Quick Actions */}
                    <Card>
                        <CardHeader>
                            <CardTitle>Quick Actions</CardTitle>
                        </CardHeader>
                        <CardContent>
                            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                                <Button
                                    variant="outline"
                                    className="h-auto flex-col py-6"
                                    onClick={() => router.push("/deals/new")}
                                >
                                    <Plus className="h-8 w-8 mb-2" />
                                    <span className="font-semibold">Add New Deal</span>
                                    <span className="text-xs text-muted-foreground mt-1">
                                        Create a new investment opportunity
                                    </span>
                                </Button>

                                <Button
                                    variant="outline"
                                    className="h-auto flex-col py-6"
                                    onClick={() => router.push("/scoring")}
                                >
                                    <TrendingUp className="h-8 w-8 mb-2" />
                                    <span className="font-semibold">Run Scoring</span>
                                    <span className="text-xs text-muted-foreground mt-1">
                                        Evaluate pending deals
                                    </span>
                                </Button>

                                <Button
                                    variant="outline"
                                    className="h-auto flex-col py-6"
                                    onClick={() => router.push("/reports/generate")}
                                >
                                    <Bell className="h-8 w-8 mb-2" />
                                    <span className="font-semibold">Generate Report</span>
                                    <span className="text-xs text-muted-foreground mt-1">
                                        Create investment report
                                    </span>
                                </Button>
                            </div>
                        </CardContent>
                    </Card>
                </div>
            </Container>
        </div>
    );
}
