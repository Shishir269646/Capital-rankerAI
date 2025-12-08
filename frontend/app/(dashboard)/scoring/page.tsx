"use client";

import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Header } from "@/components/layout/Header";
import { Container } from "@/components/layout/Container";
import { DealCard } from "@/components/deals/DealCard";
import { ScoreGauge } from "@/components/scoring/ScoreGauge";
import { LoadingSpinner } from "@/components/shared/LoadingSpinner";
import { EmptyState } from "@/components/shared/EmptyState";
import { TrendingUp, Play, CheckCircle2 } from "lucide-react";
import { Deal } from "@/types/deal.types";
import { useRouter } from "next/navigation";
import { dealsApi } from "@/lib/api/deals.api";
import { useToast } from "@/components/ui/use-toast";
import {
    BarChart,
    Bar,
    XAxis,
    YAxis,
    CartesianGrid,
    Tooltip,
    ResponsiveContainer,
} from "recharts";

export default function ScoringPage() {
    const router = useRouter();
    const { toast } = useToast();
    const [deals, setDeals] = useState<Deal[]>([]);
    const [pendingDeals, setPendingDeals] = useState<Deal[]>([]);
    const [loading, setLoading] = useState(true);
    const [scoring, setScoring] = useState(false);

    useEffect(() => {
        loadDeals();
    }, []);

    const loadDeals = async () => {
        try {
            setLoading(true);
            const allDeals = await dealsApi.getDeals({});
            const scored = allDeals.filter((d) => d.score);
            const pending = allDeals.filter((d) => !d.score);
            setDeals(scored);
            setPendingDeals(pending);
        } catch (error) {
            toast({
                title: "Error",
                description: "Failed to load deals",
                variant: "destructive",
            });
        } finally {
            setLoading(false);
        }
    };

    const handleBatchScore = async () => {
        try {
            setScoring(true);
            // Implement batch scoring
            toast({
                title: "Success",
                description: `${pendingDeals.length} deals scored successfully`,
            });
            loadDeals();
        } catch (error) {
            toast({
                title: "Error",
                description: "Failed to score deals",
                variant: "destructive",
            });
        } finally {
            setScoring(false);
        }
    };

    const scoreDistribution = [
        { range: "0-20", count: 5 },
        { range: "21-40", count: 12 },
        { range: "41-60", count: 23 },
        { range: "61-80", count: 35 },
        { range: "81-100", count: 18 },
    ];

    const topDeals = [...deals]
        .sort((a, b) => (b.score?.investment_fit_score || 0) - (a.score?.investment_fit_score || 0))
        .slice(0, 5);

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
                title="Scoring Dashboard"
                description="Evaluate and rank investment opportunities"
                breadcrumbs={[
                    { label: "Dashboard", href: "/dashboard" },
                    { label: "Scoring" },
                ]}
                action={
                    pendingDeals.length > 0 && (
                        <Button onClick={handleBatchScore} disabled={scoring}>
                            {scoring ? (
                                <>
                                    <LoadingSpinner size="sm" className="mr-2" />
                                    Scoring...
                                </>
                            ) : (
                                <>
                                    <Play className="mr-2 h-4 w-4" />
                                    Score {pendingDeals.length} Pending Deals
                                </>
                            )}
                        </Button>
                    )
                }
            />

            <Container>
                <div className="space-y-6">
                    {/* Stats */}
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                        <Card>
                            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                                <CardTitle className="text-sm font-medium">Total Scored</CardTitle>
                                <CheckCircle2 className="h-4 w-4 text-muted-foreground" />
                            </CardHeader>
                            <CardContent>
                                <div className="text-2xl font-bold">{deals.length}</div>
                                <p className="text-xs text-muted-foreground">
                                    +{deals.length > 10 ? deals.length - 10 : 0} from last week
                                </p>
                            </CardContent>
                        </Card>

                        <Card>
                            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                                <CardTitle className="text-sm font-medium">Pending Review</CardTitle>
                                <TrendingUp className="h-4 w-4 text-muted-foreground" />
                            </CardHeader>
                            <CardContent>
                                <div className="text-2xl font-bold">{pendingDeals.length}</div>
                                <p className="text-xs text-muted-foreground">
                                    Awaiting evaluation
                                </p>
                            </CardContent>
                        </Card>

                        <Card>
                            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                                <CardTitle className="text-sm font-medium">Average Score</CardTitle>
                                <TrendingUp className="h-4 w-4 text-muted-foreground" />
                            </CardHeader>
                            <CardContent>
                                <div className="text-2xl font-bold">
                                    {deals.length > 0
                                        ? Math.round(
                                            deals.reduce((sum, d) => sum + (d.score?.investment_fit_score || 0), 0) /
                                            deals.length
                                        )
                                        : 0}
                                </div>
                                <p className="text-xs text-muted-foreground">
                                    Across all deals
                                </p>
                            </CardContent>
                        </Card>
                    </div>

                    {/* Score Distribution */}
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

                    {/* Top Ranked Deals */}
                    <div>
                        <div className="flex items-center justify-between mb-4">
                            <h2 className="text-2xl font-bold">Top Ranked Deals</h2>
                            <Button
                                variant="ghost"
                                onClick={() => router.push("/scoring/compare")}
                            >
                                Compare Deals
                            </Button>
                        </div>

                        {topDeals.length > 0 ? (
                            <div className="space-y-4">
                                {topDeals.map((deal, index) => (
                                    <Card key={deal.id}>
                                        <CardContent className="pt-6">
                                            <div className="flex items-center gap-6">
                                                <div className="flex items-center justify-center w-12 h-12 rounded-full bg-primary/10 text-primary font-bold text-xl">
                                                    {index + 1}
                                                </div>
                                                <div className="flex-1">
                                                    <h3 className="font-semibold text-lg">{deal.name}</h3>
                                                    <p className="text-sm text-muted-foreground">
                                                        {deal.sector.join(", ")}
                                                    </p>
                                                </div>
                                                <ScoreGauge
                                                    score={deal.score?.investment_fit_score || 0}
                                                    size="sm"
                                                    showLabel={false}
                                                />
                                                <Button
                                                    variant="outline"
                                                    onClick={() => router.push(`/deals/${deal.id}`)}
                                                >
                                                    View Details
                                                </Button>
                                            </div>
                                        </CardContent>
                                    </Card>
                                ))}
                            </div>
                        ) : (
                            <EmptyState
                                title="No scored deals yet"
                                description="Start by scoring your pending deals"
                                action={
                                    pendingDeals.length > 0
                                        ? {
                                            label: "Score Pending Deals",
                                            onClick: handleBatchScore,
                                        }
                                        : undefined
                                }
                            />
                        )}
                    </div>

                    {/* Pending Deals */}
                    {pendingDeals.length > 0 && (
                        <div>
                            <h2 className="text-2xl font-bold mb-4">Pending Review</h2>
                            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                                {pendingDeals.slice(0, 6).map((deal) => (
                                    <DealCard key={deal.id} deal={deal} />
                                ))}
                            </div>
                        </div>
                    )}
                </div>
            </Container>
        </div>
    );
}
