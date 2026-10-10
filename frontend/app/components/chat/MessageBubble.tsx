'use client';

import {useEffect, useRef, useState} from 'react';
import {Check, Copy, RotateCcw} from 'lucide-react';

import {StoryFan} from './fan/StoryFan';
import {renderMarkdown} from './markdown';
import {ToolRenderer} from './ToolRenderer';
import {AgentProgress} from '../ui/agent-progress';
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

  // TASK-17: story answers render ordered blocks (narrative text interleaved
  // with compact fan stacks) instead of content-then-tools. Errors fall back
  // to the plain content path so the friendly message + Retry still show.
  const storyBlocks = message.story && !isError ? message.blocks : undefined;

  // Loading state: streaming but nothing to show yet (LLM still thinking).
  const hasVisibleContent =
    message.content.trim().length > 0 ||
    (message.tools?.length ?? 0) > 0 ||
    (storyBlocks?.length ?? 0) > 0;
  const showProgress = isStreaming && !hasVisibleContent;

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
          {showProgress ? (
            <AgentProgress />
          ) : storyBlocks && storyBlocks.length > 0 ? (
            <>
              {storyBlocks.map((block, i) =>
                block.kind === 'text' ? (
                  <div key={i}>{renderMarkdown(block.text)}</div>
                ) : block.tool.presentation === 'compact' ? (
                  <StoryFan key={i} tool={block.tool} />
                ) : (
                  <ToolRenderer key={`${message.id}-tool-${i}`} tool={block.tool} />
                ),
              )}
              {isStreaming && <StreamingCursor />}
            </>
          ) : (
            <>
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
            </>
          )}
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
