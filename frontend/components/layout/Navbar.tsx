"use client";

import Link from "next/link";
import { Bell, Search, Settings, User, LogOut } from "lucide-react";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
    DropdownMenu,
    DropdownMenuContent,
    DropdownMenuItem,
    DropdownMenuLabel,
    DropdownMenuSeparator,
    DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import { useAuth } from "@/lib/hooks/useAuth";
import { useRouter } from "next/navigation";

export function Navbar() {
    const { user, logout } = useAuth();
    const router = useRouter();
    const alertCount = 3; // This would come from your alerts state

    const handleLogout = async () => {
        await logout(); // Call the async thunk
        router.push("/login");
    };

    return (
        <nav className="border-b bg-white">
            <div className="flex h-16 items-center px-6 gap-4">
                {/* Search */}
                <div className="flex-1 max-w-md">
                    <div className="relative">
                        <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                        <Input
                            type="search"
                            placeholder="Search deals, founders..."
                            className="pl-10"
                        />
                    </div>
                </div>

                {/* Right Section */}
                <div className="flex items-center gap-4">
                    {/* Alerts */}
                    <Button
                        variant="ghost"
                        size="icon"
                        className="relative"
                        onClick={() => router.push("/alerts")}
                    >
                        <Bell className="h-5 w-5" />
                        {alertCount > 0 && (
                            <Badge
                                variant="destructive"
                                className="absolute -top-1 -right-1 h-5 w-5 flex items-center justify-center p-0 text-xs"
                            >
                                {alertCount}
                            </Badge>
                        )}
                    </Button>

                    {/* Settings */}
                    <Button
                        variant="ghost"
                        size="icon"
                        onClick={() => router.push("/settings")}
                    >
                        <Settings className="h-5 w-5" />
                    </Button>

                    {/* Logout Button */}
                    <Button
                        variant="ghost"
                        size="sm" // Use 'sm' to make it a bit smaller than default, but still clear text
                        onClick={handleLogout}
                    >
                        <LogOut className="h-5 w-5 mr-2" />
                        Logout
                    </Button>

                    {/* User Menu */}
                    <DropdownMenu>
                        <DropdownMenuTrigger asChild>
                            <Button variant="ghost" className="relative h-10 w-10 rounded-full">
                                                                 <Avatar>
                                                                     <AvatarImage src={user?.profile_picture} alt={user?.name} />                                    <AvatarFallback>
                                        {user?.name?.charAt(0) || "U"}
                                    </AvatarFallback>
                                </Avatar>
                            </Button>
                        </DropdownMenuTrigger>
                        <DropdownMenuContent align="end" className="w-56">
                            <DropdownMenuLabel>
                                <div className="flex flex-col space-y-1">
                                    <p className="text-sm font-medium">{user?.name}</p>
                                    <p className="text-xs text-muted-foreground">{user?.email}</p>
                                </div>
                            </DropdownMenuLabel>
                            <DropdownMenuSeparator />
                            <DropdownMenuItem onClick={() => router.push("/settings/profile")}>
                                <User className="mr-2 h-4 w-4" />
                                Profile
                            </DropdownMenuItem>
                            <DropdownMenuItem onClick={() => router.push("/settings")}>
                                <Settings className="mr-2 h-4 w-4" />
                                Settings
                            </DropdownMenuItem>
                            <DropdownMenuSeparator />
                            <DropdownMenuItem onClick={handleLogout} className="text-destructive">
                                Log out
                            </DropdownMenuItem>
                        </DropdownMenuContent>
                    </DropdownMenu>
                </div>
            </div>
        </nav>
    );
}





