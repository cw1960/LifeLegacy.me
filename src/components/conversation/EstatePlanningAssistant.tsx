'use client';

import React, { useState, useRef, useEffect } from "react";
import { useRouter } from 'next/navigation';
import { useConversationStore, type Message } from "@/lib/store/conversation";
import { useAuthStore } from "@/lib/store/auth";
import { useOrganizationStore } from "@/lib/store/organization";
import MessageBubble from "./MessageBubble";

const SUGGESTED_PROMPTS = [
  {
    title: "Online Accounts",
    description: "Help me organize my online account information",
    icon: (
      <svg className="w-5 h-5" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 15a4 4 0 004 4h9a5 5 0 10-.1-9.999 5.002 5.002 0 10-9.78 2.096A4.001 4.001 0 003 15z" />
      </svg>
    )
  },
  {
    title: "Physical Documents",
    description: "Document where my important papers are located",
    icon: (
      <svg className="w-5 h-5" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
      </svg>
    )
  },
  {
    title: "Digital Assets",
    description: "Plan for my cryptocurrency and digital valuables",
    icon: (
      <svg className="w-5 h-5" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 10V3L4 14h7v7l9-11h-7z" />
      </svg>
    )
  },
  {
    title: "End-of-Life Instructions",
    description: "Create funeral and final arrangements instructions",
    icon: (
      <svg className="w-5 h-5" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16m14 0h2m-2 0h-5m-9 0H3m2 0h5M9 7h1m-1 4h1m4-4h1m-1 4h1m-5 10v-5a1 1 0 011-1h2a1 1 0 011 1v5m-4 0h4" />
      </svg>
    )
  },
  {
    title: "Legacy Planning",
    description: "Preserve my life story and personal values",
    icon: (
      <svg className="w-5 h-5" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6.253v13m0-13C10.832 5.477 9.246 5 7.5 5S4.168 5.477 3 6.253v13C4.168 18.477 5.754 18 7.5 18s3.332.477 4.5 1.253m0-13C13.168 5.477 14.754 5 16.5 5c1.747 0 3.332.477 4.5 1.253v13C19.832 18.477 18.247 18 16.5 18c-1.746 0-3.332.477-4.5 1.253" />
      </svg>
    )
  }
];

