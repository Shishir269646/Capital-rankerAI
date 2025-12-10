"use client";

import { useState, useEffect } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Header } from "@/components/layout/Header";
import { Container } from "@/components/layout/Container";
import { LoadingSpinner } from "@/components/shared/LoadingSpinner";
import { EmptyState } from "@/components/shared/EmptyState";
import { PieChart, TrendingUp, DollarSign, Target } from "lucide-react";
import { formatCurrency } from "@/lib/utils/currency";
import { portfolioApi } from "@/lib/api/portfolio.api";
import { getAccessToken } from "@/lib/auth/token";

export default function PortfolioPage() {
    const [loading, setLoading] = useState(true);
    const [stats, setStats] = useState({
        totalInvested: 5000000,
        portfolioValue: 7500000,
        avgIRR: 25,
        avgMultiple: 1.5,
        activeCompanies: 12,
        exited: 3,
    });

    useEffect(() => {
        const fetchPortfolioStats = async () => {
            setLoading(true);
            const token = getAccessToken();
            if (!token) {
                // Handle no token case, e.g., redirect to login
                // For now, just set loading to false and return
                setLoading(false);
                return;
            }

            try {
                const response = await portfolioApi.getAnalytics(token);
                setStats({
                    totalInvested: response.data.totalInvested || 0,
                    portfolioValue: response.data.currentValue || 0,
                    avgIRR: response.data.averageIRR || 0,
                    avgMultiple: response.data.averageMultiple || 0,
                    activeCompanies: response.data.activeInvestments || 0,
                    exited: response.data.exitedInvestments || 0,
                });
            } catch (error) {
                console.error("Error fetching portfolio stats:", error);
                // Optionally show a toast notification
            } finally {
                setLoading(false);
            }
        };

        fetchPortfolioStats();
    }, []);

    if (loading) {
        return (
            <div className="flex items-center justify-center h-full" >
                <LoadingSpinner size="lg" />
            </div>
        );
    }

    return (
        <div>
            <Header
                title="Portfolio"
                description="Track your investment portfolio performance"
                breadcrumbs={
                    [
                        { label: "Dashboard", href: "/dashboard" },
                        { label: "Portfolio" },
                    ]}
            />

            <Container>
                <div className="space-y-6" >
                    {/* Stats Grid */}
                    < div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4" >
                        <Card>
                            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2" >
                                <CardTitle className="text-sm font-medium" > Total Invested </CardTitle>
                                < DollarSign className="h-4 w-4 text-muted-foreground" />
                            </CardHeader>
                            < CardContent >
                                <div className="text-2xl font-bold" >
                                    {formatCurrency(stats.totalInvested)}
                                </div>
                                < p className="text-xs text-muted-foreground" >
                                    Across {stats.activeCompanies} companies
                                </p>
                            </CardContent>
                        </Card>

                        < Card >
                            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2" >
                                <CardTitle className="text-sm font-medium" > Portfolio Value </CardTitle>
                                < TrendingUp className="h-4 w-4 text-muted-foreground" />
                            </CardHeader>
                            < CardContent >
                                <div className="text-2xl font-bold" >
                                    {formatCurrency(stats.portfolioValue)}
                                </div>
                                < p className="text-xs text-green-600" >
                                    +{formatCurrency(stats.portfolioValue - stats.totalInvested)} unrealized gain
                                </p>
                            </CardContent>
                        </Card>

                        < Card >
                            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2" >
                                <CardTitle className="text-sm font-medium" > Avg IRR </CardTitle>
                                < Target className="h-4 w-4 text-muted-foreground" />
                            </CardHeader>
                            < CardContent >
                                <div className="text-2xl font-bold" > {stats.avgIRR} % </div>
                                < p className="text-xs text-muted-foreground" >
                                    Internal rate of return
                                </p>
                            </CardContent>
                        </Card>

                        < Card >
                            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2" >
                                <CardTitle className="text-sm font-medium" > Avg Multiple </CardTitle>
                                < PieChart className="h-4 w-4 text-muted-foreground" />
                            </CardHeader>
                            < CardContent >
                                <div className="text-2xl font-bold" > {stats.avgMultiple}x </div>
                                < p className="text-xs text-muted-foreground" >
                                    {stats.exited} exits realized
                                </p>
                            </CardContent>
                        </Card>
                    </div>

                    {/* Portfolio Companies */}
                    <EmptyState
                        icon={PieChart}
                        title="Portfolio companies coming soon"
                        description="This feature is under development"
                    />
                </div>
            </Container>
        </div>
    );
}