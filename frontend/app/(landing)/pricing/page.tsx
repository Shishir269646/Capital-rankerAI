import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Check, X } from "lucide-react";
import Link from "next/link";

export default function PricingPage() {
    const plans = [
        {
            name: "Starter",
            price: "$99",
            description: "Perfect for individual investors",
            features: [
                { name: "Up to 50 deals/month", included: true },
                { name: "AI-powered scoring", included: true },
                { name: "Basic analytics", included: true },
                { name: "Email support", included: true },
                { name: "1 user", included: true },
                { name: "Investment thesis matching", included: false },
                { name: "Advanced analytics", included: false },
                { name: "API access", included: false },
            ],
            cta: "Start Free Trial",
            popular: false,
        },
        {
            name: "Professional",
            price: "$299",
            description: "For small VC firms",
            features: [
                { name: "Up to 200 deals/month", included: true },
                { name: "AI-powered scoring", included: true },
                { name: "Advanced analytics", included: true },
                { name: "Priority support", included: true },
                { name: "Up to 5 users", included: true },
                { name: "Investment thesis matching", included: true },
                { name: "Custom reports", included: true },
                { name: "API access", included: false },
            ],
            cta: "Start Free Trial",
            popular: true,
        },
        {
            name: "Enterprise",
            price: "Custom",
            description: "For large VC firms",
            features: [
                { name: "Unlimited deals", included: true },
                { name: "AI-powered scoring", included: true },
                { name: "Advanced analytics", included: true },
                { name: "Dedicated support", included: true },
                { name: "Unlimited users", included: true },
                { name: "Investment thesis matching", included: true },
                { name: "Custom reports", included: true },
                { name: "API access", included: true },
            ],
            cta: "Contact Sales",
            popular: false,
        },
    ];

    return (
        <div>
            {/* Hero Section */}
            <section className="bg-gradient-to-br from-blue-50 to-indigo-100 py-20">
                <div className="container mx-auto px-6 text-center">
                    <h1 className="text-5xl font-bold mb-6">Simple, Transparent Pricing</h1>
                    <p className="text-xl text-muted-foreground max-w-2xl mx-auto">
                        Choose the plan that's right for your investment needs.
                        All plans include a 14-day free trial.
                    </p>
                </div>
            </section>

            {/* Pricing Cards */}
            <section className="py-20">
                <div className="container mx-auto px-6">
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-8 max-w-6xl mx-auto">
                        {plans.map((plan, index) => (
                            <Card
                                key={index}
                                className={`relative ${plan.popular
                                        ? "border-primary shadow-xl scale-105"
                                        : ""
                                    }`}
                            >
                                {plan.popular && (
                                    <Badge className="absolute -top-3 left-1/2 transform -translate-x-1/2">
                                        Most Popular
                                    </Badge>
                                )}
                                <CardHeader className="text-center pb-8">
                                    <CardTitle className="text-2xl">{plan.name}</CardTitle>
                                    <CardDescription>{plan.description}</CardDescription>
                                    <div className="mt-4">
                                        <span className="text-4xl font-bold">{plan.price}</span>
                                        {plan.price !== "Custom" && (
                                            <span className="text-muted-foreground">/month</span>
                                        )}
                                    </div>
                                </CardHeader>
                                <CardContent className="space-y-6">
                                    <ul className="space-y-3">
                                        {plan.features.map((feature, i) => (
                                            <li key={i} className="flex items-center gap-2">
                                                {feature.included ? (
                                                    <Check className="h-5 w-5 text-green-600 shrink-0" />
                                                ) : (
                                                    <X className="h-5 w-5 text-gray-300 shrink-0" />
                                                )}
                                                <span
                                                    className={
                                                        feature.included
                                                            ? ""
                                                            : "text-muted-foreground"
                                                    }
                                                >
                                                    {feature.name}
                                                </span>
                                            </li>
                                        ))}
                                    </ul>

                                    <Link
                                        href={
                                            plan.cta === "Contact Sales"
                                                ? "/contact"
                                                : "/register"
                                        }
                                    >
                                        <Button
                                            className="w-full"
                                            variant={plan.popular ? "default" : "outline"}
                                        >
                                            {plan.cta}
                                        </Button>
                                    </Link>
                                </CardContent>
                            </Card>
                        ))}
                    </div>
                </div>
            </section>

            {/* FAQ Section */}
            <section className="bg-gray-50 py-20">
                <div className="container mx-auto px-6">
                    <div className="max-w-3xl mx-auto">
                        <h2 className="text-3xl font-bold text-center mb-12">
                            Frequently Asked Questions
                        </h2>
                        <div className="space-y-6">
                            <Card>
                                <CardHeader>
                                    <CardTitle className="text-lg">
                                        Can I change plans later?
                                    </CardTitle>
                                </CardHeader>
                                <CardContent>
                                    <p className="text-muted-foreground">
                                        Yes, you can upgrade or downgrade your plan at any time.
                                        Changes will be reflected in your next billing cycle.
                                    </p>
                                </CardContent>
                            </Card>

                            <Card>
                                <CardHeader>
                                    <CardTitle className="text-lg">
                                        What payment methods do you accept?
                                    </CardTitle>
                                </CardHeader>
                                <CardContent>
                                    <p className="text-muted-foreground">
                                        We accept all major credit cards, debit cards, and wire
                                        transfers for Enterprise plans.
                                    </p>
                                </CardContent>
                            </Card>

                            <Card>
                                <CardHeader>
                                    <CardTitle className="text-lg">
                                        Is there a setup fee?
                                    </CardTitle>
                                </CardHeader>
                                <CardContent>
                                    <p className="text-muted-foreground">
                                        No, there are no setup fees. You only pay the monthly
                                        subscription fee.
                                    </p>
                                </CardContent>
                            </Card>
                        </div>
                    </div>
                </div>
            </section>
        </div>
    );
}
