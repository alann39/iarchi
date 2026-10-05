'use client';

import type {SlashCommand} from './slashCommands';

export interface SlashMenuProps {
  /** Filtered registry entries to show. Empty → renders nothing. */
  commands: SlashCommand[];
  /** Index of the highlighted row (keyboard / hover). */
  activeIndex: number;
  /** Run the command (click, Tab, Enter). */
  onSelect: (cmd: SlashCommand) => void;
  /** Highlight a row on hover. */
  onHover: (index: number) => void;
}

const MONO = "font-['IBM_Plex_Mono',monospace]";

/**
 * Floating autocomplete above the composer — P3 (specs/04-TASKS.md TASK-16).
 * Machine Room styling: paper menu, 1px ink border, mono `/command` left +
 * small description right. Active row = ink bg / paper text (color change
 * only — no glow, no shadow). Action rows carry an orange ▸ marker.
 * Opens instantly (no animation); the parent owns all keyboard behavior.
 */
export function SlashMenu({commands, activeIndex, onSelect, onHover}: SlashMenuProps) {
  if (commands.length === 0) return null;
  return (
    <div
      role="listbox"
      aria-label="Slash commands"
      className="absolute bottom-full left-0 right-0 z-50 mb-2 border border-[#101418] bg-[#F4F5F6]"
    >
      {commands.map((cmd, i) => {
        const active = i === activeIndex;
        return (
          <button
            key={cmd.name}
            type="button"
            role="option"
            aria-selected={active}
            // mousedown (not click): the textarea would blur first on click.
            onMouseDown={(e) => {
              e.preventDefault();
              onSelect(cmd);
            }}
            onMouseEnter={() => onHover(i)}
            className={`flex w-full items-baseline justify-between gap-3 px-3.5 py-2.5 text-left ${MONO} text-[13px] ${
              active ? 'bg-[#101418] text-[#F4F5F6]' : 'text-[#101418]'
            }`}
          >
            <span className="shrink-0 font-semibold">
              {cmd.class === 'action' && (
                <span aria-hidden="true" className="mr-1.5 text-[#FF4D00]">
                  ▸
                </span>
              )}
              /{cmd.name}
            </span>
            <span
              className={`truncate font-['DM_Sans',sans-serif] text-[11px] ${
                active ? 'text-[rgba(244,245,246,0.65)]' : 'text-[rgba(16,20,24,0.55)]'
              }`}
            >
              {cmd.description}
            </span>
          </button>
        );
      })}
      <div className={`border-t border-[#101418] px-3.5 py-1.5 ${MONO} text-[10px] text-[rgba(16,20,24,0.45)]`}>
        ↑↓ navigate · Tab/Enter run · Esc dismiss
      </div>
    </div>
  );
}
