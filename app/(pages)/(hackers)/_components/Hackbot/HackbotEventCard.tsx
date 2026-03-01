'use client';

import { useState } from 'react';
import { HiLocationMarker } from 'react-icons/hi';
import { PiStarFourFill } from 'react-icons/pi';
import { createUserToEvent } from '@actions/userToEvents/createUserToEvent';
import { deleteUserToEvent } from '@actions/userToEvents/deleteUserToEvent';
import type { HackbotEvent } from '@typeDefs/hackbot';

// Matches scheduleEventStyles.ts
const TYPE_STYLE: Record<string, { bg: string; text: string; label: string }> =
  {
    WORKSHOPS: { bg: '#E9FBBA', text: '#1A3819', label: 'Workshop' },
    GENERAL: { bg: '#CCFFFE', text: '#003D3D', label: 'General' },
    ACTIVITIES: { bg: '#FFE2D5', text: '#52230C', label: 'Activity' },
    MEALS: { bg: '#FFE7B2', text: '#572700', label: 'Meal' },
  };

const TAG_LABEL: Record<string, string> = {
  developer: 'Dev',
  designer: 'Design',
  beginner: 'Beginner',
  pm: 'PM',
  other: 'Other',
};

// Only show Add button for event types that make sense to save
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
        const result = await deleteUserToEvent({
          user_id: userId,
          event_id: event.id,
        });
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

  const style = TYPE_STYLE[event.type ?? ''];
  const canAdd = userId && ADDABLE_TYPES.has(event.type ?? '');

  return (
    <div
      className="rounded-xl border border-[#9EE7E5]/60 text-xs overflow-hidden animate-hackbot-slide-in"
      style={{ backgroundColor: style?.bg ?? '#FAFAFF' }}
    >
      {/* Event name — full width */}
      <div
        className="px-3 pt-2.5 pb-1"
        style={{ color: style?.text ?? '#005271' }}
      >
        <p className="font-semibold leading-snug">{event.name}</p>
      </div>

      {/* Two-column body */}
      <div
        className="px-3 pb-1.5 flex gap-2 min-w-0"
        style={{ color: style?.text ?? '#003D3D' }}
      >
        {/* Left: datetime, location, tags */}
        <div className="flex-1 min-w-0 space-y-1 space-between">
          {event.start && (
            <p className="text-xs opacity-80">
              {event.start}
              {event.end ? ` - ${event.end}` : ''}
            </p>
          )}
          {event.location && (
            <p className="text-xs opacity-80 flex items-center gap-1">
              <HiLocationMarker className="shrink-0 w-3 h-3" />
              <span className="truncate">{event.location}</span>
            </p>
          )}
          {event.tags.length > 0 && (
            <div className="flex flex-wrap gap-1 pt-0.5">
              {event.tags.map((tag) => (
                <span
                  key={tag}
                  className="text-xs px-1.5 py-0.5 rounded-full font-medium"
                  style={{
                    backgroundColor: style ? style.text + '15' : '#00527115',
                    color: style?.text ?? '#005271',
                    border: `1px solid ${style?.text ?? '#005271'}25`,
                  }}
                >
                  {TAG_LABEL[tag] ?? tag}
                </span>
              ))}
            </div>
          )}
        </div>

        {/* Right: type badge, hosted by, recommended */}
        <div className="shrink-0 flex flex-col items-end gap-1.5 pt-0.5 space-between">
          {style && (
            <span
              className="text-xs px-1.5 py-0.5 rounded-full font-semibold uppercase tracking-wide border whitespace-nowrap"
              style={{
                borderColor: style.text + '40',
                color: style.text,
              }}
            >
              {style.label}
            </span>
          )}
          {event.host && (
            <p
              className="text-xs opacity-60 text-right leading-tight"
              // style={{ maxWidth: '100px' }}
            >
              {event.host}
            </p>
          )}
          {event.isRecommended && (
            <p
              className="text-xs font-semibold flex items-center gap-0.5 whitespace-nowrap"
              style={{ color: '#A07000' }}
            >
              <PiStarFourFill className="w-2.5 h-2.5 shrink-0" />
              Recommended
            </p>
          )}
        </div>
      </div>

      {/* Actions */}
      <div
        className="px-3 py-2 flex items-center gap-2 border-t"
        style={{ borderColor: (style?.text ?? '#005271') + '18' }}
      >
        <a
          href="/schedule"
          className="text-xs font-semibold underline underline-offset-2 hover:opacity-70 transition-opacity"
          style={{ color: '#005271' }}
        >
          View Schedule
        </a>
        {canAdd && (
          <button
            type="button"
            onClick={handleAdd}
            disabled={adding}
            className="ml-auto text-xs px-2.5 py-1 rounded-full font-semibold border transition-colors disabled:cursor-default group/addbtn"
            style={
              added
                ? {
                    backgroundColor: '#005271',
                    color: '#fff',
                    borderColor: '#005271',
                  }
                : addError
                ? {
                    backgroundColor: '#fee2e2',
                    color: '#991b1b',
                    borderColor: '#fca5a5',
                  }
                : {
                    backgroundColor: 'white',
                    color: '#005271',
                    borderColor: '#9EE7E5',
                  }
            }
          >
            {adding ? (
              '…'
            ) : addError ? (
              'Retry'
            ) : added ? (
              <>
                <span className="inline-flex items-center gap-1 group-hover/addbtn:hidden">
                  <span
                    aria-hidden
                    className="inline-block w-2.5 h-2.5"
                    style={{
                      backgroundColor: 'currentColor',
                      WebkitMaskImage: "url('/icons/check.svg')",
                      WebkitMaskRepeat: 'no-repeat',
                      WebkitMaskPosition: 'center',
                      WebkitMaskSize: 'contain',
                      maskImage: "url('/icons/check.svg')",
                      maskRepeat: 'no-repeat',
                      maskPosition: 'center',
                      maskSize: 'contain',
                    }}
                  />
                  Added
                </span>
                <span
                  className="hidden group-hover/addbtn:inline-flex items-center gap-1"
                  style={{ color: '#fca5a5' }}
                >
                  Remove
                </span>
              </>
            ) : (
              <span className="inline-flex items-center gap-1">
                <span
                  aria-hidden
                  className="inline-block w-2.5 h-2.5"
                  style={{
                    backgroundColor: 'currentColor',
                    WebkitMaskImage: "url('/icons/plus.svg')",
                    WebkitMaskRepeat: 'no-repeat',
                    WebkitMaskPosition: 'center',
                    WebkitMaskSize: 'contain',
                    maskImage: "url('/icons/plus.svg')",
                    maskRepeat: 'no-repeat',
                    maskPosition: 'center',
                    maskSize: 'contain',
                  }}
                />
                Add
              </span>
            )}
          </button>
        )}
      </div>
    </div>
  );
}
