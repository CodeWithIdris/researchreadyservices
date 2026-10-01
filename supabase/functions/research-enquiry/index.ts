import { serve } from "https://deno.land/std@0.190.0/http/server.ts";
import { createClient } from "https://esm.sh/@supabase/supabase-js@2";
import { corsHeaders } from "npm:@supabase/supabase-js@2/cors";


const allowedLevels = ["PhD", "Master's", "Academic/Researcher", "Professional", "Organisation", "Other"];
const allowedContacts = ["Email", "WhatsApp", "Either"];
const allowedMimeTypes = [
  "application/pdf",
  "application/msword",
  "application/vnd.openxmlformats-officedocument.wordprocessingml.document",
  "application/vnd.ms-excel",
  "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet",
  "text/csv",
  "text/plain",
];

const budgets = ["$150 – $300", "$300 – $700", "$700 – $1,500", "$1,500+", "Not sure — please assess"];
const rateLimitStore = new Map<string, { count: number; resetAt: number }>();

const json = (body: unknown, status = 200) => new Response(JSON.stringify(body), {
  status,
  headers: { ...corsHeaders, "Content-Type": "application/json" },
});

const text = (value: unknown, max: number) => typeof value === "string" ? value.trim().slice(0, max) : "";
const optionalText = (value: unknown, max: number) => {
  const parsed = text(value, max);
  return parsed || null;
};
const emailValid = (value: string) => /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(value) && value.length <= 255;

function canSubmit(ip: string) {
  const now = Date.now();
  const existing = rateLimitStore.get(ip);
  if (!existing || now > existing.resetAt) {
    rateLimitStore.set(ip, { count: 1, resetAt: now + 60 * 60 * 1000 });
    return true;
  }
  if (existing.count >= 5) return false;
  existing.count += 1;
  return true;
}

function priorityFor(budget: string, description: string) {
  const clear = description.length >= 120;
  const higherBudget = ["$300 – $700", "$700 – $1,500", "$1,500+"].includes(budget);
  if (higherBudget && clear) return "high";
  if (description.length >= 60) return "medium";
  return "low";
}

function decodeBase64(value: string) {
  if (!/^[A-Za-z0-9+/]*={0,2}$/.test(value) || value.length % 4 !== 0) throw new Error("Invalid file encoding");
  const raw = atob(value);
  return Uint8Array.from(raw, (character) => character.charCodeAt(0));
}

function signatureMatches(bytes: Uint8Array, mimeType: string) {
  if (mimeType === "application/pdf") return String.fromCharCode(...bytes.slice(0, 5)) === "%PDF-";
  if (mimeType.includes("openxmlformats")) return bytes[0] === 0x50 && bytes[1] === 0x4b;
  if (mimeType === "application/msword" || mimeType === "application/vnd.ms-excel") return bytes[0] === 0xd0 && bytes[1] === 0xcf;
  return mimeType === "text/csv" || mimeType === "text/plain";
}

