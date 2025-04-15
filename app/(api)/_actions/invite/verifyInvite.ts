'use server';

import { verifyHMACSignature } from '@utils/invite/hmac';

export default async function verifyInvite(data: string, signature: string) {
  const status = verifyHMACSignature(data as string, signature as string);
  return status;
}
