/**
 * Shared one-at-a-time preview audio (TASK-17).
 *
 * A single module-level slot: starting one preview pauses whatever is
 * playing — across fan faces, modal cards, and normal TasteCards alike.
 * Extracted from TasteCard so the story fan's MiniPlayer joins the same
 * exclusivity group instead of forming a second one.
 */

let activeAudio: HTMLAudioElement | null = null;

/** Play `audio`, pausing any other preview first. Safe to call repeatedly. */
export function requestPlay(audio: HTMLAudioElement): void {
  if (activeAudio && activeAudio !== audio) activeAudio.pause();
  activeAudio = audio;
  void audio.play().catch(() => {
    if (activeAudio === audio) activeAudio = null;
  });
}

/** Release the slot when a player unmounts or its track ends. */
export function releaseAudio(audio: HTMLAudioElement): void {
  if (activeAudio === audio) activeAudio = null;
}
