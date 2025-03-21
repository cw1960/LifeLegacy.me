'use client';

import { useState, useEffect } from 'react';
import { createClientComponentClient } from '@supabase/auth-helpers-nextjs';
import { 
  PlusIcon, 
  PencilIcon, 
  TrashIcon, 
  XMarkIcon, 
  CheckIcon,
  MapPinIcon,
  DocumentTextIcon,
  InformationCircleIcon
} from '@heroicons/react/24/outline';

// Real Data Type
interface PhysicalDocument {
  id: string;
  client_id: string;
  document_name: string;
  document_type: string;
  location: string;
  storage_details: string | null;
  contact_name: string | null;
  contact_info: string | null;
  notes: string | null;
  created_at: string;
  updated_at: string;
}

// Document type options
const documentTypes = [
  { value: 'will', label: 'Will & Testament' },
  { value: 'trust', label: 'Trust Documents' },
  { value: 'poa', label: 'Power of Attorney' },
  { value: 'property', label: 'Property Deeds' },
  { value: 'insurance', label: 'Insurance Policies' },
  { value: 'financial', label: 'Financial Statements' },
  { value: 'tax', label: 'Tax Returns' },
  { value: 'medical', label: 'Medical Directives' },
  { value: 'birth', label: 'Birth Certificate' },
  { value: 'marriage', label: 'Marriage Certificate' },
  { value: 'passport', label: 'Passport' },
  { value: 'military', label: 'Military Records' },
  { value: 'other', label: 'Other' },
];

