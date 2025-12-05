// src/services/ml-client.service.ts
import axios, { AxiosInstance } from 'axios';
import { MLScoreResponse, ThesisMatchResponse, FounderEvaluationResponse } from '../types/ml.types';

export class MLClientService {
  private client: AxiosInstance;
  private readonly ML_SERVICE_URL: string;

  constructor() {
    this.ML_SERVICE_URL = process.env.ML_SERVICE_URL || 'http://localhost:8000';
    this.client = axios.create({
      baseURL: this.ML_SERVICE_URL,
      timeout: 60000, // 60 seconds for ML operations
      headers: {
        'Content-Type': 'application/json',
      },
    });
  }

  /**
   * Score a deal using ML model
   */
  async scoreDeal(dealData: any, customWeights?: any): Promise<MLScoreResponse> {
    try {
      const response = await this.client.post('/api/v1/score_deal', {
        deal_data: dealData,
        custom_weights: customWeights,
      });
      return response.data;
    } catch (error: any) {
      console.error('ML scoring error:', error.message);
      throw new Error(`ML service error: ${error.message}`);
    }
  }

  /**
   * Match thesis with pitch deck
   */
  async matchThesis(pitchText: string, thesisText: string): Promise<ThesisMatchResponse> {
    try {
      const response = await this.client.post('/api/v1/match_thesis', {
        pitch_text: pitchText,
        thesis_text: thesisText,
      });
      return response.data;
    } catch (error: any) {
      console.error('Thesis matching error:', error.message);
      throw new Error(`ML service error: ${error.message}`);
    }
  }

  /**
   * Evaluate founder profile
   */
  async evaluateFounder(founderData: any): Promise<FounderEvaluationResponse> {
    try {
      const response = await this.client.post('/api/v1/evaluate_founder', {
        founder_data: founderData,
      });
      return response.data;
    } catch (error: any) {
      console.error('Founder evaluation error:', error.message);
      throw new Error(`ML service error: ${error.message}`);
    }
  }

  /**
   * Generate embeddings for text
   */
  async generateEmbedding(text: string): Promise<number[]> {
    try {
      const response = await this.client.post('/api/v1/generate_embedding', {
        text,
      });
      return response.data.embedding;
    } catch (error: any) {
      console.error('Embedding generation error:', error.message);
      throw new Error(`ML service error: ${error.message}`);
    }
  }

  /**
   * Health check for ML service
   */
  async healthCheck(): Promise<boolean> {
    try {
      const response = await this.client.get('/health');
      return response.status === 200;
    } catch (error) {
      return false;
    }
  }
}

export const mlClientService = new MLClientService();
