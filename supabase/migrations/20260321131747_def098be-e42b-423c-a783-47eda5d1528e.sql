
-- Pages table
CREATE TABLE public.pages (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  slug TEXT UNIQUE NOT NULL,
  title TEXT NOT NULL,
  meta_description TEXT,
  status TEXT NOT NULL DEFAULT 'draft',
  owner_id UUID,
  created_at TIMESTAMPTZ DEFAULT now(),
  updated_at TIMESTAMPTZ DEFAULT now()
);

-- Page blocks table
CREATE TABLE public.page_blocks (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  page_id UUID REFERENCES public.pages(id) ON DELETE CASCADE NOT NULL,
  type TEXT NOT NULL,
  position INTEGER NOT NULL DEFAULT 0,
  data JSONB NOT NULL DEFAULT '{}',
  is_visible BOOLEAN DEFAULT true,
  created_at TIMESTAMPTZ DEFAULT now(),
  updated_at TIMESTAMPTZ DEFAULT now()
);

-- Index for sorting
CREATE INDEX idx_page_blocks_page_position ON public.page_blocks(page_id, position);

-- Triggers for updated_at (reuse existing function)
CREATE TRIGGER pages_updated_at
  BEFORE UPDATE ON public.pages
  FOR EACH ROW EXECUTE FUNCTION public.update_updated_at_column();

CREATE TRIGGER page_blocks_updated_at
  BEFORE UPDATE ON public.page_blocks
  FOR EACH ROW EXECUTE FUNCTION public.update_updated_at_column();

-- RLS
ALTER TABLE public.pages ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.page_blocks ENABLE ROW LEVEL SECURITY;

-- Admin full access (authenticated users)
CREATE POLICY "Admin full access pages" ON public.pages
  FOR ALL TO authenticated USING (true) WITH CHECK (true);

-- Public read for published pages
CREATE POLICY "Public read published pages" ON public.pages
  FOR SELECT TO anon USING (status = 'published');

-- Admin full access blocks
CREATE POLICY "Admin full access blocks" ON public.page_blocks
  FOR ALL TO authenticated USING (true) WITH CHECK (true);

-- Public read blocks of published pages
CREATE POLICY "Public read published page blocks" ON public.page_blocks
  FOR SELECT TO anon USING (
    EXISTS (
      SELECT 1 FROM public.pages WHERE pages.id = page_blocks.page_id AND pages.status = 'published'
    )
  );

-- Storage bucket for page assets
INSERT INTO storage.buckets (id, name, public) VALUES ('page-assets', 'page-assets', true);

-- Storage policies
CREATE POLICY "Auth users can upload page assets" ON storage.objects
  FOR INSERT TO authenticated WITH CHECK (bucket_id = 'page-assets');

CREATE POLICY "Auth users can update page assets" ON storage.objects
  FOR UPDATE TO authenticated USING (bucket_id = 'page-assets');

CREATE POLICY "Auth users can delete page assets" ON storage.objects
  FOR DELETE TO authenticated USING (bucket_id = 'page-assets');

CREATE POLICY "Public read page assets" ON storage.objects
  FOR SELECT TO anon, authenticated USING (bucket_id = 'page-assets');
