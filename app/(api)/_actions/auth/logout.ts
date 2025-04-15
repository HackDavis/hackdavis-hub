'use server';

import Logout from '@datalib/auth/logout';

export default async function LogoutAction() {
  return Logout();
}
