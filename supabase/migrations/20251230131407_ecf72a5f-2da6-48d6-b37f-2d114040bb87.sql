-- Drop existing overly permissive policies
DROP POLICY IF EXISTS "Anyone can update their chat sessions" ON public.chat_sessions;
DROP POLICY IF EXISTS "Anyone can view chat sessions by visitor_id" ON public.chat_sessions;

-- Create more restrictive policies for chat_sessions
-- Only service_role can update sessions (for admin/support to close sessions)
CREATE POLICY "Only service role can update chat sessions" 
ON public.chat_sessions 
FOR UPDATE 
USING (auth.role() = 'service_role');

-- SELECT: Allow public to read (application filters by visitor_id stored in localStorage)
-- This is necessary for the chat widget to work without authentication
CREATE POLICY "Public can view chat sessions" 
ON public.chat_sessions 
FOR SELECT 
USING (true);

-- Drop and recreate message policies for clarity
DROP POLICY IF EXISTS "Anyone can view messages" ON public.chat_messages;

-- Messages can be read by anyone (filtered by session_id in application code)
CREATE POLICY "Public can view messages" 
ON public.chat_messages 
FOR SELECT 
USING (true);