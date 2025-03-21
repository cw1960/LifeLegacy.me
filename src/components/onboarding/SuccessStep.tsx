'use client';

import { useRouter } from 'next/navigation';
import { CheckIcon } from '@heroicons/react/24/outline';

interface SuccessStepProps {
  organizationName: string;
}

export default function SuccessStep({ organizationName }: SuccessStepProps) {
  const router = useRouter();

  const handleGotoDashboard = () => {
    router.push('/dashboard');
  };

  return (
    <div className="flex flex-col items-center justify-center p-8 bg-white rounded-lg shadow w-full max-w-md mx-auto">
      <div className="mx-auto flex items-center justify-center h-12 w-12 rounded-full bg-green-100">
        <CheckIcon className="h-6 w-6 text-green-600" aria-hidden="true" />
      </div>
      <h2 className="mt-6 text-center text-2xl font-bold text-gray-900">Professional Setup Complete!</h2>
      <p className="mt-2 text-center text-gray-900">
        Congratulations! You've successfully set up your professional profile for {organizationName}.
        You're now ready to start managing digital estate planning services for your clients.
      </p>
      
      <div className="mt-8">
        <button
          onClick={handleGotoDashboard}
          className="inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md shadow-sm text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
        >
          Go to Dashboard
        </button>
      </div>
    </div>
  );
}
