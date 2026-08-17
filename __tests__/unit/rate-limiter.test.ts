import { InMemoryRateLimiter } from "@/lib/security/rate-limiter";

describe("InMemoryRateLimiter", () => {
  it("should allow requests under the limit", () => {
    const limiter = new InMemoryRateLimiter(60000, 3);
    const key = "test-client-1";

    const r1 = limiter.isRateLimited(key);
    expect(r1.limited).toBe(false);
    expect(r1.remaining).toBe(2);

    const r2 = limiter.isRateLimited(key);
    expect(r2.limited).toBe(false);
    expect(r2.remaining).toBe(1);

    const r3 = limiter.isRateLimited(key);
    expect(r3.limited).toBe(false);
    expect(r3.remaining).toBe(0);
  });

  it("should block requests exceeding the limit", () => {
    const limiter = new InMemoryRateLimiter(60000, 2);
    const key = "test-client-2";

    limiter.isRateLimited(key);
    limiter.isRateLimited(key);
    const blocked = limiter.isRateLimited(key);

    expect(blocked.limited).toBe(true);
    expect(blocked.remaining).toBe(0);
    expect(blocked.resetInMs).toBeGreaterThan(0);
  });
});
