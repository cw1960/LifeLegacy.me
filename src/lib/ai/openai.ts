import OpenAI from "openai";

// Initialize the OpenAI client with API key
const openai = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY,
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
    const response = await openai.chat.completions.create({
      model: "gpt-4-turbo",
      messages,
      temperature: 0.7,
      max_tokens: 800,
    });

    return response.choices[0].message;
  } catch (error) {
    console.error("Error generating chat completion:", error);
    throw new Error("Failed to generate response from OpenAI");
  }
}

export async function generateEmbedding(text: string) {
  try {
    const response = await openai.embeddings.create({
      model: "text-embedding-3-small",
      input: text,
    });

    return response.data[0].embedding;
  } catch (error) {
    console.error("Error generating embedding:", error);
    throw new Error("Failed to generate embedding from OpenAI");
  }
} 