# Judge & Mentor Invite System Documentation

---

## Overview

The invite system allows admins to send email invitations to **judges** and **mentors** -- both individually and in bulk via CSV upload.

- **Judges** receive an HMAC-signed Hub invite link to create their judge account on the HackDavis Hub
- **Mentors** receive a Tito e-ticket link for event check-in (no Hub account needed)

**Admin UI:** `/admin/invites`

---

## Architecture

### Judge Invite Flow

```
Admin UI
  --> sendSingleJudgeHubInvite (server action)
        1. Check for duplicate user (GetManyUsers by email)
        2. GenerateInvite (HMAC-signed link)
        3. Send email via nodemailer (judgeHubInviteTemplate)

  --> sendBulkJudgeHubInvites (server action)
        1. parseInviteCSV
        2. Batch duplicate check (GetManyUsers with $in)
        3. processBulkInvites -> sendSingleJudgeHubInvite (skip dup check)
```

### Mentor Invite Flow

```
Admin UI
  --> sendSingleMentorInvite (server action)
        1. getOrCreateTitoInvitation (Tito API with duplicate recovery)
        2. Send email via nodemailer (mentorInviteTemplate)

  --> sendBulkMentorInvites (server action)
        1. parseInviteCSV
        2. processBulkInvites -> per mentor:
             a. Tito invitation (concurrency: 20)
             b. Send email (concurrency: 10)
```

---

## HMAC Invite Link Generation

### `app/(api)/_datalib/invite/generateInvite.ts`

Generates a tamper-proof, time-limited invite URL for judges.

**Steps:**

1. Validates email (zod) and role (`'hacker'` or `'judge'`)
2. Sets expiration:
   - **Invite links:** expire at `INVITE_DEADLINE` env var (a fixed date)
   - **Password reset links:** expire after 1 day
3. Base64-encodes the invite data (email, name, role, exp)
4. Signs with HMAC-SHA256 using `HMAC_INVITE_SECRET` env var
5. Returns URL: `{BASE_URL}/{type}/{base64_data}&{hmac_signature}`

**Returns:** `{ ok, body: hmacUrl, error }`

### `app/(api)/_utils/invite/hmac.tsx`

Two functions:

- **`generateHMACSignature(data)`** -- creates HMAC-SHA256 hex digest using `HMAC_INVITE_SECRET`
- **`verifyHMACSignature(data, signature)`** -- timing-safe comparison + expiration check. Returns `false` if signature doesn't match or if `exp` has passed.

---

## Email Infrastructure

### Transporter: `app/(api)/_actions/emails/transporter.ts`

Shared nodemailer transporter configured for Gmail:

- Connection pooling: `pool: true`, `maxConnections: 10`, `maxMessages: Infinity`
- Auth: `SENDER_EMAIL` + `SENDER_PWD` env vars
- Fails at module load if env vars are missing
- Exports `transporter` and `DEFAULT_SENDER`

### Concurrency Limiter: `app/(api)/_actions/emails/createLimiter.ts`

A generic async concurrency limiter that controls how many async operations can run simultaneously.

**How it works:**

`createLimiter(concurrency)` returns a `run<T>(fn: () => Promise<T>): Promise<T>` function. Internally it tracks:

- `active` -- count of currently executing calls
- `queue` -- array of resolve callbacks waiting for a slot

When `run(fn)` is called:

1. If `active >= concurrency`, the caller awaits a Promise that gets pushed onto the queue (it blocks until a slot opens)
2. Once a slot is available, `active` is incremented and `fn()` executes
3. In the `finally` block (whether fn resolves or rejects), `active` is decremented and the next queued callback is shifted off and resolved -- immediately filling the freed slot

This means the pool stays as full as possible with no batch-boundary idle time. Unlike chunked approaches (e.g., "process 10, wait, process 10"), a new task starts the instant any previous task finishes.

**How parallelism is structured in bulk invites:**

Both bulk flows use `processBulkInvites`, which calls `Promise.allSettled` on all items at once. This means all items are "launched" immediately -- but the limiter gates how many actually execute concurrently.

