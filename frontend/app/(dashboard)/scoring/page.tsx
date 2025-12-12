"use client";

import { useState, useEffect, useMemo } from "react";
import { useRouter } from "next/navigation";
import { useDispatch, useSelector } from "react-redux";
import { AppDispatch, RootState } from "@/store";
import { fetchDeals, selectDeals, selectDealsLoading, selectDealsError } from "@/store/slices/dealsSlice";
import { batchScore, recalculateAllScores, selectScoringLoading } from "@/store/slices/scoringSlice";
import { Header } from "@/components/layout/Header";
import { Container } from "@/components/layout/Container";
import { Button } from "@/components/ui/button";
import { useToast } from "@/components/ui/ToastProvider";
import { LoadingSpinner } from "@/components/shared/LoadingSpinner";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { PieChart, Pie, Cell, ResponsiveContainer, Legend, Tooltip } from 'recharts';
import { EmptyState } from "@/components/shared/EmptyState";
import { TrendingUp } from "lucide-react";
import { DealCard } from "@/components/deals/DealCard";
import { Deal } from "@/types/deal.types";

export default function ScoringPage() {
    const router = useRouter();
    const dispatch = useDispatch<AppDispatch>();
    const { show: showCustomToast } = useToast();

    const allDeals = useSelector(selectDeals);
    const dealsLoading = useSelector(selectDealsLoading);
    const scoringLoading = useSelector(selectScoringLoading);
    const error = useSelector(selectDealsError);
    
    const loading = dealsLoading;

    useEffect(() => {
        dispatch(fetchDeals(undefined));
    }, [dispatch]);

    useEffect(() => {
        if (error) {
            showCustomToast(`Error: ${error}`, "error");
        }
    }, [error, showCustomToast]);

    const { scoredDeals, pendingDeals } = useMemo(() => {
        const scored = allDeals.filter((d: Deal) => d.score?.investment_fit_score !== undefined && d.score.investment_fit_score !== null);
        const pending = allDeals.filter((d: Deal) => d.score?.investment_fit_score === undefined || d.score.investment_fit_score === null);
        return { scoredDeals: scored, pendingDeals: pending };
    }, [allDeals]);

    const handleBatchScore = async () => {
        if (pendingDeals.length === 0) {
            showCustomToast("No pending deals to score.", "info");
            return;
        }
        const dealIdsToScore = pendingDeals.map((deal: Deal) => deal.id);
        const resultAction = await dispatch(batchScore(dealIdsToScore));
        if (batchScore.fulfilled.match(resultAction)) {
            showCustomToast(`${dealIdsToScore.length} deals sent for batch scoring!`, "success");
            dispatch(fetchDeals(undefined)); // Refresh deals
        } else {
            showCustomToast(`Error initiating batch scoring: ${resultAction.payload || 'Unknown error'}`, "error");
        }
    };

    const handleRecalculateAllScores = async () => {
        const resultAction = await dispatch(recalculateAllScores());
        if (recalculateAllScores.fulfilled.match(resultAction)) {
            showCustomToast("Recalculation of all scores initiated!", "success");
            dispatch(fetchDeals(undefined)); // Refresh deals
        } else {
            showCustomToast(`Error initiating score recalculation: ${resultAction.payload || 'Unknown error'}`, "error");
        }
    };

    const scoreDistribution = useMemo(() => {
        const distribution = [
            { name: "0-20", value: 0, color: "#ef4444" },
            { name: "21-40", value: 0, color: "#f97316" },
            { name: "41-60", value: 0, color: "#eab308" },
            { name: "61-80", value: 0, color: "#22c55e" },
            { name: "81-100", value: 0, color: "#3b82f6" },
        ];
        scoredDeals.forEach((deal: Deal) => {
            const score = deal.score?.investment_fit_score || 0;
            if (score <= 20) distribution[0].value++;
            else if (score <= 40) distribution[1].value++;
            else if (score <= 60) distribution[2].value++;
            else if (score <= 80) distribution[3].value++;
            else distribution[4].value++;
        });
        return distribution;
    }, [scoredDeals]);

    const topDeals = useMemo(() => 
        [...scoredDeals]
        .sort((a: Deal, b: Deal) => (b.score?.investment_fit_score || 0) - (a.score?.investment_fit_score || 0))
        .slice(0, 5),
    [scoredDeals]);

    if (loading && allDeals.length === 0) {
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
                            <Button onClick={handleBatchScore} disabled={scoringLoading}>
                                {scoringLoading ? (
                                    <><LoadingSpinner size="sm" className="mr-2" />Scoring...</>
                                ) : (
                                    <><TrendingUp className="mr-2 h-4 w-4" />Score {pendingDeals.length} Pending Deals</>
                                )}
                            </Button>
                        )}
                        <Button onClick={handleRecalculateAllScores} disabled={scoringLoading}>
                            {scoringLoading ? (
                                <><LoadingSpinner size="sm" className="mr-2" />Recalculating...</>
                            ) : (
                                <><TrendingUp className="mr-2 h-4 w-4" />Recalculate All Scores</>
                            )}
                        </Button>
                    </div>
                }
            />

            <Container>
                <div className="space-y-6">
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