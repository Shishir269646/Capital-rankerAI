"use client";

import { useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { AppDispatch, RootState } from "@/store";
import { fetchPortfolioAnalytics, selectPortfolioAnalytics, selectPortfolioLoading, selectPortfolioError } from "@/store/slices/portfolioSlice";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Header } from "@/components/layout/Header";
import { Container } from "@/components/layout/Container";
import { LoadingSpinner } from "@/components/shared/LoadingSpinner";
import { EmptyState } from "@/components/shared/EmptyState";
import { PieChart, TrendingUp, DollarSign, Target } from "lucide-react";
import { formatCurrency } from "@/lib/utils/currency";
import { useToast } from "@/components/ui/ToastProvider";

export default function PortfolioPage() {
    const dispatch = useDispatch<AppDispatch>();
    const { show: showCustomToast } = useToast();

    const stats = useSelector(selectPortfolioAnalytics);
    const loading = useSelector(selectPortfolioLoading);
    const error = useSelector(selectPortfolioError);

    useEffect(() => {
        dispatch(fetchPortfolioAnalytics());
    }, [dispatch]);

    useEffect(() => {
        if (error) {
            showCustomToast(`Error: ${error}`, "error");
        }
    }, [error, showCustomToast]);

    if (loading && !stats) {
        return (
            <div className="flex items-center justify-center h-full">
                <LoadingSpinner size="lg" />
            </div>
        );
    }

    const totalInvested = stats?.totalInvested || 0;
    const portfolioValue = stats?.currentValue || 0;
    const avgIRR = stats?.averageIRR || 0;
    const avgMultiple = stats?.averageMultiple || 0;
    const activeCompanies = stats?.activeInvestments || 0;
    const exited = stats?.exitedInvestments || 0;

    return (
        <div>
            <Header
                title="Portfolio"
                description="Track your investment portfolio performance"
                breadcrumbs={[
                    { label: "Dashboard", href: "/dashboard" },
                    { label: "Portfolio" },
                ]}
            />

            <Container>
                <div className="space-y-6">
                    {/* Stats Grid */}
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
                        <Card>
                            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                                <CardTitle className="text-sm font-medium"> Total Invested </CardTitle>
                                <DollarSign className="h-4 w-4 text-muted-foreground" />
                            </CardHeader>
                            <CardContent>
                                <div className="text-2xl font-bold">
                                    {formatCurrency(totalInvested)}
                                </div>
                                <p className="text-xs text-muted-foreground">
                                    Across {activeCompanies} companies
                                </p>
                            </CardContent>
                        </Card>

                        <Card>
                            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                                <CardTitle className="text-sm font-medium"> Portfolio Value </CardTitle>
                                <TrendingUp className="h-4 w-4 text-muted-foreground" />
                            </CardHeader>
                            <CardContent>
                                <div className="text-2xl font-bold">
                                    {formatCurrency(portfolioValue)}
                                </div>
                                <p className="text-xs text-green-600">
                                    +{formatCurrency(portfolioValue - totalInvested)} unrealized gain
                                </p>
                            </CardContent>
                        </Card>

                        <Card>
                            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                                <CardTitle className="text-sm font-medium"> Avg IRR </CardTitle>
                                <Target className="h-4 w-4 text-muted-foreground" />
                            </CardHeader>
                            <CardContent>
                                <div className="text-2xl font-bold">{avgIRR}%</div>
                                <p className="text-xs text-muted-foreground">
                                    Internal rate of return
                                </p>
                            </CardContent>
                        </Card>

                        <Card>
                            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                                <CardTitle className="text-sm font-medium"> Avg Multiple </CardTitle>
                                <PieChart className="h-4 w-4 text-muted-foreground" />
                            </CardHeader>
                            <CardContent>
                                <div className="text-2xl font-bold">{avgMultiple}x</div>
                                <p className="text-xs text-muted-foreground">
                                    {exited} exits realized
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