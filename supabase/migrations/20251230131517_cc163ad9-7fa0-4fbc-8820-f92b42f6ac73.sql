-- Drop the unused visitor_email column (not collected in the form)
ALTER TABLE public.chat_sessions DROP COLUMN IF EXISTS visitor_email;

-- Drop existing overly permissive SELECT policies
DROP POLICY IF EXISTS "Public can view chat sessions" ON public.chat_sessions;
DROP POLICY IF EXISTS "Anyone can create chat sessions" ON public.chat_sessions;
DROP POLICY IF EXISTS "Public can view messages" ON public.chat_messages;
DROP POLICY IF EXISTS "Anyone can create messages" ON public.chat_messages;

-- Create restrictive policies - only service_role can access directly
-- All public access will go through edge functions
CREATE POLICY "Service role full access to chat_sessions" 
ON public.chat_sessions 
FOR ALL 
USING (auth.role() = 'service_role');

CREATE POLICY "Service role full access to chat_messages" 
ON public.chat_messages 
FOR ALL 
USING (auth.role() = 'service_role');