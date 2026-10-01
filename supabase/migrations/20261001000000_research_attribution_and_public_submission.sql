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

CREATE TABLE IF NOT EXISTS public.research_enquiry_rate_limits (
  ip_hash TEXT NOT NULL,
  window_start TIMESTAMPTZ NOT NULL,
  request_count INTEGER NOT NULL DEFAULT 0,
  PRIMARY KEY (ip_hash, window_start)
);

CREATE INDEX IF NOT EXISTS research_enquiry_rate_limits_window_idx
  ON public.research_enquiry_rate_limits (window_start);

ALTER TABLE public.research_enquiry_rate_limits ENABLE ROW LEVEL SECURITY;
REVOKE ALL ON TABLE public.research_enquiry_rate_limits FROM PUBLIC, anon, authenticated;
GRANT ALL ON TABLE public.research_enquiry_rate_limits TO service_role;

CREATE OR REPLACE FUNCTION public.consume_research_enquiry_rate_limit(_ip_hash TEXT)
RETURNS BOOLEAN
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
AS $$
DECLARE
  current_count INTEGER;
  current_window TIMESTAMPTZ := date_trunc('hour', now());
BEGIN
  IF _ip_hash !~ '^[0-9a-f]{64}$' THEN
    RETURN FALSE;
  END IF;

  INSERT INTO public.research_enquiry_rate_limits (ip_hash, window_start, request_count)
  VALUES (_ip_hash, current_window, 1)
  ON CONFLICT (ip_hash, window_start)
  DO UPDATE SET request_count = public.research_enquiry_rate_limits.request_count + 1
  RETURNING request_count INTO current_count;

  DELETE FROM public.research_enquiry_rate_limits
  WHERE window_start < now() - INTERVAL '48 hours';

  RETURN current_count <= 5;
END;
$$;

REVOKE ALL ON FUNCTION public.consume_research_enquiry_rate_limit(TEXT) FROM PUBLIC, anon, authenticated;
GRANT EXECUTE ON FUNCTION public.consume_research_enquiry_rate_limit(TEXT) TO service_role;