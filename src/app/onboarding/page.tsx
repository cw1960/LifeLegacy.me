'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { supabase } from '@/lib/supabase/client';
import PersonalInfoForm from '@/components/onboarding/PersonalInfoForm';
import OrganizationInfoForm from '@/components/onboarding/OrganizationInfoForm';
import ProfessionalTypeForm from '@/components/onboarding/ProfessionalTypeForm';
import SuccessStep from '@/components/onboarding/SuccessStep';

const steps = [
  { id: 'personal', name: 'Personal Information' },
  { id: 'organization', name: 'Organization Details' },
  { id: 'type', name: 'Professional Type' },
  { id: 'complete', name: 'Complete' },
];

export default function OnboardingPage() {
  const router = useRouter();
  const [currentStep, setCurrentStep] = useState(0);
  const [formData, setFormData] = useState({
    // Personal information
    firstName: '',
    lastName: '',
    email: '',
    phone: '',
    
    // Organization information
    organizationName: '',
    organizationType: '',
    address: '',
    city: '',
    state: '',
    zipCode: '',
    
    // Professional type information
    professionalType: '',
    licenseNumber: '',
    specialty: '',
  });
  const [user, setUser] = useState<any>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    async function getUser() {
      const { data: { session } } = await supabase.auth.getSession();
      if (session?.user) {
        setUser(session.user);
        // Pre-fill form data from user metadata
        setFormData(prev => ({
          ...prev,
          firstName: session.user.user_metadata?.first_name || '',
          lastName: session.user.user_metadata?.last_name || '',
          email: session.user.email || '',
        }));
      }
    }
    
    getUser();
  }, []);

  const handleNext = () => {
    setCurrentStep(prev => Math.min(prev + 1, steps.length - 1));
  };

  const handleBack = () => {
    setCurrentStep(prev => Math.max(prev - 1, 0));
  };

  const updateFormData = (data: Partial<typeof formData>) => {
    setFormData(prev => ({ ...prev, ...data }));
  };

  const handleComplete = async () => {
    if (!user) return;
    
    setLoading(true);
    setError(null);
    
    try {
      console.log('Creating professional record with user:', user);
      
      // Generate a subdomain from organization name with timestamp to ensure uniqueness
      const timestamp = new Date().getTime().toString().slice(-6);
      const subdomain = formData.organizationName
        .toLowerCase()
        .replace(/[^a-z0-9]/g, '-')
        .replace(/-+/g, '-')
        .replace(/^-|-$/g, '') + '-' + timestamp;
      
      // Use the stored procedure to create both records in a single transaction
      const { data, error } = await supabase.rpc('create_organization_and_professional', {
        org_name: formData.organizationName,
        org_subdomain: subdomain,
        org_description: formData.organizationType || null,
        prof_email: formData.email,
        prof_first_name: formData.firstName,
        prof_last_name: formData.lastName,
        prof_auth_user_id: user.id,
        prof_professional_type: formData.professionalType || null,
        prof_license_number: formData.licenseNumber || null,
        prof_specialty: formData.specialty || null
      });
      
      if (error) {
        console.error('Error in onboarding process:', error);
        throw error;
      }
      
      if (data && !data.success) {
        console.error('Error creating records:', data.error);
        throw new Error(data.error || 'Failed to create organization and professional');
      }
      
      console.log('Organization and professional created successfully:', data);
      
      // Move to the success step
      handleNext();
      
    } catch (err: any) {
      console.error('Error in onboarding process:', err);
      setError(err.message || 'An error occurred during onboarding');
    } finally {
      setLoading(false);
    }
  };

  const handleGotoDashboard = () => {
    router.push('/dashboard');
  };

  return (
    <div className="container-md py-16">
      <div className="card max-w-3xl mx-auto">
        <h1 className="text-2xl font-bold text-slate-900 mb-8">Professional Onboarding</h1>
        
        {/* Progress Steps */}
        <nav aria-label="Progress" className="mb-10">
          <ol className="flex items-center">
            {steps.map((step, index) => (
              <li key={step.id} className={`relative ${index === steps.length - 1 ? 'flex-1' : 'flex-1 pr-8'}`}>
                <div className="flex items-center">
                  <div
                    className={`relative flex h-10 w-10 items-center justify-center rounded-full border-2 ${
                      index < currentStep
                        ? 'bg-primary-600 border-primary-200'
                        : index === currentStep
                        ? 'bg-primary-600 border-primary-200 ring-4 ring-primary-50'
                        : 'bg-slate-100 border-slate-200'
                    }`}
                  >
                    {index < currentStep ? (
                      <svg className="h-6 w-6 text-white" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor">
                        <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                      </svg>
                    ) : (
                      <span className={`text-sm font-semibold ${index === currentStep ? 'text-white' : 'text-slate-600'}`}>
                        {index + 1}
                      </span>
                    )}
                  </div>
                  {index !== steps.length - 1 && (
                    <div className={`absolute top-5 right-0 h-0.5 w-full ${index < currentStep ? 'bg-primary-600' : 'bg-slate-200'}`} />
                  )}
                </div>
                <div className="mt-3">
                  <span className={`text-sm font-medium ${index <= currentStep ? 'text-primary-700' : 'text-slate-500'}`}>
                    {step.name}
                  </span>
                </div>
              </li>
            ))}
          </ol>
        </nav>

        {/* Error message */}
        {error && (
          <div className="mb-8 rounded-md bg-red-50 border border-red-200 p-4">
            <div className="flex">
              <div className="flex-shrink-0">
                <svg className="h-5 w-5 text-red-400" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor">
                  <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.707 7.293a1 1 0 00-1.414 1.414L8.586 10l-1.293 1.293a1 1 0 101.414 1.414L10 11.414l1.293 1.293a1 1 0 001.414-1.414L11.414 10l1.293-1.293a1 1 0 00-1.414-1.414L10 8.586 8.707 7.293z" clipRule="evenodd" />
                </svg>
              </div>
              <div className="ml-3">
                <p className="text-sm text-red-700">{error}</p>
              </div>
            </div>
          </div>
        )}

        {/* Form Steps */}
        <div className="mt-8">
          {currentStep === 0 && (
            <PersonalInfoForm 
              formData={formData} 
              onUpdateFormData={updateFormData} 
              onNext={handleNext} 
            />
          )}
          
          {currentStep === 1 && (
            <OrganizationInfoForm 
              formData={formData} 
              onUpdateFormData={updateFormData} 
              onNext={handleNext} 
              onBack={handleBack} 
            />
          )}
          
          {currentStep === 2 && (
            <ProfessionalTypeForm 
              formData={formData} 
              onUpdateFormData={updateFormData} 
              onNext={handleComplete} 
              onBack={handleBack}
              loading={loading}
            />
          )}
          
          {currentStep === 3 && (
            <SuccessStep organizationName={formData.organizationName} />
          )}
        </div>
      </div>
    </div>
  );
} 