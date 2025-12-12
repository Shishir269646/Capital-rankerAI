"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { Header } from "@/components/layout/Header";
import { Container } from "@/components/layout/Container";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Button } from "@/components/ui/button";
import { useToast } from "@/components/ui/ToastProvider";
import { reportsApi } from "@/lib/api/reports.api";
import { getAccessToken } from "@/lib/auth/token";
import { Plus } from "lucide-react";
import { GenerateReportPayload, Report } from "@/types/report.types";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";

export default function GenerateReportPage() {
    const router = useRouter();
    const { show: showCustomToast } = useToast();
    const [reportType, setReportType] = useState<Report['type']>('deal_summary');
    const [startDate, setStartDate] = useState("");
    const [endDate, setEndDate] = useState("");
    const [reportTitle, setReportTitle] = useState("");
    const [loading, setLoading] = useState(false);

    const handleGenerateReport = async () => {
        setLoading(true);
        const token = getAccessToken();
        if (!token) {
            showCustomToast("Authentication token not found.", "error");
            setLoading(false);
            return;
        }

        if (!reportType || !reportTitle) {
            showCustomToast("Report type and title are required.", "error");
            setLoading(false);
            return;
        }

        try {
            const payload: GenerateReportPayload = {
                reportType: reportType,
                format: 'pdf', // Assuming default format
                params: {
                    title: reportTitle,
                    dateRange: { // Changed to dateRange object
                        start_date: startDate, // Send as string directly
                        end_date: endDate,   // Send as string directly
                    },
                    // Add other report specific parameters collected by the form
                },
            };
            await reportsApi.requestReportGeneration(payload, token);
            showCustomToast("Report generation requested successfully!", "success");
            router.push("/reports"); // Navigate back to the reports list
        } catch (error: any) {
            const errorMessage = error.response?.data?.message || "Error requesting report generation.";
            showCustomToast(errorMessage, "error");
        } finally {
            setLoading(false);
        }
    };

    return (
        <div>
            <Header
                title="Generate New Report"
                description="Configure and request a new investment report"
                breadcrumbs={[
                    { label: "Dashboard", href: "/dashboard" },
                    { label: "Reports", href: "/reports" },
                    { label: "Generate" },
                ]}
            />

            <Container>
                <Card>
                    <CardHeader>
                        <CardTitle>Report Parameters</CardTitle>
                    </CardHeader>
                    <CardContent className="space-y-4">
                        <div>
                            <Label htmlFor="report-title">Report Title</Label>
                            <Input
                                id="report-title"
                                value={reportTitle}
                                onChange={(e) => setReportTitle(e.target.value)}
                                placeholder="e.g., Q3 Performance Review"
                            />
                        </div>
                        <div>
                            <Label htmlFor="report-type">Report Type</Label>
                            <Select onValueChange={(value: Report['type']) => setReportType(value)} value={reportType}>
                                <SelectTrigger>
                                    <SelectValue placeholder="Select a report type" />
                                </SelectTrigger>
                                <SelectContent>
                                    <SelectItem value="performance">Performance Report</SelectItem>
                                    <SelectItem value="deal-flow">Deal Flow Analysis</SelectItem>
                                    <SelectItem value="portfolio-summary">Portfolio Summary</SelectItem>
                                    {/* Add more report types as needed */}
                                </SelectContent>
                            </Select>
                        </div>
                        <div>
                            <Label htmlFor="start-date">Start Date</Label>
                            <Input
                                id="start-date"
                                type="date"
                                value={startDate}
                                onChange={(e) => setStartDate(e.target.value)}
                            />
                        </div>
                        <div>
                            <Label htmlFor="end-date">End Date</Label>
                            <Input
                                id="end-date"
                                type="date"
                                value={endDate}
                                onChange={(e) => setEndDate(e.target.value)}
                            />
                        </div>
                        {/* Add more parameters as per your requestReportGeneration payload */}
                        <Button onClick={handleGenerateReport} disabled={loading}>
                            {loading ? "Generating..." : <><Plus className="mr-2 h-4 w-4" /> Request Generation</>}
                        </Button>
                    </CardContent>
                </Card>
            </Container>
        </div>
    );
}