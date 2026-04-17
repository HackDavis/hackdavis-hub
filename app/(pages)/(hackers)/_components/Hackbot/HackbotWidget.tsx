'use client';

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
                HackDavis Helper
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
              <RxCross1 className="w-4 h-4" />
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
        className="h-14 w-14 rounded-full text-white shadow-lg flex items-center justify-center hover:opacity-90 focus:outline-none focus:ring-2 focus:ring-[#9EE7E5] focus:ring-offset-2 transition-all"
        style={{ backgroundColor: '#005271' }}
        aria-label="Open HackDavis Helper chat"
      >
        <span className="text-xs font-extrabold tracking-tight">HD</span>
      </button>
    </div>
  );
}
