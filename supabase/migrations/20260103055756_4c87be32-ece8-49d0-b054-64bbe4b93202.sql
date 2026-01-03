-- Add a restrictive policy that blocks anonymous/unauthenticated access to support_tickets
-- This ensures only authenticated admin users can access the table
CREATE POLICY "Block anonymous access to tickets"
ON public.support_tickets
AS RESTRICTIVE
FOR ALL
TO anon
USING (false);