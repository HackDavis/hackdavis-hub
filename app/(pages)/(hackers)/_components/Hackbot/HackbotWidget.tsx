'use client';

import Image from 'next/image';
import { RxCross1 } from 'react-icons/rx';
import type { HackerProfile } from '@typeDefs/hackbot';
import HackbotMessageList from './HackbotMessageList';
import HackbotInputForm from './HackbotInputForm';
import {
  MAX_USER_MESSAGE_CHARS,
  useHackbotWidget,
} from '@hooks/useHackbotWidget';

export default function HackbotWidget({
  userId,
  initialProfile,
}: {
  userId: string;
  initialProfile: HackerProfile | null;
}) {
  const {
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
  } = useHackbotWidget({ initialProfile });

  return (
    <div
      className="fixed bottom-4 right-0 sm:right-4 z-50 flex flex-col items-end gap-3"
      style={{ fontFamily: 'var(--font-plus-jakarta-sans, sans-serif)' }}
    >
      {open && (
        /* Outer container — panelRef here so all children share the same width */
        <div
          ref={panelRef}
          className="flex flex-col gap-3 w-screen sm:w-[min(30vw,420px)] sm:min-w-[360px]"
          style={panelStyle}
        >
          {/* Top row: title pill + × pill, same height */}
          <div className="flex gap-3 items-stretch">
            {/* Title pill */}
            <div className="flex-1 bg-white rounded-3xl shadow-lg border border-gray-100 px-4 py-3">
              <p className="text-sm font-bold text-[#003D3D] tracking-tight">
                Hacky AI
              </p>
              <p className="text-xs text-[#005271]/70 mt-0.5">
                {firstName
                  ? `Hi ${firstName}! Ask me anything about HackDavis.`
                  : 'Ask me anything about HackDavis!'}
              </p>
            </div>

            {/* Close × pill */}
            <button
              type="button"
              onClick={toggleOpen}
              className="shrink-0 w-[4.5rem] rounded-3xl bg-white shadow-lg border border-gray-100 flex items-center justify-center text-[#003D3D]/60 hover:bg-gray-50 transition-colors"
              aria-label="Close chat"
            >
              <RxCross1 className="w-6 h-6" />
            </button>
          </div>

          {/* Message card — fixed height, resize handle on left edge */}
          <div className="w-full h-[460px] rounded-none sm:rounded-3xl bg-white shadow-xl sm:border border-gray-100 flex flex-col overflow-hidden relative">
            <div
              className="absolute left-0 top-0 bottom-0 w-1.5 cursor-ew-resize hidden sm:block hover:bg-[#9EE7E5]/20 transition-colors z-10"
              onMouseDown={onResizeMouseDown}
            />
            <HackbotMessageList
              messages={messages}
              loading={loading}
              toolPending={toolPending}
              retrying={retrying}
              cascading={cascading}
              suggestionChips={suggestionChips}
              userId={userId}
              firstName={firstName}
              onChipClick={(text) => void sendMessage(text)}
              messagesEndRef={messagesEndRef}
            />
          </div>

          {/* Input pill */}
          <div className="w-full">
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
              hasMessages={messages.length > 0}
            />
          </div>
        </div>
      )}

      {/* FAB toggle */}
      <button
        type="button"
        onClick={toggleOpen}
        aria-label="Open Hacky AI chat"
        className="group flex items-center rounded-full bg-transparent transition-colors duration-300 hover:bg-gray-100/80 hover:shadow-lg focus:bg-gray-100/80 focus:shadow-lg focus:outline-none focus-visible:ring-2 focus-visible:ring-[#9EE7E5]"
      >
        {!open && (
          <span className="max-w-0 overflow-hidden whitespace-nowrap transition-[max-width] duration-500 ease-out group-hover:max-w-[240px] group-focus:max-w-[240px]">
            <span className="block pl-5 pr-3 text-base font-semibold text-[#3F3F3F]">
              Ask Hacky AI
            </span>
          </span>
        )}
        <span
          className={
            'block h-16 w-16 shrink-0 ' +
            (!open ? 'animate-hackbotWiggle' : '') +
            ' group-hover:[animation-play-state:paused] group-focus:[animation-play-state:paused]'
          }
        >
          <Image
            src="/hackers/hackbot/cow.svg"
            alt="Hacky AI"
            width={56}
            height={56}
            priority
            className="h-16 w-16 opacity-100"
          />
        </span>
      </button>
    </div>
  );
}
