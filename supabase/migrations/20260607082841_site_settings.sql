-- Site-wide settings (single row). Currently stores which website languages are active.
CREATE TABLE public.site_settings (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  enabled_languages TEXT[] NOT NULL DEFAULT ARRAY['nl','en','es'],
  updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

ALTER TABLE public.site_settings ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Site settings viewable by everyone" ON public.site_settings
  FOR SELECT USING (true);

CREATE POLICY "Authenticated users can update site settings" ON public.site_settings
  FOR UPDATE USING (auth.role() = 'authenticated');

-- Seed exactly one row
INSERT INTO public.site_settings DEFAULT VALUES;

-- Keep updated_at fresh on UPDATE (reuses the function created in the initial pricing migration)
CREATE TRIGGER update_site_settings_updated_at
  BEFORE UPDATE ON public.site_settings
  FOR EACH ROW EXECUTE FUNCTION public.update_updated_at_column();
