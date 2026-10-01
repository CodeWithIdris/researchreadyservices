import { useState, useEffect, useCallback, useRef, useMemo } from "react";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Progress } from "@/components/ui/progress";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import Header from "@/components/Header";
import Footer from "@/components/Footer";
import ScrollToTop from "@/components/ScrollToTop";
import SEOHead from "@/components/SEOHead";
import { Trophy, Clock, Zap, RotateCcw, ArrowRight, Brain, Target, Sparkles, Calendar, Flame, CheckCircle, Globe, Award, Volume2, VolumeX, Users } from "lucide-react";
import { toast } from "sonner";
import { supabase } from "@/integrations/supabase/client";
import { vocabularyData, type Word } from "@/data/vocabularyData";
import { getAchievements, AchievementsBadgeDisplay, NewAchievementToast } from "@/components/game/Achievements";
import { SocialShare } from "@/components/game/SocialShare";
import { Leaderboard } from "@/components/game/Leaderboard";
import { MultiplayerLobby } from "@/components/game/MultiplayerLobby";
import { MultiplayerGame } from "@/components/game/MultiplayerGame";
import { useGameSounds } from "@/hooks/useGameSounds";

// Seeded random for consistent daily words
const seededRandom = (seed: number) => {
  const x = Math.sin(seed++) * 10000;
  return x - Math.floor(x);
};

const getTodayDateString = () => {
  const today = new Date();
  return `${today.getFullYear()}-${today.getMonth() + 1}-${today.getDate()}`;
};

const getDailySeed = () => {
  const today = new Date();
  return today.getFullYear() * 10000 + (today.getMonth() + 1) * 100 + today.getDate();
};

const getDailyWords = (count: number = 15): Word[] => {
  const seed = getDailySeed();
  const words = vocabularyData.english.words;
  const shuffled = [...words];
  
  for (let i = shuffled.length - 1; i > 0; i--) {
    const j = Math.floor(seededRandom(seed + i) * (i + 1));
    [shuffled[i], shuffled[j]] = [shuffled[j], shuffled[i]];
  }
  
  return shuffled.slice(0, count);
};

const getTimeUntilMidnight = () => {
  const now = new Date();
  const tomorrow = new Date(now);
  tomorrow.setDate(tomorrow.getDate() + 1);
  tomorrow.setHours(0, 0, 0, 0);
  return tomorrow.getTime() - now.getTime();
};

const formatTimeRemaining = (ms: number) => {
  const hours = Math.floor(ms / (1000 * 60 * 60));
  const minutes = Math.floor((ms % (1000 * 60 * 60)) / (1000 * 60));
  const seconds = Math.floor((ms % (1000 * 60)) / 1000);
  return `${hours.toString().padStart(2, '0')}:${minutes.toString().padStart(2, '0')}:${seconds.toString().padStart(2, '0')}`;
};

interface DailyStats {
  lastPlayedDate: string;
  dailyHighScore: number;
  currentStreak: number;
  longestStreak: number;
  totalDaysPlayed: number;
  completedToday: boolean;
  todayScore: number;
  todayWordsCompleted: number;
}

interface PlayerStats {
  totalWordsCompleted: number;
  bestStreak: number;
  totalGamesPlayed: number;
  highScore: number;
  unlockedAchievements: string[];
}

const getRandomWord = (words: Word[], usedWords: Set<string>): Word => {
  const availableWords = words.filter(w => !usedWords.has(w.word));
  if (availableWords.length === 0) {
    return words[Math.floor(Math.random() * words.length)];
  }
  return availableWords[Math.floor(Math.random() * availableWords.length)];
};

