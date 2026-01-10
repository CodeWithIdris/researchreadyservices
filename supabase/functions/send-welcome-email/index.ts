import { serve } from "https://deno.land/std@0.190.0/http/server.ts";
import { Resend } from "https://esm.sh/resend@2.0.0";

const resend = new Resend(Deno.env.get("RESEND_API_KEY"));

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers":
    "authorization, x-client-info, apikey, content-type",
};

interface WelcomeEmailRequest {
  email: string;
  fullName: string;
}

const handler = async (req: Request): Promise<Response> => {
  // Handle CORS preflight requests
  if (req.method === "OPTIONS") {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    const { email, fullName }: WelcomeEmailRequest = await req.json();

    if (!email) {
      throw new Error("Email is required");
    }

    const firstName = fullName?.split(" ")[0] || "there";

    const emailResponse = await resend.emails.send({
      from: "ResearchReady <onboarding@resend.dev>",
      to: [email],
      subject: "Welcome to ResearchReady! 🎉",
      html: `
        <!DOCTYPE html>
        <html>
        <head>
          <meta charset="utf-8">
          <meta name="viewport" content="width=device-width, initial-scale=1.0">
        </head>
        <body style="font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, 'Helvetica Neue', Arial, sans-serif; line-height: 1.6; margin: 0; padding: 0; background-color: #f4f4f5;">
          <div style="max-width: 600px; margin: 0 auto; padding: 40px 20px;">
            <div style="background: white; border-radius: 12px; padding: 40px; box-shadow: 0 4px 6px rgba(0, 0, 0, 0.1);">
              
              <!-- Header -->
              <div style="text-align: center; margin-bottom: 32px;">
                <h1 style="font-size: 28px; font-weight: bold; color: #0c6b58; margin: 0;">
                  ResearchReady
                </h1>
              </div>

              <!-- Welcome Message -->
              <h2 style="font-size: 24px; color: #18181b; margin: 0 0 16px 0;">
                Welcome, ${firstName}! 👋
              </h2>
              
              <p style="color: #52525b; margin: 0 0 24px 0;">
                Thank you for creating your account with ResearchReady. We're thrilled to have you on board!
              </p>

              <p style="color: #52525b; margin: 0 0 24px 0;">
                With your new account, you can now:
              </p>

              <ul style="color: #52525b; margin: 0 0 24px 0; padding-left: 24px;">
                <li style="margin-bottom: 8px;">📊 Track your research projects in real-time</li>
                <li style="margin-bottom: 8px;">💬 Communicate directly with our experts</li>
                <li style="margin-bottom: 8px;">📄 Access and download your completed work</li>
                <li style="margin-bottom: 8px;">📅 Schedule consultations at your convenience</li>
              </ul>

              <!-- CTA Button -->
              <div style="text-align: center; margin: 32px 0;">
                <a href="https://researchreadyservices.lovable.app/dashboard" 
                   style="display: inline-block; background-color: #0c6b58; color: white; padding: 14px 32px; text-decoration: none; border-radius: 8px; font-weight: 600; font-size: 16px;">
                  Go to Your Dashboard
                </a>
              </div>

              <p style="color: #52525b; margin: 0 0 24px 0;">
                If you have any questions or need assistance, feel free to reach out to our support team. We're here to help!
              </p>

              <!-- Divider -->
              <hr style="border: none; border-top: 1px solid #e4e4e7; margin: 32px 0;" />

              <!-- Footer -->
              <p style="color: #a1a1aa; font-size: 14px; text-align: center; margin: 0;">
                ResearchReady - Professional Academic Research Services
              </p>
              <p style="color: #a1a1aa; font-size: 12px; text-align: center; margin: 8px 0 0 0;">
                This email was sent to ${email}. If you didn't create an account, you can safely ignore this email.
              </p>
            </div>
          </div>
        </body>
        </html>
      `,
    });

    console.log("Welcome email sent successfully:", emailResponse);

    return new Response(JSON.stringify(emailResponse), {
      status: 200,
      headers: {
        "Content-Type": "application/json",
        ...corsHeaders,
      },
    });
  } catch (error: any) {
    console.error("Error in send-welcome-email function:", error);
    return new Response(
      JSON.stringify({ error: error.message }),
      {
        status: 500,
        headers: { "Content-Type": "application/json", ...corsHeaders },
      }
    );
  }
};

serve(handler);
