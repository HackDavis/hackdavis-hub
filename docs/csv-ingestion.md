# CSV Ingestion Documentation

---

## Overview

The CSV ingestion system parses Devpost CSV exports and validates team data (tracks, table numbers, project titles) before bulk-inserting teams into MongoDB. The core logic lives in `csvAlgorithm.ts`.

**Admin UI:** `app/(pages)/admin/csv/page.tsx`

---

## Architecture

```
Admin CSV Page (page.tsx)
  --> validateCSV (server action) --> validateCsvBlob (csvAlgorithm.ts)
  --> ingestTeams (server action) --> CreateManyTeams (datalib)
  --> checkTeamsPopulated (server action) --> MongoDB countDocuments
```

The workflow is two-step:

1. **Validate** -- parse CSV, detect errors/warnings, preview results
2. **Upload** -- insert validated (or all) teams into the database

---

## CSV Algorithm

### `app/(api)/_utils/csv-ingestion/csvAlgorithm.ts`

The core parsing and validation engine. Everything flows through `validateCsvBlob`.

### `validateCsvBlob(blob: Blob)`

**Returns:**

```ts
{
  ok: boolean;              // true if zero error rows
  body: ParsedRecord[];     // all parsed teams (including error rows)
  validBody: ParsedRecord[];// teams without errors only
  report: CsvValidationReport;
  error: string | null;
}
```

**Processing pipeline:**

1. Stream-parse the CSV using `csv-parser`
2. On the `headers` event, locate the `"Team member 1 first name"` column index -- all columns from that index onward are captured per row for contact info display in the validation report
3. For each row, check two preconditions before processing:
   - `Table Number` is non-empty
   - `Project Status` is submitted and non-draft (via `isSubmittedNonDraft` -- case-insensitive, rejects any status containing "draft", requires "submitted")
4. For qualifying rows:
   - **Extract contact info** via `extractContactInfoFromRow` -- scans all columns to collect emails (any column with "email"/"e-mail" in the header) and names (columns with "name" + "contact"/"submitter"/"owner" for contacts, "member"/"teammate"/"participant" for members). Filters out URLs, school/major/diet/shirt/pronoun/role/github/linkedin columns
   - **Parse tracks** from `Track #1 (Primary Track)`, `Track #2`, `Track #3`, and `Opt-In Prizes` columns
   - **Validate and canonicalize** track names (see Track Validation below)
   - **Check for missing fields** (Project Title, Table Number, Tracks)
   - **Check for duplicate table numbers** across rows (tracked via `seenTeamNumbers` Map)
   - Produce issues with `'error'` or `'warning'` severity
5. After all rows are parsed, table numbers are assigned (hardware teams first, then others -- see separate table assignment docs)
6. Error rows are identified by `_rowIndex` (stored on each `ParsedRecord` during parsing, stripped before returning) and excluded from `validBody`

### Row Filtering: `isSubmittedNonDraft`

A row is processed only if its `Project Status` column (case-insensitive):

- Is non-empty
- Does NOT contain "draft"
- DOES contain "submitted"

This filters out incomplete Devpost submissions.

### Contact Info Extraction: `extractContactInfoFromRow`

Scans every column in a row to build four lists:

| Output          | Source columns                                                                                                                                                                 |
| --------------- | ------------------------------------------------------------------------------------------------------------------------------------------------------------------------------ |
| `contactEmails` | Columns with "email" in header AND "contact"/"submitter"/"owner" in header                                                                                                     |
| `contactNames`  | Columns with "name" in header AND "contact"/"submitter"/"owner" in header                                                                                                      |
| `memberEmails`  | All columns with "email" in header                                                                                                                                             |
| `memberNames`   | Columns with "name" in header, or "member"/"teammate"/"participant" columns (excluding school, major, diet, shirt, pronoun, role, github, linkedin, devpost, portfolio, phone) |

This is used for the validation report so admins can contact teams with issues.

### Track Validation

Tracks are validated via case-insensitive exact matching against canonical names from `db_validation_data.json`.

**Filtered tracks** (silently excluded from output): `'Best Hack for Social Good'`, `"Hacker's Choice Award"`, `'N/A'`

**How `matchCanonicalTrack(raw)` works:**

1. Normalize input: trim + lowercase
2. If normalized value is in the filtered set, return `null`
3. Look up in `normalizedToCanonical` map (built at module load from `db_validation_data.json`)
4. Return canonical name if found, `null` otherwise

**Track matching outcomes per row:**

| Scenario                     | Result                                                    |
| ---------------------------- | --------------------------------------------------------- |
| Exact case-insensitive match | Auto-fixed to canonical name (warning if casing differed) |
| In filtered list             | Excluded (warning)                                        |
| No match found               | Invalid track (error)                                     |
| Duplicate within same team   | Duplicate (warning)                                       |

**Two-pass validation (`validateTracksFromColumns`):**

1. **Pass 1:** Validate primary tracks (`Track #1-3`) via `validateAndCanonicalizeTracks`
2. **Pass 2:** Validate opt-in tracks (from `Opt-In Prizes`, split by `,;|\n\r`) via `validateAndCanonicalizeTracks`
3. **Merge:** Primary tracks first, then opt-in tracks that aren't already in primary. Opt-in tracks that duplicate a primary track are silently deduplicated (not flagged as duplicates)

### Issue Severity

**Errors** (block upload of that row):

