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
import { dealsApi } from "@/lib/api/deals.api";
import { getAccessToken } from "@/lib/auth/token";
import { LoadingSpinner } from "@/components/shared/LoadingSpinner";
import { Save } from "lucide-react";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import type { Deal, CreateDealPayload } from "@/types/deal.types";
import axios, { AxiosError } from "axios";

export default function EditDealPage({ params }: { params: { id: string } }) {
  const router = useRouter();
  const { show: showCustomToast } = useToast();
  const dealId = params.id;

  const [deal, setDeal] = useState<Deal | null>(null);
  const [dealName, setDealName] = useState("");
  const [dealDescription, setDealDescription] = useState("");
  const [dealSource, setDealSource] = useState<CreateDealPayload['source']>('manual');
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);

  useEffect(() => {
    const fetchDealDetails = async () => {
      setLoading(true);
      const token = getAccessToken();
      if (!token) {
        showCustomToast("Authentication token not found.", "error");
        setLoading(false);
        return;
      }
      try {
        const response = await dealsApi.getDealById(dealId, token);
        setDeal(response.data);
        setDealName(response.data.name);
        setDealDescription(response.data.description || "");
        setDealSource(response.data.source || "manual");
      } catch (error) {
        showCustomToast("Error fetching deal details", "error");
        router.push("/deals"); // Redirect if deal not found or error
      } finally {
        setLoading(false);
      }
    };

    if (dealId) {
      fetchDealDetails();
    }
  }, [dealId, router, showCustomToast]);

  const handleUpdateDeal = async () => {
    setSaving(true);
    const token = getAccessToken();
    if (!token) {
      showCustomToast("Authentication token not found.", "error");
      setSaving(false);
      return;
    }

    if (!dealName || !dealDescription) {
      showCustomToast("Deal name and description are required.", "error");
      setSaving(false);
      return;
    }

    try {
      const payload: Partial<CreateDealPayload> = {
        name: dealName,
        description: dealDescription,
        source: dealSource,
        // Include other fields that can be updated
      };
      await dealsApi.updateDeal(dealId, payload, token);
      showCustomToast("Deal updated successfully!", "success");
      router.push(`/deals/${dealId}`); // Navigate back to the deal details page
    } catch (error: any) {
      let errorMessage = "An unexpected error occurred.";
      if (axios.isAxiosError(error)) {
        errorMessage = error.response?.data?.message || "Error updating deal.";
      } else if (error instanceof Error) {
        errorMessage = error.message;
      }
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

  if (!deal) {
    return (
      <Container>
        <div className="text-center py-10">
          <h2 className="text-2xl font-bold">Deal Not Found</h2>
          <p className="text-muted-foreground">The deal you are trying to edit does not exist.</p>
          <Button onClick={() => router.push("/deals")} className="mt-4">
            Back to Deals
          </Button>
        </div>
      </Container>
    );
  }

  return (
    <div>
      <Header
        title={`Edit: ${deal.name}`}
        description="Modify the details of this investment opportunity"
        breadcrumbs={[
          { label: "Dashboard", href: "/dashboard" },
          { label: "Deals", href: "/deals" },
          { label: deal.name, href: `/deals/${dealId}` },
          { label: "Edit" },
        ]}
      />

      <Container>
        <Card>
          <CardHeader>
            <CardTitle>Deal Information</CardTitle>
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
            {/* Add more fields as per your Deal update payload */}
            <Button onClick={handleUpdateDeal} disabled={saving}>
              {saving ? "Saving..." : <><Save className="mr-2 h-4 w-4" /> Save Changes</>}
            </Button>
          </CardContent>
        </Card>
      </Container>
    </div>
  );
}
