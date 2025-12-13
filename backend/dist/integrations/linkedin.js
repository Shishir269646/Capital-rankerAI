"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.linkedInClient = exports.LinkedInClient = void 0;
const axios_1 = __importDefault(require("axios"));
const logger_1 = require("../config/logger");
class LinkedInClient {
    constructor() {
        this.apiKey = process.env.LINKEDIN_API_KEY || '';
        this.client = axios_1.default.create({
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
    setupInterceptors() {
        this.client.interceptors.request.use((config) => {
            logger_1.logger.debug('LinkedIn API request', {
                method: config.method,
                url: config.url,
            });
            return config;
        }, (error) => {
            logger_1.logger.error('LinkedIn API request error', { error: error.message });
            return Promise.reject(error);
        });
        this.client.interceptors.response.use((response) => {
            logger_1.logger.debug('LinkedIn API response', {
                status: response.status,
            });
            return response;
        }, (error) => {
            logger_1.logger.error('LinkedIn API response error', {
                status: error.response?.status,
                message: error.message,
            });
            return Promise.reject(error);
        });
    }
    async getProfile(profileUrl) {
        try {
            const profileId = this.extractProfileId(profileUrl);
            const response = await this.client.get(`/people/${profileId}`, {
                params: {
                    projection: '(id,firstName,lastName,headline,summary,positions,educations,skills)',
                },
            });
            return response.data;
        }
        catch (error) {
            logger_1.logger.error('Failed to fetch LinkedIn profile', {
                profileUrl,
                error: error.message,
            });
            throw new Error(`LinkedIn API error: ${error.message}`);
        }
    }
    async getCompany(companyId) {
        try {
            const response = await this.client.get(`/companies/${companyId}`);
            return response.data;
        }
        catch (error) {
            logger_1.logger.error('Failed to fetch LinkedIn company', {
                companyId,
                error: error.message,
            });
            throw new Error(`LinkedIn API error: ${error.message}`);
        }
    }
    extractProfileId(url) {
        const match = url.match(/\/in\/([^\/]+)/);
        return match ? match[1] : '';
    }
}
exports.LinkedInClient = LinkedInClient;
exports.linkedInClient = new LinkedInClient();
//# sourceMappingURL=linkedin.js.map