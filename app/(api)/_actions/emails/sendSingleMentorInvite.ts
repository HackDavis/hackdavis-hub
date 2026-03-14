'use server';

import getOrCreateTitoInvitation from '@actions/tito/getOrCreateTitoInvitation';
import mentorInviteTemplate, {
  MENTOR_EMAIL_SUBJECT,
} from './emailTemplates/2026MentorInviteTemplate';
import { DEFAULT_SENDER, transporter } from './transporter';
import { MentorInviteData, SingleMentorInviteResponse } from '@typeDefs/emails';

interface MentorInviteOptions extends MentorInviteData {
  rsvpListSlug: string;
  releaseIds: string;
}

export default async function sendSingleMentorInvite(
  options: MentorInviteOptions
): Promise<SingleMentorInviteResponse> {
  const { firstName, lastName, email, rsvpListSlug, releaseIds } = options;

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
      subject: MENTOR_EMAIL_SUBJECT,
      html: mentorInviteTemplate(firstName, titoResult.titoUrl),
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
