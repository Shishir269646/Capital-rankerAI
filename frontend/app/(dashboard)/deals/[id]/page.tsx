"use client";

import { useEffect, useState } from "react";
import { useParams, useRouter } from "next/navigation";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Header } from "@/components/layout/Header";
import { Container } from "@/components/layout/Container";
import { DealScoreCard } from "@/components/deals/DealScoreCard";
import { DealMetrics } from "@/components/deals/DealMetrics";
import { FounderCard } from "@/components/founders/FounderCard";
import { LoadingSpinner } from "@/components/shared/LoadingSpinner";
import { ErrorMessage } from "@/components/shared/ErrorMessage";
import {
    ExternalLink,
    Edit,
    Trash2,
    TrendingUp,
    Calendar,
    MapPin,
    Users,
} from "lucide-react";
import { Deal } from "@/types/deal.types";
import { Founder } from "@/types/founder.types";
import { dealsApi } from "@/lib/api/deals.api";
import { formatCurrency, formatDate } from "@/lib/utils/format";
import { useToast } from "@/components/ui/use-toast";

export default function DealDetailPage() {
    const params = useParams();
    const router = useRouter();
    const { toast } = useToast();
    const dealId = params.id as string;

    const [deal, setDeal] = useState<Deal | null>(null);
    const [founders, setFounders] = useState<Founder[]>([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<string>("");
    const [scoring, setScoring] = useState(false);

    useEffect(() => {
        loadDeal();
    }, [dealId]);

    const loadDeal = async () => {
        try {
            setLoading(true);
            setError("");
            const data = await dealsApi.getDealById(dealId);
            setDeal(data);
            // Load founders if available
            if (data.founders && data.founders.length > 0) {
                // Load founder details
            }
        } catch (err: any) {
            setError(err.message || "Failed to load deal");
        } finally {
            setLoading(false);
        }
    };

    const handleScore = async () => {
        try {
            setScoring(true);
            // await scoringApi.scoreDeal(dealId);
            toast({
                title: "Success",
                description: "Deal scored successfully",
            });
            loadDeal();
        } catch (err: any) {
            toast({
                title: "Error",
                description: err.message || "Failed to score deal",
                variant: "destructive",
            });
        } finally {
            setScoring(false);
        }
    };

    if (loading) {
        return (
            <div className="flex items-center justify-center h-full">
                <LoadingSpinner size="lg" />
            </div>
        );
    }

    if (error || !deal) {
        return (
            <Container>
                <ErrorMessage message={error || "Deal not found"} onRetry={loadDeal} />
            </Container>
        );
    }

    return (
        <div>
            <Header
                title={deal.name}
                breadcrumbs={[
                    { label: "Dashboard", href: "/dashboard" },
                    { label: "Deals", href: "/deals" },
                    { label: deal.name },
                ]}
                action={
                    <div className="flex items-center gap-2">
                        {!deal.score && (
                            <Button onClick={handleScore} disabled={scoring}>
                                {scoring ? "Scoring..." : "Score Deal"}
                            </Button>
                        )}
                        <Button variant="outline" onClick={() => router.push(`/deals/${dealId}/edit`)}>
                            <Edit className="mr-2 h-4 w-4" />
                            Edit
                        </Button>
                        <Button variant="outline" className="text-destructive">
                            <Trash2 className="mr-2 h-4 w-4" />
                            Delete
                        </Button>
                    </div>
                }
            />

            <Container>
                <div className="space-y-6">
                    {/* Header Info */}
                    <div className="flex flex-wrap items-center gap-4">
                        <div className="flex flex-wrap gap-2">
                            {deal.sector.map((sector) => (
                                <Badge key={sector} variant="secondary">
                                    {sector}
                                </Badge>
                            ))}
                        </div>
                        <Badge>{deal.stage}</Badge>

                        {deal.location && (
                            <div className="flex items-center gap-1 text-sm text-muted-foreground">
                                <MapPin className="h-4 w-4" />
                                {deal.location}
                            </div>
                        )}

                        {deal.founded_year && (
                            <div className="flex items-center gap-1 text-sm text-muted-foreground">
                                <Calendar className="h-4 w-4" />
                                Founded {deal.founded_year}
                            </div>
                        )}

                        {deal.team_size && (
                            <div className="flex items-center gap-1 text-sm text-muted-foreground">
                                <Users className="h-4 w-4" />
                                {deal.team_size} employees
                            </div>
                        )}

                        {deal.website && (
                            <Button variant="ghost" size="sm" asChild>
                                <a href={deal.website} target="_blank" rel="noopener noreferrer">
                                    <ExternalLink className="mr-2 h-4 w-4" />
                                    Visit Website
                                </a>
                            </Button>
                        )}
                    </div>

                    {/* Score Card */}
                    {deal.score && <DealScoreCard score={deal.score} />}

                    {/* Key Metrics */}
                    <DealMetrics deal={deal} />

                    {/* Tabbed Content */}
                    <Tabs defaultValue="overview">
                        <TabsList>
                            <TabsTrigger value="overview">Overview</TabsTrigger>
                            <TabsTrigger value="founders">Founders</TabsTrigger>
                            <TabsTrigger value="funding">Funding History</TabsTrigger>
                            <TabsTrigger value="documents">Documents</TabsTrigger>
                        </TabsList>

                        <TabsContent value="overview" className="space-y-4">
                            <Card>
                                <CardHeader>
                                    <CardTitle>Description</CardTitle>
                                </CardHeader>
                                <CardContent>
                                    <p className="text-muted-foreground">{deal.description}</p>
                                </CardContent>
                            </Card>

                            <Card>
                                <CardHeader>
                                    <CardTitle>Additional Metrics</CardTitle>
                                </CardHeader>
                                <CardContent>
                                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                        {deal.metrics.customer_count && (
                                            <div>
                                                <p className="text-sm text-muted-foreground">Customers</p>
                                                <p className="text-2xl font-bold">{deal.metrics.customer_count.toLocaleString()}</p>
                                            </div>
                                        )}
                                        {deal.metrics.mrr && (
                                            <div>
                                                <p className="text-sm text-muted-foreground">MRR</p>
                                                <p className="text-2xl font-bold">{formatCurrency(deal.metrics.mrr)}</p>
                                            </div>
                                        )}
                                        {deal.metrics.arr && (
                                            <div>
                                                <p className="text-sm text-muted-foreground">ARR</p>
                                                <p className="text-2xl font-bold">{formatCurrency(deal.metrics.arr)}</p>
                                            </div>
                                        )}
                                        {deal.metrics.gross_margin && (
                                            <div>
                                                <p className="text-sm text-muted-foreground">Gross Margin</p>
                                                <p className="text-2xl font-bold">{deal.metrics.gross_margin}%</p>
                                            </div>
                                        )}
                                    </div>
                                </CardContent>
                            </Card>
                        </TabsContent>

                        <TabsContent value="founders">
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                {founders.length > 0 ? (
                                    founders.map((founder) => (
                                        <FounderCard key={founder.id} founder={founder} />
                                    ))
                                ) : (
                                    <p className="text-muted-foreground">No founder information available</p>
                                )}
                            </div>
                        </TabsContent>

                        <TabsContent value="funding">
                            {deal.funding_history && deal.funding_history.length > 0 ? (
                                <Card>
                                    <CardContent className="pt-6">
                                        <div className="space-y-4">
                                            {deal.funding_history.map((round) => (
                                                <div key={round.id} className="flex items-start gap-4 pb-4 border-b last:border-0">
                                                    <div className="flex-1">
                                                        <p className="font-semibold">{round.round}</p>
                                                        <p className="text-2xl font-bold">{formatCurrency(round.amount)}</p>
                                                        {round.lead_investor && (
                                                            <p className="text-sm text-muted-foreground">Lead: {round.lead_investor}</p>
                                                        )}
                                                    </div>
                                                    <div className="text-right">
                                                        <p className="text-sm text-muted-foreground">{formatDate(round.date)}</p>
                                                        {round.valuation && (
                                                            <p className="text-sm">Valuation: {formatCurrency(round.valuation)}</p>
                                                        )}
                                                    </div>
                                                </div>
                                            ))}
                                        </div>
                                    </CardContent>
                                </Card>
                            ) : (
                                <p className="text-muted-foreground">No funding history available</p>
                            )}
                        </TabsContent>

                        <TabsContent value="documents">
                            <p className="text-muted-foreground">Documents section coming soon</p>
                        </TabsContent>
                    </Tabs>
                </div>
            </Container>
        </div>
    );
}