| Issue                  | Trigger                                           |
| ---------------------- | ------------------------------------------------- |
| Missing Project Title  | Empty or blank                                    |
| Missing Table Number   | Not a finite number                               |
| Missing Tracks         | Zero valid canonical tracks after validation      |
| Invalid tracks         | Track name not found in `db_validation_data.json` |
| Duplicate Table Number | Same table number as a previously seen row        |

**Warnings** (team still uploads):

| Issue             | Trigger                                                          |
| ----------------- | ---------------------------------------------------------------- |
| Excluded tracks   | Track is in the filtered set (e.g., "Best Hack for Social Good") |
| Duplicate tracks  | Same canonical track appears twice within one team's columns     |
| Auto-fixed tracks | Input differed from canonical (casing/spacing) but matched       |

A row gets severity `'error'` if it has any invalid tracks, missing fields, or duplicate table number. Otherwise it's a `'warning'`.

### `CsvValidationReport`

```ts
{
  totalTeamsParsed: number;
  validTeams: number;
  errorRows: number;
  warningRows: number;
  unknownTracks: string[];     // all invalid track names found across the entire CSV
  issues: CsvRowIssue[];       // per-row issues
  globalWarnings?: string[];   // e.g., "Capacity Exceeded: CSV has X teams..."
}
```

### `CsvRowIssue`

Each issue includes:

- `rowIndex` -- 1-based CSV row number
- `teamNumberRaw`, `teamNumber`, `projectTitle` -- identification
- `contactEmails`, `contactNames`, `memberEmails`, `memberNames` -- extracted from all columns
- `memberColumnsFromTeamMember1` -- raw column values starting from "Team member 1 first name" (used by admin UI to display per-member details)
- `severity` -- `'error'` or `'warning'`
- Issue details: `invalidTracks`, `excludedTracks`, `duplicateTracks`, `autoFixedTracks`, `missingFields`, `duplicateTeamNumber`

### Exported Utilities

**`sortTracks(track1, track2, track3, chosenTracks)`** -- Returns an ordered, deduplicated array of canonical track names. Primary tracks first, then opt-in tracks.

**`matchCanonicalTrack(raw)`** -- Returns the canonical track name for a raw string, or `null` if no match or filtered.

### Default Export: `csvAlgorithm(blob)`

Thin wrapper around `validateCsvBlob`. Returns `{ ok, body, error }` where `body` is `validBody` only if validation passed (no error rows). Used by the legacy `ingestCSV` action.

---

## Server Actions

### `app/(api)/_actions/logic/ingestCSV.ts` (Legacy)

> **Note:** This is the older single-step action that validates and uploads in one call. The admin page now uses the two-step `validateCSV` + `ingestTeams` flow instead.

```ts
export default async function ingestCSV(formData: FormData);
```

1. Reads the file from `FormData`
2. Runs `csvAlgorithm(blob)` -- which calls `validateCsvBlob` internally and only returns `validBody` if `ok`
3. Calls `CreateManyTeams(body)` if parsing succeeded

### `app/(api)/_actions/logic/checkTeamsPopulated.ts`

```ts
export default async function checkTeamsPopulated();
// Returns: { ok, populated: boolean, count: number, error }
```

Checks if the `teams` collection has any documents. Used by the admin page to warn before re-uploading.

---

## Admin CSV Page

### `app/(pages)/admin/csv/page.tsx`

Client component with a two-step workflow:

**State:**

- `file` -- selected CSV file
- `validation` -- result from `validateCSV` (includes `body`, `validBody`, `report`)
- `teamsAlreadyPopulated` -- checked on mount via `checkTeamsPopulated()`

**Step 1: Validate**

- User selects a `.csv` file
- Clicks "Validate" -> calls `validateCSV(formData)` server action
- Displays validation report: total teams, valid count, error count, warning count

**Step 2: Upload**

Two options after validation:

- **"Upload Valid Teams Only"** -- sends `validation.validBody` to `ingestTeams()`
- **"Force Upload All Teams (Ignore Errors)"** -- sends `validation.body` (with confirmation dialog if errors exist)

**UI Features:**

- Red banner if teams are already in the database (duplicate warning)
- Error list with team number, project title, submitter info, missing fields, invalid tracks, member details
- Warning list with duplicate/excluded/auto-fixed track info
- "Copy Errors + Contact Info" / "Copy Warnings + Contact Info" buttons for clipboard export
- Raw JSON report in a collapsible `<details>` section
- Reset button to clear file and validation state

**Contact info extraction (`buildTeamMemberLines`):**

Reconstructs team member names and emails from the raw column data (`memberColumnsFromTeamMember1`) for display in issue lists. Iterates members 1-4, extracting first name, last name, and email columns.

---

## File Index

| File                                              | Purpose                                                  |
| ------------------------------------------------- | -------------------------------------------------------- |
| `app/(api)/_utils/csv-ingestion/csvAlgorithm.ts`  | Core CSV parsing, validation, and track canonicalization |
| `app/(api)/_actions/logic/ingestCSV.ts`           | Legacy single-step ingest action                         |
| `app/(api)/_actions/logic/checkTeamsPopulated.ts` | Check if teams collection is populated                   |
| `app/(pages)/admin/csv/page.tsx`                  | Admin CSV upload/validation UI                           |
| `app/_data/db_validation_data.json`               | Valid track names for validation                         |
| `app/_types/parsedRecord.ts`                      | `ParsedRecord` type definition                           |
