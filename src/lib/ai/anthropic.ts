import Anthropic from '@anthropic-ai/sdk';

// Initialize the Anthropic client with API key
const anthropic = new Anthropic({
  apiKey: process.env.ANTHROPIC_API_KEY,
});

type Message = {
  role: "system" | "user" | "assistant";
  content: string;
};

export async function generateChatCompletion(
  messages: Message[],
  organizationId: string,
  userId: string
) {
  try {
    // Extract system message from the array
    const systemMessage = messages.find((msg) => msg.role === 'system')?.content || '';
    
    // Format the remaining messages for Anthropic's API
    const formattedMessages = messages
      .filter((msg) => msg.role !== 'system')
      .map((msg) => {
        return {
          role: msg.role === 'assistant' ? 'assistant' : 'user',
          content: msg.content,
        };
      });

    const response = await anthropic.messages.create({
      model: 'claude-3-opus-20240229',
      system: systemMessage,
      messages: formattedMessages as any, // Type assertion as a workaround
      max_tokens: 1024,
      temperature: 0.7,
    });

    return {
      role: 'assistant',
      content: response.content[0].type === 'text' 
        ? response.content[0].text 
        : 'I encountered an issue processing your request.'
    };
  } catch (error) {
    console.error("Error generating chat completion:", error);
    throw new Error("Failed to generate response from Anthropic");
  }
}

export async function generateEmbedding(text: string) {
  // Note: Anthropic doesn't provide embeddings directly like OpenAI
  // If you need embeddings, you may want to keep using OpenAI's embedding API
  // or consider an alternative like:
  // - Using a self-hosted embedding model
  // - Using another embedding provider
  console.warn("Anthropic doesn't provide embedding service directly");
  
  throw new Error("Embedding generation not implemented for Anthropic");
} 