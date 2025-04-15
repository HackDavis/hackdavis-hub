import crypto from "crypto";

export function verifyHMACSignature(data: string, signature: string) {
  try {
    const recreatedSignature = generateHMACSignature(data);
    const match = crypto.timingSafeEqual(
      Buffer.from(signature, "hex"),
      Buffer.from(recreatedSignature as string, "hex"),
    );
    const data_json = JSON.parse(atob(data));
    if (Date.now() >= data_json.exp) {
      return false;
    }
    return match;
  } catch {
    return false;
  }
}

export function generateHMACSignature(data: string) {
  try {
    const hmac = crypto.createHmac(
      "sha256",
      process.env.HMAC_INVITE_SECRET as string,
    );
    hmac.update(data);
    return hmac.digest("hex");
  } catch {
    return null;
  }
}
