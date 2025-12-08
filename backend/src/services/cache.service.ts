import { redisClient } from '../config/redis.config';

export class CacheService {
  private client: typeof redisClient;

  constructor() {
    this.client = redisClient;
  }

  /**
   * Get value from cache
   */
  async get(key: string): Promise<string | null> {
    return await this.client.get(key);
  }

  /**
   * Set value in cache
   */
  async set(key: string, value: string, ttl?: number): Promise<void> {
    if (ttl) {
      await this.client.setex(key, ttl, value);
    } else {
      await this.client.set(key, value);
    }
  }

  /**
   * Delete key from cache
   */
  async delete(key: string): Promise<void> {
    await this.client.del(key);
  }

  /**
   * Delete multiple keys
   */
  async deletePattern(pattern: string): Promise<void> {
    const keys = await this.client.keys(pattern);
    if (keys.length > 0) {
      await this.client.del(...keys);
    }
  }
}

export const cacheService = new CacheService();
