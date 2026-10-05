/**
 * POST /api/chat — the ONLY LLM caller in the app (Constitution §2).
 *
 * Contract: specs/03-CONTRACTS.md §1. Flow: specs/02-ARCHITECTURE.md §3.
 * - Validates body (rejects role:"system"/empty content, enforces 1–50 msgs;
 *   over-length content is truncated to 2000 chars, not rejected).
 * - Rate-limits 20 req/min/IP (in-memory).
 * - Builds the system prompt from Sanity portfolio content (anti-hallucination).
 * - Calls an OpenAI-compatible LLM with tools, streaming SSE back to the client.
 * - Executes tools server-side from already-fetched portfolio data.
 * - MOCK_LLM=1 returns a canned stream without calling any LLM.
 *
 * Never logs user message content. Never leaks the system prompt.
 */

import {NextRequest} from 'next/server'

import {checkRateLimit} from '@/lib/rate-limit'
import type {
  ContactData,
  ExperienceCardData,
  PickData,
  PortfolioData,
  ProfileData,
  ProjectCardData,
  SkillGroupData,
} from '@/lib/portfolio'

export const runtime = 'nodejs'

// ---------------------------------------------------------------------------
// SSE event shapes — specs/03-CONTRACTS.md §1
// ---------------------------------------------------------------------------

type SseEvent =
  | {type: 'text'; delta: string}
  | {type: 'tool'; name: string; args: Record<string, unknown>; result: ToolResult}
  | {type: 'done'}
  | {type: 'error'; code: 'RATE_LIMITED' | 'LLM_ERROR' | 'BAD_REQUEST' | 'BAD_RESPONSE'; message: string}

type ToolResult =
  | {projects: ProjectCardData[]}
  | {experience: ExperienceCardData[]}
  | {groups: SkillGroupData[]}
  | {contacts: ContactData[]}
  | {profile: ProfileData | null}
  | {picks: PickData[]}

const FRIENDLY_LLM_ERROR =
  "Hmm, my brain buffered. Mind trying again?"
const FRIENDLY_BAD_REQUEST =
  "Hmm, that message didn't look right — try sending it again."
const FRIENDLY_RATE_LIMITED =
  'Whoa, lots of questions — give me a minute.'

const LLM_TIMEOUT_MS = 30_000
const MAX_OUTPUT_TOKENS = 800

// ---------------------------------------------------------------------------
// Request validation
// ---------------------------------------------------------------------------

interface ValidatedMessage {
  role: 'user' | 'assistant'
  content: string
}

/**
 * Max chars per message sent to the LLM. Over-length messages are TRUNCATED,
 * not rejected — our own long assistant answers (e.g. the 400-word full
 * story) would otherwise 400 the user's *next* message (bug found 2026-10-05).
 * The bound still caps abuse: at most 50 msgs × MAX_MESSAGE_CHARS per request.
 */
const MAX_MESSAGE_CHARS = 2000

function validateBody(body: unknown): ValidatedMessage[] | null {
  if (typeof body !== 'object' || body === null) return null
  const messages = (body as {messages?: unknown}).messages
  if (!Array.isArray(messages) || messages.length < 1 || messages.length > 50) return null

  const out: ValidatedMessage[] = []
  for (const m of messages) {
    if (typeof m !== 'object' || m === null) return null
    const {role, content} = m as {role?: unknown; content?: unknown}
    // Only user/assistant — "system" (or anything else) from the client is rejected.
    if (role !== 'user' && role !== 'assistant') return null
    if (typeof content !== 'string' || content.length < 1) return null
    out.push({role, content: content.slice(0, MAX_MESSAGE_CHARS)})
  }
  return out
}

function getClientIp(req: NextRequest): string {
  const forwarded = req.headers.get('x-forwarded-for')
  if (forwarded) {
    const first = forwarded.split(',')[0]?.trim()
    if (first) return first
  }
  const realIp = req.headers.get('x-real-ip')?.trim()
  if (realIp) return realIp
  return 'unknown'
}

function errorJson(code: 'BAD_REQUEST' | 'RATE_LIMITED', message: string, status: number): Response {
  return Response.json({type: 'error', code, message}, {status})
}

// ---------------------------------------------------------------------------
// LLM tool definitions — specs/03-CONTRACTS.md §2
// ---------------------------------------------------------------------------

