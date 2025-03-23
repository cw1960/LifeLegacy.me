'use client';

import React from 'react';
import Link from 'next/link';
import LoginForm from '@/components/auth/LoginForm';

export default function LoginPage() {
  return (
    <div style={{ 
      display: 'flex', 
      justifyContent: 'center', 
      alignItems: 'center', 
      padding: '1.5rem',
      minHeight: '100vh'
    }}>
      <div style={{ 
        maxWidth: '400px', 
        width: '100%', 
        backgroundColor: 'rgba(255, 255, 255, 0.9)',
        backdropFilter: 'blur(8px)',
        border: '1px solid rgba(255, 255, 255, 0.2)',
        borderRadius: '0.75rem',
        boxShadow: '0 4px 6px -1px rgba(0, 0, 0, 0.1), 0 2px 4px -1px rgba(0, 0, 0, 0.06)',
        padding: '1.5rem'
      }}>
        <div style={{ textAlign: 'center', marginBottom: '2rem' }}>
          <Link href="/" style={{ display: 'inline-block', textDecoration: 'none' }}>
            <span style={{ position: 'absolute', width: '1px', height: '1px', padding: '0', margin: '-1px', overflow: 'hidden', clip: 'rect(0, 0, 0, 0)', whiteSpace: 'nowrap', borderWidth: '0' }}>
              LifeLegacy - Home
            </span>
            <h1 style={{ fontSize: '1.5rem', fontWeight: 'bold' }}>
              <span style={{ color: '#0284c7' }}>Life</span>
              <span style={{ color: '#0369a1' }}>Legacy</span>
            </h1>
          </Link>
          <h2 style={{ 
            marginTop: '1rem', 
            fontSize: '1.25rem', 
            fontWeight: '600',
            background: 'linear-gradient(90deg, #0284c7, #38bdf8)',
            WebkitBackgroundClip: 'text',
            WebkitTextFillColor: 'transparent',
            backgroundClip: 'text'
          }}>
            Welcome back
          </h2>
          <p style={{ marginTop: '0.5rem', fontSize: '0.875rem', color: '#64748b' }}>
            Sign in to your account to manage your digital legacy
          </p>
        </div>
        
        <LoginForm />
        
        <div style={{ marginTop: '2rem', textAlign: 'center' }}>
          <p style={{ fontSize: '0.875rem', color: '#64748b' }}>
            Don&apos;t have an account?{' '}
            <Link href="/auth/register" style={{ color: '#0284c7', fontWeight: '500', textDecoration: 'none' }}>
              Sign up
            </Link>
          </p>
          <p style={{ fontSize: '0.875rem', color: '#64748b', marginTop: '0.5rem' }}>
            <Link href="/auth/forgot-password" style={{ color: '#0284c7', fontWeight: '500', textDecoration: 'none' }}>
              Forgot your password?
            </Link>
          </p>
        </div>
      </div>
    </div>
  );
} 