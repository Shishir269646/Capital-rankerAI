// src/integrations/crunchbase.ts
import axios, { AxiosInstance } from 'axios';
import { logger } from '../config/logger';

/**
 * Crunchbase API Client
 */
export class CrunchbaseClient {
  private client: AxiosInstance;
  private apiKey: string;

  constructor() {
    this.apiKey = process.env.CRUNCHBASE_API_KEY || '';

    this.client = axios.create({
      baseURL: 'https://api.crunchbase.com/api/v4',
      timeout: 30000,
      headers: {
        'Content-Type': 'application/json',
      },
    });

    this.setupInterceptors();
  }

  private setupInterceptors(): void {
    this.client.interceptors.request.use(
      (config) => {
        config.params = {
          ...config.params,
          user_key: this.apiKey,
        };

        logger.debug('Crunchbase API request', {
          method: config.method,
          url: config.url,
        });
        return config;
      },
      (error) => {
        logger.error('Crunchbase API request error', { error: error.message });
        return Promise.reject(error);
      }
    );

    this.client.interceptors.response.use(
      (response) => {
        logger.debug('Crunchbase API response', {
          status: response.status,
        });
        return response;
      },
      (error) => {
        logger.error('Crunchbase API response error', {
          status: error.response?.status,
          message: error.message,
        });
        return Promise.reject(error);
      }
    );
  }

  async getOrganizations(
    params: {
      limit?: number;
      after_id?: string;
      funding_stage?: string;
    } = {}
  ): Promise<any[]> {
    try {
      const response = await this.client.get('/entities/organizations', {
        params: {
          limit: params.limit || 100,
          after_id: params.after_id,
          funding_stage: params.funding_stage,
        },
      });

      return response.data.entities || [];
    } catch (error: any) {
      logger.error('Failed to fetch organizations from Crunchbase', {
        error: error.message,
      });
      throw new Error(`Crunchbase API error: ${error.message}`);
    }
  }

  async getOrganizationById(uuid: string): Promise<any> {
    try {
      const response = await this.client.get(`/entities/organizations/${uuid}`);
      return response.data;
    } catch (error: any) {
      logger.error('Failed to fetch organization from Crunchbase', {
        uuid,
        error: error.message,
      });
      throw new Error(`Crunchbase API error: ${error.message}`);
    }
  }

  async searchOrganizations(query: string): Promise<any[]> {
    try {
      const response = await this.client.post('/searches/organizations', {
        field_ids: ['name', 'short_description', 'website'],
        query: [
          {
            type: 'predicate',
            field_id: 'name',
            operator_id: 'contains',
            values: [query],
          },
        ],
      });

      return response.data.entities || [];
    } catch (error: any) {
      logger.error('Failed to search organizations in Crunchbase', {
        query,
        error: error.message,
      });
      throw new Error(`Crunchbase API error: ${error.message}`);
    }
  }

  async getFundingRounds(orgUuid: string): Promise<any[]> {
    try {
      const response = await this.client.get(`/entities/organizations/${orgUuid}/funding_rounds`);
      return response.data.funding_rounds || [];
    } catch (error: any) {
      logger.error('Failed to fetch funding rounds from Crunchbase', {
        orgUuid,
        error: error.message,
      });
      throw new Error(`Crunchbase API error: ${error.message}`);
    }
  }
}

export const crunchbaseClient = new CrunchbaseClient();
