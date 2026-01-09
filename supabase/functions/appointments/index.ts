import { serve } from "https://deno.land/std@0.190.0/http/server.ts";
import { createClient } from "https://esm.sh/@supabase/supabase-js@2";

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers": "authorization, x-client-info, apikey, content-type",
};

// Rate limiting configuration
const RATE_LIMITS = {
  APPOINTMENTS_PER_HOUR: 3, // Max appointments per IP per hour
};

const rateLimitStore = new Map<string, { count: number; resetAt: number }>();

function checkRateLimit(key: string, maxCount: number, windowMs: number) {
  const now = Date.now();
  const record = rateLimitStore.get(key);

  // Cleanup expired entries periodically
  if (Math.random() < 0.1) {
    for (const [k, v] of rateLimitStore.entries()) {
      if (now > v.resetAt) {
        rateLimitStore.delete(k);
      }
    }
  }

  if (!record || now > record.resetAt) {
    rateLimitStore.set(key, { count: 1, resetAt: now + windowMs });
    return { allowed: true, remaining: maxCount - 1 };
  }

  if (record.count >= maxCount) {
    return { allowed: false, remaining: 0 };
  }

  record.count++;
  return { allowed: true, remaining: maxCount - record.count };
}

// Validation schemas
function validateEmail(email: string): boolean {
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  return emailRegex.test(email) && email.length <= 255;
}

function validateName(name: string): boolean {
  return name.length >= 2 && name.length <= 100;
}

function validateNotes(notes: string | null): boolean {
  return !notes || notes.length <= 500;
}

function validateAppointmentType(type: string): boolean {
  const validTypes = ["consultation", "project-discussion", "thesis-review", "data-analysis"];
  return validTypes.includes(type);
}

function validateTime(time: string): boolean {
  const timeRegex = /^([01]?[0-9]|2[0-3]):[0-5][0-9]$/;
  return timeRegex.test(time);
}

function validateDate(dateStr: string): boolean {
  const date = new Date(dateStr);
  const today = new Date();
  today.setHours(0, 0, 0, 0);
  return date >= today && !isNaN(date.getTime());
}

serve(async (req: Request): Promise<Response> => {
  // Handle CORS preflight
  if (req.method === "OPTIONS") {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    const supabaseUrl = Deno.env.get("SUPABASE_URL")!;
    const supabaseServiceKey = Deno.env.get("SUPABASE_SERVICE_ROLE_KEY")!;
    const supabase = createClient(supabaseUrl, supabaseServiceKey);

    const body = await req.json();
    const { action } = body;

    if (action === "create") {
      // Rate limit by IP
      const clientIp = req.headers.get("x-forwarded-for")?.split(",")[0]?.trim() || "unknown";
      const rateKey = `appointments:${clientIp}`;
      const rateCheck = checkRateLimit(rateKey, RATE_LIMITS.APPOINTMENTS_PER_HOUR, 60 * 60 * 1000);

      if (!rateCheck.allowed) {
        console.log(`Rate limit exceeded for IP: ${clientIp}`);
        return new Response(
          JSON.stringify({ 
            error: "Too many appointment requests. Please try again later.",
            code: "RATE_LIMIT_EXCEEDED"
          }),
          { status: 429, headers: { "Content-Type": "application/json", ...corsHeaders } }
        );
      }

      // Extract and validate fields
      const {
        client_name,
        client_email,
        client_phone,
        client_timezone,
        appointment_date,
        appointment_time,
        appointment_type,
        meeting_link,
        notes,
      } = body;

      // Server-side validation
      if (!client_name || !validateName(client_name)) {
        return new Response(
          JSON.stringify({ error: "Name must be between 2 and 100 characters" }),
          { status: 400, headers: { "Content-Type": "application/json", ...corsHeaders } }
        );
      }

      if (!client_email || !validateEmail(client_email)) {
        return new Response(
          JSON.stringify({ error: "Invalid email address" }),
          { status: 400, headers: { "Content-Type": "application/json", ...corsHeaders } }
        );
      }

      if (!validateNotes(notes)) {
        return new Response(
          JSON.stringify({ error: "Notes must be less than 500 characters" }),
          { status: 400, headers: { "Content-Type": "application/json", ...corsHeaders } }
        );
      }

      if (!appointment_type || !validateAppointmentType(appointment_type)) {
        return new Response(
          JSON.stringify({ error: "Invalid appointment type" }),
          { status: 400, headers: { "Content-Type": "application/json", ...corsHeaders } }
        );
      }

      if (!appointment_time || !validateTime(appointment_time)) {
        return new Response(
          JSON.stringify({ error: "Invalid time format" }),
          { status: 400, headers: { "Content-Type": "application/json", ...corsHeaders } }
        );
      }

      if (!appointment_date || !validateDate(appointment_date)) {
        return new Response(
          JSON.stringify({ error: "Invalid or past date" }),
          { status: 400, headers: { "Content-Type": "application/json", ...corsHeaders } }
        );
      }

      // Insert appointment using service role (bypasses RLS)
      const { data, error } = await supabase
        .from("appointments")
        .insert({
          client_name: client_name.trim(),
          client_email: client_email.toLowerCase().trim(),
          client_phone: client_phone?.trim() || null,
          client_timezone: client_timezone || "UTC",
          appointment_date,
          appointment_time,
          appointment_type,
          meeting_link: meeting_link || null,
          notes: notes?.trim() || null,
          status: "pending",
        })
        .select()
        .single();

      if (error) {
        console.error("Database error:", error);
        return new Response(
          JSON.stringify({ error: "Failed to create appointment. Please try again." }),
          { status: 500, headers: { "Content-Type": "application/json", ...corsHeaders } }
        );
      }

      console.log(`Appointment created successfully for ${client_email}`);

      return new Response(
        JSON.stringify({ success: true, appointment: { id: data.id } }),
        { status: 200, headers: { "Content-Type": "application/json", ...corsHeaders } }
      );
    }

    return new Response(
      JSON.stringify({ error: "Invalid action" }),
      { status: 400, headers: { "Content-Type": "application/json", ...corsHeaders } }
    );
  } catch (error) {
    console.error("Unexpected error:", error);
    return new Response(
      JSON.stringify({ error: "An unexpected error occurred" }),
      { status: 500, headers: { "Content-Type": "application/json", ...corsHeaders } }
    );
  }
});
