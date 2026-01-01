-- Add RLS policy for authenticated users (Melody) to manage inquiries
CREATE POLICY "Authenticated users can view all inquiries" 
ON public.order_inquiries 
FOR SELECT 
TO authenticated
USING (true);

CREATE POLICY "Authenticated users can update inquiries" 
ON public.order_inquiries 
FOR UPDATE 
TO authenticated
USING (true);

CREATE POLICY "Authenticated users can delete inquiries" 
ON public.order_inquiries 
FOR DELETE 
TO authenticated
USING (true);