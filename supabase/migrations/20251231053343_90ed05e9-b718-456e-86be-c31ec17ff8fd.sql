-- Create newsletter_subscribers table
CREATE TABLE public.newsletter_subscribers (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  email TEXT NOT NULL UNIQUE,
  subscribed_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  is_active BOOLEAN NOT NULL DEFAULT true
);

-- Create support_tickets table for escalated chat requests
CREATE TABLE public.support_tickets (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  session_id UUID REFERENCES public.chat_sessions(id) ON DELETE SET NULL,
  visitor_name TEXT,
  visitor_email TEXT,
  subject TEXT NOT NULL,
  description TEXT,
  status TEXT NOT NULL DEFAULT 'open',
  priority TEXT NOT NULL DEFAULT 'normal',
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Create admin_users table for admin authentication
CREATE TABLE public.admin_users (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE NOT NULL UNIQUE,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Enable RLS on all tables
ALTER TABLE public.newsletter_subscribers ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.support_tickets ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.admin_users ENABLE ROW LEVEL SECURITY;

-- Newsletter subscribers: service role only (managed via edge function)
CREATE POLICY "Service role access only for newsletter" 
ON public.newsletter_subscribers
AS RESTRICTIVE
FOR ALL 
TO authenticated, anon
USING (false)
WITH CHECK (false);

-- Support tickets: service role only (managed via edge function)
CREATE POLICY "Service role access only for tickets" 
ON public.support_tickets
AS RESTRICTIVE
FOR ALL 
TO authenticated, anon
USING (false)
WITH CHECK (false);

-- Admin users: only admins can view admin list
CREATE POLICY "Admins can view admin users" 
ON public.admin_users
FOR SELECT 
TO authenticated
USING (auth.uid() IN (SELECT user_id FROM public.admin_users));

-- Create trigger for support_tickets updated_at
CREATE TRIGGER update_support_tickets_updated_at
BEFORE UPDATE ON public.support_tickets
FOR EACH ROW
EXECUTE FUNCTION public.update_chat_session_updated_at();