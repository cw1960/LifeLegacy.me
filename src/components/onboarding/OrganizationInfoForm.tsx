'use client';

import { useState } from 'react';

type FormDataType = {
  organizationName: string;
  organizationType: string;
  address: string;
  city: string;
  state: string;
  zipCode: string;
};

interface OrganizationInfoFormProps {
  formData: FormDataType;
  onUpdateFormData: (data: Partial<FormDataType>) => void;
  onNext: () => void;
  onBack: () => void;
}

export default function OrganizationInfoForm({
  formData,
  onUpdateFormData,
  onNext,
  onBack,
}: OrganizationInfoFormProps) {
  const [errors, setErrors] = useState<Record<string, string>>({});

  const validate = () => {
    const newErrors: Record<string, string> = {};

    if (!formData.organizationName.trim()) {
      newErrors.organizationName = 'Organization name is required';
    }

    if (!formData.organizationType.trim()) {
      newErrors.organizationType = 'Organization type is required';
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
      <h2 className="text-xl font-semibold text-gray-800">Organization Information</h2>

      <div>
        <label htmlFor="organizationName" className="block text-sm font-medium text-gray-700">
          Organization Name <span className="text-red-500">*</span>
        </label>
        <input
          type="text"
          id="organizationName"
          className={`mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 text-gray-900 ${
            errors.organizationName ? 'border-red-500' : ''
          }`}
          value={formData.organizationName}
          onChange={(e) => onUpdateFormData({ organizationName: e.target.value })}
        />
        {errors.organizationName && (
          <p className="mt-1 text-sm text-red-500">{errors.organizationName}</p>
        )}
      </div>

      <div>
        <label htmlFor="organizationType" className="block text-sm font-medium text-gray-700">
          Organization Type <span className="text-red-500">*</span>
        </label>
        <select
          id="organizationType"
          className={`mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 text-gray-900 ${
            errors.organizationType ? 'border-red-500' : ''
          }`}
          value={formData.organizationType}
          onChange={(e) => onUpdateFormData({ organizationType: e.target.value })}
        >
          <option value="">Select Organization Type</option>
          <option value="Law Firm">Law Firm</option>
          <option value="Financial Advisory">Financial Advisory</option>
          <option value="Estate Planning">Estate Planning</option>
          <option value="Wealth Management">Wealth Management</option>
          <option value="Accounting Firm">Accounting Firm</option>
          <option value="Insurance Agency">Insurance Agency</option>
          <option value="Other">Other</option>
        </select>
        {errors.organizationType && (
          <p className="mt-1 text-sm text-red-500">{errors.organizationType}</p>
        )}
      </div>

      <div>
        <label htmlFor="address" className="block text-sm font-medium text-gray-700">
          Address (Optional)
        </label>
        <input
          type="text"
          id="address"
          className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 text-gray-900"
          value={formData.address}
          onChange={(e) => onUpdateFormData({ address: e.target.value })}
        />
      </div>

      <div className="grid grid-cols-1 gap-4 sm:grid-cols-3">
        <div>
          <label htmlFor="city" className="block text-sm font-medium text-gray-700">
            City (Optional)
          </label>
          <input
            type="text"
            id="city"
            className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 text-gray-900"
            value={formData.city}
            onChange={(e) => onUpdateFormData({ city: e.target.value })}
          />
        </div>

        <div>
          <label htmlFor="state" className="block text-sm font-medium text-gray-700">
            State (Optional)
          </label>
          <input
            type="text"
            id="state"
            className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 text-gray-900"
            value={formData.state}
            onChange={(e) => onUpdateFormData({ state: e.target.value })}
          />
        </div>

        <div>
          <label htmlFor="zipCode" className="block text-sm font-medium text-gray-700">
            Zip Code (Optional)
          </label>
          <input
            type="text"
            id="zipCode"
            className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 text-gray-900"
            value={formData.zipCode}
            onChange={(e) => onUpdateFormData({ zipCode: e.target.value })}
          />
        </div>
      </div>

      <div className="flex justify-between pt-4">
        <button
          type="button"
          onClick={onBack}
          className="inline-flex items-center px-4 py-2 border border-gray-300 shadow-sm text-sm font-medium rounded-md text-gray-700 bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
        >
          Back
        </button>
        <button
          type="submit"
          className="inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md shadow-sm text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
        >
          Next
        </button>
      </div>
    </form>
  );
}
