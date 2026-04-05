
CREATE TABLE public.project_leads (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  name TEXT NOT NULL,
  email TEXT NOT NULL,
  country TEXT NOT NULL,
  budget_range TEXT NOT NULL,
  project_type TEXT NOT NULL,
  deadline TEXT NOT NULL,
  description TEXT NOT NULL,
  priority TEXT NOT NULL DEFAULT 'medium',
  status TEXT NOT NULL DEFAULT 'new',
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

ALTER TABLE public.project_leads ENABLE ROW LEVEL SECURITY;

-- Anyone can submit a lead (public form)
CREATE POLICY "Anyone can submit a lead"
ON public.project_leads FOR INSERT
TO anon, authenticated
WITH CHECK (true);

-- Only admins can view leads
CREATE POLICY "Admins can view leads"
ON public.project_leads FOR SELECT
TO authenticated
USING (public.is_admin(auth.uid()));

-- Only admins can update leads
CREATE POLICY "Admins can update leads"
ON public.project_leads FOR UPDATE
TO authenticated
USING (public.is_admin(auth.uid()));

-- Only admins can delete leads
CREATE POLICY "Admins can delete leads"
ON public.project_leads FOR DELETE
TO authenticated
USING (public.is_admin(auth.uid()));

-- Block anonymous select/update/delete
CREATE POLICY "Block anon read on leads"
ON public.project_leads FOR SELECT
TO anon
USING (false);

CREATE POLICY "Block anon update on leads"
ON public.project_leads FOR UPDATE
TO anon
USING (false);

CREATE POLICY "Block anon delete on leads"
ON public.project_leads FOR DELETE
TO anon
USING (false);