**Judge bulk** uses a single limiter:

```
processBulkInvites(csvText, { concurrency: 10, processOne: ... })
  --> createLimiter(10) inside processBulkInvites
  --> all items go through one pool of 10 concurrent slots
  --> each slot: duplicate check + HMAC generation + email send (sequential per item)
```

**Mentor bulk** uses two independent limiters for pipeline parallelism:

```
const titoLimiter = createLimiter(20);   // Tito API calls
const emailLimiter = createLimiter(10);  // email sends

processOne(mentor):
  1. await titoLimiter(() => getOrCreateTitoInvitation(...))
     // Tito slot is released immediately after this resolves
  2. await emailLimiter(() => transporter.sendMail(...))
     // Email slot is independent from Tito slot
```

This two-limiter design means:

- Up to 20 Tito API calls can be in-flight at once
- Up to 10 emails can be sending at once
- A mentor's Tito slot is freed before their email starts, so another mentor's Tito call can begin while the first mentor's email is still sending
- The two stages overlap across different mentors, maximizing throughput

Note: `processBulkInvites` also accepts an optional `concurrency` param that creates an *outer* limiter wrapping the entire `processOne` call. Judge bulk uses this (concurrency: 10). Mentor bulk does NOT use the outer limiter -- it manages concurrency internally with the two separate limiters instead.

---

## CSV Parsing

### `app/(api)/_actions/emails/parseInviteCSV.ts`

Server-side CSV parser for invite CSVs. Uses `csv-parse/sync` + zod.

**Expected format:** 3 columns -- `First Name, Last Name, Email`

**Behavior:**

- Auto-detects and skips header row (looks for "first" or "email" in first row)
- Validates each row: requires 3 columns, non-empty first/last name, valid email (zod)
- Fails on first batch of errors (all errors collected, then returned together)
- Returns `{ ok: true, body: InviteData[] }` or `{ ok: false, error: string }`

> **Note:** Client components use a separate inline browser-safe CSV parser for preview (simple comma-split, no Node.js deps). Full validation runs server-side.

---

## Generic Bulk Processing

### `app/(api)/_actions/emails/processBulkInvites.ts`

Reusable generic function for bulk invite workflows. Both judge and mentor bulk flows use this.

**`processBulkInvites<TData, TResult>(csvText, config)`**

Config options:

| Option | Description |
| --- | --- |
| `label` | Name for logging (e.g., `'Judge'`, `'Mentor'`) |
| `preprocess?` | Optional async function to filter items before processing (e.g., batch duplicate check). Returns `{ remaining, earlyResults }` |
| `processOne` | Async function to process a single item |
| `concurrency?` | Optional concurrency limit (uses `createLimiter`) |

**Pipeline:**

1. Parse CSV via `parseInviteCSV`
2. Run optional `preprocess` (e.g., judge bulk does a batch `GetManyUsers` to find existing emails upfront)
3. Process all remaining items via `processOne` with `Promise.allSettled` + optional concurrency limiter
4. Collect results, count successes/failures

**Returns:** `BulkInviteResponse<TResult>` -- `{ ok, results, successCount, failureCount, error }`

---

## Judge Invites

### Single: `app/(api)/_actions/emails/sendSingleJudgeHubInvite.ts`

Server action (`'use server'`).

**Steps:**

1. **Duplicate check** (skippable via `skipDuplicateCheck` param): queries `GetManyUsers({ email })`. Throws `DuplicateError` if user exists
2. **Generate invite link**: calls `GenerateInvite({ email, name, role: 'judge' }, 'invite')` to get HMAC-signed URL
3. **Send email**: uses `transporter.sendMail` with `judgeHubInviteTemplate(firstName, inviteLink)`

**Returns:** `SingleJudgeInviteResponse` -- `{ ok, inviteUrl?, error }`

### Bulk: `app/(api)/_actions/emails/sendBulkJudgeHubInvites.ts`

Server action. Uses `processBulkInvites` with:

