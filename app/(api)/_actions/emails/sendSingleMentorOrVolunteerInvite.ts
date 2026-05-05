'use server';

import getOrCreateTitoInvitation from '@actions/tito/getOrCreateTitoInvitation';
import mentorInviteTemplate, {
  MENTOR_EMAIL_SUBJECT,
} from './emailTemplates/2026MentorInviteTemplate';
import volunteerInviteTemplate, {
  VOLUNTEER_EMAIL_SUBJECT,
} from './emailTemplates/2026VolunteerInviteTemplate';
import { DEFAULT_SENDER, transporter } from './transporter';
import { MentorInviteData, SingleMentorInviteResponse } from '@typeDefs/emails';

type StaffRole = 'mentor' | 'volunteer';

interface MentorInviteOptions extends MentorInviteData {
  rsvpListSlug: string;
  releaseIds: string;
  role: StaffRole;
}

export default async function sendSingleMentorOrVolunteerInvite(
  options: MentorInviteOptions
): Promise<SingleMentorInviteResponse> {
  const { firstName, lastName, email, rsvpListSlug, releaseIds, role } =
    options;

  try {
    // Step 1: Get or create Tito invitation (with duplicate recovery)
    const titoResult = await getOrCreateTitoInvitation({
      firstName,
      lastName,
      email,
      rsvpListSlug,
      releaseIds,
    });

    if (!titoResult.ok) {
      throw new Error(titoResult.error);
    }

    if (!DEFAULT_SENDER) {
      throw new Error('Email configuration missing: SENDER_EMAIL is not set.');
    }

    // Step 2: Send email with Tito URL
    await transporter.sendMail({
      from: DEFAULT_SENDER,
      to: email,
      subject:
        role === 'volunteer' ? VOLUNTEER_EMAIL_SUBJECT : MENTOR_EMAIL_SUBJECT,
      html:
        role === 'volunteer'
          ? volunteerInviteTemplate(firstName, titoResult.titoUrl)
          : mentorInviteTemplate(firstName, titoResult.titoUrl),
    });

    return { ok: true, titoUrl: titoResult.titoUrl, error: null };
  } catch (e) {
    const errorMessage =
      e instanceof Error
        ? e.message
        : typeof e === 'string'
        ? e
        : 'Unknown error';
    console.error(`[Mentor Invite] Failed (${email}):`, errorMessage);
    return { ok: false, error: errorMessage };
  }
}
