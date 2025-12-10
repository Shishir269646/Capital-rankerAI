"use client";

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";
import { Score } from "@/types/scoring.types";
import { TrendingUp, TrendingDown, Target, AlertCircle } from "lucide-react";

interface DealScoreCardProps {
    score: Score;
}

export function DealScoreCard({ score }: DealScoreCardProps) {
    const getScoreGrade = (score: number) => {
        if (score >= 90) return { grade: "A+", color: "text-green-600", bg: "bg-green-50" };
        if (score >= 80) return { grade: "A", color: "text-green-600", bg: "bg-green-50" };
        if (score >= 70) return { grade: "B+", color: "text-blue-600", bg: "bg-blue-50" };
        if (score >= 60) return { grade: "B", color: "text-yellow-600", bg: "bg-yellow-50" };
        return { grade: "C", color: "text-red-600", bg: "bg-red-50" };
    };

    const getRecommendationConfig = (rec: string) => {
        switch (rec) {
            case "invest":
                return { label: "Strong Invest", icon: TrendingUp, variant: "default" as const };
            case "strong-consider":
                return { label: "Consider", icon: Target, variant: "secondary" as const };
            case "consider":
                return { label: "Review", icon: AlertCircle, variant: "secondary" as const };
            default:
                return { label: "Pass", icon: TrendingDown, variant: "destructive" as const };
        }
    };

    const scoreGrade = getScoreGrade(score.investment_fit_score);
    const recommendation = getRecommendationConfig(score.detailed_analysis.recommendation);
    const RecommendationIcon = recommendation.icon;

    return (
        <Card>
            <CardHeader>
                <CardTitle>Investment Fit Score </CardTitle>
            </CardHeader>
            < CardContent className="space-y-6" >
                {/* Main Score Display */}
                < div className="flex items-center justify-between" >
                    <div className="space-y-1" >
                        <div className="flex items-end gap-2" >
                            <span className="text-5xl font-bold" > {score.investment_fit_score} </span>
                            < span className="text-2xl text-muted-foreground mb-1" > /100</span >
                        </div>
                        < div className="flex items-center gap-2" >
                            <Badge className={`${scoreGrade.bg} ${scoreGrade.color} border-0`}>
                                Grade {scoreGrade.grade}
                            </Badge>
                            < span className="text-sm text-muted-foreground" >
                                {score.confidence} % confidence
                            </span>
                        </div>
                    </div>

                    {/* Recommendation Badge */}
                    <Badge variant={recommendation.variant} className="h-fit px-4 py-2" >
                        <RecommendationIcon className="mr-2 h-4 w-4" />
                        {recommendation.label}
                    </Badge>
                </div>

                {/* Score Breakdown */}
                <div className="space-y-4" >
                    <h4 className="font-semibold text-sm" > Score Breakdown </h4>

                    < div className="space-y-3" >
                        <div className="space-y-1" >
                            <div className="flex items-center justify-between text-sm" >
                                <span>Market Opportunity </span>
                                < span className="font-medium" > {score.breakdown.market_score} </span>
                            </div>
                            < Progress value={score.breakdown.market_score} />
                        </div>

                        < div className="space-y-1" >
                            <div className="flex items-center justify-between text-sm" >
                                <span>Traction & Metrics </span>
                                < span className="font-medium" > {score.breakdown.traction_score} </span>
                            </div>
                            < Progress value={score.breakdown.traction_score} />
                        </div>

                        < div className="space-y-1" >
                            <div className="flex items-center justify-between text-sm" >
                                <span>Team Quality </span>
                                < span className="font-medium" > {score.breakdown.team_score} </span>
                            </div>
                            < Progress value={score.breakdown.team_score} />
                        </div>

                        < div className="space-y-1" >
                            <div className="flex items-center justify-between text-sm" >
                                <span>Financial Health </span>
                                < span className="font-medium" > {score.breakdown.financial_score} </span>
                            </div>
                            < Progress value={score.breakdown.financial_score} />
                        </div>
                    </div>
                </div>

                {/* Key Insights */}
                {
                    (score.detailed_analysis.strengths.length > 0 || score.detailed_analysis.weaknesses.length > 0) && (
                        <div className="space-y-2" >
                            <h4 className="font-semibold text-sm" > Key Insights </h4>
                            < ul className="space-y-1" >
                                {score.detailed_analysis.strengths.map((insight, index) => (
                                    <li key={`strength-${index}`} className="flex items-start gap-2 text-sm">
                                        <TrendingUp className="h-4 w-4 text-green-500 shrink-0" />
                                        <span>{insight}</span>
                                    </li>
                                ))}
                                {score.detailed_analysis.weaknesses.map((insight, index) => (
                                    <li key={`weakness-${index}`} className="flex items-start gap-2 text-sm">
                                        <TrendingDown className="h-4 w-4 text-red-500 shrink-0" />
                                        <span>{insight}</span>
                                    </li>
                                ))}
                            </ul>
                        </div>
                    )
                }
            </CardContent>
        </Card>
    );
}
