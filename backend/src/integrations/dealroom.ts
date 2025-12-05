// src/integrations/dealroom.ts
import axios, { AxiosInstance } from 'axios';
import { logger } from '../config/logger';

/**
 * DealRoom API Client
 */
export class DealRoomClient {
  private client: AxiosInstance;
  private apiKey: string;

  constructor() {
    this.apiKey = process.env.DEALROOM_API_KEY || '';

    this.client = axios.create({
      baseURL: 'https://api.dealroom.co/api',
      timeout: 30000,
      headers: {
        Authorization: `Bearer ${this.apiKey}`,
        'Content-Type': 'application/json',
      },
    });

    this.setupInterceptors();
  }

  private setupInterceptors(): void {
    this.client.interceptors.request.use(
      (config) => {
        logger.debug('DealRoom API request', {
          method: config.method,
          url: config.url,
        });
        return config;
      },
      (error) => {
        logger.error('DealRoom API request error', { error: error.message });
        return Promise.reject(error);
      }
    );

    this.client.interceptors.response.use(
      (response) => {
        logger.debug('DealRoom API response', {
          status: response.status,
          url: response.config.url,
        });
        return response;
      },
      (error) => {
        logger.error('DealRoom API response error', {
          status: error.response?.status,
          message: error.message,
          url: error.config?.url,
        });
        return Promise.reject(error);
      }
    );
  }

  async getCompanies(
    params: {
      limit?: number;
      offset?: number;
      sectors?: string[];
      stages?: string[];
    } = {}
  ): Promise<any[]> {
    try {
      const response = await this.client.get('/companies', {
        params: {
          limit: params.limit || 100,
          offset: params.offset || 0,
          sectors: params.sectors?.join(','),
          stages: params.stages?.join(','),
        },
      });

      return response.data.companies || [];
    } catch (error: any) {
      logger.error('Failed to fetch companies from DealRoom', {
        error: error.message,
      });
      throw new Error(`DealRoom API error: ${error.message}`);
    }
  }

  async getCompanyById(companyId: string): Promise<any> {
    try {
      const response = await this.client.get(`/companies/${companyId}`);
      return response.data;
    } catch (error: any) {
      logger.error('Failed to fetch company from DealRoom', {
        companyId,
        error: error.message,
      });
      throw new Error(`DealRoom API error: ${error.message}`);
    }
  }

  async searchCompanies(query: string): Promise<any[]> {
    try {
      const response = await this.client.get('/companies/search', {
        params: { q: query },
      });
      return response.data.companies || [];
    } catch (error: any) {
      logger.error('Failed to search companies in DealRoom', {
        query,
        error: error.message,
      });
      throw new Error(`DealRoom API error: ${error.message}`);
    }
  }
}

export const dealRoomClient = new DealRoomClient();
