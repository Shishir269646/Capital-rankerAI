"use client";

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Header } from "@/components/layout/Header";
import { Container } from "@/components/layout/Container";
import { Button } from "@/components/ui/button";
import { User, Bell, Users, Sliders } from "lucide-react";
import Link from "next/link";

export default function SettingsPage() {
    const settingsSections = [
        {
            title: "Profile",
            description: "Manage your personal information and account details",
            icon: User,
            href: "/settings/profile",
        },
        {
            title: "Preferences",
            description: "Customize your experience and scoring preferences",
            icon: Sliders,
            href: "/settings/preferences",
        },
        {
            title: "Notifications",
            description: "Configure alert and notification preferences",
            icon: Bell,
            href: "/settings/notifications",
        },
        {
            title: "Team",
            description: "Manage team members and permissions",
            icon: Users,
            href: "/settings/team",
        },
    ];

    return (
        <div>
            <Header
                title="Settings"
                description="Manage your account and application preferences"
                breadcrumbs={
                    [
                        { label: "Dashboard", href: "/dashboard" },
                        { label: "Settings" },
                    ]}
            />

            <Container>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6" >
                    {
                        settingsSections.map((section) => (
                            <Card key={section.href} >
                                <CardHeader>
                                    <div className="flex items-center gap-3" >
                                        <div className="p-2 bg-primary/10 rounded-lg" >
                                            <section.icon className="h-6 w-6 text-primary" />
                                        </div>
                                        < div >
                                            <CardTitle>{section.title} </CardTitle>
                                            < CardDescription > {section.description} </CardDescription>
                                        </div>
                                    </div>
                                </CardHeader>
                                < CardContent >
                                    <Link href={section.href} >
                                        <Button variant="outline" className="w-full" >
                                            Configure
                                        </Button>
                                    </Link>
                                </CardContent>
                            </Card>
                        ))
                    }
                </div>
            </Container>
        </div>
    );
}