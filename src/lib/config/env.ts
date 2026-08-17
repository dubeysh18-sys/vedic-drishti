import { DEV_REFLECTION_SYSTEM_PROMPT } from "./prompts";

export class ConfigurationError extends Error {
  constructor(message: string) {
    super(message);
    this.name = "ConfigurationError";
  }
}

export interface AppConfig {
  nodeEnv: "development" | "production" | "test";
  isProduction: boolean;
  systemPrompt: string;
  geminiApiKey?: string;
  llmModel: string;
  llmTimeoutMs: number;
  llmMaxRetries: number;
  topK: number;
  rerankK: number;
  noMatchThreshold: number;
  maxInputLength: number;
  rateLimitWindowMs: number;
  rateLimitMaxRequests: number;
}

let cachedConfig: AppConfig | null = null;

export function getAppConfig(forceReload: boolean = false): AppConfig {
  if (cachedConfig && !forceReload) {
    return cachedConfig;
  }

  const nodeEnv = (process.env.NODE_ENV || "development") as "development" | "production" | "test";
  const isProduction = nodeEnv === "production";

  // System prompt resolution with built-in canonical Vedic wisdom prompt
  const systemPrompt = process.env.VEDIC_REFLECTION_SYSTEM_PROMPT?.trim() || DEV_REFLECTION_SYSTEM_PROMPT;

  const geminiApiKey = process.env.GEMINI_API_KEY?.trim() || undefined;
  const llmModel = process.env.LLM_MODEL || "gemini-3.5-flash";
  const llmTimeoutMs = Number(process.env.LLM_TIMEOUT_MS) || 8000;
  const llmMaxRetries = Number(process.env.LLM_MAX_RETRIES) || 2;
  const topK = Number(process.env.TOP_K) || 10;
  const rerankK = Number(process.env.RERANK_K) || 5;
  const noMatchThreshold = Number(process.env.NO_MATCH_THRESHOLD) || 0.35;
  const maxInputLength = Number(process.env.MAX_INPUT_LENGTH) || 2000;
  const rateLimitWindowMs = Number(process.env.RATE_LIMIT_WINDOW_MS) || 60000;
  const rateLimitMaxRequests = Number(process.env.RATE_LIMIT_MAX_REQUESTS) || 20;

  cachedConfig = {
    nodeEnv,
    isProduction,
    systemPrompt,
    geminiApiKey,
    llmModel,
    llmTimeoutMs,
    llmMaxRetries,
    topK,
    rerankK,
    noMatchThreshold,
    maxInputLength,
    rateLimitWindowMs,
    rateLimitMaxRequests,
  };

  return cachedConfig;
}
