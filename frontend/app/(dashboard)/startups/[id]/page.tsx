"use client";

import { useRouter } from "next/navigation";
import { useEffect, useState, useCallback } from "react";
import { Header } from "@/components/layout/Header";
import { Container } from "@/components/layout/Container";
import { Button } from "@/components/ui/button";
import { useToast } from "@/components/ui/ToastProvider";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { LoadingSpinner } from "@/components/shared/LoadingSpinner";
import { foundersApi } from "@/lib/api/founders.api";
import { getAccessToken } from "@/lib/auth/token";
import type { Founder } from "@/types/founder.types"; // Assuming Founder type exists
// import type { Startup } from "@/types/startup.types"; // Hypothetical Startup type
import { Building2 } from "lucide-react";

// Placeholder for Startup type if it doesn't exist yet
interface Startup {
    id: string;
    name: string;
    description: string;
    // Add other relevant startup fields
}

export default function StartupDetailsPage({ params }: { params: { id: string } }) {
    const router = useRouter();
    const { show: showCustomToast } = useToast();
    const startupId = params.id;

    const [startup, setStartup] = useState<Startup | null>(null);
    const [founders, setFounders] = useState<Founder[]>([]);
    const [loading, setLoading] = useState(true);

    const fetchStartupDetails = useCallback(async () => {
        setLoading(true);
        const token = getAccessToken();
        if (!token) {
            showCustomToast("Authentication token not found.", "error");
            setLoading(false);
            return;
        }
        try {
            // Placeholder: Assuming a startupApi.getStartupById exists or dealsApi returns enough info
            // For now, I'll mock a startup or fetch from deals if possible
            const mockStartup: Startup = {
                id: startupId,
                name: `Startup ${startupId}`,
                description: `Description for startup ${startupId}`,
            };
            setStartup(mockStartup);

            const foundersResponse = await foundersApi.getFoundersByStartup(startupId, token);
            setFounders(foundersResponse.results);
        } catch (error) {
            showCustomToast("Error fetching startup details or founders", "error");
        } finally {
            setLoading(false);
        }
    }, [startupId, showCustomToast]);

    useEffect(() => {
        if (startupId) {
            fetchStartupDetails();
        }
    }, [startupId, fetchStartupDetails]);

    if (loading) {
        return (
            <div className="flex items-center justify-center h-full">
                <LoadingSpinner size="lg" />
            </div>
        );
    }

    if (!startup) {
        return (
            <Container>
                <div className="text-center py-10">
                    <h2 className="text-2xl font-bold">Startup Not Found</h2>
                    <p className="text-muted-foreground">The startup you are looking for does not exist.</p>
                    <Button onClick={() => router.push("/dashboard")} className="mt-4">
                        Back to Dashboard
                    </Button>
                </div>
            </Container>
        );
    }

    return (
        <div>
            <Header
                title={startup.name}
                description={startup.description}
                breadcrumbs={[
                    { label: "Dashboard", href: "/dashboard" },
                    { label: "Startups" },
                    { label: startup.name },
                ]}
            />

            <Container>
                <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                    <div className="lg:col-span-2 space-y-6">
                        <Card>
                            <CardHeader>
                                <CardTitle>Startup Details</CardTitle>
                            </CardHeader>
                            <CardContent>
                                <p>{startup.description}</p>
                                {/* Add more startup details here */}
                            </CardContent>
                        </Card>

                        <Card>
                            <CardHeader>
                                <CardTitle>Founders</CardTitle>
                            </CardHeader>
                            <CardContent>
                                {founders.length === 0 ? (
                                    <p className="text-muted-foreground">No founders associated with this startup.</p>
                                ) : (
                                    <ul className="space-y-2">
                                        {founders.map((founder) => (
                                            <li key={founder.id} className="border-b pb-2">
                                                <h3 className="font-semibold">{founder.name}</h3>
                                                <p className="text-sm text-muted-foreground">{founder.email}</p>
                                                {founder.linkedin_profile && (
                                                    <a href={founder.linkedin_profile} target="_blank" rel="noopener noreferrer" className="text-blue-600 hover:underline text-sm">
                                                        LinkedIn
                                                    </a>
                                                )}
                                                <p className="text-sm">{founder.bio}</p>
                                            </li>
                                        ))}
                                    </ul>
                                )}
                            </CardContent>
                        </Card>
                    </div>
                    <div className="space-y-6">
                        {/* Right column for other related info like deals, metrics, etc. */}
                        <Card>
                            <CardHeader>
                                <CardTitle>Related Information</CardTitle>
                            </CardHeader>
                            <CardContent>
                                <p className="text-muted-foreground">Coming soon...</p>
                            </CardContent>
                        </Card>
                    </div>
                </div>
            </Container>
        </div>
    );
}
