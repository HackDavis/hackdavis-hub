import { redirect } from 'next/navigation';

import DetailForm from '../../_components/AuthForms/DetailForm';
import AuthFormBackground from '../../_components/AuthFormBackground/AuthFormBackground';
import getActiveUser from 'app/(pages)/_utils/getActiveUser';

export default async function DetailPage() {
  const user = await getActiveUser('/judges/login');

  if (user.role === 'hacker') redirect('/register');

  return (
    <AuthFormBackground
      title={`Hi ${user.name}!`}
      subtitle="One more thing before you begin judging. Please rank your expertise in these domains from most experience to least experience."
    >
      <DetailForm id={user._id} />
    </AuthFormBackground>
  );
}
