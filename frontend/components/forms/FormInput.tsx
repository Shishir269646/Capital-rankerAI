import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { cn } from "@/lib/utils";

interface FormInputProps extends React.InputHTMLAttributes<HTMLInputElement> {
    label: string;
    error?: string;
    required?: boolean;
}

export function FormInput({ label, error, required, className, ...props }: FormInputProps) {
    return (
        <div className="space-y-2">
            <Label htmlFor={props.id} className={required ? "after:content-['*'] after:ml-1 after:text-destructive" : ""}>
                {label}
            </Label>
            <Input {...props} className={cn(error && "border-destructive", className)} />
            {error && <p className="text-sm text-destructive">{error}</p>}
        </div>
    );
}
