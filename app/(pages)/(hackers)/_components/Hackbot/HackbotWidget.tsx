'use client';

import { useState } from 'react';
import { Button } from '@pages/_globals/components/ui/button';

export type HackbotChatMessage = {
  role: 'user' | 'assistant';
  content: string;
  url?: string;
};

const MAX_USER_MESSAGE_CHARS = 200;

export default function HackbotWidget() {
  const [open, setOpen] = useState(false);
  const [messages, setMessages] = useState<HackbotChatMessage[]>([]);
  const [input, setInput] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const canSend =
    !loading &&
    input.trim().length > 0 &&
    input.trim().length <= MAX_USER_MESSAGE_CHARS;

  const toggleOpen = () => {
    setOpen((prev) => !prev);
    setError(null);
  };

  const sendMessage = async () => {
    if (!canSend) return;

    const userMessage: HackbotChatMessage = {
      role: 'user',
      content: input.trim(),
    };

    setMessages((prev) => [...prev, userMessage]);
    setInput('');
    setError(null);
    setLoading(true);

    try {
      const response = await fetch('/api/hackbot', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          messages: [
            ...messages.map((m) => ({ role: m.role, content: m.content })),
            { role: 'user', content: userMessage.content },
          ],
        }),
      });

      const data = await response.json();

      if (!data.ok) {
        setError(data.error || 'Something went wrong.');
      }

      const assistantMessage: HackbotChatMessage = {
        role: 'assistant',
        content: data.answer || 'Sorry, I could not answer that.',
        url: data.url || undefined,
      };

      setMessages((prev) => [...prev, assistantMessage]);
    } catch (err) {
      setError('Network error. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    await sendMessage();
  };

  return (
    <div className="fixed bottom-4 right-4 z-50 flex flex-col items-end space-y-2">
      {open && (
        <div className="mb-2 w-80 max-h-[420px] rounded-xl border border-slate-700 bg-slate-950/95 text-slate-50 shadow-xl shadow-slate-900/60 backdrop-blur">
          <header className="flex items-center justify-between px-3 py-2 border-b border-slate-700 bg-slate-900/80 rounded-t-xl">
            <div>
              <p className="text-sm font-semibold">HackDavis Helper</p>
              <p className="text-[11px] text-slate-300">
                Ask short questions about HackDavis events, schedule, tracks,
                judging, or submissions.
              </p>
            </div>
            <button
              type="button"
              onClick={toggleOpen}
              className="h-6 w-6 rounded-full border border-slate-600 text-xs text-slate-200 flex items-center justify-center hover:bg-slate-700"
            >
              ✕
            </button>
          </header>

          <section className="px-3 py-2 h-64 overflow-y-auto text-xs space-y-2">
            {messages.length === 0 && (
              <p className="text-slate-400">
                Try asking: "When does hacking end?" or "Where is the opening
                ceremony?"
              </p>
            )}

            {messages.map((m, idx) => (
              <div
                key={idx}
                className={`flex ${
                  m.role === 'user' ? 'justify-end' : 'justify-start'
                }`}
              >
                <div
                  className={`max-w-[80%] rounded-lg px-3 py-2 whitespace-pre-wrap ${
                    m.role === 'user'
                      ? 'bg-blue-600 text-white'
                      : 'bg-slate-800 text-slate-50'
                  }`}
                >
                  <p>{m.content}</p>
                  {m.url && (
                    <a
                      href={m.url}
                      className="mt-1 inline-block text-[10px] underline text-sky-300"
                    >
                      More info
                    </a>
                  )}
                </div>
              </div>
            ))}
          </section>

          <form
            onSubmit={handleSubmit}
            className="border-t border-slate-700 px-3 py-2 space-y-1"
          >
            <textarea
              value={input}
              onChange={(e) => setInput(e.target.value)}
              onKeyDown={(e) => {
                if (e.key === 'Enter' && !e.shiftKey) {
                  e.preventDefault();
                  void sendMessage();
                }
              }}
              rows={2}
              maxLength={MAX_USER_MESSAGE_CHARS}
              className="w-full resize-none rounded-md border border-slate-700 bg-slate-900 px-2 py-1 text-xs outline-none focus:ring-1 focus:ring-blue-500"
              placeholder="Ask a short question about HackDavis..."
            />
            <div className="flex items-center justify-between">
              <p className="text-[10px] text-slate-400">
                {input.length}/{MAX_USER_MESSAGE_CHARS}
              </p>
              <Button
                type="submit"
                disabled={!canSend}
                className="h-7 px-3 text-[11px]"
              >
                {loading ? 'Thinking...' : 'Send'}
              </Button>
            </div>
            {error && <p className="text-[10px] text-red-400 mt-1">{error}</p>}
          </form>
        </div>
      )}

      <button
        type="button"
        onClick={toggleOpen}
        className="h-12 w-12 rounded-full bg-blue-600 text-white shadow-lg shadow-blue-900/50 flex items-center justify-center text-xs font-semibold hover:bg-blue-500 focus:outline-none focus:ring-2 focus:ring-blue-400"
        aria-label="Open HackDavis Helper chat"
      >
        HD
      </button>
    </div>
  );
}
