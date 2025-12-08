'use client'

import { useState } from 'react'
import { X, Search } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Checkbox } from '@/components/ui/checkbox'
import { Separator } from '@/components/ui/separator'
import { Badge } from '@/components/ui/badge'

interface DealFiltersProps {
    onFilterChange?: (filters: FilterState) => void
    onReset?: () => void
}

interface FilterState {
    search?: string
    sectors?: string[]
    stages?: string[]
    scoreMin?: number
    scoreMax?: number
}

const SECTORS = [
    'fintech', 'healthtech', 'edtech', 'e-commerce', 'saas',
    'ai-ml', 'blockchain', 'iot', 'cybersecurity', 'climate-tech'
]

const STAGES = ['pre-seed', 'seed', 'series-a', 'series-b', 'series-c', 'growth']

export function DealFilters({ onFilterChange, onReset }: DealFiltersProps) {
    const [filters, setFilters] = useState<FilterState>({
        search: '',
        sectors: [],
        stages: [],
        scoreMin: 0,
        scoreMax: 100
    })

    const handleSearchChange = (value: string) => {
        const newFilters = { ...filters, search: value }
        setFilters(newFilters)
        onFilterChange?.(newFilters)
    }

    const handleSectorToggle = (sector: string) => {
        const sectors = filters.sectors || []
        const newSectors = sectors.includes(sector)
            ? sectors.filter(s => s !== sector)
            : [...sectors, sector]

        const newFilters = { ...filters, sectors: newSectors }
        setFilters(newFilters)
        onFilterChange?.(newFilters)
    }

    const handleStageToggle = (stage: string) => {
        const stages = filters.stages || []
        const newStages = stages.includes(stage)
            ? stages.filter(s => s !== stage)
            : [...stages, stage]

        const newFilters = { ...filters, stages: newStages }
        setFilters(newFilters)
        onFilterChange?.(newFilters)
    }

    const handleReset = () => {
        const resetFilters = {
            search: '',
            sectors: [],
            stages: [],
            scoreMin: 0,
            scoreMax: 100
        }
        setFilters(resetFilters)
        onReset?.()
    }

    const activeFilterCount =
        (filters.sectors?.length || 0) +
        (filters.stages?.length || 0)

    return (
        <div className="space-y-6">
            {/* Header */}
            <div className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                    <h3 className="font-semibold">Filters</h3>
                    {activeFilterCount > 0 && (
                        <Badge variant="secondary">{activeFilterCount}</Badge>
                    )}
                </div>
                <Button
                    variant="ghost"
                    size="sm"
                    onClick={handleReset}
                >
                    <X className="h-4 w-4 mr-1" />
                    Clear
                </Button>
            </div>

            <Separator />

            {/* Search */}
            <div className="space-y-2">
                <Label>Search</Label>
                <div className="relative">
                    <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
                    <Input
                        placeholder="Search deals..."
                        className="pl-8"
                        value={filters.search}
                        onChange={(e) => handleSearchChange(e.target.value)}
                    />
                </div>
            </div>

            <Separator />

            {/* Sectors */}
            <div className="space-y-3">
                <Label>Sectors</Label>
                <div className="space-y-2 max-h-48 overflow-y-auto">
                    {SECTORS.map((sector) => (
                        <div key={sector} className="flex items-center space-x-2">
                            <Checkbox
                                id={`sector-${sector}`}
                                checked={filters.sectors?.includes(sector)}
                                onCheckedChange={() => handleSectorToggle(sector)}
                            />
                            <label
                                htmlFor={`sector-${sector}`}
                                className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70 cursor-pointer"
                            >
                                {sector}
                            </label>
                        </div>
                    ))}
                </div>
            </div>

            <Separator />

            {/* Stages */}
            <div className="space-y-3">
                <Label>Stages</Label>
                <div className="space-y-2">
                    {STAGES.map((stage) => (
                        <div key={stage} className="flex items-center space-x-2">
                            <Checkbox
                                id={`stage-${stage}`}
                                checked={filters.stages?.includes(stage)}
                                onCheckedChange={() => handleStageToggle(stage)}
                            />
                            <label
                                htmlFor={`stage-${stage}`}
                                className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70 cursor-pointer"
                            >
                                {stage}
                            </label>
                        </div>
                    ))}
                </div>
            </div>

            <Separator />

            {/* Score Range */}
            <div className="space-y-3">
                <Label>Investment Score</Label>
                <div className="grid grid-cols-2 gap-2">
                    <Input
                        type="number"
                        placeholder="Min"
                        min={0}
                        max={100}
                        value={filters.scoreMin}
                        onChange={(e) => setFilters({ ...filters, scoreMin: Number(e.target.value) })}
                    />
                    <Input
                        type="number"
                        placeholder="Max"
                        min={0}
                        max={100}
                        value={filters.scoreMax}
                        onChange={(e) => setFilters({ ...filters, scoreMax: Number(e.target.value) })}
                    />
                </div>
            </div>
        </div>
    )
}

