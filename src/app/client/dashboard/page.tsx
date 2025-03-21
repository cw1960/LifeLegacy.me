'use client';

import { useState, useEffect } from 'react';
import { createClientComponentClient } from '@supabase/auth-helpers-nextjs';
import { 
  DocumentTextIcon, 
  UserGroupIcon, 
  GlobeAltIcon, 
  LockClosedIcon, 
  HeartIcon
} from '@heroicons/react/24/outline';
import Link from 'next/link';
import ProgressCircle from '@/components/client/ProgressCircle';
import ModuleCard from '@/components/client/ModuleCard';
import ChatAssistant from '@/components/client/ChatAssistant';

interface Module {
  id: string;
  name: string;
  description: string;
  icon: React.ComponentType<{ className?: string }>;
  progress: number;
  route: string;
}

export default function ClientDashboard() {
  const [client, setClient] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [modules, setModules] = useState<Module[]>([]);
  const [totalProgress, setTotalProgress] = useState(0);
  const [isChatOpen, setIsChatOpen] = useState(false);
  const [professionalName, setProfessionalName] = useState('');
  const [recentActivity, setRecentActivity] = useState<{ action: string, date: string }[]>([]);

  const supabase = createClientComponentClient();

  useEffect(() => {
    async function loadClientData() {
      const { data: { session } } = await supabase.auth.getSession();
      
      if (!session) return;
      
      const { data: clientData } = await supabase
        .from('clients')
        .select('*, organizations(*)')
        .eq('user_id', session.user.id)
        .single();
      
      if (clientData) {
        setClient(clientData);
      }
      
      setLoading(false);
    }
    
    loadClientData();
  }, [supabase]);

  useEffect(() => {
    async function loadDashboardData() {
      try {
        setIsLoading(true);
        
        // In a real implementation, this would fetch data from your API
        // For now, we'll use mock data
        const mockModules: Module[] = [
          {
            id: 'authorized-contacts',
            name: 'Authorized Contacts',
            description: 'Manage people who can access your information',
            icon: UserGroupIcon,
            progress: 75,
            route: '/client/authorized-contacts'
          },
          {
            id: 'online-accounts',
            name: 'Online Accounts',
            description: 'Inventory of your digital presence',
            icon: GlobeAltIcon,
            progress: 30,
            route: '/client/online-accounts'
          },
          {
            id: 'physical-documents',
            name: 'Physical Documents',
            description: 'Where to find important documents',
            icon: DocumentTextIcon,
            progress: 10,
            route: '/client/physical-documents'
          },
          {
            id: 'digital-locker',
            name: 'Digital Locker',
            description: 'Secure storage for important files',
            icon: LockClosedIcon,
            progress: 45,
            route: '/client/digital-locker'
          },
          {
            id: 'afterlife-planner',
            name: 'After-Life Planner',
            description: 'End-of-life preferences and wishes',
            icon: HeartIcon,
            progress: 5,
            route: '/client/afterlife-planner'
          },
          {
            id: 'pet-care',
            name: 'Pet Care Instructions',
            description: 'Arrangements for your pets',
            icon: UserGroupIcon,
            progress: 0,
            route: '/client/pet-care'
          }
        ];
        
        // Calculate total progress
        const total = mockModules.reduce((sum, module) => sum + module.progress, 0) / mockModules.length;
        
        // Mock professional name
        const professionalNameMock = 'Sarah Johnson, Esq.';
        
        // Mock recent activity
        const recentActivityMock = [
          { action: 'Updated contact information for John Smith', date: '3 hours ago' },
          { action: 'Added new online account: Twitter', date: '1 day ago' },
          { action: 'Updated physical document location: Will', date: '3 days ago' },
          { action: 'Uploaded new document: Insurance Policy', date: '1 week ago' }
        ];
        
        setModules(mockModules);
        setTotalProgress(Math.round(total));
        setProfessionalName(professionalNameMock);
        setRecentActivity(recentActivityMock);
      } catch (error) {
        console.error('Error loading dashboard data:', error);
      } finally {
        setIsLoading(false);
      }
    }
    
    loadDashboardData();
  }, []);

  // Function to determine which module to suggest next
  const getNextSuggestedModule = () => {
    // Find modules with lowest progress
    const sortedModules = [...modules].sort((a, b) => a.progress - b.progress);
    return sortedModules[0];
  };

  const suggestedModule = getNextSuggestedModule();

  if (loading) {
    return (
      <div className="flex items-center justify-center h-full">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-indigo-500"></div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Welcome Header */}
      <div className="bg-white rounded-lg shadow p-6">
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-2xl font-bold text-gray-800">
              Welcome back, {client?.first_name}!
            </h1>
            <p className="text-gray-600 mt-1">
              You're making good progress on your legacy planning. Here's what's next:
            </p>
          </div>
          <div className="bg-indigo-100 text-indigo-800 rounded-full px-4 py-2 font-semibold">
            {totalProgress}% Complete
          </div>
        </div>
      </div>
      
      {/* Module Progress Cards */}
      <h2 className="text-xl font-semibold text-gray-800">Your Progress</h2>
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {modules.map((module) => (
          <Link href={module.route} key={module.name}>
            <div className="bg-white rounded-lg shadow p-5 hover:shadow-md transition-shadow duration-200">
              <div className="flex justify-between items-start">
                <div className="flex items-start space-x-4">
                  <div className="p-3 bg-indigo-100 text-indigo-600 rounded-lg">
                    <module.icon className="h-6 w-6" />
                  </div>
                  <div>
                    <h3 className="font-medium text-gray-800">{module.name}</h3>
                    <p className="text-sm text-gray-500">{module.progress}% complete</p>
                  </div>
                </div>
                <div className="w-12 h-12 relative">
                  <svg className="w-12 h-12" viewBox="0 0 36 36">
                    <circle cx="18" cy="18" r="16" fill="none" className="stroke-gray-200" strokeWidth="2" />
                    <circle 
                      cx="18" 
                      cy="18" 
                      r="16" 
                      fill="none" 
                      className="stroke-indigo-500" 
                      strokeWidth="2"
                      strokeDasharray={`${module.progress}, 100`}
                      strokeLinecap="round"
                      transform="rotate(-90 18 18)"
                    />
                  </svg>
                  <div className="absolute top-0 left-0 w-full h-full flex items-center justify-center">
                    <span className="text-xs font-semibold text-gray-700">{module.progress}%</span>
                  </div>
                </div>
              </div>
            </div>
          </Link>
        ))}
      </div>
      
      {/* Recent Activity */}
      <div className="bg-white rounded-lg shadow">
        <div className="px-6 py-4 border-b border-gray-200">
          <h2 className="text-lg font-semibold text-gray-800">Recent Activity</h2>
        </div>
        <div className="divide-y divide-gray-200">
          {recentActivity.map((activity, index) => (
            <div key={index} className="px-6 py-4 flex justify-between items-center">
              <div className="flex-1">
                <p className="text-gray-800">{activity.action}</p>
                <p className="text-sm text-gray-500">{activity.date}</p>
              </div>
              <button className="text-indigo-600 hover:text-indigo-800 text-sm font-medium">
                View Details
              </button>
            </div>
          ))}
        </div>
        <div className="px-6 py-4 bg-gray-50 text-center">
          <button className="text-indigo-600 hover:text-indigo-800 text-sm font-medium">
            View All Activity
          </button>
        </div>
      </div>
      
      {/* Quick Tips */}
      <div className="bg-indigo-50 rounded-lg p-6">
        <h2 className="text-lg font-semibold text-indigo-800 mb-3">Tips to Complete Your Plan</h2>
        <ul className="space-y-2">
          <li className="flex items-start">
            <div className="flex-shrink-0 h-5 w-5 text-indigo-500">
              <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor">
                <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
              </svg>
            </div>
            <p className="ml-2 text-indigo-700">Add at least 3 authorized contacts who can access your legacy plan.</p>
          </li>
          <li className="flex items-start">
            <div className="flex-shrink-0 h-5 w-5 text-indigo-500">
              <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor">
                <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
              </svg>
            </div>
            <p className="ml-2 text-indigo-700">Upload important documents like your will and power of attorney.</p>
          </li>
          <li className="flex items-start">
            <div className="flex-shrink-0 h-5 w-5 text-indigo-500">
              <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor">
                <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
              </svg>
            </div>
            <p className="ml-2 text-indigo-700">Record details of your online accounts for secure storage.</p>
          </li>
        </ul>
      </div>
      
      {/* Suggested Next Steps */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
        {/* Overall Progress */}
        <div className="bg-white rounded-lg shadow-sm p-6 flex flex-col items-center justify-center">
          <h2 className="text-xl font-semibold text-gray-800 mb-4">Your Legacy Plan</h2>
          <ProgressCircle percentage={totalProgress} size={180} />
          <p className="mt-4 text-gray-600 text-center">
            Your plan is {totalProgress}% complete. Keep going!
          </p>
        </div>

        {/* Suggested Next Steps */}
        <div className="md:col-span-2 bg-white rounded-lg shadow-sm p-6">
          <h2 className="text-xl font-semibold text-gray-800 mb-4">Continue Where You Left Off</h2>
          
          {suggestedModule && (
            <div className="mb-6">
              <p className="text-gray-600 mb-3">Recommended next step:</p>
              <div className="border border-indigo-100 bg-indigo-50 rounded-lg p-4">
                <h3 className="font-medium text-indigo-900">{suggestedModule.name}</h3>
                <p className="text-indigo-700 text-sm mb-3">{suggestedModule.description}</p>
                <div className="flex items-center justify-between">
                  <div className="w-2/3 bg-gray-200 rounded-full h-2">
                    <div className="bg-indigo-600 h-2 rounded-full" style={{ width: `${suggestedModule.progress}%` }}></div>
                  </div>
                  <Link
                    href={suggestedModule.route}
                    className="inline-flex items-center justify-center px-4 py-2 border border-transparent text-sm font-medium rounded-md text-white bg-indigo-600 hover:bg-indigo-700"
                  >
                    Continue
                  </Link>
                </div>
              </div>
            </div>
          )}

          {/* Professional relationship */}
          <div>
            <p className="text-gray-600 mb-3">Your estate planning professional:</p>
            <div className="flex items-center">
              <div className="h-12 w-12 rounded-full bg-gray-300 flex items-center justify-center text-gray-600 font-semibold text-lg">
                {professionalName.charAt(0)}
              </div>
              <div className="ml-4">
                <p className="font-medium text-gray-900">{professionalName}</p>
                <button className="text-sm text-indigo-600 hover:text-indigo-800">
                  Send a message
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Modules Grid */}
      <h2 className="text-xl font-semibold text-gray-800 mb-4">Planning Modules</h2>
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {modules.map((module) => (
          <ModuleCard key={module.id} module={module} />
        ))}
      </div>
      
      {/* Chat Assistant Button - Fixed at bottom right */}
      <button 
        onClick={() => setIsChatOpen(true)}
        className="fixed bottom-6 right-6 bg-indigo-600 text-white rounded-full w-16 h-16 flex items-center justify-center shadow-lg hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
        aria-label="Open chat assistant"
      >
        <svg xmlns="http://www.w3.org/2000/svg" className="h-8 w-8" fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 10h.01M12 10h.01M16 10h.01M9 16H5a2 2 0 01-2-2V6a2 2 0 012-2h14a2 2 0 012 2v8a2 2 0 01-2 2h-5l-5 5v-5z" />
        </svg>
      </button>
      
      {/* Chat Assistant Modal */}
      {isChatOpen && (
        <ChatAssistant onClose={() => setIsChatOpen(false)} />
      )}
    </div>
  );
} 