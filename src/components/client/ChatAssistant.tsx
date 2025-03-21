'use client';

import React, { useState } from 'react';

export default function ChatAssistant() {
  const [isOpen, setIsOpen] = useState(false);
  const [message, setMessage] = useState('');
  const [chatHistory, setChatHistory] = useState<{
    type: 'user' | 'assistant';
    message: string;
    timestamp: Date;
  }[]>([
    {
      type: 'assistant',
      message: 'Hello! I\'m your LifeLegacy assistant. How can I help you today?',
      timestamp: new Date(),
    },
  ]);

  const handleSendMessage = (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!message.trim()) return;
    
    // Add user message to chat
    const userMessage = {
      type: 'user' as const,
      message: message.trim(),
      timestamp: new Date(),
    };
    
    setChatHistory([...chatHistory, userMessage]);
    setMessage('');
    
    // Simulate assistant response after a short delay
    setTimeout(() => {
      const assistantMessage = {
        type: 'assistant' as const,
        message: 'This is a placeholder response. The real AI assistant integration will be implemented soon.',
        timestamp: new Date(),
      };
      setChatHistory(prev => [...prev, assistantMessage]);
    }, 1000);
  };

  if (!isOpen) {
    return (
      <button 
        onClick={() => setIsOpen(true)}
        className="fixed bottom-6 right-6 bg-indigo-600 text-white rounded-full p-4 shadow-lg hover:bg-indigo-700 transition-colors"
      >
        <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 10h.01M12 10h.01M16 10h.01M9 16H5a2 2 0 01-2-2V6a2 2 0 012-2h14a2 2 0 012 2v8a2 2 0 01-2 2h-5l-5 5v-5z" />
        </svg>
      </button>
    );
  }

  return (
    <div className="fixed bottom-6 right-6 w-80 sm:w-96 h-96 bg-white rounded-lg shadow-xl flex flex-col border border-gray-200">
      <div className="flex justify-between items-center p-4 border-b">
        <h3 className="font-medium text-gray-900">LifeLegacy Assistant</h3>
        <button onClick={() => setIsOpen(false)} className="text-gray-500 hover:text-gray-700">
          <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
          </svg>
        </button>
      </div>
      
      <div className="flex-1 p-4 overflow-y-auto">
        {chatHistory.map((chat, index) => (
          <div 
            key={index} 
            className={`mb-3 ${
              chat.type === 'user' ? 'text-right' : 'text-left'
            }`}
          >
            <div 
              className={`inline-block p-3 rounded-lg ${
                chat.type === 'user' 
                  ? 'bg-indigo-600 text-white' 
                  : 'bg-gray-100 text-gray-800'
              }`}
            >
              {chat.message}
            </div>
            <div className="text-xs text-gray-500 mt-1">
              {chat.timestamp.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
            </div>
          </div>
        ))}
      </div>
      
      <form onSubmit={handleSendMessage} className="p-4 border-t">
        <div className="flex">
          <input
            type="text"
            value={message}
            onChange={(e) => setMessage(e.target.value)}
            placeholder="Type your message..."
            className="flex-1 border border-gray-300 rounded-l-lg px-4 py-2 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-transparent"
          />
          <button 
            type="submit"
            className="bg-indigo-600 text-white rounded-r-lg px-4 py-2 hover:bg-indigo-700 transition-colors"
          >
            <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 19l9 2-9-18-9 18 9-2zm0 0v-8" />
            </svg>
          </button>
        </div>
      </form>
    </div>
  );
} 