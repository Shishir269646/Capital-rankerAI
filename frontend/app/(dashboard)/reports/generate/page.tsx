"use client";

import { Header } from "@/components/layout/Header";
import { Container } from "@/components/layout/Container";
import { ReportGenerator } from "@/components/reports/ReportGenerator";
import { ReportPreview } from "@/components/reports/ReportPreview";
import { useState } from "react";
import { useToast } from "@/components/ui/use-toast";

export default function GenerateReportPage() {
    const [generating, setGenerating] = useState(false);
    const { toast } = useToast();

    const handleGenerateReport = async (data: any) => {
        setGenerating(true);
        try {
            // Simulate API call for report generation
            await new Promise((resolve) => setTimeout(resolve, 2000));
            console.log("Generating Report with:", data);
            toast({
                title: "Report Generated",
                description: "Your report is ready for preview.",
            });
            // In a real app, you'd probably get a report ID and navigate to its preview page
        } catch (error) {
            toast({
                title: "Error",
                description: "Failed to generate report. Please try again.",
                variant: "destructive",
            });
        } finally {
            setGenerating(false);
        }
    };

    return (
        <div>
            <Header
                title="Generate Report"
                description="Configure and generate investment reports"
                breadcrumbs={[
                    { label: "Dashboard", href: "/dashboard" },
                    { label: "Reports", href: "/reports" },
                    { label: "Generate" },
                ]}
            />
            <Container>
                <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                    <ReportGenerator onGenerate={handleGenerateReport} generating={generating} />
                    <ReportPreview />
                </div>
            </Container>
        </div>
    );
}
