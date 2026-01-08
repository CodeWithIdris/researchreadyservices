-- Create profiles table for clients
CREATE TABLE public.profiles (
  id UUID NOT NULL REFERENCES auth.users ON DELETE CASCADE PRIMARY KEY,
  full_name TEXT,
  phone TEXT,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Enable RLS
ALTER TABLE public.profiles ENABLE ROW LEVEL SECURITY;

-- Users can view their own profile
CREATE POLICY "Users can view own profile" 
ON public.profiles FOR SELECT 
USING (auth.uid() = id);

-- Users can update their own profile
CREATE POLICY "Users can update own profile" 
ON public.profiles FOR UPDATE 
USING (auth.uid() = id);

-- Users can insert their own profile
CREATE POLICY "Users can insert own profile" 
ON public.profiles FOR INSERT 
WITH CHECK (auth.uid() = id);

-- Trigger to create profile on signup
CREATE OR REPLACE FUNCTION public.handle_new_user()
RETURNS trigger
LANGUAGE plpgsql
SECURITY DEFINER SET search_path = public
AS $$
BEGIN
  INSERT INTO public.profiles (id, full_name)
  VALUES (new.id, new.raw_user_meta_data ->> 'full_name');
  RETURN new;
END;
$$;

CREATE TRIGGER on_auth_user_created
  AFTER INSERT ON auth.users
  FOR EACH ROW EXECUTE PROCEDURE public.handle_new_user();

-- Create projects table for tracking client work
CREATE TABLE public.client_projects (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  client_id UUID NOT NULL REFERENCES auth.users ON DELETE CASCADE,
  title TEXT NOT NULL,
  description TEXT,
  project_type TEXT NOT NULL DEFAULT 'research',
  status TEXT NOT NULL DEFAULT 'pending',
  progress INTEGER NOT NULL DEFAULT 0 CHECK (progress >= 0 AND progress <= 100),
  deadline DATE,
  amount DECIMAL(10,2),
  amount_paid DECIMAL(10,2) DEFAULT 0,
  payment_status TEXT NOT NULL DEFAULT 'pending',
  assigned_expert TEXT,
  notes TEXT,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Enable RLS
ALTER TABLE public.client_projects ENABLE ROW LEVEL SECURITY;

-- Clients can view their own projects
CREATE POLICY "Clients can view own projects" 
ON public.client_projects FOR SELECT 
USING (auth.uid() = client_id);

-- Admins can view all projects
CREATE POLICY "Admins can view all projects" 
ON public.client_projects FOR SELECT 
USING (auth.uid() IN (SELECT user_id FROM admin_users));

-- Admins can insert projects
CREATE POLICY "Admins can insert projects" 
ON public.client_projects FOR INSERT 
WITH CHECK (auth.uid() IN (SELECT user_id FROM admin_users));

-- Admins can update projects
CREATE POLICY "Admins can update projects" 
ON public.client_projects FOR UPDATE 
USING (auth.uid() IN (SELECT user_id FROM admin_users));

-- Admins can delete projects
CREATE POLICY "Admins can delete projects" 
ON public.client_projects FOR DELETE 
USING (auth.uid() IN (SELECT user_id FROM admin_users));

-- Create project updates/milestones table
CREATE TABLE public.project_updates (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  project_id UUID NOT NULL REFERENCES public.client_projects ON DELETE CASCADE,
  title TEXT NOT NULL,
  description TEXT,
  update_type TEXT NOT NULL DEFAULT 'progress',
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Enable RLS
ALTER TABLE public.project_updates ENABLE ROW LEVEL SECURITY;

-- Clients can view updates for their projects
CREATE POLICY "Clients can view own project updates" 
ON public.project_updates FOR SELECT 
USING (
  project_id IN (
    SELECT id FROM public.client_projects WHERE client_id = auth.uid()
  )
);

-- Admins can manage all updates
CREATE POLICY "Admins can manage updates" 
ON public.project_updates FOR ALL 
USING (auth.uid() IN (SELECT user_id FROM admin_users));

-- Enable realtime for projects
ALTER PUBLICATION supabase_realtime ADD TABLE public.client_projects;
ALTER PUBLICATION supabase_realtime ADD TABLE public.project_updates;

-- Update trigger for updated_at
CREATE TRIGGER update_profiles_updated_at
BEFORE UPDATE ON public.profiles
FOR EACH ROW
EXECUTE FUNCTION public.update_chat_session_updated_at();

CREATE TRIGGER update_client_projects_updated_at
BEFORE UPDATE ON public.client_projects
FOR EACH ROW
EXECUTE FUNCTION public.update_chat_session_updated_at();