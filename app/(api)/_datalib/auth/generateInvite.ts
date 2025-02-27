import { generateHMACSignature } from '@utils/invite/hmac';
import InviteData from '@typeDefs/inviteData';
import HttpError from '@utils/response/HttpError';

export default async function GenerateInvite(data: InviteData) {
  try {
    const role = data.role;
    if (role !== 'hacker' && role !== 'judge') {
      throw new HttpError('Unknown role. Choose either hacker or judge.');
    }

    data['exp'] =
      Date.now() +
      1000 *
        60 *
        60 *
        24 *
        (parseInt(process.env.INVITE_TIMEOUT as string) ?? 7);
    const data_encoded = btoa(JSON.stringify(data));

    const hmac_sig = generateHMACSignature(data_encoded);
    const hmac_url = `${process.env.BASE_URL}/invite/${data_encoded}&${hmac_sig}`;

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
