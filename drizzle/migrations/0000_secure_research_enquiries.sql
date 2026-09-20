ALTER TABLE public.project_leads
  ADD COLUMN IF NOT EXISTS whatsapp TEXT,
  ADD COLUMN IF NOT EXISTS research_level TEXT,
  ADD COLUMN IF NOT EXISTS discipline TEXT,
  ADD COLUMN IF NOT EXISTS support_type TEXT,
  ADD COLUMN IF NOT EXISTS research_stage TEXT,
  ADD COLUMN IF NOT EXISTS preferred_contact TEXT,
  ADD COLUMN IF NOT EXISTS utm_source TEXT,
  ADD COLUMN IF NOT EXISTS utm_medium TEXT,
  ADD COLUMN IF NOT EXISTS utm_campaign TEXT,
  ADD COLUMN IF NOT EXISTS utm_content TEXT,
  ADD COLUMN IF NOT EXISTS utm_term TEXT,
  ADD COLUMN IF NOT EXISTS referrer TEXT,
  ADD COLUMN IF NOT EXISTS landing_page TEXT,
  ADD COLUMN IF NOT EXISTS ad_angle TEXT;

ALTER TABLE public.project_leads
  ADD CONSTRAINT project_leads_status_allowed
  CHECK (status IN ('new', 'reviewing', 'contacted', 'qualified', 'converted', 'not_a_fit', 'closed')) NOT VALID;

REVOKE INSERT ON public.project_leads FROM anon, authenticated;
GRANT SELECT, UPDATE, DELETE ON public.project_leads TO authenticated;
GRANT ALL ON public.project_leads TO service_role;

DROP POLICY IF EXISTS "Anyone can submit a lead" ON public.project_leads;
CREATE POLICY "Block anonymous lead inserts"
ON public.project_leads FOR INSERT
TO anon
WITH CHECK (false);
CREATE POLICY "Block authenticated direct lead inserts"
ON public.project_leads FOR INSERT
TO authenticated
WITH CHECK (false);

CREATE TABLE public.enquiry_documents (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  lead_id UUID NOT NULL REFERENCES public.project_leads(id) ON DELETE CASCADE,
  storage_path TEXT NOT NULL UNIQUE,
  original_name TEXT NOT NULL,
  mime_type TEXT NOT NULL,
  size_bytes BIGINT NOT NULL,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now()
);
GRANT SELECT, DELETE ON public.enquiry_documents TO authenticated;
GRANT ALL ON public.enquiry_documents TO service_role;
ALTER TABLE public.enquiry_documents ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Admins can view enquiry documents"
ON public.enquiry_documents FOR SELECT
TO authenticated
USING (public.is_admin(auth.uid()));
CREATE POLICY "Admins can delete enquiry documents"
ON public.enquiry_documents FOR DELETE
TO authenticated
USING (public.is_admin(auth.uid()));
CREATE POLICY "Block anonymous enquiry document access"
ON public.enquiry_documents FOR ALL
TO anon
USING (false)
WITH CHECK (false);