"use client";

import { useState, useEffect } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { LoadingSpinner } from "../shared/LoadingSpinner";
import { EmptyState } from "../shared/EmptyState";
import { Target } from "lucide-react";
import { Deal } from "@/types/deal.types";
import Link from "next/link";

interface MatchedDealsProps {
    thesisId: string;
}

export function MatchedDeals({ thesisId }: MatchedDealsProps) {
    const [deals, setDeals] = useState<Array<Deal & { matchScore: number }>>([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        // Mock data - replace with actual API call
        setTimeout(() => {
            setDeals([
                // Mock matched deals
            ]);
            setLoading(false);
        }, 1000);
    }, [thesisId]);

    if (loading) {
        return (
            <Card>
                <CardContent className="py-12" >
                    <LoadingSpinner />
                </CardContent>
            </Card>
        );
    }

    return (
        <Card>
            <CardHeader>
                <CardTitle>Matched Deals({deals.length}) </CardTitle>
            </CardHeader>
            <CardContent>
                {
                    deals.length === 0 ? (
                        <EmptyState
                            icon={Target}
                            title="No matched deals"
                            description="No deals currently match this investment thesis"
                        />
                    ) : (
                        <div className="space-y-4" >
                            {
                                deals.map((deal) => (
                                    <div
                                        key={deal.id}
                                        className="flex items-center justify-between p-4 border rounded-lg"
                                    >
                                        <div className="flex-1" >
                                            <h4 className="font-semibold" > {deal.name} </h4>
                                            < p className="text-sm text-muted-foreground" >
                                                {deal.sector.join(", ")}
                                            </p>
                                        </div>

                                        < div className="flex items-center gap-4" >
                                            <div className="text-right" >
                                                <p className="text-sm text-muted-foreground" > Match Score </p>
                                                < Badge variant={deal.matchScore >= 80 ? "default" : "secondary"} >
                                                    {deal.matchScore} %
                                                </Badge>
                                            </div>
                                            < Link href={`/deals/${deal.id}`} >
                                                <Button variant="outline" size="sm" >
                                                    View Deal
                                                </Button>
                                            </Link>
                                        </div>
                                    </div>
                                ))
                            }
                        </div>
                    )
                }
            </CardContent>
        </Card>
    );
}
