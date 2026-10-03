'use client';

import {useEffect, useRef, useState} from 'react';
import {ChevronDown} from 'lucide-react';

import {MessageBubble} from './MessageBubble';
import type {ChatMessage} from './types';

export interface MessageListProps {
  messages: ChatMessage[];
  /** Called with the failed message id when the user taps Retry. */
  onRetry?: (messageId: string) => void;
}

/** Distance (px) from the bottom that still counts as "at bottom". */
const BOTTOM_THRESHOLD_PX = 48;

export function MessageList({messages, onRetry}: MessageListProps) {
  const [showPill, setShowPill] = useState(false);
  // Whether the user was at the bottom when the last message arrived.
  const stickRef = useRef(true);

  const scrollToBottom = (smooth: boolean) => {
    window.scrollTo({
      top: document.documentElement.scrollHeight,
      behavior: smooth ? 'smooth' : 'auto',
    });
  };

  // New message arrived: follow if the user was at the bottom,
  // otherwise surface the "new messages" pill.
  useEffect(() => {
    if (stickRef.current) {
      scrollToBottom(true);
    } else {
      setShowPill(true);
    }
  }, [messages]);

  // Track whether the user scrolled away from the bottom.
  useEffect(() => {
    const onScroll = () => {
      const atBottom =
        window.innerHeight + window.scrollY >=
        document.documentElement.scrollHeight - BOTTOM_THRESHOLD_PX;
      stickRef.current = atBottom;
      if (atBottom) setShowPill(false);
    };
    window.addEventListener('scroll', onScroll, {passive: true});
    return () => window.removeEventListener('scroll', onScroll);
  }, []);

  return (
    <div className="relative">
      <div className="flex flex-col gap-6 px-5">
        {messages.map((m) => (
          <MessageBubble
            key={m.id}
            message={m}
            onRetry={onRetry ? () => onRetry(m.id) : undefined}
          />
        ))}
      </div>
      {showPill && (
        <button
          type="button"
          onClick={() => {
            stickRef.current = true;
            setShowPill(false);
            scrollToBottom(true);
          }}
          className="fixed bottom-24 left-1/2 z-30 flex -translate-x-1/2 items-center gap-1.5 rounded-full border border-[rgba(16,20,24,0.12)] bg-white px-4 py-2 font-['IBM_Plex_Mono',monospace] text-[12px] text-[#101418] shadow-[0_4px_16px_rgba(16,20,24,0.12)] transition-colors hover:border-[rgba(16,20,24,0.35)]"
        >
          <ChevronDown size={14} />
          New messages
        </button>
      )}
    </div>
  );
}
