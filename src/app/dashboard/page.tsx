'use client';

import React, { useEffect, useState } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { supabase } from '@/lib/supabase/client';

async function checkUserIsProfessional(userId: string) {
  console.log('Checking professional status with userId:', userId);
  try {
    // First try to fetch the professional record directly with more detailed debugging
    console.log('Executing query to professionals table with auth_user_id =', userId);
    // Use a direct SQL query instead of the ORM to ensure we're using the right column name
    const { data, error } = await supabase
      .from('professionals')
      .select('*')
      .eq('auth_user_id', userId)
      .limit(1);

    console.log('Query result:', { data, error, count: data?.length });

    if (error) {
      // Handle case where the table does not exist
      if (error.message.includes('relation "public.professionals" does not exist')) {
        console.error('Professionals table does not exist');
        return { isProfessional: false, databaseError: true, error, professionalData: null };
      }
      
      console.error('Error checking professional status:', error);
      return { isProfessional: false, databaseError: false, error, professionalData: null };
    }

    // If we got data back (array length > 0), user is a professional
    console.log('Professional record found:', data);
    return { 
      isProfessional: Array.isArray(data) && data.length > 0, 
      databaseError: false, 
      error: null, 
      professionalData: data && data.length > 0 ? data[0] : null 
    };
  } catch (error) {
    console.error('Exception in checkUserIsProfessional:', error);
    return { isProfessional: false, databaseError: false, error, professionalData: null };
  }
}

