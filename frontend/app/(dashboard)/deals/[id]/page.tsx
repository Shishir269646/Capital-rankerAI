"use client";

import { useRouter } from "next/navigation";
import { useEffect, useState, useCallback } from "react";
import { useSelector } from 'react-redux';
import { selectUser } from '@/store/slices/authSlice';
import { Header } from "@/components/layout/Header";
import { Container } from "@/components/layout/Container";
import { Button } from "@/components/ui/button";
import { useToast } from "@/components/ui/ToastProvider";
import { DealDetail } from "@/components/deals/DealDetail";
import { DealMetrics } from "@/components/deals/DealMetrics";
import { DealScoreCard } from "@/components/deals/DealScoreCard";
import { LoadingSpinner } from "@/components/shared/LoadingSpinner";
import { dealsApi } from "@/lib/api/deals.api";
import { scoringApi } from "@/lib/api/scoring.api";
import { reportsApi } from "@/lib/api/reports.api"; // Import reportsApi
import { getAccessToken } from "@/lib/auth/token";
import type { Deal, DealNote } from "@/types/deal.types";
import type { ScoringHistoryItem } from "@/types/scoring.types";
import axios, { AxiosError } from "axios";
import { Edit, TrendingUp, Trash2, Download } from "lucide-react";
import {
    AlertDialog,
    AlertDialogAction,
    AlertDialogCancel,
    AlertDialogContent,
    AlertDialogDescription,
    AlertDialogFooter,
    AlertDialogHeader,
    AlertDialogTitle,
    AlertDialogTrigger,
} from "@/components/ui/alert-dialog";
// ADDED IMPORTS
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";


