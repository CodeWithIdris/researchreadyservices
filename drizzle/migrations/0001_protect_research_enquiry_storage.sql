CREATE POLICY "Admins can view research enquiry files"
ON storage.objects FOR SELECT
TO authenticated
USING (bucket_id = 'research-enquiries' AND public.is_admin(auth.uid()));

CREATE POLICY "Admins can delete research enquiry files"
ON storage.objects FOR DELETE
TO authenticated
USING (bucket_id = 'research-enquiries' AND public.is_admin(auth.uid()));

CREATE POLICY "Block anonymous research enquiry files"
ON storage.objects FOR ALL
TO anon
USING (false)
WITH CHECK (false);