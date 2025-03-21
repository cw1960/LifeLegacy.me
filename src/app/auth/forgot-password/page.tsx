import React from 'react';
import type { Metadata } from 'next';
import ForgotPasswordForm from '@/components/auth/ForgotPasswordForm';
import Link from 'next/link';

export const metadata: Metadata = {
  title: 'LifeLegacy - Forgot Password',
  description: 'Reset your LifeLegacy account password',
};

export default function ForgotPasswordPage() {
  return (
    <div className="min-h-screen flex flex-col items-center justify-center bg-slate-50 py-12 px-4 sm:px-6 lg:px-8">
      <div className="w-full max-w-md">
        <div className="text-center mb-8">
          <h1 className="text-3xl font-bold text-slate-900">
            Reset your password
          </h1>
          <p className="mt-2 text-slate-600">
            Enter your email and we'll send you a reset link
          </p>
        </div>

        <div className="card">
          <ForgotPasswordForm />

          <div className="mt-6 text-center text-sm">
            <p className="text-slate-600">
              <Link
                href="/auth/login"
                className="font-medium text-primary-600 hover:text-primary-700"
              >
                Back to login
              </Link>
            </p>
          </div>
        </div>
      </div>
    </div>
  );
} 