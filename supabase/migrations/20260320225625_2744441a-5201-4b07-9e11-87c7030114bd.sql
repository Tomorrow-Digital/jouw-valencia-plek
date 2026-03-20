
CREATE TABLE public.invite_tokens (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  token UUID NOT NULL DEFAULT gen_random_uuid() UNIQUE,
  created_by UUID REFERENCES auth.users(id) ON DELETE SET NULL,
  used_by UUID REFERENCES auth.users(id) ON DELETE SET NULL,
  used_at TIMESTAMPTZ,
  expires_at TIMESTAMPTZ NOT NULL DEFAULT (now() + interval '48 hours'),
  created_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

ALTER TABLE public.invite_tokens ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Authenticated users can view invite tokens"
  ON public.invite_tokens FOR SELECT TO authenticated
  USING (true);

CREATE POLICY "Authenticated users can insert invite tokens"
  ON public.invite_tokens FOR INSERT TO authenticated
  WITH CHECK (auth.uid() = created_by);

CREATE POLICY "Authenticated users can update invite tokens"
  ON public.invite_tokens FOR UPDATE TO authenticated
  USING (true);

CREATE POLICY "Authenticated users can delete invite tokens"
  ON public.invite_tokens FOR DELETE TO authenticated
  USING (true);
