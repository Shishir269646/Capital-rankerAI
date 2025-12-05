// src/services/thesis.service.ts
import InvestorThesis, { IInvestorThesis } from '../model/InvestorThesis';
import Startup from '../model/Startup';
import { mlClientService } from './ml-client.service';

export class ThesisService {
  /**
   * Create new investment thesis
   */
  async createThesis(thesisData: Partial<IInvestorThesis>): Promise<IInvestorThesis> {
    // Generate embedding for thesis text
    if (thesisData.thesis_text) {
      const embedding = await mlClientService.generateEmbedding(thesisData.thesis_text);
      thesisData.thesis_embedding = embedding;
    }

    const thesis = new InvestorThesis(thesisData);
    await thesis.save();
    return thesis;
  }

  /**
   * Update thesis
   */
  async updateThesis(
    thesisId: string,
    userId: string,
    updateData: Partial<IInvestorThesis>
  ): Promise<IInvestorThesis | null> {
    // Regenerate embedding if text changed
    if (updateData.thesis_text) {
      const embedding = await mlClientService.generateEmbedding(updateData.thesis_text);
      updateData.thesis_embedding = embedding;
    }

    const thesis = await InvestorThesis.findOneAndUpdate(
      { _id: thesisId, investor_id: userId },
      { $set: updateData },
      { new: true, runValidators: true }
    );

    return thesis;
  }

  /**
   * Match deal with investor thesis
   */
  async matchDealWithThesis(dealId: string, userId: string): Promise<any> {
    const deal = await Startup.findById(dealId);
    if (!deal) {
      throw new Error('Deal not found');
    }

    const thesis = await InvestorThesis.findOne({
      investor_id: userId,
      is_active: true,
    });

    if (!thesis) {
      throw new Error('No active thesis found for investor');
    }

    // Check basic criteria match
    const criteriaMatch = thesis.matchesCriteria(deal);
    if (!criteriaMatch) {
      return {
        relevancy_score: 0,
        criteria_match: false,
        message: 'Deal does not meet basic investment criteria',
      };
    }

    // Use ML for semantic matching
    const pitchText = `${deal.description} ${deal.target_market} ${deal.competitive_advantage}`;
    const mlMatch = await mlClientService.matchThesis(pitchText, thesis.thesis_text);

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

  /**
   * Get top matching deals for investor
   */
  async getTopMatchesForInvestor(
    investorId: string,
    limit: number,
    minScore: number
  ): Promise<any[]> {
    const thesis = await InvestorThesis.findOne({
      investor_id: investorId,
      is_active: true,
    });

    if (!thesis) {
      return [];
    }

    // Get deals that match basic criteria
    const potentialDeals = await Startup.find({
      sector: { $in: thesis.focus_areas.sectors },
      stage: { $in: thesis.focus_areas.stages },
      status: 'active',
    }).limit(100);

    // Score each deal
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
      } catch (error) {
        continue;
      }
    }

    // Sort by relevancy score
    matches.sort((a, b) => b.match_score - a.match_score);

    return matches.slice(0, limit);
  }

  /**
   * Get all theses for an investor
   */
  async getInvestorTheses(
    investorId: string,
    includeInactive: boolean
  ): Promise<IInvestorThesis[]> {
    const query: any = { investor_id: investorId };
    if (!includeInactive) {
      query.is_active = true;
    }

    return await InvestorThesis.find(query).sort({ created_at: -1 });
  }

  /**
   * Trigger re-matching after thesis update
   */
  async triggerReMatching(thesisId: string): Promise<void> {
    // This would typically trigger a background job
    console.log(`Re-matching triggered for thesis: ${thesisId}`);
  }

  /**
   * Analyze detailed alignment
   */
  async analyzeThesisDealAlignment(thesisId: string, dealId: string): Promise<any> {
    const thesis = await InvestorThesis.findById(thesisId);
    const deal = await Startup.findById(dealId);

    if (!thesis || !deal) {
      throw new Error('Thesis or Deal not found');
    }

    const criteriaMatch = thesis.matchesCriteria(deal);
    const pitchText = `${deal.description} ${deal.target_market}`;
    const mlMatch = await mlClientService.matchThesis(pitchText, thesis.thesis_text);

    return {
      overall_alignment: mlMatch.relevancy_score,
      criteria_match: criteriaMatch,
      sector_alignment: thesis.focus_areas.sectors.some((s) => deal.sector.includes(s)),
      stage_alignment: thesis.focus_areas.stages.includes(deal.stage),
      geography_alignment: thesis.focus_areas.geographies.some((g) =>
        deal.location.country.toLowerCase().includes(g.toLowerCase())
      ),
      semantic_analysis: mlMatch,
      recommendations: this.generateRecommendations(criteriaMatch, mlMatch.relevancy_score),
    };
  }

  /**
   * Deactivate thesis
   */
  async deactivateThesis(thesisId: string, userId: string): Promise<IInvestorThesis | null> {
    return await InvestorThesis.findOneAndUpdate(
      { _id: thesisId, investor_id: userId },
      { is_active: false },
      { new: true }
    );
  }

  private generateRecommendations(criteriaMatch: boolean, score: number): string[] {
    const recommendations = [];

    if (!criteriaMatch) {
      recommendations.push('Deal does not meet basic investment criteria');
    }

    if (score >= 80) {
      recommendations.push('Strong alignment - recommend immediate review');
    } else if (score >= 60) {
      recommendations.push('Good alignment - schedule detailed evaluation');
    } else if (score >= 40) {
      recommendations.push('Moderate alignment - consider for future pipeline');
    } else {
      recommendations.push('Low alignment - likely not a fit');
    }

    return recommendations;
  }
}

export const thesisService = new ThesisService();
