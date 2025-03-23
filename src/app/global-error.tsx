'use client';

import { useEffect } from 'react';

export default function GlobalError({
  error,
  reset,
}: {
  error: Error & { digest?: string };
  reset: () => void;
}) {
  useEffect(() => {
    console.error('Global error:', error);
  }, [error]);

  return (
    <html lang="en">
      <body>
        <div style={{ 
          padding: '40px', 
          maxWidth: '800px', 
          margin: '40px auto', 
          backgroundColor: '#fff1f1', 
          border: '2px solid #ff0000',
          borderRadius: '8px'
        }}>
          <h2 style={{ color: '#e50000', marginBottom: '20px' }}>Something went wrong!</h2>
          <p style={{ marginBottom: '20px' }}>An error occurred in the application.</p>
          <p style={{ marginBottom: '20px' }}>
            <code style={{ 
              backgroundColor: '#fff', 
              padding: '10px', 
              display: 'block', 
              borderRadius: '4px',
              overflowX: 'auto', 
              whiteSpace: 'pre-wrap',
              wordBreak: 'break-word' 
            }}>
              {error?.message || 'Unknown error'}
            </code>
          </p>
          <button
            onClick={() => reset()}
            style={{
              backgroundColor: '#e50000',
              color: 'white',
              padding: '10px 20px',
              border: 'none',
              borderRadius: '4px',
              cursor: 'pointer',
              fontWeight: 'bold'
            }}
          >
            Try again
          </button>
        </div>
      </body>
    </html>
  );
}
