import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { TrendingUp, TrendingDown } from "lucide-react";
import { formatCurrency } from "@/lib/utils/currency";
import { formatDate } from "@/lib/utils/format";
import Link from "next/link";

interface PortfolioCardProps {
    company: {
        id: string;
        name: string;
        sector: string;
        invested_amount: number;
        current_value: number;
        invested_date: string;
        status: "active" | "exited";
    };
}

export function PortfolioCard({ company }: PortfolioCardProps) {
    const gain = company.current_value - company.invested_amount;
    const gainPercentage = (gain / company.invested_amount) * 100;
    const isPositive = gain >= 0;

    return (
        <Card className="hover:shadow-lg transition-shadow">
            <CardContent className="pt-6">
                <div className="space-y-4">
                    <div className="flex items-start justify-between">
                        <div>
                            <h3 className="font-semibold text-lg">{company.name}</h3>
                            <Badge variant="secondary" className="mt-1">
                                {company.sector}
                            </Badge>
                        </div>
                        <Badge variant={company.status === "active" ? "default" : "secondary"}>
                            {company.status}
                        </Badge>
                    </div>

                    <div className="space-y-2">
                        <div className="flex justify-between text-sm">
                            <span className="text-muted-foreground">Invested</span>
                            <span className="font-medium">{formatCurrency(company.invested_amount)}</span>
                        </div>
                        <div className="flex justify-between text-sm">
                            <span className="text-muted-foreground">Current Value</span>
                            <span className="font-medium">{formatCurrency(company.current_value)}</span>
                        </div>
                        <div className="flex justify-between text-sm">
                            <span className="text-muted-foreground">Unrealized Gain</span>
                            <span className={`font-medium flex items-center gap-1 ${isPositive ? "text-green-600" : "text-red-600"}`}>
                                {isPositive ? <TrendingUp className="h-3 w-3" /> : <TrendingDown className="h-3 w-3" />}
                                {formatCurrency(Math.abs(gain))} ({gainPercentage.toFixed(1)}%)
                            </span>
                        </div>
                    </div>

                    <div className="text-xs text-muted-foreground">
                        Invested on {formatDate(company.invested_date)}
                    </div>

                    <Link href={`/portfolio/${company.id}`}>
                        <Button variant="outline" className="w-full">
                            View Details
                        </Button>
                    </Link>
                </div>
            </CardContent>
        </Card>
    );
}
