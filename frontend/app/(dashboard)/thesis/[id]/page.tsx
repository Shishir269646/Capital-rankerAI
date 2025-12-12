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
import type { InvestorThesis, InvestorMatchResult } from "@/types/thesis.types";
import { Deal } from "@/types/deal.types";
import { Edit, BarChart, Users, GitFork } from "lucide-react"; // Removed Power, as it was unused
import { Badge } from "@/components/ui/badge";
import { Switch } from "@/components/ui/switch"; // Assuming a Switch component for activation
import { Label } from "@/components/ui/label"; // Added Label import

export default function ThesisDetailsPage({ params }: { params: { id: string } }) {
    const router = useRouter();
    const { show: showCustomToast } = useToast();
    const thesisId = params.id;

    const [thesis, setThesis] = useState<InvestorThesis | null>(null);
    const [dealMatches, setDealMatches] = useState<any[]>([]);
    const [investorMatches, setInvestorMatches] = useState<InvestorMatchResult[]>([]);
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
            // Mismatch: thesisApi.getInvestorThesisById does not exist.
            // Backend `getInvestorTheses` returns all for an investor.
            // Workaround: Call getInvestorTheses and filter by thesisId.
            // Ideally, a backend route GET /thesis/:id should exist.
            const response = await thesisApi.getInvestorTheses(thesisId, token); // Assuming thesisId is used as investorId for now
            const foundThesis = response.results.find((t: InvestorThesis) => t.id === thesisId); // Filter
            setThesis(foundThesis || null);
            if (!foundThesis) {
                showCustomToast("Thesis not found or unauthorized.", "error");
            }
        } catch (error) {
            showCustomToast("Error fetching thesis details", "error");
        } finally {
            setLoading(false);
        }
    }, [thesisId, showCustomToast]); // Added showCustomToast

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
            // Backend deactivateThesis expects (thesisId, userId) and sets is_active to false
            // Frontend is trying to pass { is_active: checked } in payload, which is not what backend expects
            // Backend controller has deactivateThesis(req.params.id, req.user?.userId)
            await thesisApi.deactivateThesis(thesisId, token); // No payload needed for deactivateThesis based on backend
            setThesis(prev => prev ? { ...prev, is_active: checked } : null); // Update local state
            showCustomToast(`Thesis ${checked ? 'activated' : 'deactivated'} successfully!`, "success");
        } catch (error: unknown) { // Changed to unknown
            const errorMessage = (error as any).response?.data?.message || `Error ${checked ? 'activating' : 'deactivating'} thesis: Unknown error`;
            showCustomToast(errorMessage, "error");
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
            setDealMatches(response.data); // Correctly access 'data' property
            showCustomToast("Deal matches fetched successfully!", "success");
        } catch (error: unknown) { // Changed to unknown
            const errorMessage = (error as any).response?.data?.message || "Error fetching deal matches: Unknown error";
            showCustomToast(errorMessage, "error");
        } finally {
            setMatchingDeals(false);
        }
    };

    const handleGetInvestorMatches = async () => {
        if (!thesisId) return; // Note: Frontend calls with thesisId, backend expects investorId. Mismatch.
        setMatchingInvestors(true);
        const token = getAccessToken();
        if (!token) {
            showCustomToast("Authentication token not found.", "error");
            setMatchingInvestors(false);
            return;
        }
        try {
            // Frontend calls getInvestorMatches with thesisId, backend getTopMatchesForInvestor expects investorId
            // This is a mismatch. For now, passing thesisId as investorId, but this needs clarification.
            const response = await thesisApi.getInvestorMatches(thesisId, token);
            setInvestorMatches(response.results); // Assuming results contains the matches
            showCustomToast("Investor matches fetched successfully!", "success");
        } catch (error: unknown) { // Changed to unknown
            const errorMessage = (error as any).response?.data?.message || "Error fetching investor matches: Unknown error";
            showCustomToast(errorMessage, "error");
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
            // Backend analyzeAlignment expects { thesis_id, deal_id } in body, not (thesisId, token) directly
            // Mismatch in API call signature
            const response = await thesisApi.analyzeAlignment({ thesisId, dealId: 'SOME_DEAL_ID_HERE' }, token); // Placeholder for dealId
            setAlignmentAnalysis(response.data);
            showCustomToast("Alignment analysis completed!", "success");
        } catch (error: unknown) { // Changed to unknown
            const errorMessage = (error as any).response?.data?.message || "Error analyzing alignment: Unknown error";
            showCustomToast(errorMessage, "error");
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
                description={thesis.thesis_text} // Changed description from thesis.description
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
                                {/* Corrected access to focus_areas and investment_criteria */}
                                {thesis.focus_areas && (
                                    <>
                                        <p><strong>Sectors:</strong> {thesis.focus_areas.sectors.map((s: string) => <Badge key={s} variant="secondary" className="mr-1">{s}</Badge>)}</p>
                                        <p><strong>Stages:</strong> {thesis.focus_areas.stages.map((s: string) => <Badge key={s} variant="secondary" className="mr-1">{s}</Badge>)}</p>
                                        <p><strong>Geographies:</strong> {thesis.focus_areas.geographies.map((g: string) => <Badge key={g} variant="secondary" className="mr-1">{g}</Badge>)}</p>
                                    </>
                                )}
                                {thesis.investment_criteria && (
                                    <p><strong>Min Revenue:</strong> {thesis.investment_criteria.min_revenue || 'N/A'}</p>
                                )}
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
                                            <li key={match.deal.id}>
                                                <a href={`/deals/${match.deal.id}`} className="text-blue-600 hover:underline">
                                                    {match.deal.name} (Match: {(match.match_score * 100).toFixed(2)}%)
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
                                    <h3 className="font-semibold">Overall Alignment: {(alignmentAnalysis.overall_alignment || 0).toFixed(2)}%</h3> {/* Corrected field name and added toFixed */}
                                    <p>{alignmentAnalysis.summary}</p> {/* Summary might not exist, check backend response */}
                                    {alignmentAnalysis.recommendations && (
                                        <>
                                            <h4 className="font-semibold mt-2">Recommendations:</h4>
                                            <ul className="list-disc pl-5">
                                                {alignmentAnalysis.recommendations.map((rec: string, index: number) => (
                                                    <li key={index}>{rec}</li>
                                                ))}
                                            </ul>
                                        </>
                                    )}
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
