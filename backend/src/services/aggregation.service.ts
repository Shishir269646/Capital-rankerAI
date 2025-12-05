// src/services/aggregation.service.ts
import axios from 'axios';
import Startup from '../model/Startup';

export class AggregationService {
  private readonly DEALROOM_API_KEY = process.env.DEALROOM_API_KEY;
  private readonly CRUNCHBASE_API_KEY = process.env.CRUNCHBASE_API_KEY;

  /**
   * Sync deals from DealRoom
   */
  async syncFromDealRoom(): Promise<{ synced: number; errors: number }> {
    if (!this.DEALROOM_API_KEY) {
      throw new Error('DealRoom API key not configured');
    }

    try {
      const response = await axios.get('https://api.dealroom.co/api/companies', {
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
        } catch (error) {
          errors++;
        }
      }

      return { synced, errors };
    } catch (error: any) {
      throw new Error(`DealRoom sync failed: ${error.message}`);
    }
  }

  /**
   * Sync deals from Crunchbase
   */
  async syncFromCrunchbase(): Promise<{ synced: number; errors: number }> {
    if (!this.CRUNCHBASE_API_KEY) {
      throw new Error('Crunchbase API key not configured');
    }

    try {
      const response = await axios.get('https://api.crunchbase.com/api/v4/entities/organizations', {
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
        } catch (error) {
          errors++;
        }
      }

      return { synced, errors };
    } catch (error: any) {
      throw new Error(`Crunchbase sync failed: ${error.message}`);
    }
  }

  /**
   * Upsert startup (create or update)
   */
  private async upsertStartup(startupData: any): Promise<void> {
    await Startup.findOneAndUpdate(
      { source: startupData.source, external_id: startupData.external_id },
      { $set: startupData },
      { upsert: true, new: true }
    );
  }

  /**
   * Map external stage to internal stage
   */
  private mapStage(externalStage: string): string {
    const stageMap: Record<string, string> = {
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

export const aggregationService = new AggregationService();
