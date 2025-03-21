'use client';

import React from 'react';
import Link from 'next/link';
import RegisterForm from '@/components/auth/RegisterForm';

export default function RegisterPage() {
  return (
    <div className="w-full max-w-md">
      <div className="max-w-md w-full rounded-xl bg-white/90 backdrop-blur-sm shadow-xl p-6 border border-white/20">
        <div className="text-center mb-8">
          <Link href="/" className="inline-block">
            <span className="sr-only">LifeLegacy - Home</span>
            <h1 className="text-3xl font-bold">
              <span className="text-primary-600">Life</span>
              <span className="text-primary-800">Legacy</span>
            </h1>
          </Link>
          <h2 className="mt-4 text-xl font-semibold text-transparent bg-clip-text bg-gradient-to-r from-primary-600 to-primary-400">
            Create your account
          </h2>
          <p className="mt-2 text-sm text-slate-600">
            Start building your digital estate plan
          </p>
        </div>
        
        <RegisterForm />
        
        <div className="mt-8 text-center">
          <p className="text-sm text-slate-600">
            Already have an account?{' '}
            <Link href="/auth/login" className="text-primary-600 hover:text-primary-500 font-medium">
              Sign in
            </Link>
          </p>
        </div>
      </div>
    </div>
  );
} 