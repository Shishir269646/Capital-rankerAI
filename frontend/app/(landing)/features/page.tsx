import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import {
    TrendingUp,
    Target,
    Users,
    BarChart3,
    Shield,
    Zap,
    FileText,
    Bell,
    Brain,
    Search,
    GitCompare,
    PieChart,
} from "lucide-react";
import Link from "next/link";

export default function FeaturesPage() {
    const features = [
        {
            icon: Brain,
            title: "AI-Powered Scoring",
            description: "Advanced machine learning algorithms evaluate deals across multiple dimensions",
            features: [
                "Market opportunity analysis",
                "Traction metrics evaluation",
                "Team quality assessment",
                "Financial health scoring",
            ],
        },
        {
            icon: Target,
            title: "Investment Thesis Matching",
            description: "Automatically match deals to your investment criteria and focus areas",
            features: [
                "Custom thesis creation",
                "Semantic similarity matching",
                "Real-time deal recommendations",
                "Thesis performance tracking",
            ],
        },
        {
            icon: Users,
            title: "Founder Evaluation",
            description: "Comprehensive founder background and capability analysis",
            features: [
                "Experience verification",
                "Education validation",
                "Track record analysis",
                "Red flag detection",
            ],
        },
        {
            icon: BarChart3,
            title: "Portfolio Analytics",
            description: "Track performance and ROI across your entire portfolio",
            features: [
                "Real-time valuations",
                "IRR calculations",
                "Performance benchmarking",
                "Exit scenario modeling",
            ],
        },
        {
            icon: GitCompare,
            title: "Deal Comparison",
            description: "Side-by-side comparison of multiple investment opportunities",
            features: [
                "Multi-deal analysis",
                "Visual comparisons",
                "Score breakdowns",
                "Export capabilities",
            ],
        },
        {
            icon: FileText,
            title: "Report Generation",
            description: "Automated investment memos and reports",
            features: [
                "Custom templates",
                "One-click generation",
                "PDF exports",
                "Shareable links",
            ],
        },
        {
            icon: Bell,
            title: "Smart Alerts",
            description: "Stay informed about important deal developments",
            features: [
                "Custom alert rules",
                "Email notifications",
                "Slack integration",
                "Priority flagging",
            ],
        },
        {
            icon: Shield,
            title: "Risk Assessment",
            description: "Identify potential risks and red flags early",
            features: [
                "Automated risk scoring",
                "Market risk analysis",
                "Competitive threat detection",
                "Financial health warnings",
            ],
        },
        {
            icon: PieChart,
            title: "Data Visualization",
            description: "Beautiful charts and graphs for better insights",
            features: [
                "Interactive dashboards",
                "Custom metrics",
                "Trend analysis",
                "Export to presentations",
            ],
        },
    ];

    return (
        <div>
            {/* Hero Section */}
            <section className="bg-gradient-to-br from-blue-50 to-indigo-100 py-20">
                <div className="container mx-auto px-6 text-center">
                    <Badge className="mb-4">Features</Badge>
                    <h1 className="text-5xl font-bold mb-6">
                        Everything You Need to
                        <br />
                        Evaluate Investments
                    </h1>
                    <p className="text-xl text-muted-foreground mb-8 max-w-2xl mx-auto">
                        Comprehensive tools powered by AI to streamline your entire
                        investment workflow
                    </p>
                    <Link href="/register">
                        <Button size="lg">Start Free Trial</Button>
                    </Link>
                </div>
            </section>

            {/* Features Grid */}
            <section className="py-20">
                <div className="container mx-auto px-6">
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
                        {features.map((feature, index) => (
                            <Card key={index} className="hover:shadow-lg transition-shadow">
                                <CardHeader>
                                    <feature.icon className="h-12 w-12 text-primary mb-4" />
                                    <CardTitle>{feature.title}</CardTitle>
                                    <CardDescription>{feature.description}</CardDescription>
                                </CardHeader>
                                <CardContent>
                                    <ul className="space-y-2">
                                        {feature.features.map((item, i) => (
                                            <li key={i} className="flex items-start gap-2 text-sm">
                                                <span className="text-primary mt-1">✓</span>
                                                <span>{item}</span>
                                            </li>
                                        ))}
                                    </ul>
                                </CardContent>
                            </Card>
                        ))}
                    </div>
                </div>
            </section>

            {/* CTA Section */}
            <section className="bg-primary text-white py-20">
                <div className="container mx-auto px-6 text-center">
                    <h2 className="text-3xl font-bold mb-4">
                        Ready to Get Started?
                    </h2>
                    <p className="text-lg mb-8 opacity-90 max-w-2xl mx-auto">
                        Join hundreds of VCs who are already using Capital Ranker to make
                        better investment decisions
                    </p>
                    <div className="flex items-center justify-center gap-4">
                        <Link href="/register">
                            <Button size="lg" variant="secondary">
                                Start Free Trial
                            </Button>
                        </Link>
                        <Link href="/pricing">
                            <Button size="lg" variant="outline" className="bg-transparent text-white border-white hover:bg-white/10">
                                View Pricing
                            </Button>
                        </Link>
                    </div>
                </div>
            </section>
        </div>
    );
}