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
import { getAccessToken } from "@/lib/auth/token";
import { PlusCircle } from "lucide-react";

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

    if (!portfolioName) {
      showCustomToast("Portfolio name is required.", "error");
      setLoading(false);
      return;
    }

    try {
      // Assuming a simplified payload for portfolio creation
      const payload = {
        name: portfolioName,
        description: portfolioDescription,
        // Add other required fields for portfolio creation based on your backend API
      };
      await portfolioApi.createPortfolio(payload, token);
      showCustomToast("Portfolio created successfully!", "success");
      router.push("/portfolio/management"); // Navigate back to the portfolio management list
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
            <CardTitle>Portfolio Details</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div>
              <Label htmlFor="portfolio-name">Portfolio Name</Label>
              <Input
                id="portfolio-name"
                value={portfolioName}
                onChange={(e) => setPortfolioName(e.target.value)}
                placeholder="e.g., Early Stage Investments"
              />
            </div>
            <div>
              <Label htmlFor="portfolio-description">Description</Label>
              <Textarea
                id="portfolio-description"
                value={portfolioDescription}
                onChange={(e) => setPortfolioDescription(e.target.value)}
                placeholder="Briefly describe the purpose of this portfolio"
              />
            </div>
            {/* Add more fields as per your Portfolio creation payload */}
            <Button onClick={handleCreatePortfolio} disabled={loading}>
              {loading ? "Creating..." : <><PlusCircle className="mr-2 h-4 w-4" /> Create Portfolio</>}
            </Button>
          </CardContent>
        </Card>
      </Container>
    </div>
  );
}
