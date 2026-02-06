'use server';

import createRsvpInvitation from '@actions/tito/createRsvpInvitation';
import mentorInviteTemplate from './emailFormats/2026MentorInviteTemplate';
import { DEFAULT_SENDER, transporter } from './transporter';

interface SingleMentorOptions {
  firstName: string;
  lastName: string;
  email: string;
  rsvpListSlug: string;
  releaseIds: string;
}

interface Response {
  ok: boolean;
  titoUrl?: string;
  error: string | null;
}

export default async function sendSingleMentorInvite(
  options: SingleMentorOptions
): Promise<Response> {
  try {
    console.log(`[Single Mentor Invite] Sending invite to ${options.email}`);

    // 1. Create Tito invitation
    const titoResponse = await createRsvpInvitation({
      firstName: options.firstName,
      lastName: options.lastName,
      email: options.email,
      rsvpListSlug: options.rsvpListSlug,
      releaseIds: options.releaseIds,
    });

    if (!titoResponse.ok || !titoResponse.body?.unique_url) {
      throw new Error(titoResponse.error || 'Failed to create Tito invitation');
    }

    const titoUrl = titoResponse.body.unique_url;

    // 2. Send email with Tito URL
    if (!DEFAULT_SENDER) {
      throw new Error('Email configuration missing');
    }

    const htmlContent = mentorInviteTemplate(options.firstName, titoUrl);

    await transporter.sendMail({
      from: DEFAULT_SENDER,
      to: options.email,
      subject: 'Welcome to HackDavis 2025 - Mentor Invitation',
      html: htmlContent,
    });

    console.log(
      `[Single Mentor Invite] ✓ Successfully sent to ${options.email}`
    );

    return {
      ok: true,
      titoUrl,
      error: null,
    };
  } catch (e) {
    const error = e as Error;
    console.error(`[Single Mentor Invite] ✗ Failed:`, error);
    return {
      ok: false,
      error: error.message,
    };
  }
}
