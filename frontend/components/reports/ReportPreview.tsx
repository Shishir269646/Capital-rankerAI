import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Separator } from "@/components/ui/separator";

export function ReportPreview() {
    return (
        <Card>
            <CardHeader>
                <div className="flex items-center justify-between">
                    <CardTitle>Report Preview</CardTitle>
                    <Badge>Draft</Badge>
                </div>
            </CardHeader>
            <CardContent className="space-y-6">
                <div>
                    <h3 className="font-semibold text-lg mb-2">Executive Summary</h3>
                    <p className="text-sm text-muted-foreground">
                        This report provides an overview of our investment activities for Q4 2024...
                    </p>
                </div>

                <Separator />

                <div>
                    <h3 className="font-semibold text-lg mb-2">Key Metrics</h3>
                    <div className="grid grid-cols-2 gap-4">
                        <div>
                            <p className="text-sm text-muted-foreground">Total Deals Evaluated</p>
                            <p className="text-2xl font-bold">156</p>
                        </div>
                        <div>
                            <p className="text-sm text-muted-foreground">Investments Made</p>
                            <p className="text-2xl font-bold">12</p>
                        </div>
                    </div>
                </div>

                <Separator />

                <div>
                    <h3 className="font-semibold text-lg mb-2">Portfolio Performance</h3>
                    <p className="text-sm text-muted-foreground">
                        Our portfolio has grown by 24% this quarter...
                    </p>
                </div>
            </CardContent>
        </Card>
    );
}
