-- Create multiplayer game rooms table
CREATE TABLE public.game_rooms (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  room_code VARCHAR(6) NOT NULL UNIQUE,
  host_player_id VARCHAR(255) NOT NULL,
  host_player_name VARCHAR(50) NOT NULL,
  status VARCHAR(20) NOT NULL DEFAULT 'waiting',
  max_players INTEGER NOT NULL DEFAULT 2,
  game_duration INTEGER NOT NULL DEFAULT 60,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  started_at TIMESTAMP WITH TIME ZONE,
  ended_at TIMESTAMP WITH TIME ZONE
);

-- Create game room players table
CREATE TABLE public.game_room_players (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  room_id UUID NOT NULL REFERENCES public.game_rooms(id) ON DELETE CASCADE,
  player_id VARCHAR(255) NOT NULL,
  player_name VARCHAR(50) NOT NULL,
  score INTEGER NOT NULL DEFAULT 0,
  words_completed INTEGER NOT NULL DEFAULT 0,
  current_streak INTEGER NOT NULL DEFAULT 0,
  best_streak INTEGER NOT NULL DEFAULT 0,
  is_ready BOOLEAN NOT NULL DEFAULT false,
  joined_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  UNIQUE(room_id, player_id)
);

-- Enable Row Level Security
ALTER TABLE public.game_rooms ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.game_room_players ENABLE ROW LEVEL SECURITY;

-- Public read/write for game rooms (anyone can create/join)
CREATE POLICY "Anyone can view game rooms" ON public.game_rooms FOR SELECT USING (true);
CREATE POLICY "Anyone can create game rooms" ON public.game_rooms FOR INSERT WITH CHECK (true);
CREATE POLICY "Anyone can update game rooms" ON public.game_rooms FOR UPDATE USING (true);
CREATE POLICY "Anyone can delete expired rooms" ON public.game_rooms FOR DELETE USING (created_at < now() - interval '1 hour');

-- Public read/write for players
CREATE POLICY "Anyone can view room players" ON public.game_room_players FOR SELECT USING (true);
CREATE POLICY "Anyone can join rooms" ON public.game_room_players FOR INSERT WITH CHECK (true);
CREATE POLICY "Anyone can update their score" ON public.game_room_players FOR UPDATE USING (true);
CREATE POLICY "Anyone can leave rooms" ON public.game_room_players FOR DELETE USING (true);

-- Enable realtime for multiplayer
ALTER PUBLICATION supabase_realtime ADD TABLE public.game_rooms;
ALTER PUBLICATION supabase_realtime ADD TABLE public.game_room_players;