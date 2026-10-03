/**
 * In-memory sliding-window rate limiter (TASK-04).
 *
 * Constitution §2: max 20 requests/minute per IP on `/api/chat`.
 * Server-only module — state lives in the Node.js process memory,
 * which is sufficient for v1 (single instance).
 */

const WINDOW_MS = 60_000; // 1 minute sliding window
const MAX_REQUESTS = 20; // max requests per window per IP

export interface RateLimitResult {
  allowed: boolean;
  /** Seconds until the oldest hit in the window expires. Present only when denied. */
  retryAfterSec?: number;
}

// ip -> request timestamps (ms), appended in chronological order
const hitsByIp = new Map<string, number[]>();
let lastSweepAt = 0;

/** Drop timestamps at/before the cutoff. Chronological order: expired entries are at the front. */
function prune(timestamps: number[], cutoff: number): void {
  while (timestamps.length > 0 && timestamps[0] <= cutoff) {
    timestamps.shift();
  }
}

/** Full sweep so IPs that never return don't leak memory. Runs at most once per window. */
function sweepAll(now: number): void {
  const cutoff = now - WINDOW_MS;
  for (const [ip, timestamps] of hitsByIp) {
    prune(timestamps, cutoff);
    if (timestamps.length === 0) {
      hitsByIp.delete(ip);
    }
  }
  lastSweepAt = now;
}

export function checkRateLimit(ip: string): RateLimitResult {
  const now = Date.now();

  if (now - lastSweepAt >= WINDOW_MS) {
    sweepAll(now);
  }

  let timestamps = hitsByIp.get(ip);
  if (timestamps === undefined) {
    timestamps = [];
    hitsByIp.set(ip, timestamps);
  } else {
    prune(timestamps, now - WINDOW_MS);
  }

  if (timestamps.length >= MAX_REQUESTS) {
    // Denied: report when the oldest hit expires so callers can set Retry-After.
    const retryAfterMs = timestamps[0] + WINDOW_MS - now;
    return { allowed: false, retryAfterSec: Math.max(1, Math.ceil(retryAfterMs / 1000)) };
  }

  timestamps.push(now);
  return { allowed: true };
}
