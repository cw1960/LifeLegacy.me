'use client';

import React, { useState } from 'react';
import { useRouter } from 'next/navigation';
import { supabase } from '@/lib/supabase/client';

export default function RegisterForm() {
  const router = useRouter();
  const [fullName, setFullName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleRegister = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError(null);

    // Validate passwords match
    if (password !== confirmPassword) {
      setError("Passwords don't match");
      setLoading(false);
      return;
    }

    try {
      const { error } = await supabase.auth.signUp({
        email,
        password,
        options: {
          data: {
            full_name: fullName,
          },
        },
      });

      if (error) {
        throw error;
      }

      // Redirect to confirmation page or dashboard
      router.push('/auth/welcome');
    } catch (error: any) {
      setError(error.message || 'An error occurred during registration');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div>
      {error && (
        <div style={{ 
          marginBottom: '1.5rem', 
          borderRadius: '0.375rem', 
          backgroundColor: '#fee2e2', 
          border: '1px solid #fecaca', 
          padding: '1rem' 
        }}>
          <p style={{ fontSize: '0.875rem', color: '#b91c1c', fontWeight: '500' }}>{error}</p>
        </div>
      )}

      <form onSubmit={handleRegister}>
        <div style={{ marginBottom: '1rem' }}>
          <label
            htmlFor="fullName"
            style={{ 
              display: 'block', 
              fontSize: '0.875rem', 
              fontWeight: '500', 
              color: '#334155', 
              marginBottom: '0.25rem' 
            }}
          >
            Full Name
          </label>
          <input
            id="fullName"
            name="fullName"
            type="text"
            autoComplete="name"
            required
            value={fullName}
            onChange={(e) => setFullName(e.target.value)}
            style={{
              display: 'block',
              width: '100%',
              height: '2.5rem',
              padding: '0.5rem 0.75rem',
              fontSize: '0.875rem',
              lineHeight: '1.5',
              color: '#1e293b',
              backgroundColor: '#fff',
              backgroundClip: 'padding-box',
              border: '1px solid #cbd5e1',
              borderRadius: '0.375rem',
              transition: 'border-color 0.15s ease-in-out, box-shadow 0.15s ease-in-out'
            }}
            placeholder="John Doe"
          />
        </div>

        <div style={{ marginBottom: '1rem' }}>
          <label
            htmlFor="email"
            style={{ 
              display: 'block', 
              fontSize: '0.875rem', 
              fontWeight: '500', 
              color: '#334155', 
              marginBottom: '0.25rem' 
            }}
          >
            Email address
          </label>
          <input
            id="email"
            name="email"
            type="email"
            autoComplete="email"
            required
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            style={{
              display: 'block',
              width: '100%',
              height: '2.5rem',
              padding: '0.5rem 0.75rem',
              fontSize: '0.875rem',
              lineHeight: '1.5',
              color: '#1e293b',
              backgroundColor: '#fff',
              backgroundClip: 'padding-box',
              border: '1px solid #cbd5e1',
              borderRadius: '0.375rem',
              transition: 'border-color 0.15s ease-in-out, box-shadow 0.15s ease-in-out'
            }}
            placeholder="you@example.com"
          />
        </div>

        <div style={{ marginBottom: '1rem' }}>
          <label
            htmlFor="password"
            style={{ 
              display: 'block', 
              fontSize: '0.875rem', 
              fontWeight: '500', 
              color: '#334155', 
              marginBottom: '0.25rem' 
            }}
          >
            Password
          </label>
          <input
            id="password"
            name="password"
            type="password"
            autoComplete="new-password"
            required
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            style={{
              display: 'block',
              width: '100%',
              height: '2.5rem',
              padding: '0.5rem 0.75rem',
              fontSize: '0.875rem',
              lineHeight: '1.5',
              color: '#1e293b',
              backgroundColor: '#fff',
              backgroundClip: 'padding-box',
              border: '1px solid #cbd5e1',
              borderRadius: '0.375rem',
              transition: 'border-color 0.15s ease-in-out, box-shadow 0.15s ease-in-out'
            }}
            placeholder="••••••••"
          />
        </div>

        <div style={{ marginBottom: '1.5rem' }}>
          <label
            htmlFor="confirmPassword"
            style={{ 
              display: 'block', 
              fontSize: '0.875rem', 
              fontWeight: '500', 
              color: '#334155', 
              marginBottom: '0.25rem' 
            }}
          >
            Confirm Password
          </label>
          <input
            id="confirmPassword"
            name="confirmPassword"
            type="password"
            autoComplete="new-password"
            required
            value={confirmPassword}
            onChange={(e) => setConfirmPassword(e.target.value)}
            style={{
              display: 'block',
              width: '100%',
              height: '2.5rem',
              padding: '0.5rem 0.75rem',
              fontSize: '0.875rem',
              lineHeight: '1.5',
              color: '#1e293b',
              backgroundColor: '#fff',
              backgroundClip: 'padding-box',
              border: '1px solid #cbd5e1',
              borderRadius: '0.375rem',
              transition: 'border-color 0.15s ease-in-out, box-shadow 0.15s ease-in-out'
            }}
            placeholder="••••••••"
          />
        </div>

        <button
          type="submit"
          disabled={loading}
          style={{
            display: 'inline-flex',
            alignItems: 'center',
            justifyContent: 'center',
            width: '100%',
            backgroundColor: '#0284c7',
            color: 'white',
            fontWeight: '500',
            fontSize: '0.875rem',
            lineHeight: '1.25rem',
            padding: '0.625rem 1.25rem',
            borderRadius: '0.375rem',
            border: 'none',
            cursor: loading ? 'not-allowed' : 'pointer',
            opacity: loading ? 0.7 : 1,
            transition: 'background-color 0.2s'
          }}
        >
          {loading ? (
            <>
              <svg 
                style={{ 
                  animation: 'spin 1s linear infinite',
                  marginRight: '0.5rem',
                  height: '1rem',
                  width: '1rem' 
                }} 
                xmlns="http://www.w3.org/2000/svg" 
                fill="none" 
                viewBox="0 0 24 24"
              >
                <circle 
                  style={{ opacity: 0.25 }} 
                  cx="12" 
                  cy="12" 
                  r="10" 
                  stroke="currentColor" 
                  strokeWidth="4"
                ></circle>
                <path 
                  style={{ opacity: 0.75 }} 
                  fill="currentColor" 
                  d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
                ></path>
              </svg>
              Creating account...
            </>
          ) : (
            <>
              Sign up
            </>
          )}
        </button>

        <style jsx>{`
          @keyframes spin {
            from {
              transform: rotate(0deg);
            }
            to {
              transform: rotate(360deg);
            }
          }
        `}</style>
      </form>
    </div>
  );
} 