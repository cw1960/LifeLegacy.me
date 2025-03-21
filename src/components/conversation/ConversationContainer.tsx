'use client';

import React, { useState, useRef, useEffect } from "react";
import { useConversationStore, type Message } from "@/lib/store/conversation";
import { useAuthStore } from "@/lib/store/auth";
import { useOrganizationStore } from "@/lib/store/organization";
import MessageBubble from "./MessageBubble";

export default function ConversationContainer() {
  const [input, setInput] = useState<string>("");
  const messagesEndRef = useRef<HTMLDivElement>(null);
  
  // Access stores for state management
  const { 
    messages, 
    isLoading, 
    error, 
    addMessage, 
    setIsLoading, 
    setError 
  } = useConversationStore();
  
  const { user } = useAuthStore();
  const { currentOrganization } = useOrganizationStore();

  // Scroll to bottom when messages change
  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages]);

  // Handle sending a message
  const handleSendMessage = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!input.trim() || isLoading) return;
    if (!user || !currentOrganization) {
      setError("You must be logged in to use the conversation assistant");
      return;
    }

    // Add user message to conversation
    addMessage({
      role: "user",
      content: input.trim(),
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
          message: input.trim(),
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
    } catch (err) {
      console.error("Error in conversation:", err);
      setError(err instanceof Error ? err.message : "An unexpected error occurred");
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="flex flex-col h-full">
      <div className="flex-1 overflow-y-auto p-4 bg-gray-50">
        {messages.length === 0 ? (
          <div className="flex flex-col items-center justify-center h-full text-gray-500">
            <p className="text-lg font-medium">Welcome to LifeLegacy</p>
            <p className="mt-2 text-sm">How can I help with your estate planning today?</p>
          </div>
        ) : (
          <div className="space-y-4">
            {messages.map((message: Message) => (
              <MessageBubble 
                key={message.id} 
                message={message} 
                organization={currentOrganization}
              />
            ))}
            {isLoading && (
              <div className="animate-pulse flex items-center text-gray-500">
                <span className="ml-2">AI is thinking...</span>
              </div>
            )}
            {error && (
              <div className="bg-red-50 text-red-500 p-3 rounded-lg">
                {error}
              </div>
            )}
            <div ref={messagesEndRef} />
          </div>
        )}
      </div>

      <form 
        onSubmit={handleSendMessage} 
        className="p-4 border-t border-gray-200 bg-white"
      >
        <div className="flex items-center">
          <input
            type="text"
            value={input}
            onChange={(e) => setInput(e.target.value)}
            placeholder="Type your message..."
            className="flex-1 border border-gray-300 rounded-l-lg py-2 px-4 focus:outline-none focus:border-blue-500"
            disabled={isLoading}
          />
          <button
            type="submit"
            disabled={isLoading || !input.trim()}
            className="bg-blue-500 text-white py-2 px-4 rounded-r-lg hover:bg-blue-600 focus:outline-none disabled:opacity-50"
          >
            Send
          </button>
        </div>
      </form>
    </div>
  );
} 