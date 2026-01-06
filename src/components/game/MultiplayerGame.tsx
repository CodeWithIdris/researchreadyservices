import { useState, useEffect, useCallback, useRef } from "react";
import { Card } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Progress } from "@/components/ui/progress";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Clock, Trophy, Zap, Target, Crown, Users } from "lucide-react";
import { supabase } from "@/integrations/supabase/client";
import { vocabularyData, type Word } from "@/data/vocabularyData";
import { useGameSounds } from "@/hooks/useGameSounds";
import { toast } from "sonner";

interface Player {
  id: string;
  player_id: string;
  player_name: string;
  score: number;
  words_completed: number;
  current_streak: number;
  best_streak: number;
}

interface MultiplayerGameProps {
  roomId: string;
  players: Player[];
  onGameEnd: (results: Player[]) => void;
}

const getPlayerId = () => localStorage.getItem('game_player_id') || '';

const getRandomWord = (words: Word[], usedWords: Set<string>): Word => {
  const availableWords = words.filter(w => !usedWords.has(w.word));
  if (availableWords.length === 0) {
    return words[Math.floor(Math.random() * words.length)];
  }
  return availableWords[Math.floor(Math.random() * availableWords.length)];
};

export const MultiplayerGame = ({ roomId, players: initialPlayers, onGameEnd }: MultiplayerGameProps) => {
  const [gameState, setGameState] = useState<"countdown" | "playing" | "finished">("countdown");
  const [countdown, setCountdown] = useState(3);
  const [timeLeft, setTimeLeft] = useState(60);
  const [currentWord, setCurrentWord] = useState<Word | null>(null);
  const [userInput, setUserInput] = useState("");
  const [score, setScore] = useState(0);
  const [wordsCompleted, setWordsCompleted] = useState(0);
  const [streak, setStreak] = useState(0);
  const [bestStreak, setBestStreak] = useState(0);
  const [usedWords, setUsedWords] = useState<Set<string>>(new Set());
  const [isCorrect, setIsCorrect] = useState<boolean | null>(null);
  const [players, setPlayers] = useState<Player[]>(initialPlayers);
  
  const inputRef = useRef<HTMLInputElement>(null);
  const playerId = getPlayerId();
  const words = vocabularyData.english.words;
  
  const { playCorrect, playWrong, playStreak, playStart, playEnd, playCountdown } = useGameSounds();

  // Subscribe to player updates
  useEffect(() => {
    const channel = supabase
      .channel(`game_${roomId}`)
      .on(
        'postgres_changes',
        {
          event: 'UPDATE',
          schema: 'public',
          table: 'game_room_players',
          filter: `room_id=eq.${roomId}`,
        },
        () => {
          fetchPlayers();
        }
      )
      .subscribe();

    return () => {
      supabase.removeChannel(channel);
    };
  }, [roomId]);

  const fetchPlayers = async () => {
    const { data } = await supabase
      .from('game_room_players')
      .select('*')
      .eq('room_id', roomId)
      .order('score', { ascending: false });
    
    if (data) {
      setPlayers(data as Player[]);
    }
  };

  // Countdown
  useEffect(() => {
    if (gameState !== "countdown") return;

    if (countdown === 0) {
      setGameState("playing");
      playStart();
      const firstWord = getRandomWord(words, new Set());
      setCurrentWord(firstWord);
      setUsedWords(new Set([firstWord.word]));
      setTimeout(() => inputRef.current?.focus(), 100);
      return;
    }

    playCountdown();
    const timer = setTimeout(() => setCountdown(c => c - 1), 1000);
    return () => clearTimeout(timer);
  }, [gameState, countdown]);

  // Game timer
  useEffect(() => {
    if (gameState !== "playing") return;

    const timer = setInterval(() => {
      setTimeLeft(prev => {
        if (prev <= 1) {
          setGameState("finished");
          playEnd();
          return 0;
        }
        return prev - 1;
      });
    }, 1000);

    return () => clearInterval(timer);
  }, [gameState]);

  // Update score to database
  const updateScore = useCallback(async (newScore: number, newWords: number, newStreak: number, newBest: number) => {
    await supabase
      .from('game_room_players')
      .update({
        score: newScore,
        words_completed: newWords,
        current_streak: newStreak,
        best_streak: newBest,
      })
      .eq('room_id', roomId)
      .eq('player_id', playerId);
  }, [roomId, playerId]);

  // Handle game end
  useEffect(() => {
    if (gameState === "finished") {
      fetchPlayers().then(() => {
        setTimeout(() => onGameEnd(players), 2000);
      });
    }
  }, [gameState]);

  const nextWord = useCallback(() => {
    const newWord = getRandomWord(words, usedWords);
    setCurrentWord(newWord);
    setUsedWords(prev => new Set([...prev, newWord.word]));
    setUserInput("");
    setIsCorrect(null);
    inputRef.current?.focus();
  }, [usedWords, words]);

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value.toLowerCase();
    setUserInput(value);

    if (!currentWord) return;

    if (value === currentWord.word.toLowerCase()) {
      setIsCorrect(true);
      playCorrect();
      
      const newStreak = streak + 1;
      const streakBonus = Math.floor(streak / 3) * 5;
      const wordScore = 10 + streakBonus;
      const newScore = score + wordScore;
      const newWords = wordsCompleted + 1;
      const newBest = Math.max(bestStreak, newStreak);
      
      setScore(newScore);
      setWordsCompleted(newWords);
      setStreak(newStreak);
      setBestStreak(newBest);
      
      if (newStreak > 0 && newStreak % 5 === 0) {
        playStreak(newStreak);
        toast.success(`🔥 ${newStreak} word streak!`);
      }
      
      updateScore(newScore, newWords, newStreak, newBest);
      setTimeout(nextWord, 200);
    } else if (currentWord.word.toLowerCase().startsWith(value)) {
      setIsCorrect(null);
    } else {
      setIsCorrect(false);
      if (streak > 0) {
        playWrong();
        setStreak(0);
        updateScore(score, wordsCompleted, 0, bestStreak);
      }
    }
  };

  const myRank = players.findIndex(p => p.player_id === playerId) + 1;
  const myPlayer = players.find(p => p.player_id === playerId);

  if (gameState === "countdown") {
    return (
      <Card className="p-12 text-center bg-card border-border">
        <p className="text-muted-foreground mb-4">Game starting in...</p>
        <div className="text-8xl font-bold text-accent animate-pulse">
          {countdown}
        </div>
        <p className="text-muted-foreground mt-4">Get ready to type!</p>
      </Card>
    );
  }

  if (gameState === "finished") {
    return (
      <Card className="p-8 text-center bg-card border-border">
        <Trophy className="w-16 h-16 mx-auto mb-4 text-accent" />
        <h2 className="font-playfair text-3xl font-bold mb-6">Game Over!</h2>
        
        <div className="space-y-3 mb-6">
          {players.sort((a, b) => b.score - a.score).map((player, index) => (
            <div
              key={player.id}
              className={`flex items-center justify-between p-4 rounded-lg ${
                player.player_id === playerId
                  ? "bg-accent/20 border border-accent"
                  : "bg-secondary/50"
              }`}
            >
              <div className="flex items-center gap-3">
                <span className="text-2xl font-bold w-8">
                  {index === 0 ? "🥇" : index === 1 ? "🥈" : index === 2 ? "🥉" : `#${index + 1}`}
                </span>
                <span className="font-medium">{player.player_name}</span>
              </div>
              <div className="text-right">
                <p className="text-xl font-bold text-accent">{player.score} pts</p>
                <p className="text-xs text-muted-foreground">{player.words_completed} words</p>
              </div>
            </div>
          ))}
        </div>
        
        <p className="text-muted-foreground">Returning to lobby...</p>
      </Card>
    );
  }

  return (
    <div className="space-y-4">
      {/* Live Scoreboard */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-2">
        {players.sort((a, b) => b.score - a.score).map((player, index) => (
          <Card
            key={player.id}
            className={`p-3 ${
              player.player_id === playerId
                ? "bg-accent/20 border-accent"
                : "bg-secondary/50"
            }`}
          >
            <div className="flex items-center gap-2 mb-1">
              {index === 0 && <Crown className="w-4 h-4 text-yellow-500" />}
              <span className="text-sm font-medium truncate">{player.player_name}</span>
            </div>
            <p className="text-lg font-bold text-accent">{player.score}</p>
          </Card>
        ))}
      </div>

      {/* Stats Bar */}
      <div className="grid grid-cols-4 gap-3">
        <Card className="p-3 text-center bg-card border-border">
          <div className="flex items-center justify-center gap-1 text-accent">
            <Clock className="w-4 h-4" />
            <span className="text-xl font-bold">{timeLeft}</span>
          </div>
          <p className="text-xs text-muted-foreground">Seconds</p>
        </Card>
        <Card className="p-3 text-center bg-card border-border">
          <div className="flex items-center justify-center gap-1 text-primary">
            <Trophy className="w-4 h-4" />
            <span className="text-xl font-bold">{score}</span>
          </div>
          <p className="text-xs text-muted-foreground">Score</p>
        </Card>
        <Card className="p-3 text-center bg-card border-border">
          <div className="flex items-center justify-center gap-1">
            <Target className="w-4 h-4" />
            <span className="text-xl font-bold">{wordsCompleted}</span>
          </div>
          <p className="text-xs text-muted-foreground">Words</p>
        </Card>
        <Card className="p-3 text-center bg-card border-border">
          <div className="flex items-center justify-center gap-1 text-orange-500">
            <Zap className="w-4 h-4" />
            <span className="text-xl font-bold">{streak}</span>
          </div>
          <p className="text-xs text-muted-foreground">Streak</p>
        </Card>
      </div>

      <Progress value={(timeLeft / 60) * 100} className="h-2" />

      {/* Word Display */}
      {currentWord && (
        <Card className="p-8 text-center bg-gradient-to-br from-card to-secondary/20 border-border">
          <p className="text-sm text-muted-foreground mb-2">Type this word:</p>
          <div className="mb-4">
            <span className="font-playfair text-4xl md:text-5xl font-bold tracking-wider">
              {currentWord.word.split("").map((char, i) => (
                <span
                  key={i}
                  className={
                    i < userInput.length
                      ? userInput[i] === char.toLowerCase()
                        ? "text-accent"
                        : "text-destructive"
                      : "text-foreground"
                  }
                >
                  {char}
                </span>
              ))}
            </span>
          </div>
          
          <p className="text-sm text-muted-foreground mb-4 max-w-md mx-auto">
            {currentWord.meaning}
          </p>
          
          <Input
            ref={inputRef}
            type="text"
            value={userInput}
            onChange={handleInputChange}
            placeholder="Start typing..."
            className={`text-center text-2xl h-14 font-mono max-w-md mx-auto ${
              isCorrect === true
                ? "border-accent bg-accent/10"
                : isCorrect === false
                ? "border-destructive bg-destructive/10"
                : ""
            }`}
            autoComplete="off"
            autoCapitalize="off"
            autoCorrect="off"
            spellCheck={false}
          />
        </Card>
      )}

      {streak >= 3 && (
        <div className="text-center">
          <Badge className="bg-orange-500/20 text-orange-500 border-orange-500/30">
            <Zap className="w-4 h-4 mr-1" />
            {streak} Word Streak! +{Math.floor(streak / 3) * 5} Bonus
          </Badge>
        </div>
      )}
    </div>
  );
};
