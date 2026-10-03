'use client';

import {Fragment, useEffect, useRef, useState} from 'react';
import type {ReactNode} from 'react';
import {Check, Copy, RotateCcw} from 'lucide-react';

import {ToolRenderer} from './ToolRenderer';
import type {ChatMessage} from './types';

export interface MessageBubbleProps {
  message: ChatMessage;
  /** Avatar initial for AI bubbles. Defaults to "A". */
  avatarInitial?: string;
  /** Called when the user taps Retry on an error bubble. */
  onRetry?: () => void;
}

const MONO = "font-['IBM_Plex_Mono',monospace]";

// ---------------------------------------------------------------------------
// Minimal safe markdown renderer (no extra deps).
// Supports: fenced code blocks, inline code, **bold**, *italic*,
// [links](url) (http/https/mailto only), unordered + ordered lists,
// paragraphs. React escapes all text nodes by default.
// ---------------------------------------------------------------------------

function renderInline(text: string, keyBase: string): ReactNode[] {
  const nodes: ReactNode[] = [];
  let k = 0;
  const pushText = (s: string) => {
    if (s) nodes.push(<Fragment key={`${keyBase}-t${k++}`}>{s}</Fragment>);
  };
  const re = /(`[^`\n]+`)|(\*\*[^*\n]+\*\*)|(\*[^*\n]+\*)|(\[([^\]\n]+)\]\(([^)\s]+)\))/g;
  let lastIndex = 0;
  let match: RegExpExecArray | null;
  while ((match = re.exec(text)) !== null) {
    pushText(text.slice(lastIndex, match.index));
    const key = `${keyBase}-e${k++}`;
    if (match[1]) {
      nodes.push(
        <code
          key={key}
          className={`rounded bg-[rgba(16,20,24,0.06)] px-1 ${MONO} text-[13px]`}
        >
          {match[1].slice(1, -1)}
        </code>,
      );
    } else if (match[2]) {
      nodes.push(
        <strong key={key} className="font-semibold">
          {match[2].slice(2, -2)}
        </strong>,
      );
    } else if (match[3]) {
      nodes.push(<em key={key}>{match[3].slice(1, -1)}</em>);
    } else if (match[4]) {
      const label = match[5];
      const url = match[6];
      if (/^(https?:\/\/|mailto:)/i.test(url)) {
        nodes.push(
          <a
            key={key}
            href={url}
            target="_blank"
            rel="noopener noreferrer"
            className="underline decoration-[rgba(16,20,24,0.3)] underline-offset-2 hover:decoration-[#101418]"
          >
            {label}
          </a>,
        );
      } else {
        pushText(match[4]);
      }
    }
    lastIndex = match.index + match[0].length;
  }
  pushText(text.slice(lastIndex));
  return nodes;
}

function renderMarkdown(content: string): ReactNode[] {
  const blocks: ReactNode[] = [];
  let b = 0;
  const parts = content.split(/(```[\s\S]*?```)/g);
  for (const part of parts) {
    if (part.startsWith('```')) {
      const code = part
        .replace(/^```[a-zA-Z]*\n?/, '')
        .replace(/```$/, '')
        .replace(/\n$/, '');
      blocks.push(
        <pre
          key={`b${b++}`}
          className={`overflow-x-auto rounded-[8px] bg-[#101418] p-3 ${MONO} text-[13px] leading-relaxed text-[#F4F5F6]`}
        >
          <code>{code}</code>
        </pre>,
      );
      continue;
    }
    for (const chunk of part.split(/\n{2,}/)) {
      const lines = chunk.split('\n').filter((l) => l.trim().length > 0);
      if (lines.length === 0) continue;
      const heading = lines.length === 1 ? lines[0].match(/^(#{1,3})\s+(.*)$/) : null;
      if (heading) {
        const level = heading[1].length;
        const text = heading[2];
        const cls =
          level === 1
            ? 'text-[18px] font-semibold tracking-[-0.01em]'
            : 'text-[16px] font-semibold';
        blocks.push(
          <p key={`b${b++}`} className={cls}>
            {renderInline(text, `h${b}`)}
          </p>,
        );
      } else if (lines.every((l) => /^[-*]\s+/.test(l))) {
        blocks.push(
          <ul key={`b${b++}`} className="list-disc space-y-1 pl-5">
            {lines.map((l, i) => (
              <li key={i}>{renderInline(l.replace(/^[-*]\s+/, ''), `ul${b}-${i}`)}</li>
            ))}
          </ul>,
        );
      } else if (lines.every((l) => /^\d+\.\s+/.test(l))) {
        blocks.push(
          <ol key={`b${b++}`} className="list-decimal space-y-1 pl-5">
            {lines.map((l, i) => (
              <li key={i}>{renderInline(l.replace(/^\d+\.\s+/, ''), `ol${b}-${i}`)}</li>
            ))}
          </ol>
        );
      } else {
        blocks.push(
          <p key={`b${b++}`}>
            {lines.map((l, i) => (
              <Fragment key={i}>
                {i > 0 && <br />}
                {renderInline(l, `p${b}-${i}`)}
              </Fragment>
            ))}
          </p>,
        );
      }
    }
  }
  return blocks;
}

