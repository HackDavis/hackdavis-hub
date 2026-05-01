'use server';

import getOrCreateTitoInvitation from '@actions/tito/getOrCreateTitoInvitation';
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
import {
  HackerInviteData,
  // HackerAdmissionType,
  SingleHackerInviteResponse,
  admissionNeedsTitoAndHub,
} from '@typeDefs/emails';

interface HackerInviteOptions extends HackerInviteData {
  rsvpListSlug: string;
  releaseIds: string;
}

export default async function sendSingleHackerInvite(
  options: HackerInviteOptions
): Promise<SingleHackerInviteResponse> {
  const {
    firstName,
    lastName,
    email,
    admissionType,
    rsvpListSlug,
    releaseIds,
  } = options;

  try {
    if (!DEFAULT_SENDER) {
      throw new Error('Email configuration missing: SENDER_EMAIL is not set.');
    }

    const needsLinks = admissionNeedsTitoAndHub(admissionType);

    if (needsLinks) {
      // Accept / waitlist_accept: Hub duplicate check → Tito → Hub invite → email
      const users = await GetManyUsers({ email });
      if (users.ok && users.body.length > 0) {
        throw new Error(`User with email ${email} already exists.`);
      }

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

      const invite = await GenerateInvite(
        { email, name: `${firstName} ${lastName}`, role: 'hacker' },
        'invite'
      );
      if (!invite.ok || !invite.body) {
        throw new Error(invite.error ?? 'Failed to generate invite link.');
      }

      const subject =
        admissionType === 'waitlist_accept'
          ? HACKER_WAITLIST_ACCEPT_EMAIL_SUBJECT
          : HACKER_EMAIL_SUBJECT;

      const html =
        admissionType === 'waitlist_accept'
          ? hackerWaitlistAcceptTemplate(
              firstName,
              titoResult.titoUrl,
              invite.body
            )
          : hackerInviteTemplate(firstName, titoResult.titoUrl, invite.body);

      await transporter.sendMail({
        from: DEFAULT_SENDER,
        to: email,
        subject,
        html,
      });

      return {
        ok: true,
        admissionType,
        titoUrl: titoResult.titoUrl,
        inviteUrl: invite.body,
        error: null,
      };
    } else {
      // Waitlist / reject: email only, no Tito, no Hub invite
      const subject =
        admissionType === 'waitlist'
          ? HACKER_WAITLIST_EMAIL_SUBJECT
          : HACKER_REJECTION_EMAIL_SUBJECT;

      const html =
        admissionType === 'waitlist'
          ? hackerWaitlistTemplate(firstName)
          : hackerRejectionTemplate(firstName);

      await transporter.sendMail({
        from: DEFAULT_SENDER,
        to: email,
        subject,
        html,
      });

      return { ok: true, admissionType, error: null };
    }
  } catch (e) {
    const errorMessage =
      e instanceof Error
        ? e.message
        : typeof e === 'string'
        ? e
        : 'Unknown error';
    console.error(
      `[Hacker Invite][${admissionType}] Failed (${email}):`,
      errorMessage
    );
    return { ok: false, admissionType, error: errorMessage };
  }
}
