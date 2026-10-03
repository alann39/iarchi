'use client';

import {useCallback, useEffect, useRef, useState} from 'react';
import {ArrowRight} from 'lucide-react';

import {ChatDock} from './ChatDock';
import {MessageList} from './MessageList';
import {SuggestedQuestions} from './SuggestedQuestions';
import type {ChatMessage, ToolEvent} from './types';

export interface HomeClientProps {
  /** Suggested questions from Sanity (or FALLBACK defaults from the server). */
  suggestedQuestions: string[];
  /** CV download URL from siteSettings (threaded to ChatDock). */
  cvUrl?: string;
  /** Contact email from siteSettings (threaded to ChatDock). */
  contactEmail?: string;
}

// Hidden prompt per specs/07-UX-FLOWS.md Flow 5. The visitor taps the button;
// the API receives the full instruction while the bubble shows a friendly label.
const FULL_STORY_API_PROMPT = 'Tell me your full story as a narrative bio (max 400 words).';
const FULL_STORY_LABEL = 'Tell me your full story';

const FRIENDLY_LLM_ERROR = 'Hmm, my brain buffered. Mind trying again?';
const FRIENDLY_RATE_LIMITED = 'Whoa, lots of questions — give me a minute.';

type HistoryMessage = {role: 'user' | 'assistant'; content: string};

interface SseEvent {
  type: 'text' | 'tool' | 'done' | 'error';
  delta?: string;
  name?: string;
  result?: ToolEvent['result'];
  code?: string;
  message?: string;
}

/**
 * Minimal SSE client for POST /api/chat — specs/03-CONTRACTS.md §1.
 * (ChatDock owns an equivalent client for dock-typed sends; this one serves
 * external triggers — suggested chips and the full-story button — which the
 * dock cannot initiate. Kept compact and self-contained on purpose.)
 */
async function postChatStream(
  history: HistoryMessage[],
  signal: AbortSignal,
  onEvent: (event: SseEvent) => void,
): Promise<void> {
  const res = await fetch('/api/chat', {
    method: 'POST',
    headers: {'Content-Type': 'application/json'},
    body: JSON.stringify({messages: history}),
    signal,
  });

  if (res.status === 429) {
    const data = (await res.json().catch(() => null)) as {message?: string} | null;
    onEvent({type: 'error', code: 'RATE_LIMITED', message: data?.message ?? FRIENDLY_RATE_LIMITED});
    return;
  }
  if (!res.ok || !res.body) {
    onEvent({type: 'error', code: 'LLM_ERROR', message: FRIENDLY_LLM_ERROR});
    return;
  }

  const reader = res.body.getReader();
  const decoder = new TextDecoder();
  let buffer = '';
  for (;;) {
    const {done, value} = await reader.read();
    if (done) break;
    buffer += decoder.decode(value, {stream: true});
    const lines = buffer.split('\n');
    buffer = lines.pop() ?? '';
    for (const line of lines) {
      const trimmed = line.trim();
      if (!trimmed.startsWith('data:')) continue;
      const data = trimmed.slice(5).trim();
      if (!data) continue;
      try {
        onEvent(JSON.parse(data) as SseEvent);
      } catch {
        // Skip malformed lines — never crash the stream.
      }
    }
  }
}

/**
 * Client shell for the landing page — owns all chat state.
 * Rendered by the page Server Component after it fetches the portfolio.
 * Chat works even when Sanity is unreachable: the API answers in degraded
 * mode (specs/07-UX-FLOWS.md E3) and the client just renders what comes back.
 */
