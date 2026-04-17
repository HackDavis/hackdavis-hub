'use client';

import { useState } from 'react';
import { HiLocationMarker } from 'react-icons/hi';
import { Plus, Check, X } from 'lucide-react';
import { createUserToEvent } from '@actions/userToEvents/createUserToEvent';
import { deleteUserToEvent } from '@actions/userToEvents/deleteUserToEvent';
import type { HackbotEvent } from '@typeDefs/hackbot';

// Exact colors from scheduleEventStyles.ts + derived addButtonColor for types without one
const TYPE_STYLE: Record<string, { bg: string; text: string; btn: string }> = {
  WORKSHOPS:  { bg: '#E9FBBA', text: '#1A3819', btn: '#D1F76E' },
  GENERAL:    { bg: '#CCFFFE', text: '#003D3D', btn: '#9EE7E5' },
  ACTIVITIES: { bg: '#FFE2D5', text: '#52230C', btn: '#FFD5C2' },
  MEALS:      { bg: '#FFE7B2', text: '#572700', btn: '#FFCC66' },
};

const ADDABLE_TYPES = new Set(['WORKSHOPS', 'ACTIVITIES']);

export default function HackbotEventCard({
  event,
  userId,
}: {
  event: HackbotEvent;
  userId: string;
}) {
  const [added, setAdded] = useState(false);
  const [adding, setAdding] = useState(false);
  const [addError, setAddError] = useState(false);

  const handleAdd = async () => {
    if (!userId || adding) return;
    setAdding(true);
    setAddError(false);
    try {
      if (added) {
        const result = await deleteUserToEvent({ user_id: userId, event_id: event.id });
        if (!result.ok) throw new Error('Failed to remove');
        setAdded(false);
      } else {
        const result = await createUserToEvent(userId, event.id);
        if (!result.ok) throw new Error(result.error ?? 'Failed');
        setAdded(true);
      }
    } catch {
      setAddError(true);
    }
    setAdding(false);
  };

  const style = TYPE_STYLE[event.type ?? ''] ?? { bg: '#F5F5F5', text: '#333', btn: '#ddd' };
  const canAdd = userId && ADDABLE_TYPES.has(event.type ?? '');

  return (
    <div
      className="rounded-2xl overflow-hidden animate-hackbot-slide-in"
      style={{ backgroundColor: style.bg }}
    >
      <div className="px-4 py-4 flex items-center gap-3">
        {/* Left: all event info */}
        <div className="flex-1 min-w-0 space-y-1.5">
          <p className="font-bold text-base leading-tight" style={{ color: style.text }}>
            {event.name}
          </p>

          {(event.start || event.location) && (
            <p className="text-sm flex items-center gap-1.5 flex-wrap" style={{ color: style.text }}>
              {event.start && (
                <span>{event.start}{event.end ? ` - ${event.end}` : ''}</span>
              )}
              {event.location && (
                <>
                  <HiLocationMarker className="shrink-0 w-3.5 h-3.5" />
                  <span className="truncate">{event.location}</span>
                </>
              )}
            </p>
          )}

          {event.host && (
            <p
              className="text-xs font-bold uppercase tracking-widest"
              style={{ color: style.text + 'AA' }}
            >
              {event.host}
            </p>
          )}
        </div>

        {/* Right: add button pill */}
        {canAdd && (
          <button
            type="button"
            onClick={handleAdd}
            disabled={adding}
            className="shrink-0 h-10 w-10 min-w-[2.5rem] aspect-square rounded-full flex items-center justify-center transition-all disabled:opacity-60"
            style={
              addError
                ? { backgroundColor: '#fca5a5', color: '#7f1d1d' }
                : added
                ? { backgroundColor: style.text, color: '#fff' }
                : { backgroundColor: style.btn, color: style.text }
            }
            aria-label={added ? 'Remove from schedule' : 'Add to schedule'}
          >
            {adding ? (
              <span className="w-4 h-4 border-2 border-current border-t-transparent rounded-full animate-spin" />
            ) : addError ? (
              <X className="w-4 h-4" />
            ) : added ? (
              <Check className="w-4 h-4" />
            ) : (
              <Plus className="w-4 h-4" />
            )}
          </button>
        )}
      </div>
    </div>
  );
}
