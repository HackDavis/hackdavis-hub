'use server';
import { revalidatePath } from 'next/cache';

export default async function revalidatePathAction(
  path: string,
  type: 'page' | 'layout'
) {
  revalidatePath(path, type);
}
