// Egg 2 — secret chat phrases (P3, specs/04-TASKS.md TASK-16).
//
// Archi: edit freely — each line is "exact trigger": "scripted reply".
// Replies render as authored chat messages (trailing ■ marker). Matching is
// exact (lowercase + trim), client-side, and runs BEFORE the LLM call, so
// scripted replies never touch the API and can never trip the BAD_RESPONSE
// leak guard. Suggested-question chips must NEVER list these phrases.

export const SECRET_PHRASES: Record<string, string> = {
  'sudo hire archi':
    'Permission granted. Forwarding your dossier to the human — expect a reply within one business day. ■',
  'open the pod bay doors':
    "I'm afraid I can't do that. But I can open his CV — type /cv. ■",
  'who are you really':
    'A portfolio with a chat interface and delusions of grandeur. The human is Archi — he builds things. ■',
};

/** Exact-match lookup. Returns the scripted reply, or null. */
export function matchSecretPhrase(text: string): string | null {
  const key = text.trim().toLowerCase();
  return Object.hasOwn(SECRET_PHRASES, key) ? SECRET_PHRASES[key] : null;
}
