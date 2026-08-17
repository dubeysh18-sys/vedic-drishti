import { NextRequest, NextResponse } from "next/server";
import { ReflectionService } from "@/services/reflection.service";
import { CreateReflectionSchema } from "@/lib/utils/validation";
import { Logger } from "@/lib/observability/logger";
import { globalRateLimiter } from "@/lib/security/rate-limiter";
import { getAppConfig, ConfigurationError } from "@/lib/config/env";
import { ZodError } from "zod";

const reflectionService = new ReflectionService();

export async function POST(req: NextRequest) {
  try {
    // 0. Configuration check
    getAppConfig();

    // 1. Rate Limiting Check
    const ip = req.headers.get("x-forwarded-for")?.split(",")[0].trim() || "127.0.0.1";
    const limitCheck = globalRateLimiter.isRateLimited(ip);
    if (limitCheck.limited) {
      Logger.warn("Rate limit exceeded", { ip, resetInMs: limitCheck.resetInMs });
      return NextResponse.json(
        { error: "Too many reflection requests. Please pause and take a mindful breath before trying again." },
        { status: 429, headers: { "Retry-After": String(Math.ceil(limitCheck.resetInMs / 1000)) } }
      );
    }

    // 2. Input Parsing & Validation
    const body = await req.json();
    const validated = CreateReflectionSchema.parse(body);

    // 3. Process Reflection
    const result = await reflectionService.processReflection(validated);
    return NextResponse.json(result, { status: 200 });
  } catch (error) {
    if (error instanceof ZodError) {
      return NextResponse.json(
        { error: "Invalid reflection input", details: error.errors.map((e) => e.message) },
        { status: 400 }
      );
    }

    if (error instanceof ConfigurationError) {
      Logger.error("Configuration error in reflections API", error);
      return NextResponse.json(
        { error: "Server configuration error. Please contact administrator." },
        { status: 500 }
      );
    }

    Logger.error("API /api/reflections error", error);
    return NextResponse.json(
      {
        error: "Unable to process reflection at this time. Please try again shortly.",
      },
      { status: 500 }
    );
  }
}