interface ToolDefinition {
  type: 'function'
  function: {
    name: string
    description: string
    parameters: {
      type: 'object'
      properties: Record<string, {type: string; description: string}>
      additionalProperties: boolean
    }
  }
}

const TOOLS: ToolDefinition[] = [
  {
    type: 'function',
    function: {
      name: 'show_projects',
      description:
        "Show Archi's projects as rich cards. Call when the user asks about projects, work, or things Archi built.",
      parameters: {
        type: 'object',
        properties: {
          tag: {type: 'string', description: 'Filter projects by tag'},
          limit: {type: 'integer', description: 'Max projects to return (default 6, max 12)'},
        },
        additionalProperties: false,
      },
    },
  },
  {
    type: 'function',
    function: {
      name: 'show_experience',
      description:
        "Show Archi's work history as cards. Call when the user asks about experience, jobs, or career.",
      parameters: {type: 'object', properties: {}, additionalProperties: false},
    },
  },
  {
    type: 'function',
    function: {
      name: 'show_skills',
      description:
        "Show Archi's skill groups. Call when the user asks about skills, stack, or tools.",
      parameters: {type: 'object', properties: {}, additionalProperties: false},
    },
  },
  {
    type: 'function',
    function: {
      name: 'show_contact',
      description:
        'Show contact rows (email, GitHub, LinkedIn, etc.). Call when the user asks how to contact or reach Archi.',
      parameters: {type: 'object', properties: {}, additionalProperties: false},
    },
  },
  {
    type: 'function',
    function: {
      name: 'show_profile',
      description:
        "Show Archi's profile card. Call when the user asks who Archi is or for a full story.",
      parameters: {type: 'object', properties: {}, additionalProperties: false},
    },
  },
  {
    type: 'function',
    function: {
      name: 'show_taste',
      description:
        "Show Archi's personal favorites: music and movies. Call when the user asks about favorite music, songs, movies, films, or taste.",
      parameters: {
        type: 'object',
        properties: {
          category: {type: 'string', description: 'Filter: "music" or "movie"'},
        },
        additionalProperties: false,
      },
    },
  },
]

// ---------------------------------------------------------------------------
// Server-side tool execution — from already-fetched portfolio data.
// The LLM never supplies data, only the tool name + args.
// ---------------------------------------------------------------------------

function executeTool(
  name: string,
  rawArgs: unknown,
  portfolio: PortfolioData,
): {name: string; args: Record<string, unknown>; result: ToolResult} | null {
  const args: Record<string, unknown> =
    typeof rawArgs === 'object' && rawArgs !== null && !Array.isArray(rawArgs)
      ? (rawArgs as Record<string, unknown>)
      : {}

  switch (name) {
    case 'show_projects': {
      const tag = typeof args['tag'] === 'string' ? args['tag'] : undefined
      let limit = 6
      if (args['limit'] !== undefined) {
        if (typeof args['limit'] !== 'number' || Number.isNaN(args['limit'])) return null
        limit = Math.min(12, Math.max(1, Math.floor(args['limit'])))
      }
      const filtered = tag
        ? portfolio.projects.filter((p) =>
            p.tags.some((t) => t.toLowerCase() === tag.toLowerCase()),
          )
        : portfolio.projects
      return {name, args, result: {projects: filtered.slice(0, limit)}}
    }
    case 'show_experience':
      return {name, args, result: {experience: portfolio.experience}}
    case 'show_skills':
      return {name, args, result: {groups: portfolio.skillGroups}}
    case 'show_contact':
      return {name, args, result: {contacts: portfolio.socialLinks}}
    case 'show_profile':
      return {name, args, result: {profile: portfolio.profile}}
    case 'show_taste': {
      const category =
        typeof args['category'] === 'string' ? args['category'].toLowerCase() : undefined
      const filtered =
        category === 'music' || category === 'movie'
          ? portfolio.picks.filter((p) => p.category === category)
          : portfolio.picks
      return {name, args, result: {picks: filtered}}
    }
    default:
      return null
  }
}

// ---------------------------------------------------------------------------
// OpenAI-compatible streaming chunk shapes (minimal)
// ---------------------------------------------------------------------------

interface StreamDeltaToolCall {
  index?: number
  id?: string
  function?: {name?: string; arguments?: string}
}

interface ChatCompletionChunk {
  choices?: Array<{
    delta?: {
      content?: string | null
      tool_calls?: StreamDeltaToolCall[]
    }
    finish_reason?: string | null
  }>
}

