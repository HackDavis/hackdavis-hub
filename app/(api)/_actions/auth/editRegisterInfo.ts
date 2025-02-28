'use server';

import { cookies } from 'next/headers';

export async function storeRegisterInfo(id: string, role: string) {
  cookies().set('registerId', id);
  cookies().set('role', role);
}

export async function deleteRegisterInfo() {
  cookies().delete('registerId');
  cookies().delete('role');
  cookies().delete('data');
  cookies().delete('sig');
}
