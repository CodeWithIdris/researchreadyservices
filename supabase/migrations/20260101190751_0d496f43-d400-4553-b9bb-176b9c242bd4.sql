-- Enable realtime for support_tickets and chat_sessions (chat_messages already enabled)
ALTER TABLE public.support_tickets REPLICA IDENTITY FULL;
ALTER TABLE public.chat_sessions REPLICA IDENTITY FULL;

-- Add only the tables not already in publication
ALTER PUBLICATION supabase_realtime ADD TABLE public.support_tickets;
ALTER PUBLICATION supabase_realtime ADD TABLE public.chat_sessions;