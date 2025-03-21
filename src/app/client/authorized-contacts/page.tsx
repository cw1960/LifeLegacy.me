'use client';

import { useState, useEffect } from 'react';
import { createClientComponentClient } from '@supabase/auth-helpers-nextjs';
import { 
  UserPlusIcon, 
  PencilIcon, 
  TrashIcon, 
  XMarkIcon, 
  CheckIcon,
  EnvelopeIcon,
  PhoneIcon
} from '@heroicons/react/24/outline';

// Mock Data Type
interface Contact {
  id: number;
  name: string;
  email: string;
  phone: string;
  relationship: string;
  access_level: 'full' | 'limited' | 'emergency';
}

export default function AuthorizedContactsPage() {
  const [contacts, setContacts] = useState<Contact[]>([]);
  const [loading, setLoading] = useState(true);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [currentContact, setCurrentContact] = useState<Contact | null>(null);
  const supabase = createClientComponentClient();

  useEffect(() => {
    // In a real implementation, fetch contacts from API
    setTimeout(() => {
      setContacts([
        {
          id: 1,
          name: 'Sarah Johnson',
          email: 'sarah@example.com',
          phone: '(555) 123-4567',
          relationship: 'Spouse',
          access_level: 'full'
        },
        {
          id: 2,
          name: 'Michael Chen',
          email: 'michael@example.com',
          phone: '(555) 987-6543',
          relationship: 'Child',
          access_level: 'limited'
        },
        {
          id: 3,
          name: 'Lisa Thompson',
          email: 'lisa@example.com',
          phone: '(555) 456-7890',
          relationship: 'Attorney',
          access_level: 'emergency'
        }
      ]);
      setLoading(false);
    }, 1000);
  }, []);

  const handleAddContact = () => {
    setCurrentContact(null);
    setIsModalOpen(true);
  };

  const handleEditContact = (contact: Contact) => {
    setCurrentContact(contact);
    setIsModalOpen(true);
  };

  const handleDeleteContact = (id: number) => {
    if (confirm('Are you sure you want to remove this contact?')) {
      setContacts(contacts.filter(contact => contact.id !== id));
    }
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    // Handle form submission
    // In a real implementation, save to API
    setIsModalOpen(false);
  };

  const accessLevelBadge = (level: string) => {
    let bgColor = '';
    let textColor = '';
    
    switch(level) {
      case 'full':
        bgColor = 'bg-green-100';
        textColor = 'text-green-800';
        break;
      case 'limited':
        bgColor = 'bg-blue-100';
        textColor = 'text-blue-800';
        break;
      case 'emergency':
        bgColor = 'bg-orange-100';
        textColor = 'text-orange-800';
        break;
      default:
        bgColor = 'bg-gray-100';
        textColor = 'text-gray-800';
    }

    return (
      <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${bgColor} ${textColor}`}>
        {level.charAt(0).toUpperCase() + level.slice(1)}
      </span>
    );
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-2xl font-bold text-gray-800">Authorized Contacts</h1>
          <p className="text-gray-600 mt-1">Manage people who can access your legacy information</p>
        </div>
        <button
          onClick={handleAddContact}
          className="inline-flex items-center px-4 py-2 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
        >
          <UserPlusIcon className="h-5 w-5 mr-2" />
          Add Contact
        </button>
      </div>

      {/* Info Card */}
      <div className="bg-blue-50 rounded-lg p-4 text-blue-700">
        <h3 className="text-lg font-medium mb-2">Why add authorized contacts?</h3>
        <p>Authorized contacts are individuals you trust to access your legacy information in case of emergency or after your passing. They can help execute your wishes and manage your digital and physical assets.</p>
        <p className="mt-2">We recommend adding at least 3 trusted individuals as your authorized contacts.</p>
      </div>

      {/* Contacts List */}
      {loading ? (
        <div className="flex justify-center">
          <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-indigo-500"></div>
        </div>
      ) : (
        <div className="bg-white shadow overflow-hidden sm:rounded-md">
          <ul className="divide-y divide-gray-200">
            {contacts.length === 0 ? (
              <li className="px-6 py-8 text-center text-gray-500">
                No contacts added yet. Add your first contact to get started.
              </li>
            ) : (
              contacts.map((contact) => (
                <li key={contact.id} className="px-6 py-4 flex flex-col sm:flex-row sm:items-center justify-between">
                  <div className="flex-1">
                    <div className="flex items-center">
                      <div className="h-10 w-10 rounded-full bg-indigo-100 flex items-center justify-center text-indigo-700 font-medium text-lg">
                        {contact.name.charAt(0)}
                      </div>
                      <div className="ml-4">
                        <h3 className="text-lg font-medium text-gray-800">{contact.name}</h3>
                        <p className="text-sm text-gray-500">{contact.relationship}</p>
                      </div>
                      <div className="ml-6 hidden sm:block">
                        {accessLevelBadge(contact.access_level)}
                      </div>
                    </div>
                    <div className="mt-2 sm:hidden">
                      {accessLevelBadge(contact.access_level)}
                    </div>
                    <div className="mt-2 space-y-1 text-sm text-gray-500">
                      <div className="flex items-center">
                        <EnvelopeIcon className="h-4 w-4 mr-1" />
                        {contact.email}
                      </div>
                      <div className="flex items-center">
                        <PhoneIcon className="h-4 w-4 mr-1" />
                        {contact.phone}
                      </div>
                    </div>
                  </div>
                  <div className="mt-4 sm:mt-0 flex space-x-2">
                    <button
                      onClick={() => handleEditContact(contact)}
                      className="inline-flex items-center px-3 py-1 border border-gray-300 rounded-md text-sm font-medium text-gray-700 bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
                    >
                      <PencilIcon className="h-4 w-4 mr-1" />
                      Edit
                    </button>
                    <button
                      onClick={() => handleDeleteContact(contact.id)}
                      className="inline-flex items-center px-3 py-1 border border-gray-300 rounded-md text-sm font-medium text-red-700 bg-white hover:bg-red-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-red-500"
                    >
                      <TrashIcon className="h-4 w-4 mr-1" />
                      Remove
                    </button>
                  </div>
                </li>
              ))
            )}
          </ul>
        </div>
      )}

      {/* Add/Edit Contact Modal */}
      {isModalOpen && (
        <div className="fixed inset-0 overflow-y-auto z-50">
          <div className="flex items-center justify-center min-h-screen pt-4 px-4 pb-20 text-center sm:block sm:p-0">
            <div className="fixed inset-0 transition-opacity" aria-hidden="true">
              <div className="absolute inset-0 bg-gray-500 opacity-75"></div>
            </div>

            <div className="inline-block align-bottom bg-white rounded-lg text-left overflow-hidden shadow-xl transform transition-all sm:my-8 sm:align-middle sm:max-w-lg sm:w-full">
              <div className="bg-white px-4 pt-5 pb-4 sm:p-6 sm:pb-4">
                <div className="flex justify-between items-start">
                  <h3 className="text-lg font-medium text-gray-900">
                    {currentContact ? 'Edit Contact' : 'Add New Contact'}
                  </h3>
                  <button
                    onClick={() => setIsModalOpen(false)}
                    className="text-gray-400 hover:text-gray-500"
                  >
                    <XMarkIcon className="h-5 w-5" />
                  </button>
                </div>
                <form onSubmit={handleSubmit} className="mt-4">
                  <div className="space-y-4">
                    <div>
                      <label htmlFor="name" className="block text-sm font-medium text-gray-700">Full Name</label>
                      <input
                        type="text"
                        name="name"
                        id="name"
                        defaultValue={currentContact?.name || ''}
                        className="mt-1 block w-full border-gray-300 rounded-md shadow-sm focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
                        required
                      />
                    </div>
                    <div>
                      <label htmlFor="email" className="block text-sm font-medium text-gray-700">Email Address</label>
                      <input
                        type="email"
                        name="email"
                        id="email"
                        defaultValue={currentContact?.email || ''}
                        className="mt-1 block w-full border-gray-300 rounded-md shadow-sm focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
                        required
                      />
                    </div>
                    <div>
                      <label htmlFor="phone" className="block text-sm font-medium text-gray-700">Phone Number</label>
                      <input
                        type="tel"
                        name="phone"
                        id="phone"
                        defaultValue={currentContact?.phone || ''}
                        className="mt-1 block w-full border-gray-300 rounded-md shadow-sm focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
                      />
                    </div>
                    <div>
                      <label htmlFor="relationship" className="block text-sm font-medium text-gray-700">Relationship</label>
                      <select
                        id="relationship"
                        name="relationship"
                        defaultValue={currentContact?.relationship || ''}
                        className="mt-1 block w-full border-gray-300 rounded-md shadow-sm focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
                        required
                      >
                        <option value="">Select Relationship</option>
                        <option value="Spouse">Spouse</option>
                        <option value="Partner">Partner</option>
                        <option value="Child">Child</option>
                        <option value="Parent">Parent</option>
                        <option value="Sibling">Sibling</option>
                        <option value="Friend">Friend</option>
                        <option value="Attorney">Attorney</option>
                        <option value="Financial Advisor">Financial Advisor</option>
                        <option value="Other">Other</option>
                      </select>
                    </div>
                    <div>
                      <label htmlFor="access_level" className="block text-sm font-medium text-gray-700">Access Level</label>
                      <select
                        id="access_level"
                        name="access_level"
                        defaultValue={currentContact?.access_level || 'limited'}
                        className="mt-1 block w-full border-gray-300 rounded-md shadow-sm focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
                        required
                      >
                        <option value="full">Full Access</option>
                        <option value="limited">Limited Access</option>
                        <option value="emergency">Emergency Only</option>
                      </select>
                      <p className="mt-1 text-xs text-gray-500">
                        Full access grants complete view of your legacy plan. Limited access restricts to specific sections. Emergency access is only available in case of emergency.
                      </p>
                    </div>
                  </div>
                  <div className="mt-5 sm:mt-6 sm:flex sm:flex-row-reverse">
                    <button
                      type="submit"
                      className="w-full inline-flex justify-center rounded-md border border-transparent shadow-sm px-4 py-2 bg-indigo-600 text-base font-medium text-white hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 sm:ml-3 sm:w-auto sm:text-sm"
                    >
                      <CheckIcon className="h-5 w-5 mr-2" />
                      {currentContact ? 'Save Changes' : 'Add Contact'}
                    </button>
                    <button
                      type="button"
                      onClick={() => setIsModalOpen(false)}
                      className="mt-3 w-full inline-flex justify-center rounded-md border border-gray-300 shadow-sm px-4 py-2 bg-white text-base font-medium text-gray-700 hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 sm:mt-0 sm:w-auto sm:text-sm"
                    >
                      Cancel
                    </button>
                  </div>
                </form>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
} 