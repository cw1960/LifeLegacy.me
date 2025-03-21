'use client';

import { useState, useEffect } from 'react';
import { createClientComponentClient } from '@supabase/auth-helpers-nextjs';
import { 
  PlusIcon,
  PencilIcon, 
  TrashIcon, 
  XMarkIcon, 
  CheckIcon,
  DocumentIcon,
  PhotoIcon,
  FilmIcon,
  MusicalNoteIcon,
  DocumentTextIcon,
  ArrowDownTrayIcon
} from '@heroicons/react/24/outline';

// Real Data Type
interface DigitalAsset {
  id: string;
  client_id: string;
  asset_name: string;
  asset_type: string;
  file_path: string;
  storage_path: string;
  description: string | null;
  size: string;
  created_at: string;
  updated_at: string;
  access_level: string;
  signed_url?: string | null;
}

export default function DigitalLockerPage() {
  const [assets, setAssets] = useState<DigitalAsset[]>([]);
  const [loading, setLoading] = useState(true);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [currentAsset, setCurrentAsset] = useState<DigitalAsset | null>(null);
  const [searchTerm, setSearchTerm] = useState('');
  const [filterType, setFilterType] = useState('all');
  const [uploadProgress, setUploadProgress] = useState(0);
  const [isUploading, setIsUploading] = useState(false);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);
  const supabase = createClientComponentClient();

  useEffect(() => {
    fetchAssets();
  }, []);

  const fetchAssets = async () => {
    setLoading(true);
    try {
      const response = await fetch('/api/digital-assets');
      if (!response.ok) {
        throw new Error('Failed to fetch assets');
      }
      const data = await response.json();
      setAssets(data.assets || []);
    } catch (error) {
      console.error("Error fetching assets:", error);
      setErrorMessage("Failed to load your digital assets. Please try again later.");
    } finally {
      setLoading(false);
    }
  };

  const handleAddAsset = () => {
    setCurrentAsset(null);
    setErrorMessage(null);
    setIsModalOpen(true);
  };

  const handleEditAsset = (asset: DigitalAsset) => {
    setCurrentAsset(asset);
    setErrorMessage(null);
    setIsModalOpen(true);
  };

  const handleDeleteAsset = async (id: string) => {
    if (confirm('Are you sure you want to delete this asset? This cannot be undone.')) {
      try {
        const response = await fetch(`/api/digital-assets?id=${id}`, {
          method: 'DELETE'
        });
        
        if (!response.ok) {
          throw new Error('Failed to delete asset');
        }
        
        // Remove the asset from the state
        setAssets(assets.filter(asset => asset.id !== id));
      } catch (error) {
        console.error("Error deleting asset:", error);
        setErrorMessage("Failed to delete the asset. Please try again later.");
      }
    }
  };

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setErrorMessage(null);
    
    const form = e.target as HTMLFormElement;
    const formData = new FormData(form);
    
    // Validation
    const assetName = formData.get('asset_name') as string;
    const assetType = formData.get('asset_type') as string;
    const accessLevel = formData.get('access_level') as string;
    
    if (!assetName || !assetType || !accessLevel) {
      setErrorMessage("Please fill in all required fields.");
      return;
    }
    
    // For edit (PATCH) request
    if (currentAsset) {
      try {
        const response = await fetch('/api/digital-assets', {
          method: 'PATCH',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({
            id: currentAsset.id,
            asset_name: assetName,
            description: formData.get('description') as string,
            access_level: accessLevel
          }),
        });
        
        if (!response.ok) {
          throw new Error('Failed to update asset');
        }
        
        const result = await response.json();
        
        // Update the asset in the state
        setAssets(assets.map(asset => 
          asset.id === currentAsset.id ? result.asset : asset
        ));
        
        setIsModalOpen(false);
      } catch (error) {
        console.error("Error updating asset:", error);
        setErrorMessage("Failed to update the asset. Please try again later.");
      }
      return;
    }
    
    // For new asset (POST) request
    const fileInput = form.querySelector('input[type="file"]') as HTMLInputElement;
    if (!fileInput.files || fileInput.files.length === 0) {
      setErrorMessage("Please select a file to upload.");
      return;
    }
    
    try {
      setIsUploading(true);
      setUploadProgress(10); // Initial progress
      
      const formData = new FormData(form);
      
      // Simulate progress while uploading
      const progressInterval = setInterval(() => {
        setUploadProgress(prev => {
          const newProgress = prev + Math.floor(Math.random() * 10);
          return newProgress > 90 ? 90 : newProgress;
        });
      }, 500);
      
      const response = await fetch('/api/digital-assets', {
        method: 'POST',
        body: formData,
      });
      
      clearInterval(progressInterval);
      
      if (!response.ok) {
        throw new Error('Failed to upload asset');
      }
      
      setUploadProgress(100); // Complete progress
      
      const result = await response.json();
      
      // Add the new asset to the state
      setAssets([result.asset, ...assets]);
      
      // Wait a moment to show 100% before closing
      setTimeout(() => {
        setIsModalOpen(false);
        setIsUploading(false);
        setUploadProgress(0);
      }, 500);
    } catch (error) {
      console.error("Error uploading asset:", error);
      setErrorMessage("Failed to upload the asset. Please try again later.");
      setIsUploading(false);
      setUploadProgress(0);
    }
  };

  const handleDownload = (asset: DigitalAsset) => {
    if (!asset.signed_url) {
      setErrorMessage("Download link not available. Please try again later.");
      return;
    }
    
    // Open the signed URL in a new tab to download
    window.open(asset.signed_url, '_blank');
  };

  const getAssetTypeIcon = (type: string) => {
    switch(type) {
      case 'document':
        return <DocumentTextIcon className="h-8 w-8 text-blue-500" />;
      case 'image':
        return <PhotoIcon className="h-8 w-8 text-green-500" />;
      case 'video':
        return <FilmIcon className="h-8 w-8 text-red-500" />;
      case 'audio':
        return <MusicalNoteIcon className="h-8 w-8 text-purple-500" />;
      default:
        return <DocumentIcon className="h-8 w-8 text-gray-500" />;
    }
  };

  const getAccessLevelBadge = (level: string) => {
    let bgColor = '';
    let textColor = '';
    
    switch(level) {
      case 'public':
        bgColor = 'bg-green-100';
        textColor = 'text-green-800';
        break;
      case 'private':
        bgColor = 'bg-red-100';
        textColor = 'text-red-800';
        break;
      case 'contacts':
        bgColor = 'bg-blue-100';
        textColor = 'text-blue-800';
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

  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    return date.toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric'
    });
  };

  const formatFileSize = (sizeInBytes: string) => {
    const bytes = parseInt(sizeInBytes, 10);
    if (bytes === 0) return '0 Bytes';

    const k = 1024;
    const sizes = ['Bytes', 'KB', 'MB', 'GB', 'TB'];
    const i = Math.floor(Math.log(bytes) / Math.log(k));

    return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + ' ' + sizes[i];
  };

  const filteredAssets = assets.filter(asset => {
    const matchesSearch = 
      asset.asset_name.toLowerCase().includes(searchTerm.toLowerCase()) || 
      (asset.description && asset.description.toLowerCase().includes(searchTerm.toLowerCase()));
    
    const matchesFilter = filterType === 'all' || asset.asset_type === filterType;
    
    return matchesSearch && matchesFilter;
  });

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-2xl font-bold text-gray-800">Digital Locker</h1>
          <p className="text-gray-600 mt-1">Securely store and manage your important digital assets</p>
        </div>
        <button
          onClick={handleAddAsset}
          className="inline-flex items-center px-4 py-2 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
        >
          <PlusIcon className="h-5 w-5 mr-2" />
          Add Digital Asset
        </button>
      </div>

      {/* Info Card */}
      <div className="bg-blue-50 rounded-lg p-4 text-blue-700">
        <h3 className="text-lg font-medium mb-2">Why use the Digital Locker?</h3>
        <p>Your Digital Locker is a secure space to store important files, photos, videos, and audio recordings. These assets can be designated for your loved ones after your passing, or kept private for your personal use.</p>
        <p className="mt-2">You can control who has access to each asset and organize them for easy retrieval.</p>
      </div>

      {/* Error Message */}
      {errorMessage && (
        <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded relative">
          <span className="block sm:inline">{errorMessage}</span>
          <button
            className="absolute top-0 bottom-0 right-0 px-4 py-3"
            onClick={() => setErrorMessage(null)}
          >
            <XMarkIcon className="h-5 w-5" />
          </button>
        </div>
      )}

      {/* Search and Filter */}
      <div className="flex flex-col md:flex-row md:items-center md:justify-between space-y-4 md:space-y-0">
        <div className="w-full md:w-1/2">
          <label htmlFor="search" className="sr-only">Search</label>
          <div className="relative">
            <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
              <svg className="h-5 w-5 text-gray-400" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor" aria-hidden="true">
                <path fillRule="evenodd" d="M8 4a4 4 0 100 8 4 4 0 000-8zM2 8a6 6 0 1110.89 3.476l4.817 4.817a1 1 0 01-1.414 1.414l-4.816-4.816A6 6 0 012 8z" clipRule="evenodd" />
              </svg>
            </div>
            <input
              id="search"
              name="search"
              className="block w-full pl-10 pr-3 py-2 border border-gray-300 rounded-md leading-5 bg-white placeholder-gray-500 focus:outline-none focus:placeholder-gray-400 focus:ring-1 focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
              placeholder="Search assets"
              type="search"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
            />
          </div>
        </div>
        <div className="flex space-x-2">
          <select
            id="filter"
            name="filter"
            className="block w-full pl-3 pr-10 py-2 text-base border-gray-300 focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm rounded-md"
            value={filterType}
            onChange={(e) => setFilterType(e.target.value)}
          >
            <option value="all">All Types</option>
            <option value="document">Documents</option>
            <option value="image">Images</option>
            <option value="video">Videos</option>
            <option value="audio">Audio</option>
            <option value="other">Other</option>
          </select>
        </div>
      </div>

      {/* Assets List */}
      {loading ? (
        <div className="flex justify-center">
          <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-indigo-500"></div>
        </div>
      ) : (
        <div className="bg-white shadow overflow-hidden sm:rounded-md">
          <ul className="divide-y divide-gray-200">
            {filteredAssets.length === 0 ? (
              <li className="px-6 py-8 text-center text-gray-500">
                {searchTerm || filterType !== 'all' 
                  ? 'No assets match your search criteria.' 
                  : 'No digital assets added yet. Add your first asset to get started.'}
              </li>
            ) : (
              filteredAssets.map((asset) => (
                <li key={asset.id} className="px-6 py-4">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center space-x-4">
                      <div className="flex-shrink-0">
                        {getAssetTypeIcon(asset.asset_type)}
                      </div>
                      <div className="flex-1 min-w-0">
                        <p className="text-lg font-medium text-gray-800 truncate">{asset.asset_name}</p>
                        <div className="mt-1 flex items-center space-x-2">
                          <p className="text-sm text-gray-500">{formatFileSize(asset.size)}</p>
                          <span className="text-gray-300">•</span>
                          <p className="text-sm text-gray-500">Uploaded on {formatDate(asset.created_at)}</p>
                          <span className="text-gray-300">•</span>
                          {getAccessLevelBadge(asset.access_level)}
                        </div>
                        {asset.description && <p className="mt-1 text-sm text-gray-500">{asset.description}</p>}
                      </div>
                    </div>
                    <div className="flex space-x-2">
                      <button
                        onClick={() => handleDownload(asset)}
                        disabled={!asset.signed_url}
                        className={`inline-flex items-center px-3 py-1 border border-gray-300 rounded-md text-sm font-medium ${
                          asset.signed_url 
                            ? 'text-indigo-700 bg-white hover:bg-indigo-50' 
                            : 'text-gray-400 bg-gray-100 cursor-not-allowed'
                        } focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500`}
                      >
                        <ArrowDownTrayIcon className="h-4 w-4 mr-1" />
                        Download
                      </button>
                      <button
                        onClick={() => handleEditAsset(asset)}
                        className="inline-flex items-center px-3 py-1 border border-gray-300 rounded-md text-sm font-medium text-gray-700 bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
                      >
                        <PencilIcon className="h-4 w-4 mr-1" />
                        Edit
                      </button>
                      <button
                        onClick={() => handleDeleteAsset(asset.id)}
                        className="inline-flex items-center px-3 py-1 border border-gray-300 rounded-md text-sm font-medium text-red-700 bg-white hover:bg-red-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-red-500"
                      >
                        <TrashIcon className="h-4 w-4 mr-1" />
                        Delete
                      </button>
                    </div>
                  </div>
                </li>
              ))
            )}
          </ul>
        </div>
      )}

      {/* Add/Edit Asset Modal */}
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
                    {currentAsset ? 'Edit Digital Asset' : 'Add New Digital Asset'}
                  </h3>
                  <button
                    onClick={() => setIsModalOpen(false)}
                    className="text-gray-400 hover:text-gray-500"
                  >
                    <XMarkIcon className="h-5 w-5" />
                  </button>
                </div>
                
                {errorMessage && (
                  <div className="mt-2 text-sm text-red-600">
                    {errorMessage}
                  </div>
                )}
                
                <form onSubmit={handleSubmit} className="mt-4">
                  <div className="space-y-4">
                    <div>
                      <label htmlFor="asset_name" className="block text-sm font-medium text-gray-700">Asset Name</label>
                      <input
                        type="text"
                        name="asset_name"
                        id="asset_name"
                        defaultValue={currentAsset?.asset_name || ''}
                        className="mt-1 block w-full border-gray-300 rounded-md shadow-sm focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
                        required
                      />
                    </div>
                    
                    {!currentAsset && (
                      <div>
                        <label htmlFor="asset_type" className="block text-sm font-medium text-gray-700">Asset Type</label>
                        <select
                          id="asset_type"
                          name="asset_type"
                          className="mt-1 block w-full border-gray-300 rounded-md shadow-sm focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
                          required
                        >
                          <option value="document">Document</option>
                          <option value="image">Image</option>
                          <option value="video">Video</option>
                          <option value="audio">Audio</option>
                          <option value="other">Other</option>
                        </select>
                      </div>
                    )}
                    
                    {!currentAsset && (
                      <div>
                        <label htmlFor="file" className="block text-sm font-medium text-gray-700">File Upload</label>
                        <div className="mt-1 flex justify-center px-6 pt-5 pb-6 border-2 border-gray-300 border-dashed rounded-md">
                          <div className="space-y-1 text-center">
                            <svg className="mx-auto h-12 w-12 text-gray-400" stroke="currentColor" fill="none" viewBox="0 0 48 48" aria-hidden="true">
                              <path d="M28 8H12a4 4 0 00-4 4v20m32-12v8m0 0v8a4 4 0 01-4 4H12a4 4 0 01-4-4v-4m32-4l-3.172-3.172a4 4 0 00-5.656 0L28 28M8 32l9.172-9.172a4 4 0 015.656 0L28 28m0 0l4 4m4-24h8m-4-4v8m-12 4h.02" strokeWidth={2} strokeLinecap="round" strokeLinejoin="round" />
                            </svg>
                            <div className="flex text-sm text-gray-600">
                              <label htmlFor="file-upload" className="relative cursor-pointer bg-white rounded-md font-medium text-indigo-600 hover:text-indigo-500 focus-within:outline-none focus-within:ring-2 focus-within:ring-offset-2 focus-within:ring-indigo-500">
                                <span>Upload a file</span>
                                <input id="file-upload" name="file" type="file" className="sr-only" />
                              </label>
                              <p className="pl-1">or drag and drop</p>
                            </div>
                            <p className="text-xs text-gray-500">
                              Upload any file up to 50MB
                            </p>
                          </div>
                        </div>
                        
                        {isUploading && (
                          <div className="mt-2">
                            <div className="relative pt-1">
                              <div className="flex mb-2 items-center justify-between">
                                <div>
                                  <span className="text-xs font-semibold inline-block py-1 px-2 uppercase rounded-full text-indigo-600 bg-indigo-200">
                                    Uploading
                                  </span>
                                </div>
                                <div className="text-right">
                                  <span className="text-xs font-semibold inline-block text-indigo-600">
                                    {uploadProgress}%
                                  </span>
                                </div>
                              </div>
                              <div className="overflow-hidden h-2 mb-4 text-xs flex rounded bg-indigo-200">
                                <div 
                                  style={{ width: `${uploadProgress}%` }} 
                                  className="shadow-none flex flex-col text-center whitespace-nowrap text-white justify-center bg-indigo-500"
                                ></div>
                              </div>
                            </div>
                          </div>
                        )}
                      </div>
                    )}
                    
                    <div>
                      <label htmlFor="description" className="block text-sm font-medium text-gray-700">Description</label>
                      <textarea
                        id="description"
                        name="description"
                        rows={3}
                        defaultValue={currentAsset?.description || ''}
                        className="mt-1 block w-full border-gray-300 rounded-md shadow-sm focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
                      />
                    </div>
                    
                    <div>
                      <label htmlFor="access_level" className="block text-sm font-medium text-gray-700">Access Level</label>
                      <select
                        id="access_level"
                        name="access_level"
                        defaultValue={currentAsset?.access_level || 'private'}
                        className="mt-1 block w-full border-gray-300 rounded-md shadow-sm focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
                        required
                      >
                        <option value="private">Private (Only you)</option>
                        <option value="contacts">Authorized Contacts</option>
                        <option value="public">Public (Anyone with link)</option>
                      </select>
                      <p className="mt-1 text-xs text-gray-500">
                        Who should have access to this asset after your passing or in case of emergency?
                      </p>
                    </div>
                  </div>
                  
                  <div className="mt-5 sm:mt-6 sm:flex sm:flex-row-reverse">
                    <button
                      type="submit"
                      disabled={isUploading}
                      className={`w-full inline-flex justify-center rounded-md border border-transparent shadow-sm px-4 py-2 bg-indigo-600 text-base font-medium text-white ${
                        isUploading ? 'opacity-50 cursor-not-allowed' : 'hover:bg-indigo-700'
                      } focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 sm:ml-3 sm:w-auto sm:text-sm`}
                    >
                      <CheckIcon className="h-5 w-5 mr-2" />
                      {currentAsset ? 'Save Changes' : isUploading ? 'Uploading...' : 'Upload Asset'}
                    </button>
                    <button
                      type="button"
                      onClick={() => setIsModalOpen(false)}
                      disabled={isUploading}
                      className={`mt-3 w-full inline-flex justify-center rounded-md border border-gray-300 shadow-sm px-4 py-2 bg-white text-base font-medium text-gray-700 ${
                        isUploading ? 'opacity-50 cursor-not-allowed' : 'hover:bg-gray-50'
                      } focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 sm:mt-0 sm:w-auto sm:text-sm`}
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