const WordChallenge = () => {
  const [gameMode, setGameMode] = useState<"daily" | "practice" | "multiplayer">("daily");
  const [gameState, setGameState] = useState<"idle" | "playing" | "finished" | "multiplayer-lobby" | "multiplayer-game">("idle");
  const [currentWord, setCurrentWord] = useState<Word | null>(null);
  const [userInput, setUserInput] = useState("");
  const [score, setScore] = useState(0);
  const [timeLeft, setTimeLeft] = useState(60);
  const [wordsCompleted, setWordsCompleted] = useState(0);
  const [streak, setStreak] = useState(0);
  const [bestStreak, setBestStreak] = useState(0);
  const [usedWords, setUsedWords] = useState<Set<string>>(new Set());
  const [isCorrect, setIsCorrect] = useState<boolean | null>(null);
  const [dailyWordIndex, setDailyWordIndex] = useState(0);
  const [timeUntilReset, setTimeUntilReset] = useState(getTimeUntilMidnight());
  const [showLeaderboard, setShowLeaderboard] = useState(false);
  const [showAchievements, setShowAchievements] = useState(false);
  const [playerName, setPlayerName] = useState("");
  const [showNamePrompt, setShowNamePrompt] = useState(false);
  const [multiplayerRoomId, setMultiplayerRoomId] = useState<string | null>(null);
  const [multiplayerPlayers, setMultiplayerPlayers] = useState<any[]>([]);
  
  const { soundEnabled, toggleSound, playCorrect, playWrong, playStreak, playStart, playEnd, playSkip } = useGameSounds();
  
  const [highScore, setHighScore] = useState(() => {
    const saved = localStorage.getItem("wordChallengeHighScore");
    return saved ? parseInt(saved, 10) : 0;
  });
  
  const [playerStats, setPlayerStats] = useState<PlayerStats>(() => {
    const saved = localStorage.getItem("wordChallengePlayerStats");
    if (saved) return JSON.parse(saved);
    return {
      totalWordsCompleted: 0,
      bestStreak: 0,
      totalGamesPlayed: 0,
      highScore: 0,
      unlockedAchievements: [],
    };
  });
  
  const [dailyStats, setDailyStats] = useState<DailyStats>(() => {
    const saved = localStorage.getItem("wordChallengeDailyStats");
    if (saved) {
      const stats = JSON.parse(saved) as DailyStats;
      const today = getTodayDateString();
      
      if (stats.lastPlayedDate !== today) {
        const yesterday = new Date();
        yesterday.setDate(yesterday.getDate() - 1);
        const yesterdayString = `${yesterday.getFullYear()}-${yesterday.getMonth() + 1}-${yesterday.getDate()}`;
        const newStreak = stats.lastPlayedDate === yesterdayString ? stats.currentStreak : 0;
        return { ...stats, completedToday: false, todayScore: 0, todayWordsCompleted: 0, currentStreak: newStreak };
      }
      return stats;
    }
    return { lastPlayedDate: "", dailyHighScore: 0, currentStreak: 0, longestStreak: 0, totalDaysPlayed: 0, completedToday: false, todayScore: 0, todayWordsCompleted: 0 };
  });
  
  const inputRef = useRef<HTMLInputElement>(null);
  const dailyWords = useMemo(() => getDailyWords(15), []);
  const allWords = vocabularyData.english.words;

  useEffect(() => {
    const timer = setInterval(() => setTimeUntilReset(getTimeUntilMidnight()), 1000);
    return () => clearInterval(timer);
  }, []);

  const checkNewAchievements = useCallback((newStats: PlayerStats) => {
    const achievements = getAchievements({
      wordsCompleted: newStats.totalWordsCompleted,
      bestStreak: newStats.bestStreak,
      totalGamesPlayed: newStats.totalGamesPlayed,
      dailyStreak: dailyStats.currentStreak,
      highScore: newStats.highScore,
    });
    
    const newlyUnlocked = achievements.filter(a => a.unlocked && !playerStats.unlockedAchievements.includes(a.id));
    
    if (newlyUnlocked.length > 0) {
      newlyUnlocked.forEach(achievement => {
        toast.custom(() => <NewAchievementToast achievement={achievement} />, { duration: 4000 });
      });
      newStats.unlockedAchievements = [...playerStats.unlockedAchievements, ...newlyUnlocked.map(a => a.id)];
    }
    
    return newStats;
  }, [dailyStats.currentStreak, playerStats.unlockedAchievements]);

  const startGame = useCallback((mode: "daily" | "practice") => {
    setGameMode(mode);
    setGameState("playing");
    setScore(0);
    setTimeLeft(60);
    setWordsCompleted(0);
    setStreak(0);
    setBestStreak(0);
    setUserInput("");
    setIsCorrect(null);
    playStart();
    
    if (mode === "daily") {
      setDailyWordIndex(0);
      setCurrentWord(dailyWords[0]);
      setUsedWords(new Set([dailyWords[0].word]));
    } else {
      setUsedWords(new Set());
      const firstWord = getRandomWord(allWords, new Set());
      setCurrentWord(firstWord);
      setUsedWords(new Set([firstWord.word]));
    }
    
    setTimeout(() => inputRef.current?.focus(), 100);
  }, [dailyWords, allWords, playStart]);

  const nextWord = useCallback(() => {
    if (gameMode === "daily") {
      const nextIndex = dailyWordIndex + 1;
      if (nextIndex < dailyWords.length) {
        setDailyWordIndex(nextIndex);
        setCurrentWord(dailyWords[nextIndex]);
      } else {
        setGameState("finished");
        playEnd();
        return;
      }
    } else {
      const newWord = getRandomWord(allWords, usedWords);
      setCurrentWord(newWord);
      setUsedWords(prev => new Set([...prev, newWord.word]));
    }
    setUserInput("");
    setIsCorrect(null);
    inputRef.current?.focus();
  }, [gameMode, dailyWordIndex, dailyWords, usedWords, allWords, playEnd]);

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value.toLowerCase();
    setUserInput(value);

    if (!currentWord) return;

    if (value === currentWord.word.toLowerCase()) {
      setIsCorrect(true);
      playCorrect();
      const streakBonus = Math.floor(streak / 3) * 5;
      const wordScore = 10 + streakBonus;
      setScore(prev => prev + wordScore);
      setWordsCompleted(prev => prev + 1);
      setStreak(prev => {
        const newStreak = prev + 1;
        if (newStreak > bestStreak) setBestStreak(newStreak);
        if (newStreak > 0 && newStreak % 5 === 0) {
          playStreak(newStreak);
          toast.success(`🔥 ${newStreak} word streak!`);
        }
        return newStreak;
      });
      setTimeout(nextWord, 300);
    } else if (currentWord.word.toLowerCase().startsWith(value)) {
      setIsCorrect(null);
    } else {
      setIsCorrect(false);
      if (streak > 0) playWrong();
      setStreak(0);
    }
  };

  const skipWord = () => {
    setStreak(0);
    playSkip();
    nextWord();
  };

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
  }, [gameState, playEnd]);

  useEffect(() => {
    if (gameState === "finished") {
      let newPlayerStats: PlayerStats = {
        ...playerStats,
        totalWordsCompleted: playerStats.totalWordsCompleted + wordsCompleted,
        bestStreak: Math.max(playerStats.bestStreak, bestStreak),
        totalGamesPlayed: playerStats.totalGamesPlayed + 1,
        highScore: Math.max(playerStats.highScore, score),
      };
      
      newPlayerStats = checkNewAchievements(newPlayerStats);
      setPlayerStats(newPlayerStats);
      localStorage.setItem("wordChallengePlayerStats", JSON.stringify(newPlayerStats));
      
      if (gameMode === "practice" && score > highScore) {
        setHighScore(score);
        localStorage.setItem("wordChallengeHighScore", score.toString());
        toast.success("🎉 New High Score!");
      }
      
      if (gameMode === "daily" && !dailyStats.completedToday) {
        const today = getTodayDateString();
        const isNewDay = dailyStats.lastPlayedDate !== today;
        const newStats: DailyStats = {
          lastPlayedDate: today,
          dailyHighScore: Math.max(dailyStats.dailyHighScore, score),
          currentStreak: isNewDay ? dailyStats.currentStreak + 1 : dailyStats.currentStreak,
          longestStreak: Math.max(dailyStats.longestStreak, isNewDay ? dailyStats.currentStreak + 1 : dailyStats.currentStreak),
          totalDaysPlayed: isNewDay ? dailyStats.totalDaysPlayed + 1 : dailyStats.totalDaysPlayed,
          completedToday: true,
          todayScore: score,
          todayWordsCompleted: wordsCompleted
        };
        setDailyStats(newStats);
        localStorage.setItem("wordChallengeDailyStats", JSON.stringify(newStats));
      }
      
      if (score > 0) setShowNamePrompt(true);
    }
  }, [gameState]);

  const submitToLeaderboard = async () => {
    if (!playerName.trim()) {
      toast.error("Please enter your name");
      return;
    }
    
    try {
      await supabase.from("game_scores").insert({
        player_name: playerName.trim(),
        score,
        words_completed: wordsCompleted,
        best_streak: bestStreak,
        language: "english",
        game_mode: gameMode,
      });
      toast.success("Score submitted!");
      setShowNamePrompt(false);
      setShowLeaderboard(true);
    } catch (error) {
      toast.error("Failed to submit score");
    }
  };

  const getPerformanceMessage = () => {
    if (wordsCompleted >= 20) return { title: "Academic Prodigy! 🎓", message: "Exceptional vocabulary!" };
    if (wordsCompleted >= 15) return { title: "Research Expert! 📚", message: "Impressive skills!" };
    if (wordsCompleted >= 10) return { title: "Scholar in Progress! ✨", message: "Great effort!" };
    if (wordsCompleted >= 5) return { title: "Aspiring Researcher! 📖", message: "Good start!" };
    return { title: "Keep Practicing! 💪", message: "You'll improve!" };
  };

  const achievements = getAchievements({
    wordsCompleted: playerStats.totalWordsCompleted,
    bestStreak: playerStats.bestStreak,
    totalGamesPlayed: playerStats.totalGamesPlayed,
    dailyStreak: dailyStats.currentStreak,
    highScore: playerStats.highScore,
  });

  // Multiplayer handlers
  const handleMultiplayerStart = (roomId: string, players: any[]) => {
    setMultiplayerRoomId(roomId);
    setMultiplayerPlayers(players);
    setGameState("multiplayer-game");
  };

  const handleMultiplayerEnd = () => {
    setGameState("idle");
    setMultiplayerRoomId(null);
    setMultiplayerPlayers([]);
  };

  return (
    <div className="min-h-screen bg-background">
      <SEOHead title="Word Challenge Game" description="A vocabulary game from ResearchReady." url="https://researchreadyservices.lovable.app/game" noindex />
      <Header />
      
      <main className="pt-24 pb-16">
        <div className="container mx-auto px-4 max-w-4xl">
          {/* Header */}
          <div className="text-center mb-8 animate-fade-in">
            <div className="inline-flex items-center gap-2 px-4 py-2 bg-accent/10 text-accent rounded-full text-sm font-semibold mb-4">
              <Brain className="w-4 h-4" />
              500+ Academic Words
            </div>
            <h1 className="font-playfair text-4xl md:text-5xl font-bold text-foreground mb-4">
              Word <span className="text-accent">Challenge</span>
            </h1>
            
            <div className="flex flex-wrap justify-center gap-3 mt-6">
              <Button variant="ghost" size="sm" onClick={toggleSound} className="gap-2">
                {soundEnabled ? <Volume2 className="w-4 h-4" /> : <VolumeX className="w-4 h-4" />}
                {soundEnabled ? "Sound On" : "Sound Off"}
              </Button>
              <Dialog open={showLeaderboard} onOpenChange={setShowLeaderboard}>
                <DialogTrigger asChild>
                  <Button variant="outline" size="sm" className="gap-2">
                    <Globe className="w-4 h-4" />
                    Leaderboard
                  </Button>
                </DialogTrigger>
                <DialogContent className="max-w-2xl">
                  <Leaderboard currentPlayerScore={score} />
                </DialogContent>
              </Dialog>
              <Dialog open={showAchievements} onOpenChange={setShowAchievements}>
                <DialogTrigger asChild>
                  <Button variant="outline" size="sm" className="gap-2">
                    <Award className="w-4 h-4" />
                    Achievements ({achievements.filter(a => a.unlocked).length}/{achievements.length})
                  </Button>
                </DialogTrigger>
                <DialogContent className="max-w-2xl">
                  <DialogHeader><DialogTitle>Your Achievements</DialogTitle></DialogHeader>
                  <AchievementsBadgeDisplay achievements={achievements} showAll />
                </DialogContent>
              </Dialog>
            </div>
          </div>

          {/* Multiplayer Lobby */}
          {gameState === "multiplayer-lobby" && (
            <MultiplayerLobby onGameStart={handleMultiplayerStart} onBack={() => setGameState("idle")} />
          )}

          {/* Multiplayer Game */}
          {gameState === "multiplayer-game" && multiplayerRoomId && (
            <MultiplayerGame roomId={multiplayerRoomId} players={multiplayerPlayers} onGameEnd={handleMultiplayerEnd} />
          )}

          {/* Idle State */}
          {gameState === "idle" && (
            <div className="space-y-6 animate-scale-in">
              {dailyStats.currentStreak > 0 && (
                <Card className="p-4 bg-gradient-to-r from-orange-500/10 to-accent/10 border-orange-500/20">
                  <div className="flex items-center justify-center gap-6 flex-wrap">
                    <div className="flex items-center gap-2">
                      <Flame className="w-5 h-5 text-orange-500" />
                      <span className="font-semibold text-foreground">{dailyStats.currentStreak} Day Streak!</span>
                    </div>
                  </div>
                </Card>
              )}

              <Tabs defaultValue="daily" className="w-full">
                <TabsList className="grid w-full grid-cols-3 mb-6">
                  <TabsTrigger value="daily" className="flex items-center gap-2">
                    <Calendar className="w-4 h-4" />
                    Daily
                  </TabsTrigger>
                  <TabsTrigger value="practice" className="flex items-center gap-2">
                    <Target className="w-4 h-4" />
                    Practice
                  </TabsTrigger>
                  <TabsTrigger value="multiplayer" className="flex items-center gap-2">
                    <Users className="w-4 h-4" />
                    Multiplayer
                  </TabsTrigger>
                </TabsList>

                <TabsContent value="daily">
                  <Card className="p-8 text-center bg-card border-border">
                    <div className="space-y-6">
                      {dailyStats.completedToday ? (
                        <>
                          <CheckCircle className="w-16 h-16 mx-auto text-accent" />
                          <h2 className="font-playfair text-2xl font-bold">Today's Challenge Complete!</h2>
                          <p className="text-muted-foreground">Score: {dailyStats.todayScore} pts</p>
                          <p className="text-sm text-muted-foreground">Next challenge in {formatTimeRemaining(timeUntilReset)}</p>
                        </>
                      ) : (
                        <>
                          <span className="text-6xl">🇬🇧</span>
                          <h2 className="font-playfair text-2xl font-bold">Today's Challenge</h2>
                          <p className="text-muted-foreground">Type {dailyWords.length} words in 60 seconds!</p>
                          <Button onClick={() => startGame("daily")} variant="default" size="lg">
                            <Sparkles className="w-5 h-5 mr-2" />
                            Start Daily Challenge
                          </Button>
                        </>
                      )}
                    </div>
                  </Card>
                </TabsContent>

                <TabsContent value="practice">
                  <Card className="p-8 text-center bg-card border-border">
                    <span className="text-6xl">🇬🇧</span>
                    <h2 className="font-playfair text-2xl font-bold mt-4 mb-2">Practice Mode</h2>
                    <p className="text-muted-foreground mb-6">Unlimited plays • 500+ words • High Score: {highScore}</p>
                    <Button onClick={() => startGame("practice")} variant="default" size="lg">
                      <Sparkles className="w-5 h-5 mr-2" />
                      Start Practice
                    </Button>
                  </Card>
                </TabsContent>

                <TabsContent value="multiplayer">
                  <Card className="p-8 text-center bg-card border-border">
                    <Users className="w-16 h-16 mx-auto text-accent mb-4" />
                    <h2 className="font-playfair text-2xl font-bold mb-2">Multiplayer Mode</h2>
                    <p className="text-muted-foreground mb-6">Compete with friends in real-time!</p>
                    <Button onClick={() => setGameState("multiplayer-lobby")} variant="default" size="lg">
                      <Users className="w-5 h-5 mr-2" />
                      Play Multiplayer
                    </Button>
                  </Card>
                </TabsContent>
              </Tabs>
            </div>
          )}

          {/* Playing State */}
          {gameState === "playing" && currentWord && (
            <div className="space-y-6 animate-fade-in">
              <div className="grid grid-cols-4 gap-4">
                <Card className="p-4 text-center"><Clock className="w-4 h-4 mx-auto text-accent mb-1" /><span className="text-2xl font-bold">{timeLeft}</span><p className="text-xs text-muted-foreground">Seconds</p></Card>
                <Card className="p-4 text-center"><Trophy className="w-4 h-4 mx-auto text-primary mb-1" /><span className="text-2xl font-bold">{score}</span><p className="text-xs text-muted-foreground">Score</p></Card>
                <Card className="p-4 text-center"><Target className="w-4 h-4 mx-auto mb-1" /><span className="text-2xl font-bold">{wordsCompleted}</span><p className="text-xs text-muted-foreground">Words</p></Card>
                <Card className="p-4 text-center"><Zap className="w-4 h-4 mx-auto text-orange-500 mb-1" /><span className="text-2xl font-bold">{streak}</span><p className="text-xs text-muted-foreground">Streak</p></Card>
              </div>

              <Progress value={(timeLeft / 60) * 100} className="h-2" />

              <Card className="p-8 text-center bg-gradient-to-br from-card to-secondary/20">
                <p className="text-sm text-muted-foreground mb-2">Type this word:</p>
                <div className="mb-4">
                  <span className="font-playfair text-4xl md:text-6xl font-bold tracking-wider">
                    {currentWord.word.split("").map((char, i) => (
                      <span key={i} className={i < userInput.length ? (userInput[i] === char.toLowerCase() ? "text-accent" : "text-destructive") : "text-foreground"}>{char}</span>
                    ))}
                  </span>
                </div>
                <p className="text-sm text-muted-foreground mb-6">{currentWord.meaning}</p>
                <div className="max-w-md mx-auto space-y-4">
                  <Input ref={inputRef} type="text" value={userInput} onChange={handleInputChange} placeholder="Start typing..." className={`text-center text-2xl h-16 font-mono ${isCorrect === true ? "border-accent bg-accent/10" : isCorrect === false ? "border-destructive bg-destructive/10" : ""}`} autoComplete="off" autoCapitalize="off" autoCorrect="off" spellCheck={false} />
                  <Button onClick={skipWord} variant="ghost" size="sm">Skip Word</Button>
                </div>
              </Card>

              {streak >= 3 && (
                <div className="text-center">
                  <span className="inline-flex items-center gap-2 px-4 py-2 bg-orange-500/20 text-orange-500 rounded-full text-sm font-semibold">
                    <Zap className="w-4 h-4" />{streak} Streak! +{Math.floor(streak / 3) * 5} Bonus
                  </span>
                </div>
              )}
            </div>
          )}

          {/* Finished State */}
          {gameState === "finished" && (
            <div className="space-y-8 animate-scale-in">
              <Dialog open={showNamePrompt} onOpenChange={setShowNamePrompt}>
                <DialogContent>
                  <DialogHeader><DialogTitle>Submit to Leaderboard</DialogTitle></DialogHeader>
                  <div className="space-y-4 py-4">
                    <p className="text-muted-foreground">Score: <span className="font-bold text-accent">{score} points</span></p>
                    <Input placeholder="Your name" value={playerName} onChange={(e) => setPlayerName(e.target.value)} maxLength={20} />
                    <div className="flex gap-2">
                      <Button variant="outline" onClick={() => setShowNamePrompt(false)}>Skip</Button>
                      <Button onClick={submitToLeaderboard} className="flex-1">Submit</Button>
                    </div>
                  </div>
                </DialogContent>
              </Dialog>

              <Card className="p-8 text-center bg-card">
                <Trophy className="w-16 h-16 mx-auto text-accent mb-4" />
                <h2 className="font-playfair text-3xl font-bold mb-2">{getPerformanceMessage().title}</h2>
                <p className="text-muted-foreground mb-6">{getPerformanceMessage().message}</p>
                
                <div className="grid grid-cols-3 gap-4 mb-8">
                  <div className="p-4 bg-secondary/50 rounded-lg"><p className="text-2xl font-bold text-accent">{score}</p><p className="text-xs text-muted-foreground">Score</p></div>
                  <div className="p-4 bg-secondary/50 rounded-lg"><p className="text-2xl font-bold">{wordsCompleted}</p><p className="text-xs text-muted-foreground">Words</p></div>
                  <div className="p-4 bg-secondary/50 rounded-lg"><p className="text-2xl font-bold text-orange-500">{bestStreak}</p><p className="text-xs text-muted-foreground">Best Streak</p></div>
                </div>

                <SocialShare score={score} wordsCompleted={wordsCompleted} language="English" gameMode={gameMode} />

                <div className="flex flex-wrap justify-center gap-4 mt-6">
                  <Button onClick={() => startGame(gameMode === "multiplayer" ? "practice" : gameMode)} variant="default">
                    <RotateCcw className="w-4 h-4 mr-2" />Play Again
                  </Button>
                  <Button onClick={() => setGameState("idle")} variant="outline">Back to Menu</Button>
                </div>
              </Card>

              <Card className="p-6 bg-gradient-to-r from-primary/10 to-accent/10 text-center">
                <h3 className="font-playfair text-xl font-bold mb-2">Need Help With Academic Writing?</h3>
                <p className="text-muted-foreground mb-4">Let our expert writers help you succeed!</p>
                <Button asChild><a href="/#services">Explore Our Services <ArrowRight className="w-4 h-4 ml-2" /></a></Button>
              </Card>
            </div>
          )}
        </div>
      </main>
      
      <Footer />
      <ScrollToTop />
    </div>
  );
};

export default WordChallenge;
