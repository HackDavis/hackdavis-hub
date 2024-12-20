import type { NextRequest, NextResponse } from 'next/server';

import { auth } from '@/auth';
import { HttpError, NotAuthenticatedError } from '@utils/response/Errors';

export default function authenticated(
  handler: (request: NextRequest, params: any) => Promise<NextResponse>
) {
  return async (request: NextRequest, params: object) => {
    try {
      const session = await auth();
      if (session?.user.role !== 'admin') {
        throw new NotAuthenticatedError('User not authenticated');
      }
    } catch (e) {
      const error = e as HttpError;
      return Response.json(
        { ok: false, body: null, error: error.message },
        { status: error.status || 401 }
      );
    }
    return handler(request, params);
  };
}
