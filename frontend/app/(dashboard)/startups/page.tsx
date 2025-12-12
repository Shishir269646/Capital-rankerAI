"use client";

import { useEffect } from "react";
import { useRouter } from "next/navigation";
import { useDispatch, useSelector } from "react-redux";
import { AppDispatch, RootState } from "@/store";
import { fetchStartups, selectStartups, selectStartupsLoading, selectStartupsError } from "@/store/slices/startupSlice";
import { Header } from "@/components/layout/Header";
import { Container } from "@/components/layout/Container";
import { Button } from "@/components/ui/button";
import { useToast } from "@/components/ui/ToastProvider";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { LoadingSpinner } from "@/components/shared/LoadingSpinner";
import { EmptyState } from "@/components/shared/EmptyState";
import { Building2, Plus } from "lucide-react";
import type { Startup } from "@/types/startup.types";

export default function StartupsPage() {
    const router = useRouter();
    const dispatch = useDispatch<AppDispatch>();
    const { show: showCustomToast } = useToast();

    const startups = useSelector(selectStartups);
    const loading = useSelector(selectStartupsLoading);
    const error = useSelector(selectStartupsError);

    useEffect(() => {
        dispatch(fetchStartups(undefined));
    }, [dispatch]);

    useEffect(() => {
        if (error) {
            showCustomToast(`Error: ${error}`, "error");
        }
    }, [error, showCustomToast]);

    if (loading && startups.length === 0) {
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
                        {startups.map((startup: Startup) => (
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
