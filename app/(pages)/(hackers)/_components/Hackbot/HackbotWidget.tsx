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
    <div className="fixed bottom-2 sm:bottom-4 right-2 sm:right-4 z-50 flex flex-col items-end gap-3 font-jakarta">
      {open && (
        /* Outer container — panelRef here so all children share the same width */
        <div
          ref={panelRef}
          className="flex flex-col gap-3 w-screen sm:w-[min(30vw,420px)] sm:min-w-[430px]"
          style={panelStyle}
        >
          {/* Top row: title pill + × pill, same height */}
          <div className="flex gap-1 sm:gap-3 items-stretch">
            {/* Title pill */}
            <div className="flex-1 bg-white rounded-3xl shadow-lg border border-gray-100 px-4 py-3">
              <p className="text-sm font-bold text-[#003D3D] tracking-tight md:whitespace-nowrap self-center font-jakarta">
                Hi I'm Hacky! Ask me anything about Hackdavis.
              </p>
            </div>

            {/* Close × pill */}
            <button
              type="button"
              onClick={toggleOpen}
              className="shrink-0 w-[3rem] md:w-[3rem] aspect-square rounded-3xl bg-white shadow-lg border border-gray-100 flex items-center justify-center text-[#003D3D]/60 hover:bg-gray-50 transition-colors"
              aria-label="Close chat"
            >
              <RxCross1 className="w-4 h-4 md:w-5 md:h-5" />
            </button>
          </div>

          {/* Message card — fixed height, resize handle on left edge */}
          <div className="w-[100%] sm:w-full h-[460px] rounded-xl sm:rounded-3xl bg-white shadow-xl sm:border border-gray-100 flex flex-col overflow-hidden relative">
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
        aria-label="Open Hacky chat"
        className="group flex items-center rounded-full bg-transparent focus:outline-none focus-visible:ring-2 focus-visible:ring-[#9EE7E5]"
      >
        {!open ? (
          <span className="flex items-center justify-end max-w-16 overflow-hidden whitespace-nowrap rounded-full transition-[max-width,background-color,box-shadow] duration-500 ease-out animate-hackbotFabReveal group-hover:animate-none group-focus:animate-none group-hover:max-w-[19rem] group-focus:max-w-[19rem] group-hover:bg-gray-100/80 group-focus:bg-gray-100/80 group-hover:shadow-lg group-focus:shadow-lg">
            <span className="block w-[8rem] pl-5 pr-3 text-base font-semibold text-[#3F3F3F]">
              Ask Hacky
            </span>
            <span className="block h-16 w-16 shrink-0 transition-transform duration-300 animate-hackbotWiggle group-hover:animate-none group-focus:animate-none group-hover:rotate-0 group-focus:rotate-0">
              <Image
                src="/hackers/hackbot/cow.svg"
                alt="Hacky"
                width={56}
                height={56}
                priority
                className="h-16 w-16 opacity-100"
              />
            </span>
          </span>
        ) : (
          <span className="block h-16 w-16 shrink-0">
            <Image
              src="/hackers/hackbot/cow.svg"
              alt="Hacky"
              width={56}
              height={56}
              priority
              className="h-16 w-16 opacity-100"
            />
          </span>
        )}
      </button>
    </div>
  );
}
