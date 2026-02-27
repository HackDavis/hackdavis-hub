'use client';

import { useState } from 'react';
import { HiLocationMarker } from 'react-icons/hi';
import { PiStarFourFill } from 'react-icons/pi';
import { createUserToEvent } from '@actions/userToEvents/createUserToEvent';
import type { HackbotEvent } from './HackbotWidget';

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
    if (!userId || adding || added) return;
    setAdding(true);
    setAddError(false);
    try {
      const result = await createUserToEvent(userId, event.id);
      if (!result.ok) throw new Error(result.error ?? 'Failed');
      setAdded(true);
    } catch {
      setAddError(true);
    }
    setAdding(false);
  };

  const style = TYPE_STYLE[event.type ?? ''];
  const canAdd = userId && ADDABLE_TYPES.has(event.type ?? '');

  return (
    <div
      className="rounded-xl border border-[#9EE7E5]/60 text-xs space-y-1.5 overflow-hidden"
      style={{ backgroundColor: style?.bg ?? '#FAFAFF' }}
    >
      {/* Coloured header strip */}
      <div
        className="px-3 py-2 flex items-start justify-between gap-2"
        style={{ color: style?.text ?? '#005271' }}
      >
        <p className="font-semibold leading-snug">{event.name}</p>
        {style && (
          <span
            className="shrink-0 text-[9px] px-1.5 py-0.5 rounded-full font-semibold uppercase tracking-wide border"
            style={{
              borderColor: style.text + '40',
              color: style.text,
            }}
          >
            {style.label}
          </span>
        )}
      </div>

      {/* Details */}
      <div
        className="px-3 pb-2 space-y-1"
        style={{ color: style?.text ?? '#003D3D' }}
      >
        {event.start && (
          <p className="text-[10px] opacity-80 flex items-center gap-1">
            {event.start}
            {event.end ? ` – ${event.end}` : ''}
          </p>
        )}
        {event.location && (
          <p className="text-[10px] opacity-80 flex items-center gap-1 truncate">
            <HiLocationMarker className="shrink-0 w-3 h-3" />
            <span className="truncate">{event.location}</span>
          </p>
        )}
        {event.host && (
          <p className="text-[10px] opacity-60 truncate">
            Hosted by {event.host}
          </p>
        )}

        {/* Tags */}
        {event.tags.length > 0 && (
          <div className="flex flex-wrap gap-1 pt-0.5">
            {event.tags.map((tag) => (
              <span
                key={tag}
                className="text-[9px] px-1.5 py-0.5 rounded-full font-medium"
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

        {/* Recommended badge */}
        {event.isRecommended && (
          <p
            className="text-[9px] font-semibold flex items-center gap-1"
            style={{ color: '#A07000' }}
          >
            <PiStarFourFill className="w-3 h-3" />
            Recommended for you
          </p>
        )}

        {/* Actions */}
        <div className="flex items-center gap-2 pt-1">
          <a
            href="/schedule"
            className="text-[10px] font-semibold underline underline-offset-2 hover:opacity-70 transition-opacity"
            style={{ color: '#005271' }}
          >
            View Schedule →
          </a>
          {canAdd && (
            <button
              type="button"
              onClick={handleAdd}
              disabled={added || adding}
              className="text-[10px] px-2.5 py-1 rounded-full font-semibold border transition-colors disabled:cursor-default"
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
              {added ? '✓ Added' : adding ? '…' : addError ? 'Retry' : '+ Add'}
            </button>
          )}
        </div>
      </div>
    </div>
  );
}
