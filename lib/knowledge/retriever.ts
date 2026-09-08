/**
 * KnowledgeRetriever seam (D-02, L-12). MVP implementation: lexical BM25-lite scoring over the
 * curated corpus — instant, dependency-free, and deploys anywhere (no model cold-start). The
 * interface is intentionally minimal so a semantic (embeddings / pgvector) retriever can be swapped
 * in later with the same signature.
 */
import { corpus, type KbChunk } from "./corpus";

export type RetrievedChunk = { chunk: KbChunk; score: number };

export interface KnowledgeRetriever {
  retrieve(query: string, topK?: number): RetrievedChunk[];
}

const STOPWORDS = new Set([
  "the", "a", "an", "and", "or", "of", "to", "in", "on", "for", "is", "are", "am", "be", "do",
  "does", "did", "you", "your", "we", "our", "i", "me", "my", "it", "this", "that", "with", "how",
  "what", "who", "can", "could", "would", "should", "will", "about", "at", "as", "by", "from",
  "have", "has", "get", "there", "their", "they", "if", "so", "any", "some", "me", "us",
]);

function tokenize(input: string): string[] {
  return input
    .toLowerCase()
    .replace(/[^a-z0-9\s]/g, " ")
    .split(/\s+/)
    .filter((t) => t.length > 1 && !STOPWORDS.has(t))
    .map((t) => (t.endsWith("s") && t.length > 3 ? t.slice(0, -1) : t)); // crude singularization
}

type Indexed = { chunk: KbChunk; tf: Map<string, number>; len: number };

// Build the index once at module load (corpus is small and static).
const indexed: Indexed[] = corpus.map((chunk) => {
  // Title terms are weighted by indexing the title twice.
  const tokens = [...tokenize(chunk.title), ...tokenize(chunk.title), ...tokenize(chunk.text)];
  const tf = new Map<string, number>();
  for (const t of tokens) tf.set(t, (tf.get(t) ?? 0) + 1);
  return { chunk, tf, len: tokens.length };
});

const N = indexed.length;
const df = new Map<string, number>();
for (const { tf } of indexed) for (const term of tf.keys()) df.set(term, (df.get(term) ?? 0) + 1);
const avgdl = indexed.reduce((s, d) => s + d.len, 0) / Math.max(N, 1);

const K1 = 1.5;
const B = 0.75;

export const lexicalRetriever: KnowledgeRetriever = {
  retrieve(query: string, topK = 4): RetrievedChunk[] {
    const qTerms = [...new Set(tokenize(query))];
    const scored = indexed.map(({ chunk, tf, len }) => {
      let score = 0;
      for (const term of qTerms) {
        const f = tf.get(term) ?? 0;
        if (f === 0) continue;
        const nq = df.get(term) ?? 0;
        const idf = Math.log(1 + (N - nq + 0.5) / (nq + 0.5));
        score += idf * ((f * (K1 + 1)) / (f + K1 * (1 - B + (B * len) / avgdl)));
      }
      return { chunk, score };
    });
    return scored
      .filter((s) => s.score > 0)
      .sort((a, b) => b.score - a.score)
      .slice(0, topK);
  },
};

/** Format retrieved chunks as grounding context for the system prompt. */
export function buildContext(retrieved: RetrievedChunk[]): string {
  if (retrieved.length === 0) return "(no relevant knowledge found)";
  return retrieved
    .map((r) => `### ${r.chunk.title}\nSource: ${r.chunk.sourceUrl}\n${r.chunk.text}`)
    .join("\n\n");
}
