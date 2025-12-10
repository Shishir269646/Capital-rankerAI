"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { Header } from "@/components/layout/Header";
import { Container } from "@/components/layout/Container";
import { Button } from "@/components/ui/button";
import { useToast } from "@/components/ui/ToastProvider";
import { LoadingSpinner } from "@/components/shared/LoadingSpinner";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { getAccessToken } from "@/lib/auth/token";
import { PieChart, Pie, Cell, ResponsiveContainer, Legend, Tooltip } from 'recharts';
import { EmptyState } from "@/components/shared/EmptyState";
import { TrendingUp } from "lucide-react";
import { DealCard } from "@/components/deals/DealCard";
import { dealsApi } from "@/lib/api/deals.api";
import { scoringApi } from "@/lib/api/scoring.api";
import { Deal } from "@/types/deal.types";

export default function ScoringPage() {
    const router = useRouter();
    const { show: showCustomToast } = useToast();
    const [deals, setDeals] = useState<Deal[]>([]);
    const [pendingDeals, setPendingDeals] = useState<Deal[]>([]);
    const [loading, setLoading] = useState(true);
    const [scoring, setScoring] = useState(false);
    const [recalculating, setRecalculating] = useState(false);

    useEffect(() => {
        loadDeals();
    }, []);

    const loadDeals = async () => {
        try {
            setLoading(true);
            const token = getAccessToken();
            if (!token) {
                showCustomToast("Authentication token not found.", "error");
                setLoading(false);
                return;
            }

            const response = await dealsApi.getAllDeals(token);
            const allDeals: Deal[] = response.results;

            const scored = allDeals.filter((d) => d.score?.investment_fit_score !== undefined && d.score.investment_fit_score !== null);
            const pending = allDeals.filter((d) => d.score?.investment_fit_score === undefined || d.score.investment_fit_score === null);

            setDeals(scored);
            setPendingDeals(pending);
        } catch (error: any) {
            showCustomToast(`Error loading deals: ${error.message || 'Unknown error'}`, "error");
        } finally {
            setLoading(false);
        }
    };

    const handleBatchScore = async () => {
        try {
            setScoring(true);
            const token = getAccessToken();
            if (!token) {
                showCustomToast("Authentication token not found.", "error");
                setScoring(false);
                return;
            }

            if (pendingDeals.length === 0) {
                showCustomToast("No pending deals to score.", "info");
                setScoring(false);
                return;
            }

            const dealIdsToScore = pendingDeals.map(deal => deal.id);
            await scoringApi.batchScore(dealIdsToScore, token);

            showCustomToast(`${dealIdsToScore.length} deals sent for batch scoring!`, "success");
            loadDeals(); // Refresh data after scoring
        } catch (error: any) {
            showCustomToast(`Error initiating batch scoring: ${error.message || 'Unknown error'}`, "error");
        } finally {
            setScoring(false);
        }
    };

    const handleRecalculateAllScores = async () => {
        try {
            setRecalculating(true);
            const token = getAccessToken();
            if (!token) {
                showCustomToast("Authentication token not found.", "error");
                setRecalculating(false);
                return;
            }

            await scoringApi.recalculateAllScores(token);

            showCustomToast("Recalculation of all scores initiated!", "success");
            loadDeals(); // Refresh data after recalculation (though it might take time for backend to process)
        } catch (error: any) {
            showCustomToast(`Error initiating score recalculation: ${error.message || 'Unknown error'}`, "error");
        } finally {
            setRecalculating(false);
        }
    };

    const scoreDistribution = [
        { name: "0-20", value: 5, color: "#ef4444" },
        { name: "21-40", value: 12, color: "#f97316" },
        { name: "41-60", value: 23, color: "#eab308" },
        { name: "61-80", value: 35, color: "#22c55e" },
        { name: "81-100", value: 18, color: "#3b82f6" },
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
                    <div className="flex gap-2">
                        {pendingDeals.length > 0 && (
                            <Button onClick={handleBatchScore} disabled={scoring}>
                                {scoring ? (
                                    <>
                                        <LoadingSpinner size="sm" className="mr-2" />
                                        Scoring...
                                    </>
                                ) : (
                                    <>
                                        <TrendingUp className="mr-2 h-4 w-4" />
                                        Score {pendingDeals.length} Pending Deals
                                    </>
                                )}
                            </Button>
                        )}
                        <Button onClick={handleRecalculateAllScores} disabled={recalculating}>
                            {recalculating ? (
                                <>
                                    <LoadingSpinner size="sm" className="mr-2" />
                                    Recalculating...
                                </>
                            ) : (
                                <>
                                    <TrendingUp className="mr-2 h-4 w-4" />
                                    Recalculate All Scores
                                </>
                            )}
                        </Button>
                    </div>
                }
            />

            <Container>
                <div className="space-y-6">
                    {/* Placeholder for real data */}
                    <Card>
                        <CardHeader>
                            <CardTitle>Score Distribution</CardTitle>
                        </CardHeader>
                        <CardContent className="h-72">
                            <ResponsiveContainer width="100%" height="100%">
                                <PieChart>
                                    <Pie
                                        data={scoreDistribution}
                                        cx="50%"
                                        cy="50%"
                                        innerRadius={60}
                                        outerRadius={80}
                                        fill="#8884d8"
                                        dataKey="value"
                                        labelLine={false}
                                    >
                                        {scoreDistribution.map((entry, index) => (
                                            <Cell key={`cell-${index}`} fill={entry.color} />
                                        ))}
                                    </Pie>
                                    <Tooltip />
                                    <Legend />
                                </PieChart>
                            </ResponsiveContainer>
                        </CardContent>
                    </Card>

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
                            {topDeals.map((deal) => (
                                <DealCard key={deal.id} deal={deal} />
                            ))}
                        </div>
                    ) : (
                        <EmptyState title="No Scored Deals" description="Score deals to see top performers." />
                    )}

                    {pendingDeals.length > 0 && (
                        <div>
                            <h2 className="text-2xl font-bold mb-4">Pending Deals</h2>
                            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                                {pendingDeals.map((deal) => (
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