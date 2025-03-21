import React from 'react';
import type { Metadata } from 'next';
import LoginForm from '@/components/auth/LoginForm';
import Link from 'next/link';

export const metadata: Metadata = {
  title: 'LifeLegacy - Login',
  description: 'Log in to your LifeLegacy account',
};

export default function LoginPage() {
  return (
    <div className="min-h-screen flex flex-col items-center justify-center bg-slate-50 py-12 px-4 sm:px-6 lg:px-8">
      <div className="w-full max-w-md">
        <div className="text-center mb-8">
          <h1 className="text-3xl font-bold text-slate-900">
            Welcome back
          </h1>
          <p className="mt-2 text-slate-600">
            Sign in to your account to continue
          </p>
        </div>

        <div className="card">
          <LoginForm />

          <div className="mt-6 text-center text-sm">
            <p className="text-slate-600">
              Don&apos;t have an account?{' '}
              <Link
                href="/auth/register"
                className="font-medium text-primary-600 hover:text-primary-700"
              >
                Sign up
              </Link>
            </p>
            <p className="mt-2 text-slate-600">
              <Link
                href="/auth/forgot-password"
                className="font-medium text-primary-600 hover:text-primary-700"
              >
                Forgot your password?
              </Link>
            </p>
          </div>
        </div>
      </div>
    </div>
  );
} 