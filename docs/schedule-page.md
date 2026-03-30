# Schedule Page Documentation

> This document covers the **schedule page UI and user-facing behavior**. For the full scheduling system architecture (hooks, utilities, sneak peek widget), see [scheduling-system.md](./scheduling-system.md).

---

## Page: `app/(pages)/(hackers)/(hub)/schedule/page.tsx`

**URL:** `/schedule`

A client-side rendered page that displays the full event schedule for HackDavis, with two tabs (All Events / Personal) and type-based filtering.

---

## Page Layout

```
+----------------------------------------------------------+
|  [Header grass SVG - decorative, absolute positioned]    |
+----------------------------------------------------------+
|  [All Events]  [Personal]              (tab bar)         |
|  --------------------------------------------------------|
|  [Filters]  (desktop: horizontal chips)                  |
|  [MAY 9]                                                 |
|  [MAY 10]   (desktop: vertical sticky sidebar)           |
|  --------------------------------------------------------|
|  [DaySection: May 9]                                     |
|    [Time Group: 9:00 AM]                                 |
|      [CalendarItem] [CalendarItem] ...                   |
|    [Time Group: 10:00 AM]                                |
|      [CalendarItem] ...                                  |
|  [DaySection: May 10]                                    |
|    ...                                                   |
+----------------------------------------------------------+
|  [Footer]                                                |
+----------------------------------------------------------+
```

**Mobile layout differences:**

- Filter button (hamburger icon) replaces horizontal chips
- Day nav buttons float in top-right with glassmorphism on scroll
- Filter menu expands vertically when opened

---

## User Interactions

### Tab Switching

| Tab            | Data Source                                     | Behavior                                                                          |
| -------------- | ----------------------------------------------- | --------------------------------------------------------------------------------- |
| **All Events** | All events from `useEvents`                     | Shows every event; personal schedule membership indicated by "Added" button state |
| **Personal**   | User's personal events from `usePersonalEvents` | Shows only events the user has added; refreshes on tab switch                     |

The "Personal" tab has a tooltip (cow icon + "Make your own schedule by adding events!") that appears on hover.

### Filtering

Filters are exclusive within types but additive across types:

- **ALL** (default) -- shows everything; selecting any other filter deselects ALL
- **WORKSHOPS**, **ACTIVITIES**, **MEALS**, **GENERAL**, **RECOMMENDED** -- event type filters
- Selecting multiple type filters shows the union of those types
- Deselecting all type filters reverts to ALL

### Day Navigation

- Clicking a day button scrolls to that day's section smoothly
- Scrolling updates the active day indicator automatically
- 900ms lock after clicking prevents scroll from overriding the selection

### Adding/Removing Events

- Click "Add" on a `CalendarItem` -> `handleAddToSchedule(eventId)`
- Click "Added" on a `CalendarItem` -> `handleRemoveFromSchedule(eventId)`
- `GENERAL` and `MEALS` events do not have add/remove buttons
- Attendee count (shown on `WORKSHOPS` only) updates after add/remove
- Admin users cannot add to personal schedule

---

## Loading & Error States

| State                               | UI                                              |
| ----------------------------------- | ----------------------------------------------- |
| Initial load (`isInitialLoad`)      | "loading..." text                               |
| Error (`isError`)                   | Full-screen "Oops, an error occurred!"          |
| Personal tab, no events             | CTA: "Browse the schedule to add events" button |
| Schedule tab, no events for filters | "No events found for this day and filter(s)."   |

---

## Responsive Behavior

| Feature         | Mobile (<768px)                      | Desktop (>=768px)                 |
| --------------- | ------------------------------------ | --------------------------------- |
| Filter controls | Hamburger button, vertical pill list | Horizontal scrollable chips       |
| Day navigation  | Floating top-right, glassmorphism bg | Sticky left sidebar, vertical     |
| Grid layout     | Single column                        | 2-column grid (sidebar + content) |
| Tab text        | Centered, 50/50 width                | Left-aligned, auto width          |

---

## Key CSS Details

- Page background: `#FAFAFF`
- Header grass: absolutely positioned, `z-30`, `pointer-events-none`
- Content area: `z-10`, 90% width, centered
- Day sections: `scroll-mt-24` for scroll-to offset
- Mobile filter/day nav: `sticky top-10 z-20`
- Desktop day nav: `sticky top-20`

---

## Data Flow Summary

```
page.tsx
  |
  +-- useScheduleData()
  |     |-- useActiveUser('/') ......... authenticated user
  |     |-- useEvents(user) ............ GET /api/events
  |     |-- usePersonalEvents(id) ...... GET/POST/DELETE /api/personal-events
  |     |-- buildGroupedEntriesByDay ... sort + group + filter
  |     |-- useActiveDaySync ........... scroll <-> day tab
  |     +-- returns: tabs, filters, grouped data, handlers
  |
  +-- ScheduleControls(activeDay, filters, ...)
  |     |-- DayNavButtons
  |     +-- Filters (desktop) / mobile filter menu
  |
  +-- DaySection(dayKey, entries, activeTab, ...)
        +-- CalendarItem(event, attendeeCount, inPersonalSchedule, ...)
```
