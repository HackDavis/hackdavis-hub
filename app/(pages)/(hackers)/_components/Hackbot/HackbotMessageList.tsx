'use client';

import { RefObject } from 'react';
import type { HackbotChatMessage } from '@typeDefs/hackbot';
import MarkdownText from './MarkdownText';
import HackbotEventCard from './HackbotEventCard';

export default function HackbotMessageList({
  messages,
  loading,
  suggestionChips,
  userId,
  onChipClick,
  messagesEndRef,
}: {
  messages: HackbotChatMessage[];
  loading: boolean;
  suggestionChips: string[];
  userId: string;
  onChipClick: (text: string) => void;
  messagesEndRef: RefObject<HTMLDivElement | null>;
}) {
  return (
    <section className="flex-1 overflow-y-auto px-3 py-3 space-y-3 min-h-0 bg-[#FAFAFF]">
      {messages.length === 0 && (
        <div className="space-y-2">
          <p className="text-[11px] text-[#005271]/60 font-medium">
            Try asking:
          </p>
          {suggestionChips.map((q) => (
            <button
              key={q}
              type="button"
              onClick={() => onChipClick(q)}
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

      <div ref={messagesEndRef as React.RefObject<HTMLDivElement>} />
    </section>
  );
}
