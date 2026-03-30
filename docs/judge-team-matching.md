# Judge-to-Team Matching Algorithm

---

## Overview

The matching algorithm assigns judges to teams based on domain expertise alignment and workload fairness. It runs in **2 rounds**, assigning one judge per team per round, and supports **multi-round judging** -- a second batch of assignments can be run later (after new judges check in or teams drop out) without re-assigning existing pairings.

**Core formula:**

```
priority = (ALPHA * specialtyScore) - judge.teamsAssigned
```

Higher priority = better judge for that team. `ALPHA` controls the trade-off between expertise matching and even workload distribution.

---

## Architecture

```
Admin UI (JudgeTeamGrouping.tsx)
  |
  |--> matchTeams (single alpha)
  |      --> matchAllTeams (core algorithm)
  |      --> checkMatches (validation)
  |      --> CreateManySubmissions (persist to DB)
  |
  |--> matchTeamsDiagnostics (sweep alpha range)
  |      --> matchAllTeams (repeated for each alpha, 0.5 step)
  |      --> returns stats per alpha (no DB writes)
  |
  |--> applyDiagnosticAlpha (apply chosen alpha from diagnostics)
         --> checkMatches (validation)
         --> CreateManySubmissions (persist to DB)
```

---

## Core Algorithm

### `app/(api)/_utils/matching/judgesToTeamsAlgorithm.ts`

`matchAllTeams(options?: { alpha?: number })` -- the main function.

### Step 1: Build Judge Queue

Fetch all checked-in judges (`role: 'judge'`, `has_checked_in: true`).

Each judge becomes a `Judge` object:

```ts
{
  user: User,
  domainMatchScores: { [domain: string]: number },
  teamsAssigned: number,  // starts at 0
  priority: number,       // recalculated per team
}
```

