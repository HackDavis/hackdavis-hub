'use server';

import getOrCreateTitoInvitation from '@actions/tito/getOrCreateTitoInvitation';
import getAllRsvpInvitations from '@actions/tito/getAllRsvpInvitations';
import GenerateInvite from '@datalib/invite/generateInvite';
import { GetManyUsers } from '@datalib/users/getUser';
import hackerInviteTemplate, {
  HACKER_EMAIL_SUBJECT,
} from './emailTemplates/2026HackerInviteTemplate';
import hackerWaitlistAcceptTemplate, {
  HACKER_WAITLIST_ACCEPT_EMAIL_SUBJECT,
} from './emailTemplates/2026HackerWaitlistAcceptTemplate';
import hackerWaitlistTemplate, {
  HACKER_WAITLIST_EMAIL_SUBJECT,
} from './emailTemplates/2026HackerWaitlistTemplate';
import hackerRejectionTemplate, {
  HACKER_REJECTION_EMAIL_SUBJECT,
} from './emailTemplates/2026HackerRejectionTemplate';
import { DEFAULT_SENDER, transporter } from './transporter';
import createLimiter from './createLimiter';
import processBulkInvites from './processBulkInvites';
import parseHackerAdmissionsCSV from './parseHackerAdmissionsCSV';
import {
  BulkHackerInviteResponse,
  HackerInviteData,
  HackerInviteResult,
  admissionNeedsTitoAndHub,
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

  const titoLimiter = createLimiter(TITO_CONCURRENCY);
  const emailLimiter = createLimiter(EMAIL_CONCURRENCY);

  let existingInvitationsMap = new Map<string, string>();

  return processBulkInvites<HackerInviteData, HackerInviteResult>(csvText, {
    label: 'Hacker',
    parse: parseHackerAdmissionsCSV,

    async preprocess(hackers) {
      // Only batch-check Hub duplicates for rows that will create Hub accounts
      const acceptEmails = hackers
        .filter((h) => admissionNeedsTitoAndHub(h.admissionType))
        .map((h) => h.email);

      if (acceptEmails.length > 0) {
        existingInvitationsMap = await getAllRsvpInvitations(rsvpListSlug);
      }

      const existingEmailSet = new Set<string>();
      if (acceptEmails.length > 0) {
        const existingUsers = await GetManyUsers({
          email: { $in: acceptEmails },
        });
        if (existingUsers.ok) {
          for (const u of existingUsers.body as { email: string }[]) {
            existingEmailSet.add(u.email);
          }
        }
      }

      const remaining: HackerInviteData[] = [];
      const earlyResults: HackerInviteResult[] = [];

      for (const hacker of hackers) {
        if (
          admissionNeedsTitoAndHub(hacker.admissionType) &&
          existingEmailSet.has(hacker.email)
        ) {
          earlyResults.push({
            email: hacker.email,
            admissionType: hacker.admissionType,
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
      const { firstName, lastName, email, admissionType } = hacker;
      const needsLinks = admissionNeedsTitoAndHub(admissionType);

      if (needsLinks) {
        // Stage 1: Tito
        const titoResult = await titoLimiter(() =>
          getOrCreateTitoInvitation(
            { firstName, lastName, email, rsvpListSlug, releaseIds },
            existingInvitationsMap
          )
        );
        if (!titoResult.ok) {
          return {
            email,
            admissionType,
            success: false,
            error: titoResult.error,
          };
        }

        // Stage 2: Hub invite link
        const invite = await GenerateInvite(
          { email, name: `${firstName} ${lastName}`, role: 'hacker' },
          'invite'
        );
        if (!invite.ok || !invite.body) {
          return {
            email,
            admissionType,
            success: false,
            error: invite.error ?? 'Failed to generate Hub invite link.',
          };
        }

        // Stage 3: Email
        const subject =
          admissionType === 'waitlist_accept'
            ? HACKER_WAITLIST_ACCEPT_EMAIL_SUBJECT
            : HACKER_EMAIL_SUBJECT;

        const html =
          admissionType === 'waitlist_accept'
            ? hackerWaitlistAcceptTemplate(
                firstName,
                titoResult.titoUrl,
                invite.body!
              )
            : hackerInviteTemplate(firstName, titoResult.titoUrl, invite.body!);

        try {
          await emailLimiter(() =>
            transporter.sendMail({ from: sender, to: email, subject, html })
          );
          return {
            email,
            admissionType,
            success: true,
            titoUrl: titoResult.titoUrl,
            inviteUrl: invite.body,
          };
        } catch (e) {
          return {
            email,
            admissionType,
            success: false,
            error: `Email send failed: ${
              e instanceof Error ? e.message : 'Unknown error'
            }`,
          };
        }
      } else {
        // Waitlist / reject: email only
        const subject =
          admissionType === 'waitlist'
            ? HACKER_WAITLIST_EMAIL_SUBJECT
            : HACKER_REJECTION_EMAIL_SUBJECT;

        const html =
          admissionType === 'waitlist'
            ? hackerWaitlistTemplate(firstName)
            : hackerRejectionTemplate(firstName);

        try {
          await emailLimiter(() =>
            transporter.sendMail({ from: sender, to: email, subject, html })
          );
          return { email, admissionType, success: true };
        } catch (e) {
          return {
            email,
            admissionType,
            success: false,
            error: `Email send failed: ${
              e instanceof Error ? e.message : 'Unknown error'
            }`,
          };
        }
      }
    },
  });
}
