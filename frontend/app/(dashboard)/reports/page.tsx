"use client";

import { useEffect, useState } from "react";
import { Header } from "@/components/layout/Header";
import { Container } from "@/components/layout/Container";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { useRouter } from "next/navigation";
import { useToast } from "@/components/ui/ToastProvider";
import { LoadingSpinner } from "@/components/shared/LoadingSpinner";
import { reportsApi } from "@/lib/api/reports.api";
import { getAccessToken } from "@/lib/auth/token";
import { Report } from "@/types/report.types";
import { EmptyState } from "@/components/shared/EmptyState";
import { Badge } from "@/components/ui/badge";
import { FileText, Plus, Download } from "lucide-react";

export default function ReportsPage() {
    const router = useRouter();
    const { show: showCustomToast } = useToast();
    const [reports, setReports] = useState<Report[]>([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const fetchReports = async () => {
            setLoading(true);
            const token = getAccessToken();
            if (!token) {
                showCustomToast("Authentication token not found.", "error");
                setLoading(false);
                return;
            }
            try {
                // Assuming reportsApi.getAllReports returns a PaginatedApiResult<Report>
                const response = await reportsApi.getAllReports(token);
                setReports(response.results);
            } catch (error) {
                showCustomToast("Error fetching reports", "error");
            } finally {
                setLoading(false);
            }
        };
        fetchReports();
    }, []);

        const handleDownloadReport = async (reportId: string) => {
            const token = getAccessToken();
            if (!token) {
                showCustomToast("Authentication token not found.", "error");
                return;
            }
            try {
                const blob = await reportsApi.downloadReport(reportId, token);
                const url = window.URL.createObjectURL(blob);
                const a = document.createElement('a');
                a.href = url;
                a.download = `report_${reportId}.pdf`;
                document.body.appendChild(a);
                a.click();
                a.remove();
                showCustomToast("Report downloaded successfully", "success");
            } catch (error: any) {
                showCustomToast(`Failed to download report: ${error.message || 'Unknown error'}`, "error");
            }
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
                title="Reports"
                description="Generate and manage your investment reports"
                breadcrumbs={[{ label: "Dashboard", href: "/dashboard" }, { label: "Reports" }]}
                action={
                    <Button onClick={() => router.push("/reports/generate")}>
                        <Plus className="mr-2 h-4 w-4" />
                        Generate New Report
                    </Button>
                }
            />

            <Container>
                {reports.length === 0 ? (
                    <EmptyState
                        icon={FileText}
                        title="No reports generated yet"
                        description="Start by generating your first investment report."
                        action={{
                            label: "Generate Report",
                            onClick: () => router.push("/reports/generate"),
                        }}
                    />
                ) : (
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                        {reports.map((report) => (
                            <Card key={report.id}>
                                <CardHeader>
                                    <CardTitle>{report.title}</CardTitle>
                                    <p className="text-sm text-muted-foreground">Generated on {new Date(report.generated_at).toLocaleDateString()}</p>
                                </CardHeader>
                                <CardContent className="flex justify-between items-center">
                                    <Badge variant="outline">{report.type}</Badge>
                                    <div className="flex gap-2">
                                        <Button
                                            variant="outline"
                                            size="sm"
                                            onClick={() => handleDownloadReport(report.id)}
                                        >
                                            <Download className="h-4 w-4 mr-2" /> PDF
                                        </Button>
                                        <Button
                                            variant="outline"
                                            size="sm"
                                            onClick={() => handleDownloadReport(report.id)}
                                        >
                                            <Download className="h-4 w-4 mr-2" /> CSV
                                        </Button>
                                    </div>
                                </CardContent>
                            </Card>
                        ))}
                    </div>
                )}
            </Container>
        </div>
    );
}