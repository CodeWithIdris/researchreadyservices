-- Add INSERT policy for chat_sessions table
-- Only admins can insert directly; visitors create sessions via edge function with service role
CREATE POLICY "Admins can insert chat sessions"
ON public.chat_sessions
FOR INSERT
TO authenticated
WITH CHECK (
  auth.uid() IN (SELECT user_id FROM public.admin_users)
);