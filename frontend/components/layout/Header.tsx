"use client";

import { Button } from "@/components/ui/button";
import { ChevronRight } from "lucide-react";
import Link from "next/link";

interface HeaderProps {
    title: string;
    description?: string;
    breadcrumbs?: { label: string; href?: string }[];
    action?: React.ReactNode;
}

export function Header({ title, description, breadcrumbs, action }: HeaderProps) {
    return (
        <div className="border-b bg-white">
            <div className="px-6 py-6">
                {/* Breadcrumbs */}
                {breadcrumbs && breadcrumbs.length > 0 && (
                    <div className="flex items-center gap-2 text-sm text-muted-foreground mb-2">
                        {breadcrumbs.map((crumb, index) => (
                            <div key={index} className="flex items-center gap-2">
                                {crumb.href ? (
                                    <Link
                                        href={crumb.href}
                                        className="hover:text-foreground transition-colors"
                                    >
                                        {crumb.label}
                                    </Link>
                                ) : (
                                    <span className="text-foreground">{crumb.label}</span>
                                )}
                                {index < breadcrumbs.length - 1 && (
                                    <ChevronRight className="h-4 w-4" />
                                )}
                            </div>
                        ))}
                    </div>
                )}

                {/* Title and Action */}
                <div className="flex items-center justify-between">
                    <div>
                        <h1 className="text-3xl font-bold tracking-tight">{title}</h1>
                        {description && (
                            <p className="text-muted-foreground mt-1">{description}</p>
                        )}
                    </div>
                    {action && <div>{action}</div>}
                </div>
            </div>
        </div>
    );
}