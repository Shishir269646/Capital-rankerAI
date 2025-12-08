"use client";

import { format } from "date-fns";
import { Calendar as CalendarIcon } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Calendar } from "@/components/ui/calendar";
import { Label } from "@/components/ui/label";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import { cn } from "@/lib/utils";

interface FormDatePickerProps {
    label: string;
    value?: Date;
    onChange: (date: Date | undefined) => void;
    error?: string;
    required?: boolean;
}

export function FormDatePicker({ label, value, onChange, error, required }: FormDatePickerProps) {
    return (
        <div className="space-y-2">
            <Label className={required ? "after:content-['*'] after:ml-1 after:text-destructive" : ""}>
                {label}
            </Label>
            <Popover>
                <PopoverTrigger asChild>
                    <Button variant="outline" className={cn("w-full justify-start text-left font-normal", !value && "text-muted-foreground", error && "border-destructive")}>
                        <CalendarIcon className="mr-2 h-4 w-4" />
                        {value ? format(value, "PPP") : <span>Pick a date</span>}
                    </Button>
                </PopoverTrigger>
                <PopoverContent className="w-auto p-0">
                    <Calendar mode="single" selected={value} onSelect={onChange} initialFocus />
                </PopoverContent>
            </Popover>
            {error && <p className="text-sm text-destructive">{error}</p>}
        </div>
    );
}
