"use client";

import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Header } from "@/components/layout/Header";
import { Container } from "@/components/layout/Container";
import { DealTable } from "@/components/deals/DealTable";
import { DealCard } from "@/components/deals/DealCard";
import { DealFilters } from "@/components/deals/DealFilters";
import { SearchBar } from "@/components/shared/SearchBar";
import { Pagination } from "@/components/shared/Pagination";
import { LoadingSpinner } from "@/components/shared/LoadingSpinner";
import { EmptyState } from "@/components/shared/EmptyState";
import { Plus, LayoutGrid, List, Download, Filter } from "lucide-react";
import { useRouter } from "next/navigation";
import { Deal, DealFilters as DealFiltersType } from "@/types/deal.types";
import { dealsApi } from "@/lib/api/deals.api";
import { useToast } from "@/components/ui/use-toast";

type ViewMode = "grid" | "table";

export default function DealsPage() {
    const router = useRouter();
    const { toast } = useToast();
    const [deals, setDeals] = useState<Deal[]>([]);
    const [loading, setLoading] = useState(true);
    const [viewMode, setViewMode] = useState<ViewMode>("table");
    const [showFilters, setShowFilters] = useState(true);
    const [currentPage, setCurrentPage] = useState(1);
    const [totalPages, setTotalPages] = useState(1);
    const [selectedIds, setSelectedIds] = useState<string[]>([]);
    const [filters, setFilters] = useState<DealFiltersType>({
        search: "",
        sectors: [],
        stages: [],
        scoreMin: 0,
        scoreMax: 100,
    });

    useEffect(() => {
        loadDeals();
    }, [filters, currentPage]);

    const loadDeals = async () => {
        try {
            setLoading(true);
            const data = await dealsApi.getDeals({ ...filters, page: currentPage, limit: 20 });
            setDeals(data);
            setTotalPages(Math.ceil(data.length / 20));
        } catch (error) {
            toast({
                title: "Error",
                description: "Failed to load deals",
                variant: "destructive",
            });
        } finally {
            setLoading(false);
        }
    };

    const handleSearch = (query: string) => {
        setFilters({ ...filters, search: query });
        setCurrentPage(1);
    };

    const handleFilterChange = (newFilters: DealFiltersType) => {
        setFilters(newFilters);
        setCurrentPage(1);
    };

    const handleClearFilters = () => {
        setFilters({
            search: "",
            sectors: [],
            stages: [],
            scoreMin: 0,
            scoreMax: 100,
        });
        setCurrentPage(1);
    };

    const handleAction = (action: string, id: string) => {
        switch (action) {
            case "view":
                router.push(`/deals/${id}`);
                break;
            case "score":
                router.push(`/scoring?dealId=${id}`);
                break;
            case "edit":
                router.push(`/deals/${id}/edit`);
                break;
            case "delete":
                // Handle delete
                break;
        }
    };

    const handleBulkScore = async () => {
        if (selectedIds.length === 0) return;

        toast({
            title: "Scoring in progress",
            description: `Scoring ${selectedIds.length} deals...`,
        });
        // Implement bulk scoring logic
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
                breadcrumbs={[
                    { label: "Dashboard", href: "/dashboard" },
                    { label: "Deals" },
                ]}
                action={
                    <Button onClick={() => router.push("/deals/new")}>
                        <Plus className="mr-2 h-4 w-4" />
                        Add Deal
                    </Button>
                }
            />

            <div className="flex">
                {/* Filters Sidebar */}
                {showFilters && (
                    <DealFilters
                        filters={filters}
                        onFilterChange={handleFilterChange}
                        onClear={handleClearFilters}
                    />
                )}

                {/* Main Content */}
                <div className="flex-1">
                    <Container>
                        <div className="space-y-6">
                            {/* Toolbar */}
                            <div className="flex items-center justify-between gap-4">
                                <SearchBar
                                    placeholder="Search deals..."
                                    onSearch={handleSearch}
                                />

                                <div className="flex items-center gap-2">
                                    <Button
                                        variant="outline"
                                        size="icon"
                                        onClick={() => setShowFilters(!showFilters)}
                                    >
                                        <Filter className="h-4 w-4" />
                                    </Button>

                                    <div className="border rounded-md flex">
                                        <Button
                                            variant={viewMode === "table" ? "secondary" : "ghost"}
                                            size="icon"
                                            onClick={() => setViewMode("table")}
                                        >
                                            <List className="h-4 w-4" />
                                        </Button>
                                        <Button
                                            variant={viewMode === "grid" ? "secondary" : "ghost"}
                                            size="icon"
                                            onClick={() => setViewMode("grid")}
                                        >
                                            <LayoutGrid className="h-4 w-4" />
                                        </Button>
                                    </div>

                                    {selectedIds.length > 0 && (
                                        <Button onClick={handleBulkScore}>
                                            Score Selected ({selectedIds.length})
                                        </Button>
                                    )}

                                    <Button variant="outline">
                                        <Download className="mr-2 h-4 w-4" />
                                        Export
                                    </Button>
                                </div>
                            </div>

                            {/* Deals Display */}
                            {deals.length === 0 ? (
                                <EmptyState
                                    title="No deals found"
                                    description="Get started by adding your first deal"
                                    action={{
                                        label: "Add Deal",
                                        onClick: () => router.push("/deals/new"),
                                    }}
                                />
                            ) : viewMode === "table" ? (
                                <DealTable
                                    deals={deals}
                                    onSelect={setSelectedIds}
                                    onAction={handleAction}
                                />
                            ) : (
                                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                                    {deals.map((deal) => (
                                        <DealCard
                                            key={deal.id}
                                            deal={deal}
                                            onScore={(id) => handleAction("score", id)}
                                        />
                                    ))}
                                </div>
                            )}

                            {/* Pagination */}
                            {totalPages > 1 && (
                                <div className="flex justify-center">
                                    <Pagination
                                        currentPage={currentPage}
                                        totalPages={totalPages}
                                        onPageChange={setCurrentPage}
                                    />
                                </div>
                            )}
                        </div>
                    </Container>
                </div>
            </div>
        </div>
    );
}
