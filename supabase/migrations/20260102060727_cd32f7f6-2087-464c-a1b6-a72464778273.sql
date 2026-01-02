-- Drop the existing restrictive policy that blocks all access
DROP POLICY IF EXISTS "Service role access only" ON public.chat_sessions;

-- Create policy that allows admins to SELECT chat sessions
CREATE POLICY "Admins can view chat sessions"
ON public.chat_sessions
FOR SELECT
TO authenticated
USING (
  auth.uid() IN (SELECT user_id FROM public.admin_users)
);

-- Create policy that allows admins to UPDATE chat sessions (e.g., change status)
CREATE POLICY "Admins can update chat sessions"
ON public.chat_sessions
FOR UPDATE
TO authenticated
USING (
  auth.uid() IN (SELECT user_id FROM public.admin_users)
);

-- Also fix chat_messages table for admin access
DROP POLICY IF EXISTS "Service role access only" ON public.chat_messages;

-- Create policy that allows admins to SELECT chat messages
CREATE POLICY "Admins can view chat messages"
ON public.chat_messages
FOR SELECT
TO authenticated
USING (
  auth.uid() IN (SELECT user_id FROM public.admin_users)
);