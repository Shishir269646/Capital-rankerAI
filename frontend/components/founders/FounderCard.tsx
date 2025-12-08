"use client";

import { Card, CardContent } from "@/components/ui/card";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Linkedin, Mail } from "lucide-react";
import { Founder } from "@/types/founder.types";
import Link from "next/link";

interface FounderCardProps {
    founder: Founder;
}

export function FounderCard({ founder }: FounderCardProps) {
    const getScoreColor = (score: number) => {
        if (score >= 80) return "text-green-600";
        if (score >= 60) return "text-yellow-600";
        return "text-red-600";
    };

    return (
        <Card>
            <CardContent className="pt-6">
                <div className="flex items-start gap-4">
                    <Avatar className="h-16 w-16">
                        <AvatarImage src={founder.profile_image} alt={founder.name} />
                        <AvatarFallback>{founder.name.charAt(0)}</AvatarFallback>
                    </Avatar>

                    <div className="flex-1 space-y-2">
                        <div>
                            <Link href={`/founders/${founder.id}`}>
                                <h3 className="font-semibold text-lg hover:text-primary cursor-pointer">
                                    {founder.name}
                                </h3>
                            </Link>
                            <p className="text-sm text-muted-foreground">{founder.role}</p>
                        </div>

                        {founder.evaluation && (
                            <div className="flex items-center gap-2">
                                <Badge variant="outline" className={getScoreColor(founder.evaluation.overall_score)}>
                                    Score: {founder.evaluation.overall_score}
                                </Badge>
                                {founder.red_flags && founder.red_flags.length > 0 && (
                                    <Badge variant="destructive">
                                        {founder.red_flags.length} Red Flags
                                    </Badge>
                                )}
                            </div>
                        )}

                        <div className="flex items-center gap-2">
                            {founder.linkedin && (
                                <Button variant="ghost" size="sm" asChild>
                                    <a href={founder.linkedin} target="_blank" rel="noopener noreferrer">
                                        <Linkedin className="h-4 w-4" />
                                    </a>
                                </Button>
                            )}
                            {founder.email && (
                                <Button variant="ghost" size="sm" asChild>
                                    <a href={`mailto:${founder.email}`}>
                                        <Mail className="h-4 w-4" />
                                    </a>
                                </Button>
                            )}
                        </div>
                    </div>
                </div>

                {founder.bio && (
                    <p className="text-sm text-muted-foreground mt-4 line-clamp-3">
                        {founder.bio}
                    </p>
                )}

                <Link href={`/founders/${founder.id}`}>
                    <Button variant="outline" size="sm" className="w-full mt-4">
                        View Full Profile
                    </Button>
                </Link>
            </CardContent>
        </Card>
    );
}
