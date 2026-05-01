'use client';

import Link from 'next/link';
import { RefObject } from 'react';
import { ArrowRight } from 'lucide-react';
import type { HackbotChatMessage } from '@typeDefs/hackbot';
import MarkdownText from './MarkdownText';
import HackbotEventCard from './HackbotEventCard';

function isSafeRelativeHref(href: string): boolean {
  const trimmed = href.trim();
  if (!trimmed) return false;
  return trimmed.startsWith('/') && !trimmed.startsWith('//');
}

function formatTimestamp(iso: string): string {
  const d = new Date(iso);
  const day = d.toLocaleDateString('en-US', { weekday: 'long' }).toUpperCase();
  const time = d
    .toLocaleTimeString('en-US', {
      hour: 'numeric',
      minute: '2-digit',
      hour12: true,
    })
    .replace(' ', '')
    .toUpperCase();
  return `${day} ${time}`;
}

export default function HackbotMessageList({
  messages,
  loading,
  toolPending,
  retrying,
  cascading,
  suggestionChips,
  userId,
  firstName,
  onChipClick,
  messagesEndRef,
}: {
  messages: HackbotChatMessage[];
  loading: boolean;
  toolPending: boolean;
  retrying: number;
  cascading: boolean;
  suggestionChips: string[];
  userId: string;
  firstName: string | undefined;
  onChipClick: (text: string) => void;
  messagesEndRef: RefObject<HTMLDivElement | null>;
}) {
  return (
    <section className="flex-1 overflow-y-auto px-4 py-4 space-y-3 min-h-0 bg-white">
      {/* Empty state */}
      {messages.length === 0 && (
        <div className="space-y-3">
          <div className="pb-1">
            <p className="text-2xl font-bold text-[#003D3D] leading-tight font-jakarta">
              {firstName ? `Hi ${firstName}!` : 'Hi there!'}
            </p>
            <p className="text-2xl font-bold text-[#003D3D] leading-tight font-jakarta">
              How can I help you today?
            </p>
          </div>
          {suggestionChips.map((q) => (
            <button
              key={q}
              type="button"
              onClick={() => onChipClick(q)}
              className="block w-full text-left text-xs px-3.5 py-2.5 rounded-xl border border-[#9EE7E5]/60 text-[#003D3D] hover:brightness-95 transition-all font-jakarta"
              style={{ backgroundColor: '#D5FDFF99' }}
            >
              {q}
            </button>
          ))}
        </div>
      )}

      {messages.map((m, idx) => (
        <div
          key={idx}
          className={`flex flex-col gap-1 ${
            m.role === 'user' ? 'items-end' : 'items-start'
          }`}
        >
          {/* Text bubble */}
          {(m.content ||
            (m.role === 'assistant' &&
              loading &&
              idx === messages.length - 1)) && (
            <div
              className={`max-w-[88%] text-sm leading-relaxed whitespace-pre-wrap ${
                m.role === 'user'
                  ? 'rounded-2xl rounded-br-sm px-3.5 py-2.5'
                  : 'px-0 py-0'
              }`}
              style={
                m.role === 'user'
                  ? { backgroundColor: '#EBEBF0', color: '#1a1a1a' }
                  : { color: '#1a1a1a' }
              }
            >
              {/* Typing dots */}
              {m.role === 'assistant' &&
                !m.content &&
                loading &&
                retrying === 0 && (
                  <span className="flex items-center gap-1 py-1">
                    {[0, 150, 300].map((delay) => (
                      <span
                        key={delay}
                        className="inline-block w-1.5 h-1.5 rounded-full bg-gray-300 animate-bounce"
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

              {/* Retrying */}
              {m.role === 'assistant' &&
                loading &&
                retrying > 0 &&
                idx === messages.length - 1 && (
                  <span className="flex items-center gap-1.5">
                    {[0, 150, 300].map((delay) => (
                      <span
                        key={delay}
                        className="inline-block w-1 h-1 rounded-full bg-gray-300 animate-bounce"
                        style={{ animationDelay: `${delay}ms` }}
                      />
                    ))}
                    <span className="text-[10px] text-gray-400">
                      Retrying ({retrying}/2)…
                    </span>
                  </span>
                )}

              {/* Mid-stream dots */}
              {m.role === 'assistant' &&
                m.content &&
                loading &&
                toolPending &&
                retrying === 0 &&
                idx === messages.length - 1 && (
                  <span className="flex items-center gap-1 mt-1.5">
                    {[0, 150, 300].map((delay) => (
                      <span
                        key={delay}
                        className="inline-block w-1.5 h-1.5 rounded-full bg-gray-300 animate-bounce"
                        style={{ animationDelay: `${delay}ms` }}
                      />
                    ))}
                  </span>
                )}

              {/* Named links */}
              {m.links && m.links.length > 0 && (
                <div className="mt-2 flex flex-col gap-1">
                  {m.links
                    .filter((link) => isSafeRelativeHref(link.url))
                    .map((link, i) => (
                      <Link
                        key={`${i}-${link.url}`}
                        href={link.url}
                        className="inline-flex items-center gap-1.5 text-sm font-bold uppercase tracking-wide underline underline-offset-2 hover:opacity-70 transition-opacity"
                        style={{ color: '#005271' }}
                      >
                        <ArrowRight className="w-4 h-4 shrink-0" />
                        {link.label}
                      </Link>
                    ))}
                </div>
              )}

              {/* Legacy URL fallback */}
              {!m.links?.length && m.url && isSafeRelativeHref(m.url) && (
                <a
                  href={m.url}
                  className="mt-2 inline-flex items-center gap-1.5 text-sm font-bold uppercase tracking-wide underline underline-offset-2"
                  style={{ color: '#005271' }}
                >
                  <ArrowRight className="w-4 h-4 shrink-0" />
                  More info
                </a>
              )}
            </div>
          )}

          {/* Cards-loading dots */}
          {m.role === 'assistant' &&
            m.content &&
            retrying === 0 &&
            idx === messages.length - 1 &&
            (m.events?.length ?? 0) === 0 &&
            ((loading && !toolPending) || cascading) && (
              <span className="flex items-center gap-1 px-1">
                {[0, 150, 300].map((delay) => (
                  <span
                    key={delay}
                    className="inline-block w-1.5 h-1.5 rounded-full bg-gray-300 animate-bounce"
                    style={{ animationDelay: `${delay}ms` }}
                  />
                ))}
              </span>
            )}

          {/* Event cards — all rendered as full cards */}
          {m.events && m.events.length > 0 && (
            <div className="w-full max-w-[96%] space-y-2">
              {m.events.map((ev) => (
                <HackbotEventCard key={ev.id} event={ev} userId={userId} />
              ))}
              <div className="px-0.5 pt-0.5">
                <Link
                  href="/schedule"
                  className="inline-flex items-center gap-1.5 text-sm font-bold uppercase tracking-wide underline underline-offset-2 hover:opacity-70 transition-opacity"
                  style={{ color: '#005271' }}
                >
                  <ArrowRight className="w-4 h-4 shrink-0" />
                  View your schedule
                </Link>
              </div>
            </div>
          )}

          {/* Timestamp */}
          {m.timestamp && (
            <p className="text-[10px] text-gray-400 tracking-widest select-none font-medium">
              {formatTimestamp(m.timestamp)}
            </p>
          )}
        </div>
      ))}

      <div ref={messagesEndRef as React.RefObject<HTMLDivElement>} />
    </section>
  );
}
