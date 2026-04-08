'use client';

import { RxCross1 } from 'react-icons/rx';
import type { HackerProfile } from '@typeDefs/hackbot';
import HackbotHeader from './HackbotHeader';
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
