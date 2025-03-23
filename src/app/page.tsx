'use client';

import React from 'react';
import { useRouter } from 'next/navigation';

const HomePage = () => {
  const router = useRouter();

  // Log for debugging
  console.log('HomePage rendering');

  return (
    <div style={{ fontFamily: 'system-ui, sans-serif', maxWidth: '1200px', margin: '0 auto', padding: '20px' }}>
      <div style={{ 
        padding: '20px', 
        background: 'red', 
        color: 'white', 
        fontSize: '24px',
        margin: '20px',
        border: '5px solid black' 
      }}>
        This is a test component. If you can see this RED BOX, React is rendering correctly.
      </div>
      
      {/* Hero section */}
      <div style={{ padding: '50px 0', background: '#f0f9ff', borderRadius: '10px', marginBottom: '30px' }}>
        <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', textAlign: 'center' }}>
          <h1 style={{ fontSize: '2.5rem', fontWeight: 'bold', marginBottom: '20px' }}>
            Preserve Your Legacy for Future Generations
          </h1>
          <p style={{ fontSize: '1.25rem', color: '#4a5568', maxWidth: '800px', marginBottom: '30px' }}>
            Secure, organize, and share your memories, documents, and wishes with loved ones.
            The complete digital estate planning solution.
          </p>
          <div style={{ display: 'flex', gap: '15px' }}>
            <button 
              onClick={() => router.push('/auth/register')}
              style={{ 
                background: '#0284c7', 
                color: 'white',
                padding: '12px 24px',
                border: 'none',
                borderRadius: '6px',
                fontWeight: 'bold',
                cursor: 'pointer'
              }}
            >
              Get Started Free
            </button>
            <button 
              onClick={() => router.push('/about')}
              style={{ 
                background: 'white', 
                color: '#0284c7',
                padding: '12px 24px',
                border: '1px solid #0284c7',
                borderRadius: '6px',
                fontWeight: 'bold',
                cursor: 'pointer'
              }}
            >
              Learn More
            </button>
          </div>
        </div>
      </div>

      {/* Features section */}
      <div style={{ padding: '40px 0', background: 'white', borderRadius: '10px' }}>
        <h2 style={{ fontSize: '2rem', fontWeight: 'bold', textAlign: 'center', marginBottom: '30px' }}>
          Why Choose LifeLegacy?
        </h2>
        
        <div style={{ display: 'flex', flexWrap: 'wrap', justifyContent: 'center', gap: '20px' }}>
          {[
            { title: 'Secure Storage', description: 'All your documents and memories are encrypted and stored securely.' },
            { title: 'Memory Preservation', description: 'Record your life stories and memories for future generations.' },
            { title: 'Easy Sharing', description: 'Share your legacy items with family and loved ones effortlessly.' },
            { title: 'Family Collaboration', description: 'Collaborate with family members to build your shared history.' }
          ].map((feature, index) => (
            <div key={index} style={{ 
              width: '260px', 
              padding: '20px', 
              border: '1px solid #e2e8f0',
              borderRadius: '8px',
              boxShadow: '0 4px 6px -1px rgba(0, 0, 0, 0.1)',
              display: 'flex',
              flexDirection: 'column',
              alignItems: 'center',
              textAlign: 'center'
            }}>
              <h3 style={{ fontSize: '1.25rem', fontWeight: 'bold', marginBottom: '10px' }}>
                {feature.title}
              </h3>
              <p style={{ color: '#4a5568' }}>
                {feature.description}
              </p>
            </div>
          ))}
        </div>
      </div>

      {/* CTA section */}
      <div style={{ 
        padding: '40px', 
        marginTop: '30px',
        background: '#f0f9ff', 
        borderRadius: '10px',
        textAlign: 'center'
      }}>
        <h2 style={{ fontSize: '1.75rem', fontWeight: 'bold', marginBottom: '15px' }}>
          Ready to Preserve Your Legacy?
        </h2>
        <p style={{ fontSize: '1.125rem', marginBottom: '25px', maxWidth: '800px', margin: '0 auto 25px' }}>
          Join thousands of others who are using LifeLegacy to document their life stories and secure their digital legacy.
        </p>
        <button 
          onClick={() => router.push('/auth/register')}
          style={{ 
            background: '#0284c7', 
            color: 'white',
            padding: '12px 30px',
            border: 'none',
            borderRadius: '6px',
            fontWeight: 'bold',
            cursor: 'pointer'
          }}
        >
          Start For Free
        </button>
      </div>
    </div>
  );
};

export default HomePage;
