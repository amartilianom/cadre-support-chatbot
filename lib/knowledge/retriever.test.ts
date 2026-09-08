import { describe, it, expect } from "vitest";
import { lexicalRetriever, buildContext } from "./retriever";

// The retriever indexes the active profile's corpus at module load. With CLIENT_PROFILE unset it
// defaults to the Cadre corpus, so these assertions pin the BM25 seam against known Cadre topics.
describe("lexicalRetriever.retrieve", () => {
  it("ranks the on-topic chunk first for distinctive queries", () => {
    const cases: Array<[string, string]> = [
      ["How do I get scored on the AI Maturity Index?", "maturity-index"],
      ["How do I access the client portal?", "portal"],
      ["Which LLM providers do you use and how is my data secured?", "llm-security"],
      ["Do you work with private equity and mortgage lending?", "industries"],
      ["What is your pricing?", "pricing"],
    ];
    for (const [query, expectedId] of cases) {
      const top = lexicalRetriever.retrieve(query)[0];
      expect(top, `query: ${query}`).toBeDefined();
      expect(top.chunk.id, `query: ${query}`).toBe(expectedId);
    }
  });

  it("returns nothing for off-topic queries (grounding — the bot must not fabricate)", () => {
    for (const offTopic of [
      "What's the weather forecast in Paris tomorrow?",
      "Write me a poem about dragons",
      "asdfghjkl qwerty zxcvbn",
    ]) {
      expect(lexicalRetriever.retrieve(offTopic), offTopic).toHaveLength(0);
    }
  });

  it("respects topK and returns descending scores", () => {
    const results = lexicalRetriever.retrieve("Cadre AI services and strategy", 2);
    expect(results.length).toBeLessThanOrEqual(2);
    for (let i = 1; i < results.length; i++) {
      expect(results[i - 1].score).toBeGreaterThanOrEqual(results[i].score);
    }
  });
});

describe("buildContext", () => {
  it("returns a sentinel when nothing was retrieved", () => {
    expect(buildContext([])).toBe("(no relevant knowledge found)");
  });

  it("includes each chunk's title, source, and text", () => {
    const retrieved = lexicalRetriever.retrieve("AI Maturity Index");
    const context = buildContext(retrieved);
    expect(context).toContain("AI Maturity Index");
    expect(context).toContain("Source:");
    expect(context).toContain("eight-pillar");
  });
});
