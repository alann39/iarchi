'use client';

import {useCallback, useEffect, useRef, useState} from 'react';
import {createPortal} from 'react-dom';

export interface StackModalProps {
  label: string;
  count: string;
  onClose: () => void;
  children: React.ReactNode;
}

const EXIT_MS = 200;

/**
 * Blurred-backdrop dialog for an expanded fan stack (TASK-17).
 * Mounted via portal; enter/exit transitions on opacity + translateY.
 * Esc / backdrop click / × closes. Focus moves to × on open; body scroll
 * locks while open. Instant under prefers-reduced-motion (global rule).
 */
export function StackModal({label, count, onClose, children}: StackModalProps) {
  const [mounted, setMounted] = useState(false);
  const [visible, setVisible] = useState(false);
  const closeRef = useRef<HTMLButtonElement>(null);
  const closing = useRef(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  // Enter transition on mount.
  useEffect(() => {
    if (!mounted) return;
    const raf = requestAnimationFrame(() =>
      requestAnimationFrame(() => setVisible(true)),
    );
    return () => cancelAnimationFrame(raf);
  }, [mounted]);

  const close = useCallback(() => {
    if (closing.current) return;
    closing.current = true;
    setVisible(false);
    window.setTimeout(onClose, EXIT_MS);
  }, [onClose]);

  // Esc, scroll lock, initial focus.
  useEffect(() => {
    if (!mounted) return;
    const onKey = (e: KeyboardEvent) => {
      if (e.key === 'Escape') close();
    };
    document.addEventListener('keydown', onKey);
    const prevOverflow = document.body.style.overflow;
    document.body.style.overflow = 'hidden';
    closeRef.current?.focus();
    return () => {
      document.removeEventListener('keydown', onKey);
      document.body.style.overflow = prevOverflow;
    };
  }, [mounted, close]);

  if (!mounted) return null;

  return createPortal(
    <div
      className={`fan-mback${visible ? ' fan-mback--show' : ''}`}
      onClick={(e) => {
        if (e.target === e.currentTarget) close();
      }}
    >
      <div className="fan-modal" role="dialog" aria-modal="true" aria-label={`${label} details`}>
        <div className="fan-mhead">
          <span className="fan-mtitle">
            {label} <span className="accent">■</span> {count}
          </span>
          <button
            ref={closeRef}
            type="button"
            className="fan-mx"
            onClick={close}
            aria-label={`Close ${label} dialog`}
          >
            ×
          </button>
        </div>
        <div className="fan-mbody">{children}</div>
      </div>
    </div>,
    document.body,
  );
}
