'use client';

import AuthForm from '@components/AuthForm/AuthForm';
import sendEmail from '@actions/invite/sendEmail';

export default function ForgotPasswordForm() {
  const onSubmit = async (fields: any) => {
    return sendEmail({
      email: fields.email,
      role: 'hacker',
    });
  };

  const onSuccess = () => {
    alert('Password reset email sent!');
  };

  const formFields = [
    {
      name: 'email' as const,
      type: 'email',
      label: 'EMAIL',
      placeholder: 'Email',
      readOnly: false,
    },
  ];

  return (
    <AuthForm
      title="Hi Hacker!"
      subtitle="Please enter your new password below."
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
