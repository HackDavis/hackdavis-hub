'use client';

import { useRouter } from 'next/navigation';

import verifyCode from '@actions/auth/verifyCode';
import AuthForm from '@components/AuthForm/AuthForm';

export default function CheckInForm({ id }: any) {
  const router = useRouter();

  const onSubmit = async (fields: any) => {
    return verifyCode(id, fields.code);
  };

  const onSuccess = () => {
    router.push('/judges');
  };

  const formFields = [
    {
      name: 'code' as const,
      type: 'text',
      label: 'Check-in Code',
      placeholder: '',
      readOnly: false,
    },
  ];

  return (
    <AuthForm
      role="judge"
      fields={formFields}
      buttonText="Check in →"
      initialValues={{
        code: '',
      }}
      onSubmit={onSubmit}
      onSuccess={onSuccess}
    />
  );
}
