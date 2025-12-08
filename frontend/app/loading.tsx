import { LoadingSpinner } from "@/components/shared/LoadingSpinner";

export default function Loading() {
    return (
        <div className="min-h-screen flex items-center justify-center bg-gray-50">
            <div className="text-center space-y-4">
                <LoadingSpinner size="lg" />
                <p className="text-muted-foreground">Loading...</p>
            </div>
        </div>
    );
}