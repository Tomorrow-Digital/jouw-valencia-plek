CREATE TABLE public.contact_messages (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  name text NOT NULL,
  email text NOT NULL,
  message text NOT NULL,
  created_at timestamp with time zone NOT NULL DEFAULT now()
);

ALTER TABLE public.contact_messages ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Anyone can send a contact message" ON public.contact_messages
  FOR INSERT TO public WITH CHECK (true);

CREATE POLICY "Authenticated users can view contact messages" ON public.contact_messages
  FOR SELECT TO public USING (auth.role() = 'authenticated');

CREATE POLICY "Authenticated users can delete contact messages" ON public.contact_messages
  FOR DELETE TO public USING (auth.role() = 'authenticated');