"use client";

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Label } from "@/components/ui/label";
import { Switch } from "@/components/ui/switch";
import { Separator } from "@/components/ui/separator";

export function AlertSettings() {
    return (
        <Card>
            <CardHeader>
                <CardTitle>Alert Preferences</CardTitle>
                <CardDescription>
                    Configure how you want to receive alerts
                </CardDescription>
            </CardHeader>
            <CardContent className="space-y-6">
                <div className="flex items-center justify-between">
                    <div className="space-y-0.5">
                        <Label htmlFor="deal-scored">Deal Scored</Label>
                        <p className="text-sm text-muted-foreground">
                            Get notified when a deal is scored
                        </p>
                    </div>
                    <Switch id="deal-scored" defaultChecked />
                </div>

                <Separator />

                <div className="flex items-center justify-between">
                    <div className="space-y-0.5">
                        <Label htmlFor="thesis-match">Thesis Match</Label>
                        <p className="text-sm text-muted-foreground">
                            Alert when a deal matches your thesis
                        </p>
                    </div>
                    <Switch id="thesis-match" defaultChecked />
                </div>

                <Separator />

                <div className="flex items-center justify-between">
                    <div className="space-y-0.5">
                        <Label htmlFor="red-flags">Red Flags</Label>
                        <p className="text-sm text-muted-foreground">
                            Notify about founder red flags
                        </p>
                    </div>
                    <Switch id="red-flags" defaultChecked />
                </div>

                <Separator />

                <div className="flex items-center justify-between">
                    <div className="space-y-0.5">
                        <Label htmlFor="portfolio-updates">Portfolio Updates</Label>
                        <p className="text-sm text-muted-foreground">
                            Updates about portfolio companies
                        </p>
                    </div>
                    <Switch id="portfolio-updates" defaultChecked />
                </div>
            </CardContent>
        </Card>
    );
}