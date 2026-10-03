'use client';

import {useCallback, useEffect, useRef, useState} from 'react';
import {ArrowUp, Download, LoaderCircle, Mail} from 'lucide-react';
import {toast} from 'sonner';

import type {ChatMessage, ToolEvent} from './types';

export interface ChatDockProps {
  /** Conversation history, sent as API context on every request. */
  messages: ChatMessage[];
  /** Parent appends the user message and opens the streaming AI bubble. */
  onUserSend: (text: string) => void;
  /** Streaming text chunk arrived. */
  onDelta: (delta: string) => void;
  /** A tool call was executed server-side — parent attaches it to the AI message. */
  onTool: (event: ToolEvent) => void;
  /** Stream finished cleanly. */
  onDone: () => void;
  /** Stream failed — parent appends the error bubble. */
  onError: (code: string, message: string) => void;
  /** CV download URL from siteSettings; when missing, tapping toasts "CV coming soon". */
  cvUrl?: string;
  /** Contact email from siteSettings; when missing, the Let's Talk button is hidden. */
  contactEmail?: string;
  /**
   * True while a stream started outside the dock (suggestion chip, full-story
   * button, retry) is in flight. The dock's own `sending` state doesn't cover
   * those, so without this the textarea stays enabled and a send would include
   * the in-flight empty assistant placeholder in history → API 400.
   */
  busy?: boolean;
}

const PLACEHOLDERS = [
  'Ask about my projects…',
  'Ask about my work history…',
  'Ask about my stack…',
];

// Placeholder timing — specs/06-UI-SPEC.md §6:
// type 60ms/char, hold 2200ms, vanish 28ms/char, 500ms gap.
const TYPE_MS = 60;
const HOLD_MS = 2200;
const VANISH_MS = 28;
const GAP_MS = 500;

const MAX_ROWS = 5;
const ROW_PX = 24;

const FRIENDLY_NETWORK_ERROR = 'Hmm, my brain buffered. Mind trying again?';

// ---------------------------------------------------------------------------
// SSE client for POST /api/chat — contract specs/03-CONTRACTS.md §1.
// ---------------------------------------------------------------------------

interface SseEvent {
  type: 'text' | 'tool' | 'done' | 'error';
  delta?: string;
  name?: string;
  result?: ToolEvent['result'];
  code?: string;
  message?: string;
}

