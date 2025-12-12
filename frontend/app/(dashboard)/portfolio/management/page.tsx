"use client";

import { useRouter } from "next/navigation";
import { useEffect, useState, useCallback } from "react";
import { Header } from "@/components/layout/Header";
import { Container } from "@/components/layout/Container";
import { Button } from "@/components/ui/button";
import { useToast } from "@/components/ui/ToastProvider";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { LoadingSpinner } from "@/components/shared/LoadingSpinner";
import { portfolioApi } from "@/lib/api/portfolio.api";
import { getAccessToken } from "@/lib/auth/token";
import type { Portfolio } from "@/types/portfolio.types";
import { Plus, Trash2, Building2 } from "lucide-react";
import { EmptyState } from "@/components/shared/EmptyState";
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

export default function PortfolioManagementPage() {
    const router = useRouter();
    const { show: showCustomToast } = useToast();
    const [portfolios, setPortfolios] = useState<Portfolio[]>([]);
    const [loading, setLoading] = useState(true);
    const [isDeleteDialogOpen, setIsDeleteDialogOpen] = useState(false);
    const [portfolioToDelete, setPortfolioToDelete] = useState<string | null>(null);

    const fetchPortfolios = useCallback(async () => {
        setLoading(true);
        const token = getAccessToken();
        if (!token) {
            showCustomToast("Authentication token not found.", "error");
            setLoading(false);
            return;
        }
        try {
            const response = await portfolioApi.getAllPortfolios(token);
            setPortfolios(response.results);
        } catch (error) {
            showCustomToast("Error fetching portfolios", "error");
        } finally {
            setLoading(false);
        }
    }, [showCustomToast]);

    useEffect(() => {
        fetchPortfolios();
    }, [fetchPortfolios]);

    const handleDeleteClick = (portfolioId: string) => {
        setPortfolioToDelete(portfolioId);
        setIsDeleteDialogOpen(true);
    };

    const handleDeletePortfolio = async () => {
        if (!portfolioToDelete) return;
        const token = getAccessToken();
        if (!token) {
            showCustomToast("Authentication token not found.", "error");
            return;
        }
        try {
            await portfolioApi.deletePortfolio(portfolioToDelete, token);
            showCustomToast("Portfolio deleted successfully!", "success");
            fetchPortfolios(); // Re-fetch portfolios after deletion
        } catch (error: any) {
            showCustomToast(`Error deleting portfolio: ${error.message || 'Unknown error'}`, "error");
        } finally {
            setIsDeleteDialogOpen(false);
            setPortfolioToDelete(null);
        }
    };

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
                title="Portfolio Management"
                description="Manage your investment portfolios"
                breadcrumbs={[
                    { label: "Dashboard", href: "/dashboard" },
                    { label: "Portfolio", href: "/portfolio" },
                    { label: "Management" },
                ]}
                action={
                    <Button onClick={() => router.push("/portfolio/management/new")}>
                        <Plus className="mr-2 h-4 w-4" />
                        New Portfolio
                    </Button>
                }
            />

            <Container>
                {portfolios.length === 0 ? (
                    <EmptyState
                        icon={Building2}
                        title="No Portfolios Yet"
                        description="Create your first investment portfolio to track your assets."
                        action={{
                            label: "Create Portfolio",
                            onClick: () => router.push("/portfolio/management/new"),
                        }}
                    />
                ) : (
                    <div className="space-y-4">
                        {portfolios.map((portfolio) => (
                            <Card key={portfolio.id}>
                                <CardContent className="flex items-center justify-between p-4">
                                    <div className="flex items-center space-x-4">
                                        <div>
                                            {typeof portfolio.startup_id !== 'string' ? (
                                                <>
                                                    <p className="font-semibold">{portfolio.startup_id.name}</p>
                                                    <p className="text-sm text-muted-foreground">{portfolio.startup_id.description}</p>
                                                </>
                                            ) : (
                                                <>
                                                    <p className="font-semibold">Loading Startup Name...</p>
                                                    <p className="text-sm text-muted-foreground">Loading Startup Description...</p>
                                                </>
                                            )}
                                        </div>
                                    </div>
                                    <div className="flex space-x-2">
                                        <Button
                                            variant="outline"
                                            size="sm"
                                            onClick={() => router.push(`/portfolio/management/${portfolio.id}`)}
                                        >
                                            View Details
                                        </Button>
                                        <Button
                                            variant="destructive"
                                            size="sm"
                                            onClick={() => handleDeleteClick(portfolio.id)}
                                        >
                                            <Trash2 className="h-4 w-4 mr-2" /> Delete
                                        </Button>
                                    </div>
                                </CardContent>
                            </Card>
                        ))}
                    </div>
                )}
            </Container>

            <AlertDialog open={isDeleteDialogOpen} onOpenChange={setIsDeleteDialogOpen}>
                <AlertDialogContent>
                    <AlertDialogHeader>
                        <AlertDialogTitle>Are you absolutely sure?</AlertDialogTitle>
                        <AlertDialogDescription>
                            This action cannot be undone. This will permanently delete the portfolio and all associated data.
                        </AlertDialogDescription>
                    </AlertDialogHeader>
                    <AlertDialogFooter>
                        <AlertDialogCancel>Cancel</AlertDialogCancel>
                        <AlertDialogAction onClick={handleDeletePortfolio}>Continue</AlertDialogAction>
                    </AlertDialogFooter>
                </AlertDialogContent>
            </AlertDialog>
        </div>
    );
}
