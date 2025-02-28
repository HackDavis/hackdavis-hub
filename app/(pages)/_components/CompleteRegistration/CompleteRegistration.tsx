import { cookies } from 'next/headers';
import { redirect } from 'next/navigation';

export default async function CompleteRegistration({
  children,
}: {
  children: React.ReactNode;
}) {
  if (cookies().has('registerId') && cookies().has('role')) {
    const role = cookies().get('role')!.value;

    if (role === 'hacker') {
      redirect('/register/details');
    } else {
      redirect('/judges/register/details');
    }
  }

  return <>{children}</>;
}
