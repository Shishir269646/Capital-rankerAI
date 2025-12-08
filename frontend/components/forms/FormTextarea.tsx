import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { cn } from "@/lib/utils";

interface FormTextareaProps extends React.TextareaHTMLAttributes<HTMLTextAreaElement> {
    label: string;
    error?: string;
    required?: boolean;
}

export function FormTextarea({ label, error, required, className, ...props }: FormTextareaProps) {
    return (
        <div className="space-y-2">
            <Label htmlFor={props.id} className={required ? "after:content-['*'] after:ml-1 after:text-destructive" : ""}>
                {label}
            </Label>
            <Textarea {...props} className={cn(error && "border-destructive", className)} />
            {error && <p className="text-sm text-destructive">{error}</p>}
        </div>
    );
}