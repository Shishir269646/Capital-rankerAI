'use client'

import Link from 'next/link'
import {
    TrendingUp,
    Users,
    MapPin,
    Calendar,
    MoreVertical,
    Eye,
    Edit,
    Trash2,
    Star,
    StarOff
} from 'lucide-react'
import { Card, CardContent, CardFooter } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import {
    DropdownMenu,
    DropdownMenuContent,
    DropdownMenuItem,
    DropdownMenuSeparator,
    DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu'
import { cn } from '@/lib/utils/cn'
import { formatDate } from '@/lib/utils/format';
import { formatCurrency } from '@/lib/utils/currency';
import type { Deal } from '@/types/deal.types';

interface DealCardProps {
    deal: Deal
    onView?: (id: string) => void
    onEdit?: (id: string) => void
    onDelete?: (id: string) => void
    onToggleFavorite?: (id: string) => void
    isFavorite?: boolean
}

export function DealCard({
    deal,
    onView,
    onEdit,
    onDelete,
    onToggleFavorite,
    isFavorite = false
}: DealCardProps) {
    const score = deal.score?.investment_fit_score || 0
    const scoreVariant = getScoreVariant(score)

    return (
        <Card className="group relative overflow-hidden transition-all hover:shadow-lg">
            {/* Score Badge - Top Right */}
            {deal.score && (
                <div className="absolute top-4 right-4 z-10">
                    <Badge
                        variant={scoreVariant}
                        className="text-lg font-bold px-3 py-1"
                    >
                        {score}
                    </Badge>
                </div>
            )}

            <CardContent className="p-6">
                {/* Header */}
                <div className="mb-4 pr-16">
                    <div className="flex items-start justify-between gap-2 mb-2">
                        <Link
                            href={`/deals/${deal.id}`}
                            className="hover:underline"
                        >
                            <h3 className="text-lg font-semibold line-clamp-1">
                                {deal.name}
                            </h3>
                        </Link>

                        {/* Favorite Button */}
                        <Button
                            variant="ghost"
                            size="icon"
                            className="h-8 w-8 absolute top-4 left-4"
                            onClick={() => onToggleFavorite?.(deal.id)}
                        >
                            {isFavorite ? (
                                <Star className="h-4 w-4 fill-yellow-400 text-yellow-400" />
                            ) : (
                                <StarOff className="h-4 w-4" />
                            )}
                        </Button>
                    </div>

                    {/* Sectors */}
                    <div className="flex flex-wrap gap-1 mb-3">
                        {deal.sector.slice(0, 3).map((sector) => (
                            <Badge
                                key={sector}
                                variant="secondary"
                                className="text-xs"
                            >
                                {sector}
                            </Badge>
                        ))}
                        {deal.sector.length > 3 && (
                            <Badge variant="secondary" className="text-xs">
                                +{deal.sector.length - 3}
                            </Badge>
                        )}
                    </div>

                    {/* Stage Badge */}
                    <Badge variant="outline" className="mb-3">
                        {deal.stage}
                    </Badge>
                </div>

                {/* Description */}
                <p className="text-sm text-muted-foreground line-clamp-2 mb-4">
                    {deal.description}
                </p>

                {/* Metrics Grid */}
                <div className="grid grid-cols-2 gap-4 mb-4">
                    {/* Revenue */}
                    <div className="space-y-1">
                        <p className="text-xs text-muted-foreground">Revenue</p>
                        <p className="text-sm font-semibold">
                            {formatCurrency(deal.metrics.revenue)}
                        </p>
                    </div>

                    {/* Growth Rate */}
                    <div className="space-y-1">
                        <p className="text-xs text-muted-foreground">Growth (YoY)</p>
                        <div className="flex items-center gap-1">
                            <TrendingUp className="h-3 w-3 text-green-500" />
                            <p className="text-sm font-semibold text-green-600">
                                {deal.metrics.growth_rate_yoy}%
                            </p>
                        </div>
                    </div>

                    {/* Team Size */}
                    <div className="space-y-1">
                        <p className="text-xs text-muted-foreground">Team</p>
                        <div className="flex items-center gap-1">
                            <Users className="h-3 w-3" />
                            <p className="text-sm font-semibold">
                                {deal.team_size} members
                            </p>
                        </div>
                    </div>

                    {/* Location */}
                    <div className="space-y-1">
                        <p className="text-xs text-muted-foreground">Location</p>
                        <div className="flex items-center gap-1">
                            <MapPin className="h-3 w-3" />
                            <p className="text-sm font-semibold line-clamp-1">
                                {deal.location.city}
                            </p>
                        </div>
                    </div>
                </div>

                {/* Founded Date */}
                <div className="flex items-center gap-2 text-xs text-muted-foreground">
                    <Calendar className="h-3 w-3" />
                    <span>Founded {formatDate(deal.founded_date)}</span>
                </div>
            </CardContent>

            <CardFooter className="p-6 pt-0 flex justify-between items-center">
                {/* View Button */}
                <Button
                    variant="outline"
                    size="sm"
                    onClick={() => onView?.(deal.id)}
                    asChild
                >
                    <Link href={`/deals/${deal.id}`}>
                        <Eye className="h-4 w-4 mr-2" />
                        View Details
                    </Link>
                </Button>

                {/* Actions Menu */}
                <DropdownMenu>
                    <DropdownMenuTrigger asChild>
                        <Button variant="ghost" size="icon">
                            <MoreVertical className="h-4 w-4" />
                        </Button>
                    </DropdownMenuTrigger>
                    <DropdownMenuContent align="end">
                        <DropdownMenuItem onClick={() => onEdit?.(deal.id)}>
                            <Edit className="h-4 w-4 mr-2" />
                            Edit
                        </DropdownMenuItem>
                        <DropdownMenuItem>
                            <TrendingUp className="h-4 w-4 mr-2" />
                            Score
                        </DropdownMenuItem>
                        <DropdownMenuSeparator />
                        <DropdownMenuItem
                            className="text-destructive"
                            onClick={() => onDelete?.(deal.id)}
                        >
                            <Trash2 className="h-4 w-4 mr-2" />
                            Delete
                        </DropdownMenuItem>
                    </DropdownMenuContent>
                </DropdownMenu>
            </CardFooter>
        </Card>
    )
}

// Helper function to determine score badge variant
function getScoreVariant(score: number): "default" | "secondary" | "success" | "warning" | "destructive" {
    if (score >= 80) return "success"
    if (score >= 60) return "warning"
    if (score >= 40) return "secondary"
    return "destructive"
}

// ==============================================
// src/components/deals/DealTable.tsx
// Deal Data Table Component
// ==============================================
