import React from 'react';
import type { Metadata } from 'next';
import ResetPasswordForm from '@/components/auth/ResetPasswordForm';

export const metadata: Metadata = {
  title: 'LifeLegacy - Reset Password',
  description: 'Reset your LifeLegacy account password',
};

export default function ResetPasswordPage() {
  return (
    <div className="min-h-screen flex flex-col items-center justify-center bg-slate-50 py-12 px-4 sm:px-6 lg:px-8">
      <div className="w-full max-w-md">
        <div className="text-center mb-8">
          <h1 className="text-3xl font-bold text-slate-900">
            Reset your password
          </h1>
          <p className="mt-2 text-slate-600">
            Enter your new password below
          </p>
        </div>

        <div className="card">
          <ResetPasswordForm />
        </div>
      </div>
    </div>
  );
} 