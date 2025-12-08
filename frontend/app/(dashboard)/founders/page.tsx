"use client";

import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Header } from "@/components/layout/Header";
import { Container } from "@/components/layout/Container";
import { FounderCard } from "@/components/founders/FounderCard";
import { SearchBar } from "@/components/shared/SearchBar";
import { LoadingSpinner } from "@/components/shared/LoadingSpinner";
import { EmptyState } from "@/components/shared/EmptyState";
import { Users } from "lucide-react";
import { Founder } from "@/types/founder.types";
import { foundersApi } from "@/lib/api/founders.api";
import { useToast } from "@/components/ui/toast";

export default function FoundersPage() {
    const { toast } = useToast();
    const [founders, setFounders] = useState<Founder[]>([]);
    const [filteredFounders, setFilteredFounders] = useState<Founder[]>([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        loadFounders();
    }, []);

    const loadFounders = async () => {
        try {
            setLoading(true);
            const data = await foundersApi.getFounders();
            setFounders(data);
            setFilteredFounders(data);
        } catch (error) {
            toast({
                title: "Error",
                description: "Failed to load founders",
                variant: "destructive",
            });
        } finally {
            setLoading(false);
        }
    };

    const handleSearch = (query: string) => {
        if (!query.trim()) {
            setFilteredFounders(founders);
            return;
        }

        const filtered = founders.filter(
            (founder) =>
                founder.name.toLowerCase().includes(query.toLowerCase()) ||
                founder.role.toLowerCase().includes(query.toLowerCase())
        );
        setFilteredFounders(filtered);
    };

    if (loading) {
        return (
            <div className="flex items-center justify-center h-full" >
                <LoadingSpinner size="lg" />
            </div>
        );
    }

    return (
        <div>
            <Header
                title="Founders"
                description="View and evaluate founder profiles"
                breadcrumbs={
                    [
                        { label: "Dashboard", href: "/dashboard" },
                        { label: "Founders" },
                    ]}
            />

            <Container>
                <div className="space-y-6" >
                    <SearchBar placeholder="Search founders..." onSearch={handleSearch} />

                    {
                        filteredFounders.length === 0 ? (
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
                            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4" >
                                {
                                    filteredFounders.map((founder) => (
                                        <FounderCard key={founder.id} founder={founder} />
                                    ))
                                }
                            </div>
                        )}
                </div>
            </Container>
        </div>
    );
}
