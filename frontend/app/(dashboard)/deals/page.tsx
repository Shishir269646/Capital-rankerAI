"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { Header } from "@/components/layout/Header";
import { Container } from "@/components/layout/Container";
import { Button } from "@/components/ui/button";
import { useToast } from "@/components/ui/ToastProvider";
import { LoadingSpinner } from "@/components/shared/LoadingSpinner";
import { Card, CardContent } from "@/components/ui/card";
import { DealCard } from "@/components/deals/DealCard";
import { EmptyState } from "@/components/shared/EmptyState";
import { Plus, Filter, LayoutGrid, Table2, TrendingUp, DollarSign } from "lucide-react";
import { dealsApi } from "@/lib/api/deals.api";
import { scoringApi } from "@/lib/api/scoring.api";
import { getAccessToken } from "@/lib/auth/token";
import type { Deal } from "@/types/deal.types";
import { SearchBar } from "@/components/shared/SearchBar";

export default function DealsPage() {
    const router = useRouter();
    const { show: showCustomToast } = useToast();
    const [deals, setDeals] = useState<Deal[]>([]);
    const [filteredDeals, setFilteredDeals] = useState<Deal[]>([]);
    const [loading, setLoading] = useState(true);
    const [showFilters, setShowFilters] = useState(false);
    const [viewMode, setViewMode] = useState<"table" | "grid">("grid"); // Default to grid view

    useEffect(() => {
        loadDeals();
    }, []);

    const loadDeals = async () => {
        setLoading(true);
        const token = getAccessToken();
        if (!token) {
            showCustomToast("Authentication token not found.", "error");
            setLoading(false);
            return;
        }
        try {
            const response = await dealsApi.getAllDeals(token);
            setDeals(response.results);
            setFilteredDeals(response.results);
        } catch (error) {
            showCustomToast("Error fetching deals", "error");
        } finally {
            setLoading(false);
        }
    };

    const handleSearch = (query: string) => {
        if (!query.trim()) {
            setFilteredDeals(deals);
            return;
        }
        const filtered = deals.filter(
            (deal) =>
                deal.name.toLowerCase().includes(query.toLowerCase()) ||
                deal.short_pitch?.toLowerCase().includes(query.toLowerCase()) ||
                deal.sector.some((s) => s.toLowerCase().includes(query.toLowerCase()))
        );
        setFilteredDeals(filtered);
    };

    const handleBulkScore = async () => {
        const token = getAccessToken();
        if (!token) {
            showCustomToast("Authentication token not found.", "error");
            return;
        }
        try {
            // Get all deal IDs from the current deals state
            const dealIds = deals.map(deal => deal.id);
            if (dealIds.length === 0) {
                showCustomToast("No deals to score.", "info");
                return;
            }
            await scoringApi.batchScore(dealIds, token);
            showCustomToast(`${dealIds.length} deals sent for batch scoring!`, "success");
        } catch (error: any) {
            showCustomToast(`Error initiating bulk scoring: ${error.message || 'Unknown error'}`, "error");
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
                title="Deals"
                description="Manage your investment pipeline"
                breadcrumbs={[{ label: "Dashboard", href: "/dashboard" }, { label: "Deals" }]}
                action={
                    <Button onClick={() => router.push("/deals/new")}>
                        <Plus className="mr-2 h-4 w-4" />
                        Add New Deal
                    </Button>
                }
            />

            <Container>
                <div className="space-y-6">
                    <div className="flex flex-col md:flex-row gap-4 justify-between">
                        <SearchBar onSearch={handleSearch} placeholder="Search deals..." />
                        <div className="flex gap-2">
                            <Button variant="outline" onClick={() => setShowFilters(!showFilters)}>
                                <Filter className="mr-2 h-4 w-4" />
                                Filters
                            </Button>
                            <Button variant="outline" onClick={() => setViewMode("table")}>
                                <Table2 className="mr-2 h-4 w-4" />
                                Table
                            </Button>
                            <Button variant="outline" onClick={() => setViewMode("grid")}>
                                <LayoutGrid className="mr-2 h-4 w-4" />
                                Grid
                            </Button>
                            <Button onClick={handleBulkScore}>
                                <TrendingUp className="mr-2 h-4 w-4" />
                                Bulk Score
                            </Button>
                        </div>
                    </div>

                    {showFilters && (
                        <Card>
                            <CardContent className="pt-6">
                                {/* Filter components go here */}
                                <p>Filter options coming soon...</p>
                            </CardContent>
                        </Card>
                    )}

                    {deals.length === 0 ? (
                        <EmptyState
                            title="No deals found"
                            description="Start by adding a new deal to your pipeline."
                            action={{
                                label: "Add New Deal",
                                onClick: () => router.push("/deals/new"),
                            }}
                        />
                    ) : (
                        <div>
                            {viewMode === "grid" ? (
                                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                                    {filteredDeals.map((deal) => (
                                        <DealCard key={deal.id} deal={deal} />
                                    ))}
                                </div>
                            ) : (
                                <div>
                                    {/* DealTable component would go here */}
                                    <p>Table view coming soon...</p>
                                </div>
                            )}
                        </div>
                    )}
                </div>
            </Container>
        </div>
    );
}