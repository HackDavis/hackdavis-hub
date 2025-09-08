'use client';

import { useRouter } from 'next/navigation';

import LoginAction from '@actions/auth/login';
import AuthForm from '@components/AuthForm/AuthForm';
import { signIn } from 'next-auth/react';

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
      label: 'EMAIL',
      placeholder: 'Email',
      readOnly: false,
    },
    {
      name: 'password' as const,
      type: 'password',
      label: 'PASSWORD',
      placeholder: 'Password',
      readOnly: false,
    },
  ];

  const handleGoogleLogin = async () => {
    await signIn('google', { callbackUrl: '/' });
  };

  return (
    <div>
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
    <button
        onClick={handleGoogleLogin}
        style={{
          marginTop: '1rem',
          padding: '0.75rem 1.5rem',
          backgroundColor: '#4285F4',
          color: '#fff',
          borderRadius: '6px',
          fontWeight: 'bold',
          cursor: 'pointer',
        }}
      >
        Sign in with Google
      </button>
    </div>
  );
}
