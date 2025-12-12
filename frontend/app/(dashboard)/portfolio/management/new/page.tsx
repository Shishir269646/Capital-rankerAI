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
import { portfolioApi } from "@/lib/api/portfolio.api";
import { dealsApi } from "@/lib/api/deals.api"; // Import dealsApi
import { getAccessToken } from "@/lib/auth/token";
import { PlusCircle } from "lucide-react";
import { CreateDealPayload } from "@/types/deal.types"; // Import CreateDealPayload

export default function NewPortfolioPage() {
  const router = useRouter();
  const { show: showCustomToast } = useToast();
  const [portfolioName, setPortfolioName] = useState("");
  const [portfolioDescription, setPortfolioDescription] = useState("");
  const [loading, setLoading] = useState(false);

  const handleCreatePortfolio = async () => {
    setLoading(true);
    const token = getAccessToken();
    if (!token) {
      showCustomToast("Authentication token not found.", "error");
      setLoading(false);
      return;
    }

    if (!portfolioName.trim()) {
      showCustomToast("Startup Name is required.", "error");
      setLoading(false);
      return;
    }

    try {
      // 1. Create a new Startup (Deal) first
      const dealPayload: CreateDealPayload = {
        name: portfolioName.trim(),
        description: portfolioDescription.trim() || "No description provided for this startup.",
        sector: ['other'], // Default minimal required value
        stage: 'seed', // Default minimal required value
        team_size: 1, // Default minimal required value
        founded_date: new Date(), // Default minimal required value
        website: 'https://example.com', // Default minimal required value
        source: 'manual', // Default minimal required value
        metrics: { // Default minimal required values
            revenue: 0,
            growth_rate_mom: 0,
            growth_rate_yoy: 0,
            burn_rate: 0,
            runway_months: 0,
        },
        location: { // Default minimal required values
            city: 'Unknown',
            country: 'Unknown',
            region: 'Unknown',
        },
        founders: [], // No founders initially
        competitors: [],
        tags: [],
        status: 'active',
        funding_history: [],
        technology_stack: [],
      };

      const dealResponse = await dealsApi.createDeal(dealPayload, token);
      const newDealId = dealResponse.data.id; // Correctly accessing 'id'

      // 2. Then create the Portfolio item linked to this new Startup
      await portfolioApi.createPortfolioItem({ startup_id: newDealId }, token);
      
      showCustomToast("Portfolio created successfully!", "success");
      router.push("/portfolio/management");
    } catch (error: any) {
      const errorMessage = error.response?.data?.message || "Error creating portfolio.";
      showCustomToast(errorMessage, "error");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div>
      <Header
        title="Create New Portfolio"
        description="Set up a new investment portfolio"
        breadcrumbs={[
          { label: "Dashboard", href: "/dashboard" },
          { label: "Portfolio", href: "/portfolio" },
          { label: "Management", href: "/portfolio/management" },
          { label: "Create New" },
        ]}
      />

      <Container>
        <Card>
          <CardHeader>
            <CardTitle>Startup Details for Portfolio</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div>
              <Label htmlFor="startup-name">Startup Name</Label>
              <Input
                id="startup-name"
                value={portfolioName}
                onChange={(e) => setPortfolioName(e.target.value)}
                placeholder="e.g., Innovative Tech Solutions"
              />
            </div>
            <div>
              <Label htmlFor="startup-description">Startup Description</Label>
              <Textarea
                id="startup-description"
                value={portfolioDescription}
                onChange={(e) => setPortfolioDescription(e.target.value)}
                placeholder="Briefly describe the startup for this portfolio entry"
              />
            </div>
            <Button onClick={handleCreatePortfolio} disabled={loading}>
              {loading ? "Creating..." : <><PlusCircle className="mr-2 h-4 w-4" /> Create Portfolio Entry</>}
            </Button>
          </CardContent>
        </Card>
      </Container>
    </div>
  );
}
