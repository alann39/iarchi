'use client';

import {useState} from 'react';

export interface SuggestedQuestionsProps {
  /** Questions to offer. Empty array renders nothing. */
  questions: string[];
  /** Called with the tapped question; the parent sends it as a user message. */
  onSelect: (question: string) => void;
}

export function SuggestedQuestions({questions, onSelect}: SuggestedQuestionsProps) {
  const [dismissed, setDismissed] = useState(false);

  if (dismissed || questions.length === 0) return null;

  const handleSelect = (question: string) => {
    setDismissed(true);
    onSelect(question);
  };

  return (
    <div className="flex flex-wrap gap-2.5" role="group" aria-label="Suggested questions">
      {questions.map((q) => (
        <button
          key={q}
          type="button"
          onClick={() => handleSelect(q)}
          className="rounded-full border border-[rgba(16,20,24,0.12)] bg-white px-4 py-2 font-['IBM_Plex_Mono',monospace] text-[13px] text-[#101418] transition-all duration-150 hover:border-[rgba(16,20,24,0.35)] active:translate-x-[2px] active:translate-y-[2px] active:border-[#101418] active:shadow-[3px_3px_0_#101418]"
        >
          {q}
        </button>
      ))}
    </div>
  );
}
