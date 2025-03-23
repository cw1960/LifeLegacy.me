import React from 'react';
import Link from 'next/link';

export default function WelcomePage() {
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
        border: '1px solid rgba(255, 255, 255, 0.2)',
        textAlign: 'center'
      }}>
        <div style={{ marginBottom: '2rem' }}>
          <div style={{ 
            width: '4rem', 
            height: '4rem', 
            margin: '0 auto',
            backgroundColor: '#dcfce7',
            borderRadius: '9999px',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center'
          }}>
            <svg 
              style={{ 
                width: '2rem', 
                height: '2rem', 
                color: '#16a34a' 
              }} 
              xmlns="http://www.w3.org/2000/svg" 
              fill="none" 
              viewBox="0 0 24 24" 
              stroke="currentColor"
            >
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
            </svg>
          </div>
          
          <h2 style={{ 
            fontSize: '1.875rem',
            fontWeight: '700',
            marginTop: '1.5rem',
            marginBottom: '0.5rem',
            background: 'linear-gradient(to right, #0284c7, #38bdf8)',
            WebkitBackgroundClip: 'text',
            WebkitTextFillColor: 'transparent'
          }}>
            Account Created!
          </h2>
          
          <p style={{ color: '#64748b', fontSize: '1rem', marginBottom: '1.5rem' }}>
            Thank you for creating your LifeLegacy account. Please check your email to verify your account.
          </p>
          
          <div style={{ marginTop: '2rem' }}>
            <Link 
              href="/auth/login" 
              style={{
                display: 'inline-block',
                backgroundColor: '#0284c7',
                color: 'white',
                fontWeight: '500',
                fontSize: '0.875rem',
                lineHeight: '1.25rem',
                padding: '0.625rem 1.25rem',
                borderRadius: '0.375rem',
                textDecoration: 'none',
                transition: 'background-color 0.2s'
              }}
            >
              Sign in to your account
            </Link>
          </div>
          
          <div style={{ marginTop: '1.5rem', fontSize: '0.875rem' }}>
            <p style={{ color: '#64748b' }}>
              Didn't receive an email?{' '}
              <Link 
                href="#" 
                style={{ 
                  color: '#0284c7', 
                  textDecoration: 'none',
                  fontWeight: '500'
                }}
                onClick={(e) => {
                  e.preventDefault();
                  alert('Verification email resent. Please check your inbox.');
                }}
              >
                Resend verification email
              </Link>
            </p>
          </div>
        </div>
      </div>
    </div>
  );
} 