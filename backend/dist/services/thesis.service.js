"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.thesisService = exports.ThesisService = void 0;
const InvestorThesis_1 = __importDefault(require("../model/InvestorThesis"));
const Startup_1 = __importDefault(require("../model/Startup"));
const ml_client_service_1 = require("./ml-client.service");
class ThesisService {
    async createThesis(thesisData) {
        if (thesisData.thesis_text) {
            const embedding = await ml_client_service_1.mlClientService.generateEmbedding(thesisData.thesis_text);
            thesisData.thesis_embedding = embedding;
        }
        const thesis = new InvestorThesis_1.default(thesisData);
        await thesis.save();
        return thesis;
    }
    async updateThesis(thesisId, userId, updateData) {
        if (updateData.thesis_text) {
            const embedding = await ml_client_service_1.mlClientService.generateEmbedding(updateData.thesis_text);
            updateData.thesis_embedding = embedding;
        }
        const thesis = await InvestorThesis_1.default.findOneAndUpdate({ _id: thesisId, investor_id: userId }, { $set: updateData }, { new: true, runValidators: true });
        return thesis;
    }
    async getInvestorThesisById(thesisId, userId) {
        return await InvestorThesis_1.default.findOne({ _id: thesisId, investor_id: userId });
    }
    async matchDealWithThesis(dealId, userId) {
        const deal = await Startup_1.default.findById(dealId);
        if (!deal) {
            throw new Error('Deal not found');
        }
        const thesis = await InvestorThesis_1.default.findOne({
            investor_id: userId,
            is_active: true,
        });
        if (!thesis) {
            throw new Error('No active thesis found for investor');
        }
        const criteriaMatch = thesis.matchesCriteria(deal);
        if (!criteriaMatch) {
            return {
                relevancy_score: 0,
                criteria_match: false,
                message: 'Deal does not meet basic investment criteria',
            };
        }
        const pitchText = `${deal.description} ${deal.target_market} ${deal.competitive_advantage}`;
        const mlMatch = await ml_client_service_1.mlClientService.matchThesis(pitchText, thesis.thesis_text);
        return {
            thesis_id: thesis._id,
            deal_id: dealId,
            criteria_match: true,
            relevancy_score: mlMatch.relevancy_score,
            matched_keywords: mlMatch.matched_keywords,
            similarity_breakdown: mlMatch.similarity_breakdown,
            matched_sections: mlMatch.matched_sections,
        };
    }
    async getTopMatchesForInvestor(investorId, limit, minScore) {
        const thesis = await InvestorThesis_1.default.findOne({
            investor_id: investorId,
            is_active: true,
        });
        if (!thesis) {
            return [];
        }
        const potentialDeals = await Startup_1.default.find({
            sector: { $in: thesis.focus_areas.sectors },
            stage: { $in: thesis.focus_areas.stages },
            status: 'active',
        }).limit(100);
        const matches = [];
        for (const deal of potentialDeals) {
            try {
                const match = await this.matchDealWithThesis(deal._id.toString(), investorId);
                if (match.relevancy_score >= minScore) {
                    matches.push({
                        deal,
                        match_score: match.relevancy_score,
                        matched_keywords: match.matched_keywords,
                    });
                }
            }
            catch (error) {
                continue;
            }
        }
        matches.sort((a, b) => b.match_score - a.match_score);
        return matches.slice(0, limit);
    }
    async getInvestorTheses(investorId, includeInactive) {
        const query = { investor_id: investorId };
        if (!includeInactive) {
            query.is_active = true;
        }
        return await InvestorThesis_1.default.find(query).sort({ created_at: -1 });
    }
    async triggerReMatching(thesisId) {
        console.log(`Re-matching triggered for thesis: ${thesisId}`);
    }
    async analyzeThesisDealAlignment(thesisId, dealId) {
        const thesis = await InvestorThesis_1.default.findById(thesisId);
        const deal = await Startup_1.default.findById(dealId);
        if (!thesis || !deal) {
            throw new Error('Thesis or Deal not found');
        }
        const criteriaMatch = thesis.matchesCriteria(deal);
        const pitchText = `${deal.description} ${deal.target_market}`;
        const mlMatch = await ml_client_service_1.mlClientService.matchThesis(pitchText, thesis.thesis_text);
        return {
            overall_alignment: mlMatch.relevancy_score,
            criteria_match: criteriaMatch,
            sector_alignment: thesis.focus_areas.sectors.some((s) => deal.sector.includes(s)),
            stage_alignment: thesis.focus_areas.stages.includes(deal.stage),
            geography_alignment: thesis.focus_areas.geographies.some((g) => deal.location.country.toLowerCase().includes(g.toLowerCase())),
            semantic_analysis: mlMatch,
            recommendations: this.generateRecommendations(criteriaMatch, mlMatch.relevancy_score),
        };
    }
    async deactivateThesis(thesisId, userId) {
        return await InvestorThesis_1.default.findOneAndUpdate({ _id: thesisId, investor_id: userId }, { is_active: false }, { new: true });
    }
    generateRecommendations(criteriaMatch, score) {
        const recommendations = [];
        if (!criteriaMatch) {
            recommendations.push('Deal does not meet basic investment criteria');
        }
        if (score >= 80) {
            recommendations.push('Strong alignment - recommend immediate review');
        }
        else if (score >= 60) {
            recommendations.push('Good alignment - schedule detailed evaluation');
        }
        else if (score >= 40) {
            recommendations.push('Moderate alignment - consider for future pipeline');
        }
        else {
            recommendations.push('Low alignment - likely not a fit');
        }
        return recommendations;
    }
}
exports.ThesisService = ThesisService;
exports.thesisService = new ThesisService();
//# sourceMappingURL=thesis.service.js.map