'use client';

import HackerHub from './_components/HackerHub/HackerHub';
import ProtectedDisplay from '@components/ProtectedDisplay/ProtectedDisplay';
import LogoutAction from '@actions/auth/logout';

export default function Page() {
  return (
    <ProtectedDisplay allowedRoles="hacker admin">
      <HackerHub />
      <form action={LogoutAction}>
        <button type="submit">Sign Out</button>
      </form>
    </ProtectedDisplay>
  );
}