interface AccumulatedToolCall {
  id: string
  name: string
  arguments: string
}

/** Parse one SSE line into a chunk. Null for [DONE]/empty/malformed/non-data lines. */
function parseSseLine(line: string): ChatCompletionChunk | null {
  const trimmed = line.trim()
  if (!trimmed.startsWith('data:')) return null
  const data = trimmed.slice(5).trim()
  if (data === '[DONE]' || data === '') return null
  try {
    return JSON.parse(data) as ChatCompletionChunk
  } catch {
    // Skip malformed lines — never crash the stream on provider quirks.
    return null
  }
}

async function* readSseChunks(
  body: ReadableStream<Uint8Array>,
): AsyncGenerator<ChatCompletionChunk, void, void> {
  const reader = body.getReader()
  const decoder = new TextDecoder()
  let buffer = ''
  try {
    for (;;) {
      const {done, value} = await reader.read()
      if (done) break
      buffer += decoder.decode(value, {stream: true})
      const lines = buffer.split('\n')
      buffer = lines.pop() ?? ''
      for (const line of lines) {
        const chunk = parseSseLine(line)
        if (chunk) yield chunk
      }
    }
    // A provider may end the stream without a trailing newline — don't drop
    // the final data line (it can hold the last text delta or the tail of
    // tool-call arguments, which would otherwise break JSON.parse downstream).
    buffer += decoder.decode()
    const tail = parseSseLine(buffer)
    if (tail) yield tail
  } finally {
    reader.releaseLock()
  }
}

// ---------------------------------------------------------------------------
// Chain-of-thought leak guard — the free-tier model occasionally emits its
// reasoning ("Here's a thinking process: …") as answer text. Three layers:
//  1. Prompt RULES forbid revealing thinking (lib/chat-prompt.ts).
//  2. Streaming filter below strips <think>...</think> blocks (reasoning models).
//  3. Leak detector aborts the stream when the head looks like meta-reasoning.
// ---------------------------------------------------------------------------

interface ThinkFilterState {
  inThink: boolean
  carry: string
}

/** Longest tag fragment we may need to bridge across chunk boundaries. */
const THINK_TAIL = 16

function createThinkFilter(): ThinkFilterState {
  return {inThink: false, carry: ''}
}

/**
 * Streaming-safe removal of <think>…</think> blocks. Returns the safe-to-emit
 * portion of this chunk; a short tail is held back to catch tags split across
 * chunk boundaries. Call flushThinkFilter() when the stream ends.
 */
function filterThinkChunk(state: ThinkFilterState, delta: string): string {
  const openRe = /<think(?:ing)?[\s>]/i
  const closeRe = /<\/(?:think|thinking)\s*>/i
  let text = state.carry + delta
  let out = ''
  for (;;) {
    if (state.inThink) {
      const close = text.match(closeRe)
      if (!close || close.index === undefined) {
        state.carry = text.slice(-THINK_TAIL)
        return out
      }
      text = text.slice(close.index + close[0].length)
      state.inThink = false
      continue
    }
    const open = text.match(openRe)
    if (!open || open.index === undefined) {
      const emitUpTo = Math.max(0, text.length - THINK_TAIL)
      out += text.slice(0, emitUpTo)
      state.carry = text.slice(emitUpTo)
      return out
    }
    out += text.slice(0, open.index)
    text = text.slice(open.index)
    state.inThink = true
  }
}

/** Flush the held-back tail at stream end; drops it if still inside <think>. */
function flushThinkFilter(state: ThinkFilterState): string {
  const tail = state.carry
  state.carry = ''
  if (state.inThink) return ''
  return /<think(?:ing)?[\s>]/i.test(tail) ? '' : tail
}

/**
 * High-precision markers of untagged chain-of-thought leakage (observed in
 * production 2026-10-03: "Here's a thinking process: 1. Analyze User Input…").
 * A legitimate ≤120-word portfolio answer never contains these.
 */
const LEAK_PATTERNS: RegExp[] = [
  /thinking process/i,
  /analy[sz]e (the |user )?input/i,
  /check available tools/i,
  /the system (says|instructs|tells)/i,
  /as an ai language model/i,
  /"FACTS"/,
]

function looksLikeLeak(text: string): boolean {
  return LEAK_PATTERNS.some((re) => re.test(text))
}

