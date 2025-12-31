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

IMPORTANT GUIDELINES:
1. When users show serious interest in getting help with their project (thesis, dissertation, research paper, etc.), ALWAYS suggest they use our Project Request form by saying: "To get started, I recommend filling out our Project Request form - you can find it on our website. This helps our expert team understand your needs and provide an accurate quote."

2. If a user seems frustrated, has complex requirements, or explicitly asks to speak to a human expert, offer to create a support ticket by saying: "I can create a support ticket for you so one of our expert consultants can reach out directly. Would you like me to do that? Just provide your email address."

3. When users provide their email for a ticket, confirm by saying: "I've created a support ticket for you. One of our research specialists will contact you within 24 hours at [email]. Is there anything else I can help you with?"

4. For pricing questions, explain that pricing depends on the project scope and encourage them to fill out a project request form for an accurate quote.

Keep responses concise (2-3 sentences max) and helpful. Always maintain a professional yet warm tone.`;

// Keywords that suggest user wants expert help
const EXPERT_KEYWORDS = [
  "speak to human", "talk to someone", "real person", "expert", "consultant",
  "call me", "contact me", "reach out", "urgent", "complex", "frustrated",
  "not helpful", "speak to a person", "human agent"
];

// Keywords that suggest ready to start project
const PROJECT_READY_KEYWORDS = [
  "start", "begin", "how do i get started", "ready to order", "place an order",
  "hire you", "get quote", "pricing", "cost", "how much", "deadline"
];

function shouldSuggestTicket(message: string): boolean {
  const lowerMessage = message.toLowerCase();
  return EXPERT_KEYWORDS.some(keyword => lowerMessage.includes(keyword));
}

function shouldSuggestProjectRequest(message: string): boolean {
  const lowerMessage = message.toLowerCase();
  return PROJECT_READY_KEYWORDS.some(keyword => lowerMessage.includes(keyword));
}

// Simple email extraction
function extractEmail(message: string): string | null {
  const emailRegex = /[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}/;
  const match = message.match(emailRegex);
  return match ? match[0] : null;
}

async function generateAIResponse(
  messages: Array<{sender_type: string, message: string}>,
  supabase: any,
  sessionId: string,
  visitorName: string | null
): Promise<string> {
  const lovableApiKey = Deno.env.get("LOVABLE_API_KEY");
  
  if (!lovableApiKey) {
    console.error("LOVABLE_API_KEY not configured");
    return "Thank you for your message! Our team will get back to you shortly. In the meantime, feel free to explore our services or fill out our project request form.";
  }

  // Get the last visitor message
  const lastMessage = messages.filter(m => m.sender_type === "visitor").pop();
  const lastMessageText = lastMessage?.message || "";

  // Check if user provided email for ticket
  const email = extractEmail(lastMessageText);
  const conversationText = messages.map(m => m.message).join(" ").toLowerCase();
  
  // Check if we recently asked for email and now they provided it
  const recentlyAskedForEmail = conversationText.includes("provide your email") || 
                                 conversationText.includes("your email address");
  
  if (email && recentlyAskedForEmail) {
    // Create a support ticket
    try {
      await supabase.from("support_tickets").insert({
        session_id: sessionId,
        visitor_name: visitorName,
        visitor_email: email,
        subject: "Chat Escalation - Expert Consultation Requested",
        description: `Visitor requested to speak with an expert. Chat session ID: ${sessionId}. Last message context: ${lastMessageText}`,
        status: "open",
        priority: "high"
      });
      console.log(`Support ticket created for session: ${sessionId}`);
      return `I've created a support ticket for you. One of our research specialists will contact you within 24 hours at ${email}. Is there anything else I can help you with in the meantime?`;
    } catch (error) {
      console.error("Error creating ticket:", error);
    }
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
        max_tokens: 200,
      }),
    });

    if (!response.ok) {
      const errorText = await response.text();
      console.error("AI API error:", response.status, errorText);
      
      if (response.status === 429) {
        return "Thank you for reaching out! Our support team is here to help. Please fill out our Project Request form for personalized assistance with your research project.";
      }
      
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

    const { action, visitor_id, session_id, visitor_name, message, sender_type, email } = await req.json();

    // Validate visitor_id is provided for chat actions
    const chatActions = ["create_session", "get_messages", "send_message", "verify_session"];
    if (chatActions.includes(action)) {
      if (!visitor_id || typeof visitor_id !== "string" || visitor_id.length < 10) {
        return new Response(
          JSON.stringify({ error: "Invalid visitor_id" }),
          { status: 400, headers: { ...corsHeaders, "Content-Type": "application/json" } }
        );
      }
    }

    console.log(`Chat action: ${action}`);

    switch (action) {
      case "subscribe_newsletter": {
        if (!email || typeof email !== "string") {
          return new Response(
            JSON.stringify({ error: "Valid email is required" }),
            { status: 400, headers: { ...corsHeaders, "Content-Type": "application/json" } }
          );
        }

        // Basic email validation
        const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        if (!emailRegex.test(email)) {
          return new Response(
            JSON.stringify({ error: "Invalid email format" }),
            { status: 400, headers: { ...corsHeaders, "Content-Type": "application/json" } }
          );
        }

        const { data, error } = await supabase
          .from("newsletter_subscribers")
          .upsert(
            { email: email.toLowerCase().trim(), is_active: true },
            { onConflict: "email" }
          )
          .select()
          .single();

        if (error) {
          console.error("Error subscribing to newsletter:", error);
          return new Response(
            JSON.stringify({ error: "Failed to subscribe" }),
            { status: 500, headers: { ...corsHeaders, "Content-Type": "application/json" } }
          );
        }

        console.log(`Newsletter subscription: ${email}`);
        return new Response(
          JSON.stringify({ success: true, subscriber: data }),
          { status: 200, headers: { ...corsHeaders, "Content-Type": "application/json" } }
        );
      }

      case "create_ticket": {
        const { visitor_email, subject, description, priority } = await req.json();
        
        const { data, error } = await supabase
          .from("support_tickets")
          .insert({
            session_id: session_id || null,
            visitor_name: visitor_name || null,
            visitor_email: visitor_email,
            subject: subject || "Support Request",
            description: description || null,
            priority: priority || "normal"
          })
          .select()
          .single();

        if (error) {
          console.error("Error creating ticket:", error);
          return new Response(
            JSON.stringify({ error: "Failed to create ticket" }),
            { status: 500, headers: { ...corsHeaders, "Content-Type": "application/json" } }
          );
        }

        console.log(`Support ticket created: ${data.id}`);
        return new Response(
          JSON.stringify({ success: true, ticket: data }),
          { status: 200, headers: { ...corsHeaders, "Content-Type": "application/json" } }
        );
      }

      case "get_admin_data": {
        // Get all data for admin dashboard
        const [sessionsResult, ticketsResult, subscribersResult] = await Promise.all([
          supabase
            .from("chat_sessions")
            .select("*, chat_messages(count)")
            .order("created_at", { ascending: false })
            .limit(100),
          supabase
            .from("support_tickets")
            .select("*")
            .order("created_at", { ascending: false })
            .limit(100),
          supabase
            .from("newsletter_subscribers")
            .select("*")
            .order("subscribed_at", { ascending: false })
            .limit(100)
        ]);

        return new Response(
          JSON.stringify({
            sessions: sessionsResult.data || [],
            tickets: ticketsResult.data || [],
            subscribers: subscribersResult.data || []
          }),
          { status: 200, headers: { ...corsHeaders, "Content-Type": "application/json" } }
        );
      }

      case "get_session_messages": {
        // Admin action to get messages for any session
        if (!session_id) {
          return new Response(
            JSON.stringify({ error: "session_id is required" }),
            { status: 400, headers: { ...corsHeaders, "Content-Type": "application/json" } }
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

      case "update_ticket_status": {
        const { ticket_id, status } = await req.json();
        
        if (!ticket_id || !status) {
          return new Response(
            JSON.stringify({ error: "ticket_id and status are required" }),
            { status: 400, headers: { ...corsHeaders, "Content-Type": "application/json" } }
          );
        }

        const { data, error } = await supabase
          .from("support_tickets")
          .update({ status })
          .eq("id", ticket_id)
          .select()
          .single();

        if (error) {
          console.error("Error updating ticket:", error);
          return new Response(
            JSON.stringify({ error: "Failed to update ticket" }),
            { status: 500, headers: { ...corsHeaders, "Content-Type": "application/json" } }
          );
        }

        return new Response(
          JSON.stringify({ success: true, ticket: data }),
          { status: 200, headers: { ...corsHeaders, "Content-Type": "application/json" } }
        );
      }

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
          message: `Hello ${visitor_name}! Welcome to ResearchReady. How can we help you today? Whether you need help with a thesis, dissertation, research paper, or any academic project, I'm here to assist!`,
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
          .select("id, visitor_name")
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
          .select("id, visitor_name")
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

          // Generate AI response with context
          const aiResponse = await generateAIResponse(
            chatHistory || [], 
            supabase, 
            session_id, 
            session.visitor_name
          );

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
