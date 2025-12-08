"use client";

import { useState } from "react";
import { Label } from "@/components/ui/label";
import { Button } from "@/components/ui/button";
import { Upload, X, FileIcon } from "lucide-react";
import { cn } from "@/lib/utils";

interface FormFileUploadProps {
    label: string;
    accept?: string;
    onChange: (file: File | null) => void;
    error?: string;
    required?: boolean;
}

export function FormFileUpload({ label, accept, onChange, error, required }: FormFileUploadProps) {
    const [file, setFile] = useState<File | null>(null);

    const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const selectedFile = e.target.files?.[0] || null;
        setFile(selectedFile);
        onChange(selectedFile);
    };

    const handleRemove = () => {
        setFile(null);
        onChange(null);
    };

    return (
        <div className="space-y-2">
            <Label className={required ? "after:content-['*'] after:ml-1 after:text-destructive" : ""}>
                {label}
            </Label>

            {!file ? (
                <div className={cn("border-2 border-dashed rounded-lg p-6 text-center", error && "border-destructive")}>
                    <input type="file" accept={accept} onChange={handleFileChange} className="hidden" id="file-upload" />
                    <label htmlFor="file-upload" className="cursor-pointer">
                        <Upload className="mx-auto h-8 w-8 text-gray-400 mb-2" />
                        <p className="text-sm font-medium">Click to upload</p>
                        <p className="text-xs text-muted-foreground mt-1">
                            {accept || "Any file type"}
                        </p>
                    </label>
                </div>
            ) : (
                <div className="border rounded-lg p-4 flex items-center justify-between">
                    <div className="flex items-center gap-2">
                        <FileIcon className="h-5 w-5 text-muted-foreground" />
                        <div>
                            <p className="text-sm font-medium">{file.name}</p>
                            <p className="text-xs text-muted-foreground">
                                {(file.size / 1024).toFixed(2)} KB
                            </p>
                        </div>
                    </div>
                    <Button variant="ghost" size="icon" onClick={handleRemove}>
                        <X className="h-4 w-4" />
                    </Button>
                </div>
            )}

            {error && <p className="text-sm text-destructive">{error}</p>}
        </div>
    );
}