export default function PhysicalDocumentsPage() {
  const [documents, setDocuments] = useState<PhysicalDocument[]>([]);
  const [loading, setLoading] = useState(true);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [currentDocument, setCurrentDocument] = useState<PhysicalDocument | null>(null);
  const [filterType, setFilterType] = useState('all');
  const [searchTerm, setSearchTerm] = useState('');
  const [errorMessage, setErrorMessage] = useState<string | null>(null);
  const supabase = createClientComponentClient();

  useEffect(() => {
    fetchDocuments();
  }, []);

  const fetchDocuments = async () => {
    setLoading(true);
    try {
      const response = await fetch('/api/physical-documents');
      if (!response.ok) {
        throw new Error('Failed to fetch documents');
      }
      const data = await response.json();
      setDocuments(data.documents || []);
    } catch (error) {
      console.error("Error fetching documents:", error);
      setErrorMessage("Failed to load your physical documents. Please try again later.");
    } finally {
      setLoading(false);
    }
  };

  const handleAddDocument = () => {
    setCurrentDocument(null);
    setErrorMessage(null);
    setIsModalOpen(true);
  };

  const handleEditDocument = (document: PhysicalDocument) => {
    setCurrentDocument(document);
    setErrorMessage(null);
    setIsModalOpen(true);
  };

  const handleDeleteDocument = async (id: string) => {
    if (confirm('Are you sure you want to delete this document? This cannot be undone.')) {
      try {
        const response = await fetch(`/api/physical-documents?id=${id}`, {
          method: 'DELETE'
        });
        
        if (!response.ok) {
          throw new Error('Failed to delete document');
        }
        
        // Remove the document from the state
        setDocuments(documents.filter(document => document.id !== id));
      } catch (error) {
        console.error("Error deleting document:", error);
        setErrorMessage("Failed to delete the document. Please try again later.");
      }
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMessage(null);
    
    const form = e.target as HTMLFormElement;
    const formData = new FormData(form);
    
    // Validation
    const documentName = formData.get('document_name') as string;
    const documentType = formData.get('document_type') as string;
    const location = formData.get('location') as string;
    
    if (!documentName || !documentType || !location) {
      setErrorMessage("Please fill in all required fields.");
      return;
    }
    
    // Prepare data object
    const data = {
      document_name: documentName,
      document_type: documentType,
      location: location,
      storage_details: formData.get('storage_details') as string,
      contact_name: formData.get('contact_name') as string,
      contact_info: formData.get('contact_info') as string,
      notes: formData.get('notes') as string
    };
    
    try {
      if (currentDocument) {
        // Update existing document
        const response = await fetch('/api/physical-documents', {
          method: 'PATCH',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({
            id: currentDocument.id,
            ...data
          }),
        });
        
        if (!response.ok) {
          throw new Error('Failed to update document');
        }
        
        const result = await response.json();
        
        // Update the document in the state
        setDocuments(documents.map(doc => 
          doc.id === currentDocument.id ? result.document : doc
        ));
      } else {
        // Create new document
        const response = await fetch('/api/physical-documents', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify(data),
        });
        
        if (!response.ok) {
          throw new Error('Failed to create document');
        }
        
        const result = await response.json();
        
        // Add the new document to the state
        setDocuments([result.document, ...documents]);
      }
      
      // Close modal and clear form
      setIsModalOpen(false);
    } catch (error) {
      console.error("Error saving document:", error);
      setErrorMessage("Failed to save the document. Please try again later.");
    }
  };

  const filteredDocuments = documents.filter(document => {
    const typeMatch = filterType === 'all' || document.document_type === filterType;
    
    const searchMatch = !searchTerm || 
      document.document_name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      document.location.toLowerCase().includes(searchTerm.toLowerCase()) ||
      (document.storage_details && document.storage_details.toLowerCase().includes(searchTerm.toLowerCase())) ||
      (document.contact_name && document.contact_name.toLowerCase().includes(searchTerm.toLowerCase())) ||
      (document.notes && document.notes.toLowerCase().includes(searchTerm.toLowerCase()));
      
    return typeMatch && searchMatch;
  });

  const getDocumentTypeLabel = (type: string) => {
    const docType = documentTypes.find(dt => dt.value === type);
    return docType ? docType.label : type;
  };

  const formatDate = (timestamp: string) => {
    return new Date(timestamp).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric'
    });
  };

  return (
    <div className="container mx-auto px-4 py-8">
      <h1 className="text-2xl font-semibold text-gray-900 mb-6">Physical Documents</h1>
      
      {/* Header with Add Button */}
      <div className="flex justify-between items-center mb-6">
        <p className="text-gray-600">
          Record and track the location of important physical documents.
        </p>
        <button
          onClick={handleAddDocument}
          className="bg-indigo-600 text-white px-4 py-2 rounded-md hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-indigo-500 flex items-center"
        >
          <PlusIcon className="h-5 w-5 mr-2" />
          Add Document
        </button>
      </div>

      {/* Info Card */}
      <div className="bg-blue-50 rounded-lg p-4 text-blue-700 mb-6">
        <h3 className="text-lg font-medium mb-2">Why track physical documents?</h3>
        <p>Keeping track of where your important physical documents are stored helps you and your loved ones quickly access them when needed.</p>
        <p className="mt-2">Include specific details about the location, contacts, and any special instructions for retrieval.</p>
      </div>

      {/* Error Message */}
      {errorMessage && (
        <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded relative mb-6">
          <span className="block sm:inline">{errorMessage}</span>
          <button
            className="absolute top-0 bottom-0 right-0 px-4 py-3"
            onClick={() => setErrorMessage(null)}
          >
            <XMarkIcon className="h-5 w-5" />
          </button>
        </div>
      )}

      {/* Filters */}
      <div className="bg-white rounded-lg shadow-sm p-4">
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between">
          <div className="mb-4 sm:mb-0">
            <label htmlFor="filter" className="block text-sm font-medium text-gray-700 mb-1">Filter by document type:</label>
            <select
              id="filter"
              value={filterType}
              onChange={(e) => setFilterType(e.target.value)}
              className="block w-full sm:w-auto border-gray-300 rounded-md shadow-sm focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
            >
              <option value="all">All Document Types</option>
              {documentTypes.map(type => (
                <option key={type.value} value={type.value}>{type.label}</option>
              ))}
            </select>
          </div>
          <div className="text-sm text-gray-600">
            Showing {filteredDocuments.length} of {documents.length} documents
          </div>
        </div>
      </div>

      {/* Search Input */}
      <div className="bg-white rounded-lg shadow-sm p-4">
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between">
          <div className="mb-4 sm:mb-0">
            <label htmlFor="search" className="block text-sm font-medium text-gray-700 mb-1">Search:</label>
            <input
              type="text"
              id="search"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="block w-full sm:w-auto border-gray-300 rounded-md shadow-sm focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
            />
          </div>
        </div>
      </div>

      {/* Documents List */}
      {loading ? (
        <div className="flex justify-center">
          <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-indigo-500"></div>
        </div>
      ) : (
        <div className="bg-white shadow overflow-hidden sm:rounded-md">
          <ul className="divide-y divide-gray-200">
            {filteredDocuments.length === 0 ? (
              <li className="px-6 py-8 text-center text-gray-500">
                {documents.length === 0 ? 
                  'No documents added yet. Add your first document to get started.' : 
                  'No documents match your current filter.'}
              </li>
            ) : (
              filteredDocuments.map((document) => (
                <li key={document.id} className="px-6 py-4">
                  <div className="flex flex-col sm:flex-row sm:items-start justify-between">
                    <div className="flex-1">
                      <div className="flex items-center">
                        <div className="h-10 w-10 rounded-full bg-indigo-100 flex items-center justify-center text-indigo-700">
                          <DocumentTextIcon className="h-6 w-6" />
                        </div>
                        <div className="ml-4">
                          <h3 className="text-lg font-medium text-gray-800">{document.document_name}</h3>
                          <div className="flex items-center mt-1">
                            <span className="text-sm text-gray-500">{getDocumentTypeLabel(document.document_type)}</span>
                            <span className="mx-2 text-gray-300">•</span>
                            <span className="text-sm text-gray-500">Last updated: {formatDate(document.updated_at)}</span>
                          </div>
                        </div>
                      </div>
                      
                      <div className="mt-4 space-y-3">
                        <div>
                          <div className="flex items-center">
                            <MapPinIcon className="h-5 w-5 text-gray-400 mr-1.5" />
                            <span className="text-sm font-medium text-gray-700">Location</span>
                          </div>
                          <p className="mt-1 text-sm text-gray-800 ml-6">{document.location}</p>
                          {document.storage_details && (
                            <p className="mt-1 text-sm text-gray-600 ml-6">{document.storage_details}</p>
                          )}
                        </div>
                        
                        {document.contact_name && (
                          <div>
                            <p className="text-sm font-medium text-gray-700">Contact Person</p>
                            <p className="mt-1 text-sm text-gray-800">{document.contact_name}</p>
                            {document.contact_info && (
                              <p className="mt-0.5 text-sm text-gray-600">{document.contact_info}</p>
                            )}
                          </div>
                        )}
                        
                        {document.notes && (
                          <div>
                            <p className="text-sm font-medium text-gray-700">Notes</p>
                            <p className="mt-1 text-sm text-gray-800">{document.notes}</p>
                          </div>
                        )}
                      </div>
                    </div>
                    
                    <div className="mt-4 sm:mt-0 flex flex-row sm:flex-col space-x-2 sm:space-x-0 sm:space-y-2">
                      <button
                        onClick={() => handleEditDocument(document)}
                        className="inline-flex items-center px-3 py-1 border border-gray-300 rounded-md text-sm font-medium text-gray-700 bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
                      >
                        <PencilIcon className="h-4 w-4 mr-1" />
                        Edit
                      </button>
                      <button
                        onClick={() => handleDeleteDocument(document.id)}
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

      {/* Add/Edit Document Modal */}
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
                    {currentDocument ? 'Edit Document' : 'Add New Document'}
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
                      <label htmlFor="document_name" className="block text-sm font-medium text-gray-700">Document Name</label>
                      <input
                        type="text"
                        name="document_name"
                        id="document_name"
                        placeholder="e.g. Last Will & Testament, Property Deed"
                        defaultValue={currentDocument?.document_name || ''}
                        className="mt-1 block w-full border-gray-300 rounded-md shadow-sm focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
                        required
                      />
                    </div>
                    
                    <div>
                      <label htmlFor="document_type" className="block text-sm font-medium text-gray-700">Document Type</label>
                      <select
                        id="document_type"
                        name="document_type"
                        defaultValue={currentDocument?.document_type || ''}
                        className="mt-1 block w-full border-gray-300 rounded-md shadow-sm focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
                        required
                      >
                        <option value="">Select Document Type</option>
                        {documentTypes.map(type => (
                          <option key={type.value} value={type.value}>{type.label}</option>
                        ))}
                      </select>
                    </div>
                    
                    <div>
                      <label htmlFor="location" className="block text-sm font-medium text-gray-700">Location</label>
                      <input
                        type="text"
                        name="location"
                        id="location"
                        placeholder="e.g. Home Safe, Safe Deposit Box, File Cabinet"
                        defaultValue={currentDocument?.location || ''}
                        className="mt-1 block w-full border-gray-300 rounded-md shadow-sm focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
                        required
                      />
                    </div>
                    
                    <div>
                      <label htmlFor="storage_details" className="block text-sm font-medium text-gray-700">Storage Details</label>
                      <input
                        type="text"
                        name="storage_details"
                        id="storage_details"
                        placeholder="e.g. Box number, drawer location, combination"
                        defaultValue={currentDocument?.storage_details || ''}
                        className="mt-1 block w-full border-gray-300 rounded-md shadow-sm focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
                      />
                    </div>
                    
                    <div>
                      <label htmlFor="contact_name" className="block text-sm font-medium text-gray-700">Contact Person (Optional)</label>
                      <input
                        type="text"
                        name="contact_name"
                        id="contact_name"
                        placeholder="e.g. Attorney, Financial Advisor, Spouse"
                        defaultValue={currentDocument?.contact_name || ''}
                        className="mt-1 block w-full border-gray-300 rounded-md shadow-sm focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
                      />
                    </div>
                    
                    <div>
                      <label htmlFor="contact_info" className="block text-sm font-medium text-gray-700">Contact Information (Optional)</label>
                      <input
                        type="text"
                        name="contact_info"
                        id="contact_info"
                        placeholder="e.g. Email, phone number"
                        defaultValue={currentDocument?.contact_info || ''}
                        className="mt-1 block w-full border-gray-300 rounded-md shadow-sm focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
                      />
                    </div>
                    
                    <div>
                      <label htmlFor="notes" className="block text-sm font-medium text-gray-700">Notes (Optional)</label>
                      <textarea
                        name="notes"
                        id="notes"
                        rows={3}
                        defaultValue={currentDocument?.notes || ''}
                        placeholder="Add any additional information about this document"
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
                      {currentDocument ? 'Save Changes' : 'Add Document'}
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