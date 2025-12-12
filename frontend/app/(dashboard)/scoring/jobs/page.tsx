"use client";

import { useEffect, useState, useCallback } from "react";
import { Header } from "@/components/layout/Header";
import { Container } from "@/components/layout/Container";
import { Button } from "@/components/ui/button";
import { useToast } from "@/components/ui/ToastProvider";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { LoadingSpinner } from "@/components/shared/LoadingSpinner";
import { scoringApi } from "@/lib/api/scoring.api";
import { getAccessToken } from "@/lib/auth/token";
import { Zap } from "lucide-react";
import { EmptyState } from "@/components/shared/EmptyState";

// Define a simple interface for a batch scoring job status
interface BatchScoringJobStatus {
    id: string;
    status: 'pending' | 'in_progress' | 'completed' | 'failed';
    started_at: string;
    completed_at?: string;
    progress?: number; // e.g., 0-100
    details?: string;
}

export default function BatchScoringJobsPage() {
    const { show: showCustomToast } = useToast();
    const [jobs, setJobs] = useState<BatchScoringJobStatus[]>([]);
    const [loading, setLoading] = useState(true);

    const fetchJobs = useCallback(async () => {
        setLoading(true);
        const token = getAccessToken();
        if (!token) {
            showCustomToast("Authentication token not found.", "error");
            setLoading(false);
            return;
        }

        try {
            const response = await scoringApi.getAllBatchScoringJobStatuses(token);
            setJobs(response.data); // Assuming 'data' directly contains the array of jobs
        } catch (error) {
            showCustomToast("Error fetching batch scoring job status", "error");
        } finally {
            setLoading(false);
        }
    }, [showCustomToast]);

    useEffect(() => {
        fetchJobs();
        // Optionally, poll for updates if jobs are expected to change status frequently
        const interval = setInterval(fetchJobs, 15000); // Poll every 15 seconds
        return () => clearInterval(interval);
    }, [fetchJobs]);


    const getStatusColor = (status: BatchScoringJobStatus['status']) => {
        switch (status) {
            case 'completed': return 'text-green-500';
            case 'in_progress': return 'text-blue-500';
            case 'failed': return 'text-red-500';
            case 'pending': return 'text-yellow-500';
            default: return 'text-gray-500';
        }
    };

    if (loading) {
        return (
            <div className="flex items-center justify-center h-full">
                <LoadingSpinner size="lg" />
            </div>
        );
    }

    return (
        <div>
            <Header
                title="Batch Scoring Jobs"
                description="Monitor the status of your bulk deal scoring operations"
                breadcrumbs={[
                    { label: "Dashboard", href: "/dashboard" },
                    { label: "Scoring", href: "/scoring" },
                    { label: "Batch Jobs" },
                ]}
            />

            <Container>
                {jobs.length === 0 ? (
                    <EmptyState
                        icon={Zap}
                        title="No Batch Scoring Jobs"
                        description="No bulk scoring operations have been initiated yet."
                    />
                ) : (
                    <div className="space-y-4">
                        {jobs.map((job) => (
                            <Card key={job.id}>
                                <CardContent className="p-4">
                                    <div className="flex justify-between items-center">
                                        <div>
                                            <p className="font-semibold">Job ID: {job.id}</p>
                                            <p className="text-sm text-muted-foreground">Started: {new Date(job.started_at).toLocaleString()}</p>
                                            {job.completed_at && (
                                                <p className="text-sm text-muted-foreground">Completed: {new Date(job.completed_at).toLocaleString()}</p>
                                            )}
                                        </div>
                                        <div className="text-right">
                                            <p className={`font-bold ${getStatusColor(job.status)}`}>Status: {job.status.replace(/_/g, ' ')}</p>
                                            {job.progress !== undefined && (
                                                <p className="text-sm text-muted-foreground">Progress: {job.progress}%</p>
                                            )}
                                        </div>
                                    </div>
                                    {job.details && <p className="text-sm mt-2">{job.details}</p>}
                                </CardContent>
                            </Card>
                        ))}
                    </div>
                )}
            </Container>
        </div>
    );
}
