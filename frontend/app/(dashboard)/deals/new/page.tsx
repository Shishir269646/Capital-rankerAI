"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { Header } from "@/components/layout/Header";
import { Container } from "@/components/layout/Container";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Button } from "@/components/ui/button";
import { useToast } from "@/components/ui/ToastProvider";
import { dealsApi } from "@/lib/api/deals.api";
import { getAccessToken } from "@/lib/auth/token";
import { PlusCircle } from "lucide-react";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import type { CreateDealPayload } from "@/types/deal.types";
import axios, { AxiosError } from "axios";

export default function NewDealPage() {
  const router = useRouter();
  const { show: showCustomToast } = useToast();
  const [dealName, setDealName] = useState("");
  const [dealDescription, setDealDescription] = useState("");
  const [dealSource, setDealSource] = useState<CreateDealPayload['source']>('manual');
  const [loading, setLoading] = useState(false);

  const handleCreateDeal = async () => {
    setLoading(true);
    const token = getAccessToken();
    if (!token) {
      showCustomToast("Authentication token not found.", "error");
      setLoading(false);
      return;
    }

    if (!dealName || dealName.length < 2) {
      showCustomToast("Deal name must be at least 2 characters.", "error");
      setLoading(false);
      return;
    }

    if (!dealDescription || dealDescription.length < 50) {
      showCustomToast("Deal description must be at least 50 characters.", "error");
      setLoading(false);
      return;
    }

    try {
      const payload: CreateDealPayload = {
        name: dealName,
        description: dealDescription,
        source: dealSource,
        sector: ['other'], // Default to 'other' to satisfy min(1) and valid type
        stage: 'pre-seed',
        funding_history: [],
        metrics: {
          revenue: 0,
          growth_rate_mom: 0,
          growth_rate_yoy: 0,
          burn_rate: 0,
          runway_months: 0,
        },
        team_size: 1, // Default to 1 to satisfy min(1)
        founders: [],
        founded_date: new Date(),
        website: "http://example.com", // Default to a valid URI
        location: {
          city: "Unknown", // Default to a city
          country: "Unknown", // Default to a country
        },
        technology_stack: [],
        status: 'active',
        tags: [],
        competitors: [],
      };
      await dealsApi.createDeal(payload, token);
      showCustomToast("Deal created successfully!", "success");
      router.push("/deals"); // Navigate back to the deals list
    } catch (error: any) {
      let errorMessage = "An unexpected error occurred.";
      if (axios.isAxiosError(error)) {
        errorMessage = error.response?.data?.message || "Error creating deal.";
      } else if (error instanceof Error) {
        errorMessage = error.message;
      }
      showCustomToast(errorMessage, "error");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div>
      <Header
        title="Create New Deal"
        description="Add a new investment opportunity to your pipeline"
        breadcrumbs={[
          { label: "Dashboard", href: "/dashboard" },
          { label: "Deals", href: "/deals" },
          { label: "Create New" },
        ]}
      />

      <Container>
        <Card>
          <CardHeader>
            <CardTitle>Deal Details</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div>
              <Label htmlFor="deal-name">Deal Name</Label>
              <Input
                id="deal-name"
                value={dealName}
                onChange={(e) => setDealName(e.target.value)}
                placeholder="e.g., Innovative AI Startup"
              />
            </div>
            <div>
              <Label htmlFor="deal-description">Description</Label>
              <Textarea
                id="deal-description"
                value={dealDescription}
                onChange={(e) => setDealDescription(e.target.value)}
                placeholder="Briefly describe the investment opportunity"
              />
            </div>
            <div>
              <Label htmlFor="deal-source">Source</Label>
              <Select value={dealSource} onValueChange={(value) => setDealSource(value as CreateDealPayload['source'])}>
                <SelectTrigger id="deal-source">
                  <SelectValue placeholder="Select a source" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="manual">Manual</SelectItem>
                  <SelectItem value="dealroom">DealRoom</SelectItem>
                  <SelectItem value="crunchbase">Crunchbase</SelectItem>
                  <SelectItem value="angellist">AngelList</SelectItem>
                </SelectContent>
              </Select>
            </div>
            {/* Add more fields as per your Deal creation payload */}
            <Button onClick={handleCreateDeal} disabled={loading}>
              {loading ? "Creating..." : <><PlusCircle className="mr-2 h-4 w-4" /> Create Deal</>}
            </Button>
          </CardContent>
        </Card>
      </Container>
    </div>
  );
}