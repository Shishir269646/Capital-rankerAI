// src/jobs/queue.init.ts
import { QueueManager } from '../lib/queue/simple-queue';

// 1. AI Scoring Queue (for batch scoring)
export const scoringQueue = QueueManager.getQueue('scoring-jobs', {
  maxAttempts: 3, // Retry failed jobs up to 3 times
});

// 2. Data Synchronization Queue (for fetching external data)
export const syncQueue = QueueManager.getQueue('sync-jobs', {
  maxAttempts: 5, // Data sync is critical, allow more retries
});

// 3. Report Generation Queue
export const reportQueue = QueueManager.getQueue('report-jobs', {
  maxAttempts: 3,
});
