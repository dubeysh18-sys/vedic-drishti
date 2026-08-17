/**
 * In-memory sliding window rate limiter utility (Phase 20 / Phase 32).
 */
interface RateLimitRecord {
  count: number;
  resetAt: number;
}

export class InMemoryRateLimiter {
  private records: Map<string, RateLimitRecord> = new Map();
  private windowMs: number;
  private maxRequests: number;

  constructor(windowMs: number = 60000, maxRequests: number = 30) {
    this.windowMs = windowMs;
    this.maxRequests = maxRequests;
  }

  isRateLimited(key: string): { limited: boolean; remaining: number; resetInMs: number } {
    const now = Date.now();
    const record = this.records.get(key);

    if (!record || now > record.resetAt) {
      this.records.set(key, {
        count: 1,
        resetAt: now + this.windowMs,
      });
      return { limited: false, remaining: this.maxRequests - 1, resetInMs: this.windowMs };
    }

    if (record.count >= this.maxRequests) {
      return {
        limited: true,
        remaining: 0,
        resetInMs: Math.max(0, record.resetAt - now),
      };
    }

    record.count++;
    return {
      limited: false,
      remaining: this.maxRequests - record.count,
      resetInMs: Math.max(0, record.resetAt - now),
    };
  }

  // Periodic cleanup of expired entries
  cleanup(): void {
    const now = Date.now();
    for (const [key, record] of this.records.entries()) {
      if (now > record.resetAt) {
        this.records.delete(key);
      }
    }
  }
}

export const globalRateLimiter = new InMemoryRateLimiter(60000, 45);
