"use client";

import { Header } from "@/components/layout/Header";
import { Container } from "@/components/layout/Container";
import { DealForm } from "@/components/deals/DealForm";
import { useState } from "react";
import { useRouter } from "next/navigation";
import { useToast } from "@/components/ui/use-toast";

export default function NewDealPage() {
    const [submitting, setSubmitting] = useState(false);
    const router = useRouter();
    const { toast } = useToast();

    const handleCreateDeal = async (data: any) => {
        setSubmitting(true);
        try {
            // Simulate API call
            await new Promise((resolve) => setTimeout(resolve, 1500));
            console.log("New Deal Data:", data);
            toast({
                title: "Deal Created",
                description: "Your new deal has been successfully added.",
            });
            router.push("/deals");
        } catch (error) {
            toast({
                title: "Error",
                description: "Failed to create deal. Please try again.",
                variant: "destructive",
            });
        } finally {
            setSubmitting(false);
        }
    };

    return (
        <div>
            <Header
                title="Add New Deal"
                description="Create a new investment opportunity"
                breadcrumbs={[
                    { label: "Dashboard", href: "/dashboard" },
                    { label: "Deals", href: "/deals" },
                    { label: "Add New" },
                ]}
            />
            <Container>
                <DealForm onSubmit={handleCreateDeal} submitting={submitting} />
            </Container>
        </div>
    );
}
