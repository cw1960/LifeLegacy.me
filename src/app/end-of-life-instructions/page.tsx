'use client';

import React, { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import EstatePlanningAssistant from '@/components/conversation/EstatePlanningAssistant';
import { supabase } from '@/lib/supabase/client';
import { useAuthStore } from '@/lib/store/auth';
import { useOrganizationStore } from '@/lib/store/organization';

export default function EndOfLifeInstructionsPage() {
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
            <h1 className="text-3xl font-bold text-slate-900">End-of-Life Instructions</h1>
            <p className="text-slate-600 mt-2">Create detailed instructions for your loved ones</p>
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
                  <h2 className="text-xl font-semibold">End-of-Life Instructions Assistant</h2>
                  <p className="text-sm opacity-80">Create comprehensive end-of-life instructions for your loved ones</p>
                </div>
                <div className="h-full">
                  <EstatePlanningAssistant moduleType="end-of-life-instructions" />
                </div>
              </div>
            ) : null}
          </div>
          
          <div className="space-y-6">
            <div className="card">
              <h3 className="text-lg font-medium mb-4">About This Module</h3>
              <p className="text-slate-600 mb-4">
                The End-of-Life Instructions module helps you create detailed guidance for your loved ones
                regarding your wishes and preferences for:
              </p>
              <ul className="list-disc list-inside text-slate-600 mb-4 ml-2">
                <li>Funeral and memorial preferences</li>
                <li>Burial or cremation instructions</li>
                <li>Legacy and charitable wishes</li>
                <li>Messages to loved ones</li>
                <li>Key contacts to notify</li>
                <li>Care for pets and dependents</li>
                <li>Distribution of personal items</li>
              </ul>
              <p className="text-slate-600">
                Your instructions will provide invaluable guidance to those making difficult decisions
                during an emotionally challenging time.
              </p>
            </div>
            
            <div className="card">
              <h3 className="text-lg font-medium mb-4">Why This Matters</h3>
              <p className="text-slate-600 mb-4">
                Creating detailed end-of-life instructions:
              </p>
              <ul className="list-disc list-inside text-slate-600 ml-2">
                <li>Relieves your loved ones of difficult decision-making</li>
                <li>Ensures your personal wishes are respected</li>
                <li>Prevents family conflicts over unclear intentions</li>
                <li>Reduces stress during an already difficult time</li>
                <li>Provides comfort to those who want to honor your wishes</li>
              </ul>
            </div>
            
            <div className="card">
              <h3 className="text-lg font-medium mb-4">Getting Started</h3>
              <p className="text-slate-600 mb-2">
                Our assistant will help you create comprehensive instructions by asking thoughtful
                questions about your preferences. You can:
              </p>
              <ul className="list-disc list-inside text-slate-600 ml-2">
                <li>Describe specific wishes for ceremonies or arrangements</li>
                <li>Record personal messages to family and friends</li>
                <li>Provide guidance on handling social media accounts</li>
                <li>Create a checklist for executors or family members</li>
                <li>Document preferences that aren't covered in legal documents</li>
              </ul>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
} 