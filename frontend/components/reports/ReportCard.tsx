import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { FileText, Download, Eye } from "lucide-react";
import { formatDate } from "@/lib/utils/format";

interface ReportCardProps {
    report: {
        id: string;
        title: string;
        type: string;
        created_at: string;
        status: "ready" | "generating" | "failed";
    };
}

export function ReportCard({ report }: ReportCardProps) {
    return (
        <Card>
            <CardContent className="pt-6">
                <div className="flex items-start gap-4">
                    <div className="p-3 bg-blue-100 rounded-lg">
                        <FileText className="h-6 w-6 text-blue-600" />
                    </div>

                    <div className="flex-1 space-y-2">
                        <div>
                            <h3 className="font-semibold">{report.title}</h3>
                            <p className="text-sm text-muted-foreground">{report.type}</p>
                        </div>

                        <div className="flex items-center gap-2">
                            <Badge variant={
                                report.status === "ready" ? "default" :
                                    report.status === "generating" ? "secondary" : "destructive"
                            }>
                                {report.status}
                            </Badge>
                            <span className="text-xs text-muted-foreground">
                                {formatDate(report.created_at)}
                            </span>
                        </div>

                        {report.status === "ready" && (
                            <div className="flex items-center gap-2">
                                <Button variant="outline" size="sm">
                                    <Eye className="mr-2 h-4 w-4" />
                                    Preview
                                </Button>
                                <Button variant="outline" size="sm">
                                    <Download className="mr-2 h-4 w-4" />
                                    Download
                                </Button>
                            </div>
                        )}
                    </div>
                </div>
            </CardContent>
        </Card>
    );
}
