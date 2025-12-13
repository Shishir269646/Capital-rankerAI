"use client";

import { useEffect, useState, useMemo } from "react";
import { useRouter } from "next/navigation";
import { Header } from "@/components/layout/Header";
import { Container } from "@/components/layout/Container";
import { Button } from "@/components/ui/button";
import { useToast } from "@/components/ui/ToastProvider";
import { LoadingSpinner } from "@/components/shared/LoadingSpinner";
import { Card, CardContent } from "@/components/ui/card";
import { DealCard } from "@/components/deals/DealCard";
import { EmptyState } from "@/components/shared/EmptyState";
import { Pagination } from "@/components/shared/Pagination";
import { SearchBar } from "@/components/shared/SearchBar";
import { Plus, Filter, LayoutGrid, Table2, TrendingUp } from "lucide-react";
import { scoringApi } from "@/lib/api/scoring.api";
import { getAccessToken } from "@/lib/auth/token";
import { Deal } from "@/types/deal.types";
import { useDeals } from "@/lib/hooks/useDeals";
import axios from "axios";

const PAGE_LIMIT = 3;

export default function DealsPage() {
    const router = useRouter();
    const { show: showToast } = useToast();

    // ----------------------------
    // Local state
    // ----------------------------
    const [searchQuery, setSearchQuery] = useState("");
    const [currentPage, setCurrentPage] = useState(1);
    const [showFilters, setShowFilters] = useState(false);
    const [viewMode, setViewMode] = useState<"table" | "grid">("grid");

    // ----------------------------
    // Deals hook
    // ----------------------------
    const { deals, loading, error, pagination, getDeals, search } = useDeals();

    // ----------------------------
    // API Calls (Effect)
    // ----------------------------
    useEffect(() => {
        // This effect now tracks searchQuery changes automatically
        if (searchQuery.trim()) {
            search(searchQuery, { page: currentPage, limit: PAGE_LIMIT });
        } else {
            getDeals({ page: currentPage, limit: PAGE_LIMIT });
        }
    }, [currentPage, searchQuery, getDeals, search]);

    // ----------------------------
    // Error handling
    // ----------------------------
    useEffect(() => {
        if (error) {
            showToast(`Error: ${error}`, "error");
        }
    }, [error, showToast]);

    // ----------------------------
    // Handlers
    // ----------------------------
    const handleSearch = (query: string) => {
        setSearchQuery(query);
        setCurrentPage(1); // Reset to page 1 on new search
    };

    const handlePageChange = (page: number) => {
        setCurrentPage(page);
    };

    // ----------------------------
    // Bulk Score Action
    // ----------------------------
    const handleBulkScore = async () => {
        const token = getAccessToken();
        if (!token) {
            showToast("Authentication token not found.", "error");
            return;
        }

        try {
            if (!deals.length) {
                showToast("No deals to score.", "info");
                return;
            }

            const dealIds = deals.map((deal: Deal) => deal.id);
            await scoringApi.batchScore(dealIds, token);

            showToast(`${dealIds.length} deals sent for batch scoring!`, "success");
        } catch (err: unknown) {
            const message = axios.isAxiosError(err)
                ? err.response?.data?.message || "Bulk score failed"
                : "Unexpected error";

            showToast(message, "error");
        }
    };

    // ----------------------------
    // Memoized Views
    // ----------------------------
    const memoizedDeals = useMemo(() => {
        return (deals ?? []).map((deal: Deal) => (
            <DealCard key={deal.id} deal={deal} />
        ));
    }, [deals]);

    // ----------------------------
    // Initial Loading View
    // ----------------------------
    // Only show full page loader if we have NO deals and we are loading.
    // If we have deals (e.g., during pagination/search refresh), we keep the list visible.
    if (loading && deals.length === 0) {
        return (
            <div className="flex items-center justify-center h-screen w-full">
                <LoadingSpinner size="lg" />
            </div>
        );
    }

    return (
        <div>
            <Header
                title="Deals"
                description="Manage your investment pipeline"
                breadcrumbs={[
                    { label: "Dashboard", href: "/dashboard" },
                    { label: "Deals" },
                ]}
                action={
                    <Button onClick={() => router.push("/deals/new")}>
                        <Plus className="mr-2 h-4 w-4" />
                        Add New Deal
                    </Button>
                }
            />

            <Container>
                <div className="space-y-6">
                    {/* Controls Bar */}
                    <div className="flex flex-col md:flex-row gap-4 justify-between">
                        <SearchBar onSearch={handleSearch} placeholder="Search deals..." />

                        <div className="flex gap-2">
                            <Button
                                variant="outline"
                                onClick={() => setShowFilters(!showFilters)}
                            >
                                <Filter className="mr-2 h-4 w-4" />
                                Filters
                            </Button>

                            <Button
                                variant="outline"
                                onClick={() => setViewMode("table")}
                                disabled={viewMode === "table"}
                            >
                                <Table2 className="mr-2 h-4 w-4" />
                                Table
                            </Button>

                            <Button
                                variant="outline"
                                onClick={() => setViewMode("grid")}
                                disabled={viewMode === "grid"}
                            >
                                <LayoutGrid className="mr-2 h-4 w-4" />
                                Grid
                            </Button>

                            <Button onClick={handleBulkScore}>
                                <TrendingUp className="mr-2 h-4 w-4" />
                                Bulk Score
                            </Button>
                        </div>
                    </div>

                    {/* Filter Panel (Placeholder) */}
                    {showFilters && (
                        <Card>
                            <CardContent className="pt-6">
                                <p className="text-muted-foreground">Filter options coming soon...</p>
                            </CardContent>
                        </Card>
                    )}

                    {/* Content Area */}
                    {!loading && deals.length === 0 ? (
                        <EmptyState
                            title="No deals found"
                            description={
                                searchQuery
                                    ? `No deals matched "${searchQuery}"`
                                    : "Start by adding a new deal."
                            }
                            action={{
                                label: "Add New Deal",
                                onClick: () => router.push("/deals/new"),
                            }}
                        />
                    ) : (
                        <>
                            {viewMode === "grid" ? (
                                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                                    {memoizedDeals}
                                </div>
                            ) : (
                                <div className="p-10 text-center border rounded-md bg-slate-50">
                                    <p>Table view coming soon...</p>
                                </div>
                            )}

                            {pagination && pagination.totalPages > 1 && (
                                <div className="mt-6 flex justify-center">
                                    <Pagination
                                        currentPage={pagination.page}
                                        totalPages={pagination.totalPages}
                                        onPageChange={handlePageChange}
                                    />
                                </div>
                            )}
                        </>
                    )}
                </div>
            </Container>
        </div>
    );
}