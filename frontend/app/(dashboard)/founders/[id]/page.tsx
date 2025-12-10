"use client";

import { useRouter } from "next/navigation";
import { useEffect, useState, useCallback } from "react";
import { Header } from "@/components/layout/Header";
import { Container } from "@/components/layout/Container";
import { Button } from "@/components/ui/button";
import { useToast } from "@/components/ui/ToastProvider";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { LoadingSpinner } from "@/components/shared/LoadingSpinner";
import { foundersApi } from "@/lib/api/founders.api";
import { getAccessToken } from "@/lib/auth/token";
import type { Founder } from "@/types/founder.types";
import { Edit, Trash2, TrendingUp } from "lucide-react";
import {
    AlertDialog,
    AlertDialogAction,
    AlertDialogCancel,
    AlertDialogContent,
    AlertDialogDescription,
    AlertDialogFooter,
    AlertDialogHeader,
    AlertDialogTitle,
    AlertDialogTrigger,
} from "@/components/ui/alert-dialog";


export default function FounderDetailsPage({ params }: { params: { id: string } }) {
    const router = useRouter();
    const { show: showCustomToast } = useToast();
    const founderId = params.id;

    const [founder, setFounder] = useState<Founder | null>(null);
    const [loading, setLoading] = useState(true);
    const [editing, setEditing] = useState(false);
    const [saving, setSaving] = useState(false);
    const [evaluating, setEvaluating] = useState(false);
    const [isDeleteDialogOpen, setIsDeleteDialogOpen] = useState(false);

    // Form states
    const [name, setName] = useState("");
    const [email, setEmail] = useState("");
    const [linkedinProfile, setLinkedinProfile] = useState("");
    const [bio, setBio] = useState("");

    const fetchFounder = useCallback(async () => {
        setLoading(true);
        const token = getAccessToken();
        if (!token) {
            showCustomToast("Authentication token not found.", "error");
            setLoading(false);
            return;
        }
        try {
            const response = await foundersApi.getFounderById(founderId, token);
            setFounder(response.data);
            setName(response.data.name);
            setEmail(response.data.email);
            setLinkedinProfile(response.data.linkedin_profile || "");
            setBio(response.data.bio || "");
        } catch (error) {
            showCustomToast("Error fetching founder details", "error");
        } finally {
            setLoading(false);
        }
    }, [founderId, showCustomToast]);

    useEffect(() => {
        if (founderId) {
            fetchFounder();
        }
    }, [founderId, fetchFounder]);

    const handleUpdateFounder = async () => {
        setSaving(true);
        const token = getAccessToken();
        if (!token) {
            showCustomToast("Authentication token not found.", "error");
            setSaving(false);
            return;
        }

        if (!name || !email) {
            showCustomToast("Founder name and email are required.", "error");
            setSaving(false);
            return;
        }

        try {
            const payload = {
                name,
                email,
                linkedin_profile: linkedinProfile,
                bio,
            };
            await foundersApi.updateFounder(founderId, payload, token);
            showCustomToast("Founder updated successfully!", "success");
            setEditing(false);
            fetchFounder(); // Re-fetch founder to update its details
        } catch (error: any) {
            const errorMessage = error.response?.data?.message || "Error updating founder.";
            showCustomToast(errorMessage, "error");
        } finally {
            setSaving(false);
        }
    };

    const handleDeleteFounder = async () => {
        if (!founderId) return;
        const token = getAccessToken();
        if (!token) {
            showCustomToast("Authentication token not found.", "error");
            return;
        }
        try {
            await foundersApi.deleteFounder(founderId, token);
            showCustomToast("Founder deleted successfully!", "success");
            router.push("/founders"); // Redirect to founders list after deletion
        } catch (error: any) {
            showCustomToast(`Error deleting founder: ${error.message || 'Unknown error'}`, "error");
        } finally {
            setIsDeleteDialogOpen(false);
        }
    };

    const handleEvaluateFounder = async () => {
        if (!founderId) return;
        setEvaluating(true);
        const token = getAccessToken();
        if (!token) {
            showCustomToast("Authentication token not found.", "error");
            setEvaluating(false);
            return;
        }
        try {
            // Assuming evaluateFounder returns some evaluation result or just success status
            await foundersApi.evaluateFounder(founderId, token);
            showCustomToast("Founder evaluated successfully!", "success");
            // Optionally, re-fetch founder if evaluation updates any fields
            fetchFounder();
        } catch (error: any) {
            showCustomToast(`Error evaluating founder: ${error.message || 'Unknown error'}`, "error");
        } finally {
            setEvaluating(false);
        }
    };


    if (loading) {
        return (
            <div className="flex items-center justify-center h-full">
                <LoadingSpinner size="lg" />
            </div>
        );
    }

    if (!founder) {
        return (
            <Container>
                <div className="text-center py-10">
                    <h2 className="text-2xl font-bold">Founder Not Found</h2>
                    <p className="text-muted-foreground">The founder you are looking for does not exist.</p>
                    <Button onClick={() => router.push("/founders")} className="mt-4">
                        Back to Founders
                    </Button>
                </div>
            </Container>
        );
    }

    return (
        <div>
            <Header
                title={founder.name}
                description={founder.bio || "Founder Profile"}
                breadcrumbs={[
                    { label: "Dashboard", href: "/dashboard" },
                    { label: "Founders", href: "/founders" },
                    { label: founder.name },
                ]}
                action={
                    <div className="flex gap-2">
                        <Button onClick={() => setEditing(!editing)} variant="outline">
                            <Edit className="mr-2 h-4 w-4" />
                            {editing ? "Cancel Edit" : "Edit Founder"}
                        </Button>
                        <Button onClick={handleEvaluateFounder} disabled={evaluating}>
                            {evaluating ? (
                                <>
                                    <LoadingSpinner size="sm" className="mr-2" />
                                    Evaluating...
                                </>
                            ) : (
                                <>
                                    <TrendingUp className="mr-2 h-4 w-4" />
                                    Evaluate Founder
                                </>
                            )}
                        </Button>
                        <AlertDialog open={isDeleteDialogOpen} onOpenChange={setIsDeleteDialogOpen}>
                            <AlertDialogTrigger asChild>
                                <Button variant="destructive">
                                    <Trash2 className="mr-2 h-4 w-4" />
                                    Delete Founder
                                </Button>
                            </AlertDialogTrigger>
                            <AlertDialogContent>
                                <AlertDialogHeader>
                                    <AlertDialogTitle>Are you absolutely sure?</AlertDialogTitle>
                                    <AlertDialogDescription>
                                        This action cannot be undone. This will permanently delete the founder &quot;{founder.name}&quot; and remove their data from our servers.
                                    </AlertDialogDescription>
                                </AlertDialogHeader>
                                <AlertDialogFooter>
                                    <AlertDialogCancel>Cancel</AlertDialogCancel>
                                    <AlertDialogAction onClick={handleDeleteFounder}>Continue</AlertDialogAction>
                                </AlertDialogFooter>
                            </AlertDialogContent>
                        </AlertDialog>
                    </div>
                }
            />

            <Container>
                <Card>
                    <CardHeader>
                        <CardTitle>Founder Information</CardTitle>
                    </CardHeader>
                    <CardContent className="space-y-4">
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                            <div>
                                <Label htmlFor="name">Name</Label>
                                <Input id="name" value={name} onChange={(e) => setName(e.target.value)} readOnly={!editing} />
                            </div>
                            <div>
                                <Label htmlFor="email">Email</Label>
                                <Input id="email" type="email" value={email} onChange={(e) => setEmail(e.target.value)} readOnly={!editing} />
                            </div>
                        </div>
                        <div>
                            <Label htmlFor="linkedin-profile">LinkedIn Profile</Label>
                            <Input id="linkedin-profile" value={linkedinProfile} onChange={(e) => setLinkedinProfile(e.target.value)} readOnly={!editing} />
                        </div>
                        <div>
                            <Label htmlFor="bio">Biography</Label>
                            <Textarea id="bio" value={bio} onChange={(e) => setBio(e.target.value)} readOnly={!editing} />
                        </div>

                        {editing && (
                            <Button onClick={handleUpdateFounder} disabled={saving}>
                                {saving ? "Saving..." : "Save Changes"}
                            </Button>
                        )}
                    </CardContent>
                </Card>
            </Container>
        </div>
    );
}