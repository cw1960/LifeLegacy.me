'use client';

import React from 'react';
import Link from 'next/link';

interface ModuleCardProps {
  title: string;
  description: string;
  icon: React.ReactNode;
  progress: number;
  href: string;
  color?: string;
}

export default function ModuleCard({
  title,
  description,
  icon,
  progress,
  href,
  color = 'indigo',
}: ModuleCardProps) {
  const colorClasses = {
    indigo: {
      bg: 'bg-indigo-50',
      text: 'text-indigo-600',
      progress: 'bg-indigo-600',
    },
    emerald: {
      bg: 'bg-emerald-50',
      text: 'text-emerald-600',
      progress: 'bg-emerald-600',
    },
    amber: {
      bg: 'bg-amber-50',
      text: 'text-amber-600',
      progress: 'bg-amber-600',
    },
    blue: {
      bg: 'bg-blue-50',
      text: 'text-blue-600',
      progress: 'bg-blue-600',
    },
    purple: {
      bg: 'bg-purple-50',
      text: 'text-purple-600',
      progress: 'bg-purple-600',
    },
  }[color as keyof typeof colorClasses];

  return (
    <Link
      href={href}
      className="block group"
    >
      <div className="p-5 rounded-lg border border-gray-200 bg-white shadow-sm hover:shadow-md transition-shadow">
        <div className="flex items-center mb-4">
          <div className={`p-3 rounded-full ${colorClasses.bg} ${colorClasses.text} mr-3`}>
            {icon}
          </div>
          <div>
            <h3 className="font-semibold text-gray-900">{title}</h3>
            <p className="text-sm text-gray-500">{description}</p>
          </div>
        </div>
        
        <div className="w-full h-2 bg-gray-100 rounded-full overflow-hidden">
          <div 
            className={`h-full ${colorClasses.progress} transition-all duration-300`}
            style={{ width: `${progress}%` }}
          />
        </div>
        <div className="flex justify-between items-center mt-2">
          <span className="text-xs text-gray-500">Progress</span>
          <span className="text-xs font-medium text-gray-700">{progress}%</span>
        </div>
      </div>
    </Link>
  );
} 