import React from 'react';
import type { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'LifeLegacy - Authentication',
  description: 'Login or register for a LifeLegacy account',
};

export default function AuthLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <main className="min-h-screen bg-gradient-to-br from-slate-50 to-slate-100">
      {children}
    </main>
  );
} 