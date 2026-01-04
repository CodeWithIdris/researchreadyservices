-- Create game_scores table for global leaderboard
CREATE TABLE public.game_scores (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  player_name TEXT NOT NULL,
  score INTEGER NOT NULL,
  words_completed INTEGER NOT NULL DEFAULT 0,
  best_streak INTEGER NOT NULL DEFAULT 0,
  game_mode TEXT NOT NULL DEFAULT 'practice',
  language TEXT NOT NULL DEFAULT 'english',
  played_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Enable RLS
ALTER TABLE public.game_scores ENABLE ROW LEVEL SECURITY;

-- Allow anyone to view scores (public leaderboard)
CREATE POLICY "Anyone can view game scores"
ON public.game_scores
FOR SELECT
USING (true);

-- Allow anyone to insert scores (anonymous game)
CREATE POLICY "Anyone can insert game scores"
ON public.game_scores
FOR INSERT
WITH CHECK (true);

-- Create index for faster leaderboard queries
CREATE INDEX idx_game_scores_score ON public.game_scores(score DESC);
CREATE INDEX idx_game_scores_played_at ON public.game_scores(played_at DESC);

-- Enable realtime for live leaderboard updates
ALTER PUBLICATION supabase_realtime ADD TABLE public.game_scores;