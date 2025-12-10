"use client";

import { Button } from "@/components/ui/button";
import { useRouter } from "next/navigation";
import { Header } from "@/components/layout/Header";
import { Container } from "@/components/layout/Container";
import { EmptyState } from "@/components/shared/EmptyState";
import { Search } from "lucide-react";
import { useEffect, useState } from "react";
import { getAccessToken } from "@/lib/auth/token";
import { useToast } from "@/components/ui/ToastProvider";

export default function LandingPage() {
    const router = useRouter();
    const { show: showCustomToast } = useToast();
    const [token, setToken] = useState<string | null>(null);

    useEffect(() => {
        setToken(getAccessToken());
    }, []);

    const handleAction = () => {
        if (token) {
            router.push("/dashboard");
        } else {
            router.push("/login");
        }
    };

    return (
        <div>
            <Header
                title="Welcome to Capital Ranker"
                description="Your ultimate platform for investment deal flow management and scoring."
                breadcrumbs={[]}
                action={
                    <Button onClick={handleAction}>
                        {token ? "Go to Dashboard" : "Get Started"}
                    </Button>
                }
            />
            <Container>
                <EmptyState
                    icon={Search}
                    title="Start your investment journey"
                    description="Capital Ranker helps you discover, evaluate, and manage investment opportunities efficiently."
                    action={{
                        label: token ? "View Dashboard" : "Sign Up Now",
                        onClick: handleAction,
                    }}
                />
            </Container>
        </div>
    );
}
