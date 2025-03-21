'use client';

import React from 'react';
import Link from 'next/link';
import LoginForm from '@/components/auth/LoginForm';

export default function LoginPage() {
  return (
    <div className="flex items-center justify-center p-6">
      <div className="glass-card max-w-md w-full">
        <div className="text-center mb-8">
          <Link href="/" className="inline-block">
            <span className="sr-only">LifeLegacy - Home</span>
            <h1 className="text-3xl font-bold">
              <span className="text-primary-600">Life</span>
              <span className="text-primary-800">Legacy</span>
            </h1>
          </Link>
          <h2 className="mt-4 text-xl font-semibold gradient-text">
            Welcome back
          </h2>
          <p className="mt-2 text-sm text-slate-600">
            Sign in to your account to manage your digital legacy
          </p>
        </div>
        
        <LoginForm />
        
        <div className="mt-8 text-center">
          <p className="text-sm text-slate-600">
            Don&apos;t have an account?{' '}
            <Link href="/auth/register" className="text-primary-600 hover:text-primary-500 font-medium">
              Sign up
            </Link>
          </p>
          <p className="text-sm text-slate-600 mt-2">
            <Link href="/auth/forgot-password" className="text-primary-600 hover:text-primary-500 font-medium">
              Forgot your password?
            </Link>
          </p>
        </div>
      </div>
    </div>
  );
} 