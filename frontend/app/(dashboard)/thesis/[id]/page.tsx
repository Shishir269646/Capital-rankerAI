"use client";

import { useRouter } from "next/navigation";
import { useEffect, useState, useCallback } from "react";
import { Header } from "@/components/layout/Header";
import { Container } from "@/components/layout/Container";
import { Button } from "@/components/ui/button";
import { useToast } from "@/components/ui/ToastProvider";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { LoadingSpinner } from "@/components/shared/LoadingSpinner";
import { thesisApi } from "@/lib/api/thesis.api";
import { getAccessToken } from "@/lib/auth/token";
import type { InvestorThesis, DealMatch, InvestorMatch } from "@/types/thesis.types"; // Assuming these types exist
import { Edit, BarChart, Users, GitFork, Power } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { Switch } from "@/components/ui/switch"; // Assuming a Switch component for activation

export default function ThesisDetailsPage({ params }: { params: { id: string } }) {
    const router = useRouter();
    const { show: showCustomToast } = useToast();
    const thesisId = params.id;

    const [thesis, setThesis] = useState<InvestorThesis | null>(null);
    const [dealMatches, setDealMatches] = useState<DealMatch[]>([]);
    const [investorMatches, setInvestorMatches] = useState<InvestorMatch[]>([]);
    const [alignmentAnalysis, setAlignmentAnalysis] = useState<any | null>(null); // Type needs definition
    const [loading, setLoading] = useState(true);
    const [matchingDeals, setMatchingDeals] = useState(false);
    const [matchingInvestors, setMatchingInvestors] = useState(false);
    const [analyzingAlignment, setAnalyzingAlignment] = useState(false);
    const [isDeactivating, setIsDeactivating] = useState(false);


    const fetchThesisDetails = useCallback(async () => {
        setLoading(true);
        const token = getAccessToken();
        if (!token) {
            showCustomToast("Authentication token not found.", "error");
            setLoading(false);
            return;
        }
        try {
            const response = await thesisApi.getInvestorThesisById(thesisId, token); // Assuming this API exists
            setThesis(response.data);
        } catch (error) {
            showCustomToast("Error fetching thesis details", "error");
        } finally {
            setLoading(false);
        }
    }, [thesisId, showCustomToast]);

    useEffect(() => {
        if (thesisId) {
            fetchThesisDetails();
        }
    }, [thesisId, fetchThesisDetails]);

    const handleDeactivateToggle = async (checked: boolean) => {
        if (!thesis) return;
        setIsDeactivating(true);
        const token = getAccessToken();
        if (!token) {
            showCustomToast("Authentication token not found.", "error");
            setIsDeactivating(false);
            return;
        }
        try {
            await thesisApi.deactivateThesis(thesisId, { is_active: checked }, token); // Assuming payload for is_active
            setThesis(prev => prev ? { ...prev, is_active: checked } : null);
            showCustomToast(`Thesis ${checked ? 'activated' : 'deactivated'} successfully!`, "success");
        } catch (error: any) {
            showCustomToast(`Error ${checked ? 'activating' : 'deactivating'} thesis: ${error.message || 'Unknown error'}`, "error");
        } finally {
            setIsDeactivating(false);
        }
    };

    const handleGetThesisMatches = async () => {
        if (!thesisId) return;
        setMatchingDeals(true);
        const token = getAccessToken();
        if (!token) {
            showCustomToast("Authentication token not found.", "error");
            setMatchingDeals(false);
            return;
        }
        try {
            const response = await thesisApi.getThesisMatches(thesisId, token);
            setDealMatches(response.results);
            showCustomToast("Deal matches fetched successfully!", "success");
        } catch (error: any) {
            showCustomToast(`Error fetching deal matches: ${error.message || 'Unknown error'}`, "error");
        } finally {
            setMatchingDeals(false);
        }
    };

    const handleGetInvestorMatches = async () => {
        if (!thesisId) return;
        setMatchingInvestors(true);
        const token = getAccessToken();
        if (!token) {
            showCustomToast("Authentication token not found.", "error");
            setMatchingInvestors(false);
            return;
        }
        try {
            const response = await thesisApi.getInvestorMatches(thesisId, token);
            setInvestorMatches(response.results);
            showCustomToast("Investor matches fetched successfully!", "success");
        } catch (error: any) {
            showCustomToast(`Error fetching investor matches: ${error.message || 'Unknown error'}`, "error");
        } finally {
            setMatchingInvestors(false);
        }
    };

    const handleAnalyzeAlignment = async () => {
        if (!thesisId) return;
        setAnalyzingAlignment(true);
        const token = getAccessToken();
        if (!token) {
            showCustomToast("Authentication token not found.", "error");
            setAnalyzingAlignment(false);
            return;
        }
        try {
            const response = await thesisApi.analyzeAlignment(thesisId, token);
            setAlignmentAnalysis(response.data);
            showCustomToast("Alignment analysis completed!", "success");
        } catch (error: any) {
            showCustomToast(`Error analyzing alignment: ${error.message || 'Unknown error'}`, "error");
        } finally {
            setAnalyzingAlignment(false);
        }
    };


    if (loading) {
        return (
            <div className="flex items-center justify-center h-full">
                <LoadingSpinner size="lg" />
            </div>
        );
    }

    if (!thesis) {
        return (
            <Container>
                <div className="text-center py-10">
                    <h2 className="text-2xl font-bold">Thesis Not Found</h2>
                    <p className="text-muted-foreground">The investment thesis you are looking for does not exist.</p>
                    <Button onClick={() => router.push("/thesis")} className="mt-4">
                        Back to Investment Thesis
                    </Button>
                </div>
            </Container>
        );
    }

    return (
        <div>
            <Header
                title={thesis.title}
                description={thesis.description}
                breadcrumbs={[
                    { label: "Dashboard", href: "/dashboard" },
                    { label: "Investment Thesis", href: "/thesis" },
                    { label: thesis.title },
                ]}
                action={
                    <div className="flex gap-2 items-center">
                        <Button onClick={() => router.push(`/thesis/${thesisId}/edit`)} variant="outline">
                            <Edit className="mr-2 h-4 w-4" />
                            Edit Thesis
                        </Button>
                        <div className="flex items-center space-x-2">
                            <Switch
                                id="thesis-active"
                                checked={thesis.is_active}
                                onCheckedChange={handleDeactivateToggle}
                                disabled={isDeactivating}
                            />
                            <Label htmlFor="thesis-active">{thesis.is_active ? "Active" : "Inactive"}</Label>
                        </div>
                    </div>
                }
            />

            <Container>
                <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                    <div className="lg:col-span-2 space-y-6">
                        <Card>
                            <CardHeader>
                                <CardTitle>Thesis Details</CardTitle>
                            </CardHeader>
                            <CardContent className="space-y-2">
                                <p><strong>Stage:</strong> <Badge variant="outline">{thesis.investment_stage}</Badge></p>
                                <p><strong>Industry Focus:</strong> {thesis.industry_focus.map(f => <Badge key={f} variant="secondary" className="mr-1">{f}</Badge>)}</p>
                                <p><strong>Status:</strong> <Badge variant={thesis.is_active ? "default" : "destructive"}>{thesis.is_active ? "Active" : "Inactive"}</Badge></p>
                            </CardContent>
                        </Card>

                        <Card>
                            <CardHeader>
                                <CardTitle>Thesis Actions</CardTitle>
                            </CardHeader>
                            <CardContent className="flex flex-col gap-3">
                                <Button onClick={handleGetThesisMatches} disabled={matchingDeals}>
                                    {matchingDeals ? (
                                        <LoadingSpinner size="sm" className="mr-2" />
                                    ) : (
                                        <GitFork className="mr-2 h-4 w-4" />
                                    )}
                                    Get Deal Matches
                                </Button>
                                <Button onClick={handleGetInvestorMatches} disabled={matchingInvestors}>
                                    {matchingInvestors ? (
                                        <LoadingSpinner size="sm" className="mr-2" />
                                    ) : (
                                        <Users className="mr-2 h-4 w-4" />
                                    )}
                                    Get Investor Matches
                                </Button>
                                <Button onClick={handleAnalyzeAlignment} disabled={analyzingAlignment}>
                                    {analyzingAlignment ? (
                                        <LoadingSpinner size="sm" className="mr-2" />
                                    ) : (
                                        <BarChart className="mr-2 h-4 w-4" />
                                    )}
                                    Analyze Alignment
                                </Button>
                            </CardContent>
                        </Card>

                        {dealMatches.length > 0 && (
                            <Card>
                                <CardHeader>
                                    <CardTitle>Matched Deals</CardTitle>
                                </CardHeader>
                                <CardContent>
                                    <ul className="list-disc pl-5 space-y-1">
                                        {dealMatches.map((match) => (
                                            <li key={match.deal_id}>
                                                <a href={`/deals/${match.deal_id}`} className="text-blue-600 hover:underline">
                                                    {match.deal_name} (Score: {match.score})
                                                </a>
                                            </li>
                                        ))}
                                    </ul>
                                </CardContent>
                            </Card>
                        )}

                        {investorMatches.length > 0 && (
                            <Card>
                                <CardHeader>
                                    <CardTitle>Matched Investors</CardTitle>
                                </CardHeader>
                                <CardContent>
                                    <ul className="list-disc pl-5 space-y-1">
                                        {investorMatches.map((match) => (
                                            <li key={match.investor_id}>
                                                <a href={`/investors/${match.investor_id}`} className="text-blue-600 hover:underline">
                                                    {match.investor_name} (Match: {match.match_score}%)
                                                </a>
                                            </li>
                                        ))}
                                    </ul>
                                </CardContent>
                            </Card>
                        )}

                        {alignmentAnalysis && (
                            <Card>
                                <CardHeader>
                                    <CardTitle>Alignment Analysis</CardTitle>
                                </CardHeader>
                                <CardContent>
                                    <h3 className="font-semibold">Overall Alignment: {alignmentAnalysis.overall_score}%</h3>
                                    <p>{alignmentAnalysis.summary}</p>
                                    {/* Render more detailed analysis here */}
                                </CardContent>
                            </Card>
                        )}
                    </div>
                    <div className="space-y-6">
                        {/* Right column for other related info */}
                        <Card>
                            <CardHeader>
                                <CardTitle>Thesis Insights</CardTitle>
                            </CardHeader>
                            <CardContent>
                                <p className="text-muted-foreground">Coming soon...</p>
                            </CardContent>
                        </Card>
                    </div>
                </div>
            </Container>
        </div>
    );
}
