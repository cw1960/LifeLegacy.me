import React from "react";
import { type Message } from "@/lib/store/conversation";
import { type Organization } from "@/lib/store/organization";

interface MessageBubbleProps {
  message: Message;
  organization: Organization | null;
}

export default function MessageBubble({ message, organization }: MessageBubbleProps) {
  const isUser = message.role === "user";
  const isAssistant = message.role === "assistant";
  
  // Primary color for organization or fallback to a default blue
  const primaryColor = organization?.branding?.primaryColor || "#3B82F6";
  
  return (
    <div
      className={`flex ${isUser ? "justify-end" : "justify-start"}`}
    >
      <div
        className={`max-w-[80%] rounded-lg p-3 ${
          isUser
            ? `bg-blue-500 text-white ml-auto`
            : isAssistant
            ? "bg-white border border-gray-200 text-gray-800"
            : "bg-gray-200 text-gray-800 italic"
        }`}
        style={
          isUser
            ? { backgroundColor: primaryColor }
            : {}
        }
      >
        <div className="whitespace-pre-wrap break-words">
          {message.content}
        </div>
        <div
          className={`text-xs mt-1 ${
            isUser ? "text-blue-100" : "text-gray-500"
          }`}
        >
          {new Date(message.createdAt).toLocaleTimeString([], {
            hour: "2-digit",
            minute: "2-digit",
          })}
        </div>
      </div>
    </div>
  );
} 