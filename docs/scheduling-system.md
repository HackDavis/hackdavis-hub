# Scheduling System Documentation

**Owner:** Sandeep Reehal
**Live URL:** https://staging-hub.hackdavis.io/schedule

> **Note:** `admin` users cannot add events to their personal schedule, so the attendee count (# of hackers) does not increment for admins.

---

## Architecture Overview

The scheduling system consists of three layers:

1. **Data & State** -- hooks that fetch events, manage personal schedules, and expose reactive state
2. **Grouping & Time Logic** -- pure utilities that sort, group, and determine liveness of events
3. **UI Components** -- page-level and widget-level components that render schedule data

```
schedule/page.tsx
  --> useScheduleData (central state hook)
        --> useEvents, usePersonalEvents (SWR-based fetching)
        --> buildGroupedEntriesByDay (grouping logic)
        --> useActiveDaySync (scroll <-> tab sync)
  --> ScheduleControls, DaySection, CalendarItem (UI)

HomeHacking/ScheduleSneakPeek.tsx
  --> useScheduleSneakPeekData (sneak peek state hook)
        --> useEvents, usePersonalEvents
        --> useSharedNow (real-time clock)
        --> isScheduleEventLive (liveness check)
```

---

## Data Fetching & State Management

### Central Hook: `app/(pages)/_hooks/useScheduleData.ts`

All schedule state and data fetching is centralized in `useScheduleData()`. It returns everything the schedule page needs.

**Returned interface (`UseScheduleDataResult`):**

| Field | Type | Description |
|---|---|---|
| `activeTab` | `'schedule' \| 'personal'` | Current tab (All Events vs Personal) |
| `activeDay` | `DayKey` | Currently active day (`'9'` or `'10'`) |
| `activeFilters` | `ScheduleFilter[]` | Active filter chips (default: `['ALL']`) |
| `groupedEntriesByDay` | `Record<DayKey, GroupedDayEntries>` | Events grouped by day, then by time slot |
| `handleAddToSchedule` | `(eventId: string) => Promise<void>` | Add event to personal schedule |
| `handleRemoveFromSchedule` | `(eventId: string) => Promise<void>` | Remove event from personal schedule |
| `isInitialLoad` | `boolean` | True during first data load |
| `isError` | `boolean` | True if any fetch error occurred |
| `changeActiveDay` | `(day: DayKey) => void` | Programmatic day change (scrolls + updates tab) |

**Data flow:**

1. `useActiveUser('/')` -- gets the authenticated user
2. `useEvents(user)` -- GET all events with attendee counts
3. `usePersonalEvents(user._id)` -- GET user's personal schedule; provides `addToPersonalSchedule()` / `removeFromPersonalSchedule()`
4. Events are grouped by Pacific timezone day key via `getDayKeyInPacific(date)` into a `ScheduleData` map
5. `buildGroupedEntriesByDay()` further groups events by time slot and applies active filters

**Optimistic UI:**

`patchScheduleMembership(eventId, inPersonalSchedule)` updates local state immediately on add/remove, then calls `refreshEvents()` to sync with the server. This avoids a loading flash when toggling personal schedule membership.

**Tab switching:**

When switching to the `'personal'` tab, `refreshPersonalEvents()` is called to ensure fresh data. The `personalScheduleData` memo rebuilds the grouped structure from `personalEvents`.

**Dependencies (if any of these break, `useScheduleData` breaks too):**

- `useActiveDaySync` -- scroll/tab sync
- `buildGroupedEntriesByDay` -- grouping logic
- `useEvents` -- event data fetching
- `usePersonalEvents` -- personal schedule CRUD

---

## Event Ordering, Grouping & End Time Logic

### `app/(pages)/(hackers)/_components/Schedule/groupedEntries.ts`

Two exported functions:

#### `getGroupedEntriesForDay(dayKey, dataToUse, activeFilters)`

1. Retrieves events for the given day from `ScheduleData`
2. Applies active filters (supports `'ALL'`, `'RECOMMENDED'`, and event type filters)
3. Sorts by `start_time` ascending, then `end_time` ascending
4. Events **without** `end_time` (e.g., check-ins) appear **first** within the same start time
5. Groups by localized Pacific time string (e.g., `"3:00 PM"`) for rendering
6. Returns `GroupedDayEntries` (array of `[timeKey, EventDetails[]]` tuples, sorted chronologically)

#### `buildGroupedEntriesByDay(dataToUse, activeFilters)`

Calls `getGroupedEntriesForDay` for each day in `DAY_KEYS`, returning a `Record<DayKey, GroupedDayEntries>`.

### Time Utilities: `app/(pages)/(hackers)/_components/Schedule/scheduleTime.ts`

| Function | Description |
|---|---|
| `formatScheduleTime(date)` | Formats as `"3:00 PM"` |
| `formatScheduleTimeRange(start, end?)` | Formats as `"3:00 - 4:00 PM"` (omits duplicate AM/PM) |
| `getScheduleEventEndTime(event)` | Returns `end_time` or falls back to `start_time + 60 min` |
| `isScheduleEventLive(event, now?)` | True if `start <= now < end` |
| `startsScheduleEventInNextMs(event, ms, now?)` | True if event starts within `ms` milliseconds from now |

---

## Day Constants

### `app/(pages)/(hackers)/_components/Schedule/constants.ts`

```ts
export const DAY_KEYS = ['9', '10'] as const;
export type DayKey = (typeof DAY_KEYS)[number];
export const DAY_LABELS: Record<DayKey, string> = {
  '9': 'MAY 9',
  '10': 'MAY 10',
};
```

---

## Shared Real-Time Clock

### `app/(pages)/_hooks/useScheduleSharedNow.ts`

A singleton `setInterval` (1-second tick) shared across all schedule components via a subscriber pattern.

**How it works:**

- Module-level `subscribers` Set holds callbacks
- When the first component mounts, a single `setInterval` starts
- When the last component unmounts, the interval is cleared
- Prevents redundant intervals when multiple components (e.g., sneak peek countdown timers) need a live "now" value

**Returns:** `number` (current `Date.now()` value, updated every second)

---

## Active Day Sync

### `app/(pages)/_hooks/useActiveDaySync.ts`

Synchronizes the active day tab with the user's scroll position.

**Configuration (via `UseActiveDaySyncOptions`):**

| Option | Default | Description |
|---|---|---|
| `anchorRatio` | `0.45` | Viewport ratio (45% from top) used as the detection anchor |
| `clickLockMs` | `900` | Duration (ms) to ignore scroll events after a manual day click |
| `syncSignal` | -- | When this value changes, triggers a re-sync (used for filter/tab changes) |

**Behavior:**

1. On scroll, determines which `day-{dayKey}` section is at the anchor point
2. Updates `activeDay` state accordingly
3. On manual day click (`changeActiveDay`):
   - Sets a "pending day" and starts a 900ms click lock
   - Calls `scrollIntoView({ behavior: 'smooth', block: 'start' })` on the target section
   - During the lock period, scroll events won't override the pending day
   - Once the target section reaches the anchor point, the lock is released

**`syncSignal` in `useScheduleData`:** A memo of `activeTab:filters:contentHash` that triggers re-sync when content changes shape.

---

## Sneak Peek Widget (Home Page)

### Data Hook: `app/(pages)/_hooks/useScheduleSneakPeekData.ts`

Produces four event buckets for the home page widget:

| Bucket | Description |
|---|---|
| `liveAll` | Currently live events (excluding ones in personal schedule) |
| `upcomingAll` | Events at the single nearest future start time (excluding personal) |
| `livePersonal` | Currently live events from the user's personal schedule |
| `upcomingPersonal` | Next upcoming events from the user's personal schedule |

**Key behaviors:**

- **GENERAL** and **MEALS** events are excluded from the personal schedule bucket (they always appear in "Happening Now" only, since they have no add/remove button)
- `getNextBatchEvents(entries, now)` finds all events at the single nearest future start time -- not all future events, just the next "batch"
- All lists are sorted by `start_time` ascending
- Uses `useSharedNow()` for real-time liveness checks

**Dependencies:** `useEvents`, `usePersonalEvents`, `useSharedNow`, `isScheduleEventLive`

### Component: `app/(pages)/(hackers)/_components/HomeHacking/ScheduleSneakPeek.tsx`

Renders two side-by-side panels: **"Happening now"** and **"Your schedule"**.

**Sub-components:**

| Component | Description |
|---|---|
| `SectionLabel` | Renders a label with optional live indicator dot (pulsing green) |
| `CountdownLabel` | Renders a countdown timer (`IN HH:MM:SS`) to the next event batch start time, powered by `useSharedNow()` |
| `Panel` | Renders one column -- live events section + upcoming event groups with countdown headers |

**Empty states:**

- Live events empty: shows illustration + message (different per panel)
- Upcoming events empty: shows illustration + message + optional CTA button
- "Your schedule" panel has "Add to your schedule" / "Explore events" links to `/schedule`

**Upcoming events are grouped by start time** -- if multiple upcoming events share the same start time, they appear under a single countdown header.

---

## Components Reference

### Schedule Page: `app/(pages)/(hackers)/(hub)/schedule/page.tsx`

The main schedule page. Renders:

1. Header grass image (decorative)
2. Tab bar: "All Events" / "Personal" (with tooltip on Personal tab showing a cow + helper text)
3. `ScheduleControls` -- day navigation + filter controls
4. `DaySection` for each day key, or a loading state

### `ScheduleControls.tsx`

Renders day navigation and filter controls with distinct mobile/desktop layouts.

**Mobile layout:**

- Sticky hamburger filter button (top-left) with colored dots for active filters
- `DayNavButtons` (top-right) with glassmorphism background on scroll
- Filter button opens a full-width vertical list of filter pills
- Filter button and day nav auto-hide/show based on scroll position (`isScrolled` at 110px threshold)

**Desktop layout:**

- `Filters` component (horizontal scrollable filter chips) in the content column
- `DayNavButtons` (vertical, sticky at top-left sidebar)

### `DayNavButtons.tsx`

Renders "MAY 9" / "MAY 10" buttons with:

- Active state: dark text (`#3F3F3F`); inactive: light text (`#ACACB9`)
- Desktop: animated bullet dot on hover/focus (scale + opacity transition)
- Accepts `className` and `buttonClassName` for layout flexibility

### `DaySection.tsx`

Renders one day's events, grouped by time slot.

- Header: day title (e.g., "May 9 Friday") + relative tag ("Today", "Tomorrow", "Yesterday", "Past", "Upcoming")
- Events rendered via `CalendarItem` for each `EventDetails` in each time group
- Empty state for personal tab: CTA button to browse the schedule
- Empty state for schedule tab: "No events found for this day and filter(s)."

### `CalendarItem.tsx`

Individual event card. Behavior varies by event type:

| Event Type | Add/Remove Button | Attendee Count | Host Display | Layout |
|---|---|---|---|---|
| `GENERAL` | No | No | No | Column |
| `MEALS` | No | No | No | Column + "(Subject to change)" |
| `WORKSHOPS` | Yes | Yes (with icon) | Yes | Column |
| `ACTIVITIES` | Yes | No | Yes | Row |
| `RECOMMENDED` | Yes | No | Yes | Column |

**Features:**

- Colored backgrounds per event type (from `scheduleEventStyles.ts`)
- Tags rendered as green pills
- Add button toggles between "Add" (plus icon) and "Added" (check icon)
- Time display via `formatScheduleTimeRange()`

### `Filters.tsx`

Horizontal scrollable filter chip bar (desktop only). Uses `pageFilters` from `@typeDefs/filters`.

- Selected "ALL" filter: dark background
- Selected type filter: colored background matching event type
- Unselected: light gray background

### `scheduleEventStyles.ts`

Maps `EventType` to visual styles:

| Type | Background | Text | Button |
|---|---|---|---|
| `GENERAL` | `#CCFFFE` | `#003D3D` | -- |
| `ACTIVITIES` | `#FFE2D5` | `#52230C` | `#FFD5C2` |
| `WORKSHOPS` | `#E9FBBA` | `#1A3819` | `#D1F76E` |
| `MEALS` | `#FFE7B2` | `#572700` | -- |
| `RECOMMENDED` | `#C0AAE2` | `#003D3D` | -- |

---

## Types

### `app/_types/schedule.ts`

```ts
interface EventDetails {
  event: Event;
  attendeeCount?: number;
  inPersonalSchedule?: boolean;
  isRecommended?: boolean;
}

interface ScheduleData {
  [dayKey: string]: EventDetails[];
}

type GroupedDayEntries = [string, EventDetails[]][];
```

- `ScheduleData` -- events keyed by day (e.g., `{ '9': [...], '10': [...] }`)
- `GroupedDayEntries` -- array of `[timeKey, events[]]` tuples for rendering time-grouped blocks

---

## File Index

| File | Purpose |
|---|---|
| `app/(pages)/(hackers)/(hub)/schedule/page.tsx` | Schedule page |
| `app/(pages)/_hooks/useScheduleData.ts` | Central schedule state hook |
| `app/(pages)/_hooks/useScheduleSneakPeekData.ts` | Sneak peek widget data hook |
| `app/(pages)/_hooks/useScheduleSharedNow.ts` | Shared real-time clock (singleton interval) |
| `app/(pages)/_hooks/useActiveDaySync.ts` | Scroll <-> active day tab sync |
| `app/(pages)/(hackers)/_components/Schedule/groupedEntries.ts` | Event sorting, filtering, and time-slot grouping |
| `app/(pages)/(hackers)/_components/Schedule/scheduleTime.ts` | Time formatting and liveness utilities |
| `app/(pages)/(hackers)/_components/Schedule/scheduleEventStyles.ts` | Event type color/style map |
| `app/(pages)/(hackers)/_components/Schedule/constants.ts` | Day keys and labels |
| `app/(pages)/(hackers)/_components/Schedule/DaySection.tsx` | Day section renderer |
| `app/(pages)/(hackers)/_components/Schedule/ScheduleControls.tsx` | Day nav + filters (mobile/desktop) |
| `app/(pages)/(hackers)/_components/Schedule/DayNavButtons.tsx` | Day selector buttons |
| `app/(pages)/(hackers)/_components/Schedule/CalendarItem.tsx` | Event card component |
| `app/(pages)/(hackers)/_components/Schedule/Filters.tsx` | Desktop filter chip bar |
| `app/(pages)/(hackers)/_components/HomeHacking/ScheduleSneakPeek.tsx` | Home page sneak peek widget |
| `app/_types/schedule.ts` | Schedule-related TypeScript types |
