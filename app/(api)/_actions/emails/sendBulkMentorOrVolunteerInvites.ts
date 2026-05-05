'use server';

import getOrCreateTitoInvitation from '@actions/tito/getOrCreateTitoInvitation';
import getAllRsvpInvitations from '@actions/tito/getAllRsvpInvitations';
import mentorInviteTemplate, {
  MENTOR_EMAIL_SUBJECT,
} from './emailTemplates/2026MentorInviteTemplate';
import volunteerInviteTemplate, {
  VOLUNTEER_EMAIL_SUBJECT,
} from './emailTemplates/2026VolunteerInviteTemplate';
import { DEFAULT_SENDER, transporter } from './transporter';
import createLimiter from './createLimiter';
import processBulkInvites from './processBulkInvites';
import {
  BulkMentorInviteResponse,
  MentorInviteData,
  MentorInviteResult,
} from '@typeDefs/emails';

type StaffRole = 'mentor' | 'volunteer';

const TITO_CONCURRENCY = 20;
const EMAIL_CONCURRENCY = 10;

export default async function sendBulkMentorOrVolunteerInvites(
  csvText: string,
  rsvpListSlug: string,
  releaseIds: string,
  role: StaffRole = 'mentor'
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

  // Pre-fetch all existing invitations so duplicate recovery skips per-person API calls
  const existingInvitationsMap = await getAllRsvpInvitations(rsvpListSlug);

  const titoLimiter = createLimiter(TITO_CONCURRENCY);
  const emailLimiter = createLimiter(EMAIL_CONCURRENCY);

  return processBulkInvites<MentorInviteData, MentorInviteResult>(csvText, {
    label: 'Mentor',

    async processOne(mentor) {
      // Stage 1: Tito — slot released before email starts
      const titoResult = await titoLimiter(() =>
        getOrCreateTitoInvitation(
          { ...mentor, rsvpListSlug, releaseIds },
          existingInvitationsMap
        )
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
            subject:
              role === 'volunteer'
                ? VOLUNTEER_EMAIL_SUBJECT
                : MENTOR_EMAIL_SUBJECT,
            html:
              role === 'volunteer'
                ? volunteerInviteTemplate(mentor.firstName, titoResult.titoUrl)
                : mentorInviteTemplate(mentor.firstName, titoResult.titoUrl),
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
