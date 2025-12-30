-- Drop existing policies that may be allowing public access
DROP POLICY IF EXISTS "Service role full access to chat_sessions" ON public.chat_sessions;
DROP POLICY IF EXISTS "Only service role can update chat sessions" ON public.chat_sessions;
DROP POLICY IF EXISTS "Allow public to read chat sessions" ON public.chat_sessions;
DROP POLICY IF EXISTS "Allow visitors to read their own sessions" ON public.chat_sessions;
DROP POLICY IF EXISTS "Service role full access to chat_messages" ON public.chat_messages;
DROP POLICY IF EXISTS "Allow public to read chat messages" ON public.chat_messages;

-- Create restrictive service-role-only policies for chat_sessions
-- All chat operations go through the edge function which uses service role
CREATE POLICY "Service role only access to chat_sessions"
ON public.chat_sessions
FOR ALL
TO service_role
USING (true)
WITH CHECK (true);

-- Create restrictive service-role-only policies for chat_messages
CREATE POLICY "Service role only access to chat_messages"
ON public.chat_messages
FOR ALL
TO service_role
USING (true)
WITH CHECK (true);