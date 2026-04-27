'use client';

import { useState } from 'react';
import { PiStarFourFill } from 'react-icons/pi';

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
  hasMessages,
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
  hasMessages: boolean;
}) {
  const [showSuggestions, setShowSuggestions] = useState(false);

  return (
    <div className="relative">
      {/* Suggestions popup — overlays above, does not push layout */}
      {showSuggestions && hasMessages && (
        <div className="absolute bottom-full mb-2 left-0 right-0 bg-white rounded-3xl border border-gray-100 shadow-xl p-3 space-y-2 z-20">
          {suggestionChips.map((q) => (
            <button
              key={q}
              type="button"
              onClick={() => {
                onChipSend(q);
                setShowSuggestions(false);
              }}
              className="block w-full text-left text-xs px-3.5 py-2.5 rounded-xl border border-[#9EE7E5]/60 text-[#003D3D] hover:brightness-95 transition-all"
              style={{ backgroundColor: '#D5FDFF99' }}
            >
              {q}
            </button>
          ))}
        </div>
      )}

      <form
        onSubmit={onSubmit}
        className="rounded-none sm:rounded-3xl border border-gray-100 px-3 py-3 bg-white shadow-lg shadow-black/5"
      >
        <div className="flex items-center gap-2">
          <input
            value={input}
            onChange={(e) => setInput(e.target.value)}
            onKeyDown={(e) => {
              if (e.key === 'Enter' && !e.shiftKey) {
                e.preventDefault();
                void onSend();
              }
            }}
            maxLength={maxChars}
            className="flex-1 bg-transparent px-1 py-2 text-sm text-[#003D3D] placeholder-gray-400 outline-none"
            placeholder="Type a message..."
          />

          {/* Sparkle / suggestions toggle — hidden on empty state */}
          {hasMessages && (
            <button
              type="button"
              onClick={() => setShowSuggestions((prev) => !prev)}
              className="shrink-0 h-9 w-9 rounded-full flex items-center justify-center transition-colors hover:bg-gray-100"
              style={{ color: showSuggestions ? '#005271' : '#005271AA' }}
              aria-label="Toggle suggested questions"
            >
              <PiStarFourFill className="w-4 h-4" />
            </button>
          )}

          {/* Send button */}
          <button
            type="submit"
            disabled={!canSend}
            className="shrink-0 h-9 w-9 rounded-full flex items-center justify-center transition-colors disabled:opacity-30 disabled:cursor-not-allowed"
            style={{
              backgroundColor: canSend ? '#D5FDFF' : '#EBEBF0',
              color: '#005271',
            }}
          >
            {loading ? (
              <span className="w-3.5 h-3.5 border-2 border-[#005271] border-t-transparent rounded-full animate-spin" />
            ) : (
              <svg
                viewBox="0 0 16 16"
                fill="currentColor"
                className="w-3.5 h-3.5"
              >
                <path d="M1.5 1.5l13 6.5-13 6.5V9.5l9-3-9-3V1.5z" />
              </svg>
            )}
          </button>
        </div>

        {input.length > maxChars * 0.8 && (
          <p className="text-[10px] text-gray-400 text-right mt-1">
            {input.length}/{maxChars}
          </p>
        )}

        {error && (
          <div className="text-xs bg-red-50 border border-red-100 rounded-xl px-3 py-2 mt-2">
            <p className="text-red-500">{error}</p>
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
    </div>
  );
}
