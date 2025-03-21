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

  return (
    <div className="container-lg py-16">
      <h1 className="text-3xl font-bold text-slate-900 mb-8">Professional Dashboard</h1>
      
      {needsSetup && (
        <div className="mb-8 rounded-md bg-red-50 border border-red-200 p-4">
          <div className="flex">
            <div className="flex-shrink-0">
              <svg className="h-5 w-5 text-red-500" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor">
                <path fillRule="evenodd" d="M8.257 3.099c.765-1.36 2.722-1.36 3.486 0l5.58 9.92c.75 1.334-.213 2.98-1.742 2.98H4.42c-1.53 0-2.493-1.646-1.743-2.98l5.58-9.92zM11 13a1 1 0 11-2 0 1 1 0 012 0zm-1-8a1 1 0 00-1 1v3a1 1 0 002 0V6a1 1 0 00-1-1z" clipRule="evenodd" />
              </svg>
            </div>
            <div className="ml-3">
              <p className="text-sm text-red-800">
                <span className="font-medium">Database setup required:</span> The database schema is not properly initialized. Please contact your system administrator.
              </p>
            </div>
          </div>
        </div>
      )}
      
      {!loading && user && !professional && !needsSetup && (
        <div className="mb-8 rounded-md bg-amber-50 border border-amber-200 p-4">
          <div className="flex">
            <div className="flex-shrink-0">
              <svg className="h-5 w-5 text-amber-500" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor">
                <path fillRule="evenodd" d="M8.257 3.099c.765-1.36 2.722-1.36 3.486 0l5.58 9.92c.75 1.334-.213 2.98-1.742 2.98H4.42c-1.53 0-2.493-1.646-1.743-2.98l5.58-9.92zM11 13a1 1 0 11-2 0 1 1 0 012 0zm-1-8a1 1 0 00-1 1v3a1 1 0 002 0V6a1 1 0 00-1-1z" clipRule="evenodd" />
              </svg>
            </div>
            <div className="ml-3">
              <p className="text-sm text-amber-800">
                <span className="font-medium">Complete your onboarding:</span> You need to complete your professional profile to access all features and manage clients.
              </p>
              <div className="mt-4">
                <Link
                  href="/onboarding"
                  className="btn btn-primary btn-md"
                >
                  Complete Professional Onboarding
                </Link>
              </div>
            </div>
          </div>
        </div>
      )}
      
      {/* Display error message if any */}
      {error && !needsSetup && (
        <div className="mb-8 rounded-md bg-red-50 border border-red-200 p-4">
          <div className="flex">
            <div className="flex-shrink-0">
              <svg className="h-5 w-5 text-red-500" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor">
                <path fillRule="evenodd" d="M8.257 3.099c.765-1.36 2.722-1.36 3.486 0l5.58 9.92c.75 1.334-.213 2.98-1.742 2.98H4.42c-1.53 0-2.493-1.646-1.743-2.98l5.58-9.92zM11 13a1 1 0 11-2 0 1 1 0 012 0zm-1-8a1 1 0 00-1 1v3a1 1 0 002 0V6a1 1 0 00-1-1z" clipRule="evenodd" />
              </svg>
            </div>
            <div className="ml-3">
              <p className="text-sm text-red-800">{error.message}</p>
            </div>
          </div>
        </div>
      )}

      {/* Show loading indicator */}
      {loading && (
        <div className="flex justify-center py-12">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-t-2 border-primary-600"></div>
        </div>
      )}

      {/* Professional dashboard content */}
      {!loading && professional && (
        <section className="space-y-8">
          {/* User Information */}
          <div className="card">
            <h2 className="text-xl font-semibold text-slate-900 mb-6">Personal Information</h2>
            
            <div className="grid grid-cols-1 gap-6 sm:grid-cols-2">
              <div className="space-y-1">
                <h3 className="text-sm font-medium text-slate-500">Name</h3>
                <p className="text-slate-900">{professional.first_name} {professional.last_name}</p>
              </div>
              
              <div className="space-y-1">
                <h3 className="text-sm font-medium text-slate-500">Email</h3>
                <p className="text-slate-900">{professional.email}</p>
              </div>
            </div>
          </div>

          {/* Stats Cards */}
          <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3">
            <div className="card p-5">
              <div className="flex items-center">
                <div className="flex-shrink-0 bg-primary-100 rounded-full p-3">
                  <svg className="h-6 w-6 text-primary-600" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4.354a4 4 0 110 5.292M15 21H3v-1a6 6 0 0112 0v1zm0 0h6v-1a6 6 0 00-9-5.197M13 7a4 4 0 11-8 0 4 4 0 018 0z" />
                  </svg>
                </div>
                <div className="ml-5">
                  <h3 className="text-sm font-medium text-slate-500">Total Clients</h3>
                  <p className="mt-1 text-2xl font-semibold text-slate-900">24</p>
                </div>
              </div>
            </div>
            
            <div className="card p-5">
              <div className="flex items-center">
                <div className="flex-shrink-0 bg-primary-100 rounded-full p-3">
                  <svg className="h-6 w-6 text-primary-600" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
                  </svg>
                </div>
                <div className="ml-5">
                  <h3 className="text-sm font-medium text-slate-500">Active This Week</h3>
                  <p className="mt-1 text-2xl font-semibold text-slate-900">8</p>
                </div>
              </div>
            </div>
            
            <div className="card p-5">
              <div className="flex items-center">
                <div className="flex-shrink-0 bg-primary-100 rounded-full p-3">
                  <svg className="h-6 w-6 text-primary-600" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2" />
                  </svg>
                </div>
                <div className="ml-5">
                  <h3 className="text-sm font-medium text-slate-500">Plan Completion</h3>
                  <p className="mt-1 text-2xl font-semibold text-slate-900">67%</p>
                </div>
              </div>
            </div>
          </div>

          {/* Quick actions */}
          <div className="card">
            <h2 className="text-xl font-semibold text-slate-900 mb-6">Quick Actions</h2>
            
            <div className="space-y-4 sm:space-y-0 sm:grid sm:grid-cols-2 sm:gap-6 lg:grid-cols-4">
              <Link 
                href="/dashboard/invites/new"
                className="btn btn-primary btn-md w-full"
              >
                Invite Client
              </Link>
              
              <Link 
                href="/dashboard/profile"
                className="btn btn-outline btn-md w-full"
              >
                Edit Profile
              </Link>
              
              <Link 
                href="/dashboard/clients"
                className="btn btn-outline btn-md w-full"
              >
                Manage Clients
              </Link>
              
              <Link 
                href="/dashboard/settings"
                className="btn btn-outline btn-md w-full"
              >
                Settings
              </Link>
            </div>
          </div>
          
          {/* Recent Activity */}
          <div className="card">
            <div className="flex items-center justify-between mb-6">
              <h2 className="text-xl font-semibold text-slate-900">Recent Activity</h2>
              <Link href="/dashboard/activity" className="text-sm font-medium text-primary-600 hover:text-primary-700">
                View All
              </Link>
            </div>
            
            <div className="space-y-4">
              {[1, 2, 3].map((_, index) => (
                <div key={index} className="flex items-start p-4 rounded-md bg-slate-50">
                  <div className="flex-shrink-0 mr-4">
                    <div className="h-10 w-10 rounded-full bg-primary-100 flex items-center justify-center">
                      <svg className="h-5 w-5 text-primary-600" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor">
                        <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm1-12a1 1 0 10-2 0v4a1 1 0 00.293.707l2.828 2.829a1 1 0 101.415-1.415L11 9.586V6z" clipRule="evenodd" />
                      </svg>
                    </div>
                  </div>
                  <div>
                    <p className="text-slate-900 font-medium">Client {index + 1} updated their profile</p>
                    <p className="text-sm text-slate-500 mt-1">Just now</p>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </section>
      )}

      {professional && (
        <div className="grid md:grid-cols-2 gap-8 mb-8">
          <div className="card">
            <h3 className="text-xl font-semibold mb-4">Quick Actions</h3>
            <div className="space-y-4">
              <Link href="/dashboard/clients" className="block w-full btn btn-secondary">
                Manage Clients
              </Link>
              <Link href="/conversation-demo" className="block w-full btn btn-primary">
                Try Conversational Interface
              </Link>
            </div>
          </div>
        </div>
      )}

      {/* Digital Estate Planning Modules */}
      {!loading && (professional || user) && (
        <section className="mt-8">
          <h2 className="text-2xl font-bold text-slate-900 mb-6">Digital Estate Planning</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            
            {/* Online Accounts Module */}
            <div className="card hover:shadow-md transition-shadow">
              <div className="p-6">
                <div className="flex items-center mb-4">
                  <div className="w-12 h-12 rounded-full bg-primary-100 flex items-center justify-center">
                    <svg className="h-6 w-6 text-primary-600" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z" />
                    </svg>
                  </div>
                  <h3 className="text-xl font-semibold ml-4">Online Accounts</h3>
                </div>
                <p className="text-slate-600 mb-6">
                  Securely document your online accounts for your designated contacts to access when needed.
                </p>
                <Link href="/online-accounts" className="btn btn-outline btn-md w-full">
                  Open Module
                </Link>
              </div>
            </div>
            
            {/* Digital Assets Module */}
            <div className="card hover:shadow-md transition-shadow">
              <div className="p-6">
                <div className="flex items-center mb-4">
                  <div className="w-12 h-12 rounded-full bg-primary-100 flex items-center justify-center">
                    <svg className="h-6 w-6 text-primary-600" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 10V3L4 14h7v7l9-11h-7z" />
                    </svg>
                  </div>
                  <h3 className="text-xl font-semibold ml-4">Digital Assets</h3>
                </div>
                <p className="text-slate-600 mb-6">
                  Document and plan for the future of your cryptocurrency, NFTs, and other valuable digital assets.
                </p>
                <Link href="/digital-assets" className="btn btn-outline btn-md w-full">
                  Open Module
                </Link>
              </div>
            </div>
            
            {/* Physical Documents Module */}
            <div className="card hover:shadow-md transition-shadow">
              <div className="p-6">
                <div className="flex items-center mb-4">
                  <div className="w-12 h-12 rounded-full bg-primary-100 flex items-center justify-center">
                    <svg className="h-6 w-6 text-primary-600" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                    </svg>
                  </div>
                  <h3 className="text-xl font-semibold ml-4">Physical Documents</h3>
                </div>
                <p className="text-slate-600 mb-6">
                  Create a guide to where your important physical documents are located and how to access them.
                </p>
                <Link href="/physical-documents" className="btn btn-outline btn-md w-full">
                  Open Module
                </Link>
              </div>
            </div>
            
            {/* End of Life Instructions Module */}
            <div className="card hover:shadow-md transition-shadow">
              <div className="p-6">
                <div className="flex items-center mb-4">
                  <div className="w-12 h-12 rounded-full bg-primary-100 flex items-center justify-center">
                    <svg className="h-6 w-6 text-primary-600" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16m14 0h2m-2 0h-5m-9 0H3m2 0h5M9 7h1m-1 4h1m4-4h1m-1 4h1m-5 10v-5a1 1 0 011-1h2a1 1 0 011 1v5m-4 0h4" />
                    </svg>
                  </div>
                  <h3 className="text-xl font-semibold ml-4">End-of-Life Instructions</h3>
                </div>
                <p className="text-slate-600 mb-6">
                  Document your funeral preferences, final wishes, and instructions for your loved ones.
                </p>
                <Link href="/end-of-life-instructions" className="btn btn-outline btn-md w-full">
                  Open Module
                </Link>
              </div>
            </div>
            
            {/* Legacy Planning Module */}
            <div className="card hover:shadow-md transition-shadow">
              <div className="p-6">
                <div className="flex items-center mb-4">
                  <div className="w-12 h-12 rounded-full bg-primary-100 flex items-center justify-center">
                    <svg className="h-6 w-6 text-primary-600" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6.253v13m0-13C10.832 5.477 9.246 5 7.5 5S4.168 5.477 3 6.253v13C4.168 18.477 5.754 18 7.5 18s3.332.477 4.5 1.253m0-13C13.168 5.477 14.754 5 16.5 5c1.747 0 3.332.477 4.5 1.253v13C19.832 18.477 18.247 18 16.5 18c-1.746 0-3.332.477-4.5 1.253" />
                    </svg>
                  </div>
                  <h3 className="text-xl font-semibold ml-4">Legacy Planning</h3>
                </div>
                <p className="text-slate-600 mb-6">
                  Document your life story and create a meaningful legacy that preserves your values and wisdom.
                </p>
                <Link href="/legacy-planning" className="btn btn-outline btn-md w-full">
                  Open Module
                </Link>
              </div>
            </div>
            
            {/* AI Assistant */}
            <div className="card hover:shadow-md transition-shadow">
              <div className="p-6">
                <div className="flex items-center mb-4">
                  <div className="w-12 h-12 rounded-full bg-primary-100 flex items-center justify-center">
                    <svg className="h-6 w-6 text-primary-600" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 10h.01M12 10h.01M16 10h.01M9 16H5a2 2 0 01-2-2V6a2 2 0 012-2h14a2 2 0 012 2v8a2 2 0 01-2 2h-5l-5 5v-5z" />
                    </svg>
                  </div>
                  <h3 className="text-xl font-semibold ml-4">AI Assistant</h3>
                </div>
                <p className="text-slate-600 mb-6">
                  Get personalized estate planning guidance with our AI assistant powered by Claude.
                </p>
                <Link href="/conversation-demo" className="btn btn-outline btn-md w-full">
                  Open Assistant
                </Link>
              </div>
            </div>
          </div>
        </section>
      )}
    </div>
  );
} 