'use client';

import { useState, useEffect, useRef, useCallback } from 'react';
import { usePathname } from 'next/navigation';
import { RxCross1 } from 'react-icons/rx';
import type { HackerProfile, HackbotEvent, HackbotChatMessage } from '@typeDefs/hackbot';
import HackbotHeader from './HackbotHeader';
import HackbotMessageList from './HackbotMessageList';
import HackbotInputForm from './HackbotInputForm';

const MAX_USER_MESSAGE_CHARS = 200;
const STORAGE_KEY = 'hackbot_chat_history';
const MAX_STORED_MESSAGES = 20;
const MIN_WIDTH = 360;
const MAX_WIDTH_FRACTION = 0.5;

const SUGGESTION_CHIPS = [
  "What's happening right now?",
  'What workshops are today?',
  'What tracks can I enter?',
];

export default function HackbotWidget({
  userId,
  initialProfile,
}: {
  userId: string;
  initialProfile: HackerProfile | null;
}) {
  const pathname = usePathname();
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const panelRef = useRef<HTMLDivElement>(null);
  const isResizing = useRef(false);
  const resizeStartX = useRef(0);
  const resizeStartWidth = useRef(0);

  const [open, setOpen] = useState(false);
  const [panelWidth, setPanelWidth] = useState<number | null>(null);
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
  const [hackerProfile] = useState<HackerProfile | null>(initialProfile);

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

  // Resize drag handlers
  const onResizeMouseDown = useCallback((e: React.MouseEvent) => {
    e.preventDefault();
    isResizing.current = true;
    resizeStartX.current = e.clientX;
    resizeStartWidth.current = panelRef.current?.offsetWidth ?? MIN_WIDTH;

    const onMouseMove = (ev: MouseEvent) => {
      if (!isResizing.current) return;
      const delta = resizeStartX.current - ev.clientX;
      const maxWidth = window.innerWidth * MAX_WIDTH_FRACTION;
      const next = Math.min(
        Math.max(resizeStartWidth.current + delta, MIN_WIDTH),
        maxWidth
      );
      setPanelWidth(next);
    };

    const onMouseUp = () => {
      isResizing.current = false;
      document.removeEventListener('mousemove', onMouseMove);
      document.removeEventListener('mouseup', onMouseUp);
    };

    document.addEventListener('mousemove', onMouseMove);
    document.addEventListener('mouseup', onMouseUp);
  }, []);

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
                        const last = updated[updated.length - 1];
                        // Merge events across multiple tool calls (e.g. WORKSHOPS + ACTIVITIES)
                        const existing = last.events ?? [];
                        const incoming = r.result.events as HackbotEvent[];
                        const merged = [
                          ...existing,
                          ...incoming.filter(
                            (e) => !existing.some((x) => x.id === e.id)
                          ),
                        ];
                        updated[updated.length - 1] = {
                          ...last,
                          events: merged,
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

  const panelStyle =
    panelWidth !== null ? { width: `${panelWidth}px` } : undefined;

  return (
    <div className="fixed bottom-4 right-0 sm:right-4 z-50 flex flex-col items-end gap-2">
      {/* Chat panel */}
      {open && (
        <div
          ref={panelRef}
          className="w-screen sm:w-[min(30vw,420px)] sm:min-w-[360px] max-h-[calc(100svh-5rem)] sm:max-h-[600px] rounded-none sm:rounded-2xl border-t sm:border border-[#9EE7E5] bg-[#FAFAFF] shadow-xl shadow-[#005271]/10 flex flex-col overflow-hidden relative"
          style={{
            fontFamily: 'var(--font-plus-jakarta-sans, sans-serif)',
            ...panelStyle,
          }}
        >
          {/* Resize handle — left edge, desktop only */}
          <div
            className="absolute left-0 top-0 bottom-0 w-1.5 cursor-ew-resize hidden sm:block hover:bg-[#9EE7E5]/50 transition-colors z-10"
            onMouseDown={onResizeMouseDown}
          />

          <HackbotHeader firstName={firstName} onClose={toggleOpen} />

          <HackbotMessageList
            messages={messages}
            loading={loading}
            suggestionChips={SUGGESTION_CHIPS}
            userId={userId}
            onChipClick={setInput}
            messagesEndRef={messagesEndRef}
          />

          <HackbotInputForm
            input={input}
            setInput={setInput}
            canSend={canSend}
            loading={loading}
            error={error}
            maxChars={MAX_USER_MESSAGE_CHARS}
            onSubmit={handleSubmit}
            onSend={sendMessage}
            onDismissError={() => setError(null)}
          />
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
          <RxCross1 className="w-5 h-5" />
        ) : (
          <span className="text-xs font-extrabold tracking-tight">HD</span>
        )}
      </button>
    </div>
  );
}
