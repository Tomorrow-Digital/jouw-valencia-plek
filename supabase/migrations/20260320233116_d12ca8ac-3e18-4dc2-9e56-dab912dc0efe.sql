
-- Indexes for deletion_requests
CREATE INDEX IF NOT EXISTS idx_deletion_requests_id_code ON public.deletion_requests (id, confirmation_code);
CREATE INDEX IF NOT EXISTS idx_deletion_requests_meta_user_id ON public.deletion_requests (meta_user_id) WHERE meta_user_id IS NOT NULL;

-- RPC function for public status check
CREATE OR REPLACE FUNCTION public.check_deletion_status(request_id UUID, request_code TEXT)
RETURNS TABLE (
  status TEXT,
  confirmation_code TEXT,
  created_at TIMESTAMPTZ,
  completed_at TIMESTAMPTZ
)
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
AS $$
BEGIN
  RETURN QUERY
  SELECT
    dr.status,
    dr.confirmation_code,
    dr.created_at,
    dr.completed_at
  FROM deletion_requests dr
  WHERE dr.id = request_id
    AND dr.confirmation_code = request_code
  LIMIT 1;
END;
$$;
