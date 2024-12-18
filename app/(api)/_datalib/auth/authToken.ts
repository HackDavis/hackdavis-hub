import { auth_expiration } from '@apidata/configs';
import jwt, { Secret } from 'jsonwebtoken';
import AuthToken from '@typeDefs/authToken';
import { HttpError } from '@utils/response/Errors';

export async function CreateAuthToken(data: object) {
  return jwt.sign(data, process.env.JWT_SECRET as Secret, {
    expiresIn: `${auth_expiration}h`,
  });
}

export async function VerifyAuthToken(token: string) {
  try {
    const decodedToken = jwt.decode(token) as AuthToken;

    // Ensure the token is not expired
    const currentTimestamp = Math.floor(Date.now() / 1000);
    if (decodedToken.exp && decodedToken.exp < currentTimestamp) {
      throw new HttpError('token has expired');
    }
    return { ok: true, body: decodedToken, error: null };
  } catch (e) {
    const error = e as HttpError;
    return { ok: false, body: null, error: error.message };
  }
}
