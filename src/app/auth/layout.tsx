import React from 'react';
import type { Metadata } from 'next';
import { Container } from 'react-bootstrap';

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
    <main className="min-vh-100 bg-light">
      {children}
    </main>
  );
} 