import { CreateReflectionRequest, CreateReflectionResponse } from "@/types/api";
import { TrustLayers, RetrievalDiagnostics, ReflectionMessageResponse, ResponseType } from "@/types/reflection";
import { SafetyService } from "./safety.service";
import { EmotionAnalysisService } from "./emotion-analysis.service";
import { RetrievalService } from "./retrieval.service";
import { GenerationService } from "./generation.service";
import { CitationService } from "./citation.service";
import { OutputSafetyService } from "./output-safety.service";
import { generateMessageId, generateSessionId } from "@/lib/utils/id";
import { connectToDatabase } from "@/lib/db/connection";
import { ReflectionMessage, ReflectionMessageDocument } from "@/lib/db/models/reflection-message.model";
import { ReflectionSession } from "@/lib/db/models/reflection-session.model";
import { Logger } from "@/lib/observability/logger";
import { CorpusStore } from "@/lib/data/corpus-store";
import { ReflectionTelemetry } from "@/types/telemetry";

export class ReflectionService {
  private safetyService = new SafetyService();
  private emotionService = new EmotionAnalysisService();
  private retrievalService = new RetrievalService();
  private generationService = new GenerationService();
  private citationService = new CitationService();
  private outputSafetyService = new OutputSafetyService();
  private corpusStore = CorpusStore.getInstance();

  // In-memory reflection storage for fast history retrieval & offline mode
  private static inMemoryReflections: Map<string, ReflectionMessageResponse> = new Map();

  async processReflection(request: CreateReflectionRequest): Promise<CreateReflectionResponse> {
    const startTime = Date.now();
    const sessionId = request.sessionId || generateSessionId();
    const messageId = generateMessageId();
    const userInput = request.message.trim();

    Logger.info("Reflection requested", { sessionId, messageLength: userInput.length, selectedEmotion: request.selectedEmotion });

    // Step 1: Input Safety Gate (Runs FIRST before RAG or LLM)
    const safetyResult = await this.safetyService.evaluateInput(userInput, sessionId);

    // Crisis Gate (Self-harm, suicide, imminent danger, acute abuse)
    if (safetyResult.decision === "CRISIS" || safetyResult.isCrisis) {
      const crisisResponse: CreateReflectionResponse = {
        id: messageId,
        sessionId,
        userInput,
        selectedEmotion: request.selectedEmotion || null,
        responseType: "crisis",
        ragOutcome: "crisis",
        sources: [],
        reflection: null,
        crisisResponse: {
          acknowledgment: safetyResult.acknowledgment || "I hear how much pain you are carrying.",
          resources: safetyResult.resources || [],
          disclaimer: safetyResult.disclaimer || "",
        },
        createdAt: new Date().toISOString(),
      };

      await this.persistReflection(crisisResponse);
      return crisisResponse;
    }

    // Safety Redirect Gate (Explicit sexual, hate speech, operational violence, prompt injection)
    if (safetyResult.decision === "REDIRECT" && safetyResult.mahamantra) {
      const redirectResponse: CreateReflectionResponse = {
        id: messageId,
        sessionId,
        userInput,
        selectedEmotion: request.selectedEmotion || null,
        responseType: "safety_redirect",
        ragOutcome: "redirect",
        sources: [],
        reflection: null,
        mahamantraResponse: safetyResult.mahamantra,
        createdAt: new Date().toISOString(),
      };

      await this.persistReflection(redirectResponse);
      return redirectResponse;
    }

    // Step 2: Emotion Analysis
    const emotionalReading = await this.emotionService.analyze(userInput, request.selectedEmotion);

    // Step 3: RAG Retrieval + Deterministic Reranking
    const retStartTime = Date.now();
    const retrievalResult = await this.retrievalService.retrieve(userInput, emotionalReading);
    const retrievalTimeMs = Date.now() - retStartTime;

    const candidateSources = retrievalResult.candidates.map((c) =>
      this.corpusStore.toResolvedSource(c.record, c.finalScore)
    );
    const candidateIds = candidateSources.map((s) => s.canonicalId);

    // Step 4: Generation Service (Synthesize structured reflection)
    const genStartTime = Date.now();
    const genOutput = await this.generationService.generate({
      userInput,
      emotionalReading,
      candidateSources,
      ragOutcome: retrievalResult.ragOutcome,
    });
    const generationTimeMs = Date.now() - genStartTime;

    let reflection = genOutput.reflection;

    // Step 5: Citation Service (Backend-owned candidate-restricted resolution)
    const resolvedSources = await this.citationService.resolveCitations(genOutput.sourceIds, candidateIds);

    // Step 6: Output Safety Service (Screen generated reflection before client delivery)
    const outputSafety = this.outputSafetyService.validateOutput(reflection);
    if (!outputSafety.passed) {
      Logger.warn("Output safety validation failed, falling back to safe grounded template", {
        reasonCode: outputSafety.reasonCode,
      });
      // Fall back to safe deterministic reflection without exposing violating text
      const safeFallback = this.corpusStore.toResolvedSource(this.corpusStore.getById("gita:2:14")!);
      reflection = {
        whatIHear: emotionalReading.statement,
        perspectiveFromText: "Bhagavad Gita 2.14",
        teaching: "The Gita gently teaches that all emotional seasons and circumstances are passing phases.",
        application: "Consider observing what you are experiencing with calm, patient stillness.",
        reflectionQuestion: "What steady center remains within you, untouched by passing moments?",
        caveats: null,
      };
    }

    // Determine Response Type
    let responseType: ResponseType = "reflection";
    if (retrievalResult.ragOutcome === "noStrongMatch" || resolvedSources.length === 0) {
      responseType = "no_match";
    }

    // 4-Layer Trust Model
    const trustLayers: TrustLayers = {
      originalSource: "fromCorpus",
      translation: "fromCorpus",
      commentary: resolvedSources.some((s) => s.commentary) ? "fromVerifiedSource" : "notAvailable",
      aiInterpretation: "aiGenerated",
    };

    // Diagnostics
    const totalTimeMs = Date.now() - startTime;
    const diagnostics: RetrievalDiagnostics = {
      queryEmbeddingTimeMs: 12,
      retrievalTimeMs,
      rerankTimeMs: 4,
      generationTimeMs,
      totalTimeMs,
      candidatesRetrieved: retrievalResult.candidates.length,
      candidatesAfterRerank: resolvedSources.length,
      topScore: retrievalResult.topScore,
      noMatchThreshold: retrievalResult.threshold,
      retrievedCanonicalIds: candidateIds,
      rerankScores: retrievalResult.candidates.map((c) => ({
        canonicalId: c.record.canonicalId,
        score: c.finalScore,
      })),
    };

    // Structured Telemetry Record
    const telemetry: ReflectionTelemetry = {
      requestId: messageId,
      sessionId,
      provider: genOutput.telemetry.provider,
      model: genOutput.telemetry.model,
      llmCalled: genOutput.telemetry.llmCalled,
      fallbackUsed: genOutput.telemetry.fallbackUsed,
      fallbackReason: genOutput.telemetry.fallbackReason,
      retrievalMethod: "in_memory_taxonomy",
      retrievalConfidence:
        retrievalResult.ragOutcome === "strongMatch"
          ? "HIGH_CONFIDENCE"
          : retrievalResult.ragOutcome === "weakMatch"
          ? "LOW_CONFIDENCE"
          : "NO_MATCH",
      candidatesRetrieved: retrievalResult.candidates.length,
      candidatesAfterRerank: resolvedSources.length,
      selectedSourceIds: resolvedSources.map((s) => s.canonicalId),
      safetyDecision: safetyResult.decision,
      outputSafetyPassed: outputSafety.passed,
      latencyMs: totalTimeMs,
      timestamp: new Date().toISOString(),
    };

    Logger.info("Reflection processed successfully", {
      requestId: messageId,
      provider: telemetry.provider,
      model: telemetry.model,
      latencyMs: totalTimeMs,
      ragOutcome: retrievalResult.ragOutcome,
    });

    const response: CreateReflectionResponse = {
      id: messageId,
      sessionId,
      userInput,
      selectedEmotion: request.selectedEmotion || null,
      responseType,
      ragOutcome: retrievalResult.ragOutcome,
      emotionalReading,
      sources: resolvedSources,
      reflection,
      trustLayers,
      diagnostics,
      createdAt: new Date().toISOString(),
    };

    await this.persistReflection(response);
    return response;
  }

