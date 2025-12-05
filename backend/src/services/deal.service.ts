// src/services/deal.service.ts
import Startup, { IStartup } from '../model/Startup';
import Score from '../model/Score';

import { cacheService } from './cache.service';
import XLSX from 'xlsx';

interface GetDealsParams {
  page: number;
  limit: number;
  filters: any;
  sortBy: string;
  sortOrder: 'asc' | 'desc';
  scoreMin?: number;
  scoreMax?: number;
}

interface AdvancedSearchParams {
  query?: string;
  sectors?: string[];
  stages?: string[];
  minRevenue?: number;
  maxRevenue?: number;
  minGrowthRate?: number;
  countries?: string[];
  technologies?: string[];
  page: number;
  limit: number;
}

export class DealService {
  private readonly CACHE_PREFIX = 'deal:';
  private readonly CACHE_TTL = 300; // 5 minutes

  /**
   * Get all deals with pagination and filtering
   */
  async getAllDeals(params: GetDealsParams): Promise<{
    deals: any[];
    total: number;
    page: number;
    totalPages: number;
  }> {
    const { page, limit, filters, sortBy, sortOrder, scoreMin, scoreMax } = params;
    const skip = (page - 1) * limit;

    // Build aggregation pipeline
    const pipeline: any[] = [{ $match: filters }];

    // Join with latest scores if score filtering is needed
    if (scoreMin !== undefined || scoreMax !== undefined) {
      pipeline.push(
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
        { $unwind: { path: '$latest_score', preserveNullAndEmptyArrays: true } }
      );

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

    // Add sorting
    const sortDirection = sortOrder === 'asc' ? 1 : -1;
    pipeline.push({ $sort: { [sortBy]: sortDirection } });

    // Get total count
    const countPipeline = [...pipeline, { $count: 'total' }];
    const countResult = await Startup.aggregate(countPipeline);
    const total = countResult.length > 0 ? countResult[0].total : 0;

    // Add pagination
    pipeline.push({ $skip: skip }, { $limit: limit });

    // Populate founders
    pipeline.push({
      $lookup: {
        from: 'founders',
        localField: 'founders',
        foreignField: '_id',
        as: 'founders_info',
      },
    });

    const deals = await Startup.aggregate(pipeline);

    return {
      deals,
      total,
      page,
      totalPages: Math.ceil(total / limit),
    };
  }

  /**
   * Get deal by ID with full details
   */
  async getDealById(dealId: string): Promise<any> {
    // Check cache first
    const cacheKey = `${this.CACHE_PREFIX}${dealId}`;
    const cached = await cacheService.get(cacheKey);
    if (cached) {
      return JSON.parse(cached);
    }

    const deal = await Startup.findById(dealId).populate('founders').lean();

    if (!deal) {
      return null;
    }

    // Get latest score
    const latestScore = await Score.findOne({
      startup_id: dealId,
      is_latest: true,
    }).lean();

    const result = {
      ...deal,
      latest_score: latestScore,
    };

    // Cache the result
    await cacheService.set(cacheKey, JSON.stringify(result), this.CACHE_TTL);

    return result;
  }

  /**
   * Create a new deal
   */
  async createDeal(dealData: Partial<IStartup>): Promise<IStartup> {
    const deal = new Startup(dealData);
    await deal.save();
    return deal;
  }

  /**
   * Update deal information
   */
  async updateDeal(dealId: string, updateData: Partial<IStartup>): Promise<IStartup | null> {
    const deal = await Startup.findByIdAndUpdate(
      dealId,
      { $set: updateData },
      { new: true, runValidators: true }
    );

    if (deal) {
      // Invalidate cache
      const cacheKey = `${this.CACHE_PREFIX}${dealId}`;
      await cacheService.delete(cacheKey);
    }

    return deal;
  }

  /**
   * Add note to a deal
   */
  async addNote(dealId: string, userId: string, content: string): Promise<IStartup | null> {
    const deal = await Startup.findByIdAndUpdate(
      dealId,
      {
        $push: {
          notes: {
            user_id: userId,
            content,
            created_at: new Date(),
          },
        },
      },
      { new: true }
    );

    return deal;
  }

  /**
   * Get deal statistics
   */
  async getDealStatistics(): Promise<any> {
    const cacheKey = 'deal:stats';
    const cached = await cacheService.get(cacheKey);
    if (cached) {
      return JSON.parse(cached);
    }

    const stats = await Startup.aggregate([
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

    // Cache for 10 minutes
    await cacheService.set(cacheKey, JSON.stringify(result), 600);

    return result;
  }

  /**
   * Advanced search with multiple filters
   */
  async advancedSearch(params: AdvancedSearchParams): Promise<any> {
    const {
      query,
      sectors,
      stages,
      minRevenue,
      maxRevenue,
      minGrowthRate,
      countries,
      technologies,
      page,
      limit,
    } = params;

    const filters: any = {};

    // Text search
    if (query) {
      filters.$text = { $search: query };
    }

    // Sector filter
    if (sectors && sectors.length > 0) {
      filters.sector = { $in: sectors };
    }

    // Stage filter
    if (stages && stages.length > 0) {
      filters.stage = { $in: stages };
    }

    // Revenue filter
    if (minRevenue !== undefined || maxRevenue !== undefined) {
      filters['metrics.revenue'] = {};
      if (minRevenue !== undefined) {
        filters['metrics.revenue'].$gte = minRevenue;
      }
      if (maxRevenue !== undefined) {
        filters['metrics.revenue'].$lte = maxRevenue;
      }
    }

    // Growth rate filter
    if (minGrowthRate !== undefined) {
      filters['metrics.growth_rate_yoy'] = { $gte: minGrowthRate };
    }

    // Country filter
    if (countries && countries.length > 0) {
      filters['location.country'] = { $in: countries };
    }

    // Technology filter
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

  /**
   * Get top ranked deals
   */
  async getTopRankedDeals(limit: number): Promise<IStartup[]> {
    const cacheKey = `top_ranked:${limit}`;
    const cached = await cacheService.get(cacheKey);
    if (cached) {
      return JSON.parse(cached);
    }

    const deals = await Startup.aggregate([
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

    // Cache for 5 minutes
    await cacheService.set(cacheKey, JSON.stringify(deals), 300);

    return deals;
  }

  /**
   * Get similar deals based on sector, stage, and location
   */
  async getSimilarDeals(dealId: string, limit: number): Promise<IStartup[]> {
    const deal = await Startup.findById(dealId);
    if (!deal) {
      return [];
    }

    const similarDeals = await Startup.find({
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

  /**
   * Bulk create deals
   */
  async bulkCreateDeals(deals: Partial<IStartup>[]): Promise<{
    created: number;
    failed: number;
    errors: any[];
  }> {
    let created = 0;
    let failed = 0;
    const errors: any[] = [];

    for (const dealData of deals) {
      try {
        await this.createDeal(dealData);
        created++;
      } catch (error: any) {
        failed++;
        errors.push({
          deal: dealData.name,
          error: error.message,
        });
      }
    }

    return { created, failed, errors };
  }

  /**
   * Export deals to CSV or Excel
   */
  async exportDeals(format: 'csv' | 'xlsx', filters: any): Promise<Buffer> {
    const deals = await Startup.find(filters).lean();

    // Flatten data for export
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

    const worksheet = XLSX.utils.json_to_sheet(exportData);
    const workbook = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(workbook, worksheet, 'Deals');

    const buffer = XLSX.write(workbook, {
      type: 'buffer',
      bookType: format === 'csv' ? 'csv' : 'xlsx',
    });

    return buffer;
  }
}

export const dealService = new DealService();