// ---------------------------------------------------------------------------
// Blinking orange block cursor (Web Animations API — crisp hard blink).
// ---------------------------------------------------------------------------

function StreamingCursor() {
  const ref = useRef<HTMLSpanElement>(null);
  useEffect(() => {
    const el = ref.current;
    if (!el) return;
    // Reduced motion: static block, no blink (specs/05-DESIGN-SYSTEM.md §7).
    if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) return;
    const anim = el.animate(
      [
        {opacity: 1},
        {opacity: 1, offset: 0.5},
        {opacity: 0, offset: 0.51},
        {opacity: 0},
      ],
      {duration: 1000, iterations: Infinity},
    );
    return () => anim.cancel();
  }, []);
  return (
    <span
      ref={ref}
      aria-hidden="true"
      className="ml-0.5 inline-block h-[18px] w-[9px] translate-y-[3px] bg-[#FF4D00]"
    />
  );
}

// ---------------------------------------------------------------------------
// MessageBubble
// ---------------------------------------------------------------------------

export function MessageBubble({message, avatarInitial = 'A', onRetry}: MessageBubbleProps) {
  const [copied, setCopied] = useState(false);

  const handleCopy = async () => {
    try {
      await navigator.clipboard.writeText(message.content);
      setCopied(true);
      window.setTimeout(() => setCopied(false), 1500);
    } catch {
      // Clipboard unavailable — stay silent.
    }
  };

  if (message.role === 'user') {
    return (
      <div className="flex justify-end">
        <div className="max-w-[80%] rounded-[12px] bg-[#E9EBED] px-4 py-2.5 text-[15px] leading-[1.6] text-[#101418]">
          {message.content}
        </div>
      </div>
    );
  }

  const isError = message.status === 'error';
  const isStreaming = message.status === 'streaming';

  return (
    <div className="group flex gap-2.5">
      <div
        aria-hidden="true"
        className={`flex h-7 w-7 shrink-0 items-center justify-center rounded-[6px] bg-[#101418] ${MONO} text-[12px] font-semibold text-white`}
      >
        {avatarInitial}
      </div>
      <div className="min-w-0 flex-1">
        <div className="space-y-3 text-[15px] leading-[1.65] text-[rgba(16,20,24,0.88)]">
          {isStreaming ? (
            <p>
              {message.content}
              <StreamingCursor />
            </p>
          ) : (
            renderMarkdown(message.content)
          )}
          {message.tools?.map((tool, i) => (
            <ToolRenderer key={`${message.id}-tool-${i}`} tool={tool} />
          ))}
        </div>
        <div className="mt-1.5 flex items-center gap-1 opacity-0 transition-opacity duration-150 group-hover:opacity-100">
          {message.status === 'complete' && (
            <button
              type="button"
              onClick={handleCopy}
              aria-label={copied ? 'Copied' : 'Copy message'}
              className="rounded p-1.5 text-[rgba(16,20,24,0.45)] transition-colors hover:bg-[rgba(16,20,24,0.06)] hover:text-[#101418]"
            >
              {copied ? <Check size={14} /> : <Copy size={14} />}
            </button>
          )}
          {isError && onRetry && (
            <button
              type="button"
              onClick={onRetry}
              className="flex items-center gap-1.5 rounded-full border-[1.5px] border-[#101418] bg-white px-3.5 py-1.5 font-['IBM_Plex_Mono',monospace] text-[12px] text-[#101418] shadow-[3px_3px_0_#101418] transition-all duration-100 active:translate-x-[2px] active:translate-y-[2px] active:shadow-[1px_1px_0_#101418]"
            >
              <RotateCcw size={13} />
              Retry
            </button>
          )}
        </div>
      </div>
    </div>
  );
}
