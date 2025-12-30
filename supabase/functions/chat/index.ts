import { serve } from "https://deno.land/std@0.168.0/http/server.ts";
import { createClient } from "https://esm.sh/@supabase/supabase-js@2";

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers": "authorization, x-client-info, apikey, content-type",
};

const SYSTEM_PROMPT = `You are a helpful customer support assistant for ResearchReady, a professional academic research and writing service company. 

Your role is to:
- Answer questions about our services (thesis writing, dissertation help, research papers, literature reviews, data analysis, editing & proofreading)
- Help visitors understand our process and pricing
- Collect information about their research needs
- Be friendly, professional, and encouraging
- If asked about specific pricing, explain that pricing depends on the project scope and encourage them to fill out a project request form or contact us directly

Keep responses concise (2-3 sentences max) and helpful. Always maintain a professional yet warm tone.`;

async function generateAIResponse(messages: Array<{sender_type: string, message: string}>): Promise<string> {
  const lovableApiKey = Deno.env.get("LOVABLE_API_KEY");
  
  if (!lovableApiKey) {
    console.error("LOVABLE_API_KEY not configured");
    return "Thank you for your message! Our team will get back to you shortly. In the meantime, feel free to explore our services or fill out our project request form.";
  }

  try {
    // Convert chat history to API format
    const chatHistory = messages.map(msg => ({
      role: msg.sender_type === "visitor" ? "user" : "assistant",
      content: msg.message
    }));

    const response = await fetch("https://ai.gateway.lovable.dev/v1/chat/completions", {
      method: "POST",
      headers: {
        "Authorization": `Bearer ${lovableApiKey}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        model: "google/gemini-2.5-flash",
        messages: [
          { role: "system", content: SYSTEM_PROMPT },
          ...chatHistory
        ],
        max_tokens: 150,
        temperature: 0.7,
      }),
    });

    if (!response.ok) {
      const errorText = await response.text();
      console.error("AI API error:", response.status, errorText);
      return "Thank you for reaching out! Our support team is here to help. Could you tell us more about your research project?";
    }

    const data = await response.json();
    const aiMessage = data.choices?.[0]?.message?.content;
    
    if (!aiMessage) {
      console.error("No AI response content:", data);
      return "Thanks for your message! How can I assist you with your research project today?";
    }

    return aiMessage.trim();
  } catch (error) {
    console.error("Error generating AI response:", error);
    return "Thank you for your message! Our team is ready to help with your research needs. What type of project are you working on?";
  }
}

serve(async (req) => {
  // Handle CORS preflight requests
  if (req.method === "OPTIONS") {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    const supabaseUrl = Deno.env.get("SUPABASE_URL")!;
    const supabaseServiceKey = Deno.env.get("SUPABASE_SERVICE_ROLE_KEY")!;
    const supabase = createClient(supabaseUrl, supabaseServiceKey);

    const { action, visitor_id, session_id, visitor_name, message, sender_type } = await req.json();

    // Validate visitor_id is provided
    if (!visitor_id || typeof visitor_id !== "string" || visitor_id.length < 10) {
      return new Response(
        JSON.stringify({ error: "Invalid visitor_id" }),
        { status: 400, headers: { ...corsHeaders, "Content-Type": "application/json" } }
      );
    }

    console.log(`Chat action: ${action}, visitor: ${visitor_id.substring(0, 15)}...`);

    switch (action) {
      case "create_session": {
        if (!visitor_name || typeof visitor_name !== "string") {
          return new Response(
            JSON.stringify({ error: "visitor_name is required" }),
            { status: 400, headers: { ...corsHeaders, "Content-Type": "application/json" } }
          );
        }

        const { data, error } = await supabase
          .from("chat_sessions")
          .insert({ visitor_id, visitor_name: visitor_name.trim().substring(0, 100) })
          .select()
          .single();

        if (error) {
          console.error("Error creating session:", error);
          return new Response(
            JSON.stringify({ error: "Failed to create session" }),
            { status: 500, headers: { ...corsHeaders, "Content-Type": "application/json" } }
          );
        }

        // Add welcome message
        await supabase.from("chat_messages").insert({
          session_id: data.id,
          sender_type: "support",
          message: `Hello ${visitor_name}! Welcome to ResearchReady. How can we help you today?`,
        });

        console.log(`Session created: ${data.id}`);
        return new Response(
          JSON.stringify({ session: data }),
          { status: 200, headers: { ...corsHeaders, "Content-Type": "application/json" } }
        );
      }

      case "get_messages": {
        if (!session_id) {
          return new Response(
            JSON.stringify({ error: "session_id is required" }),
            { status: 400, headers: { ...corsHeaders, "Content-Type": "application/json" } }
          );
        }

        // Verify the session belongs to this visitor
        const { data: session } = await supabase
          .from("chat_sessions")
          .select("id")
          .eq("id", session_id)
          .eq("visitor_id", visitor_id)
          .single();

        if (!session) {
          return new Response(
            JSON.stringify({ error: "Session not found" }),
            { status: 404, headers: { ...corsHeaders, "Content-Type": "application/json" } }
          );
        }

        const { data: messages, error } = await supabase
          .from("chat_messages")
          .select("*")
          .eq("session_id", session_id)
          .order("created_at", { ascending: true });

        if (error) {
          console.error("Error fetching messages:", error);
          return new Response(
            JSON.stringify({ error: "Failed to fetch messages" }),
            { status: 500, headers: { ...corsHeaders, "Content-Type": "application/json" } }
          );
        }

        return new Response(
          JSON.stringify({ messages }),
          { status: 200, headers: { ...corsHeaders, "Content-Type": "application/json" } }
        );
      }

      case "send_message": {
        if (!session_id || !message) {
          return new Response(
            JSON.stringify({ error: "session_id and message are required" }),
            { status: 400, headers: { ...corsHeaders, "Content-Type": "application/json" } }
          );
        }

        // Verify the session belongs to this visitor
        const { data: session } = await supabase
          .from("chat_sessions")
          .select("id")
          .eq("id", session_id)
          .eq("visitor_id", visitor_id)
          .single();

        if (!session) {
          return new Response(
            JSON.stringify({ error: "Session not found" }),
            { status: 404, headers: { ...corsHeaders, "Content-Type": "application/json" } }
          );
        }

        // Save visitor's message
        const { data: visitorMessage, error: visitorError } = await supabase
          .from("chat_messages")
          .insert({
            session_id,
            sender_type: sender_type || "visitor",
            message: message.trim().substring(0, 2000),
          })
          .select()
          .single();

        if (visitorError) {
          console.error("Error sending message:", visitorError);
          return new Response(
            JSON.stringify({ error: "Failed to send message" }),
            { status: 500, headers: { ...corsHeaders, "Content-Type": "application/json" } }
          );
        }

        console.log(`Message sent in session: ${session_id}`);

        // Only generate AI response for visitor messages
        if (sender_type === "visitor" || !sender_type) {
          // Fetch conversation history for context
          const { data: chatHistory } = await supabase
            .from("chat_messages")
            .select("sender_type, message")
            .eq("session_id", session_id)
            .order("created_at", { ascending: true })
            .limit(20); // Limit context to last 20 messages

          // Generate AI response
          const aiResponse = await generateAIResponse(chatHistory || []);

          // Save AI response
          await supabase.from("chat_messages").insert({
            session_id,
            sender_type: "support",
            message: aiResponse,
          });

          console.log(`AI response generated for session: ${session_id}`);
        }

        return new Response(
          JSON.stringify({ message: visitorMessage }),
          { status: 200, headers: { ...corsHeaders, "Content-Type": "application/json" } }
        );
      }

      case "verify_session": {
        if (!session_id) {
          return new Response(
            JSON.stringify({ error: "session_id is required" }),
            { status: 400, headers: { ...corsHeaders, "Content-Type": "application/json" } }
          );
        }

        const { data: session } = await supabase
          .from("chat_sessions")
          .select("id, status")
          .eq("id", session_id)
          .eq("visitor_id", visitor_id)
          .single();

        return new Response(
          JSON.stringify({ valid: !!session, session }),
          { status: 200, headers: { ...corsHeaders, "Content-Type": "application/json" } }
        );
      }

      default:
        return new Response(
          JSON.stringify({ error: "Invalid action" }),
          { status: 400, headers: { ...corsHeaders, "Content-Type": "application/json" } }
        );
    }
  } catch (error) {
    console.error("Chat function error:", error);
    return new Response(
      JSON.stringify({ error: "Internal server error" }),
      { status: 500, headers: { ...corsHeaders, "Content-Type": "application/json" } }
    );
  }
});
