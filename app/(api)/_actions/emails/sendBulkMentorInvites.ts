'use server';

import getOrCreateTitoInvitation from '@actions/tito/getOrCreateTitoInvitation';
import mentorInviteTemplate, {
  MENTOR_EMAIL_SUBJECT,
} from './emailTemplates/2026MentorInviteTemplate';
import { DEFAULT_SENDER, transporter } from './transporter';
import createLimiter from './createLimiter';
import processBulkInvites from './processBulkInvites';
import {
  BulkMentorInviteResponse,
  MentorInviteData,
  MentorInviteResult,
} from '@typeDefs/emails';

const TITO_CONCURRENCY = 20;
const EMAIL_CONCURRENCY = 10;

export default async function sendBulkMentorInvites(
  csvText: string,
  rsvpListSlug: string,
  releaseIds: string
): Promise<BulkMentorInviteResponse> {
  // Fail fast — no point creating Tito invites if email can't send
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

  return processBulkInvites<MentorInviteData, MentorInviteResult>(csvText, {
    label: 'Mentor',

    async processOne(mentor) {
      // Stage 1: Tito — slot released before email starts
      const titoResult = await titoLimiter(() =>
        getOrCreateTitoInvitation({
          ...mentor,
          rsvpListSlug,
          releaseIds,
        })
      );

      if (!titoResult.ok) {
        return {
          email: mentor.email,
          success: false,
          error: titoResult.error,
        };
      }

      // Stage 2: Email — independent limiter
      try {
        await emailLimiter(() =>
          transporter.sendMail({
            from: sender,
            to: mentor.email,
            subject: MENTOR_EMAIL_SUBJECT,
            html: mentorInviteTemplate(mentor.firstName, titoResult.titoUrl),
          })
        );
        return {
          email: mentor.email,
          success: true,
          titoUrl: titoResult.titoUrl,
        };
      } catch (e) {
        const errorMsg = e instanceof Error ? e.message : 'Unknown error';
        return {
          email: mentor.email,
          success: false,
          error: `Email send failed: ${errorMsg}`,
        };
      }
    },
  });
}
