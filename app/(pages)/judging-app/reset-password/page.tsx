'use client';
import { Suspense } from 'react';
import InviteOnlyRoute from '@components/InviteOnlyRoute/InviteOnlyRoute';
import ResetPasswordPage from '../_components/ResetPasswordForm/ResetPasswordPage';

export default function ResetPassword() {
  return (
    <Suspense>
      <InviteOnlyRoute>
        <ResetPasswordPage />
      </InviteOnlyRoute>
    </Suspense>
  );
}
