"use client";

import { useRouter } from "next/navigation";
import { useEffect, useState, useCallback } from "react";
import { Header } from "@/components/layout/Header";
import { Container } from "@/components/layout/Container";
import { Button } from "@/components/ui/button";
import { useToast } from "@/components/ui/ToastProvider";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { LoadingSpinner } from "@/components/shared/LoadingSpinner";
import { portfolioApi } from "@/lib/api/portfolio.api";
import { getAccessToken } from "@/lib/auth/token";
import type { Portfolio, PerformanceMetrics, PortfolioPerformance, UpdatePortfolioPayload } from "@/types/portfolio.types";
import type { Deal } from "@/types/deal.types";
import { Edit, TrendingUp, Save } from "lucide-react";


export default function PortfolioDetailsPage({ params }: { params: { id: string } }) {
    const router = useRouter();
    const { show: showCustomToast } = useToast();
    const portfolioId = params.id;

    const [portfolio, setPortfolio] = useState<Portfolio | null>(null);
    const [performance, setPerformance] = useState<PortfolioPerformance | null>(null);
    const [loading, setLoading] = useState(true);
    const [editing, setEditing] = useState(false);
    const [saving, setSaving] = useState(false);
    const [updatingMetrics, setUpdatingMetrics] = useState(false);

    // Form states for updating portfolio
    const [name, setName] = useState("");
    const [description, setDescription] = useState("");

    // Form states for updating metrics (example)
    const [metricValue, setMetricValue] = useState("");
    const [metricName, setMetricName] = useState("");


    const fetchPortfolioDetails = useCallback(async () => {
        setLoading(true);
        const token = getAccessToken();
        if (!token) {
            showCustomToast("Authentication token not found.", "error");
            setLoading(false);
            return;
        }
        try {
            const response = await portfolioApi.getPortfolioById(portfolioId, token);
            const fetchedPortfolio = response.data; // Store response.data in a variable

            setPortfolio(fetchedPortfolio);

            // Type check for populated startup_id
            if (typeof fetchedPortfolio.startup_id !== 'string') {
                setName(fetchedPortfolio.startup_id.name);
                setDescription(fetchedPortfolio.startup_id.description || "");
            } else {
                // This case should ideally not happen if backend populates correctly
                // Handle as a fallback or error state
                setName("Unknown Startup");
                setDescription("Details not available.");
            }

            // Pass portfolioId as a query option
            const performanceResponse = await portfolioApi.getPortfolioPerformance(token, { portfolioId: portfolioId });
            setPerformance(performanceResponse.data);
        } catch (error) {
            showCustomToast("Error fetching portfolio details", "error");
        } finally {
            setLoading(false);
        }
    }, [portfolioId, showCustomToast]);

    useEffect(() => {
        if (portfolioId) {
            fetchPortfolioDetails();
        }
    }, [portfolioId, fetchPortfolioDetails]);

    const handleUpdatePortfolio = async () => {
        setSaving(true);
        const token = getAccessToken();
        if (!token) {
            showCustomToast("Authentication token not found.", "error");
            setSaving(false);
            return;
        }

        if (!name) {
            showCustomToast("Portfolio name is required.", "error");
            setSaving(false);
            return;
        }

        try {
            const payload = {
                // Portfolio updates (e.g., investment_details, current_status, etc.)
                // Name and description are part of the associated Startup, not the Portfolio directly.
            };
            await portfolioApi.updatePortfolio(portfolioId, payload, token);
            showCustomToast("Portfolio updated successfully!", "success");
            setEditing(false);
            fetchPortfolioDetails(); // Re-fetch portfolio to update its details
        } catch (error: any) {
            const errorMessage = error.response?.data?.message || "Error updating portfolio.";
            showCustomToast(errorMessage, "error");
        } finally {
            setSaving(false);
        }
    };

    const handleUpdateMetrics = async () => {
        setUpdatingMetrics(true);
        const token = getAccessToken();
        if (!token) {
            showCustomToast("Authentication token not found.", "error");
            setUpdatingMetrics(false);
            return;
        }
        if (!metricName || !metricValue) {
            showCustomToast("Metric name and value are required.", "error");
            setUpdatingMetrics(false);
            return;
        }

        try {
            const payload = { // Removed type annotation
                [metricName]: parseFloat(metricValue), // Directly the metrics object
            };
            await portfolioApi.updateMetrics(portfolioId, payload, token);
            showCustomToast("Metrics updated successfully!", "success");
            setMetricName("");
            setMetricValue("");
            fetchPortfolioDetails(); // Re-fetch to see updated performance
        } catch (error: any) {
            const errorMessage = error.response?.data?.message || "Error updating metrics.";
            showCustomToast(errorMessage, "error");
        } finally {
            setUpdatingMetrics(false);
        }
    };


    if (loading) {
        return (
            <div className="flex items-center justify-center h-full">
                <LoadingSpinner size="lg" />
            </div>
        );
    }

    if (!portfolio || typeof portfolio.startup_id === 'string') {
        return (
            <Container>
                <div className="text-center py-10">
                    <h2 className="text-2xl font-bold">Portfolio Not Found or Startup Details Missing</h2>
                    <p className="text-muted-foreground">The portfolio or its associated startup details could not be loaded.</p>
                    <Button onClick={() => router.push("/portfolio/management")} className="mt-4">
                        Back to Portfolio Management
                    </Button>
                </div>
            </Container>
        );
    }

    return (
        <div>
            <Header
                title={portfolio.startup_id.name}
                description={portfolio.startup_id.description || "Portfolio Details"}
                breadcrumbs={[
                    { label: "Dashboard", href: "/dashboard" },
                    { label: "Portfolio", href: "/portfolio" },
                    { label: "Management", href: "/portfolio/management" },
                    { label: portfolio.startup_id.name },
                ]}
                action={
                    <Button onClick={() => setEditing(!editing)} variant="outline">
                        <Edit className="mr-2 h-4 w-4" />
                        {editing ? "Cancel Edit" : "Edit Portfolio"}
                    </Button>
                }
            />

            <Container>
                <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                    <div className="lg:col-span-2 space-y-6">
                        <Card>
                            <CardHeader>
                                <CardTitle>Portfolio Information</CardTitle>
                            </CardHeader>
                            <CardContent className="space-y-4">
                                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                    <div>
                                        <Label htmlFor="name">Name</Label>
                                        <Input id="name" value={name} onChange={(e) => setName(e.target.value)} readOnly={!editing} />
                                    </div>
                                </div>
                                <div>
                                    <Label htmlFor="description">Description</Label>
                                    <Textarea id="description" value={description} onChange={(e) => setDescription(e.target.value)} readOnly={!editing} />
                                </div>

                                {editing && (
                                    <Button onClick={handleUpdatePortfolio} disabled={saving}>
                                        {saving ? "Saving..." : <><Save className="mr-2 h-4 w-4" /> Save Changes</>}
                                    </Button>
                                )}
                            </CardContent>
                        </Card>

                        <Card>
                            <CardHeader>
                                <CardTitle>Performance Metrics</CardTitle>
                            </CardHeader>
                            <CardContent className="space-y-4">
                                {performance ? (
                                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                        <p><strong>Total Value:</strong> ${performance.total_value?.toFixed(2) || 'N/A'}</p>
                                        <p><strong>ROI:</strong> {performance.roi?.toFixed(2) || 'N/A'}%</p>
                                        {/* Display other performance metrics as needed */}
                                    </div>
                                ) : (
                                    <p className="text-muted-foreground">No performance data available.</p>
                                )}
                            </CardContent>
                        </Card>
                    </div>
                    <div className="space-y-6">
                        <Card>
                            <CardHeader>
                                <CardTitle>Update Metrics</CardTitle>
                            </CardHeader>
                            <CardContent className="space-y-4">
                                <div>
                                    <Label htmlFor="metric-name">Metric Name</Label>
                                    <Input
                                        id="metric-name"
                                        value={metricName}
                                        onChange={(e) => setMetricName(e.target.value)}
                                        placeholder="e.g., total_value"
                                    />
                                </div>
                                <div>
                                    <Label htmlFor="metric-value">Metric Value</Label>
                                    <Input
                                        id="metric-value"
                                        type="number"
                                        value={metricValue}
                                        onChange={(e) => setMetricValue(e.target.value)}
                                        placeholder="e.g., 100000"
                                    />
                                </div>
                                <Button onClick={handleUpdateMetrics} disabled={updatingMetrics}>
                                    {updatingMetrics ? "Updating..." : <><TrendingUp className="mr-2 h-4 w-4" /> Update Metric</>}
                                </Button>
                            </CardContent>
                        </Card>
                    </div>
                </div>
            </Container>
        </div>
    );
}
