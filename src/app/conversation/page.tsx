import React from "react";
import ConversationContainer from "@/components/conversation/ConversationContainer";

export const metadata = {
  title: "LifeLegacy - Conversation Assistant",
  description: "Your AI-powered estate planning guide",
};

export default function ConversationPage() {
  return (
    <div className="flex flex-col h-screen">
      <header className="border-b border-gray-200 bg-white">
        <div className="container mx-auto px-4 py-4 flex justify-between items-center">
          <h1 className="text-xl font-bold text-gray-900">Estate Planning Assistant</h1>
        </div>
      </header>
      
      <div className="flex-1 overflow-hidden">
        <ConversationContainer />
      </div>
    </div>
  );
} 