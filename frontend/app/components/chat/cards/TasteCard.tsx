'use client';

import {useEffect, useRef, useState} from 'react';
import {ArrowUpRight, Pause, Play} from 'lucide-react';

import type {PickData} from '@/lib/portfolio';

export interface TasteCardProps {
  pick: PickData;
}

const MONO = "font-['IBM_Plex_Mono',monospace]";
const DISPLAY = "font-['Space_Grotesk',sans-serif]";

/** Module-level: only one preview plays at a time across all cards. */
let activeAudio: HTMLAudioElement | null = null;

function formatTime(sec: number): string {
  if (!Number.isFinite(sec) || sec < 0) return '0:00';
  const m = Math.floor(sec / 60);
  const s = Math.floor(sec % 60);
  return `${m}:${String(s).padStart(2, '0')}`;
}

/**
 * Minimal 30s preview player — Machine Room: square ink button with 100ms
 * press, 2px progress rule, mono time readout. No rounded pill chrome.
 */
function PreviewPlayer({src, title}: {src: string; title: string}) {
  const audioRef = useRef<HTMLAudioElement>(null);
  const barRef = useRef<HTMLDivElement>(null);
  const [playing, setPlaying] = useState(false);
  const [current, setCurrent] = useState(0);
  const [duration, setDuration] = useState(0);

  useEffect(() => {
    const audio = audioRef.current;
    if (!audio) return;
    const onPlay = () => setPlaying(true);
    const onPause = () => setPlaying(false);
    const onTime = () => setCurrent(audio.currentTime);
    const onMeta = () => setDuration(audio.duration || 0);
    const onEnd = () => {
      setCurrent(0);
      if (activeAudio === audio) activeAudio = null;
    };
    audio.addEventListener('play', onPlay);
    audio.addEventListener('pause', onPause);
    audio.addEventListener('timeupdate', onTime);
    audio.addEventListener('loadedmetadata', onMeta);
    audio.addEventListener('ended', onEnd);
    return () => {
      audio.removeEventListener('play', onPlay);
      audio.removeEventListener('pause', onPause);
      audio.removeEventListener('timeupdate', onTime);
      audio.removeEventListener('loadedmetadata', onMeta);
      audio.removeEventListener('ended', onEnd);
      if (activeAudio === audio) activeAudio = null;
    };
  }, []);

  const toggle = () => {
    const audio = audioRef.current;
    if (!audio) return;
    if (audio.paused) {
      if (activeAudio && activeAudio !== audio) activeAudio.pause();
      activeAudio = audio;
      void audio.play().catch(() => {
        if (activeAudio === audio) activeAudio = null;
      });
    } else {
      audio.pause();
    }
  };

  const seek = (e: React.MouseEvent) => {
    const audio = audioRef.current;
    const bar = barRef.current;
    if (!audio || !bar || !duration) return;
    const rect = bar.getBoundingClientRect();
    const ratio = Math.min(1, Math.max(0, (e.clientX - rect.left) / rect.width));
    audio.currentTime = ratio * duration;
  };

  const progress = duration > 0 ? (current / duration) * 100 : 0;

  return (
    <div className="mt-3 flex items-center gap-3">
      <audio ref={audioRef} src={src} preload="metadata" aria-label={`Preview of ${title}`} />
      <button
        type="button"
        onClick={toggle}
        aria-label={playing ? `Pause ${title}` : `Play ${title} preview`}
        className="flex h-9 w-9 shrink-0 items-center justify-center bg-[#101418] text-white transition-transform duration-100 active:scale-95"
      >
        {playing ? <Pause size={15} /> : <Play size={15} className="translate-x-[1px]" />}
      </button>
      <div
        ref={barRef}
        role="slider"
        aria-label="Seek"
        aria-valuemin={0}
        aria-valuemax={Math.round(duration)}
        aria-valuenow={Math.round(current)}
        tabIndex={0}
        onClick={seek}
        onKeyDown={(e) => {
          if (e.key === 'ArrowRight' || e.key === 'ArrowLeft') {
            const audio = audioRef.current;
            if (audio && duration) {
              audio.currentTime = Math.min(
                duration,
                Math.max(0, audio.currentTime + (e.key === 'ArrowRight' ? 5 : -5)),
              );
            }
          }
        }}
        className="relative h-6 flex-1 cursor-pointer"
      >
        <div className="absolute inset-x-0 top-1/2 h-[2px] -translate-y-1/2 bg-[rgba(16,20,24,0.12)]" />
        <div
          className="absolute left-0 top-1/2 h-[2px] -translate-y-1/2 bg-[#101418]"
          style={{width: `${progress}%`}}
        />
        <div
          className="absolute top-1/2 h-2 w-2 -translate-x-1/2 -translate-y-1/2 bg-[#FF4D00]"
          style={{left: `${progress}%`}}
        />
      </div>
      <span className={`${MONO} shrink-0 text-[11px] tabular-nums text-[#6E7680]`}>
        {formatTime(current)} / {formatTime(duration)}
      </span>
    </div>
  );
}

/**
 * Personal taste card — specs/06-UI-SPEC.md §8 (P2 personal blocks).
 * Music: artwork + playable 30s preview. Movies: ▸ marker, no player.
 * Flat ledger-row style like ProjectCard.
 */
export function TasteCard({pick}: TasteCardProps) {
  const isMusic = pick.category === 'music';

  return (
    <article className="border-t border-[rgba(16,20,24,0.12)] py-[18px]">
      <div className="flex items-start gap-3.5">
        {isMusic && pick.artworkUrl ? (
          // eslint-disable-next-line @next/next/no-img-element
          <img
            src={pick.artworkUrl}
            alt={`${pick.title} artwork`}
            width={56}
            height={56}
            className="h-14 w-14 shrink-0 object-cover"
            loading="lazy"
          />
        ) : (
          <span
            aria-hidden="true"
            className={`flex h-14 w-14 shrink-0 items-center justify-center ${
              isMusic ? 'bg-[#FF4D00]' : 'bg-[#101418]'
            } font-['IBM_Plex_Mono',monospace] text-[20px] text-white`}
          >
            {isMusic ? '♪' : '▸'}
          </span>
        )}
        <div className="min-w-0 flex-1">
          <h4 className={`${DISPLAY} text-[17px] font-semibold tracking-[-0.01em] text-[#101418]`}>
            {pick.title}
          </h4>
          <p className={`${MONO} mt-1 text-[11px] uppercase tracking-[0.08em] text-[#6E7680]`}>
            {pick.creator}
            {pick.year ? ` — ${pick.year}` : ''}
          </p>
        </div>
      </div>

      {isMusic && pick.previewUrl && <PreviewPlayer src={pick.previewUrl} title={pick.title} />}

      {pick.note && (
        <p className="mt-3 text-[14px] leading-[1.55] text-[#6E7680]">{pick.note}</p>
      )}

      {pick.spotifyUrl && (
        <div className={`${MONO} mt-2.5 text-[13px]`}>
          <a
            href={pick.spotifyUrl}
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex items-center gap-1 text-[#FF4D00] hover:underline"
          >
            Open in Spotify
            <ArrowUpRight size={13} />
          </a>
        </div>
      )}
    </article>
  );
}
