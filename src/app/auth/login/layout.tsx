import React from 'react';
import type { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'LifeLegacy - Login',
  description: 'Log in to your LifeLegacy account',
};

export default function LoginLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-slate-50 to-slate-100 p-4 sm:p-6 md:p-8">
      {children}
    </div>
  );
} 