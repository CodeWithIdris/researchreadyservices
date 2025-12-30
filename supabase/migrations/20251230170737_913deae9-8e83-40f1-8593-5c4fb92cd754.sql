-- Drop existing policies
DROP POLICY IF EXISTS "Service role only access to chat_sessions" ON public.chat_sessions;
DROP POLICY IF EXISTS "Service role only access to chat_messages" ON public.chat_messages;

-- Create a default-deny policy for anon/authenticated on chat_sessions
-- This explicitly blocks all access for anon and authenticated roles
CREATE POLICY "Deny public access to chat_sessions"
ON public.chat_sessions
AS RESTRICTIVE
FOR ALL
TO anon, authenticated
USING (false)
WITH CHECK (false);

-- Allow service role full access to chat_sessions
CREATE POLICY "Service role full access to chat_sessions"
ON public.chat_sessions
AS PERMISSIVE
FOR ALL
TO service_role
USING (true)
WITH CHECK (true);

-- Create a default-deny policy for anon/authenticated on chat_messages
CREATE POLICY "Deny public access to chat_messages"
ON public.chat_messages
AS RESTRICTIVE
FOR ALL
TO anon, authenticated
USING (false)
WITH CHECK (false);

-- Allow service role full access to chat_messages
CREATE POLICY "Service role full access to chat_messages"
ON public.chat_messages
AS PERMISSIVE
FOR ALL
TO service_role
USING (true)
WITH CHECK (true);