// ---------------------------------------------------------------------------
// POST handler
// ---------------------------------------------------------------------------

export async function POST(req: NextRequest): Promise<Response> {
  // 1. Validate body.
  let body: unknown
  try {
    body = await req.json()
  } catch {
    return errorJson('BAD_REQUEST', FRIENDLY_BAD_REQUEST, 400)
  }
  const messages = validateBody(body)
  if (!messages) {
    return errorJson('BAD_REQUEST', FRIENDLY_BAD_REQUEST, 400)
  }

  // 2. Rate limit.
  const ip = getClientIp(req)
  const rl = checkRateLimit(ip)
  if (!rl.allowed) {
    return Response.json(
      {type: 'error', code: 'RATE_LIMITED', message: FRIENDLY_RATE_LIMITED},
      {
        status: 429,
        headers: {'Retry-After': String(rl.retryAfterSec ?? 60)},
      },
    )
  }

  // 3. Mock mode — canned stream, no LLM call.
  if (process.env.MOCK_LLM === '1') {
    return mockStream()
  }

  // 4. Config check (server-only env; never exposed).
  const baseUrl = process.env.LLM_BASE_URL
  const apiKey = process.env.LLM_API_KEY
  const model = process.env.LLM_MODEL
  if (!baseUrl || !apiKey || !model) {
    console.error('[chat] LLM config missing (baseUrl/apiKey/model)')
    return sseErrorStream('LLM_ERROR', FRIENDLY_LLM_ERROR)
  }

  // 5. Fetch portfolio + build system prompt (server-side only).
  // Dynamic imports: the Sanity client module throws at load time when its
  // env vars are missing. MOCK mode (and validation/rate-limit above) must
  // work without any Sanity config, so we load these lazily here.
  let portfolio: PortfolioData
  let systemPrompt: string
  try {
    const {getPortfolio} = await import('@/lib/portfolio')
    const {buildSystemPrompt} = await import('@/lib/chat-prompt')
    portfolio = await getPortfolio()
    systemPrompt = buildSystemPrompt(portfolio)
  } catch (e) {
    console.error('[chat] portfolio fetch failed', e instanceof Error ? e.message : 'unknown')
    return sseErrorStream('LLM_ERROR', FRIENDLY_LLM_ERROR)
  }

  // 6. Stream from the LLM.
  const stream = new ReadableStream<Uint8Array>({
    async start(controller) {
      const encoder = new TextEncoder()
      const send = (event: SseEvent): void => {
        controller.enqueue(encoder.encode(`data: ${JSON.stringify(event)}\n\n`))
      }
      const startedAt = Date.now()
      const aborter = new AbortController()
      const timeout = setTimeout(() => aborter.abort(), LLM_TIMEOUT_MS)
      try {
        const res = await fetch(`${baseUrl.replace(/\/$/, '')}/chat/completions`, {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
            Authorization: `Bearer ${apiKey}`,
          },
          body: JSON.stringify({
            model,
            messages: [{role: 'system', content: systemPrompt}, ...messages],
            tools: TOOLS,
            tool_choice: 'auto',
            stream: true,
            max_tokens: MAX_OUTPUT_TOKENS,
          }),
          signal: aborter.signal,
        })

        if (!res.ok || !res.body) {
          console.error('[chat] LLM request failed', {status: res.status})
          send({type: 'error', code: 'LLM_ERROR', message: FRIENDLY_LLM_ERROR})
          return
        }

        const toolCalls: AccumulatedToolCall[] = []
        const thinkFilter = createThinkFilter()
        let head = '' // cleaned-text head for leak detection (capped)
        let leakCheckedEarly = false
        let leaked = false
        let producedOutput = false // any text delta or tool event sent downstream
        const LEAK_CHECK_AT = 200
        const HEAD_CAP = 600

        for await (const chunk of readSseChunks(res.body)) {
          const delta = chunk.choices?.[0]?.delta
          if (!delta) continue
          if (typeof delta.content === 'string' && delta.content.length > 0) {
            const clean = filterThinkChunk(thinkFilter, delta.content)
            if (clean.length > 0) {
              if (head.length < HEAD_CAP) head += clean
              if (!leakCheckedEarly && head.length >= LEAK_CHECK_AT) {
                leakCheckedEarly = true
                if (looksLikeLeak(head)) {
                  leaked = true
                  break
                }
              }
              send({type: 'text', delta: clean})
              producedOutput = true
            }
          }
          for (const tc of delta.tool_calls ?? []) {
            const idx = tc.index ?? 0
            let acc = toolCalls[idx]
            if (!acc) {
              acc = {id: '', name: '', arguments: ''}
              toolCalls[idx] = acc
            }
            if (tc.id) acc.id = tc.id
            if (tc.function?.name) acc.name = tc.function.name
            if (tc.function?.arguments) acc.arguments += tc.function.arguments
          }
        }

        // Flush the think-filter tail, then run the final leak check for
        // short responses that never reached the early-check threshold.
        const tail = flushThinkFilter(thinkFilter)
        if (!leaked) {
          if (head.length < HEAD_CAP) head += tail
          if (looksLikeLeak(head)) {
            leaked = true
          } else if (tail.length > 0) {
            send({type: 'text', delta: tail})
            producedOutput = true
          }
        }

        if (leaked) {
          // Never surface chain-of-thought: the client replaces any partial
          // content with the friendly message on BAD_RESPONSE.
          try {
            aborter.abort()
          } catch {
            // ignore — stream is ending anyway
          }
          send({type: 'error', code: 'BAD_RESPONSE', message: FRIENDLY_LLM_ERROR})
          return
        }

        // Execute accumulated tool calls server-side, in order.
        for (const tc of toolCalls) {
          if (!tc.name) continue
          let parsedArgs: unknown = {}
          try {
            parsedArgs = tc.arguments ? JSON.parse(tc.arguments) : {}
          } catch {
            continue // Invalid args → skip tool, continue as text.
          }
          const executed = executeTool(tc.name, parsedArgs, portfolio)
          if (executed) {
            send({type: 'tool', ...executed})
            producedOutput = true
          }
        }

        if (!producedOutput) {
          // Provider returned 200 but produced no text and no tool calls
          // (hiccup / content filter). An empty bubble is worse than an
          // honest error with a Retry affordance.
          send({type: 'error', code: 'LLM_ERROR', message: FRIENDLY_LLM_ERROR})
        } else {
          send({type: 'done'})
        }
        console.log('[chat] ok', {ms: Date.now() - startedAt, producedOutput})
      } catch (e) {
        const isTimeout = e instanceof Error && e.name === 'AbortError'
        console.error('[chat] stream failed', {code: isTimeout ? 'timeout' : 'llm_error'})
        send({type: 'error', code: 'LLM_ERROR', message: FRIENDLY_LLM_ERROR})
      } finally {
        clearTimeout(timeout)
        controller.close()
      }
    },
  })

  return new Response(stream, {
    headers: {
      'Content-Type': 'text/event-stream',
      'Cache-Control': 'no-cache, no-transform',
      Connection: 'keep-alive',
    },
  })
}

