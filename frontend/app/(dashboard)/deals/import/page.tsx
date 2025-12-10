"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { Header } from "@/components/layout/Header";
import { Container } from "@/components/layout/Container";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { useToast } from "@/components/ui/ToastProvider";
import { dealsApi } from "@/lib/api/deals.api";
import { getAccessToken } from "@/lib/auth/token";
import { Upload, Download } from "lucide-react";

export default function DealImportExportPage() {
    const router = useRouter();
    const { show: showCustomToast } = useToast();
    const [selectedFile, setSelectedFile] = useState<File | null>(null);
    const [importing, setImporting] = useState(false);
    const [exporting, setExporting] = useState(false);

    const handleFileChange = (event: React.ChangeEvent<HTMLInputElement>) => {
        if (event.target.files && event.target.files.length > 0) {
            setSelectedFile(event.target.files[0]);
        } else {
            setSelectedFile(null);
        }
    };

    const handleBulkImport = async () => {
        if (!selectedFile) {
            showCustomToast("Please select a file to import.", "error");
            return;
        }

        setImporting(true);
        const token = getAccessToken();
        if (!token) {
            showCustomToast("Authentication token not found.", "error");
            setImporting(false);
            return;
        }

        const formData = new FormData();
        formData.append("file", selectedFile);

        try {
            await dealsApi.bulkImportDeals(formData, token); // Assuming API takes FormData
            showCustomToast("Deals imported successfully!", "success");
            setSelectedFile(null);
            router.push("/deals");
        } catch (error: any) {
            const errorMessage = error.response?.data?.message || "Error importing deals.";
            showCustomToast(errorMessage, "error");
        } finally {
            setImporting(false);
        }
    };

    const handleExportDeals = async () => {
        setExporting(true);
        const token = getAccessToken();
        if (!token) {
            showCustomToast("Authentication token not found.", "error");
            setExporting(false);
            return;
        }

        try {
            const blob = await dealsApi.exportDeals(token); // Assuming API returns a blob
            const url = window.URL.createObjectURL(blob);
            const a = document.createElement('a');
            a.href = url;
            a.download = `deals_export_${Date.now()}.csv`; // Or .xlsx, depending on API
            document.body.appendChild(a);
            a.click();
            a.remove();
            showCustomToast("Deals exported successfully!", "success");
        } catch (error: any) {
            showCustomToast(`Error exporting deals: ${error.message || 'Unknown error'}`, "error");
        } finally {
            setExporting(false);
        }
    };

    return (
        <div>
            <Header
                title="Deal Import/Export"
                description="Manage bulk operations for deals"
                breadcrumbs={[
                    { label: "Dashboard", href: "/dashboard" },
                    { label: "Deals", href: "/deals" },
                    { label: "Import / Export" },
                ]}
            />

            <Container>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <Card>
                        <CardHeader>
                            <CardTitle>Import Deals</CardTitle>
                        </CardHeader>
                        <CardContent className="space-y-4">
                            <div>
                                <Label htmlFor="import-file">Select File (CSV/Excel)</Label>
                                <Input id="import-file" type="file" accept=".csv, .xlsx" onChange={handleFileChange} />
                            </div>
                            <Button onClick={handleBulkImport} disabled={importing || !selectedFile}>
                                {importing ? "Importing..." : <><Upload className="mr-2 h-4 w-4" /> Bulk Import Deals</>}
                            </Button>
                        </CardContent>
                    </Card>

                    <Card>
                        <CardHeader>
                            <CardTitle>Export Deals</CardTitle>
                        </CardHeader>
                        <CardContent className="space-y-4">
                            <p className="text-sm text-muted-foreground">Export all deals to a CSV/Excel file.</p>
                            <Button onClick={handleExportDeals} disabled={exporting}>
                                {exporting ? "Exporting..." : <><Download className="mr-2 h-4 w-4" /> Export All Deals</>}
                            </Button>
                        </CardContent>
                    </Card>
                </div>
            </Container>
        </div>
    );
}
