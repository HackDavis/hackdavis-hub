import { redirect } from 'next/navigation';

import DetailForm from '@pages/judges/_components/AuthForms/DetailForm';
import AuthFormBackground from '../../_components/AuthFormBackground/AuthFormBackground';
import getActiveUser from 'app/(pages)/_utils/getActiveUser';

export default async function DetailPage() {
  const user = await getActiveUser('/login');

  if (user.role === 'judge') redirect('/judges/register');

  return (
    <AuthFormBackground
      title={`Hi ${user.name}!`}
      subtitle={`One more thing before you enter the hub.
                Choose what suits you the most:`}
    >
      <DetailForm id={user._id} />
    </AuthFormBackground>
  );
}
