"use client";

import { useState } from "react";
import { Input } from "@/components/ui/input";
import { Search, X } from "lucide-react";
import { Button } from "@/components/ui/button";
import { useDebounce } from "@/lib/hooks/useDebounce";

interface SearchBarProps {
    placeholder?: string;
    onSearch: (query: string) => void;
    debounceMs?: number;
}

export function SearchBar({
    placeholder = "Search...",
    onSearch,
    debounceMs = 300,
}: SearchBarProps) {
    const [query, setQuery] = useState("");
    const debouncedQuery = useDebounce(query, debounceMs);

    const handleChange = (value: string) => {
        setQuery(value);
    };

    const handleClear = () => {
        setQuery("");
        onSearch("");
    };

    // Call onSearch when debounced query changes
    React.useEffect(() => {
        onSearch(debouncedQuery);
    }, [debouncedQuery, onSearch]);

    return (
        <div className="relative w-full max-w-md">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
            <Input
                type="search"
                placeholder={placeholder}
                value={query}
                onChange={(e) => handleChange(e.target.value)}
                className="pl-10 pr-10"
            />
            {query && (
                <Button
                    variant="ghost"
                    size="icon"
                    className="absolute right-1 top-1/2 transform -translate-y-1/2 h-7 w-7"
                    onClick={handleClear}
                >
                    <X className="h-4 w-4" />
                </Button>
            )}
        </div>
    );
}
