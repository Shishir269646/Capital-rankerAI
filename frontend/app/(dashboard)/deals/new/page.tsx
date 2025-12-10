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

export default function NewDealPage() {
  const router = useRouter();
  const { show: showCustomToast } = useToast();
  const [dealName, setDealName] = useState("");
  const [dealDescription, setDealDescription] = useState("");
  const [dealSource, setDealSource] = useState("");
  const [loading, setLoading] = useState(false);

  const handleCreateDeal = async () => {
    setLoading(true);
    const token = getAccessToken();
    if (!token) {
      showCustomToast("Authentication token not found.", "error");
      setLoading(false);
      return;
    }

    if (!dealName || !dealDescription) {
      showCustomToast("Deal name and description are required.", "error");
      setLoading(false);
      return;
    }

    try {
      // Assuming a simplified payload for deal creation
      const payload = {
        name: dealName,
        description: dealDescription,
        source: dealSource,
        // Add other required fields for deal creation based on your backend API
        // For example: status: 'pending', valuation: 0, etc.
      };
      await dealsApi.createDeal(payload, token);
      showCustomToast("Deal created successfully!", "success");
      router.push("/deals"); // Navigate back to the deals list
    } catch (error: any) {
      const errorMessage = error.response?.data?.message || "Error creating deal.";
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
              <Input
                id="deal-source"
                value={dealSource}
                onChange={(e) => setDealSource(e.target.value)}
                placeholder="e.g., AngelList, Referral, Conference"
              />
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