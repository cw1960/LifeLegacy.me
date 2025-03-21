'use client';

import { useState, useEffect } from 'react';
import { createClientComponentClient } from '@supabase/auth-helpers-nextjs';
import { 
  PlusIcon, 
  PencilIcon, 
  TrashIcon, 
  XMarkIcon, 
  CheckIcon,
  ShieldCheckIcon,
  EyeIcon,
  EyeSlashIcon,
  LockClosedIcon
} from '@heroicons/react/24/outline';

// Mock Data Type
interface OnlineAccount {
  id: number;
  account_name: string;
  website: string;
  username: string;
  password: string;
  account_type: string;
  notes: string;
  last_updated: string;
}

// Account type options
const accountTypes = [
  { value: 'banking', label: 'Banking & Financial' },
  { value: 'social', label: 'Social Media' },
  { value: 'email', label: 'Email' },
  { value: 'shopping', label: 'Shopping' },
  { value: 'subscription', label: 'Subscription Service' },
  { value: 'utility', label: 'Utilities & Bills' },
  { value: 'health', label: 'Healthcare' },
  { value: 'government', label: 'Government' },
  { value: 'work', label: 'Work & Professional' },
  { value: 'other', label: 'Other' },
];

export default function OnlineAccountsPage() {
  const [accounts, setAccounts] = useState<OnlineAccount[]>([]);
  const [loading, setLoading] = useState(true);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [currentAccount, setCurrentAccount] = useState<OnlineAccount | null>(null);
  const [filterType, setFilterType] = useState('all');
  const [showPasswords, setShowPasswords] = useState<{[key: number]: boolean}>({});
  const supabase = createClientComponentClient();

  useEffect(() => {
    // In a real implementation, fetch accounts from API
    setTimeout(() => {
      setAccounts([
        {
          id: 1,
          account_name: 'Bank of America',
          website: 'https://www.bankofamerica.com',
          username: 'johnsmith123',
          password: 'p@ssw0rd123',
          account_type: 'banking',
          notes: 'Checking and savings accounts',
          last_updated: '2023-10-15'
        },
        {
          id: 2,
          account_name: 'Gmail',
          website: 'https://mail.google.com',
          username: 'john.smith@gmail.com',
          password: 'gm@il2023',
          account_type: 'email',
          notes: 'Primary email account',
          last_updated: '2023-09-20'
        },
        {
          id: 3,
          account_name: 'Facebook',
          website: 'https://www.facebook.com',
          username: 'john.smith',
          password: 'fb$ecure123',
          account_type: 'social',
          notes: 'Family photos and connections',
          last_updated: '2023-08-05'
        },
        {
          id: 4,
          account_name: 'Amazon',
          website: 'https://www.amazon.com',
          username: 'js_shopping',
          password: 'amzn!2023',
          account_type: 'shopping',
          notes: 'Prime membership',
          last_updated: '2023-11-01'
        }
      ]);
      setLoading(false);
    }, 1000);
  }, []);

  const handleAddAccount = () => {
    setCurrentAccount(null);
    setIsModalOpen(true);
  };

  const handleEditAccount = (account: OnlineAccount) => {
    setCurrentAccount(account);
    setIsModalOpen(true);
  };

  const handleDeleteAccount = (id: number) => {
    if (confirm('Are you sure you want to delete this account?')) {
      setAccounts(accounts.filter(account => account.id !== id));
    }
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    // Handle form submission
    // In a real implementation, save to API
    setIsModalOpen(false);
  };

  const togglePasswordVisibility = (id: number) => {
    setShowPasswords(prev => ({
      ...prev,
      [id]: !prev[id]
    }));
  };

  const filteredAccounts = filterType === 'all' 
    ? accounts 
    : accounts.filter(account => account.account_type === filterType);

  const getAccountTypeLabel = (type: string) => {
    const accountType = accountTypes.find(at => at.value === type);
    return accountType ? accountType.label : type;
  };

  const getAccountTypeIcon = (type: string) => {
    let bgColor = 'bg-indigo-100';
    let textColor = 'text-indigo-600';

    switch(type) {
      case 'banking':
        bgColor = 'bg-green-100';
        textColor = 'text-green-600';
        break;
      case 'social':
        bgColor = 'bg-blue-100';
        textColor = 'text-blue-600';
        break;
      case 'email':
        bgColor = 'bg-purple-100';
        textColor = 'text-purple-600';
        break;
      case 'shopping':
        bgColor = 'bg-yellow-100';
        textColor = 'text-yellow-600';
        break;
      default:
        break;
    }

    return { bgColor, textColor };
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-2xl font-bold text-gray-800">Online Accounts</h1>
          <p className="text-gray-600 mt-1">Securely store your online account information</p>
        </div>
        <button
          onClick={handleAddAccount}
          className="inline-flex items-center px-4 py-2 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
        >
          <PlusIcon className="h-5 w-5 mr-2" />
          Add Account
        </button>
      </div>

      {/* Info Card */}
      <div className="bg-blue-50 rounded-lg p-4 text-blue-700">
        <div className="flex items-start">
          <div className="flex-shrink-0 mt-0.5">
            <ShieldCheckIcon className="h-5 w-5 text-blue-500" />
          </div>
          <div className="ml-3">
            <h3 className="text-lg font-medium">Your data is encrypted and secure</h3>
            <p className="mt-1">
              All account information including passwords are encrypted and can only be accessed by you and your authorized contacts with proper permission levels.
            </p>
          </div>
        </div>
      </div>

      {/* Filters */}
      <div className="bg-white rounded-lg shadow-sm p-4">
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between">
          <div className="mb-4 sm:mb-0">
            <label htmlFor="filter" className="block text-sm font-medium text-gray-700 mb-1">Filter by account type:</label>
            <select
              id="filter"
              value={filterType}
              onChange={(e) => setFilterType(e.target.value)}
              className="block w-full sm:w-auto border-gray-300 rounded-md shadow-sm focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
            >
              <option value="all">All Account Types</option>
              {accountTypes.map(type => (
                <option key={type.value} value={type.value}>{type.label}</option>
              ))}
            </select>
          </div>
          <div className="text-sm text-gray-600">
            Showing {filteredAccounts.length} of {accounts.length} accounts
          </div>
        </div>
      </div>

      {/* Accounts List */}
      {loading ? (
        <div className="flex justify-center">
          <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-indigo-500"></div>
        </div>
      ) : (
        <div className="bg-white shadow overflow-hidden sm:rounded-md">
          <ul className="divide-y divide-gray-200">
            {filteredAccounts.length === 0 ? (
              <li className="px-6 py-8 text-center text-gray-500">
                {accounts.length === 0 ? 
                  'No accounts added yet. Add your first account to get started.' : 
                  'No accounts match your current filter.'}
              </li>
            ) : (
              filteredAccounts.map((account) => {
                const { bgColor, textColor } = getAccountTypeIcon(account.account_type);
                return (
                  <li key={account.id} className="px-6 py-4">
                    <div className="flex flex-col sm:flex-row sm:items-center justify-between">
                      <div className="flex-1">
                        <div className="flex items-center">
                          <div className={`h-10 w-10 rounded-full ${bgColor} flex items-center justify-center ${textColor}`}>
                            <LockClosedIcon className="h-6 w-6" />
                          </div>
                          <div className="ml-4">
                            <h3 className="text-lg font-medium text-gray-800">{account.account_name}</h3>
                            <p className="text-sm text-gray-500">{getAccountTypeLabel(account.account_type)}</p>
                          </div>
                        </div>
                        
                        <div className="mt-4 grid grid-cols-1 md:grid-cols-2 gap-x-4 gap-y-2">
                          <div>
                            <p className="text-sm font-medium text-gray-500">Website</p>
                            <a href={account.website} target="_blank" rel="noopener noreferrer" className="text-indigo-600 hover:text-indigo-800 text-sm truncate block">
                              {account.website}
                            </a>
                          </div>
                          <div>
                            <p className="text-sm font-medium text-gray-500">Username</p>
                            <p className="text-sm text-gray-800">{account.username}</p>
                          </div>
                          <div>
                            <p className="text-sm font-medium text-gray-500">Password</p>
                            <div className="flex items-center">
                              <p className="text-sm text-gray-800 font-mono">
                                {showPasswords[account.id] ? account.password : '••••••••••'}
                              </p>
                              <button 
                                onClick={() => togglePasswordVisibility(account.id)}
                                className="ml-2 text-gray-400 hover:text-gray-600"
                              >
                                {showPasswords[account.id] ? (
                                  <EyeSlashIcon className="h-4 w-4" />
                                ) : (
                                  <EyeIcon className="h-4 w-4" />
                                )}
                              </button>
                            </div>
                          </div>
                          <div>
                            <p className="text-sm font-medium text-gray-500">Last Updated</p>
                            <p className="text-sm text-gray-800">{account.last_updated}</p>
                          </div>
                        </div>
                        
                        {account.notes && (
                          <div className="mt-2">
                            <p className="text-sm font-medium text-gray-500">Notes</p>
                            <p className="text-sm text-gray-800">{account.notes}</p>
                          </div>
                        )}
                      </div>
                      
                      <div className="mt-4 sm:mt-0 flex flex-row sm:flex-col space-x-2 sm:space-x-0 sm:space-y-2">
                        <button
                          onClick={() => handleEditAccount(account)}
                          className="inline-flex items-center px-3 py-1 border border-gray-300 rounded-md text-sm font-medium text-gray-700 bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
                        >
                          <PencilIcon className="h-4 w-4 mr-1" />
                          Edit
                        </button>
                        <button
                          onClick={() => handleDeleteAccount(account.id)}
                          className="inline-flex items-center px-3 py-1 border border-gray-300 rounded-md text-sm font-medium text-red-700 bg-white hover:bg-red-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-red-500"
                        >
                          <TrashIcon className="h-4 w-4 mr-1" />
                          Delete
                        </button>
                      </div>
                    </div>
                  </li>
                );
              })
            )}
          </ul>
        </div>
      )}

      {/* Add/Edit Account Modal */}
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
                    {currentAccount ? 'Edit Account' : 'Add New Account'}
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
                      <label htmlFor="account_name" className="block text-sm font-medium text-gray-700">Account Name</label>
                      <input
                        type="text"
                        name="account_name"
                        id="account_name"
                        placeholder="e.g. Bank of America, Gmail, Facebook"
                        defaultValue={currentAccount?.account_name || ''}
                        className="mt-1 block w-full border-gray-300 rounded-md shadow-sm focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
                        required
                      />
                    </div>
                    
                    <div>
                      <label htmlFor="account_type" className="block text-sm font-medium text-gray-700">Account Type</label>
                      <select
                        id="account_type"
                        name="account_type"
                        defaultValue={currentAccount?.account_type || ''}
                        className="mt-1 block w-full border-gray-300 rounded-md shadow-sm focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
                        required
                      >
                        <option value="">Select Account Type</option>
                        {accountTypes.map(type => (
                          <option key={type.value} value={type.value}>{type.label}</option>
                        ))}
                      </select>
                    </div>
                    
                    <div>
                      <label htmlFor="website" className="block text-sm font-medium text-gray-700">Website URL</label>
                      <input
                        type="url"
                        name="website"
                        id="website"
                        placeholder="https://www.example.com"
                        defaultValue={currentAccount?.website || ''}
                        className="mt-1 block w-full border-gray-300 rounded-md shadow-sm focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
                        required
                      />
                    </div>
                    
                    <div>
                      <label htmlFor="username" className="block text-sm font-medium text-gray-700">Username / Email</label>
                      <input
                        type="text"
                        name="username"
                        id="username"
                        defaultValue={currentAccount?.username || ''}
                        className="mt-1 block w-full border-gray-300 rounded-md shadow-sm focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
                        required
                      />
                    </div>
                    
                    <div>
                      <label htmlFor="password" className="block text-sm font-medium text-gray-700">Password</label>
                      <input
                        type="password"
                        name="password"
                        id="password"
                        defaultValue={currentAccount?.password || ''}
                        className="mt-1 block w-full border-gray-300 rounded-md shadow-sm focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
                        required
                      />
                      <p className="mt-1 text-xs text-gray-500">
                        Your password is encrypted and securely stored.
                      </p>
                    </div>
                    
                    <div>
                      <label htmlFor="notes" className="block text-sm font-medium text-gray-700">Notes (Optional)</label>
                      <textarea
                        name="notes"
                        id="notes"
                        rows={3}
                        defaultValue={currentAccount?.notes || ''}
                        placeholder="Add any additional information about this account"
                        className="mt-1 block w-full border-gray-300 rounded-md shadow-sm focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
                      />
                    </div>
                  </div>
                  <div className="mt-5 sm:mt-6 sm:flex sm:flex-row-reverse">
                    <button
                      type="submit"
                      className="w-full inline-flex justify-center rounded-md border border-transparent shadow-sm px-4 py-2 bg-indigo-600 text-base font-medium text-white hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 sm:ml-3 sm:w-auto sm:text-sm"
                    >
                      <CheckIcon className="h-5 w-5 mr-2" />
                      {currentAccount ? 'Save Changes' : 'Add Account'}
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