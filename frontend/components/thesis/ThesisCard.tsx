"use client";

import { Card, CardContent, CardFooter, CardHeader } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import {
    DropdownMenu,
    DropdownMenuContent,
    DropdownMenuItem,
    DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { MoreHorizontal, Target, TrendingUp } from "lucide-react";
import { InvestmentThesis } from "@/types/thesis.types";
import Link from "next/link";

interface ThesisCardProps {
    thesis: InvestmentThesis;
    matchedDealsCount?: number;
    onEdit?: (id: string) => void;
    onDelete?: (id: string) => void;
    onToggleActive?: (id: string) => void;
}

export function ThesisCard({
    thesis,
    matchedDealsCount = 0,
    onEdit,
    onDelete,
    onToggleActive,
}: ThesisCardProps) {
    return (
        <Card>
            <CardHeader>
                <div className="flex items-start justify-between">
                    <div className="space-y-1 flex-1">
                        <Link href={`/thesis/${thesis.id}`}>
                            <h3 className="font-semibold text-lg hover:text-primary cursor-pointer">
                                {thesis.title}
                            </h3>
                        </Link>
                        <p className="text-sm text-muted-foreground line-clamp-2">
                            {thesis.description}
                        </p>
                    </div>
                    <Badge variant={thesis.is_active ? "default" : "secondary"} className="ml-2">
                        {thesis.is_active ? "Active" : "Inactive"}
                    </Badge>
                </div>
            </CardHeader>

            <CardContent className="space-y-4">
                {/* Focus Areas */}
                <div>
                    <p className="text-sm font-medium mb-2">Focus Areas</p>
                    <div className="flex flex-wrap gap-2">
                        {thesis.focus_areas.map((area) => (
                            <Badge key={area} variant="outline">
                                {area}
                            </Badge>
                        ))}
                    </div>
                </div>

                {/* Sectors */}
                <div>
                    <p className="text-sm font-medium mb-2">Sectors</p>
                    <div className="flex flex-wrap gap-2">
                        {thesis.sectors.map((sector) => (
                            <Badge key={sector} variant="secondary">
                                {sector}
                            </Badge>
                        ))}
                    </div>
                </div>

                {/* Stages */}
                <div>
                    <p className="text-sm font-medium mb-2">Investment Stages</p>
                    <div className="flex flex-wrap gap-2">
                        {thesis.stages.map((stage) => (
                            <Badge key={stage} variant="outline">
                                {stage}
                            </Badge>
                        ))}
                    </div>
                </div>

                {/* Matched Deals */}
                <div className="flex items-center gap-2 text-sm">
                    <TrendingUp className="h-4 w-4 text-primary" />
                    <span className="font-medium">{matchedDealsCount}</span>
                    <span className="text-muted-foreground">matched deals</span>
                </div>
            </CardContent>

            <CardFooter className="flex justify-between">
                <Link href={`/thesis/${thesis.id}`}>
                    <Button variant="outline" size="sm">
                        View Details
                    </Button>
                </Link>

                <DropdownMenu>
                    <DropdownMenuTrigger asChild>
                        <Button variant="ghost" size="icon">
                            <MoreHorizontal className="h-4 w-4" />
                        </Button>
                    </DropdownMenuTrigger>
                    <DropdownMenuContent align="end">
                        <DropdownMenuItem onClick={() => onEdit?.(thesis.id)}>
                            Edit
                        </DropdownMenuItem>
                        <DropdownMenuItem onClick={() => onToggleActive?.(thesis.id)}>
                            {thesis.is_active ? "Deactivate" : "Activate"}
                        </DropdownMenuItem>
                        <DropdownMenuItem
                            onClick={() => onDelete?.(thesis.id)}
                            className="text-destructive"
                        >
                            Delete
                        </DropdownMenuItem>
                    </DropdownMenuContent>
                </DropdownMenu>
            </CardFooter>
        </Card>
    );
}
