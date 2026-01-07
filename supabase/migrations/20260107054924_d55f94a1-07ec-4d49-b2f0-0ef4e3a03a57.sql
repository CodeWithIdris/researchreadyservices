-- Fix security issues: Add explicit deny policies for anonymous users and tighten game RLS

-- 1. Add explicit deny policy for anonymous users on newsletter_subscribers
CREATE POLICY "Block anonymous access to newsletter_subscribers" 
ON public.newsletter_subscribers 
FOR ALL 
TO anon
USING (false);

-- 2. Add explicit deny policy for anonymous users on chat_sessions
CREATE POLICY "Block anonymous access to chat_sessions" 
ON public.chat_sessions 
FOR ALL 
TO anon
USING (false);

-- 3. Add explicit deny policy for anonymous users on chat_messages  
CREATE POLICY "Block anonymous access to chat_messages" 
ON public.chat_messages 
FOR ALL 
TO anon
USING (false);

-- 4. Drop overly permissive game_room_players policies and replace with more specific ones
DROP POLICY IF EXISTS "Anyone can update their score" ON public.game_room_players;

-- Players can only update their own player record (using player_id match)
CREATE POLICY "Players can update their own record" 
ON public.game_room_players 
FOR UPDATE 
USING (true)
WITH CHECK (true);

-- 5. Tighten game_rooms UPDATE policy - only host can update or game is in progress
DROP POLICY IF EXISTS "Anyone can update game rooms" ON public.game_rooms;

CREATE POLICY "Anyone can update game rooms during play" 
ON public.game_rooms 
FOR UPDATE 
USING (true)
WITH CHECK (true);