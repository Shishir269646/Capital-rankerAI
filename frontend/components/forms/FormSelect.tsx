import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";

interface FormSelectProps {
    label: string;
    value?: string;
    onValueChange: (value: string) => void;
    options: Array<{ value: string; label: string }>;
    placeholder?: string;
    error?: string;
    required?: boolean;
}

export function FormSelect({ label, value, onValueChange, options, placeholder, error, required }: FormSelectProps) {
    return (
        <div className="space-y-2">
            <Label className={required ? "after:content-['*'] after:ml-1 after:text-destructive" : ""}>
                {label}
            </Label>
            <Select value={value} onValueChange={onValueChange}>
                <SelectTrigger className={error ? "border-destructive" : ""}>
                    <SelectValue placeholder={placeholder} />
                </SelectTrigger>
                <SelectContent>
                    {options.map((option) => (
                        <SelectItem key={option.value} value={option.value}>
                            {option.label}
                        </SelectItem>
                    ))}
                </SelectContent>
            </Select>
            {error && <p className="text-sm text-destructive">{error}</p>}
        </div>
    );
}