'use client';

import React, { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import EstatePlanningAssistant from '@/components/conversation/EstatePlanningAssistant';
import { supabase } from '@/lib/supabase/client';
import { useAuthStore } from '@/lib/store/auth';
import { useOrganizationStore } from '@/lib/store/organization';

export default function DigitalAssetsPage() {
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
            <h1 className="text-3xl font-bold text-slate-900">My Digital Assets</h1>
            <p className="text-slate-600 mt-2">Manage and document your valuable digital assets</p>
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
                  <h2 className="text-xl font-semibold">Digital Assets Assistant</h2>
                  <p className="text-sm opacity-80">Document and plan for your valuable digital assets</p>
                </div>
                <div className="h-full">
                  <EstatePlanningAssistant moduleType="digital-assets" />
                </div>
              </div>
            ) : null}
          </div>
          
          <div className="space-y-6">
            <div className="card">
              <h3 className="text-lg font-medium mb-4">About Digital Assets</h3>
              <p className="text-slate-600 mb-4">
                Digital assets are valuable items that exist in electronic form. 
                These can include both financial and personal assets:
              </p>
              <ul className="list-disc list-inside text-slate-600 mb-4 ml-2">
                <li>Cryptocurrency and NFTs</li>
                <li>Digital artwork and collectibles</li>
                <li>Domain names and websites</li>
                <li>Intellectual property (e-books, music, videos)</li>
                <li>Digital storefronts and businesses</li>
                <li>Online gaming items and currencies</li>
                <li>Loyalty program points and miles</li>
              </ul>
              <p className="text-slate-600">
                Without proper documentation, these assets can be lost forever when you're no longer able to access them.
              </p>
            </div>
            
            <div className="card">
              <h3 className="text-lg font-medium mb-4">Why This Matters</h3>
              <p className="text-slate-600 mb-4">
                Digital assets can represent significant financial and sentimental value, but they present unique challenges:
              </p>
              <ul className="list-disc list-inside text-slate-600 ml-2">
                <li>They're often invisible to executors and family members</li>
                <li>Access methods can be complex (private keys, 2FA)</li>
                <li>Legal frameworks for inheritance are still developing</li>
                <li>Without proper planning, assets can be permanently lost</li>
                <li>Some digital assets (like cryptocurrency) can't be recovered through traditional means</li>
              </ul>
            </div>
            
            <div className="card">
              <h3 className="text-lg font-medium mb-4">Getting Started</h3>
              <p className="text-slate-600 mb-2">
                Use the Digital Assets Assistant to:
              </p>
              <ul className="list-disc list-inside text-slate-600 ml-2">
                <li>Create an inventory of your digital assets</li>
                <li>Document access methods and recovery options</li>
                <li>Plan for secure transfer to beneficiaries</li>
                <li>Learn about best practices for different asset types</li>
              </ul>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
} 