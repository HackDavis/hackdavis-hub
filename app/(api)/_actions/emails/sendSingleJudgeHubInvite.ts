'use server';

import GenerateInvite from '@datalib/invite/generateInvite';
import { GetManyUsers } from '@datalib/users/getUser';
import { DuplicateError, HttpError } from '@utils/response/Errors';
import judgeHubInviteTemplate from './emailTemplates/2026JudgeHubInviteTemplate';
import { DEFAULT_SENDER, transporter } from './transporter';
import { JudgeInviteData, SingleJudgeInviteResponse } from '@typeDefs/emails';

const EMAIL_SUBJECT = '[ACTION REQUIRED] HackDavis 2026 Judging App Invite';

export default async function sendSingleJudgeHubInvite(
  options: JudgeInviteData,
  skipDuplicateCheck = false
): Promise<SingleJudgeInviteResponse> {
  const totalStart = Date.now();
  const { firstName, lastName, email } = options;

  try {
    // Step 1: duplicate check (skipped in bulk flow — checked upfront there)
    if (!skipDuplicateCheck) {
      const users = await GetManyUsers({ email });
      if (users.ok && users.body.length > 0) {
        throw new DuplicateError(`User with email ${email} already exists.`);
      }
    }

    // Step 2: generate HMAC-signed invite link
    const invite = await GenerateInvite(
      { email, name: `${firstName} ${lastName}`, role: 'judge' },
      'invite'
    );
    if (!invite.ok || !invite.body) {
      throw new HttpError(invite.error ?? 'Failed to generate invite link.');
    }

    if (!DEFAULT_SENDER) {
      throw new Error('Email configuration missing: SENDER_EMAIL is not set.');
    }

    const htmlContent = judgeHubInviteTemplate(firstName, invite.body);

    // Step 3: send email
    await transporter.sendMail({
      from: DEFAULT_SENDER,
      to: email,
      subject: EMAIL_SUBJECT,
      html: htmlContent,
    });
    return { ok: true, inviteUrl: invite.body, error: null };
  } catch (e) {
    const errorMessage =
      e instanceof Error
        ? e.message
        : typeof e === 'string'
        ? e
        : 'Unknown error';
    console.error(
      `[Judge Hub Invite] ✗ Failed (${email}) after ${
        Date.now() - totalStart
      }ms:`,
      errorMessage
    );
    return { ok: false, error: errorMessage };
  }
}
