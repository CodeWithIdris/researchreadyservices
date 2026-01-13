-- Drop existing SELECT policies on appointments table
DROP POLICY IF EXISTS "Admins can view appointments" ON public.appointments;
DROP POLICY IF EXISTS "Block anonymous viewing appointments" ON public.appointments;

-- Create a single, properly secured SELECT policy using the is_admin function
CREATE POLICY "Only admins can view appointments"
ON public.appointments
FOR SELECT
TO authenticated
USING (public.is_admin(auth.uid()));