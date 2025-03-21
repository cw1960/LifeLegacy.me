import React from 'react';
import type { Metadata } from 'next';
import Link from 'next/link';

export const metadata: Metadata = {
  title: 'LifeLegacy - Verify Email',
  description: 'Verify your email address',
};

export default function VerifyEmailPage() {
  return (
    <div className="min-h-screen flex flex-col items-center justify-center bg-slate-50 py-12 px-4 sm:px-6 lg:px-8">
      <div className="w-full max-w-md">
        <div className="card text-center">
          <h1 className="text-3xl font-bold text-slate-900 mb-4">
            Check your email
          </h1>
          <p className="text-slate-600 mb-6">
            We've sent you a verification link to your email address. Please
            check your inbox and click on the link to verify your account.
          </p>
          <div className="rounded-md bg-amber-50 border border-amber-200 p-4 mb-8">
            <div className="flex">
              <div className="flex-shrink-0">
                <svg
                  className="h-5 w-5 text-amber-500"
                  xmlns="http://www.w3.org/2000/svg"
                  viewBox="0 0 20 20"
                  fill="currentColor"
                  aria-hidden="true"
                >
                  <path
                    fillRule="evenodd"
                    d="M8.257 3.099c.765-1.36 2.722-1.36 3.486 0l5.58 9.92c.75 1.334-.213 2.98-1.742 2.98H4.42c-1.53 0-2.493-1.646-1.743-2.98l5.58-9.92zM11 13a1 1 0 11-2 0 1 1 0 012 0zm-1-8a1 1 0 00-1 1v3a1 1 0 002 0V6a1 1 0 00-1-1z"
                    clipRule="evenodd"
                  />
                </svg>
              </div>
              <div className="ml-3">
                <p className="text-left text-sm text-amber-800">
                  If you don't see the email in your inbox, please check your
                  spam folder. The email was sent from{' '}
                  <span className="font-medium">noreply@lifelegacy.me</span>
                </p>
              </div>
            </div>
          </div>

          <Link
            href="/auth/login"
            className="btn btn-primary"
          >
            Back to login
          </Link>
        </div>
      </div>
    </div>
  );
} 