export function HomeClient({suggestedQuestions, cvUrl, contactEmail}: HomeClientProps) {
  const [messages, setMessages] = useState<ChatMessage[]>([]);
  const [sending, setSending] = useState(false);

  // Synchronous mirror of messages for use inside callbacks (avoids stale closures).
  const messagesRef = useRef<ChatMessage[]>([]);
  const streamingIdRef = useRef<string | null>(null);
  const abortRef = useRef<AbortController | null>(null);
  const idCounter = useRef(0);

  const nextId = () => `m${Date.now()}-${idCounter.current++}`;

  const setMessagesSync = (next: ChatMessage[]) => {
    messagesRef.current = next;
    setMessages(next);
  };

  /** Apply a transform to the in-flight streaming assistant message, if any. */
  const patchStreaming = useCallback((fn: (m: ChatMessage) => ChatMessage) => {
    const id = streamingIdRef.current;
    if (!id) return;
    setMessagesSync(messagesRef.current.map((m) => (m.id === id ? fn(m) : m)));
  }, []);

  /** Finalize an in-flight stream left hanging by a superseding send. */
  const settleStreaming = useCallback(() => {
    const id = streamingIdRef.current;
    streamingIdRef.current = null;
    abortRef.current?.abort();
    abortRef.current = null;
    if (id) {
      setMessagesSync(
        messagesRef.current.map((m) => (m.id === id && m.status === 'streaming' ? {...m, status: 'complete'} : m)),
      );
    }
    setSending(false);
  }, []);

  const handleStreamError = useCallback(
    (code: string, message: string) => {
      const id = streamingIdRef.current;
      streamingIdRef.current = null;
      abortRef.current = null;
      setSending(false);
      const friendly = code === 'RATE_LIMITED' ? FRIENDLY_RATE_LIMITED : message;
      if (id) {
        // Keep any partial content (E10); otherwise show the friendly message.
        // MessageBubble renders the Retry affordance for error status.
        setMessagesSync(
          messagesRef.current.map((m) =>
            m.id === id ? {...m, status: 'error', errorCode: code, content: m.content || friendly} : m,
          ),
        );
      } else {
        setMessagesSync([
          ...messagesRef.current,
          {id: nextId(), role: 'assistant', content: friendly, status: 'error', errorCode: code},
        ]);
      }
    },
    [],
  );

  const routeStreamEvents = useCallback(
    (controller: AbortController, history: HistoryMessage[]) => {
      void postChatStream(history, controller.signal, (event) => {
        if (event.type === 'text' && event.delta) {
          const delta = event.delta;
          patchStreaming((m) => ({...m, content: m.content + delta}));
        } else if (event.type === 'tool' && event.name) {
          const toolEvent: ToolEvent = {name: event.name, result: event.result ?? {}};
          patchStreaming((m) => ({...m, tools: [...(m.tools ?? []), toolEvent]}));
        } else if (event.type === 'done') {
          patchStreaming((m) => ({...m, status: 'complete'}));
          streamingIdRef.current = null;
          abortRef.current = null;
          setSending(false);
        } else if (event.type === 'error') {
          handleStreamError(event.code ?? 'LLM_ERROR', event.message ?? FRIENDLY_LLM_ERROR);
        }
      }).catch(() => {
        if (!controller.signal.aborted) {
          handleStreamError('NETWORK_ERROR', FRIENDLY_LLM_ERROR);
        }
      });
    },
    [patchStreaming, handleStreamError],
  );

  /**
   * Append the user + streaming-assistant message pair and return the API
   * history. Does NOT start the network request — the caller owns that, so
   * ChatDock (which POSTs itself after onUserSend) and external triggers
   * (which POST via runStream below) never double-send.
   */
  const prepareSend = useCallback(
    (apiText: string, displayText?: string): HistoryMessage[] | null => {
      const trimmed = apiText.trim();
      if (!trimmed || streamingIdRef.current) return null;
      settleStreaming();

      const prev = messagesRef.current;
      const userMsg: ChatMessage = {
        id: nextId(),
        role: 'user',
        content: displayText ?? trimmed,
        status: 'complete',
      };
      const aiMsg: ChatMessage = {
        id: nextId(),
        role: 'assistant',
        content: '',
        status: 'streaming',
        tools: [],
      };
      streamingIdRef.current = aiMsg.id;
      setMessagesSync([...prev, userMsg, aiMsg]);
      setSending(true);
      return [...prev.map((m) => ({role: m.role, content: m.content})), {role: 'user' as const, content: trimmed}];
    },
    [settleStreaming],
  );

  /** Full send path for external triggers (chips, full-story button). */
  const sendExternal = useCallback(
    (apiText: string, displayText?: string) => {
      const history = prepareSend(apiText, displayText);
      if (!history) return;
      const controller = new AbortController();
      abortRef.current = controller;
      routeStreamEvents(controller, history);
    },
    [prepareSend, routeStreamEvents],
  );

  // --- ChatDock wiring -----------------------------------------------------
  // The dock POSTs itself after onUserSend; these callbacks only maintain
  // the shared message state (including the critical onTool wiring that
  // appends tool events to the streaming message's tools array).

  const handleDockUserSend = useCallback(
    (text: string) => {
      prepareSend(text);
    },
    [prepareSend],
  );

  const handleDockDelta = useCallback(
    (delta: string) => {
      patchStreaming((m) => ({...m, content: m.content + delta}));
    },
    [patchStreaming],
  );

  const handleDockTool = useCallback(
    (event: ToolEvent) => {
      patchStreaming((m) => ({...m, tools: [...(m.tools ?? []), event]}));
    },
    [patchStreaming],
  );

  const handleDockDone = useCallback(() => {
    patchStreaming((m) => ({...m, status: 'complete'}));
    streamingIdRef.current = null;
    abortRef.current = null;
    setSending(false);
  }, [patchStreaming]);

  const handleDockError = useCallback(
    (code: string, message: string) => {
      handleStreamError(code, message);
    },
    [handleStreamError],
  );

  // --- Suggested questions + full story ------------------------------------

  const handleSelectQuestion = useCallback(
    (question: string) => {
      sendExternal(question);
    },
    [sendExternal],
  );

  const handleFullStory = useCallback(() => {
    sendExternal(FULL_STORY_API_PROMPT, FULL_STORY_LABEL);
  }, [sendExternal]);

  const handleRetry = useCallback(
    (messageId: string) => {
      const msgs = messagesRef.current;
      const idx = msgs.findIndex((m) => m.id === messageId);
      if (idx < 0) return;
      let userText: string | null = null;
      for (let i = idx - 1; i >= 0; i--) {
        if (msgs[i].role === 'user') {
          userText = msgs[i].content;
          break;
        }
      }
      if (!userText) return;
      const filtered = msgs.filter((m) => m.id !== messageId);
      messagesRef.current = filtered;
      setMessages(filtered);
      sendExternal(userText);
    },
    [sendExternal],
  );

  // Abort in-flight request on unmount.
  useEffect(() => {
    return () => abortRef.current?.abort();
  }, []);

  const showChips = messages.length === 0;

  return (
    <>
      {/* 01 — Ask */}
      <section aria-label="Ask" className="mt-12">
        <p className="font-['IBM_Plex_Mono',monospace] text-[11px] uppercase tracking-[0.12em] text-[#6E7680]">
          01 — Ask
        </p>
        <div className="mt-3.5">
          {showChips && <SuggestedQuestions questions={suggestedQuestions} onSelect={handleSelectQuestion} />}
        </div>
        <div className="my-6 flex items-center gap-4" aria-hidden="true">
          <span className="h-px flex-1 bg-[rgba(16,20,24,0.12)]" />
          <span className="font-['IBM_Plex_Mono',monospace] text-[11px] uppercase tracking-[0.12em] text-[rgba(16,20,24,0.45)]">
            or
          </span>
          <span className="h-px flex-1 bg-[rgba(16,20,24,0.12)]" />
        </div>
        <button
          type="button"
          onClick={handleFullStory}
          disabled={sending}
          className="flex w-full items-center justify-between rounded-[12px] border-[1.5px] border-[#101418] bg-white px-5 py-4 text-left shadow-[3px_3px_0_#101418] transition-all duration-100 hover:-translate-x-[1px] hover:-translate-y-[1px] hover:shadow-[4px_4px_0_#101418] active:translate-x-[2px] active:translate-y-[2px] active:shadow-[1px_1px_0_#101418] disabled:cursor-not-allowed disabled:opacity-60 disabled:hover:translate-x-0 disabled:hover:translate-y-0 disabled:hover:shadow-[3px_3px_0_#101418]"
        >
          <span>
            <span className="block font-['IBM_Plex_Mono',monospace] text-[11px] uppercase tracking-[0.12em] text-[#6E7680]">
              02 —
            </span>
            <span className="mt-1 block font-['Space_Grotesk',sans-serif] text-[16px] font-semibold tracking-[-0.01em] text-[#101418]">
              Read the full story
            </span>
          </span>
          <ArrowRight size={18} className="shrink-0 text-[#101418]" aria-hidden="true" />
        </button>
      </section>

      {/* Conversation */}
      {messages.length > 0 && (
        <section aria-label="Conversation" className="mt-12">
          <MessageList messages={messages} onRetry={handleRetry} />
        </section>
      )}

      <ChatDock
        messages={messages}
        onUserSend={handleDockUserSend}
        onDelta={handleDockDelta}
        onTool={handleDockTool}
        onDone={handleDockDone}
        onError={handleDockError}
        cvUrl={cvUrl}
        contactEmail={contactEmail}
      />
    </>
  );
}
