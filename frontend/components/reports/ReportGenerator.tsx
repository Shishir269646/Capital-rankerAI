"use client";

import { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { FormDatePicker } from "../forms/FormDatePicker";
import { Checkbox } from "@/components/ui/checkbox";
import { Loader2 } from "lucide-react";

interface ReportGeneratorProps {
    onGenerate: (data: any) => Promise<void>;
    generating: boolean;
}

export function ReportGenerator({ onGenerate, generating }: ReportGeneratorProps) {
    const [reportType, setReportType] = useState("");
    const [dateFrom, setDateFrom] = useState<Date>();
    const [dateTo, setDateTo] = useState<Date>();
    const [includeSections, setIncludeSections] = useState({
        overview: true,
        deals: true,
        scoring: true,
        portfolio: true,
        recommendations: true,
    });

    const handleGenerate = async () => {
        await onGenerate({
            reportType,
            dateFrom,
            dateTo,
            sections: includeSections,
        });
    };

    return (
        <Card>
            <CardHeader>
                <CardTitle>Report Configuration</CardTitle>
            </CardHeader>
            <CardContent className="space-y-6">
                <div className="space-y-2">
                    <Label>Report Type</Label>
                    <Select value={reportType} onValueChange={setReportType}>
                        <SelectTrigger>
                            <SelectValue placeholder="Select report type" />
                        </SelectTrigger>
                        <SelectContent>
                            <SelectItem value="quarterly">Quarterly Review</SelectItem>
                            <SelectItem value="portfolio">Portfolio Summary</SelectItem>
                            <SelectItem value="deal-analysis">Deal Analysis</SelectItem>
                            <SelectItem value="investment-memo">Investment Memo</SelectItem>
                        </SelectContent>
                    </Select>
                </div>

                <div className="grid grid-cols-2 gap-4">
                    <FormDatePicker label="From Date" value={dateFrom} onChange={setDateFrom} />
                    <FormDatePicker label="To Date" value={dateTo} onChange={setDateTo} />
                </div>

                <div className="space-y-3">
                    <Label>Include Sections</Label>
                    <div className="space-y-2">
                        {Object.entries(includeSections).map(([key, checked]) => (
                            <div key={key} className="flex items-center space-x-2">
                                <Checkbox
                                    id={key}
                                    checked={checked}
                                    onCheckedChange={(value) =>
                                        setIncludeSections({ ...includeSections, [key]: value as boolean })
                                    }
                                />
                                <Label htmlFor={key} className="cursor-pointer capitalize">
                                    {key.replace("_", " ")}
                                </Label>
                            </div>
                        ))}
                    </div>
                </div>

                <Button onClick={handleGenerate} disabled={!reportType || generating} className="w-full">
                    {generating && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
                    {generating ? "Generating Report..." : "Generate Report"}
                </Button>
            </CardContent>
        </Card>
    );
}
