-- Remove the overly permissive INSERT policy
DROP POLICY IF EXISTS "Anyone can create appointments" ON public.appointments;

-- Create a new policy that only allows service role (edge function) to insert
-- This is effectively handled by using service_role key in edge function
-- We add a blocking policy for anon role to prevent direct client-side inserts
CREATE POLICY "Block anonymous appointment inserts"
ON public.appointments
FOR INSERT
TO anon
WITH CHECK (false);

-- Note: authenticated users also shouldn't insert directly, only through the edge function
CREATE POLICY "Block authenticated direct appointment inserts"
ON public.appointments
FOR INSERT
TO authenticated
WITH CHECK (false);