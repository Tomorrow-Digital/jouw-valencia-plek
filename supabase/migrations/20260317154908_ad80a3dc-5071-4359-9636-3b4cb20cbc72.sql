
-- Create bookings table
CREATE TABLE public.bookings (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  first_name TEXT NOT NULL,
  last_name TEXT NOT NULL,
  email TEXT NOT NULL,
  phone TEXT,
  guests INTEGER NOT NULL DEFAULT 1,
  check_in DATE NOT NULL,
  check_out DATE NOT NULL,
  arrival_time TEXT,
  message TEXT,
  total_price NUMERIC,
  status TEXT NOT NULL DEFAULT 'pending',
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Enable RLS
ALTER TABLE public.bookings ENABLE ROW LEVEL SECURITY;

-- Anyone can insert (public booking form)
CREATE POLICY "Anyone can create a booking"
ON public.bookings
FOR INSERT
WITH CHECK (true);

-- Only authenticated users can view bookings (admin)
CREATE POLICY "Authenticated users can view bookings"
ON public.bookings
FOR SELECT
USING (auth.role() = 'authenticated');

-- Only authenticated users can update bookings (admin status changes)
CREATE POLICY "Authenticated users can update bookings"
ON public.bookings
FOR UPDATE
USING (auth.role() = 'authenticated');

-- Only authenticated users can delete bookings
CREATE POLICY "Authenticated users can delete bookings"
ON public.bookings
FOR DELETE
USING (auth.role() = 'authenticated');
