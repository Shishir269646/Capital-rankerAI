"use client";

import { Button } from "@/components/ui/button";
import { Header } from "@/components/layout/Header";
import { Container } from "@/components/layout/Container";
import { EmptyState } from "@/components/shared/EmptyState";
import { FileText, Plus } from "lucide-react";
import { useRouter } from "next/navigation";

export default function ReportsPage() {
    const router = useRouter();

    return (
        <div>
            <Header
                title="Reports"
                description="Generate and view investment reports"
                breadcrumbs={
                    [
                        { label: "Dashboard", href: "/dashboard" },
                        { label: "Reports" },
                    ]}
                action={
                    < Button onClick={() => router.push("/reports/generate")
                    }>
                        <Plus className="mr-2 h-4 w-4" />
                        Generate Report
                    </Button>
                }
            />

            < Container >
                <EmptyState
                    icon={FileText}
                    title="No reports yet"
                    description="Create your first investment report"
                    action={{
                        label: "Generate Report",
                        onClick: () => router.push("/reports/generate"),
                    }}
                />
            </Container>
        </div>
    );
}
