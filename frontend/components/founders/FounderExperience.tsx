"use client";

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { FounderExperience as FounderExperienceType } from "@/types/founder.types";
import { Briefcase, Calendar } from "lucide-react";
import { formatDate } from "@/lib/utils/format";

interface FounderExperienceProps {
    experience: FounderExperienceType[];
}

export function FounderExperience({ experience }: FounderExperienceProps) {
    return (
        <Card>
            <CardHeader>
                <CardTitle className="flex items-center gap-2">
                    <Briefcase className="h-5 w-5" />
                    Professional Experience
                </CardTitle>
            </CardHeader>
            <CardContent>
                <div className="space-y-6">
                    {experience.map((exp, index) => (
                        <div key={index} className="relative pl-6 border-l-2 border-muted pb-6 last:pb-0">
                            <div className="absolute -left-[9px] top-0 h-4 w-4 rounded-full bg-primary border-2 border-white" />

                            <div className="space-y-2">
                                <div>
                                                                         <h4 className="font-semibold">{exp.title}</h4>                                    <p className="text-sm text-muted-foreground">{exp.company}</p>
                                </div>

                                <div className="flex items-center gap-2 text-sm text-muted-foreground">
                                    <Calendar className="h-3 w-3" />
                                    <span>
                                        {formatDate(exp.start_date)} - {exp.end_date ? formatDate(exp.end_date) : "Present"}
                                    </span>
                                </div>

                                {exp.description && (
                                    <p className="text-sm">{exp.description}</p>
                                )}

                                {exp.achievements && exp.achievements.length > 0 && (
                                    <ul className="space-y-1">
                                        {exp.achievements.map((achievement, i) => (
                                            <li key={i} className="text-sm text-muted-foreground flex gap-2">
                                                <span className="text-primary">•</span>
                                                <span>{achievement}</span>
                                            </li>
                                        ))}
                                    </ul>
                                )}
                            </div>
                        </div>
                    ))}
                </div>
            </CardContent>
        </Card>
    );
}