export default function DealDetailsPage({ params }: { params: { id: string } }) {
    const router = useRouter();
    const { show: showCustomToast } = useToast();
    const dealId = params.id;
    const user = useSelector(selectUser);
    const [deal, setDeal] = useState<Deal | null>(null);
    const [loading, setLoading] = useState(true);
    const [scoring, setScoring] = useState(false);
    const [isDeleteDialogOpen, setIsDeleteDialogOpen] = useState(false);
    const [similarDeals, setSimilarDeals] = useState<Deal[]>([]);
    const [newNoteContent, setNewNoteContent] = useState("");
    const [dealNotes, setDealNotes] = useState<DealNote[]>([]); // Assuming a type for notes
    const [scoringHistory, setScoringHistory] = useState<ScoringHistoryItem[]>([]); // Assuming a type for scoring history

    const fetchDeal = useCallback(async () => {
        setLoading(true);
        const token = getAccessToken();
        if (!token) {
            showCustomToast("Authentication token not found.", "error");
            setLoading(false);
            return;
        }
        try {
            const response = await dealsApi.getDealById(dealId, token);
            setDeal(response.data);
            // Assuming deal.notes is part of the Deal response
            // setDealNotes(response.data.notes || []);
        } catch (error) {
            showCustomToast("Error fetching deal details", "error");
        } finally {
            setLoading(false);
        }
    }, [dealId, showCustomToast]); // Added showCustomToast

    const fetchSimilarDeals = useCallback(async () => {
        const token = getAccessToken();
        if (!token) {
            showCustomToast("Authentication token not found.", "error");
            return;
        }
        try {
            const response = await dealsApi.getSimilarDeals(dealId, token);
            setSimilarDeals(response.results);
        } catch (error) {
            showCustomToast("Error fetching similar deals", "error");
        }
    }, [dealId, showCustomToast]); // Added showCustomToast

    const handleAddNote = async () => {
        if (!newNoteContent.trim()) {
            showCustomToast("Note content cannot be empty.", "error");
            return;
        }
        const token = getAccessToken();
        if (!token) {
            showCustomToast("Authentication token not found.", "error");
            return;
        }
        try {
            // Assuming addDealNote returns the newly added note or an updated list of notes
            const response = await dealsApi.addDealNote(dealId, newNoteContent, token);
            showCustomToast("Note added successfully!", "success");
            setNewNoteContent("");
            // Re-fetch deal notes or update state directly if API returns updated list
            // For now, I'll simulate adding it to the local state
            if (user) {
                setDealNotes(prevNotes => [...prevNotes, { content: newNoteContent, created_at: new Date(), user_id: user.id }]);
            }
        } catch (error: any) {
            let errorMessage = "An unexpected error occurred.";
            if (axios.isAxiosError(error)) {
                errorMessage = error.response?.data?.message || "Error adding note.";
            } else if (error instanceof Error) {
                errorMessage = error.message;
            }
            showCustomToast(errorMessage, "error");
        }
    };

    const fetchScoringHistory = useCallback(async () => {
        const token = getAccessToken();
        if (!token) {
            showCustomToast("Authentication token not found.", "error");
            return;
        }
        try {
            const response = await scoringApi.getDealScoringHistory(dealId, token);
            setScoringHistory(response.data.history.map((score) => ({
                id: score.id,
                score: score.investment_fit_score,
                evaluatedAt: new Date(score.scored_at),
            })));
        } catch (error) {
            showCustomToast("Error fetching scoring history", "error");
        }
    }, [dealId, showCustomToast]); // Added showCustomToast

    const handleDownloadDealReport = async () => {
        if (!dealId) return;
        const token = getAccessToken();
        if (!token) {
            showCustomToast("Authentication token not found.", "error");
            return;
        }
        try {
            const blob = await reportsApi.getDealReport(dealId, token);
            const url = window.URL.createObjectURL(blob);
            const a = document.createElement('a');
            a.href = url;
            a.download = `deal_report_${dealId}.pdf`;
            document.body.appendChild(a);
            a.click();
            a.remove();
            showCustomToast("Deal report downloaded successfully", "success");
        } catch (error: any) {
            let errorMessage = "An unexpected error occurred.";
            if (axios.isAxiosError(error)) {
                errorMessage = error.response?.data?.message || "Failed to download deal report.";
            } else if (error instanceof Error) {
                errorMessage = error.message;
            }
            showCustomToast(errorMessage, "error");
        }
    };

    useEffect(() => {
        if (dealId) {
            fetchDeal();
            fetchSimilarDeals();
            fetchScoringHistory(); // Fetch scoring history
        }
    }, [dealId, fetchDeal, fetchSimilarDeals, fetchScoringHistory]);

    // Removed duplicated useEffect
    // useEffect(() => {
    //     if (dealId) {
    //         fetchDeal();
    //         fetchSimilarDeals();
    //     }
    // }, [dealId, fetchDeal, fetchSimilarDeals]);

    const handleScore = async () => {
        if (!dealId) return;
        setScoring(true);
        const token = getAccessToken();
        if (!token) {
            showCustomToast("Authentication token not found.", "error");
            setScoring(false);
            return;
        }
        try {
            const updatedDealResponse = await scoringApi.scoreDeal(dealId, token);
            showCustomToast("Deal scored successfully!", "success");
            fetchDeal(); // Re-fetch deal to update its score
        } catch (error: any) {
            let errorMessage = "An unexpected error occurred.";
            if (axios.isAxiosError(error)) {
                errorMessage = error.response?.data?.message || "Error scoring deal.";
            } else if (error instanceof Error) {
                errorMessage = error.message;
            }
            showCustomToast(errorMessage, "error");
        } finally {
            setScoring(false);
        }
    };

    const handleDeleteDeal = async () => {
        if (!dealId) return;
        const token = getAccessToken();
        if (!token) {
            showCustomToast("Authentication token not found.", "error");
            return;
        }
        try {
            await dealsApi.deleteDeal(dealId, token);
            showCustomToast("Deal deleted successfully!", "success");
            router.push("/deals"); // Redirect to deals list after deletion
        } catch (error: any) {
            let errorMessage = "An unexpected error occurred.";
            if (axios.isAxiosError(error)) {
                errorMessage = error.response?.data?.message || "Error deleting deal.";
            } else if (error instanceof Error) {
                errorMessage = error.message;
            }
            showCustomToast(errorMessage, "error");
        } finally {
            setIsDeleteDialogOpen(false);
        }
    };

    if (loading) {
        return (
            <div className="flex items-center justify-center h-full">
                <LoadingSpinner size="lg" />
            </div>
        );
    }

    if (!deal) {
        return (
            <Container>
                <div className="text-center py-10">
                    <h2 className="text-2xl font-bold">Deal Not Found</h2>
                    <p className="text-muted-foreground">The deal you are looking for does not exist.</p>
                    <Button onClick={() => router.push("/deals")} className="mt-4">
                        Back to Deals
                    </Button>
                </div>
            </Container>
        );
    }

    return (
        <div>
            <Header
                title={deal.name}
                description={deal.short_pitch || deal.description}
                breadcrumbs={[
                    { label: "Dashboard", href: "/dashboard" },
                    { label: "Deals", href: "/deals" },
                    { label: deal.name },
                ]}
                action={
                    <div className="flex gap-2">
                        <Button onClick={handleScore} disabled={scoring}>
                            {scoring ? (
                                <>
                                    <LoadingSpinner size="sm" className="mr-2" />
                                    Scoring...
                                </>
                            ) : (
                                <>
                                    <TrendingUp className="mr-2 h-4 w-4" />
                                    Score Deal
                                </>
                            )}
                        </Button>
                        <Button variant="outline" onClick={() => router.push(`/deals/${dealId}/edit`)}>
                            <Edit className="mr-2 h-4 w-4" />
                            Edit Deal
                        </Button>
                        <Button variant="outline" onClick={handleDownloadDealReport}>
                            <Download className="mr-2 h-4 w-4" />
                            Deal Report
                        </Button>
                        <AlertDialog open={isDeleteDialogOpen} onOpenChange={setIsDeleteDialogOpen}>
                            <AlertDialogTrigger asChild>
                                <Button variant="destructive">
                                    <Trash2 className="mr-2 h-4 w-4" />
                                    Delete Deal
                                </Button>
                            </AlertDialogTrigger>
                            <AlertDialogContent>
                                <AlertDialogHeader>
                                    <AlertDialogTitle>Are you absolutely sure?</AlertDialogTitle>
                                    <AlertDialogDescription>
                                        This action cannot be undone. This will permanently delete the deal &quot;{deal?.name}&quot; and remove its data from our servers.
                                    </AlertDialogDescription>
                                </AlertDialogHeader>
                                <AlertDialogFooter>
                                    <AlertDialogCancel>Cancel</AlertDialogCancel>
                                    <AlertDialogAction onClick={handleDeleteDeal}>Continue</AlertDialogAction>
                                </AlertDialogFooter>
                            </AlertDialogContent>
                        </AlertDialog>
                    </div>
                }
            />

            <Container>
                <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                    <div className="lg:col-span-2 space-y-6">
                        {deal.score && (
                            <DealScoreCard score={deal.score} />
                        )}
                        <DealDetail deal={deal} />

                        {similarDeals.length > 0 && (
                            <Card>
                                <CardHeader>
                                    <CardTitle>Similar Deals</CardTitle>
                                </CardHeader>
                                <CardContent>
                                    {/* Placeholder for a component to list similar deals */}
                                    <ul className="list-disc pl-5 space-y-1">
                                        {similarDeals.map((similarDeal) => (
                                            <li key={similarDeal.id}>
                                                <a href={`/deals/${similarDeal.id}`} className="text-blue-600 hover:underline">
                                                    {similarDeal.name}
                                                </a>
                                            </li>
                                        ))}
                                    </ul>
                                </CardContent>
                            </Card>
                        )}
                    </div>
                    <div className="space-y-6">
                        <DealMetrics deal={deal} />
                        
                        <Card>
                            <CardHeader>
                                <CardTitle>Deal Notes</CardTitle>
                            </CardHeader>
                            <CardContent className="space-y-4">
                                <div className="space-y-2">
                                    {dealNotes.length === 0 ? (
                                        <p className="text-sm text-muted-foreground">No notes yet. Add one below!</p>
                                    ) : (
                                        <ul className="space-y-2">
                                            {dealNotes.map((note, index) => (
                                                <li key={index} className="text-sm border-b pb-2">
                                                    <p>{note.content}</p>
                                                    <p className="text-xs text-muted-foreground">
                                                        {new Date(note.created_at).toLocaleString()}
                                                    </p>
                                                </li>
                                            ))}
                                        </ul>
                                    )}
                                </div>
                                <Textarea
                                    placeholder="Add a new note..."
                                    value={newNoteContent}
                                    onChange={(e) => setNewNoteContent(e.target.value)}
                                />
                                <Button onClick={handleAddNote}>Add Note</Button>
                            </CardContent>
                        </Card>

                        <Card>
                            <CardHeader>
                                <CardTitle>Scoring History</CardTitle>
                            </CardHeader>
                            <CardContent>
                                {scoringHistory.length === 0 ? (
                                    <p className="text-sm text-muted-foreground">No scoring history available.</p>
                                ) : (
                                    <div className="space-y-2">
                                        {scoringHistory.map((historyItem: ScoringHistoryItem) => (
                                            <div key={historyItem.id} className="border-b pb-2">
                                                <p className="text-sm font-semibold">Score: {historyItem.score}</p>
                                                <p className="text-xs text-muted-foreground">
                                                    Evaluated on: {new Date(historyItem.evaluatedAt).toLocaleString()}
                                                </p>
                                                {/* Add more details from historyItem as needed */}
                                            </div>
                                        ))}
                                    </div>
                                )}
                            </CardContent>
                        </Card>
                        {/* More components like DealTeam, DealNotes, etc. */}
                    </div>
                </div>
            </Container>
        </div>
    );
}
