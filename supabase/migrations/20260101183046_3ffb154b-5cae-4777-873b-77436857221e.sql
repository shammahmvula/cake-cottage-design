-- Create order inquiries table
CREATE TABLE public.order_inquiries (
    id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
    name TEXT NOT NULL,
    contact TEXT NOT NULL,
    cake_type TEXT NOT NULL,
    event_type TEXT,
    delivery_option TEXT NOT NULL DEFAULT 'pickup',
    delivery_location TEXT,
    date_needed DATE NOT NULL,
    additional_notes TEXT,
    status TEXT NOT NULL DEFAULT 'new',
    created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
    updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Enable Row Level Security
ALTER TABLE public.order_inquiries ENABLE ROW LEVEL SECURITY;

-- Allow public inserts (for form submissions without auth)
CREATE POLICY "Anyone can submit order inquiries" 
ON public.order_inquiries 
FOR INSERT 
WITH CHECK (true);

-- Create function to update timestamps
CREATE OR REPLACE FUNCTION public.update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
    NEW.updated_at = now();
    RETURN NEW;
END;
$$ LANGUAGE plpgsql SET search_path = public;

-- Create trigger for automatic timestamp updates
CREATE TRIGGER update_order_inquiries_updated_at
BEFORE UPDATE ON public.order_inquiries
FOR EACH ROW
EXECUTE FUNCTION public.update_updated_at_column();