import { Checkbox } from "@/components/ui/checkbox";
import { Label } from "@/components/ui/label";

interface FormCheckboxProps {
    id: string;
    label: string;
    checked?: boolean;
    onCheckedChange?: (checked: boolean) => void;
    error?: string;
}

export function FormCheckbox({ id, label, checked, onCheckedChange, error }: FormCheckboxProps) {
    return (
        <div className="space-y-2">
            <div className="flex items-center space-x-2">
                <Checkbox id={id} checked={checked} onCheckedChange={onCheckedChange} />
                <Label htmlFor={id} className="cursor-pointer">
                    {label}
                </Label>
            </div>
            {error && <p className="text-sm text-destructive">{error}</p>}
        </div>
    );
}
