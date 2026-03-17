
-- Storage bucket for photos
INSERT INTO storage.buckets (id, name, public) VALUES ('photos', 'photos', true);

-- Storage policies
CREATE POLICY "Photos are publicly accessible" ON storage.objects FOR SELECT USING (bucket_id = 'photos');
CREATE POLICY "Authenticated users can upload photos" ON storage.objects FOR INSERT WITH CHECK (bucket_id = 'photos' AND auth.role() = 'authenticated');
CREATE POLICY "Authenticated users can update photos" ON storage.objects FOR UPDATE USING (bucket_id = 'photos' AND auth.role() = 'authenticated');
CREATE POLICY "Authenticated users can delete photos" ON storage.objects FOR DELETE USING (bucket_id = 'photos' AND auth.role() = 'authenticated');

-- Site photos table (hero, room, bathroom, kitchen, host + gallery images)
CREATE TABLE public.site_photos (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  category TEXT NOT NULL, -- 'hero', 'room', 'bathroom', 'kitchen', 'host'
  url TEXT NOT NULL,
  sort_order INT NOT NULL DEFAULT 0,
  is_primary BOOLEAN NOT NULL DEFAULT false,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

ALTER TABLE public.site_photos ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Photos are viewable by everyone" ON public.site_photos FOR SELECT USING (true);
CREATE POLICY "Authenticated users can manage photos" ON public.site_photos FOR INSERT WITH CHECK (auth.role() = 'authenticated');
CREATE POLICY "Authenticated users can update photos" ON public.site_photos FOR UPDATE USING (auth.role() = 'authenticated');
CREATE POLICY "Authenticated users can delete photos" ON public.site_photos FOR DELETE USING (auth.role() = 'authenticated');

-- Blocked dates table
CREATE TABLE public.blocked_dates (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  start_date DATE NOT NULL,
  end_date DATE NOT NULL,
  reason TEXT DEFAULT '',
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

ALTER TABLE public.blocked_dates ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Blocked dates are viewable by everyone" ON public.blocked_dates FOR SELECT USING (true);
CREATE POLICY "Authenticated users can manage blocked dates" ON public.blocked_dates FOR INSERT WITH CHECK (auth.role() = 'authenticated');
CREATE POLICY "Authenticated users can update blocked dates" ON public.blocked_dates FOR UPDATE USING (auth.role() = 'authenticated');
CREATE POLICY "Authenticated users can delete blocked dates" ON public.blocked_dates FOR DELETE USING (auth.role() = 'authenticated');

-- Pricing config table (single row, key-value style)
CREATE TABLE public.pricing_config (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  default_price_per_night NUMERIC NOT NULL DEFAULT 65,
  cleaning_fee NUMERIC NOT NULL DEFAULT 35,
  minimum_stay INT NOT NULL DEFAULT 2,
  maximum_stay INT NOT NULL DEFAULT 28,
  weekly_discount NUMERIC NOT NULL DEFAULT 10,
  monthly_discount NUMERIC NOT NULL DEFAULT 20,
  updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

ALTER TABLE public.pricing_config ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Pricing is viewable by everyone" ON public.pricing_config FOR SELECT USING (true);
CREATE POLICY "Authenticated users can update pricing" ON public.pricing_config FOR UPDATE USING (auth.role() = 'authenticated');

-- Seasonal pricing table
CREATE TABLE public.seasonal_pricing (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  label TEXT NOT NULL,
  label_en TEXT NOT NULL DEFAULT '',
  start_date DATE NOT NULL,
  end_date DATE NOT NULL,
  price_per_night NUMERIC NOT NULL,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

ALTER TABLE public.seasonal_pricing ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Seasonal pricing viewable by everyone" ON public.seasonal_pricing FOR SELECT USING (true);
CREATE POLICY "Authenticated users can manage seasonal pricing" ON public.seasonal_pricing FOR INSERT WITH CHECK (auth.role() = 'authenticated');
CREATE POLICY "Authenticated users can update seasonal pricing" ON public.seasonal_pricing FOR UPDATE USING (auth.role() = 'authenticated');
CREATE POLICY "Authenticated users can delete seasonal pricing" ON public.seasonal_pricing FOR DELETE USING (auth.role() = 'authenticated');

-- Custom pricing (e.g., festivals)
CREATE TABLE public.custom_pricing (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  label TEXT NOT NULL,
  start_date DATE NOT NULL,
  end_date DATE NOT NULL,
  price_per_night NUMERIC NOT NULL,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

ALTER TABLE public.custom_pricing ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Custom pricing viewable by everyone" ON public.custom_pricing FOR SELECT USING (true);
CREATE POLICY "Authenticated users can manage custom pricing" ON public.custom_pricing FOR INSERT WITH CHECK (auth.role() = 'authenticated');
CREATE POLICY "Authenticated users can update custom pricing" ON public.custom_pricing FOR UPDATE USING (auth.role() = 'authenticated');
CREATE POLICY "Authenticated users can delete custom pricing" ON public.custom_pricing FOR DELETE USING (auth.role() = 'authenticated');

-- Insert default pricing config
INSERT INTO public.pricing_config (default_price_per_night, cleaning_fee, minimum_stay, maximum_stay, weekly_discount, monthly_discount)
VALUES (65, 35, 2, 28, 10, 20);

-- Insert default seasonal pricing
INSERT INTO public.seasonal_pricing (label, label_en, start_date, end_date, price_per_night) VALUES
  ('Laagseizoen', 'Low season', '2025-11-01', '2026-02-28', 55),
  ('Tussenseizoen', 'Mid season', '2026-03-01', '2026-05-31', 65),
  ('Hoogseizoen', 'High season', '2026-06-01', '2026-09-30', 85),
  ('Tussenseizoen', 'Mid season', '2026-10-01', '2026-10-31', 65);

-- Insert default custom pricing
INSERT INTO public.custom_pricing (label, start_date, end_date, price_per_night) VALUES
  ('Fallas festival', '2026-03-15', '2026-03-22', 95);

-- Insert default blocked dates
INSERT INTO public.blocked_dates (start_date, end_date, reason) VALUES
  ('2026-01-10', '2026-01-15', 'Privé');

-- Update timestamp trigger
CREATE OR REPLACE FUNCTION public.update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = now();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql SET search_path = public;

CREATE TRIGGER update_pricing_config_updated_at
  BEFORE UPDATE ON public.pricing_config
  FOR EACH ROW EXECUTE FUNCTION public.update_updated_at_column();
