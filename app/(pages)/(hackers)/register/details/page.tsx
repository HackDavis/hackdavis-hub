import { redirect } from 'next/navigation';

import DetailForm from '@pages/(hackers)/_components/AuthForms/register/DetailForm';
import getActiveUser from 'app/(pages)/_utils/getActiveUser';

export default async function DetailPage() {
  const user = await getActiveUser('/login');

  if (user.role === 'judge') redirect('/judges/register');

  return <DetailForm id={user._id} />;
}
