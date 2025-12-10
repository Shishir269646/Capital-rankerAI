"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { Header } from "@/components/layout/Header";
import { Container } from "@/components/layout/Container";
import { Button } from "@/components/ui/button";
import { useToast } from "@/components/ui/ToastProvider";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { LoadingSpinner } from "@/components/shared/LoadingSpinner";
import { EmptyState } from "@/components/shared/EmptyState";
import { Building2, Plus } from "lucide-react";
// Assuming a Startup type from a hypothetical startup.types.ts
// import type { Startup } from "@/types/startup.types";

// Placeholder for Startup type and API until actual startup.types.ts and startup.api.ts are defined
interface Startup {
    id: string;
    name: string;
    description: string;
    industry: string;
    // Add other relevant startup fields
}

// Placeholder for a hypothetical startupApi
const startupApi = {
    getAllStartups: async (token: string): Promise<{ results: Startup[] }> => {
        // Simulate API call
        return new Promise((resolve) => {
            setTimeout(() => {
                const mockStartups: Startup[] = [
                    { id: "1", name: "InnovateTech", description: "Revolutionizing AI solutions.", industry: "Artificial Intelligence" },
                    { id: "2", name: "GreenEnergy Co", description: "Sustainable power generation.", industry: "Renewable Energy" },
                    { id: "3", name: "HealthLink", description: "Connecting patients with care.", industry: "Healthcare Tech" },
                    { id: "4", name: "FutureMobility", description: "Next-gen urban transport.", industry: "Automotive" },
                ];
                resolve({ results: mockStartups });
            }, 500);
        });
    },
};


export default function StartupsPage() {
    const router = useRouter();
    const { show: showCustomToast } = useToast();
    const [startups, setStartups] = useState<Startup[]>([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const fetchStartups = async () => {
            setLoading(true);
            const token = "mock-token"; // Placeholder for getAccessToken()
            // if (!token) {
            //     showCustomToast("Authentication token not found.", "error");
            //     setLoading(false);
            //     return;
            // }
            try {
                const response = await startupApi.getAllStartups(token); // Using hypothetical API
                setStartups(response.results);
            } catch (error) {
                showCustomToast("Error fetching startups", "error");
            } finally {
                setLoading(false);
            }
        };
        fetchStartups();
    }, [showCustomToast]);


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
                title="Startups"
                description="Browse and manage startup profiles"
                breadcrumbs={[{ label: "Dashboard", href: "/dashboard" }, { label: "Startups" }]}
                action={
                    <Button onClick={() => showCustomToast("Feature coming soon!", "info")}>
                        <Plus className="mr-2 h-4 w-4" />
                        Add New Startup
                    </Button>
                }
            />

            <Container>
                {startups.length === 0 ? (
                    <EmptyState
                        icon={Building2}
                        title="No Startups Found"
                        description="Currently, there are no startup profiles to display."
                        action={{
                            label: "Add New Startup",
                            onClick: () => showCustomToast("Feature coming soon!", "info"),
                        }}
                    />
                ) : (
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                        {startups.map((startup) => (
                            <Card key={startup.id} onClick={() => router.push(`/startups/${startup.id}`)} className="cursor-pointer hover:shadow-lg transition-shadow">
                                <CardHeader>
                                    <CardTitle>{startup.name}</CardTitle>
                                    <p className="text-sm text-muted-foreground">{startup.industry}</p>
                                </CardHeader>
                                <CardContent>
                                    <p className="text-sm">{startup.description}</p>
                                </CardContent>
                            </Card>
                        ))}
                    </div>
                )}
            </Container>
        </div>
    );
}
