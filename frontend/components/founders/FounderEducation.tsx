import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { GraduationCap } from "lucide-react";
import { Education } from "@/types/founder.types";

interface FounderEducationProps {
    education: Education[];
}

export function FounderEducation({ education }: FounderEducationProps) {
    return (
        <Card>
            <CardHeader>
                <CardTitle className="flex items-center gap-2">
                    <GraduationCap className="h-5 w-5" />
                    Education
                </CardTitle>
            </CardHeader>
            <CardContent>
                <div className="space-y-4">
                    {education.map((edu, index) => (
                        <div key={index} className="border-b pb-4 last:border-0 last:pb-0">
                            <h4 className="font-semibold">
                                {edu.degree} in {edu.field}
                            </h4>
                            <p className="text-sm text-muted-foreground">{edu.institution}</p>
                            <p className="text-sm text-muted-foreground">
                                Class of {edu.graduation_year}
                            </p>
                        </div>
                    ))}
                </div>
            </CardContent>
        </Card>
    );
}
