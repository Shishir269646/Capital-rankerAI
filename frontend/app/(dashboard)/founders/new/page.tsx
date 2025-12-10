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
import { foundersApi } from "@/lib/api/founders.api";
import { getAccessToken } from "@/lib/auth/token";
import { UserPlus } from "lucide-react";

export default function NewFounderPage() {
  const router = useRouter();
  const { show: showCustomToast } = useToast();
  const [founderName, setFounderName] = useState("");
  const [founderEmail, setFounderEmail] = useState("");
  const [founderLinkedin, setFounderLinkedin] = useState("");
  const [founderBio, setFounderBio] = useState("");
  const [loading, setLoading] = useState(false);

  const handleCreateFounder = async () => {
    setLoading(true);
    const token = getAccessToken();
    if (!token) {
      showCustomToast("Authentication token not found.", "error");
      setLoading(false);
      return;
    }

    if (!founderName || !founderEmail) {
      showCustomToast("Founder name and email are required.", "error");
      setLoading(false);
      return;
    }

    try {
      // Assuming a simplified payload for founder creation
      const payload = {
        name: founderName,
        email: founderEmail,
        linkedin_profile: founderLinkedin,
        bio: founderBio,
        // Add other required fields for founder creation based on your backend API
      };
      await foundersApi.createFounder(payload, token);
      showCustomToast("Founder created successfully!", "success");
      router.push("/founders"); // Navigate back to the founders list
    } catch (error: any) {
      const errorMessage = error.response?.data?.message || "Error creating founder.";
      showCustomToast(errorMessage, "error");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div>
      <Header
        title="Add New Founder"
        description="Add a new founder's profile to the system"
        breadcrumbs={[
          { label: "Dashboard", href: "/dashboard" },
          { label: "Founders", href: "/founders" },
          { label: "Add New" },
        ]}
      />

      <Container>
        <Card>
          <CardHeader>
            <CardTitle>Founder Details</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div>
              <Label htmlFor="founder-name">Full Name</Label>
              <Input
                id="founder-name"
                value={founderName}
                onChange={(e) => setFounderName(e.target.value)}
                placeholder="e.g., Jane Doe"
              />
            </div>
            <div>
              <Label htmlFor="founder-email">Email</Label>
              <Input
                id="founder-email"
                type="email"
                value={founderEmail}
                onChange={(e) => setFounderEmail(e.target.value)}
                placeholder="e.g., jane.doe@example.com"
              />
            </div>
            <div>
              <Label htmlFor="founder-linkedin">LinkedIn Profile</Label>
              <Input
                id="founder-linkedin"
                value={founderLinkedin}
                onChange={(e) => setFounderLinkedin(e.target.value)}
                placeholder="e.g., https://linkedin.com/in/janedoe"
              />
            </div>
            <div>
              <Label htmlFor="founder-bio">Biography</Label>
              <Textarea
                id="founder-bio"
                value={founderBio}
                onChange={(e) => setFounderBio(e.target.value)}
                placeholder="Brief biography of the founder"
              />
            </div>
            {/* Add more fields as per your Founder creation payload */}
            <Button onClick={handleCreateFounder} disabled={loading}>
              {loading ? "Adding..." : <><UserPlus className="mr-2 h-4 w-4" /> Add Founder</>}
            </Button>
          </CardContent>
        </Card>
      </Container>
    </div>
  );
}
