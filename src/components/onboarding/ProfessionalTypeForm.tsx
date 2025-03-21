'use client';

import { useState } from 'react';

type FormDataType = {
  professionalType: string;
  licenseNumber: string;
  specialty: string;
};

interface ProfessionalTypeFormProps {
  formData: FormDataType;
  onUpdateFormData: (data: Partial<FormDataType>) => void;
  onNext: () => void;
  onBack: () => void;
  loading?: boolean;
}

export default function ProfessionalTypeForm({
  formData,
  onUpdateFormData,
  onNext,
  onBack,
  loading = false,
}: ProfessionalTypeFormProps) {
  const [errors, setErrors] = useState<Record<string, string>>({});

  const validate = () => {
    const newErrors: Record<string, string> = {};

    if (!formData.professionalType.trim()) {
      newErrors.professionalType = 'Professional type is required';
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (validate()) {
      onNext();
    }
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      <h2 className="text-xl font-semibold text-gray-800">Professional type</h2>
      
      <div>
        <label htmlFor="professionalType" className="block text-sm font-medium text-gray-700">
          Professional type <span className="text-red-500">*</span>
        </label>
        <select
          id="professionalType"
          className={`mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 text-gray-900 ${
            errors.professionalType ? 'border-red-500' : ''
          }`}
          value={formData.professionalType}
          onChange={(e) => onUpdateFormData({ professionalType: e.target.value })}
          disabled={loading}
        >
          <option value="">Select Professional Type</option>
          <option value="Attorney">Attorney</option>
          <option value="Financial Advisor">Financial Advisor</option>
          <option value="Estate Planner">Estate Planner</option>
          <option value="Wealth Manager">Wealth Manager</option>
          <option value="Accountant">Accountant</option>
          <option value="Insurance Agent">Insurance Agent</option>
          <option value="Other">Other</option>
        </select>
        {errors.professionalType && (
          <p className="mt-1 text-sm text-red-500">{errors.professionalType}</p>
        )}
      </div>

      <div>
        <label htmlFor="licenseNumber" className="block text-sm font-medium text-gray-700">
          License number (optional)
        </label>
        <input
          type="text"
          id="licenseNumber"
          className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 text-gray-900"
          value={formData.licenseNumber}
          onChange={(e) => onUpdateFormData({ licenseNumber: e.target.value })}
          disabled={loading}
        />
      </div>

      <div>
        <label htmlFor="specialty" className="block text-sm font-medium text-gray-700">
          Specialty (optional)
        </label>
        <input
          type="text"
          id="specialty"
          className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 text-gray-900"
          value={formData.specialty}
          onChange={(e) => onUpdateFormData({ specialty: e.target.value })}
          disabled={loading}
        />
      </div>

      <div className="flex justify-between pt-4">
        <button
          type="button"
          onClick={onBack}
          className="inline-flex items-center px-4 py-2 border border-gray-300 shadow-sm text-sm font-medium rounded-md text-gray-700 bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
          disabled={loading}
        >
          Back
        </button>
        <button
          type="submit"
          className="inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md shadow-sm text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
          disabled={loading}
        >
          {loading ? (
            <>
              <svg className="animate-spin -ml-1 mr-2 h-4 w-4 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
              </svg>
              Processing...
            </>
          ) : (
            'Next'
          )}
        </button>
      </div>
    </form>
  );
}
