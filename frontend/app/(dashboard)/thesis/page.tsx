"use client";

import { useEffect, useMemo } from "react";
import { useDispatch, useSelector } from "react-redux";
import { AppDispatch, RootState } from "@/store";
import { getInvestorTheses, selectInvestorTheses, selectThesisLoading, selectThesisError } from "@/store/slices/thesisSlice";
import { selectUser } from "@/store/slices/authSlice";
import { Button } from "@/components/ui/button";
import { Header } from "@/components/layout/Header";
import { Container } from "@/components/layout/Container";
import { ThesisCard } from "@/components/thesis/ThesisCard";
import { LoadingSpinner } from "@/components/shared/LoadingSpinner";
import { EmptyState } from "@/components/shared/EmptyState";
import { Plus, Target } from "lucide-react";
import { useRouter } from "next/navigation";
import { useToast } from "@/components/ui/ToastProvider";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { InvestorThesis } from "@/types/thesis.types";

export default function ThesisPage() {
    const router = useRouter();
    const dispatch = useDispatch<AppDispatch>();
    const { show: showCustomToast } = useToast();

    const theses = useSelector(selectInvestorTheses);
    const loading = useSelector(selectThesisLoading);
    const error = useSelector(selectThesisError);
    const user = useSelector(selectUser);

    useEffect(() => {
        if (user?.id) {
            dispatch(getInvestorTheses({ investorId: user.id }));
        }
    }, [dispatch, user]);

    useEffect(() => {
        if (error) {
            showCustomToast(`Error: ${error}`, "error");
        }
    }, [error, showCustomToast]);

    const { activeTheses, inactiveTheses } = useMemo(() => {
        const active = theses.filter((t: InvestorThesis) => t.is_active);
        const inactive = theses.filter((t: InvestorThesis) => !t.is_active);
        return { activeTheses: active, inactiveTheses: inactive };
    }, [theses]);

    if (loading && theses.length === 0) {
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
                                {activeTheses.map((thesis: InvestorThesis) => (
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
                                {inactiveTheses.map((thesis: InvestorThesis) => (
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
