"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.aggregationService = exports.AggregationService = void 0;
const axios_1 = __importDefault(require("axios"));
const Startup_1 = __importDefault(require("../model/Startup"));
class AggregationService {
    constructor() {
        this.DEALROOM_API_KEY = process.env.DEALROOM_API_KEY;
        this.CRUNCHBASE_API_KEY = process.env.CRUNCHBASE_API_KEY;
    }
    async syncFromDealRoom() {
        if (!this.DEALROOM_API_KEY) {
            throw new Error('DealRoom API key not configured');
        }
        try {
            const response = await axios_1.default.get('https://api.dealroom.co/api/companies', {
                headers: { Authorization: `Bearer ${this.DEALROOM_API_KEY}` },
                params: { limit: 100 },
            });
            let synced = 0;
            let errors = 0;
            for (const company of response.data.companies) {
                try {
                    await this.upsertStartup({
                        name: company.name,
                        description: company.description,
                        sector: company.industries || [],
                        stage: this.mapStage(company.stage),
                        website: company.website,
                        location: {
                            city: company.city,
                            country: company.country,
                            region: company.region,
                        },
                        source: 'dealroom',
                        external_id: company.id,
                        last_synced: new Date(),
                    });
                    synced++;
                }
                catch (error) {
                    errors++;
                }
            }
            return { synced, errors };
        }
        catch (error) {
            throw new Error(`DealRoom sync failed: ${error.message}`);
        }
    }
    async syncFromCrunchbase() {
        if (!this.CRUNCHBASE_API_KEY) {
            throw new Error('Crunchbase API key not configured');
        }
        try {
            const response = await axios_1.default.get('https://api.crunchbase.com/api/v4/entities/organizations', {
                params: { user_key: this.CRUNCHBASE_API_KEY },
            });
            let synced = 0;
            let errors = 0;
            for (const org of response.data.entities) {
                try {
                    await this.upsertStartup({
                        name: org.properties.name,
                        description: org.properties.short_description,
                        sector: org.properties.categories || [],
                        stage: this.mapStage(org.properties.funding_stage),
                        website: org.properties.website?.value,
                        founded_date: new Date(org.properties.founded_on?.value),
                        source: 'crunchbase',
                        external_id: org.uuid,
                        last_synced: new Date(),
                    });
                    synced++;
                }
                catch (error) {
                    errors++;
                }
            }
            return { synced, errors };
        }
        catch (error) {
            throw new Error(`Crunchbase sync failed: ${error.message}`);
        }
    }
    async upsertStartup(startupData) {
        await Startup_1.default.findOneAndUpdate({ source: startupData.source, external_id: startupData.external_id }, { $set: startupData }, { upsert: true, new: true });
    }
    mapStage(externalStage) {
        const stageMap = {
            'Pre-Seed': 'pre-seed',
            Seed: 'seed',
            'Series A': 'series-a',
            'Series B': 'series-b',
            'Series C': 'series-c',
            Growth: 'growth',
        };
        return stageMap[externalStage] || 'seed';
    }
}
exports.AggregationService = AggregationService;
exports.aggregationService = new AggregationService();
//# sourceMappingURL=aggregation.service.js.map