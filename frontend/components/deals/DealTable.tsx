'use client'

import { useState } from 'react'
import Link from 'next/link'
import {
    MoreVertical,
    ArrowUpDown,
    Eye,
    Edit,
    Trash2,
    TrendingUp,
    ChevronLeft,
    ChevronRight
} from 'lucide-react'
import {
    Table,
    TableBody,
    TableCell,
    TableHead,
    TableHeader,
    TableRow,
} from '@/components/ui/table'
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Checkbox } from '@/components/ui/checkbox';
import {
    DropdownMenu,
    DropdownMenuContent,
    DropdownMenuItem,
    DropdownMenuSeparator,
    DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu'
import { formatCurrency } from '@/lib/utils/currency';
import { formatDate } from '@/lib/utils/format';
import type { Deal } from '@/types/deal.types'

interface DealTableProps {
    deals: Deal[]
    loading?: boolean
    onSort?: (column: string) => void
    selectedIds?: string[]
    onSelect?: (ids: string[]) => void
    onAction?: (action: string, id: string) => void
    pagination?: {
        page: number
        totalPages: number
        onPageChange: (page: number) => void
    }
}

export function DealTable({
    deals,
    loading = false,
    onSort,
    selectedIds = [],
    onSelect,
    onAction,
    pagination
}: DealTableProps) {
    const [sortColumn, setSortColumn] = useState<string>('')
    const [sortDirection, setSortDirection] = useState<'asc' | 'desc'>('desc')

    const handleSort = (column: string) => {
        const newDirection =
            sortColumn === column && sortDirection === 'asc' ? 'desc' : 'asc'
        setSortColumn(column)
        setSortDirection(newDirection)
        onSort?.(column)
    }

    const handleSelectAll = (checked: boolean) => {
        if (checked) {
            onSelect?.(deals.map(deal => deal.id))
        } else {
            onSelect?.([])
        }
    }

    const handleSelectOne = (id: string, checked: boolean) => {
        if (checked) {
            onSelect?.([...selectedIds, id])
        } else {
            onSelect?.(selectedIds.filter(selectedId => selectedId !== id))
        }
    }

    if (loading) {
        return (
            <div className="space-y-3">
                {[...Array(5)].map((_, i) => (
                    <div key={i} className="h-16 bg-muted animate-pulse rounded" />
                ))}
            </div>
        )
    }

    return (
        <div className="space-y-4">
            <div className="rounded-md border">
                <Table>
                    <TableHeader>
                        <TableRow>
                            {/* Checkbox */}
                            <TableHead className="w-12">
                                <Checkbox
                                    checked={selectedIds.length === deals.length && deals.length > 0}
                                    onCheckedChange={handleSelectAll}
                                />
                            </TableHead>

                            {/* Name */}
                            <TableHead>
                                <Button
                                    variant="ghost"
                                    size="sm"
                                    onClick={() => handleSort('name')}
                                    className="-ml-3"
                                >
                                    Name
                                    <ArrowUpDown className="ml-2 h-4 w-4" />
                                </Button>
                            </TableHead>

                            {/* Sector */}
                            <TableHead>Sector</TableHead>

                            {/* Stage */}
                            <TableHead>Stage</TableHead>

                            {/* Score */}
                            <TableHead>
                                <Button
                                    variant="ghost"
                                    size="sm"
                                    onClick={() => handleSort('score')}
                                    className="-ml-3"
                                >
                                    Score
                                    <ArrowUpDown className="ml-2 h-4 w-4" />
                                </Button>
                            </TableHead>

                            {/* Revenue */}
                            <TableHead>
                                <Button
                                    variant="ghost"
                                    size="sm"
                                    onClick={() => handleSort('revenue')}
                                    className="-ml-3"
                                >
                                    Revenue
                                    <ArrowUpDown className="ml-2 h-4 w-4" />
                                </Button>
                            </TableHead>

                            {/* Growth */}
                            <TableHead>Growth</TableHead>

                            {/* Team */}
                            <TableHead>Team</TableHead>

                            {/* Actions */}
                            <TableHead className="w-12"></TableHead>
                        </TableRow>
                    </TableHeader>

                    <TableBody>
                        {deals.length === 0 ? (
                            <TableRow>
                                <TableCell colSpan={9} className="text-center text-muted-foreground py-8">
                                    No deals found
                                </TableCell>
                            </TableRow>
                        ) : (
                            deals.map((deal) => (
                                <TableRow key={deal.id}>
                                    {/* Checkbox */}
                                    <TableCell>
                                        <Checkbox
                                            checked={selectedIds.includes(deal.id)}
                                            onCheckedChange={(checked) =>
                                                handleSelectOne(deal.id, checked as boolean)
                                            }
                                        />
                                    </TableCell>

                                    {/* Name */}
                                    <TableCell>
                                        <Link
                                            href={`/deals/${deal.id}`}
                                            className="font-medium hover:underline"
                                        >
                                            {deal.name}
                                        </Link>
                                        <p className="text-xs text-muted-foreground line-clamp-1">
                                            {deal.location.city}, {deal.location.country}
                                        </p>
                                    </TableCell>

                                    {/* Sector */}
                                    <TableCell>
                                        <div className="flex flex-wrap gap-1">
                                            {deal.sector.slice(0, 2).map((sector) => (
                                                <Badge key={sector} variant="secondary" className="text-xs">
                                                    {sector}
                                                </Badge>
                                            ))}
                                            {deal.sector.length > 2 && (
                                                <Badge variant="secondary" className="text-xs">
                                                    +{deal.sector.length - 2}
                                                </Badge>
                                            )}
                                        </div>
                                    </TableCell>

                                    {/* Stage */}
                                    <TableCell>
                                        <Badge variant="outline">{deal.stage}</Badge>
                                    </TableCell>

                                    {/* Score */}
                                    <TableCell>
                                        {deal.score ? (
                                            <Badge variant={getScoreVariant(deal.score.investment_fit_score)}>
                                                {deal.score.investment_fit_score}
                                            </Badge>
                                        ) : (
                                            <span className="text-muted-foreground text-sm">-</span>
                                        )}
                                    </TableCell>

                                    {/* Revenue */}
                                    <TableCell className="font-medium">
                                        {formatCurrency(deal.metrics.revenue)}
                                    </TableCell>

                                    {/* Growth */}
                                    <TableCell>
                                        <div className="flex items-center gap-1">
                                            <TrendingUp className="h-3 w-3 text-green-500" />
                                            <span className="text-sm text-green-600">
                                                {deal.metrics.growth_rate_yoy}%
                                            </span>
                                        </div>
                                    </TableCell>

                                    {/* Team */}
                                    <TableCell>{deal.team_size}</TableCell>

                                    {/* Actions */}
                                    <TableCell>
                                        <DropdownMenu>
                                            <DropdownMenuTrigger asChild>
                                                <Button variant="ghost" size="icon">
                                                    <MoreVertical className="h-4 w-4" />
                                                </Button>
                                            </DropdownMenuTrigger>
                                            <DropdownMenuContent align="end">
                                                <DropdownMenuItem asChild>
                                                    <Link href={`/deals/${deal.id}`} onClick={() => onAction?.("view", deal.id)}>
                                                        <Eye className="h-4 w-4 mr-2" />
                                                        View
                                                    </Link>
                                                </DropdownMenuItem>
                                                <DropdownMenuItem onClick={() => onAction?.("edit", deal.id)}>
                                                    <Edit className="h-4 w-4 mr-2" />
                                                    Edit
                                                </DropdownMenuItem>
                                                <DropdownMenuItem onClick={() => onAction?.("score", deal.id)}>
                                                    <TrendingUp className="h-4 w-4 mr-2" />
                                                    Score
                                                </DropdownMenuItem>
                                                <DropdownMenuSeparator />
                                                <DropdownMenuItem
                                                    className="text-destructive"
                                                    onClick={() => onAction?.("delete", deal.id)}
                                                >
                                                    <Trash2 className="h-4 w-4 mr-2" />
                                                    Delete
                                                </DropdownMenuItem>
                                            </DropdownMenuContent>
                                        </DropdownMenu>
                                    </TableCell>
                                </TableRow>
                            ))
                        )}
                    </TableBody>
                </Table>
            </div>

            {/* Pagination */}
            {pagination && pagination.totalPages > 1 && (
                <div className="flex items-center justify-between">
                    <p className="text-sm text-muted-foreground">
                        Page {pagination.page} of {pagination.totalPages}
                    </p>
                    <div className="flex gap-2">
                        <Button
                            variant="outline"
                            size="sm"
                            onClick={() => pagination.onPageChange(pagination.page - 1)}
                            disabled={pagination.page === 1}
                        >
                            <ChevronLeft className="h-4 w-4 mr-1" />
                            Previous
                        </Button>
                        <Button
                            variant="outline"
                            size="sm"
                            onClick={() => pagination.onPageChange(pagination.page + 1)}
                            disabled={pagination.page === pagination.totalPages}
                        >
                            Next
                            <ChevronRight className="h-4 w-4 ml-1" />
                        </Button>
                    </div>
                </div>
            )}
        </div>
    )
}

function getScoreVariant(score: number): "default" | "secondary" | "success" | "warning" | "destructive" {
    if (score >= 80) return "success"
    if (score >= 60) return "warning"
    if (score >= 40) return "secondary"
    return "destructive"
}