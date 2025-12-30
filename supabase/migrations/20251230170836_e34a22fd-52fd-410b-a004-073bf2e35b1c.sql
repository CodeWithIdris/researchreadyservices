-- Revoke all public access to chat tables
REVOKE ALL ON public.chat_sessions FROM anon, authenticated;
REVOKE ALL ON public.chat_messages FROM anon, authenticated;

-- Drop existing policies that aren't working correctly
DROP POLICY IF EXISTS "Deny public access to chat_sessions" ON public.chat_sessions;
DROP POLICY IF EXISTS "Deny public access to chat_messages" ON public.chat_messages;
DROP POLICY IF EXISTS "Service role full access to chat_sessions" ON public.chat_sessions;
DROP POLICY IF EXISTS "Service role full access to chat_messages" ON public.chat_messages;

-- Grant access only to service_role
GRANT ALL ON public.chat_sessions TO service_role;
GRANT ALL ON public.chat_messages TO service_role;

-- Create simple permissive policy for service role (service_role bypasses RLS anyway, but for clarity)
CREATE POLICY "Service role access only"
ON public.chat_sessions
FOR ALL
TO service_role
USING (true)
WITH CHECK (true);

CREATE POLICY "Service role access only"
ON public.chat_messages
FOR ALL
TO service_role
USING (true)
WITH CHECK (true);