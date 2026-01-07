-- Create appointments table for booking system
CREATE TABLE public.appointments (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  client_name TEXT NOT NULL,
  client_email TEXT NOT NULL,
  client_phone TEXT,
  client_timezone TEXT NOT NULL DEFAULT 'UTC',
  appointment_date DATE NOT NULL,
  appointment_time TIME NOT NULL,
  appointment_type TEXT NOT NULL DEFAULT 'consultation',
  meeting_link TEXT,
  notes TEXT,
  status TEXT NOT NULL DEFAULT 'pending',
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Enable RLS
ALTER TABLE public.appointments ENABLE ROW LEVEL SECURITY;

-- Public can create appointments (booking)
CREATE POLICY "Anyone can create appointments" 
ON public.appointments 
FOR INSERT 
WITH CHECK (true);

-- Only admins can view all appointments
CREATE POLICY "Admins can view appointments" 
ON public.appointments 
FOR SELECT 
USING (auth.uid() IN (SELECT user_id FROM admin_users));

-- Only admins can update appointments
CREATE POLICY "Admins can update appointments" 
ON public.appointments 
FOR UPDATE 
USING (auth.uid() IN (SELECT user_id FROM admin_users));

-- Only admins can delete appointments
CREATE POLICY "Admins can delete appointments" 
ON public.appointments 
FOR DELETE 
USING (auth.uid() IN (SELECT user_id FROM admin_users));

-- Block anonymous SELECT access
CREATE POLICY "Block anonymous viewing appointments" 
ON public.appointments 
FOR SELECT 
TO anon
USING (false);

-- Enable realtime for appointments
ALTER PUBLICATION supabase_realtime ADD TABLE public.appointments;

-- Create trigger for updated_at
CREATE TRIGGER update_appointments_updated_at
BEFORE UPDATE ON public.appointments
FOR EACH ROW
EXECUTE FUNCTION public.update_chat_session_updated_at();