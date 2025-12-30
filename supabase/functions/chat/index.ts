import { serve } from "https://deno.land/std@0.168.0/http/server.ts";
import { createClient } from "https://esm.sh/@supabase/supabase-js@2";

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers": "authorization, x-client-info, apikey, content-type",
};

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

        const { data, error } = await supabase
          .from("chat_messages")
          .insert({
            session_id,
            sender_type: sender_type || "visitor",
            message: message.trim().substring(0, 2000),
          })
          .select()
          .single();

        if (error) {
          console.error("Error sending message:", error);
          return new Response(
            JSON.stringify({ error: "Failed to send message" }),
            { status: 500, headers: { ...corsHeaders, "Content-Type": "application/json" } }
          );
        }

        console.log(`Message sent in session: ${session_id}`);
        return new Response(
          JSON.stringify({ message: data }),
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
