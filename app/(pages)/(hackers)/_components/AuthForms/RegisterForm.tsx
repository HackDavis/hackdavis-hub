'use client';

import { useRouter } from 'next/navigation';

import AuthForm from '@components/AuthForm/AuthForm';
import RegisterAction from '@actions/auth/register';

export default function RegisterForm({ data }: any) {
  const router = useRouter();

  const name = data?.name ?? 'HackDavis Admin';
  const role = data?.role ?? 'admin';

  const onSubmit = async (fields: any) => {
    return RegisterAction({
      name,
      email: data?.email ?? fields.email,
      password: fields.password,
      role,
      has_checked_in: true,
    });
  };

  const onSuccess = () => {
    if (role === 'admin') {
      router.push('/');
    } else {
      router.push('/register/details');
    }
  };

  const formFields = [
    {
      name: 'email' as const,
      type: 'email',
      label: 'EMAIL',
      placeholder: 'Email',
      readOnly: data ? true : false,
    },
    {
      name: 'password' as const,
      type: 'password',
      label: 'PASSWORD',
      placeholder: 'Password',
      readOnly: false,
    },
    {
      name: 'passwordDupe' as const,
      type: 'password',
      label: 'RETYPE PASSWORD',
      placeholder: 'Retype Password',
      readOnly: false,
    },
  ];

  return (
    <AuthForm
      fields={formFields}
      buttonText="Next →"
      initialValues={{
        email: data?.email ?? '',
        password: '',
        passwordDupe: '',
      }}
      onSubmit={onSubmit}
      onSuccess={onSuccess}
    />
  );
}
