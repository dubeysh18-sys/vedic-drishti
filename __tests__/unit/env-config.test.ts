import { getAppConfig, ConfigurationError } from "@/lib/config/env";

describe("Centralized Environment Configuration", () => {
  const originalEnv = process.env;

  beforeEach(() => {
    jest.resetModules();
    process.env = { ...originalEnv };
  });

  afterAll(() => {
    process.env = originalEnv;
  });

  it("should use built-in canonical system prompt when VEDIC_REFLECTION_SYSTEM_PROMPT is not set", () => {
    process.env.NODE_ENV = "production";
    delete process.env.VEDIC_REFLECTION_SYSTEM_PROMPT;

    const config = getAppConfig(true);
    expect(config.systemPrompt).toBeDefined();
    expect(config.systemPrompt.length).toBeGreaterThan(50);
    expect(config.isProduction).toBe(true);
  });

  it("should allow DEV_REFLECTION_SYSTEM_PROMPT fallback in development/test environments", () => {
    process.env.NODE_ENV = "test";
    delete process.env.VEDIC_REFLECTION_SYSTEM_PROMPT;

    const config = getAppConfig(true);
    expect(config.systemPrompt).toBeDefined();
    expect(config.systemPrompt.length).toBeGreaterThan(50);
    expect(config.isProduction).toBe(false);
  });

  it("should load explicit production system prompt when configured in production", () => {
    process.env.NODE_ENV = "production";
    process.env.VEDIC_REFLECTION_SYSTEM_PROMPT = "Custom Vedic Wisdom Production System Prompt";

    const config = getAppConfig(true);
    expect(config.systemPrompt).toBe("Custom Vedic Wisdom Production System Prompt");
    expect(config.isProduction).toBe(true);
  });
});
