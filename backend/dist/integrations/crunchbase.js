"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.crunchbaseClient = exports.CrunchbaseClient = void 0;
const axios_1 = __importDefault(require("axios"));
const logger_1 = require("../config/logger");
class CrunchbaseClient {
    constructor() {
        this.apiKey = process.env.CRUNCHBASE_API_KEY || '';
        this.client = axios_1.default.create({
            baseURL: 'https://api.crunchbase.com/api/v4',
            timeout: 30000,
            headers: {
                'Content-Type': 'application/json',
            },
        });
        this.setupInterceptors();
    }
    setupInterceptors() {
        this.client.interceptors.request.use((config) => {
            config.params = {
                ...config.params,
                user_key: this.apiKey,
            };
            logger_1.logger.debug('Crunchbase API request', {
                method: config.method,
                url: config.url,
            });
            return config;
        }, (error) => {
            logger_1.logger.error('Crunchbase API request error', { error: error.message });
            return Promise.reject(error);
        });
        this.client.interceptors.response.use((response) => {
            logger_1.logger.debug('Crunchbase API response', {
                status: response.status,
            });
            return response;
        }, (error) => {
            logger_1.logger.error('Crunchbase API response error', {
                status: error.response?.status,
                message: error.message,
            });
            return Promise.reject(error);
        });
    }
    async getOrganizations(params = {}) {
        try {
            const response = await this.client.get('/entities/organizations', {
                params: {
                    limit: params.limit || 100,
                    after_id: params.after_id,
                    funding_stage: params.funding_stage,
                },
            });
            return response.data.entities || [];
        }
        catch (error) {
            logger_1.logger.error('Failed to fetch organizations from Crunchbase', {
                error: error.message,
            });
            throw new Error(`Crunchbase API error: ${error.message}`);
        }
    }
    async getOrganizationById(uuid) {
        try {
            const response = await this.client.get(`/entities/organizations/${uuid}`);
            return response.data;
        }
        catch (error) {
            logger_1.logger.error('Failed to fetch organization from Crunchbase', {
                uuid,
                error: error.message,
            });
            throw new Error(`Crunchbase API error: ${error.message}`);
        }
    }
    async searchOrganizations(query) {
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
        }
        catch (error) {
            logger_1.logger.error('Failed to search organizations in Crunchbase', {
                query,
                error: error.message,
            });
            throw new Error(`Crunchbase API error: ${error.message}`);
        }
    }
    async getFundingRounds(orgUuid) {
        try {
            const response = await this.client.get(`/entities/organizations/${orgUuid}/funding_rounds`);
            return response.data.funding_rounds || [];
        }
        catch (error) {
            logger_1.logger.error('Failed to fetch funding rounds from Crunchbase', {
                orgUuid,
                error: error.message,
            });
            throw new Error(`Crunchbase API error: ${error.message}`);
        }
    }
}
exports.CrunchbaseClient = CrunchbaseClient;
exports.crunchbaseClient = new CrunchbaseClient();
//# sourceMappingURL=crunchbase.js.map