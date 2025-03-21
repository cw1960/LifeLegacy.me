'use client';

import React, { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import EstatePlanningAssistant from '@/components/conversation/EstatePlanningAssistant';
import { supabase } from '@/lib/supabase/client';
import { useAuthStore } from '@/lib/store/auth';
import { useOrganizationStore } from '@/lib/store/organization';

export default function LegacyPlanningPage() {
  const router = useRouter();
  const { setUser, user } = useAuthStore();
  const { setCurrentOrganization } = useOrganizationStore();
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    async function setupUser() {
      try {
        setLoading(true);
        
        // Check if user is authenticated
        const { data: { session } } = await supabase.auth.getSession();
        
        if (!session) {
          // Redirect to login if not authenticated
          router.push('/auth/login');
          return;
        }
        
        // Set the current user in the store
        const user = session.user;
        setUser({
          id: user.id,
          email: user.email || '',
          firstName: user.user_metadata?.first_name || '',
          lastName: user.user_metadata?.last_name || '',
        });
        
        // Get organizations for the current user
        const { data: organizations, error: orgError } = await supabase
          .from('organizations')
          .select('*')
          .limit(1);
        
        if (orgError) {
          throw new Error('Failed to fetch organization data');
        }
        
        if (!organizations || organizations.length === 0) {
          setError('No organizations found. Please complete onboarding first.');
          setLoading(false);
          return;
        }
        
        // Set the first organization as current
        setCurrentOrganization(organizations[0]);
        setLoading(false);
      } catch (err) {
        console.error('Error setting up user:', err);
        setError(err instanceof Error ? err.message : 'An unexpected error occurred');
        setLoading(false);
      }
    }
    
    setupUser();
  }, [router, setUser, setCurrentOrganization]);

  return (
    <div className="min-h-screen bg-slate-50">
      <div className="container-lg py-8">
        <div className="flex justify-between items-center mb-8">
          <div>
            <h1 className="text-3xl font-bold text-slate-900">Legacy Planning</h1>
            <p className="text-slate-600 mt-2">Plan how you want to be remembered and share your life story</p>
          </div>
          <Link href="/dashboard" className="btn btn-outline btn-md">
            Back to Dashboard
          </Link>
        </div>
        
        {error && (
          <div className="card p-4 mb-8 bg-red-50 border-red-200 text-red-700">
            <p>{error}</p>
            <div className="mt-4">
              <Link href="/onboarding" className="btn btn-primary btn-md">
                Complete Onboarding
              </Link>
            </div>
          </div>
        )}
        
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          <div className="md:col-span-2">
            {loading ? (
              <div className="card p-8 flex justify-center items-center">
                <p className="text-slate-500">Loading...</p>
              </div>
            ) : !error ? (
              <div className="card p-0 overflow-hidden" style={{ height: "70vh" }}>
                <div className="bg-primary-600 text-white p-4">
                  <h2 className="text-xl font-semibold">Legacy Planning Assistant</h2>
                  <p className="text-sm opacity-80">Create a meaningful legacy plan and personal history</p>
                </div>
                <div className="h-full">
                  <EstatePlanningAssistant moduleType="legacy-planning" />
                </div>
              </div>
            ) : null}
          </div>
          
          <div className="space-y-6">
            <div className="card">
              <h3 className="text-lg font-medium mb-4">About Legacy Planning</h3>
              <p className="text-slate-600 mb-4">
                Legacy planning goes beyond financial and legal considerations to focus on how you want to be 
                remembered and the personal history you want to share. This includes:
              </p>
              <ul className="list-disc list-inside text-slate-600 mb-4 ml-2">
                <li>Your life story and important memories</li>
                <li>Values and wisdom you wish to pass on</li>
                <li>Ethical will and personal letters</li>
                <li>Family history and genealogy</li>
                <li>Photos and mementos with their stories</li>
                <li>Charitable and philanthropic intentions</li>
                <li>Personal achievements and contributions</li>
              </ul>
              <p className="text-slate-600">
                This module helps you create a comprehensive legacy plan that preserves your story and values
                for future generations.
              </p>
            </div>
            
            <div className="card">
              <h3 className="text-lg font-medium mb-4">Why This Matters</h3>
              <p className="text-slate-600 mb-4">
                Creating a thoughtful legacy plan:
              </p>
              <ul className="list-disc list-inside text-slate-600 ml-2">
                <li>Preserves your life story and wisdom for future generations</li>
                <li>Communicates your values and what mattered most to you</li>
                <li>Provides context to family heirlooms and keepsakes</li>
                <li>Creates meaningful connections across generations</li>
                <li>Offers comfort to loved ones after you're gone</li>
                <li>Ensures your impact and memory lives on in meaningful ways</li>
              </ul>
            </div>
            
            <div className="card">
              <h3 className="text-lg font-medium mb-4">Getting Started</h3>
              <p className="text-slate-600 mb-2">
                Our Legacy Planning Assistant can help you:
              </p>
              <ul className="list-disc list-inside text-slate-600 ml-2">
                <li>Record your life story through guided prompts</li>
                <li>Document important relationships and their impact</li>
                <li>Articulate your personal values and philosophy</li>
                <li>Create ethical wills and legacy letters</li>
                <li>Plan meaningful charitable and community contributions</li>
                <li>Develop a comprehensive legacy plan</li>
              </ul>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
} 