'use client';

import { getManyUsers } from '@actions/users/getUser';
import { useState, useEffect } from 'react';

export function useFirstUser() {
  const [pending, setPending] = useState(true);
  const [noUsers, setNoUsers] = useState<boolean>(false);

  useEffect(() => {
    const firstUserWrapper = async () => {
      const userList = await getManyUsers();
      setNoUsers(userList.body.length === 0);
      setPending(false);
    };

    firstUserWrapper();
  }, []);
  return { pending, noUsers };
}
