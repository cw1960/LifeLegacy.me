import React from 'react';
import type { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'LifeLegacy - Register',
  description: 'Create your LifeLegacy account',
};

export default function RegisterLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div className="min-h-screen flex items-center justify-center p-4 sm:p-6 md:p-8">
      {children}
    </div>
  );
} 