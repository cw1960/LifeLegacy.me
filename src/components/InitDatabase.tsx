'use client';

import { useEffect, useState } from 'react';
import { initDatabase } from '@/lib/database/initDb';

export function InitDatabase() {
  const [initialized, setInitialized] = useState(false);
  const [error, setError] = useState<Error | null>(null);
  const [missingTables, setMissingTables] = useState(false);

  useEffect(() => {
    async function init() {
      try {
        const result = await initDatabase();
        setInitialized(true);
        
        if (!result.success) {
          console.error('Database initialization failed:', result.error);
          setError(result.error as Error);
          if (result.missingTables) {
            setMissingTables(true);
          }
        }
      } catch (err) {
        console.error('Error initializing database:', err);
        setError(err as Error);
      }
    }

    init();
  }, []);

  if (missingTables) {
    return (
      <div className="fixed inset-0 bg-black bg-opacity-50 z-50 flex items-center justify-center p-4">
        <div className="bg-white rounded-lg p-6 max-w-md">
          <h2 className="text-xl font-bold text-red-600 mb-4">Database Setup Required</h2>
          <p className="mb-4">
            The database tables required for this application are missing. Please run the SQL initialization script from <code className="bg-gray-100 p-1 rounded">prisma/supabase_lowercase.sql</code> in your Supabase dashboard SQL editor.
          </p>
          <p className="mb-4 text-sm text-gray-600">
            After running the script, refresh this page to continue.
          </p>
          <div className="flex justify-end">
            <button 
              onClick={() => setMissingTables(false)}
              className="px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700 transition-colors"
            >
              Dismiss
            </button>
          </div>
        </div>
      </div>
    );
  }

  // If no missing tables, render nothing
  return null;
}
