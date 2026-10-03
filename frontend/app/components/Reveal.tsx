'use client';

import {useEffect, useRef, useState} from 'react';
import type {CSSProperties, ReactNode} from 'react';

export interface RevealProps {
  children: ReactNode;
  /** Stagger delay in ms — specs/05-DESIGN-SYSTEM.md §7 uses 60ms steps. */
  delay?: number;
  className?: string;
}

/**
 * Staggered blur reveal — specs/05-DESIGN-SYSTEM.md §7.
 * opacity 0→1, translateY(24px→0), blur(6px→0), 300ms ease-lux.
 * Fires ONCE via IntersectionObserver; never re-triggers on scroll.
 * `prefers-reduced-motion` is handled in globals.css (instant, no motion).
 */
export function Reveal({children, delay = 0, className = ''}: RevealProps) {
  const ref = useRef<HTMLDivElement>(null);
  const [visible, setVisible] = useState(false);

  useEffect(() => {
    const el = ref.current;
    if (!el) return;
    if (typeof IntersectionObserver === 'undefined') {
      setVisible(true);
      return;
    }
    const io = new IntersectionObserver(
      (entries) => {
        if (entries[0]?.isIntersecting) {
          setVisible(true);
          io.disconnect();
        }
      },
      {threshold: 0.08},
    );
    io.observe(el);
    return () => io.disconnect();
  }, []);

  return (
    <div
      ref={ref}
      className={`reveal${visible ? ' is-visible' : ''}${className ? ` ${className}` : ''}`}
      style={{'--reveal-delay': `${delay}ms`} as CSSProperties}
    >
      {children}
    </div>
  );
}