  private async persistReflection(response: CreateReflectionResponse): Promise<void> {
    ReflectionService.inMemoryReflections.set(response.id, response);

    try {
      const db = await connectToDatabase();
      if (db) {
        await ReflectionSession.findOneAndUpdate(
          { sessionId: response.sessionId },
          {
            $set: {
              sessionId: response.sessionId,
              lastActiveAt: new Date(),
              updatedAt: new Date(),
            },
            $setOnInsert: {
              createdAt: new Date(),
              metadata: {
                userAgent: "drishti-client",
                ipAddressHash: "anonymized",
                disclaimerAccepted: true,
              },
            },
          },
          { upsert: true }
        );

        await ReflectionMessage.create({
          messageId: response.id,
          sessionId: response.sessionId,
          userInput: response.userInput,
          selectedEmotion: response.selectedEmotion,
          emotionalReading: response.emotionalReading,
          sources: response.sources.map((s) => ({
            canonicalId: s.canonicalId,
            sourceName: s.sourceName,
            chapter: s.chapter,
            verse: s.verse,
            relevanceScore: s.relevanceScore,
            originalText: s.originalText,
            translation: s.translation,
          })),
          reflection: response.reflection,
          trustLayers: response.trustLayers,
          diagnostics: response.diagnostics,
          createdAt: new Date(),
        });
      }
    } catch {
      // In-memory reflection is preserved
    }
  }

  async getReflectionById(id: string): Promise<ReflectionMessageResponse | null> {
    const mem = ReflectionService.inMemoryReflections.get(id);
    if (mem) return mem;

    try {
      const db = await connectToDatabase();
      if (db) {
        const doc = (await ReflectionMessage.findOne({ messageId: id }).lean()) as unknown as Record<string, unknown>;
        if (doc) {
          return {
            id: String(doc.messageId || id),
            sessionId: String(doc.sessionId || ""),
            userInput: String(doc.userInput || ""),
            selectedEmotion: (doc.selectedEmotion as string) || null,
            responseType: doc.reflection ? "reflection" : "no_match",
            ragOutcome: Array.isArray(doc.sources) && doc.sources.length > 0 ? "strongMatch" : "noStrongMatch",
            emotionalReading: doc.emotionalReading as ReflectionMessageResponse["emotionalReading"],
            sources: (doc.sources || []) as ReflectionMessageResponse["sources"],
            reflection: (doc.reflection || null) as ReflectionMessageResponse["reflection"],
            trustLayers: doc.trustLayers as ReflectionMessageResponse["trustLayers"],
            diagnostics: doc.diagnostics as ReflectionMessageResponse["diagnostics"],
            createdAt: doc.createdAt instanceof Date ? doc.createdAt.toISOString() : new Date().toISOString(),
          };
        }
      }
    } catch {
      // Ignore
    }

    return null;
  }
}