serve(async (request) => {
  if (request.method === "OPTIONS") return new Response(null, { headers: corsHeaders });
  if (request.method !== "POST") return json({ error: "Method not allowed" }, 405);

  const supabaseUrl = Deno.env.get("SUPABASE_URL");
  const serviceRoleKey = Deno.env.get("SUPABASE_SERVICE_ROLE_KEY");
  if (!supabaseUrl || !serviceRoleKey) return json({ error: "Service configuration unavailable" }, 500);
  const supabase = createClient(supabaseUrl, serviceRoleKey);

  try {
    const body = await request.json();
    const action = text(body.action, 40) || "create";

    if (action === "signed_document_url") {
      const authorization = request.headers.get("Authorization") || "";
      const token = authorization.replace("Bearer ", "");
      const { data: authData } = await supabase.auth.getUser(token);
      if (!authData.user) return json({ error: "Authentication required" }, 401);
      const { data: isAdmin } = await supabase.rpc("is_admin", { _user_id: authData.user.id });
      if (!isAdmin) return json({ error: "Admin access required" }, 403);
      const documentId = text(body.document_id, 80);
      const { data: document } = await supabase
        .from("enquiry_documents")
        .select("storage_path, original_name")
        .eq("id", documentId)
        .single();
      if (!document) return json({ error: "Document not found" }, 404);
      const { data: signed, error } = await supabase.storage
        .from("research-enquiries")
        .createSignedUrl(document.storage_path, 60);
      if (error || !signed) return json({ error: "Unable to open document" }, 500);
      return json({ url: signed.signedUrl, name: document.original_name });
    }

    const clientIp = request.headers.get("x-forwarded-for")?.split(",")[0]?.trim() || "unknown";
    if (!canSubmit(clientIp)) return json({ error: "Too many enquiries. Please try again later." }, 429);

    const name = text(body.name, 100);
    const email = text(body.email, 255).toLowerCase();
    const whatsapp = optionalText(body.whatsapp, 40);
    const researchLevel = text(body.research_level, 40);
    const discipline = text(body.discipline, 120);
    const supportType = text(body.support_type, 120);
    const description = text(body.description, 3000);
    const researchStage = text(body.research_stage, 120);
    const deadline = text(body.deadline, 80);
    const preferredContact = text(body.preferred_contact, 20);
    const budgetRange = text(body.budget_range, 40);
    const country = optionalText(body.country, 100) || "Not provided";

    if (name.length < 2 || !emailValid(email)) return json({ error: "Please provide a valid name and email." }, 400);
    if (!allowedLevels.includes(researchLevel) || !allowedContacts.includes(preferredContact)) return json({ error: "Please choose valid enquiry options." }, 400);
    if (discipline.length < 2 || supportType.length < 2 || researchStage.length < 2 || deadline.length < 2) return json({ error: "Please complete all required fields." }, 400);
    if (description.length < 40) return json({ error: "Please describe the research problem in at least 40 characters." }, 400);
    if (!budgets.includes(budgetRange)) return json({ error: "Please choose a valid project range." }, 400);
    if ((preferredContact === "WhatsApp" || preferredContact === "Either") && !whatsapp) return json({ error: "Please provide a WhatsApp number for your preferred contact method." }, 400);

    const file = body.file && typeof body.file === "object" ? body.file : null;
    let fileBytes: Uint8Array | null = null;
    if (file) {
      const fileName = text(file.name, 180);
      const mimeType = text(file.type, 120);
      const size = Number(file.size);
      if (!fileName || !allowedMimeTypes.includes(mimeType) || !Number.isFinite(size) || size < 1 || size > 10 * 1024 * 1024 || typeof file.base64 !== "string") {
        return json({ error: "Upload a PDF, Word, Excel, CSV, or text file up to 10 MB." }, 400);
      }
      try {
        fileBytes = decodeBase64(file.base64.replace(/\s/g, ""));
      } catch {
        return json({ error: "The uploaded file could not be read." }, 400);
      }
      if (fileBytes.length !== size || !signatureMatches(fileBytes, mimeType)) return json({ error: "The uploaded file does not match its declared format." }, 400);
    }

    const priority = priorityFor(budgetRange, description);
    const source = optionalText(body.utm_source, 120) ? "ads" : optionalText(body.referrer, 500) ? "referral" : "organic";
    const { data: lead, error: leadError } = await supabase.from("project_leads").insert({
      name,
      email,
      whatsapp,
      country,
      budget_range: budgetRange,
      project_type: supportType,
      support_type: supportType,
      deadline,
      description,
      priority,
      source,
      fast_response: priority === "high",
      research_level: researchLevel,
      discipline,
      research_stage: researchStage,
      preferred_contact: preferredContact,
      utm_source: optionalText(body.utm_source, 120),
      utm_medium: optionalText(body.utm_medium, 120),
      utm_campaign: optionalText(body.utm_campaign, 160),
      utm_content: optionalText(body.utm_content, 160),
      utm_term: optionalText(body.utm_term, 160),
      first_utm_source: optionalText(body.first_utm_source, 160),
      first_utm_medium: optionalText(body.first_utm_medium, 160),
      first_utm_campaign: optionalText(body.first_utm_campaign, 160),
      first_utm_content: optionalText(body.first_utm_content, 160),
      first_utm_term: optionalText(body.first_utm_term, 160),
      first_referrer: optionalText(body.first_referrer, 500),
      first_landing_page: optionalText(body.first_landing_page, 500),
      referrer: optionalText(body.referrer, 500),
      landing_page: optionalText(body.landing_page, 500),
      ad_angle: optionalText(body.ad_angle, 120),
      status: "new",
    }).select("id").single();
    if (leadError || !lead) return json({ error: "We could not save your enquiry. Please try again." }, 500);

    let documentUploaded = false;
    if (file && fileBytes) {
      const safeName = text(file.name, 180).replace(/[^a-zA-Z0-9._-]/g, "-");
      const storagePath = `${lead.id}/${crypto.randomUUID()}-${safeName}`;
      const { error: uploadError } = await supabase.storage.from("research-enquiries").upload(storagePath, fileBytes, {
        contentType: file.type,
        upsert: false,
      });
      if (uploadError) {
        await supabase.from("project_leads").delete().eq("id", lead.id);
        return json({ error: "The document could not be stored. Please try again." }, 500);
      }
      const { error: documentError } = await supabase.from("enquiry_documents").insert({
          lead_id: lead.id,
          storage_path: storagePath,
          original_name: file.name,
          mime_type: file.type,
          size_bytes: file.size,
      });
      if (documentError) {
        await supabase.storage.from("research-enquiries").remove([storagePath]);
        await supabase.from("project_leads").delete().eq("id", lead.id);
        return json({ error: "The enquiry could not be completed. Please try again." }, 500);
      }
      documentUploaded = true;
    }

    return json({ success: true, enquiry_id: lead.id, priority, document_uploaded: documentUploaded });
  } catch (error) {
    console.error("Research enquiry error", error instanceof Error ? error.message : "Unknown error");
    return json({ error: "An unexpected error occurred. Please try again." }, 500);
  }
});