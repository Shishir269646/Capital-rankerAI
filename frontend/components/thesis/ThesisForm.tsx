"use client";

import { useState } from "react";
import { useForm } from "react-hook-form";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { Badge } from "@/components/ui/badge";
import { Checkbox } from "@/components/ui/checkbox";
import { X, Loader2 } from "lucide-react";

const SECTORS = ["Fintech", "Healthtech", "E-commerce", "SaaS", "AI/ML", "Edtech", "Enterprise", "Consumer"];
const STAGES = ["pre-seed", "seed", "series-a", "series-b", "series-c"];
const FOCUS_AREAS = ["Product-Market Fit", "Scalability", "Team Strength", "Market Size", "Revenue Model", "Technology", "Competitive Advantage"];

interface ThesisFormProps {
    initialData?: any;
    onSubmit: (data: any) => Promise<void>;
    submitting: boolean;
}

export function ThesisForm({ initialData, onSubmit, submitting }: ThesisFormProps) {
    const [selectedSectors, setSelectedSectors] = useState<string[]>(initialData?.sectors || []);
    const [selectedStages, setSelectedStages] = useState<string[]>(initialData?.stages || []);
    const [selectedFocusAreas, setSelectedFocusAreas] = useState<string[]>(initialData?.focus_areas || []);

    const { register, handleSubmit, formState: { errors } } = useForm({
        defaultValues: initialData,
    });

    const handleFormSubmit = async (data: any) => {
        await onSubmit({
            ...data,
            sectors: selectedSectors,
            stages: selectedStages,
            focus_areas: selectedFocusAreas,
        });
    };

    return (
        <form onSubmit={handleSubmit(handleFormSubmit)} className="space-y-6" >
            <Card>
                <CardHeader>
                    <CardTitle>Thesis Information </CardTitle>
                </CardHeader>
                < CardContent className="space-y-4" >
                    <div className="space-y-2" >
                        <Label htmlFor="title" > Thesis Title * </Label>
                        < Input {...register("title", { required: true })} id="title" placeholder="e.g., B2B SaaS for Enterprise" />
                        {errors.title && <p className="text-sm text-destructive"> Title is required</ p >}
                    </div>

                    < div className="space-y-2" >
                        <Label htmlFor="description" > Description * </Label>
                        < Textarea
                            {...register("description", { required: true })}
                            id="description"
                            placeholder="Describe your investment thesis..."
                            rows={5}
                        />
                        {errors.description && <p className="text-sm text-destructive"> Description is required</ p >}
                    </div>
                </CardContent>
            </Card>

            < Card >
                <CardHeader>
                    <CardTitle>Focus Areas </CardTitle>
                </CardHeader>
                < CardContent className="space-y-4" >
                    <div className="space-y-2" >
                        <Label>Select Focus Areas </Label>
                        < div className="flex flex-wrap gap-2" >
                            {
                                FOCUS_AREAS.map((area) => (
                                    <Badge
                                        key={area}
                                        variant={selectedFocusAreas.includes(area) ? "default" : "outline"}
                                        className="cursor-pointer"
                                        onClick={() => {
                                            setSelectedFocusAreas((prev) =>
                                                prev.includes(area)
                                                    ? prev.filter((a) => a !== area)
                                                    : [...prev, area]
                                            );
                                        }}
                                    >
                                        {area}
                                        {selectedFocusAreas.includes(area) && <X className="ml-1 h-3 w-3" />}
                                    </Badge>
                                ))}
                        </div>
                    </div>
                </CardContent>
            </Card>

            < Card >
                <CardHeader>
                    <CardTitle>Investment Criteria </CardTitle>
                </CardHeader>
                < CardContent className="space-y-4" >
                    <div className="space-y-2" >
                        <Label>Target Sectors </Label>
                        < div className="flex flex-wrap gap-2" >
                            {
                                SECTORS.map((sector) => (
                                    <Badge
                                        key={sector}
                                        variant={selectedSectors.includes(sector) ? "default" : "outline"}
                                        className="cursor-pointer"
                                        onClick={() => {
                                            setSelectedSectors((prev) =>
                                                prev.includes(sector)
                                                    ? prev.filter((s) => s !== sector)
                                                    : [...prev, sector]
                                            );
                                        }}
                                    >
                                        {sector}
                                        {selectedSectors.includes(sector) && <X className="ml-1 h-3 w-3" />}
                                    </Badge>
                                ))}
                        </div>
                    </div>

                    < div className="space-y-2" >
                        <Label>Target Stages </Label>
                        < div className="flex flex-wrap gap-2" >
                            {
                                STAGES.map((stage) => (
                                    <Badge
                                        key={stage}
                                        variant={selectedStages.includes(stage) ? "default" : "outline"}
                                        className="cursor-pointer"
                                        onClick={() => {
                                            setSelectedStages((prev) =>
                                                prev.includes(stage)
                                                    ? prev.filter((s) => s !== stage)
                                                    : [...prev, stage]
                                            );
                                        }}
                                    >
                                        {stage}
                                        {selectedStages.includes(stage) && <X className="ml-1 h-3 w-3" />}
                                    </Badge>
                                ))}
                        </div>
                    </div>

                    < div className="grid grid-cols-1 md:grid-cols-3 gap-4" >
                        <div className="space-y-2" >
                            <Label htmlFor="min_revenue" > Min Revenue(USD) </Label>
                            < Input
                                {...register("min_revenue", { valueAsNumber: true })}
                                id="min_revenue"
                                type="number"
                                placeholder="1000000"
                            />
                        </div>

                        < div className="space-y-2" >
                            <Label htmlFor="min_growth_rate" > Min Growth Rate(%) </Label>
                            < Input
                                {...register("min_growth_rate", { valueAsNumber: true })}
                                id="min_growth_rate"
                                type="number"
                                placeholder="100"
                            />
                        </div>

                        < div className="space-y-2" >
                            <Label htmlFor="min_team_size" > Min Team Size </Label>
                            < Input
                                {...register("min_team_size", { valueAsNumber: true })}
                                id="min_team_size"
                                type="number"
                                placeholder="10"
                            />
                        </div>
                    </div>
                </CardContent>
            </Card>

            < div className="flex justify-end gap-4" >
                <Button type="button" variant="outline" disabled={submitting} >
                    Cancel
                </Button>
                < Button type="submit" disabled={submitting} >
                    {submitting && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
                    {initialData ? "Update Thesis" : "Create Thesis"}
                </Button>
            </div>
        </form>
    );
}