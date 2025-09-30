'use client';

import { useRouter } from 'next/navigation';

import verifyCode from '@actions/auth/verifyCode';
import AuthForm from '@components/AuthForm/AuthForm';

export default function CheckInForm({ id }: any) {
  const router = useRouter();

  const onSubmit = async (fields: any) =>
    // include opt-in boolean when verifying
    verifyCode(id, fields.code, !!fields.opted_into_panels);

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
    {
      name: 'opted_into_panels',
      type: 'checkbox',
      label: "I'd like to be on a judging panel",
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
        opted_into_panels: false,
      }}
      onSubmit={onSubmit}
      onSuccess={onSuccess}
    />
  );
}