async function postChat(
  history: {role: 'user' | 'assistant'; content: string}[],
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
    onEvent({
      type: 'error',
      code: 'RATE_LIMITED',
      message: data?.message ?? 'Whoa, lots of questions — give me a minute.',
    });
    return;
  }
  if (!res.ok || !res.body) {
    onEvent({type: 'error', code: 'LLM_ERROR', message: FRIENDLY_NETWORK_ERROR});
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

// ---------------------------------------------------------------------------
// ChatDock
// ---------------------------------------------------------------------------

export function ChatDock({
  messages,
  onUserSend,
  onDelta,
  onTool,
  onDone,
  onError,
  cvUrl,
  contactEmail,
  busy = false,
}: ChatDockProps) {
  const [value, setValue] = useState('');
  const [sending, setSending] = useState(false);
  const [placeholder, setPlaceholder] = useState('');
  const textareaRef = useRef<HTMLTextAreaElement>(null);
  const dockRef = useRef<HTMLDivElement>(null);
  const abortRef = useRef<AbortController | null>(null);

  // Combined busy state: own send OR an externally-started stream (chip /
  // full-story / retry). The dock must not send while either is in flight.
  const isBusy = sending || busy;
  const canSend = value.trim().length > 0 && !isBusy;

  // 150ms shake on error — specs/06-UI-SPEC.md §6 state matrix.
  const shake = useCallback(() => {
    // translateX(-50%) is baked in: the dock is centered via left-1/2.
    dockRef.current?.animate(
      [
        {transform: 'translateX(-50%) translateX(0px)'},
        {transform: 'translateX(-50%) translateX(-6px)'},
        {transform: 'translateX(-50%) translateX(6px)'},
        {transform: 'translateX(-50%) translateX(-4px)'},
        {transform: 'translateX(-50%) translateX(4px)'},
        {transform: 'translateX(-50%) translateX(0px)'},
      ],
      {duration: 150, easing: 'ease-out'},
    );
  }, []);

  const fail = useCallback(
    (code: string, message: string) => {
      setSending(false);
      shake();
      onError(code, message);
    },
    [onError, shake],
  );

  // specs/07-UX-FLOWS.md Flow 3: never a dead button. With a URL → download
  // (same-origin) or open (external, e.g. https://cv.alann.works — the
  // `download` attribute is ignored cross-origin). Without → toast.
  const handleDownloadCV = useCallback(() => {
    if (!cvUrl) {
      toast('CV coming soon');
      return;
    }
    let url: URL;
    try {
      url = new URL(cvUrl, window.location.href);
    } catch {
      toast('CV coming soon');
      return;
    }
    if (url.origin === window.location.origin) {
      const a = document.createElement('a');
      a.href = url.href;
      a.download = '';
      document.body.appendChild(a);
      a.click();
      a.remove();
    } else {
      window.open(url.href, '_blank', 'noopener,noreferrer');
    }
    toast.success('CV downloaded ✓');
  }, [cvUrl]);

  // specs/07-UX-FLOWS.md Flow 4: mailto with prefilled subject.
  // The button itself is hidden when contactEmail is missing (see below).
  const handleLetsTalk = useCallback(() => {
    if (!contactEmail) return;
    const subject = encodeURIComponent('Hi Archi — found your portfolio');
    window.location.href = `mailto:${contactEmail}?subject=${subject}`;
  }, [contactEmail]);

  const handleSend = useCallback(async () => {
    const text = value.trim();
    if (!text || isBusy) return;
    onUserSend(text);
    setValue('');
    if (textareaRef.current) textareaRef.current.style.height = 'auto';
    setSending(true);

    const controller = new AbortController();
    abortRef.current = controller;
    // Never send the in-flight assistant placeholder (content '') as context —
    // the API rejects empty content with 400.
    const history = [
      ...messages
        .filter((m) => m.content.length > 0)
        .map((m) => ({role: m.role, content: m.content})),
      {role: 'user' as const, content: text},
    ];
    try {
      await postChat(history, controller.signal, (event) => {
        if (event.type === 'text' && event.delta) {
          onDelta(event.delta);
        } else if (event.type === 'tool' && event.name) {
          onTool({name: event.name, result: event.result ?? {}});
        } else if (event.type === 'done') {
          setSending(false);
          onDone();
        } else if (event.type === 'error') {
          fail(event.code ?? 'LLM_ERROR', event.message ?? FRIENDLY_NETWORK_ERROR);
        }
      });
    } catch {
      if (!controller.signal.aborted) {
        fail('NETWORK_ERROR', FRIENDLY_NETWORK_ERROR);
      } else {
        setSending(false);
      }
    } finally {
      abortRef.current = null;
    }
  }, [value, isBusy, messages, onUserSend, onDelta, onTool, onDone, fail]);

  // Abort in-flight request on unmount.
  useEffect(() => {
    return () => abortRef.current?.abort();
  }, []);

  // Placeholders-and-vanish rotation — only while idle and empty.
  useEffect(() => {
    if (isBusy || value !== '') return;
    let phrase = 0;
    let chars = 0;
    let timer: ReturnType<typeof setTimeout>;
    let cancelled = false;

    const typeTick = () => {
      if (cancelled) return;
      const current = PLACEHOLDERS[phrase];
      chars += 1;
      setPlaceholder(current.slice(0, chars));
      timer = setTimeout(chars >= current.length ? holdTick : typeTick, chars >= current.length ? HOLD_MS : TYPE_MS);
    };
    const holdTick = () => {
      if (cancelled) return;
      timer = setTimeout(vanishTick, VANISH_MS);
    };
    const vanishTick = () => {
      if (cancelled) return;
      const current = PLACEHOLDERS[phrase];
      chars -= 1;
      setPlaceholder(current.slice(0, Math.max(0, chars)));
      if (chars <= 0) {
        phrase = (phrase + 1) % PLACEHOLDERS.length;
        timer = setTimeout(typeTick, GAP_MS);
      } else {
        timer = setTimeout(vanishTick, VANISH_MS);
      }
    };

    timer = setTimeout(typeTick, GAP_MS);
    return () => {
      cancelled = true;
      clearTimeout(timer);
    };
  }, [isBusy, value]);

  const autosize = () => {
    const el = textareaRef.current;
    if (!el) return;
    el.style.height = 'auto';
    el.style.height = `${Math.min(el.scrollHeight, MAX_ROWS * ROW_PX)}px`;
  };

  const handleKeyDown = (e: React.KeyboardEvent<HTMLTextAreaElement>) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      void handleSend();
    }
  };

  return (
    <div ref={dockRef} className="fixed bottom-6 left-1/2 z-40 w-[min(680px,calc(100%-32px))] -translate-x-1/2">
      <div className="flex items-center gap-2 rounded-full border border-[rgba(16,20,24,0.08)] bg-[rgba(255,255,255,0.72)] py-2 pl-2 pr-2 shadow-[0_8px_32px_rgba(16,20,24,0.08)] backdrop-blur-[16px] backdrop-saturate-[160%]">
        <button
          type="button"
          onClick={handleDownloadCV}
          aria-label="Download CV"
          className="flex shrink-0 items-center gap-1.5 rounded-full border-[1.5px] border-[#101418] bg-white px-3.5 py-2 font-['IBM_Plex_Mono',monospace] text-[12px] text-[#101418] shadow-[3px_3px_0_#101418] transition-all duration-100 hover:-translate-x-[1px] hover:-translate-y-[1px] hover:shadow-[4px_4px_0_#101418] active:translate-x-[2px] active:translate-y-[2px] active:shadow-[1px_1px_0_#101418]"
        >
          <Download size={14} />
          <span className="max-[1100px]:hidden">Download CV</span>
        </button>
        {contactEmail && (
          <button
            type="button"
            onClick={handleLetsTalk}
            aria-label="Let's talk"
            className="flex shrink-0 items-center gap-1.5 rounded-full border-[1.5px] border-[#101418] bg-white px-3.5 py-2 font-['IBM_Plex_Mono',monospace] text-[12px] text-[#101418] shadow-[3px_3px_0_#101418] transition-all duration-100 hover:-translate-x-[1px] hover:-translate-y-[1px] hover:shadow-[4px_4px_0_#101418] active:translate-x-[2px] active:translate-y-[2px] active:shadow-[1px_1px_0_#101418]"
          >
            <Mail size={14} />
            <span className="max-[1100px]:hidden">Let&apos;s Talk!</span>
          </button>
        )}
        <textarea
          ref={textareaRef}
          rows={1}
          value={value}
          disabled={isBusy}
          onChange={(e) => {
            setValue(e.target.value);
            autosize();
          }}
          onKeyDown={handleKeyDown}
          placeholder={placeholder}
          aria-label="Ask about Archi"
          className="min-w-0 flex-1 resize-none border-0 bg-transparent px-2 py-2.5 text-[15px] leading-6 text-[#101418] placeholder:text-[rgba(16,20,24,0.35)] focus:outline-none disabled:opacity-60"
        />
        <button
          type="button"
          onClick={() => void handleSend()}
          disabled={!canSend}
          aria-label="Send message"
          className={`flex h-[42px] w-[42px] shrink-0 items-center justify-center rounded-full transition-all duration-100 ${
            canSend
              ? 'bg-[#FF4D00] text-white hover:scale-[1.04] active:translate-x-[2px] active:translate-y-[2px] active:scale-100'
              : 'bg-[rgba(16,20,24,0.08)] text-[rgba(16,20,24,0.35)]'
          }`}
        >
          {sending ? (
            <LoaderCircle size={18} className="animate-spin" />
          ) : (
            <ArrowUp size={18} strokeWidth={2} />
          )}
        </button>
      </div>
    </div>
  );
}
