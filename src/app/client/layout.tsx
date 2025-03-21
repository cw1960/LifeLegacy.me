'use client';

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { createClientComponentClient } from '@supabase/auth-helpers-nextjs';
import ClientSidebar from '@/components/client/ClientSidebar';

export default function ClientLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const [client, setClient] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const router = useRouter();
  const supabase = createClientComponentClient();

  useEffect(() => {
    async function getUser() {
      setLoading(true);
      
      const { data: { session } } = await supabase.auth.getSession();
      
      if (!session) {
        router.push('/auth/login');
        return;
      }
      
      // Check if user is a client
      const { data: clientData, error } = await supabase
        .from('clients')
        .select('*')
        .eq('user_id', session.user.id)
        .single();
      
      if (error || !clientData) {
        // Not a client, redirect to login
        router.push('/auth/login');
        return;
      }
      
      setClient(clientData);
      setLoading(false);
    }
    
    getUser();
  }, [router, supabase]);

  if (loading) {
    return (
      <div className="flex items-center justify-center h-screen">
        <div className="animate-spin rounded-full h-32 w-32 border-t-2 border-b-2 border-indigo-500"></div>
      </div>
    );
  }

  return (
    <div className="flex h-screen bg-gray-100">
      <ClientSidebar client={client} />
      <main className="flex-1 overflow-auto">
        <div className="p-6">
          {children}
        </div>
      </main>
    </div>
  );
} 