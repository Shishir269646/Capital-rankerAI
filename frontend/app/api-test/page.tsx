"use client";

import { Button } from "@/components/ui/button";
import { Container } from "@/components/layout/Container";
import { Header } from "@/components/layout/Header";
import { ArrowLeft } from "lucide-react";
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import { dealsApi } from "@/lib/api/deals.api";
import { getAccessToken } from "@/lib/auth/token";
import { useToast } from "@/components/ui/ToastProvider";

export default function APITestPage() {
    const router = useRouter();
    const { show: showCustomToast } = useToast();
    const [token, setToken] = useState<string | null>(null);

    useEffect(() => {
        setToken(getAccessToken());
    }, []);

    const handleLogin = () => {
        // Simulate login and set a token
        const fakeToken = "fake-jwt-token"; // In a real app, this would come from a login API call
        localStorage.setItem("accessToken", fakeToken);
        setToken(fakeToken);
        showCustomToast("Logged in with fake token", "success");
    };

    const handleLogout = () => {
        localStorage.removeItem("accessToken");
        setToken(null);
        showCustomToast("Logged out", "info");
    };

    const handleFetchDeals = async () => {
        if (!token) {
            showCustomToast("No token found. Please login.", "error");
            return;
        }
        try {
            const response = await dealsApi.getAllDeals(token);
            console.log("Deals fetched:", response);
            showCustomToast(`Fetched ${response.results.length} deals!`, "success");
        } catch (error: any) {
            console.error("Error fetching deals:", error);
            showCustomToast(`Error fetching deals: ${error.message || 'Unknown error'}`, "error");
        }
    };

    return (
        <div>
            <Header
                title="API Test Page"
                description="Test various API endpoints"
                breadcrumbs={[{ label: "Home", href: "/" }, { label: "API Test" }]}
                action={
                    <Button variant="outline" onClick={() => router.back()}>
                        <ArrowLeft className="mr-2 h-4 w-4" />
                        Go Back
                    </Button>
                }
            />
            <Container>
                <div className="space-y-4">
                    <h2 className="text-xl font-semibold">Authentication</h2>
                    <p>Current Token: {token ? token.substring(0, 20) + '...' : 'None'}</p>
                    <div className="flex gap-2">
                        <Button onClick={handleLogin}>Simulate Login</Button>
                        <Button onClick={handleLogout} variant="destructive">Logout</Button>
                    </div>

                    <h2 className="text-xl font-semibold mt-8">Deals API</h2>
                    <Button onClick={handleFetchDeals} disabled={!token}>Fetch Deals</Button>
                </div>
            </Container>
        </div>
    );
}