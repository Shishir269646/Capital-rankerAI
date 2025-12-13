"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.dealRoomClient = exports.DealRoomClient = void 0;
const axios_1 = __importDefault(require("axios"));
const logger_1 = require("../config/logger");
class DealRoomClient {
    constructor() {
        this.apiKey = process.env.DEALROOM_API_KEY || '';
        this.client = axios_1.default.create({
            baseURL: 'https://api.dealroom.co/api',
            timeout: 30000,
            headers: {
                Authorization: `Bearer ${this.apiKey}`,
                'Content-Type': 'application/json',
            },
        });
        this.setupInterceptors();
    }
    setupInterceptors() {
        this.client.interceptors.request.use((config) => {
            logger_1.logger.debug('DealRoom API request', {
                method: config.method,
                url: config.url,
            });
            return config;
        }, (error) => {
            logger_1.logger.error('DealRoom API request error', { error: error.message });
            return Promise.reject(error);
        });
        this.client.interceptors.response.use((response) => {
            logger_1.logger.debug('DealRoom API response', {
                status: response.status,
                url: response.config.url,
            });
            return response;
        }, (error) => {
            logger_1.logger.error('DealRoom API response error', {
                status: error.response?.status,
                message: error.message,
                url: error.config?.url,
            });
            return Promise.reject(error);
        });
    }
    async getCompanies(params = {}) {
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
        }
        catch (error) {
            logger_1.logger.error('Failed to fetch companies from DealRoom', {
                error: error.message,
            });
            throw new Error(`DealRoom API error: ${error.message}`);
        }
    }
    async getCompanyById(companyId) {
        try {
            const response = await this.client.get(`/companies/${companyId}`);
            return response.data;
        }
        catch (error) {
            logger_1.logger.error('Failed to fetch company from DealRoom', {
                companyId,
                error: error.message,
            });
            throw new Error(`DealRoom API error: ${error.message}`);
        }
    }
    async searchCompanies(query) {
        try {
            const response = await this.client.get('/companies/search', {
                params: { q: query },
            });
            return response.data.companies || [];
        }
        catch (error) {
            logger_1.logger.error('Failed to search companies in DealRoom', {
                query,
                error: error.message,
            });
            throw new Error(`DealRoom API error: ${error.message}`);
        }
    }
}
exports.DealRoomClient = DealRoomClient;
exports.dealRoomClient = new DealRoomClient();
//# sourceMappingURL=dealroom.js.map