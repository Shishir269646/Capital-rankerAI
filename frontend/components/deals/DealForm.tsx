"use client";

import { useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { X, Loader2 } from "lucide-react";

const dealSchema = z.object({
    name: z.string().min(2, "Name must be at least 2 characters"),
    description: z.string().min(50, "Description must be at least 50 characters"),
    website: z.string().url("Must be a valid URL").optional().or(z.literal("")),
    stage: z.enum(["pre-seed", "seed", "series-a", "series-b", "series-c", "series-d+"]),
    founded_year: z.number().min(1900).max(new Date().getFullYear()).optional(),
    team_size: z.number().min(1).optional(),
    location: z.string().optional(),
    revenue: z.number().min(0),
    revenue_growth_rate: z.number(),
});

type DealFormData = z.infer<typeof dealSchema>;

const SECTORS = ["Fintech", "Healthtech", "E-commerce", "SaaS", "AI/ML", "Edtech", "Enterprise", "Consumer"];

interface DealFormProps {
    initialData?: Partial<DealFormData>;
    onSubmit: (data: DealFormData & { sector: string[] }) => Promise<void>;
    submitting: boolean;
}

export function DealForm({ initialData, onSubmit, submitting }: DealFormProps) {
    const [selectedSectors, setSelectedSectors] = useState<string[]>([]);

    const { register, handleSubmit, setValue, formState: { errors } } = useForm<DealFormData>({
        resolver: zodResolver(dealSchema),
        defaultValues: initialData,
    });

    const toggleSector = (sector: string) => {
        setSelectedSectors((prev) =>
            prev.includes(sector) ? prev.filter((s) => s !== sector) : [...prev, sector]
        );
    };

    const handleFormSubmit = async (data: DealFormData) => {
        await onSubmit({ ...data, sector: selectedSectors });
    };

    return (
        <form onSubmit={handleSubmit(handleFormSubmit)} className="space-y-6">
            <Card>
                <CardHeader>
                    <CardTitle>Basic Information</CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                    <div className="space-y-2">
                        <Label htmlFor="name">Startup Name *</Label>
                        <Input {...register("name")} id="name" placeholder="Acme Corp" />
                        {errors.name && <p className="text-sm text-destructive">{errors.name.message}</p>}
                    </div>

                    <div className="space-y-2">
                        <Label htmlFor="description">Description *</Label>
                        <Textarea {...register("description")} id="description" placeholder="Describe the startup..." rows={5} />
                        {errors.description && <p className="text-sm text-destructive">{errors.description.message}</p>}
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        <div className="space-y-2">
                            <Label htmlFor="website">Website</Label>
                            <Input {...register("website")} id="website" type="url" placeholder="https://example.com" />
                            {errors.website && <p className="text-sm text-destructive">{errors.website.message}</p>}
                        </div>

                        <div className="space-y-2">
                            <Label htmlFor="stage">Stage *</Label>
                            <Select onValueChange={(value) => setValue("stage", value as any)}>
                                <SelectTrigger>
                                    <SelectValue placeholder="Select stage" />
                                </SelectTrigger>
                                <SelectContent>
                                    <SelectItem value="pre-seed">Pre-seed</SelectItem>
                                    <SelectItem value="seed">Seed</SelectItem>
                                    <SelectItem value="series-a">Series A</SelectItem>
                                    <SelectItem value="series-b">Series B</SelectItem>
                                    <SelectItem value="series-c">Series C</SelectItem>
                                    <SelectItem value="series-d+">Series D+</SelectItem>
                                </SelectContent>
                            </Select>
                            {errors.stage && <p className="text-sm text-destructive">{errors.stage.message}</p>}
                        </div>
                    </div>

                    <div className="space-y-2">
                        <Label>Sectors *</Label>
                        <div className="flex flex-wrap gap-2">
                            {SECTORS.map((sector) => (
                                <Badge
                                    key={sector}
                                    variant={selectedSectors.includes(sector) ? "default" : "outline"}
                                    className="cursor-pointer"
                                    onClick={() => toggleSector(sector)}
                                >
                                    {sector}
                                    {selectedSectors.includes(sector) && <X className="ml-1 h-3 w-3" />}
                                </Badge>
                            ))}
                        </div>
                    </div>
                </CardContent>
            </Card>

            <Card>
                <CardHeader>
                    <CardTitle>Financial Metrics</CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        <div className="space-y-2">
                            <Label htmlFor="revenue">Annual Revenue (USD) *</Label>
                            <Input {...register("revenue", { valueAsNumber: true })} id="revenue" type="number" placeholder="1000000" />
                            {errors.revenue && <p className="text-sm text-destructive">{errors.revenue.message}</p>}
                        </div>

                        <div className="space-y-2">
                            <Label htmlFor="revenue_growth_rate">Revenue Growth Rate (%) *</Label>
                            <Input {...register("revenue_growth_rate", { valueAsNumber: true })} id="revenue_growth_rate" type="number" placeholder="150" />
                            {errors.revenue_growth_rate && <p className="text-sm text-destructive">{errors.revenue_growth_rate.message}</p>}
                        </div>
                    </div>
                </CardContent>
            </Card>

            <div className="flex justify-end gap-4">
                <Button type="button" variant="outline" disabled={submitting}>
                    Cancel
                </Button>
                <Button type="submit" disabled={submitting}>
                    {submitting && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
                    {initialData ? "Update Deal" : "Create Deal"}
                </Button>
            </div>
        </form>
    );
}
