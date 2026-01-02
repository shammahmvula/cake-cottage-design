-- Add CHECK constraints for input validation on order_inquiries table
ALTER TABLE order_inquiries 
  ADD CONSTRAINT name_length CHECK (char_length(name) >= 2 AND char_length(name) <= 100),
  ADD CONSTRAINT contact_length CHECK (char_length(contact) >= 10 AND char_length(contact) <= 50),
  ADD CONSTRAINT cake_type_length CHECK (char_length(cake_type) <= 100),
  ADD CONSTRAINT event_type_length CHECK (char_length(event_type) <= 100),
  ADD CONSTRAINT delivery_location_length CHECK (char_length(delivery_location) <= 200),
  ADD CONSTRAINT notes_length CHECK (char_length(additional_notes) <= 5000);

-- Create a rate limiting function using IP tracking
CREATE TABLE IF NOT EXISTS public.submission_rate_limits (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  ip_hash text NOT NULL,
  submitted_at timestamp with time zone NOT NULL DEFAULT now(),
  created_at timestamp with time zone NOT NULL DEFAULT now()
);

-- Enable RLS on rate limits table
ALTER TABLE public.submission_rate_limits ENABLE ROW LEVEL SECURITY;

-- Allow inserts from anyone (edge function will use service role)
CREATE POLICY "Service role can manage rate limits"
  ON public.submission_rate_limits
  FOR ALL
  USING (true)
  WITH CHECK (true);

-- Create index for faster lookups
CREATE INDEX idx_rate_limits_ip_hash ON public.submission_rate_limits(ip_hash);
CREATE INDEX idx_rate_limits_submitted_at ON public.submission_rate_limits(submitted_at);

-- Create a cleanup function to remove old rate limit entries (older than 1 hour)
CREATE OR REPLACE FUNCTION public.cleanup_old_rate_limits()
RETURNS void
LANGUAGE sql
SECURITY DEFINER
SET search_path = public
AS $$
  DELETE FROM public.submission_rate_limits 
  WHERE submitted_at < now() - interval '1 hour';
$$;