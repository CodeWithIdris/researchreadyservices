import { serve } from "https://deno.land/std@0.190.0/http/server.ts";

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers": "authorization, x-client-info, apikey, content-type",
};

serve(async (req) => {
  if (req.method === "OPTIONS") {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    const resendApiKey = Deno.env.get("RESEND_API_KEY");
    const adminEmail = Deno.env.get("ADMIN_EMAIL");
    
    if (!resendApiKey) {
      console.error("RESEND_API_KEY not configured");
      return new Response(
        JSON.stringify({ error: "Email service not configured" }),
        { status: 500, headers: { ...corsHeaders, "Content-Type": "application/json" } }
      );
    }

    if (!adminEmail) {
      console.error("ADMIN_EMAIL not configured");
      return new Response(
        JSON.stringify({ error: "Admin email not configured" }),
        { status: 500, headers: { ...corsHeaders, "Content-Type": "application/json" } }
      );
    }

    const { type, data } = await req.json();

    console.log(`Sending notification: ${type}`);

    let emailContent: { subject: string; html: string };

    switch (type) {
      case "new_ticket":
        emailContent = {
          subject: `🎫 New Support Ticket: ${data.subject}`,
          html: `
            <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
              <h1 style="color: #1a365d; border-bottom: 2px solid #3182ce; padding-bottom: 10px;">
                New Support Ticket
              </h1>
              <div style="background: #f7fafc; padding: 20px; border-radius: 8px; margin: 20px 0;">
                <p><strong>Subject:</strong> ${data.subject}</p>
                <p><strong>Visitor Name:</strong> ${data.visitor_name || 'Not provided'}</p>
                <p><strong>Visitor Email:</strong> ${data.visitor_email || 'Not provided'}</p>
                <p><strong>Priority:</strong> <span style="color: ${data.priority === 'high' ? '#e53e3e' : '#3182ce'};">${data.priority}</span></p>
                ${data.description ? `<p><strong>Description:</strong></p><p style="background: white; padding: 10px; border-radius: 4px;">${data.description}</p>` : ''}
              </div>
              <p style="color: #718096; font-size: 14px;">
                Created at: ${new Date(data.created_at).toLocaleString()}
              </p>
              <a href="https://gpellxgpwtotwubvupce.lovable.app/admin/dashboard" 
                 style="display: inline-block; background: #3182ce; color: white; padding: 12px 24px; border-radius: 6px; text-decoration: none; margin-top: 20px;">
                View in Dashboard
              </a>
            </div>
          `
        };
        break;

      case "new_chat_session":
        emailContent = {
          subject: `💬 New Chat Session Started`,
          html: `
            <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
              <h1 style="color: #1a365d; border-bottom: 2px solid #38a169; padding-bottom: 10px;">
                New Chat Session
              </h1>
              <div style="background: #f0fff4; padding: 20px; border-radius: 8px; margin: 20px 0;">
                <p><strong>Visitor Name:</strong> ${data.visitor_name}</p>
                <p><strong>Session ID:</strong> ${data.id}</p>
              </div>
              <p style="color: #718096; font-size: 14px;">
                Started at: ${new Date(data.created_at).toLocaleString()}
              </p>
              <a href="https://gpellxgpwtotwubvupce.lovable.app/admin/dashboard" 
                 style="display: inline-block; background: #38a169; color: white; padding: 12px 24px; border-radius: 6px; text-decoration: none; margin-top: 20px;">
                View in Dashboard
              </a>
            </div>
          `
        };
        break;

      case "new_subscriber":
        emailContent = {
          subject: `📧 New Newsletter Subscriber`,
          html: `
            <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
              <h1 style="color: #1a365d; border-bottom: 2px solid #805ad5; padding-bottom: 10px;">
                New Newsletter Subscriber
              </h1>
              <div style="background: #faf5ff; padding: 20px; border-radius: 8px; margin: 20px 0;">
                <p><strong>Email:</strong> ${data.email}</p>
              </div>
              <p style="color: #718096; font-size: 14px;">
                Subscribed at: ${new Date(data.subscribed_at).toLocaleString()}
              </p>
            </div>
          `
        };
        break;

      default:
        return new Response(
          JSON.stringify({ error: "Unknown notification type" }),
          { status: 400, headers: { ...corsHeaders, "Content-Type": "application/json" } }
        );
    }

    // Send email using Resend API
    const emailResponse = await fetch("https://api.resend.com/emails", {
      method: "POST",
      headers: {
        "Authorization": `Bearer ${resendApiKey}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        from: "ResearchReady <onboarding@resend.dev>",
        to: [adminEmail],
        subject: emailContent.subject,
        html: emailContent.html,
      }),
    });

    if (!emailResponse.ok) {
      const errorText = await emailResponse.text();
      console.error("Resend API error:", errorText);
      return new Response(
        JSON.stringify({ error: "Failed to send email" }),
        { status: 500, headers: { ...corsHeaders, "Content-Type": "application/json" } }
      );
    }

    const emailData = await emailResponse.json();
    console.log("Email sent successfully:", emailData);

    return new Response(
      JSON.stringify({ success: true, emailId: emailData.id }),
      { status: 200, headers: { ...corsHeaders, "Content-Type": "application/json" } }
    );
  } catch (error: any) {
    console.error("Error in send-notification function:", error);
    return new Response(
      JSON.stringify({ error: error.message }),
      { status: 500, headers: { ...corsHeaders, "Content-Type": "application/json" } }
    );
  }
});
