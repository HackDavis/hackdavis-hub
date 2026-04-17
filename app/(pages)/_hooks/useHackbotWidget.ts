'use client';

import {
  useState,
  useEffect,
  useRef,
  useCallback,
  type CSSProperties,
  type FormEvent,
  type MouseEvent as ReactMouseEvent,
} from 'react';
import { usePathname } from 'next/navigation';
import type {
  HackerProfile,
  HackbotEvent,
  HackbotLink,
  HackbotChatMessage,
} from '@typeDefs/hackbot';

export const MAX_USER_MESSAGE_CHARS = 200;
const STORAGE_KEY = 'hackbot_chat_history';
const MAX_STORED_MESSAGES = 20;
const MIN_WIDTH = 360;
const MAX_WIDTH_FRACTION = 0.5;
const CASCADE_DELAY_MS = 150;

export function useHackbotWidget({
  initialProfile,
}: {
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
    ...(hackerProfile?.is_beginner !== false
      ? ["I'm a beginner, where do I start?"]
      : []),
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
  const onResizeMouseDown = useCallback((e: ReactMouseEvent) => {
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

    const userMessage: HackbotChatMessage = {
      role: 'user',
      content: text,
      timestamp: new Date().toISOString(),
    };

    // Capture conversation history before state updates so the same API messages
    // are sent on every retry attempt.
    const historyMessages = messages;

    setMessages((prev) => [
      ...prev,
      userMessage,
      {
        role: 'assistant',
        content: '',
        timestamp: new Date().toISOString(),
      } as HackbotChatMessage,
    ]);
    setInput('');
    setError(null);
    setLoading(true);

    const apiMessages = [
      ...historyMessages.map((m) => ({ role: m.role, content: m.content })),
      { role: 'user', content: userMessage.content },
    ].filter((m) => m.content.trim().length > 0);

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

        if (!reader) {
          throw new Error(
            'Streaming unsupported: response body reader unavailable.'
          );
        }

        let keepReading = true;
        let lineBuffer = '';
        while (keepReading) {
          // eslint-disable-next-line no-await-in-loop
          const { done, value } = await reader.read();
          lineBuffer += done
            ? decoder.decode()
            : decoder.decode(value, { stream: true });

          const lines = lineBuffer.split('\n');
          if (done) {
            keepReading = false;
            lineBuffer = '';
          } else {
            lineBuffer = lines.pop() ?? '';
          }

          for (const line of lines) {
            if (line.startsWith('9:')) {
              // Tool call in flight — show loading indicator
              setToolPending(true);
            } else if (line.startsWith('0:')) {
              // Text delta
              let content: string;
              try {
                const parsed = JSON.parse(line.slice(2).replace(/\r$/, ''));
                if (typeof parsed !== 'string') continue;
                content = parsed;
              } catch {
                continue;
              }

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
              if (accumulatedText.length > 0) addSeparatorRef.current = true;
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
                    const existingIds = new Set(existing.map((e) => e.id));
                    const merged = [
                      ...existing,
                      ...incoming.filter((e) => !existingIds.has(e.id)),
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
                  const updated = [...prev];
                  updated[i] = {
                    ...prev[i],
                    events: [...(prev[i].events ?? []), event],
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

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault();
    await sendMessage();
  };

  const firstName = hackerProfile?.name?.split(' ')[0];

  const panelStyle: CSSProperties | undefined =
    panelWidth !== null ? { width: `${panelWidth}px` } : undefined;

  return {
    open,
    panelRef,
    messagesEndRef,
    messages,
    input,
    loading,
    toolPending,
    retrying,
    cascading,
    error,
    canSend,
    suggestionChips,
    firstName,
    panelStyle,
    toggleOpen,
    onResizeMouseDown,
    setInput,
    setError,
    sendMessage,
    handleSubmit,
  };
}
