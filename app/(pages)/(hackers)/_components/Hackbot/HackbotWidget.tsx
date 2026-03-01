'use client';

import { useState, useEffect, useRef, useCallback } from 'react';
import { usePathname } from 'next/navigation';
import { RxCross1 } from 'react-icons/rx';
import type {
  HackerProfile,
  HackbotEvent,
  HackbotLink,
  HackbotChatMessage,
} from '@typeDefs/hackbot';
import HackbotHeader from './HackbotHeader';
import HackbotMessageList from './HackbotMessageList';
import HackbotInputForm from './HackbotInputForm';

const MAX_USER_MESSAGE_CHARS = 200;
const STORAGE_KEY = 'hackbot_chat_history';
const MAX_STORED_MESSAGES = 20;
const MIN_WIDTH = 360;
const MAX_WIDTH_FRACTION = 0.5;
const CASCADE_DELAY_MS = 150;


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
  // Buffer events during streaming; cascade them in after text completes
  const pendingEventsRef = useRef<HackbotEvent[]>([]);
  const cascadeTimersRef = useRef<ReturnType<typeof setTimeout>[]>([]);
  // Buffer links from provide_links tool result; apply after text completes
  const pendingLinksRef = useRef<HackbotLink[]>([]);

  const [open, setOpen] = useState(() => {
    if (typeof window !== 'undefined') {
      return localStorage.getItem('hackbot_open') === 'true';
    }
    return false;
  });
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
  const [toolPending, setToolPending] = useState(false);
  const [retrying, setRetrying] = useState(0);
  const [cascading, setCascading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  // Set when a tool-result arrives mid-stream; next text chunk gets a separator
  const addSeparatorRef = useRef(false);
  const [hackerProfile] = useState<HackerProfile | null>(initialProfile);

  const suggestionChips = [
    ...(hackerProfile?.is_beginner ? ["I'm a beginner, where do I start?"] : []),
    hackerProfile?.position === 'developer'
      ? 'What developer resources are there?'
      : hackerProfile?.position === 'designer'
        ? 'What designer resources are there?'
        : 'What developer and designer resources are there?',
    'When is the submission deadline?',
    "What's my team number vs. table number?",
    'How are projects judged?',
  ];

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

  // Persist open state to localStorage
  useEffect(() => {
    if (typeof window !== 'undefined') {
      localStorage.setItem('hackbot_open', String(open));
    }
  }, [open]);

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

  const sendMessage = async (overrideText?: string) => {
    const text = (overrideText ?? input).trim();
    if (loading || !text || text.length > MAX_USER_MESSAGE_CHARS) return;

    // Cancel any in-progress event cascade from a previous response
    cascadeTimersRef.current.forEach(clearTimeout);
    cascadeTimersRef.current = [];
    pendingEventsRef.current = [];
    pendingLinksRef.current = [];
    addSeparatorRef.current = false;
    setCascading(false);

    const userMessage: HackbotChatMessage = { role: 'user', content: text };

    // Capture conversation history before state updates so the same API messages
    // are sent on every retry attempt.
    const historyMessages = messages;

    setMessages((prev) => [
      ...prev,
      userMessage,
      { role: 'assistant', content: '' } as HackbotChatMessage,
    ]);
    setInput('');
    setError(null);
    setLoading(true);

    const apiMessages = [
      ...historyMessages.map((m) => ({ role: m.role, content: m.content })),
      { role: 'user', content: userMessage.content },
    ];

    const MAX_ATTEMPTS = 3;
    let succeeded = false;

    for (let attempt = 0; attempt < MAX_ATTEMPTS; attempt++) {
      if (attempt > 0) {
        // Show retrying indicator, wait briefly, then reset the assistant bubble
        setRetrying(attempt);
        // eslint-disable-next-line no-await-in-loop
        await new Promise((r) => setTimeout(r, 800 * attempt));
        pendingEventsRef.current = [];
        pendingLinksRef.current = [];
        addSeparatorRef.current = false;
        setMessages((prev) => {
          const updated = [...prev];
          for (let i = updated.length - 1; i >= 0; i--) {
            if (updated[i].role === 'assistant') {
              updated[i] = { role: 'assistant', content: '' };
              break;
            }
          }
          return updated;
        });
        setRetrying(0);
      }

      let accumulatedText = '';
      let streamHadError = false;

      try {
        // eslint-disable-next-line no-await-in-loop
        const response = await fetch('/api/hackbot/stream', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            messages: apiMessages,
            currentPath: pathname + window.location.hash,
          }),
        });

        if (!response.ok) {
          const errorData = await response.json();
          throw new Error(errorData.error || 'Stream failed');
        }

        const reader = response.body?.getReader();
        const decoder = new TextDecoder();

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
                if (line.startsWith('9:')) {
                  // Tool call in flight — show loading indicator
                  setToolPending(true);
                } else if (line.startsWith('0:')) {
                  // Text delta
                  const content = line
                    .slice(2)
                    .trim()
                    .replace(/^"([\s\S]*)"$/, '$1')
                    .replace(/\\n/g, '\n')
                    .replace(/\\"/g, '"');
                  if (content) {
                    // Add a blank line between step-1 text and any step-2 text
                    if (addSeparatorRef.current && accumulatedText.length > 0) {
                      accumulatedText += '\n\n';
                      addSeparatorRef.current = false;
                    }
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
                } else if (line.startsWith('3:')) {
                  // Server-emitted error — mark for retry
                  streamHadError = true;
                  setToolPending(false);
                  keepReading = false;
                } else if (line.startsWith('8:')) {
                  // Message annotation — buffer links until streaming is done
                  try {
                    const annotations = JSON.parse(line.slice(2).trim());
                    const arr = Array.isArray(annotations)
                      ? annotations
                      : [annotations];
                    for (const ann of arr) {
                      if (Array.isArray(ann.links) && ann.links.length > 0) {
                        pendingLinksRef.current = ann.links as HackbotLink[];
                      }
                    }
                  } catch {
                    // Malformed annotation — ignore
                  }
                } else if (line.startsWith('a:')) {
                  // Tool result received — clear tool-pending indicator; mark that
                  // any subsequent text should be separated from the prior step's text
                  setToolPending(false);
                  if (accumulatedText.length > 0)
                    addSeparatorRef.current = true;
                  // Buffer events and links; apply after text is done
                  try {
                    const toolResult = JSON.parse(line.slice(2).trim());
                    const results = Array.isArray(toolResult)
                      ? toolResult
                      : [toolResult];
                    for (const r of results) {
                      if (r.result?.events?.length > 0) {
                        const incoming = r.result.events as HackbotEvent[];
                        const existing = pendingEventsRef.current;
                        const merged = [
                          ...existing,
                          ...incoming.filter(
                            (e) => !existing.some((x) => x.id === e.id)
                          ),
                        ].sort(
                          (a, b) =>
                            (a.startMs ?? Infinity) - (b.startMs ?? Infinity)
                        );
                        pendingEventsRef.current = merged;
                      }
                      // Links from provide_links tool (dedup by URL)
                      if (
                        Array.isArray(r.result?.links) &&
                        r.result.links.length > 0
                      ) {
                        const seen = new Set<string>();
                        pendingLinksRef.current = (
                          r.result.links as HackbotLink[]
                        ).filter((l) => {
                          if (seen.has(l.url)) return false;
                          seen.add(l.url);
                          return true;
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
      } catch (err: any) {
        console.error(`[hackbot] Stream error attempt ${attempt + 1}`, err);
        streamHadError = true;
      }

      setToolPending(false);

      if (!streamHadError) {
        succeeded = true;
        break;
      }

      console.warn(`[hackbot] Attempt ${attempt + 1}/${MAX_ATTEMPTS} failed`);
    }

    setLoading(false);
    setRetrying(0);

    if (!succeeded) {
      setError('Something went wrong. Please try again.');
      setMessages((prev) => prev.slice(0, -2)); // remove both the user message and empty assistant bubble
      return;
    }

    // Apply buffered links immediately (no cascade delay)
    const linksToApply = pendingLinksRef.current;
    pendingLinksRef.current = [];
    if (linksToApply.length > 0) {
      setMessages((prev) => {
        const updated = [...prev];
        for (let i = updated.length - 1; i >= 0; i--) {
          if (updated[i].role === 'assistant') {
            updated[i] = { ...updated[i], links: linksToApply };
            break;
          }
        }
        return updated;
      });
    }

    // Cascade buffered events in one by one with staggered delays
    const eventsToShow = [...pendingEventsRef.current];
    pendingEventsRef.current = [];
    if (eventsToShow.length > 0) {
      setCascading(true);
      eventsToShow.forEach((event, idx) => {
        const isLast = idx === eventsToShow.length - 1;
        const t = setTimeout(
          () => {
            setMessages((prev) => {
              // Find the last assistant message and append this event
              for (let i = prev.length - 1; i >= 0; i--) {
                if (prev[i].role === 'assistant') {
                  const existing = prev[i].events ?? [];
                  if (existing.some((e) => e.id === event.id)) return prev;
                  const updated = [...prev];
                  updated[i] = {
                    ...prev[i],
                    events: [...existing, event],
                  };
                  return updated;
                }
              }
              return prev;
            });
            if (isLast) setCascading(false);
          },
          (idx + 1) * CASCADE_DELAY_MS
        );
        cascadeTimersRef.current.push(t);
      });
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
          className="w-screen sm:w-[min(30vw,420px)] sm:min-w-[360px] max-h-[calc(100svh-5rem)] sm:max-h-[600px] min-h-[450px] rounded-none sm:rounded-2xl border-t sm:border border-[#9EE7E5] bg-[#FAFAFF] shadow-xl shadow-[#005271]/10 flex flex-col overflow-hidden relative"
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
            toolPending={toolPending}
            retrying={retrying}
            cascading={cascading}
            suggestionChips={suggestionChips}
            userId={userId}
            onChipClick={(text) => void sendMessage(text)}
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
            suggestionChips={suggestionChips}
            onChipSend={(text) => void sendMessage(text)}
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