// ---------------------------------------------------------------------------
// Helpers
// ---------------------------------------------------------------------------

/** SSE stream carrying a single error event (for failures before streaming). */
function sseErrorStream(
  code: 'LLM_ERROR',
  message: string,
): Response {
  const stream = new ReadableStream<Uint8Array>({
    start(controller) {
      controller.enqueue(
        new TextEncoder().encode(`data: ${JSON.stringify({type: 'error', code, message})}\n\n`),
      )
      controller.close()
    },
  })
  return new Response(stream, {
    headers: {
      'Content-Type': 'text/event-stream',
      'Cache-Control': 'no-cache, no-transform',
      Connection: 'keep-alive',
    },
  })
}

/** Canned SSE stream for MOCK_LLM=1 — no LLM call, no secrets touched. */
function mockStream(): Response {
  const stream = new ReadableStream<Uint8Array>({
    start(controller) {
      const encoder = new TextEncoder()
      const send = (event: SseEvent): void => {
        controller.enqueue(encoder.encode(`data: ${JSON.stringify(event)}\n\n`))
      }
      send({
        type: 'text',
        delta:
          "Hey! I'm Archi's portfolio assistant (mock mode). Ask me about his projects, experience, skills, or how to contact him.",
      })
      send({type: 'done'})
      controller.close()
    },
  })
  return new Response(stream, {
    headers: {
      'Content-Type': 'text/event-stream',
      'Cache-Control': 'no-cache, no-transform',
      Connection: 'keep-alive',
    },
  })
}
