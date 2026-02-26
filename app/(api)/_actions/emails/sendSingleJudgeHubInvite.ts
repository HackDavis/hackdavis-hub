'use server';

import GenerateInvite from '@datalib/invite/generateInvite';
import { GetManyUsers } from '@datalib/users/getUser';
import { DuplicateError, HttpError } from '@utils/response/Errors';
import judgeHubInviteTemplate from './emailFormats/2026JudgeHubInviteTemplate';
import { DEFAULT_SENDER, transporter } from './transporter';
import { JudgeInviteData, SingleJudgeInviteResponse } from '@typeDefs/emails';

export default async function sendSingleJudgeHubInvite(
  options: JudgeInviteData,
  skipDuplicateCheck = false
): Promise<SingleJudgeInviteResponse> {
  const totalStart = Date.now();
  const { firstName, lastName, email } = options;

  try {
    console.log(`[Judge Hub Invite] Starting invite for ${email}`);

    // Step 1: duplicate check (skipped in bulk flow — checked upfront there)
    if (!skipDuplicateCheck) {
      const dupStart = Date.now();
      const users = await GetManyUsers({ email });
      console.log(
        `[Judge Hub Invite] Duplicate check: ${Date.now() - dupStart}ms`
      );
      if (users.ok && users.body.length > 0) {
        throw new DuplicateError(`User with email ${email} already exists.`);
      }
    }

    // Step 2: generate HMAC-signed invite link
    const genStart = Date.now();
    const invite = await GenerateInvite(
      { email, name: `${firstName} ${lastName}`, role: 'judge' },
      'invite'
    );
    console.log(
      `[Judge Hub Invite] Invite generation: ${Date.now() - genStart}ms`
    );
    if (!invite.ok || !invite.body) {
      throw new HttpError(invite.error ?? 'Failed to generate invite link.');
    }

    if (!DEFAULT_SENDER) {
      throw new Error('Email configuration missing: SENDER_EMAIL is not set.');
    }

    const htmlContent = judgeHubInviteTemplate(firstName, invite.body);

    // Step 3: send email
    const mailStart = Date.now();
    await transporter.sendMail({
      from: DEFAULT_SENDER,
      to: email,
      subject: "You're Invited to HackDavis 2026 - Create Your Hub Account",
      html: htmlContent,
    });
    console.log(`[Judge Hub Invite] sendMail: ${Date.now() - mailStart}ms`);

    console.log(
      `[Judge Hub Invite] ✓ Done (${email}) — total: ${
        Date.now() - totalStart
      }ms`
    );
    return { ok: true, inviteUrl: invite.body, error: null };
  } catch (e) {
    const error = e as HttpError;
    console.error(
      `[Judge Hub Invite] ✗ Failed (${email}) after ${
        Date.now() - totalStart
      }ms:`,
      error.message
    );
    return { ok: false, error: error.message };
  }
}
