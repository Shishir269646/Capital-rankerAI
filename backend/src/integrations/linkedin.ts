// src/integrations/linkedin.ts
import axios, { AxiosInstance } from 'axios';
import { logger } from '../config/logger';

/**
 * LinkedIn API Client
 */
export class LinkedInClient {
  private client: AxiosInstance;
  private apiKey: string;

  constructor() {
    this.apiKey = process.env.LINKEDIN_API_KEY || '';

    this.client = axios.create({
      baseURL: 'https://api.linkedin.com/v2',
      timeout: 30000,
      headers: {
        Authorization: `Bearer ${this.apiKey}`,
        'Content-Type': 'application/json',
        'X-Restli-Protocol-Version': '2.0.0',
      },
    });

    this.setupInterceptors();
  }

  private setupInterceptors(): void {
    this.client.interceptors.request.use(
      (config) => {
        logger.debug('LinkedIn API request', {
          method: config.method,
          url: config.url,
        });
        return config;
      },
      (error) => {
        logger.error('LinkedIn API request error', { error: error.message });
        return Promise.reject(error);
      }
    );

    this.client.interceptors.response.use(
      (response) => {
        logger.debug('LinkedIn API response', {
          status: response.status,
        });
        return response;
      },
      (error) => {
        logger.error('LinkedIn API response error', {
          status: error.response?.status,
          message: error.message,
        });
        return Promise.reject(error);
      }
    );
  }

  async getProfile(profileUrl: string): Promise<any> {
    try {
      const profileId = this.extractProfileId(profileUrl);

      const response = await this.client.get(`/people/${profileId}`, {
        params: {
          projection: '(id,firstName,lastName,headline,summary,positions,educations,skills)',
        },
      });

      return response.data;
    } catch (error: any) {
      logger.error('Failed to fetch LinkedIn profile', {
        profileUrl,
        error: error.message,
      });
      throw new Error(`LinkedIn API error: ${error.message}`);
    }
  }

  async getCompany(companyId: string): Promise<any> {
    try {
      const response = await this.client.get(`/companies/${companyId}`);
      return response.data;
    } catch (error: any) {
      logger.error('Failed to fetch LinkedIn company', {
        companyId,
        error: error.message,
      });
      throw new Error(`LinkedIn API error: ${error.message}`);
    }
  }

  private extractProfileId(url: string): string {
    const match = url.match(/\/in\/([^\/]+)/);
    return match ? match[1] : '';
  }
}

export const linkedInClient = new LinkedInClient();