export default function EstatePlanningAssistant({ moduleType = "" }) {
  const [input, setInput] = useState<string>("");
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const [showWelcome, setShowWelcome] = useState(true);
  const router = useRouter();
  
  // Access stores for state management
  const { 
    messages, 
    isLoading, 
    error, 
    addMessage, 
    setIsLoading, 
    setError,
    clearMessages
  } = useConversationStore();
  
  const { user } = useAuthStore();
  const { currentOrganization } = useOrganizationStore();

  // Scroll to bottom when messages change
  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages]);

  // Set initial module-specific message if moduleType is provided
  useEffect(() => {
    if (moduleType && messages.length === 0) {
      let systemPrompt = "";
      
      switch(moduleType) {
        case "online-accounts":
          systemPrompt = "I'd like help documenting all my online accounts for my digital legacy. Please walk me through creating a comprehensive inventory of my accounts.";
          break;
        case "physical-documents":
          systemPrompt = "I need to create a guide to where all my important physical documents are located. Please help me document where everything is kept and how to access it.";
          break;
        case "digital-assets":
          systemPrompt = "I want to document my digital assets like cryptocurrency, NFTs, and digital valuables. Help me create a plan for securing and transferring these assets.";
          break;
        case "end-of-life-instructions":
          systemPrompt = "I want to create detailed end-of-life instructions covering my funeral preferences and final arrangements. Please help me document my wishes.";
          break;
        case "legacy-planning":
          systemPrompt = "I'd like to create a legacy plan that preserves my life story, values, and wisdom for future generations. Please guide me through this process.";
          break;
        default:
          systemPrompt = "I'd like help with digital estate planning. Can you guide me through the process?";
      }
      
      if (systemPrompt) {
        handleSendMessage(null, systemPrompt);
        setShowWelcome(false);
      }
    }
  }, [moduleType]);

  // Handle sending a message
  const handleSendMessage = async (e: React.FormEvent | null, overrideMessage?: string) => {
    if (e) e.preventDefault();
    
    const messageToSend = overrideMessage || input.trim();
    
    if (!messageToSend || isLoading) return;
    if (!user || !currentOrganization) {
      setError("You must be logged in to use the conversation assistant");
      return;
    }

    // Hide welcome screen when user starts chatting
    setShowWelcome(false);

    // Add user message to conversation
    addMessage({
      role: "user",
      content: messageToSend,
    });
    
    setInput("");
    setIsLoading(true);
    setError(null);

    try {
      // Send message to API endpoint
      const response = await fetch("/api/conversation", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          message: messageToSend,
          organizationId: currentOrganization.id,
          userId: user.id,
        }),
      });

      if (!response.ok) {
        throw new Error("Failed to get response from AI assistant");
      }

      const data = await response.json();

      // Add AI response to conversation
      addMessage({
        role: "assistant",
        content: data.message,
      });

      // If it's a module-specific conversation, extract and store relevant information
      if (moduleType) {
        // Future enhancement: Parse AI responses to automatically extract and store
        // structured data in the appropriate database tables
      }

    } catch (err) {
      console.error("Error in conversation:", err);
      setError(err instanceof Error ? err.message : "An unexpected error occurred");
    } finally {
      setIsLoading(false);
    }
  };

  const handleSuggestedPrompt = (prompt: string) => {
    handleSendMessage(null, prompt);
  };

  const handleStartNewConversation = () => {
    clearMessages();
    setShowWelcome(true);
  };

  return (
    <div className="flex flex-col h-full relative">
      <div className="flex-1 overflow-y-auto p-4 bg-gray-50">
        {showWelcome && messages.length === 0 ? (
          <div className="flex flex-col items-center justify-center h-full text-center p-6">
            <div className="w-16 h-16 bg-primary-100 rounded-full flex items-center justify-center text-primary-600 mb-4">
              <svg className="w-8 h-8" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 10h.01M12 10h.01M16 10h.01M9 16H5a2 2 0 01-2-2V6a2 2 0 012-2h14a2 2 0 012 2v8a2 2 0 01-2 2h-5l-5 5v-5z" />
              </svg>
            </div>
            <h3 className="text-lg font-semibold text-slate-900 mb-2">Welcome to your Digital Estate Planning Assistant</h3>
            <p className="text-slate-600 mb-8 max-w-md">
              I'm Claude, your AI guide through the estate planning process. 
              How can I help you today?
            </p>
            
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 w-full max-w-lg">
              {SUGGESTED_PROMPTS.map((prompt, index) => (
                <button
                  key={index}
                  onClick={() => handleSuggestedPrompt(prompt.description)}
                  className="flex items-start p-3 text-left rounded-md border border-slate-200 hover:border-primary-300 bg-white hover:bg-primary-50 transition-colors"
                >
                  <div className="flex-shrink-0 w-8 h-8 bg-primary-100 rounded-full flex items-center justify-center text-primary-600 mr-3">
                    {prompt.icon}
                  </div>
                  <div>
                    <h4 className="font-medium text-slate-900 text-sm">{prompt.title}</h4>
                    <p className="text-xs text-slate-500 mt-1">{prompt.description}</p>
                  </div>
                </button>
              ))}
            </div>
          </div>
        ) : (
          <div className="space-y-4 max-w-4xl mx-auto">
            {messages.map((message: Message, index) => (
              <MessageBubble 
                key={message.id || index} 
                message={message} 
                organization={currentOrganization}
              />
            ))}
            {isLoading && (
              <div className="flex items-center text-slate-500 p-4 bg-white rounded-lg border border-slate-200 shadow-sm">
                <div className="w-8 h-8 bg-primary-100 rounded-full flex items-center justify-center text-primary-600 mr-3 animate-pulse">
                  <svg className="w-5 h-5" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 10h.01M12 10h.01M16 10h.01M9 16H5a2 2 0 01-2-2V6a2 2 0 012-2h14a2 2 0 012 2v8a2 2 0 01-2 2h-5l-5 5v-5z" />
                  </svg>
                </div>
                <span>Claude is thinking...</span>
              </div>
            )}
            {error && (
              <div className="bg-red-50 text-red-500 p-4 rounded-lg border border-red-200">
                <div className="flex">
                  <svg className="w-5 h-5 mr-2" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor">
                    <path fillRule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7 4a1 1 0 11-2 0 1 1 0 012 0zm-1-9a1 1 0 00-1 1v4a1 1 0 102 0V6a1 1 0 00-1-1z" clipRule="evenodd" />
                  </svg>
                  {error}
                </div>
              </div>
            )}
            <div ref={messagesEndRef} />
          </div>
        )}
      </div>

      <form 
        onSubmit={handleSendMessage} 
        className="p-4 border-t border-slate-200 bg-white"
      >
        {messages.length > 0 && (
          <div className="flex justify-end mb-2">
            <button
              onClick={handleStartNewConversation}
              className="text-primary-600 text-sm hover:text-primary-700 focus:outline-none flex items-center"
              type="button"
            >
              <svg className="w-4 h-4 mr-1" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor">
                <path fillRule="evenodd" d="M4 2a1 1 0 011 1v2.101a7.002 7.002 0 0111.601 2.566 1 1 0 11-1.885.666A5.002 5.002 0 005.999 7H9a1 1 0 010 2H4a1 1 0 01-1-1V3a1 1 0 011-1zm.008 9.057a1 1 0 011.276.61A5.002 5.002 0 0014.001 13H11a1 1 0 110-2h5a1 1 0 011 1v5a1 1 0 11-2 0v-2.101a7.002 7.002 0 01-11.601-2.566 1 1 0 01.61-1.276z" clipRule="evenodd" />
              </svg>
              New conversation
            </button>
          </div>
        )}

        <div className="flex items-center bg-white rounded-lg border border-slate-300 focus-within:border-primary-500 focus-within:ring-2 focus-within:ring-primary-200">
          <input
            type="text"
            value={input}
            onChange={(e) => setInput(e.target.value)}
            placeholder="Type your message..."
            className="flex-1 py-3 px-4 bg-transparent focus:outline-none"
            disabled={isLoading}
          />
          <button
            type="submit"
            disabled={isLoading || !input.trim()}
            className="mx-2 text-primary-600 hover:text-primary-700 focus:outline-none disabled:opacity-50"
          >
            <svg className="w-6 h-6" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor">
              <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-8.707l-3-3a1 1 0 00-1.414 0l-3 3a1 1 0 001.414 1.414L9 9.414V13a1 1 0 102 0V9.414l1.293 1.293a1 1 0 001.414-1.414z" clipRule="evenodd" />
            </svg>
          </button>
        </div>
      </form>
    </div>
  );
} 