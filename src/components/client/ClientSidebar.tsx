'use client';

import React, { useState } from 'react';
import { usePathname } from 'next/navigation';
import Link from 'next/link';
import Image from 'next/image';
import { 
  HomeIcon, 
  UsersIcon, 
  GlobeAltIcon, 
  FolderIcon, 
  LockClosedIcon, 
  HeartIcon, 
  UserIcon,
  Cog6ToothIcon,
  ArrowRightOnRectangleIcon
} from '@heroicons/react/24/outline';

interface ClientSidebarProps {
  client: any; // Replace with proper type once client model is defined
}

export default function ClientSidebar({ client }: ClientSidebarProps) {
  const pathname = usePathname();
  const [expanded, setExpanded] = useState(true);

  const navigation = [
    { name: 'Dashboard', href: '/client/dashboard', icon: HomeIcon },
    { name: 'Authorized Contacts', href: '/client/authorized-contacts', icon: UsersIcon },
    { name: 'Online Accounts', href: '/client/online-accounts', icon: GlobeAltIcon },
    { name: 'Physical Documents', href: '/client/physical-documents', icon: FolderIcon },
    { name: 'Digital Locker', href: '/client/digital-locker', icon: LockClosedIcon },
    { name: 'After-Life Planner', href: '/client/afterlife-planner', icon: HeartIcon },
    { name: 'Pet Care', href: '/client/pet-care', icon: UserIcon },
    { name: 'Settings', href: '/client/settings', icon: Cog6ToothIcon },
  ];

  return (
    <aside className={`bg-white h-full flex flex-col border-r border-gray-200 transition-all duration-300 ${expanded ? 'w-64' : 'w-20'}`}>
      {/* Logo and title */}
      <div className="p-4 border-b border-gray-100">
        <Link href="/client/dashboard" className="flex items-center">
          <div className={`${expanded ? 'mr-3' : 'mx-auto'}`}>
            <Image src="/images/logo.svg" alt="LifeLegacy Logo" width={32} height={32} />
          </div>
          {expanded && (
            <div>
              <h1 className="font-bold text-gray-900">LifeLegacy</h1>
              <p className="text-xs text-gray-500">Digital Estate Planning</p>
            </div>
          )}
        </Link>
      </div>
      
      {/* Navigation */}
      <nav className="flex-1 p-4 space-y-1 overflow-y-auto">
        <ul className="space-y-1 px-2">
          {navigation.map((item) => {
            const isActive = pathname === item.href || pathname.startsWith(`${item.href}/`);
            return (
              <li key={item.name}>
                <Link
                  href={item.href}
                  className={`
                    ${isActive 
                      ? 'bg-indigo-900 text-white' 
                      : 'text-indigo-100 hover:bg-indigo-700'
                    }
                    group flex items-center px-2 py-2 text-base font-medium rounded-md
                  `}
                >
                  <item.icon 
                    className={`
                      ${isActive ? 'text-white' : 'text-indigo-300 group-hover:text-white'}
                      ${expanded ? 'mr-3' : 'mx-auto'}
                      h-6 w-6
                    `} 
                    aria-hidden="true" 
                  />
                  {expanded && <span>{item.name}</span>}
                </Link>
              </li>
            );
          })}
        </ul>
      </nav>
      
      {/* User Profile */}
      <div className="p-4 border-t border-indigo-700">
        <div className={`flex ${expanded ? 'items-center' : 'flex-col items-center space-y-2'}`}>
          <div className="flex-shrink-0">
            <div className="h-10 w-10 rounded-full bg-indigo-600 flex items-center justify-center text-white">
              {client?.first_name?.charAt(0) || 'C'}
            </div>
          </div>
          {expanded && (
            <div className="ml-3">
              <p className="text-sm font-medium text-white">
                {client?.first_name} {client?.last_name}
              </p>
              <Link 
                href="/auth/logout" 
                className="text-xs text-indigo-300 hover:text-white flex items-center mt-1"
              >
                <ArrowRightOnRectangleIcon className="w-4 h-4 mr-1" />
                Log out
              </Link>
            </div>
          )}
        </div>
        {!expanded && (
          <Link 
            href="/auth/logout" 
            className="mt-4 flex justify-center text-indigo-300 hover:text-white"
          >
            <ArrowRightOnRectangleIcon className="w-5 h-5" />
          </Link>
        )}
      </div>
    </aside>
  );
} 