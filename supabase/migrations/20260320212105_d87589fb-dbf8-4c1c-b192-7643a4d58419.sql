
-- Allow authenticated users (admin) to view deletion requests
CREATE POLICY "Authenticated users can view deletion requests"
  ON public.deletion_requests FOR SELECT
  TO authenticated
  USING (true);

-- Allow authenticated users (admin) to update deletion requests
CREATE POLICY "Authenticated users can update deletion requests"
  ON public.deletion_requests FOR UPDATE
  TO authenticated
  USING (true);

-- Allow authenticated users (admin) to delete deletion requests
CREATE POLICY "Authenticated users can delete deletion requests"
  ON public.deletion_requests FOR DELETE
  TO authenticated
  USING (true);
