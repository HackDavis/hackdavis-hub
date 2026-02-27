'use client';

import { useState, useEffect, useRef } from 'react';
import { usePathname } from 'next/navigation';
import { getUser } from '@actions/users/getUser';
import HackbotEventCard from './HackbotEventCard';

/** Renders a single line, converting **bold** and *italic* to JSX. */
function renderInline(line: string, key: number) {
  const parts: React.ReactNode[] = [];
  const re = /(\*\*(.+?)\*\*|\*(.+?)\*)/g;
  let last = 0;
  let match: RegExpExecArray | null;
  let i = 0;
  while ((match = re.exec(line)) !== null) {
    if (match.index > last) parts.push(line.slice(last, match.index));
    if (match[2] !== undefined) {
      parts.push(<strong key={i++}>{match[2]}</strong>);
    } else if (match[3] !== undefined) {
      parts.push(<em key={i++}>{match[3]}</em>);
    }
    last = match.index + match[0].length;
  }
  if (last < line.length) parts.push(line.slice(last));
  return <span key={key}>{parts}</span>;
}

/** Renders markdown text with **bold**, *italic*, and line breaks. */
function MarkdownText({ text }: { text: string }) {
  const lines = text.split('\n');
  return (
    <>
      {lines.map((line, i) => (
        <span key={i}>
          {renderInline(line, i)}
          {i < lines.length - 1 && <br />}
        </span>
      ))}
    </>
  );
}

export type HackbotEvent = {
  id: string;
  name: string;
  type: string | null;
  start: string | null;
  end: string | null;
  location: string | null;
  host: string | null;
  tags: string[];
  isRecommended?: boolean;
};

export type HackbotChatMessage = {
  role: 'user' | 'assistant';
  content: string;
  url?: string;
  events?: HackbotEvent[];
};

type HackerProfile = {
  name?: string;
  position?: string;
  is_beginner?: boolean;
};

const MAX_USER_MESSAGE_CHARS = 200;
const STORAGE_KEY = 'hackbot_chat_history';
const MAX_STORED_MESSAGES = 20;

const SUGGESTION_CHIPS = [
  'What workshops are today?',
  'When does hacking end?',
  'What tracks can I enter?',
];

