'use client';

import {useEffect, useRef, useState} from 'react';
import {Pause, Play} from 'lucide-react';

import {releaseAudio, requestPlay} from '../previewAudio';

export interface MiniPlayerProps {
  /** iTunes 30s preview URL. Without it the button renders decorative. */
  src?: string;
  title: string;
}

/**
 * Compact preview player for the music fan face (TASK-17).
 * Joins the shared one-at-a-time audio group (previewAudio.ts).
 * Clicks stopPropagation so the fan card doesn't open the modal.
 */
export function MiniPlayer({src, title}: MiniPlayerProps) {
  const audioRef = useRef<HTMLAudioElement>(null);
  const [playing, setPlaying] = useState(false);
  const [progress, setProgress] = useState(0);

  useEffect(() => {
    const audio = audioRef.current;
    if (!audio) return;
    const onPlay = () => setPlaying(true);
    const onPause = () => setPlaying(false);
    const onTime = () => {
      setProgress(audio.duration > 0 ? (audio.currentTime / audio.duration) * 100 : 0);
    };
    const onEnd = () => {
      setProgress(0);
      releaseAudio(audio);
    };
    audio.addEventListener('play', onPlay);
    audio.addEventListener('pause', onPause);
    audio.addEventListener('timeupdate', onTime);
    audio.addEventListener('ended', onEnd);
    return () => {
      audio.removeEventListener('play', onPlay);
      audio.removeEventListener('pause', onPause);
      audio.removeEventListener('timeupdate', onTime);
      audio.removeEventListener('ended', onEnd);
      releaseAudio(audio);
    };
  }, []);

  const toggle = (e: React.MouseEvent) => {
    e.stopPropagation();
    const audio = audioRef.current;
    if (!audio) return;
    if (audio.paused) requestPlay(audio);
    else audio.pause();
  };

  return (
    <>
      {src && (
        <audio ref={audioRef} src={src} preload="none" aria-label={`Preview of ${title}`} />
      )}
      <button
        type="button"
        onClick={toggle}
        disabled={!src}
        aria-label={playing ? `Pause ${title}` : `Play ${title} preview`}
        className="fan-playbtn"
      >
        {playing ? <Pause size={13} /> : <Play size={13} className="translate-x-[1px]" />}
      </button>
      <div className="fan-pbar" aria-hidden="true">
        <i style={{width: `${progress}%`}} />
      </div>
    </>
  );
}
