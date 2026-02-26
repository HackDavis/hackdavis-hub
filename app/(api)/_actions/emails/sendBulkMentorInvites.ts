'use server';

import parseInviteCSV from './parseInviteCSV';
import getOrCreateTitoInvitation from '@actions/tito/getOrCreateTitoInvitation';
import mentorInviteTemplate from './emailFormats/2026MentorInviteTemplate';
import { DEFAULT_SENDER, transporter } from './transporter';
import {
  BulkMentorInviteResponse,
  MentorInviteData,
  MentorInviteResult,
} from '@typeDefs/emails';

const TITO_CONCURRENCY = 20;
const EMAIL_CONCURRENCY = 10;

/**
 * Returns an async function that enforces at most `concurrency` simultaneous
 * calls. Each slot is released as soon as its fn resolves/rejects, so the
 * pool is always kept as full as possible — no batch-boundary idle time.
 */
function createLimiter(concurrency: number) {
  let active = 0;
  const queue: (() => void)[] = [];

  return async function run<T>(fn: () => Promise<T>): Promise<T> {
    if (active >= concurrency) {
      await new Promise<void>((resolve) => queue.push(resolve));
    }
    active++;
    try {
      return await fn();
    } finally {
      active--;
      queue.shift()?.();
    }
  };
}

export default async function sendBulkMentorInvites(
  csvText: string,
  rsvpListSlug: string,
  releaseIds: string
): Promise<BulkMentorInviteResponse> {
  const parsed = parseInviteCSV(csvText);
  if (!parsed.ok) {
    return { ok: false, results: [], successCount: 0, failureCount: 0, error: parsed.error };
  }

  const mentors = parsed.body as MentorInviteData[];

  // Fail fast — no point creating Tito invites if email can't send
  if (!DEFAULT_SENDER) {
    return {
      ok: false,
      results: [],
      successCount: 0,
      failureCount: mentors.length,
      error: 'Email configuration missing: SENDER_EMAIL is not set.',
    };
  }
  const sender = DEFAULT_SENDER; // capture for TypeScript narrowing inside async closures

  const totalStart = Date.now();
  console.log(
    `[Bulk Mentor Invites] Starting ${mentors.length} mentors — Tito pool: ${TITO_CONCURRENCY}, Email pool: ${EMAIL_CONCURRENCY}`
  );

  const titoLimiter = createLimiter(TITO_CONCURRENCY);
  const emailLimiter = createLimiter(EMAIL_CONCURRENCY);

  const results: MentorInviteResult[] = [];
  let successCount = 0;
  let failureCount = 0;
  let completed = 0;

  await Promise.allSettled(
    mentors.map(async (mentor) => {
      // ── Stage 1: Tito ──────────────────────────────────────────────────────
      // Slot is released as soon as Tito resolves, before email starts.
      const titoResult = await titoLimiter(() =>
        getOrCreateTitoInvitation({ ...mentor, rsvpListSlug, releaseIds })
      );

      if (!titoResult.ok) {
        console.error(`[Bulk Mentor Invites] ✗ Tito failed: ${mentor.email}`, titoResult.error);
        results.push({ email: mentor.email, success: false, error: titoResult.error });
        failureCount++;
        console.log(`[Bulk Mentor Invites] Progress: ${++completed}/${mentors.length}`);
        return;
      }

      // ── Stage 2: Email ─────────────────────────────────────────────────────
      // Tito slot is already free; email slot acquired independently.
      // While this person waits for an email slot, other people can be running
      // their Tito stage in those freed Tito slots.
      try {
        await emailLimiter(() =>
          transporter.sendMail({
            from: sender,
            to: mentor.email,
            subject: "You're Invited to Mentor at HackDavis 2026",
            html: mentorInviteTemplate(mentor.firstName, titoResult.titoUrl),
          })
        );
        results.push({ email: mentor.email, success: true, titoUrl: titoResult.titoUrl });
        successCount++;
      } catch (e) {
        const errorMsg = e instanceof Error ? e.message : 'Unknown error';
        console.error(`[Bulk Mentor Invites] ✗ Email failed: ${mentor.email}`, errorMsg);
        results.push({
          email: mentor.email,
          success: false,
          error: `Email send failed: ${errorMsg}`,
        });
        failureCount++;
      }

      console.log(`[Bulk Mentor Invites] Progress: ${++completed}/${mentors.length}`);
    })
  );

  const totalTime = Date.now() - totalStart;
  console.log(
    `[Bulk Mentor Invites] Complete: ${successCount} success, ${failureCount} failed in ${(totalTime / 1000).toFixed(1)}s`
  );

  return {
    ok: failureCount === 0,
    results,
    successCount,
    failureCount,
    error: failureCount > 0 ? `${failureCount} invite(s) failed to send.` : null,
  };
}
