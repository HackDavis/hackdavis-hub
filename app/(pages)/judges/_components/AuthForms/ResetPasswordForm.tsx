'use client';

import { useRouter } from 'next/navigation';

import AuthForm from '@components/AuthForm/AuthForm';
import ResetPasswordAction from '@actions/auth/resetPassword';

export default function ResetPasswordForm({ data }: any) {
  const router = useRouter();

  const onSubmit = async (fields: any) => {
    return ResetPasswordAction({
      email: data.email,
      password: fields.password,
    });
  };

  const onSuccess = () => {
    router.push('/judges/login');
  };

  const formFields = [
    {
      name: 'password' as const,
      type: 'password',
      label: 'New Password',
      placeholder: '',
      readOnly: false,
    },
    {
      name: 'passwordDupe' as const,
      type: 'password',
      label: 'Retype New Password',
      placeholder: '',
      readOnly: false,
    },
  ];

  return (
    <AuthForm
      role="judge"
      fields={formFields}
      buttonText="Reset Password →"
      initialValues={{
        password: '',
        passwordDupe: '',
      }}
      onSubmit={onSubmit}
      onSuccess={onSuccess}
    />
  );
}
