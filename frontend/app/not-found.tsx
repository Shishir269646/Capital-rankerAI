"use client";

import { useRouter } from "next/navigation";
import { Header } from "@/components/layout/Header";
import { Container } from "@/components/layout/Container";
import { Button } from "@/components/ui/button";
import { XCircle } from "lucide-react";

export default function NotFound() {
    const router = useRouter();

    return (
        <Container>
            <div className="flex flex-col items-center justify-center py-20">
                <XCircle className="h-24 w-24 text-red-500 mb-6" />
                <h1 className="text-4xl font-bold text-gray-800 mb-3">404 - Page Not Found</h1>
                <p className="text-lg text-gray-600 mb-8">
                    Oops! The page you are looking for does not exist.
                </p>
                <Button variant="outline" onClick={() => router.push("/dashboard")} className="w-full max-w-sm">
                    Go to Dashboard
                </Button>
                <Button variant="outline" onClick={() => window.history.back()} className="w-full max-w-sm mt-4">
                    Go Back
                </Button>
            </div>
        </Container>
    );
}