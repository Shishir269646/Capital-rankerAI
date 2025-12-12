"use client";

import { useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { AppDispatch, RootState } from "@/store";
import { fetchAllReports, downloadReport, selectGeneratedReports, selectReportsLoading, selectReportsError } from "@/store/slices/reportsSlice";
import { Header } from "@/components/layout/Header";
import { Container } from "@/components/layout/Container";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { useRouter } from "next/navigation";
import { useToast } from "@/components/ui/ToastProvider";
import { LoadingSpinner } from "@/components/shared/LoadingSpinner";
import { EmptyState } from "@/components/shared/EmptyState";
import { Badge } from "@/components/ui/badge";
import { FileText, Plus, Download } from "lucide-react";
import { Report } from "@/types/report.types";

export default function ReportsPage() {
    const router = useRouter();
    const dispatch = useDispatch<AppDispatch>();
    const { show: showCustomToast } = useToast();

    const reports = useSelector(selectGeneratedReports);
    const loading = useSelector(selectReportsLoading);
    const error = useSelector(selectReportsError);

    useEffect(() => {
        dispatch(fetchAllReports(undefined));
    }, [dispatch]);

    useEffect(() => {
        if (error) {
            showCustomToast(`Error: ${error}`, "error");
        }
    }, [error, showCustomToast]);

    const handleDownloadReport = async (reportId: string, format: "pdf" | "csv" | "xlsx") => {
        const resultAction = await dispatch(downloadReport({ reportId, format }));
        if (downloadReport.fulfilled.match(resultAction)) {
            showCustomToast("Report download started", "success");
        } else {
            showCustomToast(`Failed to download report: ${resultAction.payload || 'Unknown error'}`, "error");
        }
    };

    if (loading && reports.length === 0) {
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
                        {reports.map((report: Report) => (
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
                                            onClick={() => handleDownloadReport(report.id, 'pdf')}
                                        >
                                            <Download className="h-4 w-4 mr-2" /> PDF
                                        </Button>
                                        <Button
                                            variant="outline"
                                            size="sm"
                                            onClick={() => handleDownloadReport(report.id, 'csv')}
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