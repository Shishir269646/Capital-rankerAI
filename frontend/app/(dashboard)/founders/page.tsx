"use client";

import { useState, useEffect, useMemo } from "react";
import { useDispatch, useSelector } from "react-redux";
import { AppDispatch, RootState } from "@/store";
import { fetchFounders, selectFounders, selectFoundersLoading, selectFoundersError } from "@/store/slices/foundersSlice";
import { Header } from "@/components/layout/Header";
import { Container } from "@/components/layout/Container";
import { FounderCard } from "@/components/founders/FounderCard";
import { SearchBar } from "@/components/shared/SearchBar";
import { LoadingSpinner } from "@/components/shared/LoadingSpinner";
import { EmptyState } from "@/components/shared/EmptyState";
import { Users } from "lucide-react";
import { useToast } from "@/components/ui/ToastProvider";
import { Founder } from "@/types/founder.types";

export default function FoundersPage() {
    const dispatch = useDispatch<AppDispatch>();
    const { show: showCustomToast } = useToast();

    const founders = useSelector(selectFounders);
    const loading = useSelector(selectFoundersLoading);
    const error = useSelector(selectFoundersError);

    const [searchQuery, setSearchQuery] = useState('');

    useEffect(() => {
        dispatch(fetchFounders(undefined));
    }, [dispatch]);

    useEffect(() => {
        if (error) {
            showCustomToast(`Error: ${error}`, "error");
        }
    }, [error, showCustomToast]);

    const handleSearch = (query: string) => {
        setSearchQuery(query);
    };

    const filteredFounders = useMemo(() => {
        if (!searchQuery) return founders;
        return founders.filter(
            (founder: Founder) =>
                founder.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
                founder.role.toLowerCase().includes(searchQuery.toLowerCase())
        );
    }, [founders, searchQuery]);

    if (loading && founders.length === 0) {
        return (
            <div className="flex items-center justify-center h-full">
                <LoadingSpinner size="lg" />
            </div>
        );
    }

    return (
        <div>
            <Header
                title="Founders"
                description="View and evaluate founder profiles"
                breadcrumbs={[
                    { label: "Dashboard", href: "/dashboard" },
                    { label: "Founders" },
                ]}
            />

            <Container>
                <div className="space-y-6">
                    <SearchBar placeholder="Search founders..." onSearch={handleSearch} />

                    {filteredFounders.length === 0 ? (
                        <EmptyState
                            icon={Users}
                            title="No founders found"
                            description={
                                founders.length === 0
                                    ? "Founders will appear here once you add deals"
                                    : "Try adjusting your search"
                            }
                        />
                    ) : (
                        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                            {filteredFounders.map((founder: Founder) => (
                                <FounderCard key={founder.id} founder={founder} />
                            ))}
                        </div>
                    )}
                </div>
            </Container>
        </div>
    );
}