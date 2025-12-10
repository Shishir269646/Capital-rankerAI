'use client'

import Link from 'next/link'
import { usePathname } from 'next/navigation'
import {
    LayoutDashboard,
    Briefcase,
    TrendingUp,
    Target,
    Users,
    Wallet,
    Bell,
    FileText,
    Settings,
    ChevronLeft,
    ChevronRight,
    Plus, // Added
    Upload, // Added
    Zap, // Added
    Equal, // Added
    UserPlus, // Added
    Building2 // Added
} from 'lucide-react'
import { cn } from "@/lib/utils";
import { Button } from '@/components/ui/button'
import { useState } from 'react'

interface NavItem {
    title: string
    href: string
    icon: React.ComponentType<{ className?: string }>
    badge?: number
}

const navItems: NavItem[] = [
    {
        title: 'Dashboard',
        href: '/dashboard',
        icon: LayoutDashboard,
    },
    {
        title: 'Deals',
        href: '/deals',
        icon: Briefcase,
    },
    {
        title: 'New Deal',
        href: '/deals/new',
        icon: Plus,
    },
    {
        title: 'Import Deals',
        href: '/deals/import',
        icon: Upload,
    },
    {
        title: 'Scoring',
        href: '/scoring',
        icon: TrendingUp,
    },
    {
        title: 'Scoring Jobs',
        href: '/scoring/jobs',
        icon: Zap,
    },
    {
        title: 'Compare Scores',
        href: '/scoring/compare',
        icon: Equal,
    },
    {
        title: 'Thesis',
        href: '/thesis',
        icon: Target,
    },
    {
        title: 'New Thesis',
        href: '/thesis/new',
        icon: Plus,
    },
    {
        title: 'Founders',
        href: '/founders',
        icon: Users,
    },
    {
        title: 'New Founder',
        href: '/founders/new',
        icon: UserPlus,
    },
    {
        title: 'Startups',
        href: '/startups',
        icon: Building2,
    },
    {
        title: 'Portfolio',
        href: '/portfolio',
        icon: Wallet,
    },
    {
        title: 'Manage Portfolios',
        href: '/portfolio/management',
        icon: Settings, // Reusing settings icon for management
    },
    {
        title: 'New Portfolio',
        href: '/portfolio/management/new',
        icon: Plus,
    },
    {
        title: 'Alerts',
        href: '/alerts',
        icon: Bell,
        badge: 3,
    },
    {
        title: 'Reports',
        href: '/reports',
        icon: FileText,
    },
    {
        title: 'Generate Report',
        href: '/reports/generate',
        icon: Plus,
    },
    {
        title: 'Settings',
        href: '/settings',
        icon: Settings,
    },
]

interface SidebarProps {
    isOpen?: boolean
    onClose?: () => void
}

export function Sidebar({ isOpen = true, onClose }: SidebarProps) {
    const pathname = usePathname()
    const [collapsed, setCollapsed] = useState(false)

    return (
        <>
            {/* Mobile overlay */}
            {isOpen && (
                <div
                    className="fixed inset-0 z-40 bg-background/80 backdrop-blur-sm md:hidden"
                    onClick={onClose}
                />
            )}

            {/* Sidebar */}
            <aside
                className={cn(
                    "fixed left-0 top-16 z-40 h-[calc(100vh-4rem)] border-r bg-background transition-all duration-300",
                    collapsed ? "w-16" : "w-64",
                    isOpen ? "translate-x-0" : "-translate-x-full md:translate-x-0"
                )}
            >
                <div className="flex h-full flex-col">
                    {/* Collapse button - desktop only */}
                    <div className="hidden md:flex justify-end p-2">
                        <Button
                            variant="ghost"
                            size="icon"
                            onClick={() => setCollapsed(!collapsed)}
                            className="h-8 w-8"
                        >
                            {collapsed ? (
                                <ChevronRight className="h-4 w-4" />
                            ) : (
                                <ChevronLeft className="h-4 w-4" />
                            )}
                        </Button>
                    </div>

                    {/* Navigation */}
                    <nav className="flex-1 space-y-1 p-2 overflow-y-auto">
                        {navItems.map((item) => {
                            const Icon = item.icon
                            const isActive = pathname === item.href ||
                                pathname.startsWith(item.href + '/')

                            return (
                                <Link
                                    key={item.href}
                                    href={item.href}
                                    className={cn(
                                        "flex items-center gap-3 rounded-lg px-3 py-2 text-sm font-medium transition-colors",
                                        isActive
                                            ? "bg-primary text-primary-foreground"
                                            : "text-muted-foreground hover:bg-accent hover:text-accent-foreground",
                                        collapsed && "justify-center"
                                    )}
                                    onClick={onClose}
                                >
                                    <Icon className={cn("h-5 w-5 flex-shrink-0")} />
                                    {!collapsed && (
                                        <>
                                            <span className="flex-1">{item.title}</span>
                                            {item.badge && (
                                                <span className="flex h-5 w-5 items-center justify-center rounded-full bg-primary text-primary-foreground text-xs">
                                                    {item.badge}
                                                </span>
                                            )}
                                        </>
                                    )}
                                </Link>
                            )
                        })}
                    </nav>

                    {/* Footer */}
                    {!collapsed && (
                        <div className="border-t p-4">
                            <div className="text-xs text-muted-foreground">
                                <p>Version 1.0.0</p>
                                <p>© 2024 Capital Ranker</p>
                            </div>
                        </div>
                    )}
                </div>
            </aside>
        </>
    )
}
