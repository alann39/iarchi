'use client';

import {useState, type ReactNode} from 'react';

import {StackModal} from './StackModal';

export interface FanStackProps<T> {
  label: string;
  items: T[];
  /** Faces shown in the collapsed fan; the rest hide behind the +N badge. */
  maxVisible?: number;
  renderFace: (item: T, index: number) => ReactNode;
  renderFull: (item: T, index: number) => ReactNode;
}

/**
 * Collapsed fan deck → modal dialog (TASK-17).
 * The fan is the cover: fanned faces with per-type identity, hover spreads
 * the deck (CSS), a single card straightens + lifts on hover. OPEN (or card
 * click / Enter) opens the blurred-backdrop modal with the full cards.
 */
export function FanStack<T>({
  label,
  items,
  maxVisible = 3,
  renderFace,
  renderFull,
}: FanStackProps<T>) {
  const [open, setOpen] = useState(false);
  if (items.length === 0) return null;

  const visible = items.slice(0, maxVisible);
  const hidden = items.length - visible.length;
  const count = String(items.length).padStart(2, '0');
  const openModal = () => setOpen(true);

  return (
    <div className="fanstack">
      <div className="fan-head">
        <span className="fan-label">{label}</span>
        <span className="fan-count">■ {count}</span>
        <button type="button" className="fan-toggle" onClick={openModal} aria-haspopup="dialog">
          Open <span className="fan-toggle-arrow">▸</span>
        </button>
      </div>
      <div className="fan" role="list" aria-label={`${label} preview`}>
        {visible.map((item, i) => (
          <div
            key={i}
            role="listitem"
            tabIndex={0}
            className="fan-card"
            onClick={openModal}
            onKeyDown={(e) => {
              if (e.key === 'Enter' || e.key === ' ') {
                e.preventDefault();
                openModal();
              }
            }}
            aria-label={`Open ${label} details`}
          >
            {renderFace(item, i)}
            {i === visible.length - 1 && hidden > 0 && (
              <span className="fan-plusn" aria-hidden="true">
                +{hidden}
              </span>
            )}
          </div>
        ))}
      </div>
      {open && (
        <StackModal label={label} count={count} onClose={() => setOpen(false)}>
          {items.map((item, i) => (
            <div key={i} className="fan-fullcard">
              {renderFull(item, i)}
            </div>
          ))}
        </StackModal>
      )}
    </div>
  );
}
