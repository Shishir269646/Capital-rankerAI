"use client";

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";
import { Target, CheckCircle2 } from "lucide-react";

interface ThesisMatchScoreProps {
    matchScore: number;
    matchedCriteria: string[];
    semanticSimilarity: number;
}

export function ThesisMatchScore({
    matchScore,
    matchedCriteria,
    semanticSimilarity,
}: ThesisMatchScoreProps) {
    const getMatchLevel = (score: number) => {
        if (score >= 80) return { label: "Excellent Match", color: "text-green-600" };
        if (score >= 60) return { label: "Good Match", color: "text-blue-600" };
        if (score >= 40) return { label: "Fair Match", color: "text-yellow-600" };
        return { label: "Poor Match", color: "text-red-600" };
    };

    const matchLevel = getMatchLevel(matchScore);

    return (
        <Card>
            <CardHeader>
                <CardTitle className="flex items-center gap-2">
                    <Target className="h-5 w-5" />
                    Thesis Match Score
                </CardTitle>
            </CardHeader>
            <CardContent className="space-y-6">
                {/* Overall Match Score */}
                <div className="space-y-2">
                    <div className="flex items-center justify-between">
                        <span className="text-2xl font-bold">{matchScore}%</span>
                        <Badge className={matchLevel.color} variant="outline">
                            {matchLevel.label}
                        </Badge>
                    </div>
                    <Progress value={matchScore} className="h-2" />
                </div>

                {/* Semantic Similarity */}
                <div className="space-y-2">
                    <div className="flex items-center justify-between text-sm">
                        <span className="text-muted-foreground">Semantic Similarity</span>
                        <span className="font-medium">{semanticSimilarity}%</span>
                    </div>
                    <Progress value={semanticSimilarity} className="h-1" />
                </div>

                {/* Matched Criteria */}
                <div className="space-y-2">
                    <p className="text-sm font-medium">Matched Criteria</p>
                    <div className="space-y-2">
                        {matchedCriteria.map((criteria) => (
                            <div key={criteria} className="flex items-center gap-2 text-sm">
                                <CheckCircle2 className="h-4 w-4 text-green-600" />
                                <span>{criteria}</span>
                            </div>
                        ))}
                    </div>
                </div>
            </CardContent>
        </Card>
    );
}