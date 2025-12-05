// src/utils/ml.client.ts
import axios from 'axios';
import { getEnv } from '../config/env';

/**
 * Configured Axios client for external ML service API.
 */
export const mlClient = axios.create({
  baseURL: getEnv('ML_SERVICE_URL', 'http://localhost:8000'),
  timeout: 15000, // Long timeout for ML models (15 seconds)
  headers: {
    'Content-Type': 'application/json',
  },
});
