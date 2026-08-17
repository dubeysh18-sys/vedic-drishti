import { CitationService } from "@/services/citation.service";

describe("CitationService (Candidate-Restricted Validation)", () => {
  const service = new CitationService();

  it("should resolve valid in-corpus citations present in candidate set", async () => {
    const candidateIds = ["gita:2:47", "gita:2:14"];
    const results = await service.resolveCitations(["gita:2:47"], candidateIds);

    expect(results.length).toBe(1);
    expect(results[0].canonicalId).toBe("gita:2:47");
    expect(results[0].chapter).toBe(2);
    expect(results[0].verse).toBe(47);
    expect(results[0].originalText).toBeDefined();
    expect(results[0].translation).toBeDefined();
  });

  it("should discard citations that were NOT present in the retrieved candidate set", async () => {
    const candidateIds = ["gita:2:47"];
    // LLM tried to cite gita:2:14 which was not retrieved
    const results = await service.resolveCitations(["gita:2:14"], candidateIds);

    expect(results.length).toBe(0);
  });

  it("should discard hallucinated and non-existent IDs even if syntax matches", async () => {
    const candidateIds = ["gita:99:999"];
    const results = await service.resolveCitations(["gita:99:999"], candidateIds);

    expect(results.length).toBe(0);
  });

  it("should discard out-of-corpus IDs", async () => {
    const results = await service.resolveCitations(["bible:1:1", "quran:1:1"]);

    expect(results.length).toBe(0);
  });
});
