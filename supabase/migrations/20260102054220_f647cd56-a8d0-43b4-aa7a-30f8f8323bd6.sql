-- Drop the existing ineffective policy
DROP POLICY IF EXISTS "Service role access only for newsletter" ON public.newsletter_subscribers;

-- Create policy that only allows admins to SELECT
CREATE POLICY "Only admins can view subscribers"
ON public.newsletter_subscribers
FOR SELECT
TO authenticated
USING (
  auth.uid() IN (SELECT user_id FROM public.admin_users)
);

-- Create policy that only allows admins to INSERT
CREATE POLICY "Only admins can insert subscribers"
ON public.newsletter_subscribers
FOR INSERT
TO authenticated
WITH CHECK (
  auth.uid() IN (SELECT user_id FROM public.admin_users)
);

-- Create policy that only allows admins to UPDATE
CREATE POLICY "Only admins can update subscribers"
ON public.newsletter_subscribers
FOR UPDATE
TO authenticated
USING (
  auth.uid() IN (SELECT user_id FROM public.admin_users)
);

-- Create policy that only allows admins to DELETE
CREATE POLICY "Only admins can delete subscribers"
ON public.newsletter_subscribers
FOR DELETE
TO authenticated
USING (
  auth.uid() IN (SELECT user_id FROM public.admin_users)
);