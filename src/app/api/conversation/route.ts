import { NextResponse } from "next/server";
import { createServerSupabaseClient } from "@/lib/supabase/server";
import { generateChatCompletion } from "@/lib/ai/anthropic";

export async function POST(request: Request) {
  try {
    // Get current user session
    const supabase = createServerSupabaseClient();
    const { data: { session } } = await supabase.auth.getSession();
    
    if (!session?.user) {
      return NextResponse.json(
        { error: "Unauthorized" },
        { status: 401 }
      );
    }

    // Parse request body
    const { message, organizationId, userId } = await request.json();
    
    if (!message || !organizationId) {
      return NextResponse.json(
        { error: "Missing required fields" },
        { status: 400 }
      );
    }

    // Verify user belongs to organization
    const { data: orgUser, error: orgUserError } = await supabase
      .from("organization_users")
      .select("role")
      .eq("organization_id", organizationId)
      .eq("user_id", userId)
      .single();

    if (orgUserError || !orgUser) {
      return NextResponse.json(
        { error: "User does not belong to this organization" },
        { status: 403 }
      );
    }

    // Save the user message to conversation history
    const { error: conversationError } = await supabase
      .from("conversation_history")
      .insert({
        organization_id: organizationId,
        user_id: userId,
        session_id: crypto.randomUUID(), // Ideally this should be consistent per conversation
        role: "user",
        content: message,
      });

    if (conversationError) {
      console.error("Error saving message:", conversationError);
    }

    // Get recent conversation history for context
    const { data: history } = await supabase
      .from("conversation_history")
      .select("role, content, created_at")
      .eq("organization_id", organizationId)
      .eq("user_id", userId)
      .order("created_at", { ascending: false })
      .limit(10);

    // Format messages for the AI
    const formattedHistory = history
      ? history
          .sort((a, b) => new Date(a.created_at).getTime() - new Date(b.created_at).getTime())
          .map((msg) => ({
            role: msg.role,
            content: msg.content,
          }))
      : [];

    const messages = [
      {
        role: "system" as const,
        content: `You are Claude, a helpful assistant for digital estate planning with LifeLegacy. 
        Your goal is to guide users through documenting their digital legacy, creating wills,
        managing beneficiaries, storing important documents, and leaving detailed instructions.
        Be empathetic, clear, and helpful. The current organization ID is ${organizationId}.`,
      },
      ...formattedHistory,
    ];

    // Generate AI response
    const aiResponse = await generateChatCompletion(messages, organizationId, userId);

    // Save the assistant's response
    const { error: responseError } = await supabase
      .from("conversation_history")
      .insert({
        organization_id: organizationId,
        user_id: userId,
        session_id: crypto.randomUUID(), // Should match the session ID from above
        role: "assistant",
        content: aiResponse.content || "",
      });

    if (responseError) {
      console.error("Error saving AI response:", responseError);
    }

    // Return the response
    return NextResponse.json({
      message: aiResponse.content || "I'm sorry, I couldn't generate a response.",
    });
  } catch (error) {
    console.error("Conversation API error:", error);
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    );
  }
} 