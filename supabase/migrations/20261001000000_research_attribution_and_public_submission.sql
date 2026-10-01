ALTER TABLE public.project_leads
  ADD COLUMN IF NOT EXISTS first_utm_source TEXT,
  ADD COLUMN IF NOT EXISTS first_utm_medium TEXT,
  ADD COLUMN IF NOT EXISTS first_utm_campaign TEXT,
  ADD COLUMN IF NOT EXISTS first_utm_content TEXT,
  ADD COLUMN IF NOT EXISTS first_utm_term TEXT,
  ADD COLUMN IF NOT EXISTS first_referrer TEXT,
  ADD COLUMN IF NOT EXISTS first_landing_page TEXT;

DROP POLICY IF EXISTS "Anyone can submit a lead" ON public.project_leads;
REVOKE INSERT ON TABLE public.project_leads FROM anon, authenticated;
GRANT SELECT, UPDATE, DELETE ON TABLE public.project_leads TO authenticated;
GRANT ALL ON TABLE public.project_leads TO service_role;