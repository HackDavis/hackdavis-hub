import { z } from 'zod';
import { generateHMACSignature } from '@utils/invite/hmac';
import InviteData from '@typeDefs/inviteData';
import { HttpError, BadRequestError } from '@utils/response/Errors';

export default async function GenerateInvite(
  data: InviteData,
  type: string = 'invite'
) {
  console.log(data);
  try {
    if (!data.email || !data.role) {
      throw new BadRequestError('Email and role fields are required.');
    }

    if (data.role !== 'hacker' && data.role !== 'judge') {
      throw new BadRequestError('Unknown role. Choose either hacker or judge.');
    }

    const emailSchema = z.string().email('Invalid email address.');
    emailSchema.parse(data.email);

    if (type === 'invite') {
      // Invite link valid until specified deadline (DOE)
      const expiration = process.env.INVITE_DEADLINE;
      if (!expiration) throw new Error('INVITE_DEADLINE is not set.');
      data['exp'] = new Date(expiration).getTime();
    } else {
      // Reset password link valid for 1 day
      const resetTimeoutDays = 1;
      data['exp'] = Date.now() + 1000 * 60 * 60 * 24 * resetTimeoutDays;
    }

    const data_encoded = btoa(JSON.stringify(data));
    const hmac_sig = generateHMACSignature(data_encoded);
    const hmac_url = `${process.env.BASE_URL}/${type}/${data_encoded}&${hmac_sig}`;
    console.log(hmac_url);

    return { ok: true, body: hmac_url, error: null };
  } catch (e) {
    if (e instanceof z.ZodError) {
      return {
        ok: false,
        body: null,
        error: e.errors.map((e) => e.message).join(' '),
      };
    }

    const error = e as HttpError;
    return {
      ok: false,
      body: null,
      error: error.message,
    };
  }
}
