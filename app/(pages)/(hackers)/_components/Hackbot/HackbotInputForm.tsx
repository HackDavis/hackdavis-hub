'use client';

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
}) {
  return (
    <form
      onSubmit={onSubmit}
      className="border-t border-[#9EE7E5]/60 px-3 py-2.5 space-y-2 shrink-0 bg-white"
    >
      <div className="flex items-end gap-2">
        <textarea
          value={input}
          onChange={(e) => setInput(e.target.value)}
          onKeyDown={(e) => {
            if (e.key === 'Enter' && !e.shiftKey) {
              e.preventDefault();
              void onSend();
            }
          }}
          rows={2}
          maxLength={maxChars}
          className="flex-1 resize-none rounded-xl border border-[#9EE7E5] bg-[#FAFAFF] px-3 py-2 text-xs text-[#003D3D] placeholder-[#005271]/40 outline-none focus:ring-2 focus:ring-[#005271]/30 focus:border-[#005271] transition-colors"
          placeholder="Ask about HackDavis…"
        />
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
            <svg
              viewBox="0 0 16 16"
              fill="currentColor"
              className="w-4 h-4"
            >
              <path d="M1.5 1.5l13 6.5-13 6.5V9.5l9-3-9-3V1.5z" />
            </svg>
          )}
        </button>
      </div>
      <p className="text-[9px] text-[#005271]/40 text-right">
        {input.length}/{maxChars}
      </p>

      {error && (
        <div className="text-[10px] bg-red-50 border border-red-200 rounded-lg px-2.5 py-1.5">
          <p className="text-red-600">{error}</p>
          <button
            type="button"
            onClick={onDismissError}
            className="text-red-400 underline text-[9px] mt-0.5"
          >
            Dismiss
          </button>
        </div>
      )}
    </form>
  );
}