export default function DashboardPage() {
  const router = useRouter();
  const [user, setUser] = useState<any>(null);
  const [professional, setProfessional] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<Error | null>(null);
  const [needsSetup, setNeedsSetup] = useState(false);

  useEffect(() => {
    async function getUser() {
      try {
        setLoading(true);
        
        const { data: { session } } = await supabase.auth.getSession();
        
        if (!session) {
          router.push('/auth/login');
          return;
        }

        console.log('Checking professional status for user:', session.user.id);
        
        const { isProfessional, databaseError, error: professionalError, professionalData } = await checkUserIsProfessional(session.user.id);

        // If there's an error checking professional status because the table doesn't exist
        if (databaseError) {
          setNeedsSetup(true);
          setError(professionalError as Error);
          setLoading(false);
          return;
        }

        setUser(session.user);
        setProfessional(isProfessional ? professionalData : false);
        
        console.log('Professional status check result:', { isProfessional, professionalData });
        
        setLoading(false);
      } catch (err) {
        console.error('Error in getUser:', err);
        setError(err as Error);
        setLoading(false);
      }
    }
    
    getUser();
  }, [router]);

  const handleSignOut = async () => {
    await supabase.auth.signOut();
    router.push('/');
    router.refresh();
  };

  if (loading) {
    return (
      <div style={{
        display: 'flex',
        justifyContent: 'center',
        alignItems: 'center',
        minHeight: '100vh',
        backgroundColor: '#f1f5f9'
      }}>
        <div style={{ 
          display: 'flex', 
          flexDirection: 'column', 
          alignItems: 'center' 
        }}>
          <svg 
            style={{ 
              animation: 'spin 1s linear infinite',
              height: '3rem',
              width: '3rem',
              color: '#0284c7'
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
          <p style={{ 
            marginTop: '1rem', 
            fontSize: '0.875rem', 
            color: '#64748b',
            fontWeight: '500'
          }}>
            Loading your dashboard...
          </p>
        </div>
        <style jsx>{`
          @keyframes spin {
            from { transform: rotate(0deg); }
            to { transform: rotate(360deg); }
          }
        `}</style>
      </div>
    );
  }

  return (
    <div style={{
      backgroundColor: '#f1f5f9',
      minHeight: '100vh'
    }}>
      {/* Header */}
      <header style={{
        backgroundColor: 'white',
        padding: '1rem',
        boxShadow: '0 1px 3px 0 rgba(0, 0, 0, 0.1), 0 1px 2px 0 rgba(0, 0, 0, 0.06)',
        display: 'flex',
        justifyContent: 'space-between',
        alignItems: 'center'
      }}>
        <div style={{ 
          fontSize: '1.25rem', 
          fontWeight: 'bold', 
          background: 'linear-gradient(to right, #0284c7, #38bdf8)',
          WebkitBackgroundClip: 'text',
          WebkitTextFillColor: 'transparent' 
        }}>
          LifeLegacy
        </div>
        
        <div style={{ display: 'flex', alignItems: 'center', gap: '1rem' }}>
          <div style={{
            display: 'flex',
            alignItems: 'center',
            padding: '0.5rem',
            borderRadius: '9999px',
            backgroundColor: '#f1f5f9'
          }}>
            <div style={{
              width: '2rem',
              height: '2rem',
              borderRadius: '9999px',
              backgroundColor: '#0284c7',
              color: 'white',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              fontWeight: '600',
              fontSize: '0.875rem'
            }}>
              {user?.email?.charAt(0).toUpperCase() || 'U'}
            </div>
            <span style={{ 
              marginLeft: '0.5rem', 
              marginRight: '0.5rem',
              fontSize: '0.875rem',
              color: '#334155',
              fontWeight: '500'
            }}>
              {user?.email}
            </span>
          </div>
          
          <button
            onClick={handleSignOut}
            style={{
              backgroundColor: 'transparent',
              border: '1px solid #e2e8f0',
              borderRadius: '0.375rem',
              padding: '0.5rem 1rem',
              fontSize: '0.875rem',
              color: '#64748b',
              cursor: 'pointer',
              transition: 'all 0.2s'
            }}
          >
            Sign Out
          </button>
        </div>
      </header>
      
      {/* Main Content */}
      <main style={{ padding: '2rem' }}>
        <div style={{
          backgroundColor: 'white',
          borderRadius: '0.5rem',
          boxShadow: '0 1px 3px 0 rgba(0, 0, 0, 0.1), 0 1px 2px 0 rgba(0, 0, 0, 0.06)',
          padding: '1.5rem'
        }}>
          <h1 style={{ 
            fontSize: '1.5rem', 
            fontWeight: '600', 
            color: '#1e293b',
            marginBottom: '1rem'
          }}>
            Welcome to your Dashboard
          </h1>
          
          <p style={{ color: '#64748b', marginBottom: '1.5rem' }}>
            This is where you'll manage your digital legacy. We're still building out features, so check back soon for updates!
          </p>
          
          <div style={{
            display: 'grid',
            gridTemplateColumns: 'repeat(auto-fill, minmax(300px, 1fr))',
            gap: '1rem',
            marginTop: '2rem'
          }}>
            {/* Feature Card 1 */}
            <div style={{
              backgroundColor: '#f8fafc',
              borderRadius: '0.5rem',
              padding: '1.5rem',
              border: '1px solid #e2e8f0'
            }}>
              <div style={{
                height: '3rem',
                width: '3rem',
                backgroundColor: '#dbeafe',
                borderRadius: '0.5rem',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                marginBottom: '1rem'
              }}>
                <svg
                  style={{ height: '1.5rem', width: '1.5rem', color: '#2563eb' }}
                  xmlns="http://www.w3.org/2000/svg"
                  fill="none"
                  viewBox="0 0 24 24"
                  stroke="currentColor"
                >
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                </svg>
              </div>
              <h3 style={{ fontSize: '1.125rem', fontWeight: '600', color: '#1e293b', marginBottom: '0.5rem' }}>
                Document Storage
              </h3>
              <p style={{ fontSize: '0.875rem', color: '#64748b' }}>
                Securely store important documents and make them accessible to trusted contacts when needed.
              </p>
            </div>
            
            {/* Feature Card 2 */}
            <div style={{
              backgroundColor: '#f8fafc',
              borderRadius: '0.5rem',
              padding: '1.5rem',
              border: '1px solid #e2e8f0'
            }}>
              <div style={{
                height: '3rem',
                width: '3rem',
                backgroundColor: '#dcfce7',
                borderRadius: '0.5rem',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                marginBottom: '1rem'
              }}>
                <svg
                  style={{ height: '1.5rem', width: '1.5rem', color: '#16a34a' }}
                  xmlns="http://www.w3.org/2000/svg"
                  fill="none"
                  viewBox="0 0 24 24"
                  stroke="currentColor"
                >
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z" />
                </svg>
              </div>
              <h3 style={{ fontSize: '1.125rem', fontWeight: '600', color: '#1e293b', marginBottom: '0.5rem' }}>
                Trusted Contacts
              </h3>
              <p style={{ fontSize: '0.875rem', color: '#64748b' }}>
                Designate trusted individuals who will have access to your digital assets when needed.
              </p>
            </div>
          </div>
        </div>
      </main>
    </div>
  );
} 