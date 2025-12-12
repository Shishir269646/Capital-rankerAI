"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { Header } from "@/components/layout/Header";
import { Container } from "@/components/layout/Container";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Button } from "@/components/ui/button";
import { useToast } from "@/components/ui/ToastProvider";
import { thesisApi } from "@/lib/api/thesis.api";
import { getAccessToken } from "@/lib/auth/token";
import { LoadingSpinner } from "@/components/shared/LoadingSpinner";
import { Save } from "lucide-react";
import type { InvestorThesis } from "@/types/thesis.types";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Checkbox } from "@/components/ui/checkbox";

export default function EditThesisPage({ params }: { params: { id: string } }) {
    const router = useRouter();
    const { show: showCustomToast } = useToast();
    const thesisId = params.id;

    const [thesis, setThesis] = useState<InvestorThesis | null>(null);
    const [title, setTitle] = useState("");
    const [description, setDescription] = useState("");
    const [investmentStage, setInvestmentStage] = useState<string>("");
    const [industryFocus, setIndustryFocus] = useState("");
    const [isActive, setIsActive] = useState(false);
    const [loading, setLoading] = useState(true);
    const [saving, setSaving] = useState(false);

    useEffect(() => {
        const fetchThesisDetails = async () => {
            setLoading(true);
            const token = getAccessToken();
            if (!token) {
                showCustomToast("Authentication token not found.", "error");
                setLoading(false);
                return;
            }
            try {
                const response = await thesisApi.getInvestorThesisById(thesisId, token);
                setThesis(response.data);
                setTitle(response.data.title);
                setDescription(response.data.thesis_text);
                setInvestmentStage(response.data.focus_areas.stages[0]);
                setIndustryFocus(response.data.focus_areas.sectors.join(', '));
                setIsActive(response.data.is_active);
            } catch (error) {
                showCustomToast("Error fetching thesis details", "error");
                router.push("/thesis"); // Redirect if thesis not found or error
            } finally {
                setLoading(false);
            }
        };

        if (thesisId) {
            fetchThesisDetails();
        }
    }, [thesisId, router, showCustomToast]);

    const handleUpdateThesis = async () => {
        setSaving(true);
        const token = getAccessToken();
        if (!token) {
            showCustomToast("Authentication token not found.", "error");
            setSaving(false);
            return;
        }

        if (!title || !description || !investmentStage || !industryFocus) {
            showCustomToast("All fields are required.", "error");
            setSaving(false);
            return;
        }

        try {
            const payload = {
                title,
                description,
                investment_stage: investmentStage,
                industry_focus: industryFocus.split(',').map(s => s.trim()),
                is_active: isActive,
            };
            await thesisApi.updateThesis(thesisId, payload, token);
            showCustomToast("Investment thesis updated successfully!", "success");
            router.push(`/thesis/${thesisId}`); // Navigate back to the thesis details page
        } catch (error: any) {
            const errorMessage = error.response?.data?.message || "Error updating investment thesis.";
            showCustomToast(errorMessage, "error");
        } finally {
            setSaving(false);
        }
    };

    if (loading) {
        return (
            <div className="flex items-center justify-center h-full">
                <LoadingSpinner size="lg" />
            </div>
        );
    }

    if (!thesis) {
        return (
            <Container>
                <div className="text-center py-10">
                    <h2 className="text-2xl font-bold">Thesis Not Found</h2>
                    <p className="text-muted-foreground">The investment thesis you are trying to edit does not exist.</p>
                    <Button onClick={() => router.push("/thesis")} className="mt-4">
                        Back to Thesis
                    </Button>
                </div>
            </Container>
        );
    }

    return (
        <div>
            <Header
                title={`Edit: ${thesis.title}`}
                description="Modify the details of this investment thesis"
                breadcrumbs={[
                    { label: "Dashboard", href: "/dashboard" },
                    { label: "Investment Thesis", href: "/thesis" },
                    { label: thesis.title, href: `/thesis/${thesisId}` },
                    { label: "Edit" },
                ]}
            />

            <Container>
                <Card>
                    <CardHeader>
                        <CardTitle>Thesis Information</CardTitle>
                    </CardHeader>
                    <CardContent className="space-y-4">
                        <div>
                            <Label htmlFor="title">Title</Label>
                            <Input
                                id="title"
                                value={title}
                                onChange={(e) => setTitle(e.target.value)}
                                placeholder="e.g., AI-driven SaaS for SMBs"
                            />
                        </div>
                        <div>
                            <Label htmlFor="description">Description</Label>
                            <Textarea
                                id="description"
                                value={description}
                                onChange={(e) => setDescription(e.target.value)}
                                placeholder="Detailed description of your investment focus"
                            />
                        </div>
                        <div>
                            <Label htmlFor="investment-stage">Investment Stage</Label>
                            <Select onValueChange={setInvestmentStage} value={investmentStage}>
                                <SelectTrigger>
                                    <SelectValue placeholder="Select stage" />
                                </SelectTrigger>
                                <SelectContent>
                                    <SelectItem value="pre-seed">Pre-Seed</SelectItem>
                                    <SelectItem value="seed">Seed</SelectItem>
                                    <SelectItem value="series-a">Series A</SelectItem>
                                    <SelectItem value="series-b">Series B</SelectItem>
                                    <SelectItem value="series-c">Series C</SelectItem>
                                    <SelectItem value="growth">Growth</SelectItem>
                                </SelectContent>
                            </Select>
                        </div>
                        <div>
                            <Label htmlFor="industry-focus">Industry Focus (comma-separated)</Label>
                            <Input
                                id="industry-focus"
                                value={industryFocus}
                                onChange={(e) => setIndustryFocus(e.target.value)}
                                placeholder="e.g., Artificial Intelligence, SaaS, Fintech"
                            />
                        </div>
                        <div className="flex items-center space-x-2">
                            <Checkbox
                                id="is-active"
                                checked={isActive}
                                onCheckedChange={(checked) => setIsActive(checked as boolean)}
                            />
                            <Label htmlFor="is-active">Active Thesis</Label>
                        </div>
                        <Button onClick={handleUpdateThesis} disabled={saving}>
                            {saving ? "Saving..." : <><Save className="mr-2 h-4 w-4" /> Save Changes</>}
                        </Button>
                    </CardContent>
                </Card>
            </Container>
        </div>
    );
}
