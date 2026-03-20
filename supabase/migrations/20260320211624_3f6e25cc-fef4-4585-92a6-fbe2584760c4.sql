
CREATE TABLE public.deletion_requests (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  name TEXT,
  email TEXT,
  phone TEXT,
  meta_user_id TEXT,
  request_type TEXT NOT NULL DEFAULT 'delete_all',
  details TEXT,
  source TEXT NOT NULL DEFAULT 'website',
  status TEXT NOT NULL DEFAULT 'pending',
  confirmation_code TEXT DEFAULT encode(gen_random_bytes(12), 'hex'),
  verification_token UUID DEFAULT gen_random_uuid(),
  verified_at TIMESTAMPTZ,
  completed_at TIMESTAMPTZ,
  language TEXT DEFAULT 'nl',
  created_at TIMESTAMPTZ DEFAULT now(),
  updated_at TIMESTAMPTZ DEFAULT now()
);

CREATE INDEX idx_deletion_requests_confirmation ON public.deletion_requests(id, confirmation_code);
CREATE INDEX idx_deletion_requests_meta_user ON public.deletion_requests(meta_user_id) WHERE meta_user_id IS NOT NULL;

ALTER TABLE public.deletion_requests ENABLE ROW LEVEL SECURITY;
