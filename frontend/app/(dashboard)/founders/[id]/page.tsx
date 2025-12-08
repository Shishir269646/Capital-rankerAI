"use client";

import { useEffect, useState } from "react";
import { useParams } from "next/navigation";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Progress } from "@/components/ui/progress";
import { Header } from "@/components/layout/Header";
import { Container } from "@/components/layout/Container";
import { FounderExperience } from "@/components/founders/FounderExperience";
import { RedFlagsList } from "@/components/founders/RedFlagsList";
import { LoadingSpinner } from "@/components/shared/LoadingSpinner";
import { Linkedin, Mail, GraduationCap } from "lucide-react";
import { Founder } from "@/types/founder.types";
import { foundersApi } from "@/lib/api/founders.api";

export default function FounderDetailPage() {
    const params = useParams();
    const founderId = params.id as string;
    const [founder, setFounder] = useState<Founder | null>(null);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        loadFounder();
    }, [founderId]);

    const loadFounder = async () => {
        try {
            setLoading(true);
            const data = await foundersApi.getFounderById(founderId);
            setFounder(data);
        } catch (error) {
            console.error("Failed to load founder:", error);
        } finally {
            setLoading(false);
        }
    };

    if (loading) {
        return (
            <div className="flex items-center justify-center h-full" >
                <LoadingSpinner size="lg" />
            </div>
        );
    }

    if (!founder) {
        return (
            <Container>
                <p>Founder not found </p>
            </Container>
        );
    }

    return (
        <div>
            <Header
                title={founder.name}
                breadcrumbs={
                    [
                        { label: "Dashboard", href: "/dashboard" },
                        { label: "Founders", href: "/founders" },
                        { label: founder.name },
                    ]}
            />

            <Container>
                <div className="space-y-6" >
                    {/* Profile Header */}
                    < Card >
                        <CardContent className="pt-6" >
                            <div className="flex items-start gap-6" >
                                <Avatar className="h-24 w-24" >
                                    <AvatarImage src={founder.profile_image} alt={founder.name} />
                                    <AvatarFallback className="text-2xl" >
                                        {founder.name.charAt(0)}
                                    </AvatarFallback>
                                </Avatar>

                                < div className="flex-1 space-y-3" >
                                    <div>
                                        <h2 className="text-2xl font-bold" > {founder.name} </h2>
                                        < p className="text-muted-foreground" > {founder.role} </p>
                                    </div>

                                    {
                                        founder.bio && (
                                            <p className="text-muted-foreground" > {founder.bio} </p>
                                        )
                                    }

                                    <div className="flex items-center gap-2" >
                                        {
                                            founder.linkedin && (
                                                <Button variant="outline" size="sm" asChild>
                                                    <a
                                                        href={founder.linkedin}
                                                        target="_blank"
                                                        rel="noopener noreferrer"
                                                    >
                                                        <Linkedin className="mr-2 h-4 w-4" />
                                                        LinkedIn
                                                    </a>
                                                </Button>
                                            )
                                        }
                                        {
                                            founder.email && (
                                                <Button variant="outline" size="sm" asChild >
                                                    <a href={`mailto:${founder.email}`}>
                                                        <Mail className="mr-2 h-4 w-4" />
                                                        Email
                                                    </a>
                                                </Button>
                                            )
                                        }
                                    </div>
                                </div>
                            </div>
                        </CardContent>
                    </Card>

                    {/* Evaluation Score */}
                    {
                        founder.evaluation && (
                            <Card>
                                <CardHeader>
                                    <CardTitle>Founder Evaluation </CardTitle>
                                </CardHeader>
                                < CardContent className="space-y-6" >
                                    <div>
                                        <div className="flex items-center justify-between mb-2" >
                                            <span className="font-semibold" > Overall Score </span>
                                            < span className="text-2xl font-bold" >
                                                {founder.evaluation.overall_score}
                                            </span>
                                        </div>
                                        < Progress value={founder.evaluation.overall_score} className="h-2" />
                                    </div>

                                    < div className="grid grid-cols-1 md:grid-cols-2 gap-4" >
                                        <div>
                                            <div className="flex items-center justify-between mb-2" >
                                                <span className="text-sm" > Experience </span>
                                                < span className="font-medium" >
                                                    {founder.evaluation.experience_score}
                                                </span>
                                            </div>
                                            < Progress value={founder.evaluation.experience_score} />
                                        </div>

                                        < div >
                                            <div className="flex items-center justify-between mb-2" >
                                                <span className="text-sm" > Education </span>
                                                < span className="font-medium" >
                                                    {founder.evaluation.education_score}
                                                </span>
                                            </div>
                                            < Progress value={founder.evaluation.education_score} />
                                        </div>

                                        < div >
                                            <div className="flex items-center justify-between mb-2" >
                                                <span className="text-sm" > Track Record </span>
                                                < span className="font-medium" >
                                                    {founder.evaluation.track_record_score}
                                                </span>
                                            </div>
                                            < Progress value={founder.evaluation.track_record_score} />
                                        </div>

                                        < div >
                                            <div className="flex items-center justify-between mb-2" >
                                                <span className="text-sm" > Leadership </span>
                                                < span className="font-medium" >
                                                    {founder.evaluation.leadership_score}
                                                </span>
                                            </div>
                                            < Progress value={founder.evaluation.leadership_score} />
                                        </div>
                                    </div>
                                </CardContent>
                            </Card>
                        )
                    }

                    {/* Experience */}
                    {
                        founder.experience && founder.experience.length > 0 && (
                            <FounderExperience experiences={founder.experience} />
                        )
                    }

                    {/* Education */}
                    {
                        founder.education && founder.education.length > 0 && (
                            <Card>
                                <CardHeader>
                                    <CardTitle className="flex items-center gap-2" >
                                        <GraduationCap className="h-5 w-5" />
                                        Education
                                    </CardTitle>
                                </CardHeader>
                                < CardContent >
                                    <div className="space-y-4" >
                                        {
                                            founder.education.map((edu, index) => (
                                                <div key={index} className="border-b pb-4 last:border-0 last:pb-0" >
                                                    <h4 className="font-semibold" > {edu.degree} in {edu.field} </h4>
                                                    < p className="text-sm text-muted-foreground" > {edu.institution} </p>
                                                    < p className="text-sm text-muted-foreground" >
                                                        Class of {edu.graduation_year}
                                                    </p>
                                                </div>
                                            ))
                                        }
                                    </div>
                                </CardContent>
                            </Card>
                        )
                    }

                    {/* Red Flags */}
                    {
                        founder.red_flags && founder.red_flags.length > 0 && (
                            <RedFlagsList redFlags={founder.red_flags} />
                        )
                    }
                </div>
            </Container>
        </div>
    );
}
