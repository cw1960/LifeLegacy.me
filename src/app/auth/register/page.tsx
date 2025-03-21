import React from 'react';
import type { Metadata } from 'next';
import RegisterForm from '@/components/auth/RegisterForm';
import Link from 'next/link';

export const metadata: Metadata = {
  title: 'LifeLegacy - Register',
  description: 'Create your LifeLegacy account',
};

export default function RegisterPage() {
  return (
    <div className="min-h-screen flex flex-col items-center justify-center bg-slate-50 py-12 px-4 sm:px-6 lg:px-8">
      <div className="w-full max-w-md">
        <div className="text-center mb-8">
          <h1 className="text-3xl font-bold text-slate-900">
            Create your account
          </h1>
          <p className="mt-2 text-slate-600">
            Start planning your digital legacy today
          </p>
        </div>

        <div className="card">
          <RegisterForm />

          <div className="mt-6 text-center text-sm">
            <p className="text-slate-600">
              Already have an account?{' '}
              <Link
                href="/auth/login"
                className="font-medium text-primary-600 hover:text-primary-700"
              >
                Sign in
              </Link>
            </p>
          </div>
        </div>
      </div>
    </div>
  );
} 