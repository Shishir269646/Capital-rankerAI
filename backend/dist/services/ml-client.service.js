"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.mlClientService = exports.MLClientService = void 0;
const axios_1 = __importDefault(require("axios"));
class MLClientService {
    constructor() {
        this.ML_SERVICE_URL = process.env.ML_SERVICE_URL || 'http://localhost:8000';
        this.client = axios_1.default.create({
            baseURL: this.ML_SERVICE_URL,
            timeout: 60000,
            headers: {
                'Content-Type': 'application/json',
            },
        });
    }
    async scoreDeal(dealData, customWeights) {
        try {
            const response = await this.client.post('/api/v1/score_deal', {
                deal_data: dealData,
                custom_weights: customWeights,
            });
            return response.data;
        }
        catch (error) {
            console.error('ML scoring error:', error.message);
            throw new Error(`ML service error: ${error.message}`);
        }
    }
    async matchThesis(pitchText, thesisText) {
        try {
            const response = await this.client.post('/api/v1/match_thesis', {
                pitch_text: pitchText,
                thesis_text: thesisText,
            });
            return response.data;
        }
        catch (error) {
            console.error('Thesis matching error:', error.message);
            throw new Error(`ML service error: ${error.message}`);
        }
    }
    async evaluateFounder(founderData) {
        try {
            const response = await this.client.post('/api/v1/evaluate_founder', {
                founder_data: founderData,
            });
            return response.data;
        }
        catch (error) {
            console.error('Founder evaluation error:', error.message);
            throw new Error(`ML service error: ${error.message}`);
        }
    }
    async generateEmbedding(text) {
        try {
            const response = await this.client.post('/api/v1/generate_embedding', {
                text,
            });
            return response.data.embedding;
        }
        catch (error) {
            console.error('Embedding generation error:', error.message);
            throw new Error(`ML service error: ${error.message}`);
        }
    }
    async healthCheck() {
        try {
            const response = await this.client.get('/health');
            return response.status === 200;
        }
        catch (error) {
            return false;
        }
    }
}
exports.MLClientService = MLClientService;
exports.mlClientService = new MLClientService();
//# sourceMappingURL=ml-client.service.js.map