"use client";

import { useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { AlertCircle, RefreshCcw, Home } from "lucide-react";
import Link from "next/link";

export default function Error({
    error,
    reset,
}: {
    error: Error & { digest?: string };
    reset: () => void;
}) {
    useEffect(() => {
        console.error(error);
    }, [error]);

    return (
        <div className="min-h-screen flex items-center justify-center bg-gray-50 px-4">
            <Card className="max-w-md w-full">
                <CardHeader className="text-center">
                    <div className="flex justify-center mb-4">
                        <div className="h-16 w-16 rounded-full bg-red-100 flex items-center justify-center">
                            <AlertCircle className="h-8 w-8 text-red-600" />
                        </div>
                    </div>
                    <CardTitle className="text-2xl">Something went wrong!</CardTitle>
                    <CardDescription>
                        {error.message || "An unexpected error occurred"}
                    </CardDescription>
                </CardHeader>
                <CardContent className="space-y-4">
                    <div className="flex flex-col gap-2">
                        <Button onClick={reset} className="w-full">
                            <RefreshCcw className="mr-2 h-4 w-4" />
                            Try Again
                        </Button>
                        <Link href="/dashboard">
                            <Button variant="outline" className="w-full">
                                <Home className="mr-2 h-4 w-4" />
                                Go to Dashboard
                            </Button>
                        </Link>
                    </div>
                    {error.digest && (
                        <p className="text-xs text-muted-foreground text-center">
                            Error ID: {error.digest}
                        </p>
                    )}
                </CardContent>
            </Card>
        </div>
    );
}