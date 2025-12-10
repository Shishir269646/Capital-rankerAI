"use client";

import { useEffect, useState, useCallback } from "react";
import { Header } from "@/components/layout/Header";
import { Container } from "@/components/layout/Container";
import { Button } from "@/components/ui/button";
import { useToast } from "@/components/ui/ToastProvider";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { LoadingSpinner } from "@/components/shared/LoadingSpinner";
import { dealsApi } from "@/lib/api/deals.api";
import { scoringApi } from "@/lib/api/scoring.api";
import { getAccessToken } from "@/lib/auth/token";
import type { Deal } from "@/types/deal.types";
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer } from 'recharts';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";

export default function CompareDealScoresPage() {
    const { show: showCustomToast } = useToast();
    const [allDeals, setAllDeals] = useState<Deal[]>([]);
    const [selectedDealIds, setSelectedDealIds] = useState<string[]>([]);
    const [comparedDeals, setComparedDeals] = useState<Deal[]>([]);
    const [loading, setLoading] = useState(true);
    const [comparing, setComparing] = useState(false);

    const fetchAllDeals = useCallback(async () => {
        setLoading(true);
        const token = getAccessToken();
        if (!token) {
            showCustomToast("Authentication token not found.", "error");
            setLoading(false);
            return;
        }
        try {
            const response = await dealsApi.getAllDeals(token);
            setAllDeals(response.results.filter(deal => deal.score?.investment_fit_score !== undefined)); // Only show scored deals
        } catch (error) {
            showCustomToast("Error fetching deals", "error");
        } finally {
            setLoading(false);
        }
    }, [showCustomToast]);

    useEffect(() => {
        fetchAllDeals();
    }, [fetchAllDeals]);

    const handleDealSelection = (dealId: string) => {
        setSelectedDealIds(prev => {
            if (prev.includes(dealId)) {
                return prev.filter(id => id !== dealId);
            } else if (prev.length < 5) { // Limit to 5 deals for comparison
                return [...prev, dealId];
            }
            showCustomToast("You can compare a maximum of 5 deals.", "info");
            return prev;
        });
    };

    const handleCompareDeals = async () => {
        if (selectedDealIds.length < 2) {
            showCustomToast("Please select at least 2 deals to compare.", "error");
            return;
        }
        setComparing(true);
        const token = getAccessToken();
        if (!token) {
            showCustomToast("Authentication token not found.", "error");
            setComparing(false);
            return;
        }
        try {
            // Assuming compareDealScores can take an array of deal IDs
            const response = await scoringApi.compareDealScores(selectedDealIds, token);
            // This API might return a more structured comparison, for now, let's just get the deals
            setComparedDeals(allDeals.filter(deal => selectedDealIds.includes(deal.id)));
            showCustomToast("Deals ready for comparison!", "success");
        } catch (error: any) {
            showCustomToast(`Error comparing deals: ${error.message || 'Unknown error'}`, "error");
        } finally {
            setComparing(false);
        }
    };

    const chartData = comparedDeals.map(deal => ({
        name: deal.name,
        score: deal.score?.investment_fit_score || 0,
        // Add other metrics for comparison here
    }));

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
                title="Compare Deal Scores"
                description="Select and compare the investment scores of multiple deals"
                breadcrumbs={[
                    { label: "Dashboard", href: "/dashboard" },
                    { label: "Scoring", href: "/scoring" },
                    { label: "Compare" },
                ]}
                action={
                    <Button onClick={handleCompareDeals} disabled={comparing || selectedDealIds.length < 2}>
                        {comparing ? "Comparing..." : "Compare Selected Deals"}
                    </Button>
                }
            />

            <Container>
                <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                    <div className="lg:col-span-1 space-y-4">
                        <Card>
                            <CardHeader>
                                <CardTitle>Select Deals ({selectedDealIds.length}/5)</CardTitle>
                            </CardHeader>
                            <CardContent>
                                <div className="space-y-2 max-h-96 overflow-y-auto">
                                    {allDeals.length === 0 ? (
                                        <p className="text-muted-foreground">No deals available for comparison.</p>
                                    ) : (
                                        allDeals.map(deal => (
                                            <div key={deal.id} className="flex items-center space-x-2">
                                                <input
                                                    type="checkbox"
                                                    id={`deal-${deal.id}`}
                                                    checked={selectedDealIds.includes(deal.id)}
                                                    onChange={() => handleDealSelection(deal.id)}
                                                    className="form-checkbox h-4 w-4 text-primary"
                                                />
                                                <label htmlFor={`deal-${deal.id}`} className="text-sm font-medium leading-none cursor-pointer">
                                                    {deal.name} (Score: {deal.score?.investment_fit_score || 'N/A'})
                                                </label>
                                            </div>
                                        ))
                                    )}
                                </div>
                            </CardContent>
                        </Card>
                    </div>

                    <div className="lg:col-span-2 space-y-4">
                        {comparedDeals.length > 0 ? (
                            <Card>
                                <CardHeader>
                                    <CardTitle>Score Comparison</CardTitle>
                                </CardHeader>
                                <CardContent className="h-96">
                                    <ResponsiveContainer width="100%" height="100%">
                                        <BarChart
                                            data={chartData}
                                            margin={{ top: 20, right: 30, left: 20, bottom: 5 }}
                                        >
                                            <CartesianGrid strokeDasharray="3 3" />
                                            <XAxis dataKey="name" />
                                            <YAxis />
                                            <Tooltip />
                                            <Legend />
                                            <Bar dataKey="score" fill="#8884d8" />
                                        </BarChart>
                                    </ResponsiveContainer>
                                </CardContent>
                            </Card>
                        ) : (
                            <Card className="h-full flex items-center justify-center">
                                <CardContent className="text-center p-6">
                                    <h3 className="text-lg font-semibold">Select deals to compare</h3>
                                    <p className="text-muted-foreground">Choose at least two deals from the left panel.</p>
                                </CardContent>
                            </Card>
                        )}
                    </div>
                </div>
            </Container>
        </div>
    );
}
