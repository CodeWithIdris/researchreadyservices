-- Drop the existing ineffective policy
DROP POLICY IF EXISTS "Service role access only for tickets" ON public.support_tickets;

-- Create policy that only allows admins to SELECT
CREATE POLICY "Only admins can view tickets"
ON public.support_tickets
FOR SELECT
TO authenticated
USING (
  auth.uid() IN (SELECT user_id FROM public.admin_users)
);

-- Create policy that only allows admins to INSERT
CREATE POLICY "Only admins can insert tickets"
ON public.support_tickets
FOR INSERT
TO authenticated
WITH CHECK (
  auth.uid() IN (SELECT user_id FROM public.admin_users)
);

-- Create policy that only allows admins to UPDATE
CREATE POLICY "Only admins can update tickets"
ON public.support_tickets
FOR UPDATE
TO authenticated
USING (
  auth.uid() IN (SELECT user_id FROM public.admin_users)
);

-- Create policy that only allows admins to DELETE
CREATE POLICY "Only admins can delete tickets"
ON public.support_tickets
FOR DELETE
TO authenticated
USING (
  auth.uid() IN (SELECT user_id FROM public.admin_users)
);