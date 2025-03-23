'use client';

import React from 'react';
import Link from 'next/link';
import LoginForm from '@/components/auth/LoginForm';

export default function LoginPage() {
  return (
    <div style={{
      display: 'flex',
      minHeight: '100vh',
      alignItems: 'center',
      justifyContent: 'center',
      padding: '1.5rem',
      backgroundColor: '#f1f5f9'
    }}>
      <div style={{
        width: '100%',
        maxWidth: '32rem',
        padding: '2rem',
        backgroundColor: 'rgba(255, 255, 255, 0.9)',
        backdropFilter: 'blur(8px)',
        borderRadius: '0.75rem',
        boxShadow: '0 10px 15px -3px rgba(0, 0, 0, 0.1), 0 4px 6px -2px rgba(0, 0, 0, 0.05)',
        border: '1px solid rgba(255, 255, 255, 0.2)'
      }}>
        <div style={{ marginBottom: '2rem', textAlign: 'center' }}>
          <h2 style={{ 
            fontSize: '1.875rem',
            fontWeight: '700',
            marginBottom: '0.5rem',
            background: 'linear-gradient(to right, #0284c7, #38bdf8)',
            WebkitBackgroundClip: 'text',
            WebkitTextFillColor: 'transparent'
          }}>
            Welcome Back
          </h2>
          <p style={{ color: '#64748b', fontSize: '0.875rem' }}>
            Sign in to access your LifeLegacy account
          </p>
        </div>
        
        <LoginForm />
        
        <div style={{ marginTop: '1.5rem', textAlign: 'center', fontSize: '0.875rem' }}>
          <p style={{ color: '#64748b' }}>
            Don't have an account?{' '}
            <Link href="/auth/register" style={{ 
              color: '#0284c7', 
              textDecoration: 'none',
              fontWeight: '500'
            }}>
              Sign up
            </Link>
          </p>
        </div>
      </div>
    </div>
  );
} 