**Domain match scores** are derived from `user.specialties` (an ordered array of domain strings, ranked by the judge's self-reported expertise):

```
specialties[0] -> score 1/1 = 1.0
specialties[1] -> score 1/2 = 0.5
specialties[2] -> score 1/3 = 0.33
specialties[3] -> score 1/4 = 0.25
...
```

So a judge's top specialty gets score 1.0 and it falls off with `1/(index+1)`.

### Step 2: Prepare Teams

Fetch all teams and transform their `tracks` array:

1. **Filter out** tracks that are in `nonHDTracks` (sponsor/non-profit tracks like "Best AI/ML Hack", "Best Hack for Women's Center") -- these are judged separately
2. **Map** remaining track names to their **domain** using `domainMap` (built from `optedHDTracks`):

   | Track Name                        | Domain     |
   | --------------------------------- | ---------- |
   | Most Technically Challenging Hack | `swe`      |
   | Best Beginner Hack                | `swe`      |
   | Best Interdisciplinary Hack       | `swe`      |
   | Most Creative Hack                | `business` |
   | Best Hack for Social Justice      | `business` |
   | Best Entrepreneurship Hack        | `business` |
   | Best Hardware Hack                | `hardware` |
   | Best UI/UX Design                 | `design`   |
   | Best User Research                | `design`   |
   | Best Statistical Model            | `aiml`     |

3. **Deduplicate** domains (a team in two `swe` tracks gets one `swe` entry)
4. **Pad** to exactly `rounds` (2) entries by cycling. If a team has 0 domains, it gets `["", ""]`. If 1 domain (`["swe"]`), it becomes `["swe", "swe"]`.

### Step 3: Load Previous Pairings

Fetch existing submissions from `GetJudgeToTeamPairings()`. These are added to the `judgeToTeam` array **before** matching begins, so the duplicate-detection logic prevents re-assigning a judge to a team they've already judged.

This is what enables multi-round judging: the first run produces round 1 pairings, and a second run automatically avoids those pairs.

### Step 4: Main Matching Loop

```
for each round (domainIndex = 0, 1):
    for each team:
        1. updateQueue(team, domainIndex, judges, ALPHA)
           - Recalculate priority for every judge
           - Sort judges descending by priority
        2. Walk the sorted queue, pick the first judge
           who isn't already paired with this team
        3. Record the pairing in judgeToTeam[]
        4. Increment selectedJudge.teamsAssigned
    shuffle(modifiedTeams)  // reduce ordering bias for next round
```

**`updateQueue`** recalculates each judge's priority for the current team + domain:

```ts
specialtyScore = judge.domainMatchScores[team.tracks[domainIndex]] ?? 0;
priority = ALPHA * specialtyScore - judge.teamsAssigned;
```

Then sorts all judges descending by priority.

**Why `domainIndex` matters:** In round 0, a team's first domain is used for matching. In round 1, the second domain is used. So a team with tracks `["swe", "design"]` gets one judge strong in `swe` and another strong in `design`.

**Duplicate prevention:** The algorithm scans `judgeToTeam` (which includes previous round pairings) and skips any judge already assigned to the current team.

**Shuffle between rounds:** `modifiedTeams` is shuffled after each round so teams at the start of the array don't consistently get first pick of judges.

### Step 5: Remove Previous Pairings from Output

After matching, the previously-loaded pairings are filtered out of `judgeToTeam` so only **new** assignments are returned. Uses a Set of `"judgeId::teamId"` keys for efficient lookup.

### Step 6: Compute Statistics

The function returns:

| Field                   | Description                                                                               |
| ----------------------- | ----------------------------------------------------------------------------------------- |
| `judgeToTeam`           | Array of `{ judge_id, team_id }` -- new assignments only                                  |
| `judgeTeamDistribution` | `{ sum, count, average, min, max, numJudges, numTeams }` -- how many teams each judge got |
| `matchStats`            | Count of teams per average match quality bucket (e.g., `{ "0.5": 12, "1": 8 }`)           |
| `matchQualityStats`     | Per-team breakdown: `{ sum, average, min, max, count, teamDomains, judgeDomains }`        |
| `extraAssignmentsMap`   | Teams with fewer domains than rounds (would get extra assignments from same domain)       |

---

## ALPHA Parameter

`ALPHA` (default: 4) weights expertise vs. workload fairness:

```
priority = ALPHA * specialtyScore - teamsAssigned
```

| ALPHA          | Behavior                                                                                       |
| -------------- | ---------------------------------------------------------------------------------------------- |
| Low (e.g., 2)  | Favors even distribution -- judges get similar team counts regardless of expertise fit         |
| High (e.g., 6) | Favors expertise -- best-matched judges are selected even if they've already judged many teams |

**Example:** A judge with `specialtyScore = 1.0` and `teamsAssigned = 3`:

- ALPHA=2: priority = 2(1.0) - 3 = **-1** (low, workload penalty dominates)
- ALPHA=6: priority = 6(1.0) - 3 = **3** (high, expertise wins)

---

## Server Actions

### `app/(api)/_actions/logic/matchTeams.ts`

Runs the algorithm with a single alpha, validates, and persists to DB.

**Steps:**

1. Fetch all teams (for validation count)
2. Run `matchAllTeams({ alpha })`
3. Run `parseAndReplace` on the judge-to-team pairs (resolves ID references)
4. Validate with `checkMatches` -- ensures every team has exactly 2 assignments and total assignments >= 2 \* teamCount
5. Convert `judge_id` and `team_id` to MongoDB ObjectId format (`{ '*convertId': { id } }`)
6. `CreateManySubmissions` to persist all pairs

### `app/(api)/_actions/logic/matchTeamDiagnostics.ts`

Runs the algorithm across a **range of alpha values** (min to max, stepping by 0.5) without writing to the DB. Returns a `Record<number, DiagnosticResult>` map.

Each `DiagnosticResult` contains:

- `judgeTeamDistribution` -- min/max/avg assignments per judge
- `matchStats` -- quality distribution
- `judgeToTeam` -- the actual pairings (used if admin chooses to apply this alpha)

### `app/(api)/_actions/logic/applyDiagnosticAlpha.ts`

Takes a pre-computed `judgeToTeam` array from diagnostics and persists it to DB.

**Multi-round support:**

- Checks existing submission count against max capacity (4 judges per team)
- If submissions already exist, new pairings are **added on top** (not replacing)
- Returns a message: "Second round detected: new pairings were added on top of existing submissions."

### `app/(api)/_actions/logic/checkMatches.ts`

Validates that assignments are correct:

- Total assignments >= `2 * teamsLength`
- Every team has exactly 2 assignments

### `app/(api)/_datalib/judgeToTeam/getJudgeToTeamPairings.ts`

Fetches all existing submissions from MongoDB's `submissions` collection and returns them as `JudgeToTeam[]` (with ObjectIds converted to strings).

---

## Admin UI

### `app/(pages)/admin/_components/JudgeTeamGrouping/JudgeTeamGrouping.tsx`

The admin component for running and analyzing judge-team matching. Two workflows:

### Workflow 1: Diagnostics (Recommended)

1. Set **min alpha** and **max alpha** (defaults: 3 and 6)
2. Click **"Run Diagnostics"** -- runs the algorithm at every 0.5 step (e.g., 3.0, 3.5, 4.0, ..., 6.0)
3. Four charts are displayed:
   - **Judge-Team Distribution vs. Alpha** -- min/max/avg assignments per judge across alpha values
   - **Match Stats Distributions** -- histogram of team quality buckets per alpha
   - **Weighted Avg Match Quality vs. Alpha** -- single quality metric per alpha
   - **Median Match Quality vs. Alpha** -- median quality per alpha
4. Select the best alpha from the dropdown
5. Click **"Apply Matching"** -- persists the pre-computed pairings for that alpha to the DB

### Workflow 2: Single Alpha (Legacy)

1. Enter an alpha value (default: 4)
2. Click **"Match Teams"** -- runs algorithm + persists immediately
3. Results shown as collapsible JSON

### Other Features

- **Download CSV** -- exports all match data (submissions, distribution stats, match quality stats)
- **Delete All Judge-Team Matches** -- clears the submissions collection (via `deleteManySubmissions`)
- Collapsible sections for raw submissions and match data JSON

---

## Multi-Round Judging

The system supports running matching multiple times (e.g., start of judging + 30-40 min later):

**Round 1 (start of judging):**

1. Run diagnostics or single match
2. Each team gets 2 judges
3. Pairings saved to `submissions` collection

**Round 2 (mid-judging, after new judges arrive):**

1. Run matching again
2. Algorithm loads round 1 pairings from DB via `GetJudgeToTeamPairings`
3. Previous pairings prevent duplicate assignments
4. New judges start with `teamsAssigned = 0`, giving them higher priority
5. Each team gets 1-2 more judges (up to max 4 total per team)
6. New pairings are added to `submissions` (not replacing round 1)

`applyDiagnosticAlpha` enforces a hard cap: `4 judges * numTeams` total submissions max.

---

## Types

### `app/_types/judgeToTeam.ts`

```ts
interface JudgeToTeam {
  judge_id: string;
  team_id: string;
}
```

### `app/_types/user.ts` (relevant fields)

```ts
interface User {
  _id?: string;
  name: string;
  role: string; // 'judge'
  specialties?: string[]; // ordered list of domain strings (e.g., ['swe', 'design', 'business'])
  has_checked_in: boolean;
}
```

### `app/_types/team.ts`

```ts
interface Team {
  _id?: string;
  teamNumber: number;
  tableNumber: string;
  name: string;
  tracks: string[]; // track names from Devpost, converted to domains by algorithm
  active: boolean;
}
```

---

## Domain Mapping

Tracks are grouped into 5 domains (defined in `app/_data/tracks.ts`):

| Domain     | Tracks                                                              | Display Name                 |
| ---------- | ------------------------------------------------------------------- | ---------------------------- |
| `swe`      | Most Technically Challenging, Best Beginner, Best Interdisciplinary | Software Engineering         |
| `business` | Most Creative, Best Social Justice, Best Entrepreneurship           | Business                     |
| `hardware` | Best Hardware Hack                                                  | Hardware or Embedded Systems |
| `design`   | Best UI/UX Design, Best User Research                               | UI/UX Design                 |
| `aiml`     | Best Statistical Model                                              | Data Science or AI/ML        |

**Non-HD tracks** (judged separately, filtered out of matching): Best AI/ML Hack, Best Hack for Women's Center, Best Hack for ASUCD Pantry.

**Automatic tracks** (not part of matching): Best Hack for Social Good, Hacker's Choice Award.

---

## Performance Note

The judge queue is re-sorted (full `Array.sort`) after every single team assignment. This is O(J log J) per assignment, giving O(R _ T _ J log J) total where R=rounds, T=teams, J=judges. For typical HackDavis scale (~30 judges, ~160 teams), this completes in under a second. A max-heap could reduce this to O(R _ T _ J log J) -> O(R _ T _ log J) per extraction, but the current approach is sufficient.

---

## File Index

| File                                                                    | Purpose                                          |
| ----------------------------------------------------------------------- | ------------------------------------------------ |
| `app/(api)/_utils/matching/judgesToTeamsAlgorithm.ts`                   | Core matching algorithm (`matchAllTeams`)        |
| `app/(api)/_actions/logic/matchTeams.ts`                                | Server action: run algorithm + persist to DB     |
| `app/(api)/_actions/logic/matchTeamDiagnostics.ts`                      | Server action: sweep alpha range, return stats   |
| `app/(api)/_actions/logic/applyDiagnosticAlpha.ts`                      | Server action: persist pre-computed pairings     |
| `app/(api)/_actions/logic/checkMatches.ts`                              | Validates assignment correctness (2 per team)    |
| `app/(api)/_datalib/judgeToTeam/getJudgeToTeamPairings.ts`              | Fetch existing submissions from DB               |
| `app/(pages)/admin/_components/JudgeTeamGrouping/JudgeTeamGrouping.tsx` | Admin UI: diagnostics charts + matching controls |
| `app/_data/tracks.ts`                                                   | Track definitions with domain mappings           |
| `app/_types/judgeToTeam.ts`                                             | `JudgeToTeam` type                               |
| `app/_types/user.ts`                                                    | `User` type (includes `specialties`)             |
| `app/_types/team.ts`                                                    | `Team` type (includes `tracks`)                  |