- **`preprocess`:** Batch duplicate check -- fetches all existing users with `GetManyUsers({ email: { $in: allEmails } })`. Emails already in the DB are returned as early failures ("User already exists."). This avoids N+1 queries
- **`processOne`:** Calls `sendSingleJudgeHubInvite(judge, true)` -- the `true` skips the per-item duplicate check since it was handled in preprocess
- **Concurrency:** 10

### Email Template: `emailTemplates/2026JudgeHubInviteTemplate.ts`

- **Subject:** `[ACTION REQUIRED] HackDavis 2026 Judging App Invite`
- **Content:** Welcome message, meeting recording link, judging guide link, bordered section with the Hub invite link, optional Discord section
- **Parameters:** `fname` (first name), `inviteLink` (HMAC URL)
- Uses `BASE_URL` env var for header/footer images

---

## Mentor Invites

Mentor invites differ from judge invites in a key way: instead of an HMAC Hub link, mentors receive a **Tito e-ticket URL** for event check-in.

### Single: `app/(api)/_actions/emails/sendSingleMentorInvite.ts`

Server action.

**Steps:**

1. **Create Tito invitation**: calls `getOrCreateTitoInvitation({ firstName, lastName, email, rsvpListSlug, releaseIds })`
2. **Send email**: uses `transporter.sendMail` with `mentorInviteTemplate(firstName, titoUrl)`

**Returns:** `SingleMentorInviteResponse` -- `{ ok, titoUrl?, error }`

### Bulk: `app/(api)/_actions/emails/sendBulkMentorInvites.ts`

Server action. Uses `processBulkInvites` with:

- **No `preprocess`:** Unlike judges, there's no batch duplicate check -- Tito handles duplicates via `getOrCreateTitoInvitation`
- **`processOne`:** Two-stage pipeline per mentor:
  1. **Stage 1 (Tito):** Create invitation via `titoLimiter` (concurrency: 20). Tito slot is released before email starts
  2. **Stage 2 (Email):** Send email via `emailLimiter` (concurrency: 10)
- The two limiters are independent -- Tito API calls and email sends can overlap

