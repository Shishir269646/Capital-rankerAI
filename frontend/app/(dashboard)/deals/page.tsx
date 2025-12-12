"use client";

import { useEffect, useState, useMemo } from "react";
import { useRouter } from "next/navigation";
import { useDispatch, useSelector } from "react-redux";
import { AppDispatch, RootState } from "@/store";
import { fetchDeals, searchDeals, selectDeals, selectDealsLoading, selectDealsError } from "@/store/slices/dealsSlice";
import { Header } from "@/components/layout/Header";
import { Container } from "@/components/layout/Container";
import { Button } from "@/components/ui/button";
import { useToast } from "@/components/ui/ToastProvider";
import { LoadingSpinner } from "@/components/shared/LoadingSpinner";
import { Card, CardContent } from "@/components/ui/card";
import { DealCard } from "@/components/deals/DealCard";
import { EmptyState } from "@/components/shared/EmptyState";
import { Plus, Filter, LayoutGrid, Table2, TrendingUp } from "lucide-react";
import { scoringApi } from "@/lib/api/scoring.api";
import { getAccessToken } from "@/lib/auth/token";
import { SearchBar } from "@/components/shared/SearchBar";
import { Deal } from "@/types/deal.types";
import axios, { AxiosError } from "axios";

export default function DealsPage() {
    const router = useRouter();
    const dispatch = useDispatch<AppDispatch>();
    const { show: showCustomToast } = useToast();

    const deals = useSelector(selectDeals);
    const loading = useSelector(selectDealsLoading);
    const error = useSelector(selectDealsError);

    const [searchQuery, setSearchQuery] = useState('');
    const [showFilters, setShowFilters] = useState(false);
    const [viewMode, setViewMode] = useState<"table" | "grid">("grid");

    useEffect(() => {
        dispatch(fetchDeals());
    }, [dispatch]);

    useEffect(() => {
        if (error) {
            showCustomToast(`Error: ${error}`, "error");
        }
    }, [error, showCustomToast]);
    
    const handleSearch = (query: string) => {
        setSearchQuery(query);
        if (query.trim()) {
            dispatch(searchDeals({ name: query }));
        } else {
            dispatch(fetchDeals());
        }
    };

    const handleBulkScore = async () => {
        const token = getAccessToken();
        if (!token) {
            showCustomToast("Authentication token not found.", "error");
            return;
        }
        try {
            const dealIds = deals ? deals.map((deal: Deal) => deal.id) : [];
            if (dealIds.length === 0) {
                showCustomToast("No deals to score.", "info");
                return;
            }
            await scoringApi.batchScore(dealIds, token);
            showCustomToast(`${dealIds.length} deals sent for batch scoring!`, "success");
        } catch (error: any) {
            let errorMessage = "An unexpected error occurred.";
            if (axios.isAxiosError(error)) {
                errorMessage = error.response?.data?.message || "Error initiating bulk scoring.";
            } else if (error instanceof Error) {
                errorMessage = error.message;
            }
            showCustomToast(errorMessage, "error");
        }
    };

    if (loading && (!deals || deals.length === 0)) {
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
                            <Button variant="outline" onClick={() => setViewMode("table")} disabled={viewMode === 'table'}>
                                <Table2 className="mr-2 h-4 w-4" />
                                Table
                            </Button>
                            <Button variant="outline" onClick={() => setViewMode("grid")} disabled={viewMode === 'grid'}>
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
                                <p>Filter options coming soon...</p>
                            </CardContent>
                        </Card>
                    )}

                    {loading && <p>Loading...</p>}
                    {!loading && (!deals || deals.length === 0) ? (
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
                                    {deals.map((deal: Deal) => (
                                        <DealCard key={deal.id} deal={deal} />
                                    ))}
                                </div>
                            ) : (
                                <div>
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