'use client';

import { useRouter } from 'next/navigation';

import LoginAction from '@actions/auth/login';
import AuthForm from '@components/AuthForm/AuthForm';

export default function LoginForm() {
  const router = useRouter();

  const onSubmit = async (fields: any) => {
    return LoginAction(fields.email, fields.password);
  };

  const onSuccess = () => {
    router.push('/');
  };

  const formFields = [
    {
      name: 'email' as const,
      type: 'email',
      label: '', //2026 design removed labels, so leaving blank
      placeholder: 'Email',
      readOnly: false,
    },
    {
      name: 'password' as const,
      type: 'password',
      label: '', //2026 design removed labels, so leaving blank
      placeholder: 'Password',
      readOnly: false,
    },
  ];

  return (
    <AuthForm
      role="hacker"
      fields={formFields}
      buttonText="Log in →"
      linkText="Forgot Password?"
      linkHref="/login/forgot-password"
      initialValues={{
        email: '',
        password: '',
      }}
      onSubmit={onSubmit}
      onSuccess={onSuccess}
    />
  );
}
