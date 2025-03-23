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
            Elevate Your Practice with Digital Estate Planning
          </h1>
          <p style={{ fontSize: '1.25rem', color: '#4a5568', maxWidth: '800px', marginBottom: '30px' }}>
            For Estate Attorneys, Insurance Agents, and Financial Planners: Streamline client services,
            increase retention, and grow your business with our comprehensive platform.
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
              Start Free Trial
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
              Schedule Demo
            </button>
          </div>
        </div>
      </div>

      {/* Features section */}
      <div style={{ padding: '40px 0', background: 'white', borderRadius: '10px' }}>
        <h2 style={{ fontSize: '2rem', fontWeight: 'bold', textAlign: 'center', marginBottom: '30px' }}>
          Why Professionals Choose LifeLegacy
        </h2>
        
        <div style={{ display: 'flex', flexWrap: 'wrap', justifyContent: 'center', gap: '20px' }}>
          {[
            { title: 'Client Acquisition', description: 'Attract new clients with a modern, technology-forward approach to estate planning.' },
            { title: 'Service Expansion', description: 'Offer comprehensive digital estate planning as a value-added service to existing clients.' },
            { title: 'Efficient Management', description: 'Streamline your practice with powerful client management and document organization tools.' },
            { title: 'Client Engagement', description: 'Increase client retention through meaningful digital touchpoints and collaborative features.' }
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
          Ready to Transform Your Practice?
        </h2>
        <p style={{ fontSize: '1.125rem', marginBottom: '25px', maxWidth: '800px', margin: '0 auto 25px' }}>
          Join professionals across the financial, legal, and insurance sectors who are using LifeLegacy 
          to enhance their services and grow their client base.
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
          Get Started
        </button>
      </div>
    </div>
  );
};

export default HomePage;
