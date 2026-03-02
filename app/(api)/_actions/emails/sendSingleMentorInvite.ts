'use server';

import getOrCreateTitoInvitation from '@actions/tito/getOrCreateTitoInvitation';
import mentorInviteTemplate from './emailFormats/2026MentorInviteTemplate';
import { DEFAULT_SENDER, transporter } from './transporter';
import { MentorInviteData, SingleMentorInviteResponse } from '@typeDefs/emails';

interface MentorInviteOptions extends MentorInviteData {
  rsvpListSlug: string;
  releaseIds: string;
}

export default async function sendSingleMentorInvite(
  options: MentorInviteOptions
): Promise<SingleMentorInviteResponse> {
  const totalStart = Date.now();
  const { firstName, lastName, email, rsvpListSlug, releaseIds } = options;

  try {
    console.log(`[Mentor Invite] Starting invite for ${email}`);

    // Step 1: Get or create Tito invitation (with duplicate recovery)
    const titoStart = Date.now();
    const titoResult = await getOrCreateTitoInvitation({
      firstName,
      lastName,
      email,
      rsvpListSlug,
      releaseIds,
    });
    console.log(`[Mentor Invite] Tito: ${Date.now() - titoStart}ms`);

    if (!titoResult.ok) {
      throw new Error(titoResult.error);
    }

    if (!DEFAULT_SENDER) {
      throw new Error('Email configuration missing: SENDER_EMAIL is not set.');
    }

    // Step 2: Send email with Tito URL
    const mailStart = Date.now();
    await transporter.sendMail({
      from: DEFAULT_SENDER,
      to: email,
      subject: "You're Invited to Mentor at HackDavis 2026",
      html: mentorInviteTemplate(firstName, titoResult.titoUrl),
    });
    console.log(`[Mentor Invite] sendMail: ${Date.now() - mailStart}ms`);

    console.log(
      `[Mentor Invite] ✓ Done (${email}) — total: ${Date.now() - totalStart}ms`
    );
    return { ok: true, titoUrl: titoResult.titoUrl, error: null };
  } catch (e) {
    const errorMessage =
      e instanceof Error
        ? e.message
        : typeof e === 'string'
        ? e
        : 'Unknown error';
    console.error(
      `[Mentor Invite] ✗ Failed (${email}) after ${Date.now() - totalStart}ms:`,
      errorMessage
    );
    return { ok: false, error: errorMessage };
  }
}
