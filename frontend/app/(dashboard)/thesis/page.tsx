"use client";

"use client";

import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Header } from "@/components/layout/Header";
import { Container } from "@/components/layout/Container";
import { ThesisCard } from "@/components/thesis/ThesisCard";
import { LoadingSpinner } from "@/components/shared/LoadingSpinner";
import { EmptyState } from "@/components/shared/EmptyState";
import { Plus, Target } from "lucide-react";
import { useRouter } from "next/navigation";
import { InvestorThesis } from "@/types/thesis.types";
import { thesisApi } from "@/lib/api/thesis.api";
import { useToast } from "@/components/ui/ToastProvider";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { useAuth } from "@/lib/hooks/useAuth";
import { getAccessToken } from "@/lib/auth/token";

export default function ThesisPage() {
    const router = useRouter();
    const { show: showCustomToast } = useToast();
    const [theses, setTheses] = useState<InvestorThesis[]>([]);
    const [loading, setLoading] = useState(true);
    const { user } = useAuth();

    useEffect(() => {
        loadTheses();
    }, [user]);

    const loadTheses = async () => {
        try {
            setLoading(true);
            const token = getAccessToken();
            if (!user || !token) {
                showCustomToast("Authentication required to load theses.", "error");
                setLoading(false);
                return;
            }
            const data = await thesisApi.getInvestorTheses(user.id, token);
            setTheses(data.results);
        } catch (error) {
            showCustomToast("Error: Failed to load investment theses", "error");
        } finally {
            setLoading(false);
        }
    };

    const activeTheses = theses.filter((t) => t.is_active);
    const inactiveTheses = theses.filter((t) => !t.is_active);

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
                title="Investment Thesis"
                description="Define and manage your investment criteria"
                breadcrumbs={[
                    { label: "Dashboard", href: "/dashboard" },
                    { label: "Investment Thesis" },
                ]}
                action={
                    <Button onClick={() => router.push("/thesis/new")}>
                        <Plus className="mr-2 h-4 w-4" />
                        New Thesis
                    </Button>
                }
            />

            <Container>
                {theses.length === 0 ? (
                    <EmptyState
                        icon={Target}
                        title="No investment theses yet"
                        description="Create your first investment thesis to start matching deals"
                        action={{
                            label: "Create Thesis",
                            onClick: () => router.push("/thesis/new"),
                        }}
                    />
                ) : (
                    <Tabs defaultValue="active">
                        <TabsList>
                            <TabsTrigger value="active">
                                Active ({activeTheses.length})
                            </TabsTrigger>
                            <TabsTrigger value="inactive">
                                Inactive ({inactiveTheses.length})
                            </TabsTrigger>
                        </TabsList>

                        <TabsContent value="active" className="mt-6">
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                {activeTheses.map((thesis) => (
                                    <ThesisCard
                                        key={thesis.id}
                                        thesis={thesis}
                                        matchedDealsCount={Math.floor(Math.random() * 20)}
                                    />
                                ))}
                            </div>
                        </TabsContent>

                        <TabsContent value="inactive" className="mt-6">
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                {inactiveTheses.map((thesis) => (
                                    <ThesisCard
                                        key={thesis.id}
                                        thesis={thesis}
                                        matchedDealsCount={Math.floor(Math.random() * 20)}
                                    />
                                ))}
                            </div>
                        </TabsContent>
                    </Tabs>
                )}
            </Container>
        </div>
    );
}
