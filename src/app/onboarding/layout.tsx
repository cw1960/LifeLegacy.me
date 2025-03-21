'use client';

import React, { useEffect, useState } from 'react';
import { supabase } from '@/lib/supabase/client';
import { useRouter } from 'next/navigation';
import Image from 'next/image';
import Link from 'next/link';

export default function OnboardingLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const router = useRouter();
  const [user, setUser] = useState<any>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function getUser() {
      try {
        // Get current user
        const { data: { session }, error: sessionError } = await supabase.auth.getSession();
        
        if (sessionError) throw sessionError;
        
        if (!session) {
          router.push('/auth/login');
          return;
        }
        
        setUser(session.user);
        
        // Check if user is already a professional
        const { data: professionalData, error: professionalError } = await supabase
          .from('professionals')
          .select('*')
          .eq('user_id', session.user.id)
          .single();
        
        if (professionalData) {
          // User is already a professional, redirect to dashboard
          router.push('/dashboard');
          return;
        }
        
      } catch (error) {
        console.error('Error checking authentication:', error);
        router.push('/auth/login');
      } finally {
        setLoading(false);
      }
    }
    
    getUser();
  }, [router]);

  if (loading) {
    return (
      <div className="flex min-h-screen flex-col items-center justify-center">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-indigo-500"></div>
        <p className="mt-4 text-gray-600">Loading...</p>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <header className="bg-white shadow-sm">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between h-16 items-center">
            <div className="flex items-center">
              <Link href="/" className="flex items-center">
                <Image
                  src="/images/logo.svg"
                  alt="LifeLegacy Logo"
                  width={32}
                  height={32}
                  className="mr-2"
                />
                <span className="text-lg font-semibold text-gray-900">LifeLegacy</span>
              </Link>
            </div>
            {user && (
              <div className="flex items-center">
                <span className="text-sm text-gray-600 mr-4">
                  {user.user_metadata?.first_name} {user.user_metadata?.last_name}
                </span>
                <button
                  onClick={async () => {
                    await supabase.auth.signOut();
                    router.push('/auth/login');
                  }}
                  className="text-sm text-indigo-600 hover:text-indigo-800"
                >
                  Sign out
                </button>
              </div>
            )}
          </div>
        </div>
      </header>

      <main className="py-10">
        <div className="max-w-3xl mx-auto sm:px-6 lg:px-8">
          {user && children}
        </div>
      </main>
    </div>
  );
} 