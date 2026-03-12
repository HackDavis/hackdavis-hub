'use client';

import { useState } from 'react';

export default function HackbotInputForm({
  input,
  setInput,
  canSend,
  loading,
  error,
  maxChars,
  onSubmit,
  onSend,
  onDismissError,
  suggestionChips,
  onChipSend,
}: {
  input: string;
  setInput: (val: string) => void;
  canSend: boolean;
  loading: boolean;
  error: string | null;
  maxChars: number;
  onSubmit: (e: React.FormEvent) => void;
  onSend: () => void;
  onDismissError: () => void;
  suggestionChips: string[];
  onChipSend: (text: string) => void;
}) {
  const [showSuggestions, setShowSuggestions] = useState(false);

  return (
    <form
      onSubmit={onSubmit}
      className="border-t border-[#9EE7E5]/60 px-3 py-2.5 space-y-2 shrink-0 bg-white"
    >
      {/* Suggestion chips accordion — one per line */}
      {showSuggestions && (
        <div className="flex flex-col gap-1.5 pb-0.5">
          {suggestionChips.map((q) => (
            <button
              key={q}
              type="button"
              onClick={() => {
                onChipSend(q);
                setShowSuggestions(false);
              }}
              className="w-full text-left text-xs px-3 py-1.5 rounded-xl border border-[#9EE7E5] bg-[#FAFAFF] text-[#005271] hover:bg-[#CCFFFE] transition-colors font-medium"
            >
              {q}
            </button>
          ))}
        </div>
      )}

      <div className="flex items-center gap-2">
        <textarea
          value={input}
          onChange={(e) => setInput(e.target.value)}
          onKeyDown={(e) => {
            if (e.key === 'Enter' && !e.shiftKey) {
              e.preventDefault();
              void onSend();
            }
          }}
          rows={1}
          maxLength={maxChars}
          className="flex-1 resize-none rounded-xl border border-[#9EE7E5] bg-[#FAFAFF] px-3 py-2.5 text-sm text-[#003D3D] placeholder-[#005271]/40 outline-none focus:ring-2 focus:ring-[#005271]/30 focus:border-[#005271] transition-colors"
          placeholder="Ask about HackDavis…"
        />

        {/* Suggestions toggle */}
        <button
          type="button"
          onClick={() => setShowSuggestions((prev) => !prev)}
          className="shrink-0 h-9 w-9 rounded-xl flex items-center justify-center transition-colors border border-[#9EE7E5] hover:bg-[#CCFFFE]"
          style={{ backgroundColor: showSuggestions ? '#CCFFFE' : '#FAFAFF' }}
          aria-label="Toggle suggested questions"
          title="Suggested questions"
        >
          <svg
            viewBox="0 0 16 16"
            fill="none"
            stroke="currentColor"
            strokeWidth="1.8"
            strokeLinecap="round"
            strokeLinejoin="round"
            className="w-3.5 h-3.5"
            style={{
              color: '#005271',
              transform: showSuggestions ? 'rotate(180deg)' : 'rotate(0deg)',
              transition: 'transform 0.2s',
            }}
          >
            <path d="M3 6l5 5 5-5" />
          </svg>
        </button>

        {/* Send button */}
        <button
          type="submit"
          disabled={!canSend}
          className="shrink-0 h-9 w-9 rounded-xl flex items-center justify-center transition-colors disabled:opacity-40 disabled:cursor-not-allowed"
          style={{
            backgroundColor: canSend ? '#005271' : '#9EE7E5',
            color: '#fff',
          }}
        >
          {loading ? (
            <span className="w-3 h-3 border-2 border-white border-t-transparent rounded-full animate-spin" />
          ) : (
            <svg viewBox="0 0 16 16" fill="currentColor" className="w-4 h-4">
              <path d="M1.5 1.5l13 6.5-13 6.5V9.5l9-3-9-3V1.5z" />
            </svg>
          )}
        </button>
      </div>

      <p className="text-[10px] text-[#005271]/40 text-right">
        {input.length}/{maxChars}
      </p>

      {error && (
        <div className="text-xs bg-red-50 border border-red-200 rounded-lg px-2.5 py-1.5">
          <p className="text-red-600">{error}</p>
          <button
            type="button"
            onClick={onDismissError}
            className="text-red-400 underline text-[10px] mt-0.5"
          >
            Dismiss
          </button>
        </div>
      )}
    </form>
  );
}