export default function HackbotWidget({ userId }: { userId: string }) {
  const pathname = usePathname();
  const messagesEndRef = useRef<HTMLDivElement>(null);

  const [open, setOpen] = useState(false);
  const [messages, setMessages] = useState<HackbotChatMessage[]>(() => {
    if (typeof window !== 'undefined') {
      try {
        const stored = localStorage.getItem(STORAGE_KEY);
        if (stored) {
          const parsed = JSON.parse(stored);
          if (Array.isArray(parsed)) return parsed.slice(-MAX_STORED_MESSAGES);
        }
      } catch {
        // ignore
      }
    }
    return [];
  });
  const [input, setInput] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [hackerProfile, setHackerProfile] = useState<HackerProfile | null>(
    null
  );

  // Fetch hacker profile once on mount
  useEffect(() => {
    if (!userId) return;
    getUser(userId)
      .then((u) => {
        if (u) {
          setHackerProfile({
            name: u.name,
            position: u.position,
            is_beginner: u.is_beginner,
          });
        }
      })
      .catch(() => {});
  }, [userId]);

  // Persist messages to localStorage
  useEffect(() => {
    if (typeof window !== 'undefined' && messages.length > 0) {
      try {
        localStorage.setItem(
          STORAGE_KEY,
          JSON.stringify(messages.slice(-MAX_STORED_MESSAGES))
        );
      } catch {
        // ignore
      }
    }
  }, [messages]);

  // Auto-scroll to bottom on new messages
  useEffect(() => {
    if (open) {
      messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
    }
  }, [messages, open]);

  const canSend =
    !loading &&
    input.trim().length > 0 &&
    input.trim().length <= MAX_USER_MESSAGE_CHARS;

  const clearHistory = () => {
    setMessages([]);
    if (typeof window !== 'undefined') localStorage.removeItem(STORAGE_KEY);
  };

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

    setMessages((prev) => [
      ...prev,
      { role: 'assistant', content: '' } as HackbotChatMessage,
    ]);

    try {
      const response = await fetch('/api/hackbot/stream', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          messages: [
            ...messages.map((m) => ({ role: m.role, content: m.content })),
            { role: 'user', content: userMessage.content },
          ],
          currentPath: pathname + window.location.hash,
          hackerProfile: hackerProfile ?? undefined,
        }),
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.error || 'Stream failed');
      }

      const reader = response.body?.getReader();
      const decoder = new TextDecoder();
      let accumulatedText = '';

      if (reader) {
        let keepReading = true;
        while (keepReading) {
          // eslint-disable-next-line no-await-in-loop
          const { done, value } = await reader.read();
          if (done) {
            keepReading = false;
          } else {
            const chunk = decoder.decode(value, { stream: true });
            for (const line of chunk.split('\n')) {
              if (line.startsWith('0:')) {
                // Text delta
                const content = line
                  .slice(2)
                  .trim()
                  .replace(/^"([\s\S]*)"$/, '$1')
                  .replace(/\\n/g, '\n')
                  .replace(/\\"/g, '"');
                if (content) {
                  accumulatedText += content;
                  setMessages((prev) => {
                    const updated = [...prev];
                    updated[updated.length - 1] = {
                      ...updated[updated.length - 1],
                      content: accumulatedText,
                    };
                    return updated;
                  });
                }
              } else if (line.startsWith('a:')) {
                // Tool result — extract events from get_events
                try {
                  const toolResult = JSON.parse(line.slice(2).trim());
                  const results = Array.isArray(toolResult)
                    ? toolResult
                    : [toolResult];
                  for (const r of results) {
                    if (r.result?.events?.length > 0) {
                      setMessages((prev) => {
                        const updated = [...prev];
                        updated[updated.length - 1] = {
                          ...updated[updated.length - 1],
                          events: r.result.events as HackbotEvent[],
                        };
                        return updated;
                      });
                    }
                  }
                } catch {
                  // Malformed tool result — ignore
                }
              }
            }
          }
        }
      }

      setLoading(false);
    } catch (err: any) {
      console.error('[hackbot] Stream error', err);
      setError(err.message || 'Network error. Please try again.');
      setMessages((prev) => prev.slice(0, -1));
      setLoading(false);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    await sendMessage();
  };

  const firstName = hackerProfile?.name?.split(' ')[0];

  return (
    <div className="fixed bottom-4 right-4 z-50 flex flex-col items-end gap-2">
      {/* Chat panel */}
      {open && (
        <div
          className="w-80 max-h-[540px] rounded-2xl border border-[#9EE7E5] bg-[#FAFAFF] shadow-xl shadow-[#005271]/10 flex flex-col overflow-hidden"
          style={{ fontFamily: 'var(--font-plus-jakarta-sans, sans-serif)' }}
        >
          {/* Header */}
          <header
            className="flex items-center justify-between px-4 py-3 shrink-0"
            style={{ backgroundColor: '#005271' }}
          >
            <div>
              <p className="text-sm font-bold text-white">HackDavis Helper</p>
              <p className="text-[11px] text-[#9EE7E5]">
                {firstName
                  ? `Hi ${firstName}! Ask me anything about HackDavis.`
                  : 'Ask me anything about HackDavis!'}
              </p>
            </div>
            <div className="flex items-center gap-1.5">
              {messages.length > 0 && (
                <button
                  type="button"
                  onClick={clearHistory}
                  title="Clear chat history"
                  className="h-7 w-7 rounded-full flex items-center justify-center text-[11px] text-white hover:bg-white/10 transition-colors"
                >
                  🗑️
                </button>
              )}
              <button
                type="button"
                onClick={toggleOpen}
                className="h-7 w-7 rounded-full flex items-center justify-center text-white text-sm font-bold hover:bg-white/10 transition-colors"
              >
                ✕
              </button>
            </div>
          </header>

          {/* Messages */}
          <section className="flex-1 overflow-y-auto px-3 py-3 space-y-3 min-h-0 bg-[#FAFAFF]">
            {messages.length === 0 && (
              <div className="space-y-2">
                <p className="text-[11px] text-[#005271]/60 font-medium">
                  Try asking:
                </p>
                {SUGGESTION_CHIPS.map((q) => (
                  <button
                    key={q}
                    type="button"
                    onClick={() => setInput(q)}
                    className="block w-full text-left text-[11px] px-3 py-2 rounded-xl border border-[#9EE7E5] bg-white text-[#005271] hover:bg-[#CCFFFE] transition-colors font-medium"
                  >
                    {q}
                  </button>
                ))}
              </div>
            )}

            {messages.map((m, idx) => (
              <div
                key={idx}
                className={`flex flex-col gap-1.5 ${
                  m.role === 'user' ? 'items-end' : 'items-start'
                }`}
              >
                {/* Text bubble */}
                {(m.content ||
                  (m.role === 'assistant' &&
                    loading &&
                    idx === messages.length - 1)) && (
                  <div
                    className={`max-w-[88%] rounded-2xl px-3 py-2 text-xs leading-relaxed whitespace-pre-wrap ${
                      m.role === 'user'
                        ? 'rounded-br-sm'
                        : 'rounded-bl-sm border'
                    }`}
                    style={
                      m.role === 'user'
                        ? { backgroundColor: '#005271', color: '#fff' }
                        : {
                            backgroundColor: '#fff',
                            color: '#003D3D',
                            borderColor: '#9EE7E5',
                          }
                    }
                  >
                    {/* Typing indicator */}
                    {m.role === 'assistant' && !m.content && loading && (
                      <span className="flex items-center gap-1">
                        {[0, 150, 300].map((delay) => (
                          <span
                            key={delay}
                            className="inline-block w-1.5 h-1.5 rounded-full bg-[#9EE7E5] animate-bounce"
                            style={{ animationDelay: `${delay}ms` }}
                          />
                        ))}
                      </span>
                    )}
                    {m.content && (
                      <p>
                        <MarkdownText text={m.content} />
                      </p>
                    )}
                    {m.url && !m.events?.length && (
                      <a
                        href={m.url}
                        className="mt-1.5 inline-flex items-center gap-0.5 text-[10px] font-semibold underline underline-offset-2"
                        style={{ color: '#005271' }}
                      >
                        More info →
                      </a>
                    )}
                  </div>
                )}

                {/* Event cards */}
                {m.events && m.events.length > 0 && (
                  <div className="w-full space-y-1.5">
                    {m.events.map((ev) => (
                      <HackbotEventCard
                        key={ev.id}
                        event={ev}
                        userId={userId}
                      />
                    ))}
                  </div>
                )}
              </div>
            ))}

            <div ref={messagesEndRef} />
          </section>

          {/* Input */}
          <form
            onSubmit={handleSubmit}
            className="border-t border-[#9EE7E5]/60 px-3 py-2.5 space-y-2 shrink-0 bg-white"
          >
            <div className="flex items-end gap-2">
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
              {input.length}/{MAX_USER_MESSAGE_CHARS}
            </p>

            {error && (
              <div className="text-[10px] bg-red-50 border border-red-200 rounded-lg px-2.5 py-1.5">
                <p className="text-red-600">{error}</p>
                <button
                  type="button"
                  onClick={() => setError(null)}
                  className="text-red-400 underline text-[9px] mt-0.5"
                >
                  Dismiss
                </button>
              </div>
            )}
          </form>
        </div>
      )}

      {/* FAB toggle */}
      <button
        type="button"
        onClick={toggleOpen}
        className="h-14 w-14 rounded-full text-white shadow-lg flex items-center justify-center font-bold text-sm hover:opacity-90 focus:outline-none focus:ring-2 focus:ring-[#9EE7E5] focus:ring-offset-2 transition-all"
        style={{ backgroundColor: '#005271' }}
        aria-label="Open HackDavis Helper chat"
      >
        {open ? (
          <svg viewBox="0 0 16 16" fill="currentColor" className="w-5 h-5">
            <path
              d="M4 4l8 8M12 4l-8 8"
              stroke="currentColor"
              strokeWidth="2"
              strokeLinecap="round"
              fill="none"
            />
          </svg>
        ) : (
          <span className="text-xs font-extrabold tracking-tight">HD</span>
        )}
      </button>
    </div>
  );
}
