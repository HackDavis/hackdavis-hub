'use server';

import getOrCreateTitoInvitation from '@actions/tito/getOrCreateTitoInvitation';
import GenerateInvite from '@datalib/invite/generateInvite';
import { GetManyUsers } from '@datalib/users/getUser';
import hackerInviteTemplate, {
  HACKER_EMAIL_SUBJECT,
} from './emailTemplates/2026HackerInviteTemplate';
import { DEFAULT_SENDER, transporter } from './transporter';
import { HackerInviteData, SingleHackerInviteResponse } from '@typeDefs/emails';

interface HackerInviteOptions extends HackerInviteData {
  rsvpListSlug: string;
  releaseIds: string;
}

export default async function sendSingleHackerInvite(
  options: HackerInviteOptions
): Promise<SingleHackerInviteResponse> {
  const { firstName, lastName, email, rsvpListSlug, releaseIds } = options;

  try {
    // Step 1: Hub duplicate check
    const users = await GetManyUsers({ email });
    if (users.ok && users.body.length > 0) {
      throw new Error(`User with email ${email} already exists.`);
    }

    // Step 2: Get or create Tito invitation
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

    // Step 3: Generate HMAC-signed Hub invite link
    const invite = await GenerateInvite(
      { email, name: `${firstName} ${lastName}`, role: 'hacker' },
      'invite'
    );
    if (!invite.ok || !invite.body) {
      throw new Error(invite.error ?? 'Failed to generate invite link.');
    }

    if (!DEFAULT_SENDER) {
      throw new Error('Email configuration missing: SENDER_EMAIL is not set.');
    }

    // Step 4: Send email with both URLs
    await transporter.sendMail({
      from: DEFAULT_SENDER,
      to: email,
      subject: HACKER_EMAIL_SUBJECT,
      html: hackerInviteTemplate(firstName, titoResult.titoUrl, invite.body),
    });

    return {
      ok: true,
      titoUrl: titoResult.titoUrl,
      inviteUrl: invite.body,
      error: null,
    };
  } catch (e) {
    const errorMessage =
      e instanceof Error
        ? e.message
        : typeof e === 'string'
        ? e
        : 'Unknown error';
    console.error(`[Hacker Invite] Failed (${email}):`, errorMessage);
    return { ok: false, error: errorMessage };
  }
}
