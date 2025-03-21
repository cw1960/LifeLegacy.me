'use client';

import React, { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import EstatePlanningAssistant from '@/components/conversation/EstatePlanningAssistant';
import { supabase } from '@/lib/supabase/client';
import { useAuthStore } from '@/lib/store/auth';
import { useOrganizationStore } from '@/lib/store/organization';

export default function ConversationDemo() {
  const router = useRouter();
  const { setUser } = useAuthStore();
  const { setCurrentOrganization } = useOrganizationStore();
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    async function setupDemo() {
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
        // Convert to the expected User type
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
        console.error('Error setting up demo:', err);
        setError(err instanceof Error ? err.message : 'An unexpected error occurred');
        setLoading(false);
      }
    }
    
    setupDemo();
  }, [router, setUser, setCurrentOrganization]);

  return (
    <div className="min-h-screen bg-slate-50">
      <div className="container-lg py-8">
        <div className="flex justify-between items-center mb-8">
          <h1 className="text-3xl font-bold text-slate-900">Conversational Estate Planning</h1>
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
        
        {loading ? (
          <div className="card p-8 flex justify-center items-center">
            <p className="text-slate-500">Loading conversation interface...</p>
          </div>
        ) : !error ? (
          <div className="card p-0 overflow-hidden" style={{ height: "70vh" }}>
            <div className="bg-primary-600 text-white p-4">
              <h2 className="text-xl font-semibold">Digital Estate Planning Assistant</h2>
              <p className="text-sm opacity-80">Ask questions about estate planning or get help with your digital legacy</p>
            </div>
            <div className="h-full">
              <EstatePlanningAssistant />
            </div>
          </div>
        ) : null}
        
        <div className="mt-8 card bg-slate-100 p-6">
          <h3 className="text-lg font-medium mb-3">About this Demo</h3>
          <p className="text-slate-700">
            This conversation interface uses Anthropic's Claude AI to provide guidance on digital estate planning.
            The assistant can help you document your digital legacy, understand estate planning concepts, and
            guide you through organizing your important information.
          </p>
          <p className="text-slate-700 mt-3">
            You can select from suggested prompts or ask your own questions about:
          </p>
          <ul className="list-disc list-inside mt-2 ml-4 text-slate-700">
            <li>Online accounts organization</li>
            <li>Physical document management</li>
            <li>Setting up authorized contacts</li>
            <li>Digital legacy planning</li>
          </ul>
        </div>
      </div>
    </div>
  );
} 