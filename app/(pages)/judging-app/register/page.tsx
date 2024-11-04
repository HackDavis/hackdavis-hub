'use client';
import { Suspense } from 'react';
import InviteOnlyRoute from '@components/InviteOnlyRoute/InviteOnlyRoute';
import RegisterPage from '../_components/RegisterForm/RegisterPage';

export default function Register() {
  return (
    <Suspense>
      <InviteOnlyRoute>
        <RegisterPage />
      </InviteOnlyRoute>
    </Suspense>
  );
}
