import { create } from "zustand";
import { persist } from "zustand/middleware";

export type MessageRole = "system" | "user" | "assistant";

export interface Message {
  id: string;
  role: MessageRole;
  content: string;
  createdAt: Date;
}

interface ConversationState {
  messages: Message[];
  isLoading: boolean;
  error: string | null;
  sessionId: string | null;
  addMessage: (message: Omit<Message, "id" | "createdAt">) => void;
  setIsLoading: (isLoading: boolean) => void;
  setError: (error: string | null) => void;
  clearMessages: () => void;
  setSessionId: (sessionId: string | null) => void;
}

export const useConversationStore = create<ConversationState>()(
  persist(
    (set) => ({
      messages: [],
      isLoading: false,
      error: null,
      sessionId: null,
      addMessage: (message) =>
        set((state) => ({
          messages: [
            ...state.messages,
            {
              id: crypto.randomUUID(),
              ...message,
              createdAt: new Date(),
            },
          ],
        })),
      setIsLoading: (isLoading) => set({ isLoading }),
      setError: (error) => set({ error }),
      clearMessages: () => set({ messages: [] }),
      setSessionId: (sessionId) => set({ sessionId }),
    }),
    {
      name: "conversation-storage",
    }
  )
); 