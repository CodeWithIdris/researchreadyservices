-- =============================================
-- SECURITY FIX: Game Score Validation
-- =============================================

-- Add check constraints to game_scores table
ALTER TABLE public.game_scores 
  ADD CONSTRAINT score_range CHECK (score >= 0 AND score <= 10000),
  ADD CONSTRAINT words_range CHECK (words_completed >= 0 AND words_completed <= 100),
  ADD CONSTRAINT streak_range CHECK (best_streak >= 0 AND best_streak <= 100);

-- Create validation trigger function for cross-field validation
CREATE OR REPLACE FUNCTION public.validate_game_score()
RETURNS TRIGGER AS $$
BEGIN
  -- Score should roughly correlate with words (max 100 points per word)
  IF NEW.score > (NEW.words_completed * 100) THEN
    RAISE EXCEPTION 'Score too high for words completed';
  END IF;
  
  -- Streak cannot exceed words completed
  IF NEW.best_streak > NEW.words_completed THEN
    RAISE EXCEPTION 'Streak cannot exceed words completed';
  END IF;
  
  -- Sanitize player_name (limit length)
  IF LENGTH(NEW.player_name) > 20 THEN
    NEW.player_name := SUBSTRING(NEW.player_name, 1, 20);
  END IF;
  
  RETURN NEW;
END;
$$ LANGUAGE plpgsql SET search_path = public;

-- Create trigger for game_scores validation
CREATE TRIGGER validate_score_insert
BEFORE INSERT ON public.game_scores
FOR EACH ROW EXECUTE FUNCTION public.validate_game_score();

-- =============================================
-- SECURITY FIX: Game Room Players Validation
-- =============================================

-- Add check constraints to game_room_players table
ALTER TABLE public.game_room_players 
  ADD CONSTRAINT player_score_range CHECK (score >= 0 AND score <= 10000),
  ADD CONSTRAINT player_words_range CHECK (words_completed >= 0 AND words_completed <= 100),
  ADD CONSTRAINT player_streak_range CHECK (current_streak >= 0 AND current_streak <= 100),
  ADD CONSTRAINT player_best_streak_range CHECK (best_streak >= 0 AND best_streak <= 100);

-- Create validation trigger for game_room_players
CREATE OR REPLACE FUNCTION public.validate_game_room_player()
RETURNS TRIGGER AS $$
BEGIN
  -- Sanitize player_name (limit length)
  IF LENGTH(NEW.player_name) > 20 THEN
    NEW.player_name := SUBSTRING(NEW.player_name, 1, 20);
  END IF;
  
  -- Streak cannot exceed words completed
  IF NEW.best_streak > NEW.words_completed THEN
    NEW.best_streak := NEW.words_completed;
  END IF;
  
  IF NEW.current_streak > NEW.words_completed THEN
    NEW.current_streak := NEW.words_completed;
  END IF;
  
  RETURN NEW;
END;
$$ LANGUAGE plpgsql SET search_path = public;

CREATE TRIGGER validate_player_insert_update
BEFORE INSERT OR UPDATE ON public.game_room_players
FOR EACH ROW EXECUTE FUNCTION public.validate_game_room_player();

-- =============================================
-- SECURITY FIX: Game Rooms Validation
-- =============================================

-- Add constraints to game_rooms
ALTER TABLE public.game_rooms
  ADD CONSTRAINT max_players_range CHECK (max_players >= 2 AND max_players <= 10),
  ADD CONSTRAINT game_duration_range CHECK (game_duration >= 30 AND game_duration <= 300);

-- Create validation trigger for game_rooms
CREATE OR REPLACE FUNCTION public.validate_game_room()
RETURNS TRIGGER AS $$
BEGIN
  -- Sanitize host_player_name (limit length)
  IF LENGTH(NEW.host_player_name) > 20 THEN
    NEW.host_player_name := SUBSTRING(NEW.host_player_name, 1, 20);
  END IF;
  
  -- Room code must be exactly 6 characters
  IF LENGTH(NEW.room_code) != 6 THEN
    RAISE EXCEPTION 'Room code must be exactly 6 characters';
  END IF;
  
  RETURN NEW;
END;
$$ LANGUAGE plpgsql SET search_path = public;

CREATE TRIGGER validate_room_insert
BEFORE INSERT ON public.game_rooms
FOR EACH ROW EXECUTE FUNCTION public.validate_game_room();

-- =============================================
-- SECURITY FIX: Improve handle_new_user function
-- =============================================

CREATE OR REPLACE FUNCTION public.handle_new_user()
RETURNS trigger
LANGUAGE plpgsql
SECURITY DEFINER SET search_path = public
AS $$
DECLARE
  v_full_name TEXT;
BEGIN
  -- Extract and validate full_name
  v_full_name := TRIM(new.raw_user_meta_data ->> 'full_name');
  
  -- Limit length to prevent abuse (max 100 characters)
  IF v_full_name IS NOT NULL AND LENGTH(v_full_name) > 100 THEN
    v_full_name := SUBSTRING(v_full_name, 1, 100);
  END IF;
  
  INSERT INTO public.profiles (id, full_name)
  VALUES (new.id, v_full_name);
  
  RETURN new;
EXCEPTION
  WHEN OTHERS THEN
    -- Log error but don't fail user creation
    RAISE WARNING 'Failed to create profile for user %: %', new.id, SQLERRM;
    RETURN new;
END;
$$;