**Fails fast** if `DEFAULT_SENDER` is not set (no point creating Tito invitations if email can't send).

### Email Template: `emailTemplates/2026MentorInviteTemplate.ts`

- **Subject:** `[ACTION REQUIRED] HackDavis 2026 Mentor Invite`
- **Content:** Welcome message, meeting recording link, slides link, bordered section with Tito ticket link + claim deadline, bordered section with Discord + instructions to DM for Mentor role
- **Parameters:** `fname` (first name), `titoUrl` (Tito ticket URL)

---

## Tito Integration

### Client: `app/(api)/_actions/tito/titoClient.ts`

Generic Tito API v3 wrapper.

- Base URL: `https://api.tito.io/v3/{TITO_ACCOUNT_SLUG}/{TITO_EVENT_SLUG}`
- Auth: `Token token={TITO_API_TOKEN}` header
- Handles 204 No Content (DELETE responses)
- Attaches `Retry-After` header value to errors for rate limit handling
- **Env vars:** `TITO_API_TOKEN`, `TITO_ACCOUNT_SLUG`, `TITO_EVENT_SLUG`

### `getOrCreateTitoInvitation.ts`

Wrapper that creates a Tito invitation with **duplicate recovery**:

1. Try `createRsvpInvitation(data)`
2. If duplicate error detected (checked via `isDuplicateTicketError` -- matches various Tito error messages):
   - Try to **reuse** the existing invitation URL via `getRsvpInvitationByEmail`
   - If no usable URL found, **delete** the existing invitation and **recreate**
3. Return the `unique_url` (or `url`) from the response

This makes the flow idempotent -- re-running bulk invites for the same emails won't fail.

### `createRsvpInvitation.ts`

Creates a release invitation on a Tito RSVP list.

- Parses comma-separated `releaseIds` string into integer array
- Sends POST to `/rsvp_lists/{slug}/release_invitations`
- **Rate limit retry:** On 429 responses, retries up to 5 times with exponential backoff (respects `Retry-After` header)
- Optional `discountCode` support

### `getRsvpInvitationByEmail.ts`

Finds an existing invitation by email in a Tito RSVP list.

- Paginates through all invitations (page size: 1000)
- Case-insensitive email matching

### `deleteRsvpInvitationByEmail.ts`

Deletes an existing invitation by email.

- First finds the invitation slug via pagination (same as get)
- Then sends DELETE to `/rsvp_lists/{slug}/release_invitations/{invitationSlug}`

### `getRsvpLists.ts` / `getReleases.ts`

Read-only helpers that fetch available RSVP lists and releases from Tito. Used by the mentor admin UI to populate the RSVP list dropdown and release checkboxes.

---

## Admin UI

### Page: `app/(pages)/admin/invites/page.tsx`

Tab bar with two tabs: **Judges** and **Mentors**.

### Judges Tab

Two sections:

**"Invite a Judge" -- `JudgeSingleInviteForm.tsx`**

- Form: First Name, Last Name, Email
- Calls `sendSingleJudgeHubInvite` directly
- On success: displays the generated invite URL
- On error: displays error message (e.g., "User with email X already exists.")

**"Bulk Invite Judges" -- `JudgeBulkInviteForm.tsx`**

- Upload CSV -> browser-side preview (table) -> "Send N Invites" button
- Calls `sendBulkJudgeHubInvites(csvText)` -- sends raw CSV text to server
- States: `idle` -> `previewing` -> `sending` -> `done`
- Results: success/failure count cards + scrollable list of failed invites
- "Send another batch" link to reset

### Mentors Tab -- `MentorInvitesPanel.tsx`

On mount, fetches RSVP lists and releases from Tito API (`getRsvpLists`, `getReleases`). Shows loading spinner while fetching.

Sub-toggle: **Single Invite** / **Bulk Invite (CSV)**

**Single -- `MentorSingleInviteForm.tsx`**

- Form: First Name, Last Name, Email + RSVP List dropdown + Release checkboxes (with Select all/Deselect all)
- Calls `sendSingleMentorInvite` with the selected RSVP list slug and comma-joined release IDs
- On success: displays the Tito URL

**Bulk -- `MentorBulkInviteForm.tsx`**

- Upload CSV -> preview table -> configure RSVP list + releases -> "Send N Invites"
- Calls `sendBulkMentorInvites(csvText, rsvpListSlug, releaseIds)`
- Results: success/failure count + failed invites list
- **"Download Results CSV"** button -- generates a CSV with columns: Email, First Name, Last Name, Tito Invite URL, Success, Notes (uses `generateInviteResultsCSV` utility)
- "Send another batch" link to reset

### Results CSV Export: `app/(pages)/admin/_utils/generateInviteResultsCSV.ts`

Generates a downloadable CSV from bulk invite results. Properly escapes cells (handles quotes). Optional `includeHub` column for flows that include a Hub URL.

---

## Types

### `app/_types/emails.ts`

| Type | Description |
| --- | --- |
| `InviteData` | Base: `{ firstName, lastName, email }` |
| `InviteResult` | Base: `{ email, success, error? }` |
| `BulkInviteResponse<R>` | `{ ok, results: R[], successCount, failureCount, error }` |
| `JudgeInviteData` | Alias for `InviteData` |
| `JudgeInviteResult` | Extends `InviteResult` + `inviteUrl?` |
| `SingleJudgeInviteResponse` | `{ ok, inviteUrl?, error }` |
| `MentorInviteData` | Alias for `InviteData` |
| `MentorInviteResult` | Extends `InviteResult` + `titoUrl?` |
| `SingleMentorInviteResponse` | `{ ok, titoUrl?, error }` |

### `app/_types/tito.ts`

| Type | Description |
| --- | --- |
| `RsvpList` | `{ id, slug, title, release_ids?, question_ids?, activity_ids? }` |
| `Release` | `{ id, slug, title, quantity? }` |
| `ReleaseInvitation` | `{ id, slug, email, first_name, last_name, url?, unique_url?, created_at }` |
| `ReleaseInvitationRequest` | `{ firstName, lastName, email, rsvpListSlug, releaseIds (comma-separated), discountCode? }` |
| `TitoResponse<T>` | `{ ok, body: T | null, error }` |

### `app/_types/inviteData.ts`

`InviteData` (for HMAC generation): `{ email, name?, role, exp? }`

---

## Environment Variables

| Variable | Used by | Description |
| --- | --- | --- |
| `SENDER_EMAIL` | transporter | Gmail sender address |
| `SENDER_PWD` | transporter | Gmail app password |
| `BASE_URL` | generateInvite, email templates | Site base URL for invite links and images |
| `HMAC_INVITE_SECRET` | hmac.tsx | Secret for signing invite links |
| `INVITE_DEADLINE` | generateInvite | Expiration date for invite links |
| `TITO_API_TOKEN` | titoClient | Tito API authentication token |
| `TITO_ACCOUNT_SLUG` | titoClient | Tito account slug |
| `TITO_EVENT_SLUG` | titoClient | Tito event slug |

---

## File Index

| File | Purpose |
| --- | --- |
| `app/(pages)/admin/invites/page.tsx` | Admin invites page (Judges/Mentors tabs) |
| `app/(pages)/admin/_components/JudgeInvites/JudgeSingleInviteForm.tsx` | Single judge invite form |
| `app/(pages)/admin/_components/JudgeInvites/JudgeBulkInviteForm.tsx` | Bulk judge CSV upload + send |
| `app/(pages)/admin/_components/MentorInvites/MentorInvitesPanel.tsx` | Mentor panel (loads Tito config, toggles single/bulk) |
| `app/(pages)/admin/_components/MentorInvites/MentorSingleInviteForm.tsx` | Single mentor invite form |
| `app/(pages)/admin/_components/MentorInvites/MentorBulkInviteForm.tsx` | Bulk mentor CSV upload + send + results CSV download |
| `app/(pages)/admin/_utils/generateInviteResultsCSV.ts` | CSV export utility for invite results |
| `app/(api)/_actions/emails/transporter.ts` | Shared nodemailer transporter (Gmail, pooled) |
| `app/(api)/_actions/emails/createLimiter.ts` | Async concurrency limiter |
| `app/(api)/_actions/emails/parseInviteCSV.ts` | Server-side CSV parser (csv-parse/sync + zod) |
| `app/(api)/_actions/emails/processBulkInvites.ts` | Generic bulk invite processor |
| `app/(api)/_actions/emails/sendSingleJudgeHubInvite.ts` | Single judge invite action |
| `app/(api)/_actions/emails/sendBulkJudgeHubInvites.ts` | Bulk judge invite action |
| `app/(api)/_actions/emails/sendSingleMentorInvite.ts` | Single mentor invite action |
| `app/(api)/_actions/emails/sendBulkMentorInvites.ts` | Bulk mentor invite action |
| `app/(api)/_actions/emails/emailTemplates/2026JudgeHubInviteTemplate.ts` | Judge email HTML template |
| `app/(api)/_actions/emails/emailTemplates/2026MentorInviteTemplate.ts` | Mentor email HTML template |
| `app/(api)/_datalib/invite/generateInvite.ts` | HMAC-signed invite link generator |
| `app/(api)/_utils/invite/hmac.tsx` | HMAC sign + verify functions |
| `app/(api)/_actions/tito/titoClient.ts` | Tito API v3 wrapper |
| `app/(api)/_actions/tito/getOrCreateTitoInvitation.ts` | Create Tito invitation with duplicate recovery |
| `app/(api)/_actions/tito/createRsvpInvitation.ts` | Create RSVP invitation (with rate limit retry) |
| `app/(api)/_actions/tito/getRsvpInvitationByEmail.ts` | Find existing invitation by email |
| `app/(api)/_actions/tito/deleteRsvpInvitationByEmail.ts` | Delete invitation by email |
| `app/(api)/_actions/tito/getRsvpLists.ts` | Fetch Tito RSVP lists |
| `app/(api)/_actions/tito/getReleases.ts` | Fetch Tito releases |
| `app/_types/emails.ts` | Email/invite TypeScript types |
| `app/_types/tito.ts` | Tito TypeScript types |
| `app/_types/inviteData.ts` | HMAC invite data type |
