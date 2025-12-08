import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Progress } from "@/components/ui/progress";
import { Badge } from "@/components/ui/badge";
import { FounderEvaluation } from "@/types/founder.types";

interface FounderScoreProps {
    evaluation: FounderEvaluation;
}

export function FounderScore({ evaluation }: FounderScoreProps) {
    const getScoreColor = (score: number) => {
        if (score >= 80) return "text-green-600";
        if (score >= 60) return "text-yellow-600";
        return "text-red-600";
    };

    return (
        <Card>
            <CardHeader>
                <CardTitle>Founder Evaluation</CardTitle>
            </CardHeader>
            <CardContent className="space-y-6">
                {/* Overall Score */}
                <div>
                    <div className="flex items-center justify-between mb-2">
                        <span className="font-semibold">Overall Score</span>
                        <span className={`text-2xl font-bold ${getScoreColor(evaluation.overall_score)}`}>
                            {evaluation.overall_score}
                        </span>
                    </div>
                    <Progress value={evaluation.overall_score} className="h-2" />
                </div>

                {/* Score Breakdown */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div>
                        <div className="flex items-center justify-between mb-2">
                            <span className="text-sm">Experience</span>
                            <span className="font-medium">{evaluation.experience_score}</span>
                        </div>
                        <Progress value={evaluation.experience_score} />
                    </div>

                    <div>
                        <div className="flex items-center justify-between mb-2">
                            <span className="text-sm">Education</span>
                            <span className="font-medium">{evaluation.education_score}</span>
                        </div>
                        <Progress value={evaluation.education_score} />
                    </div>

                    <div>
                        <div className="flex items-center justify-between mb-2">
                            <span className="text-sm">Track Record</span>
                            <span className="font-medium">{evaluation.track_record_score}</span>
                        </div>
                        <Progress value={evaluation.track_record_score} />
                    </div>

                    <div>
                        <div className="flex items-center justify-between mb-2">
                            <span className="text-sm">Leadership</span>
                            <span className="font-medium">{evaluation.leadership_score}</span>
                        </div>
                        <Progress value={evaluation.leadership_score} />
                    </div>
                </div>
            </CardContent>
        </Card>
    );
}