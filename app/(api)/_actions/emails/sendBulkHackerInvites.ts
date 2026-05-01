'use server';

import getOrCreateTitoInvitation from '@actions/tito/getOrCreateTitoInvitation';
import getAllRsvpInvitations from '@actions/tito/getAllRsvpInvitations';
import GenerateInvite from '@datalib/invite/generateInvite';
import { GetManyUsers } from '@datalib/users/getUser';
import hackerInviteTemplate, {
  HACKER_EMAIL_SUBJECT,
} from './emailTemplates/2026HackerInviteTemplate';
import { DEFAULT_SENDER, transporter } from './transporter';
import createLimiter from './createLimiter';
import processBulkInvites from './processBulkInvites';
import {
  BulkHackerInviteResponse,
  HackerInviteData,
  HackerInviteResult,
} from '@typeDefs/emails';

const TITO_CONCURRENCY = 20;
const EMAIL_CONCURRENCY = 10;

export default async function sendBulkHackerInvites(
  csvText: string,
  rsvpListSlug: string,
  releaseIds: string
): Promise<BulkHackerInviteResponse> {
  if (!DEFAULT_SENDER) {
    return {
      ok: false,
      results: [],
      successCount: 0,
      failureCount: 0,
      error: 'Email configuration missing: SENDER_EMAIL is not set.',
    };
  }
  const sender = DEFAULT_SENDER;

  // Pre-fetch all existing Tito invitations so duplicate recovery avoids per-person API calls
  const existingInvitationsMap = await getAllRsvpInvitations(rsvpListSlug);

  const titoLimiter = createLimiter(TITO_CONCURRENCY);
  const emailLimiter = createLimiter(EMAIL_CONCURRENCY);

  return processBulkInvites<HackerInviteData, HackerInviteResult>(csvText, {
    label: 'Hacker',

    async preprocess(hackers) {
      // Batch Hub duplicate check upfront — skip anyone already registered
      const allEmails = hackers.map((h) => h.email);
      const existingUsers = await GetManyUsers({ email: { $in: allEmails } });
      const existingEmailSet = new Set<string>(
        existingUsers.ok
          ? existingUsers.body.map((u: { email: string }) => u.email)
          : []
      );

      const remaining: HackerInviteData[] = [];
      const earlyResults: HackerInviteResult[] = [];

      for (const hacker of hackers) {
        if (existingEmailSet.has(hacker.email)) {
          earlyResults.push({
            email: hacker.email,
            success: false,
            error: 'User already exists.',
          });
        } else {
          remaining.push(hacker);
        }
      }

      return { remaining, earlyResults };
    },

    async processOne(hacker) {
      // Stage 1: Tito — uses pre-fetched map to short-circuit duplicate lookups
      const titoResult = await titoLimiter(() =>
        getOrCreateTitoInvitation(
          { ...hacker, rsvpListSlug, releaseIds },
          existingInvitationsMap
        )
      );

      if (!titoResult.ok) {
        return { email: hacker.email, success: false, error: titoResult.error };
      }

      // Stage 2: Generate Hub invite link
      const invite = await GenerateInvite(
        {
          email: hacker.email,
          name: `${hacker.firstName} ${hacker.lastName}`,
          role: 'hacker',
        },
        'invite'
      );
      if (!invite.ok || !invite.body) {
        return {
          email: hacker.email,
          success: false,
          error: invite.error ?? 'Failed to generate Hub invite link.',
        };
      }

      // Stage 3: Email — independent limiter
      try {
        await emailLimiter(() =>
          transporter.sendMail({
            from: sender,
            to: hacker.email,
            subject: HACKER_EMAIL_SUBJECT,
            html: hackerInviteTemplate(
              hacker.firstName,
              titoResult.titoUrl,
              invite.body!
            ),
          })
        );
        return {
          email: hacker.email,
          success: true,
          titoUrl: titoResult.titoUrl,
          inviteUrl: invite.body,
        };
      } catch (e) {
        const errorMsg = e instanceof Error ? e.message : 'Unknown error';
        return {
          email: hacker.email,
          success: false,
          error: `Email send failed: ${errorMsg}`,
        };
      }
    },
  });
}
