
ALTER TABLE public.project_leads
ADD COLUMN IF NOT EXISTS source TEXT DEFAULT 'organic',
ADD COLUMN IF NOT EXISTS fast_response BOOLEAN DEFAULT false;
