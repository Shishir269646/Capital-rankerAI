'use client'

import {
    TrendingUp,
    Users,
    MapPin,
    Calendar,
    Globe,
    DollarSign,
    Briefcase,
    Target
} from 'lucide-react'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { Separator } from '@/components/ui/separator'
import { formatCurrency } from '@/lib/utils/currency';
import { formatCompactNumber, formatDate } from '@/lib/utils/format';
import type { Deal } from '@/types/deal.types'

interface DealDetailProps {
    deal: Deal
}

export function DealDetail({ deal }: DealDetailProps) {
    return (
        <div className="space-y-6">
            {/* Header Info */}
            <Card>
                <CardHeader>
                    <div className="flex items-start justify-between">
                        <div className="space-y-2">
                            <CardTitle className="text-3xl">{deal.name}</CardTitle>
                            <p className="text-muted-foreground">{deal.description}</p>
                        </div>
                        {deal.score && (
                            <Badge
                                variant="success"
                                className="text-2xl px-4 py-2"
                            >
                                {deal.score.investment_fit_score}/100
                            </Badge>
                        )}
                    </div>
                </CardHeader>
                <CardContent>
                    <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
                        {/* Sectors */}
                        <div>
                            <p className="text-sm text-muted-foreground mb-2">Sectors</p>
                            <div className="flex flex-wrap gap-1">
                                {deal.sector.map((sector) => (
                                    <Badge key={sector} variant="secondary">
                                        {sector}
                                    </Badge>
                                ))}
                            </div>
                        </div>

                        {/* Stage */}
                        <div>
                            <p className="text-sm text-muted-foreground mb-2">Stage</p>
                            <Badge variant="outline" className="text-base">
                                {deal.stage}
                            </Badge>
                        </div>

                        {/* Location */}
                        <div>
                            <p className="text-sm text-muted-foreground mb-2">Location</p>
                            <div className="flex items-center gap-2">
                                <MapPin className="h-4 w-4" />
                                <span className="font-medium">
                                    {deal.location.city}, {deal.location.country}
                                </span>
                            </div>
                        </div>

                        {/* Founded */}
                        <div>
                            <p className="text-sm text-muted-foreground mb-2">Founded</p>
                            <div className="flex items-center gap-2">
                                <Calendar className="h-4 w-4" />
                                <span className="font-medium">
                                    {formatDate(deal.founded_date)}
                                </span>
                            </div>
                        </div>
                    </div>

                    <Separator className="my-6" />

                    {/* Website & Contact */}
                    <div className="flex items-center gap-6">
                        <a
                            href={deal.website}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="flex items-center gap-2 text-primary hover:underline"
                        >
                            <Globe className="h-4 w-4" />
                            {deal.website}
                        </a>
                    </div>
                </CardContent>
            </Card>

            {/* Key Metrics */}
            <Card>
                <CardHeader>
                    <CardTitle>Key Metrics</CardTitle>
                </CardHeader>
                <CardContent>
                    <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
                        {/* Revenue */}
                        <MetricCard
                            icon={<DollarSign className="h-5 w-5" />}
                            label="Revenue"
                            value={formatCurrency(deal.metrics.revenue)}
                            trend={deal.metrics.growth_rate_yoy > 0 ? 'up' : undefined}
                        />

                        {/* Growth Rate */}
                        <MetricCard
                            icon={<TrendingUp className="h-5 w-5" />}
                            label="Growth (YoY)"
                            value={`${deal.metrics.growth_rate_yoy}%`}
                            trend={deal.metrics.growth_rate_yoy > 50 ? 'up' : undefined}
                        />

                        {/* Team Size */}
                        <MetricCard
                            icon={<Users className="h-5 w-5" />}
                            label="Team Size"
                            value={deal.team_size.toString()}
                        />

                        {/* Runway */}
                        <MetricCard
                            icon={<Target className="h-5 w-5" />}
                            label="Runway"
                            value={`${deal.metrics.runway_months} months`}
                            trend={deal.metrics.runway_months > 12 ? 'up' : 'down'}
                        />
                    </div>
                </CardContent>
            </Card>

            {/* Financial Details */}
            <Card>
                <CardHeader>
                    <CardTitle>Financial Details</CardTitle>
                </CardHeader>
                <CardContent>
                    <div className="space-y-4">
                        <DetailRow
                            label="Monthly Recurring Revenue (MRR)"
                            value={deal.metrics.mrr ? formatCurrency(deal.metrics.mrr) : 'N/A'}
                        />
                        <DetailRow
                            label="Annual Recurring Revenue (ARR)"
                            value={deal.metrics.arr ? formatCurrency(deal.metrics.arr) : 'N/A'}
                        />
                        <DetailRow
                            label="Burn Rate"
                            value={formatCurrency(deal.metrics.burn_rate)}
                        />
                        <DetailRow
                            label="Gross Margin"
                            value={deal.metrics.gross_margin ? `${deal.metrics.gross_margin}%` : 'N/A'}
                        />
                        <DetailRow
                            label="Customer Count"
                            value={deal.metrics.customer_count ? formatCompactNumber(deal.metrics.customer_count) : 'N/A'}
                        />
                    </div>
                </CardContent>
            </Card>

            {/* Business Details */}
            <Card>
                <CardHeader>
                    <CardTitle>Business Information</CardTitle>
                </CardHeader>
                <CardContent>
                    <div className="space-y-4">
                        <div>
                            <h4 className="font-medium mb-2">Target Market</h4>
                            <p className="text-muted-foreground">{deal.target_market || 'Not specified'}</p>
                        </div>
                        <Separator />
                        <div>
                            <h4 className="font-medium mb-2">Competitive Advantage</h4>
                            <p className="text-muted-foreground">{deal.competitive_advantage || 'Not specified'}</p>
                        </div>
                        <Separator />
                        <div>
                            <h4 className="font-medium mb-2">Business Model</h4>
                            <Badge variant="outline">{deal.business_model}</Badge>
                        </div>
                    </div>
                </CardContent>
            </Card>
        </div>
    )
}

// Helper Components
function MetricCard({
    icon,
    label,
    value,
    trend
}: {
    icon: React.ReactNode
    label: string
    value: string
    trend?: 'up' | 'down'
}) {
    return (
        <div className="space-y-2">
            <div className="flex items-center gap-2 text-muted-foreground">
                {icon}
                <p className="text-sm">{label}</p>
            </div>
            <p className="text-2xl font-bold">{value}</p>
            {trend && (
                <div className="flex items-center gap-1">
                    <TrendingUp className={`h-3 w-3 ${trend === 'up' ? 'text-green-500' : 'text-red-500'}`} />
                    <span className={`text-xs ${trend === 'up' ? 'text-green-600' : 'text-red-600'}`}>
                        {trend === 'up' ? 'Growing' : 'Declining'}
                    </span>
                </div>
            )}
        </div>
    )
}

function DetailRow({ label, value }: { label: string; value: string }) {
    return (
        <div className="flex justify-between items-center">
            <span className="text-muted-foreground">{label}</span>
            <span className="font-medium">{value}</span>
        </div>
    )
}

