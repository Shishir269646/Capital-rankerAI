import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Users, Target, TrendingUp, Award } from "lucide-react";

export default function AboutPage() {
    const values = [
        {
            icon: Target,
            title: "Mission-Driven",
            description: "Empowering VCs with AI to make better investment decisions",
        },
        {
            icon: TrendingUp,
            title: "Innovation First",
            description: "Constantly improving our AI models and platform",
        },
        {
            icon: Users,
            title: "Customer-Centric",
            description: "Built with and for venture capitalists",
        },
        {
            icon: Award,
            title: "Excellence",
            description: "Committed to the highest standards of quality",
        },
    ];

    const team = [
        {
            name: "Sarah Johnson",
            role: "CEO & Co-founder",
            bio: "Former Partner at Sequoia Capital with 15+ years in VC",
        },
        {
            name: "Michael Chen",
            role: "CTO & Co-founder",
            bio: "Ex-Google AI Research, PhD in Machine Learning from MIT",
        },
        {
            name: "Emily Rodriguez",
            role: "Head of Product",
            bio: "Built investment platforms at Goldman Sachs and Bloomberg",
        },
        {
            name: "David Kim",
            role: "Head of Data Science",
            bio: "Previously led ML teams at OpenAI and DeepMind",
        },
    ];

    return (
        <div>
            {/* Hero Section */}
            <section className="bg-gradient-to-br from-blue-50 to-indigo-100 py-20">
                <div className="container mx-auto px-6 text-center">
                    <h1 className="text-5xl font-bold mb-6">About Capital Ranker</h1>
                    <p className="text-xl text-muted-foreground max-w-3xl mx-auto">
                        We're on a mission to transform venture capital with AI-powered insights,
                        helping investors make smarter, faster, and more confident decisions.
                    </p>
                </div>
            </section>

            {/* Story Section */}
            <section className="py-20">
                <div className="container mx-auto px-6">
                    <div className="max-w-3xl mx-auto">
                        <h2 className="text-3xl font-bold mb-6">Our Story</h2>
                        <div className="space-y-4 text-muted-foreground">
                            <p>
                                Capital Ranker was founded in 2022 by a team of venture capitalists and
                                AI researchers who saw firsthand how overwhelming the deal evaluation
                                process had become.
                            </p>
                            <p>
                                With thousands of startups seeking funding and limited time to evaluate
                                each opportunity, investors needed a better way to identify the most
                                promising deals and make data-driven decisions.
                            </p>
                            <p>
                                Today, Capital Ranker is used by over 200 VC firms worldwide, helping
                                them evaluate more than 10,000 deals annually and making the investment
                                process more efficient and effective.
                            </p>
                        </div>
                    </div>
                </div>
            </section>

            {/* Values Section */}
            <section className="bg-gray-50 py-20">
                <div className="container mx-auto px-6">
                    <div className="text-center mb-12">
                        <h2 className="text-3xl font-bold mb-4">Our Values</h2>
                        <p className="text-muted-foreground max-w-2xl mx-auto">
                            The principles that guide everything we do
                        </p>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
                        {values.map((value, index) => (
                            <Card key={index}>
                                <CardHeader>
                                    <value.icon className="h-10 w-10 text-primary mb-2" />
                                    <CardTitle className="text-lg">{value.title}</CardTitle>
                                </CardHeader>
                                <CardContent>
                                    <p className="text-sm text-muted-foreground">{value.description}</p>
                                </CardContent>
                            </Card>
                        ))}
                    </div>
                </div>
            </section>

            {/* Team Section */}
            <section className="py-20">
                <div className="container mx-auto px-6">
                    <div className="text-center mb-12">
                        <h2 className="text-3xl font-bold mb-4">Our Team</h2>
                        <p className="text-muted-foreground max-w-2xl mx-auto">
                            Meet the people building the future of venture capital
                        </p>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
                        {team.map((member, index) => (
                            <Card key={index}>
                                <CardHeader>
                                    <div className="h-20 w-20 rounded-full bg-gradient-to-br from-blue-400 to-indigo-600 mb-4" />
                                    <CardTitle className="text-lg">{member.name}</CardTitle>
                                    <p className="text-sm text-primary">{member.role}</p>
                                </CardHeader>
                                <CardContent>
                                    <p className="text-sm text-muted-foreground">{member.bio}</p>
                                </CardContent>
                            </Card>
                        ))}
                    </div>
                </div>
            </section>
        </div>
    );
}
