import { serve } from "https://deno.land/std@0.190.0/http/server.ts";

const RESEND_API_KEY = Deno.env.get("RESEND_API_KEY");

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers": "authorization, x-client-info, apikey, content-type",
};

interface EmailRequest {
  type: "confirmation" | "contact";
  to: string;
  clientName: string;
  appointmentDate?: string;
  appointmentTime?: string;
}

serve(async (req: Request): Promise<Response> => {
  if (req.method === "OPTIONS") {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    const data: EmailRequest = await req.json();
    console.log("Email request:", data.type, data.to);

    const subject = data.type === "confirmation" 
      ? "Appointment Confirmed - ResearchReady"
      : "We Received Your Message - ResearchReady";

    const html = data.type === "confirmation"
      ? `<h1>Appointment Confirmed!</h1><p>Hello ${data.clientName}, your appointment on ${data.appointmentDate} at ${data.appointmentTime} has been confirmed.</p>`
      : `<h1>Thank You!</h1><p>Hello ${data.clientName}, we received your message and will respond within 24 hours.</p>`;

    const res = await fetch("https://api.resend.com/emails", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${RESEND_API_KEY}`,
      },
      body: JSON.stringify({
        from: "ResearchReady <onboarding@resend.dev>",
        to: [data.to],
        subject,
        html,
      }),
    });

    const result = await res.json();
    console.log("Email sent:", result);

    return new Response(JSON.stringify({ success: true }), {
      status: 200,
      headers: { "Content-Type": "application/json", ...corsHeaders },
    });
  } catch (error: any) {
    console.error("Error:", error);
    return new Response(JSON.stringify({ error: error.message }), {
      status: 500,
      headers: { "Content-Type": "application/json", ...corsHeaders },
    });
  }
});