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
    router.push('/login');
  };

  const formFields = [
    {
      name: 'password' as const,
      type: 'password',
      label: 'NEW PASSWORD',
      placeholder: 'New Password',
      readOnly: false,
    },
    {
      name: 'passwordDupe' as const,
      type: 'password',
      label: 'RETYPE NEW PASSWORD',
      placeholder: 'Retype New Password',
      readOnly: false,
    },
  ];

  return (
    <AuthForm
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
