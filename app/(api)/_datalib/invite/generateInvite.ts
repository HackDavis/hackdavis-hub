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

    const exp =
      type === 'invite'
        ? (process.env.INVITE_TIMEOUT as string)
        : (process.env.RESET_TIMEOUT as string);

    data['exp'] = Date.now() + 1000 * 60 * 60 * 24 * (parseInt(exp) ?? 7);
    const data_encoded = btoa(JSON.stringify(data));

    const hmac_sig = generateHMACSignature(data_encoded);
    const hmac_url = `${process.env.BASE_URL}/${type}/${data_encoded}&${hmac_sig}`;

    return { ok: true, body: hmac_url, error: null };
  } catch (e) {
    const error = e as HttpError;
    return {
      ok: false,
      body: null,
      error: error.message,
    };
  }
}
