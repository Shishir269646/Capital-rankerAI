"use client";

import { useState } from "react";
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { Upload, Download, CheckCircle2, AlertCircle } from "lucide-react";
import { useToast } from "@/components/ui/ToastProvider";

interface DealImportDialogProps {
    open: boolean;
    onOpenChange: (open: boolean) => void;
}

export function DealImportDialog({ open, onOpenChange }: DealImportDialogProps) {
    const { show: showCustomToast } = useToast();
    const [file, setFile] = useState<File | null>(null);
    const [importing, setImporting] = useState(false);
    const [results, setResults] = useState<{ success: number; failed: number } | null>(null);

    const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const selectedFile = e.target.files?.[0];
        if (selectedFile) {
            setFile(selectedFile);
            setResults(null);
        }
    };

    const handleImport = async () => {
        if (!file) return;

        try {
            setImporting(true);
            // Simulate import
            await new Promise(resolve => setTimeout(resolve, 2000));
            setResults({ success: 45, failed: 3 });
            showCustomToast("Import completed: Your deals have been imported successfully", "success");
        } catch (error) {
            showCustomToast("Import failed: Failed to import deals", "error");
        } finally {
            setImporting(false);
        }
    };

    const downloadTemplate = () => {
        const template = `name,description,sector,stage,revenue,revenue_growth_rate\nExample Startup,"A revolutionary platform",Fintech,seed,1000000,150`;
        const blob = new Blob([template], { type: "text/csv" });
        const url = window.URL.createObjectURL(blob);
        const a = document.createElement("a");
        a.href = url;
        a.download = "deals_template.csv";
        a.click();
    };

    return (
        <Dialog open={open} onOpenChange={onOpenChange}>
            <DialogContent className="max-w-2xl">
                <DialogHeader>
                    <DialogTitle>Import Deals</DialogTitle>
                    <DialogDescription>
                        Upload a CSV file to bulk import deals
                    </DialogDescription>
                </DialogHeader>

                <div className="space-y-4">
                    <Button onClick={downloadTemplate} variant="outline" className="w-full">
                        <Download className="mr-2 h-4 w-4" />
                        Download CSV Template
                    </Button>

                    <div className="border-2 border-dashed rounded-lg p-8 text-center">
                        <input type="file" accept=".csv" onChange={handleFileChange} className="hidden" id="csv-file" />
                        <label htmlFor="csv-file" className="cursor-pointer">
                            <Upload className="mx-auto h-12 w-12 text-gray-400 mb-4" />
                            <p className="text-sm font-medium">Click to upload CSV</p>
                            <p className="text-xs text-muted-foreground mt-1">CSV file up to 10MB</p>
                        </label>
                    </div>

                    {file && (
                        <Alert>
                            <CheckCircle2 className="h-4 w-4" />
                            <AlertDescription>{file.name} ({(file.size / 1024).toFixed(2)} KB)</AlertDescription>
                        </Alert>
                    )}

                    {results && (
                        <Alert>
                            <AlertCircle className="h-4 w-4" />
                            <AlertDescription>
                                Imported: {results.success} successful, {results.failed} failed
                            </AlertDescription>
                        </Alert>
                    )}

                    <div className="flex justify-end gap-4">
                        <Button variant="outline" onClick={() => onOpenChange(false)}>
                            Cancel
                        </Button>
                        <Button onClick={handleImport} disabled={!file || importing}>
                            {importing ? "Importing..." : "Import"}
                        </Button>
                    </div>
                </div>
            </DialogContent>
        </Dialog>
    );
}
