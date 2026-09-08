/**
 * Minimal fixed-window in-memory rate limiter (TC-043 — bound LLM cost-abuse). Best-effort and
 * per-instance (not distributed); adequate for an MVP. A production version would use Upstash/Redis.
 */
type Bucket = { count: number; resetAt: number };

const buckets = new Map<string, Bucket>();
const WINDOW_MS = 60_000;
const MAX_REQUESTS = 20;

export function rateLimit(key: string): { ok: boolean; retryAfter?: number } {
  const now = Date.now();
  const bucket = buckets.get(key);
  if (!bucket || now > bucket.resetAt) {
    buckets.set(key, { count: 1, resetAt: now + WINDOW_MS });
    return { ok: true };
  }
  if (bucket.count >= MAX_REQUESTS) {
    return { ok: false, retryAfter: Math.ceil((bucket.resetAt - now) / 1000) };
  }
  bucket.count += 1;
  return { ok: true };
}
