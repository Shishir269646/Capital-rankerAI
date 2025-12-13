"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.dealService = exports.DealService = void 0;
const Startup_1 = __importDefault(require("../model/Startup"));
const Score_1 = __importDefault(require("../model/Score"));
const cache_service_1 = require("./cache.service");
const xlsx_1 = __importDefault(require("xlsx"));
class DealService {
    constructor() {
        this.CACHE_PREFIX = 'deal:';
        this.CACHE_TTL = 300;
    }
    async getAllDeals(params) {
        const { page, limit, filters, sortBy, sortOrder, scoreMin, scoreMax } = params;
        const skip = (page - 1) * limit;
        const pipeline = [{ $match: filters }];
        if (scoreMin !== undefined || scoreMax !== undefined) {
            pipeline.push({
                $lookup: {
                    from: 'scores',
                    let: { startup_id: '$_id' },
                    pipeline: [
                        {
                            $match: {
                                $expr: { $eq: ['$startup_id', '$$startup_id'] },
                                is_latest: true,
                            },
                        },
                    ],
                    as: 'latest_score',
                },
            }, { $unwind: { path: '$latest_score', preserveNullAndEmptyArrays: true } });
            if (scoreMin !== undefined) {
                pipeline.push({
                    $match: { 'latest_score.investment_fit_score': { $gte: scoreMin } },
                });
            }
            if (scoreMax !== undefined) {
                pipeline.push({
                    $match: { 'latest_score.investment_fit_score': { $lte: scoreMax } },
                });
            }
        }
        const sortDirection = sortOrder === 'asc' ? 1 : -1;
        pipeline.push({ $sort: { [sortBy]: sortDirection } });
        const countPipeline = [...pipeline, { $count: 'total' }];
        const countResult = await Startup_1.default.aggregate(countPipeline);
        const total = countResult.length > 0 ? countResult[0].total : 0;
        pipeline.push({ $skip: skip }, { $limit: limit });
        pipeline.push({
            $lookup: {
                from: 'founders',
                localField: 'founders',
                foreignField: '_id',
                as: 'founders_info',
            },
        });
        const deals = await Startup_1.default.aggregate(pipeline);
        return {
            deals,
            total,
            page,
            totalPages: Math.ceil(total / limit),
        };
    }
    async getDealById(dealId) {
        const cacheKey = `${this.CACHE_PREFIX}${dealId}`;
        const cached = await cache_service_1.cacheService.get(cacheKey);
        if (cached) {
            return JSON.parse(cached);
        }
        const deal = await Startup_1.default.findById(dealId).populate('founders').lean();
        if (!deal) {
            return null;
        }
        const latestScore = await Score_1.default.findOne({
            startup_id: dealId,
            is_latest: true,
        }).lean();
        const result = {
            ...deal,
            latest_score: latestScore,
        };
        await cache_service_1.cacheService.set(cacheKey, JSON.stringify(result), this.CACHE_TTL);
        return result;
    }
    async createDeal(dealData) {
        const deal = new Startup_1.default(dealData);
        await deal.save();
        return deal;
    }
    async updateDeal(dealId, updateData) {
        const deal = await Startup_1.default.findByIdAndUpdate(dealId, { $set: updateData }, { new: true, runValidators: true });
        if (deal) {
            const cacheKey = `${this.CACHE_PREFIX}${dealId}`;
            await cache_service_1.cacheService.delete(cacheKey);
        }
        return deal;
    }
    async addNote(dealId, userId, content) {
        const deal = await Startup_1.default.findByIdAndUpdate(dealId, {
            $push: {
                notes: {
                    user_id: userId,
                    content,
                    created_at: new Date(),
                },
            },
        }, { new: true });
        return deal;
    }
    async getDealStatistics() {
        const cacheKey = 'deal:stats';
        const cached = await cache_service_1.cacheService.get(cacheKey);
        if (cached) {
            return JSON.parse(cached);
        }
        const stats = await Startup_1.default.aggregate([
            {
                $facet: {
                    totalDeals: [{ $count: 'count' }],
                    byStage: [{ $group: { _id: '$stage', count: { $sum: 1 } } }],
                    bySector: [
                        { $unwind: '$sector' },
                        { $group: { _id: '$sector', count: { $sum: 1 } } },
                        { $sort: { count: -1 } },
                        { $limit: 10 },
                    ],
                    byStatus: [{ $group: { _id: '$status', count: { $sum: 1 } } }],
                    byCountry: [
                        { $group: { _id: '$location.country', count: { $sum: 1 } } },
                        { $sort: { count: -1 } },
                        { $limit: 10 },
                    ],
                    averageMetrics: [
                        {
                            $group: {
                                _id: null,
                                avgRevenue: { $avg: '$metrics.revenue' },
                                avgGrowthRate: { $avg: '$metrics.growth_rate_yoy' },
                                avgTeamSize: { $avg: '$team_size' },
                            },
                        },
                    ],
                },
            },
        ]);
        const result = {
            total: stats[0].totalDeals[0]?.count || 0,
            byStage: stats[0].byStage,
            bySector: stats[0].bySector,
            byStatus: stats[0].byStatus,
            byCountry: stats[0].byCountry,
            averageMetrics: stats[0].averageMetrics[0] || {},
        };
        await cache_service_1.cacheService.set(cacheKey, JSON.stringify(result), 600);
        return result;
    }
    async advancedSearch(params) {
        const { query, sectors, stages, minRevenue, maxRevenue, minGrowthRate, countries, technologies, page, limit, } = params;
        const filters = {};
        if (query) {
            filters.$text = { $search: query };
        }
        if (sectors && sectors.length > 0) {
            filters.sector = { $in: sectors };
        }
        if (stages && stages.length > 0) {
            filters.stage = { $in: stages };
        }
        if (minRevenue !== undefined || maxRevenue !== undefined) {
            filters['metrics.revenue'] = {};
            if (minRevenue !== undefined) {
                filters['metrics.revenue'].$gte = minRevenue;
            }
            if (maxRevenue !== undefined) {
                filters['metrics.revenue'].$lte = maxRevenue;
            }
        }
        if (minGrowthRate !== undefined) {
            filters['metrics.growth_rate_yoy'] = { $gte: minGrowthRate };
        }
        if (countries && countries.length > 0) {
            filters['location.country'] = { $in: countries };
        }
        if (technologies && technologies.length > 0) {
            filters.technology_stack = { $in: technologies };
        }
        return await this.getAllDeals({
            page,
            limit,
            filters,
            sortBy: 'created_at',
            sortOrder: 'desc',
        });
    }
    async getTopRankedDeals(limit) {
        const cacheKey = `top_ranked:${limit}`;
        const cached = await cache_service_1.cacheService.get(cacheKey);
        if (cached) {
            return JSON.parse(cached);
        }
        const deals = await Startup_1.default.aggregate([
            {
                $lookup: {
                    from: 'scores',
                    let: { startup_id: '$_id' },
                    pipeline: [
                        {
                            $match: {
                                $expr: { $eq: ['$startup_id', '$$startup_id'] },
                                is_latest: true,
                            },
                        },
                    ],
                    as: 'latest_score',
                },
            },
            { $unwind: '$latest_score' },
            { $sort: { 'latest_score.investment_fit_score': -1 } },
            { $limit: limit },
            {
                $lookup: {
                    from: 'founders',
                    localField: 'founders',
                    foreignField: '_id',
                    as: 'founders_info',
                },
            },
        ]);
        await cache_service_1.cacheService.set(cacheKey, JSON.stringify(deals), 300);
        return deals;
    }
    async getSimilarDeals(dealId, limit) {
        const deal = await Startup_1.default.findById(dealId);
        if (!deal) {
            return [];
        }
        const similarDeals = await Startup_1.default.find({
            _id: { $ne: dealId },
            sector: { $in: deal.sector },
            stage: deal.stage,
            'location.country': deal.location.country,
            status: 'active',
        })
            .limit(limit)
            .populate('founders')
            .lean();
        return similarDeals;
    }
    async bulkCreateDeals(deals) {
        let created = 0;
        let failed = 0;
        const errors = [];
        for (const dealData of deals) {
            try {
                await this.createDeal(dealData);
                created++;
            }
            catch (error) {
                failed++;
                errors.push({
                    deal: dealData.name,
                    error: error.message,
                });
            }
        }
        return { created, failed, errors };
    }
    async exportDeals(format, filters) {
        const deals = await Startup_1.default.find(filters).lean();
        const exportData = deals.map((deal) => ({
            Name: deal.name,
            Description: deal.description,
            Sector: deal.sector.join(', '),
            Stage: deal.stage,
            Revenue: deal.metrics.revenue,
            'Growth Rate (YoY)': deal.metrics.growth_rate_yoy,
            'Team Size': deal.team_size,
            Country: deal.location.country,
            Website: deal.website,
            Status: deal.status,
            'Founded Date': deal.founded_date.toISOString().split('T')[0],
        }));
        const worksheet = xlsx_1.default.utils.json_to_sheet(exportData);
        const workbook = xlsx_1.default.utils.book_new();
        xlsx_1.default.utils.book_append_sheet(workbook, worksheet, 'Deals');
        const buffer = xlsx_1.default.write(workbook, {
            type: 'buffer',
            bookType: format === 'csv' ? 'csv' : 'xlsx',
        });
        return buffer;
    }
}
exports.DealService = DealService;
exports.dealService = new DealService();
//# sourceMappingURL=deal.service.js.map