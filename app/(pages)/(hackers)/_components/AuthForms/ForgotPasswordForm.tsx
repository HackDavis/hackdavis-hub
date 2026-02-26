'use client';

import AuthForm from '@components/AuthForm/AuthForm';
import sendEmail from '@actions/invite/sendEmail';

export default function ForgotPasswordForm() {
  const onSubmit = async (fields: any) => {
    return sendEmail(
      {
        email: fields.email,
        role: 'hacker',
      },
      'reset'
    );
  };

  const onSuccess = () => {
    alert('Password reset email sent!');
  };

  const formFields = [
    {
      name: 'email' as const,
      type: 'email',
      label: '', //2026 design removed labels, so leaving blank
      placeholder: 'Email',
      readOnly: false,
    },
  ];

  return (
    <AuthForm
      role="hacker"
      fields={formFields}
      buttonText="Send Email →"
      initialValues={{
        email: '',
      }}
      onSubmit={onSubmit}
      onSuccess={onSuccess}
    />
  );
}
