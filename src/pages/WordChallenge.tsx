import { useState, useEffect, useCallback, useRef, useMemo } from "react";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Progress } from "@/components/ui/progress";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import Header from "@/components/Header";
import Footer from "@/components/Footer";
import ScrollToTop from "@/components/ScrollToTop";
import SEOHead from "@/components/SEOHead";
import { Trophy, Clock, Zap, RotateCcw, ArrowRight, Brain, Target, Sparkles, Calendar, Flame, CheckCircle } from "lucide-react";
import { toast } from "sonner";

const academicWords = [
  "dissertation", "hypothesis", "methodology", "literature", "analysis",
  "research", "abstract", "synthesis", "empirical", "qualitative",
  "quantitative", "bibliography", "citation", "thesis", "paradigm",
  "theoretical", "phenomenology", "epistemology", "ontology", "hermeneutics",
  "ethnography", "grounded", "validity", "reliability", "sampling",
  "correlation", "regression", "variable", "framework", "conceptual",
  "scholarly", "academic", "publication", "manuscript", "appendix", 
  "conclusion", "discussion", "findings", "introduction", "objectives", 
  "significance", "limitations", "recommendations", "inference", "deductive",
  "inductive", "proposition", "postulate", "axiom", "theorem"
];

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

const getDailyWords = (count: number = 15): string[] => {
  const seed = getDailySeed();
  const shuffled = [...academicWords];
  
  // Fisher-Yates shuffle with seeded random
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

const getRandomWord = (usedWords: Set<string>): string => {
  const availableWords = academicWords.filter(w => !usedWords.has(w));
  if (availableWords.length === 0) {
    return academicWords[Math.floor(Math.random() * academicWords.length)];
  }
  return availableWords[Math.floor(Math.random() * availableWords.length)];
};

const WordChallenge = () => {
  const [gameMode, setGameMode] = useState<"daily" | "practice">("daily");
  const [gameState, setGameState] = useState<"idle" | "playing" | "finished">("idle");
  const [currentWord, setCurrentWord] = useState("");
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
  
  const [highScore, setHighScore] = useState(() => {
    const saved = localStorage.getItem("wordChallengeHighScore");
    return saved ? parseInt(saved, 10) : 0;
  });
  
  const [dailyStats, setDailyStats] = useState<DailyStats>(() => {
    const saved = localStorage.getItem("wordChallengeDailyStats");
    if (saved) {
      const stats = JSON.parse(saved) as DailyStats;
      const today = getTodayDateString();
      
      // Reset if it's a new day
      if (stats.lastPlayedDate !== today) {
        const yesterday = new Date();
        yesterday.setDate(yesterday.getDate() - 1);
        const yesterdayString = `${yesterday.getFullYear()}-${yesterday.getMonth() + 1}-${yesterday.getDate()}`;
        
        // Check if streak should continue or reset
        const newStreak = stats.lastPlayedDate === yesterdayString ? stats.currentStreak : 0;
        
        return {
          ...stats,
          completedToday: false,
          todayScore: 0,
          todayWordsCompleted: 0,
          currentStreak: newStreak
        };
      }
      return stats;
    }
    return {
      lastPlayedDate: "",
      dailyHighScore: 0,
      currentStreak: 0,
      longestStreak: 0,
      totalDaysPlayed: 0,
      completedToday: false,
      todayScore: 0,
      todayWordsCompleted: 0
    };
  });
  
  const inputRef = useRef<HTMLInputElement>(null);
  
  const dailyWords = useMemo(() => getDailyWords(15), []);

  // Countdown timer for next daily challenge
  useEffect(() => {
    const timer = setInterval(() => {
      setTimeUntilReset(getTimeUntilMidnight());
    }, 1000);
    return () => clearInterval(timer);
  }, []);

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
    
    if (mode === "daily") {
      setDailyWordIndex(0);
      setCurrentWord(dailyWords[0]);
      setUsedWords(new Set([dailyWords[0]]));
    } else {
      setUsedWords(new Set());
      const firstWord = getRandomWord(new Set());
      setCurrentWord(firstWord);
      setUsedWords(new Set([firstWord]));
    }
    
    setTimeout(() => inputRef.current?.focus(), 100);
  }, [dailyWords]);

  const nextWord = useCallback(() => {
    if (gameMode === "daily") {
      const nextIndex = dailyWordIndex + 1;
      if (nextIndex < dailyWords.length) {
        setDailyWordIndex(nextIndex);
        setCurrentWord(dailyWords[nextIndex]);
      } else {
        // All daily words completed!
        setGameState("finished");
        return;
      }
    } else {
      const newWord = getRandomWord(usedWords);
      setCurrentWord(newWord);
      setUsedWords(prev => new Set([...prev, newWord]));
    }
    setUserInput("");
    setIsCorrect(null);
    inputRef.current?.focus();
  }, [gameMode, dailyWordIndex, dailyWords, usedWords]);

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value.toLowerCase();
    setUserInput(value);

    if (value === currentWord.toLowerCase()) {
      setIsCorrect(true);
      const streakBonus = Math.floor(streak / 3) * 5;
      const wordScore = 10 + streakBonus;
      setScore(prev => prev + wordScore);
      setWordsCompleted(prev => prev + 1);
      setStreak(prev => {
        const newStreak = prev + 1;
        if (newStreak > bestStreak) setBestStreak(newStreak);
        return newStreak;
      });
      
      if (streak > 0 && streak % 5 === 4) {
        toast.success(`🔥 ${streak + 1} word streak! +${streakBonus + 5} bonus!`);
      }
      
      setTimeout(nextWord, 300);
    } else if (currentWord.toLowerCase().startsWith(value)) {
      setIsCorrect(null);
    } else {
      setIsCorrect(false);
      setStreak(0);
    }
  };

  const skipWord = () => {
    setStreak(0);
    nextWord();
  };

  useEffect(() => {
    if (gameState !== "playing") return;

    const timer = setInterval(() => {
      setTimeLeft(prev => {
        if (prev <= 1) {
          setGameState("finished");
          return 0;
        }
        return prev - 1;
      });
    }, 1000);

    return () => clearInterval(timer);
  }, [gameState]);

  // Save scores when game ends
  useEffect(() => {
    if (gameState === "finished") {
      if (gameMode === "practice" && score > highScore) {
        setHighScore(score);
        localStorage.setItem("wordChallengeHighScore", score.toString());
        toast.success("🎉 New Practice High Score!");
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
        
        if (newStats.currentStreak > 1) {
          toast.success(`🔥 ${newStats.currentStreak} day streak! Keep it up!`);
        }
      }
    }
  }, [gameState, score, highScore, gameMode, dailyStats, wordsCompleted]);

  const getPerformanceMessage = () => {
    if (wordsCompleted >= 20) return { title: "Academic Prodigy! 🎓", message: "You have exceptional academic vocabulary. Imagine what we could do together!" };
    if (wordsCompleted >= 15) return { title: "Research Expert! 📚", message: "Impressive skills! Our expert writers match this caliber." };
    if (wordsCompleted >= 10) return { title: "Scholar in Progress! ✨", message: "Great effort! Let us help elevate your research further." };
    if (wordsCompleted >= 5) return { title: "Aspiring Researcher! 📖", message: "Good start! Our team can help you master academic writing." };
    return { title: "Keep Practicing! 💪", message: "Academic writing takes time to master. Let our experts guide you!" };
  };

  return (
    <div className="min-h-screen bg-background">
      <SEOHead
        title="Academic Word Challenge Game"
        description="Test your academic vocabulary with our fun word typing challenge. Play the daily challenge or practice mode. How many research terms can you type in 60 seconds?"
        url="https://researchready.com/game"
      />
      <Header />
      
      <main className="pt-24 pb-16">
        <div className="container mx-auto px-4 max-w-4xl">
          {/* Header */}
          <div className="text-center mb-8 animate-fade-in">
            <div className="inline-flex items-center gap-2 px-4 py-2 bg-accent/10 text-accent rounded-full text-sm font-semibold mb-4">
              <Brain className="w-4 h-4" />
              Test Your Academic Vocabulary
            </div>
            <h1 className="font-playfair text-4xl md:text-5xl font-bold text-foreground mb-4">
              Research Word <span className="text-accent">Challenge</span>
            </h1>
            <p className="text-muted-foreground text-lg max-w-2xl mx-auto">
              Type academic terms as fast as you can! Build streaks for bonus points and prove your scholarly prowess.
            </p>
          </div>

          {/* Game Area */}
          {gameState === "idle" && (
            <div className="space-y-6 animate-scale-in">
              {/* Daily Stats Banner */}
              {dailyStats.currentStreak > 0 && (
                <Card className="p-4 bg-gradient-to-r from-orange-500/10 to-accent/10 border-orange-500/20">
                  <div className="flex items-center justify-center gap-6 flex-wrap">
                    <div className="flex items-center gap-2">
                      <Flame className="w-5 h-5 text-orange-500" />
                      <span className="font-semibold text-foreground">{dailyStats.currentStreak} Day Streak!</span>
                    </div>
                    <div className="text-sm text-muted-foreground">
                      Longest: {dailyStats.longestStreak} days • Total: {dailyStats.totalDaysPlayed} days played
                    </div>
                  </div>
                </Card>
              )}

              <Tabs defaultValue="daily" className="w-full">
                <TabsList className="grid w-full grid-cols-2 mb-6">
                  <TabsTrigger value="daily" className="flex items-center gap-2">
                    <Calendar className="w-4 h-4" />
                    Daily Challenge
                  </TabsTrigger>
                  <TabsTrigger value="practice" className="flex items-center gap-2">
                    <Target className="w-4 h-4" />
                    Practice Mode
                  </TabsTrigger>
                </TabsList>

                <TabsContent value="daily">
                  <Card className="p-8 md:p-12 text-center bg-card border-border">
                    <div className="space-y-6">
                      {dailyStats.completedToday ? (
                        <>
                          <div className="w-24 h-24 mx-auto bg-accent/20 rounded-full flex items-center justify-center">
                            <CheckCircle className="w-12 h-12 text-accent" />
                          </div>
                          <div>
                            <h2 className="font-playfair text-2xl font-bold text-foreground mb-2">
                              Today's Challenge Complete!
                            </h2>
                            <p className="text-muted-foreground max-w-md mx-auto">
                              Great job! You scored <span className="font-bold text-accent">{dailyStats.todayScore} points</span> and 
                              typed <span className="font-bold">{dailyStats.todayWordsCompleted} words</span>.
                            </p>
                          </div>
                          
                          <div className="p-4 bg-secondary/50 rounded-lg max-w-xs mx-auto">
                            <p className="text-sm text-muted-foreground mb-1">Next challenge in</p>
                            <p className="text-2xl font-bold font-mono text-accent">{formatTimeRemaining(timeUntilReset)}</p>
                          </div>

                          <div className="grid grid-cols-3 gap-4 max-w-md mx-auto">
                            <div className="p-4 bg-secondary/50 rounded-lg">
                              <Flame className="w-6 h-6 text-orange-500 mx-auto mb-2" />
                              <p className="text-lg font-bold text-foreground">{dailyStats.currentStreak}</p>
                              <p className="text-xs text-muted-foreground">Day Streak</p>
                            </div>
                            <div className="p-4 bg-secondary/50 rounded-lg">
                              <Trophy className="w-6 h-6 text-accent mx-auto mb-2" />
                              <p className="text-lg font-bold text-foreground">{dailyStats.dailyHighScore}</p>
                              <p className="text-xs text-muted-foreground">Best Daily</p>
                            </div>
                            <div className="p-4 bg-secondary/50 rounded-lg">
                              <Calendar className="w-6 h-6 text-primary mx-auto mb-2" />
                              <p className="text-lg font-bold text-foreground">{dailyStats.totalDaysPlayed}</p>
                              <p className="text-xs text-muted-foreground">Days Played</p>
                            </div>
                          </div>

                          <p className="text-sm text-muted-foreground">
                            Try Practice Mode to keep improving while you wait!
                          </p>
                        </>
                      ) : (
                        <>
                          <div className="w-24 h-24 mx-auto bg-accent/20 rounded-full flex items-center justify-center">
                            <Calendar className="w-12 h-12 text-accent" />
                          </div>
                          <div>
                            <h2 className="font-playfair text-2xl font-bold text-foreground mb-2">
                              Today's Daily Challenge
                            </h2>
                            <p className="text-muted-foreground max-w-md mx-auto">
                              Same {dailyWords.length} words for everyone today. Complete them all in 60 seconds 
                              to build your streak!
                            </p>
                          </div>
                          
                          <div className="grid grid-cols-3 gap-4 max-w-md mx-auto">
                            <div className="p-4 bg-secondary/50 rounded-lg">
                              <Clock className="w-6 h-6 text-accent mx-auto mb-2" />
                              <p className="text-sm text-muted-foreground">60 Seconds</p>
                            </div>
                            <div className="p-4 bg-secondary/50 rounded-lg">
                              <Target className="w-6 h-6 text-accent mx-auto mb-2" />
                              <p className="text-sm text-muted-foreground">{dailyWords.length} Words</p>
                            </div>
                            <div className="p-4 bg-secondary/50 rounded-lg">
                              <Flame className="w-6 h-6 text-orange-500 mx-auto mb-2" />
                              <p className="text-sm text-muted-foreground">
                                {dailyStats.currentStreak > 0 ? `${dailyStats.currentStreak} Day Streak` : "Start Streak"}
                              </p>
                            </div>
                          </div>

                          <Button onClick={() => startGame("daily")} variant="gold" size="xl" className="group">
                            Start Daily Challenge
                            <Sparkles className="w-5 h-5 ml-2 group-hover:rotate-12 transition-transform" />
                          </Button>

                          <p className="text-xs text-muted-foreground">
                            Resets in {formatTimeRemaining(timeUntilReset)}
                          </p>
                        </>
                      )}
                    </div>
                  </Card>
                </TabsContent>

                <TabsContent value="practice">
                  <Card className="p-8 md:p-12 text-center bg-card border-border">
                    <div className="space-y-6">
                      <div className="w-24 h-24 mx-auto bg-accent/20 rounded-full flex items-center justify-center">
                        <Target className="w-12 h-12 text-accent" />
                      </div>
                      <div>
                        <h2 className="font-playfair text-2xl font-bold text-foreground mb-2">Practice Mode</h2>
                        <p className="text-muted-foreground max-w-md mx-auto">
                          Unlimited plays with random words. Perfect for warming up or improving your skills!
                        </p>
                      </div>
                      
                      <div className="grid grid-cols-3 gap-4 max-w-md mx-auto">
                        <div className="p-4 bg-secondary/50 rounded-lg">
                          <Clock className="w-6 h-6 text-accent mx-auto mb-2" />
                          <p className="text-sm text-muted-foreground">60 Seconds</p>
                        </div>
                        <div className="p-4 bg-secondary/50 rounded-lg">
                          <Zap className="w-6 h-6 text-accent mx-auto mb-2" />
                          <p className="text-sm text-muted-foreground">Streak Bonus</p>
                        </div>
                        <div className="p-4 bg-secondary/50 rounded-lg">
                          <Trophy className="w-6 h-6 text-accent mx-auto mb-2" />
                          <p className="text-sm text-muted-foreground">High Score: {highScore}</p>
                        </div>
                      </div>

                      <Button onClick={() => startGame("practice")} variant="gold" size="xl" className="group">
                        Start Practice
                        <Sparkles className="w-5 h-5 ml-2 group-hover:rotate-12 transition-transform" />
                      </Button>
                    </div>
                  </Card>
                </TabsContent>
              </Tabs>
            </div>
          )}

          {gameState === "playing" && (
            <div className="space-y-6 animate-fade-in">
              {/* Mode Indicator */}
              <div className="text-center">
                <span className={`inline-flex items-center gap-2 px-3 py-1 rounded-full text-sm font-medium ${
                  gameMode === "daily" 
                    ? "bg-accent/20 text-accent" 
                    : "bg-secondary text-muted-foreground"
                }`}>
                  {gameMode === "daily" ? (
                    <>
                      <Calendar className="w-4 h-4" />
                      Daily Challenge • Word {dailyWordIndex + 1}/{dailyWords.length}
                    </>
                  ) : (
                    <>
                      <Target className="w-4 h-4" />
                      Practice Mode
                    </>
                  )}
                </span>
              </div>

              {/* Stats Bar */}
              <div className="grid grid-cols-4 gap-4">
                <Card className="p-4 text-center bg-card border-border">
                  <div className="flex items-center justify-center gap-2 text-accent mb-1">
                    <Clock className="w-4 h-4" />
                    <span className="text-2xl font-bold">{timeLeft}</span>
                  </div>
                  <p className="text-xs text-muted-foreground">Seconds</p>
                </Card>
                <Card className="p-4 text-center bg-card border-border">
                  <div className="flex items-center justify-center gap-2 text-primary mb-1">
                    <Trophy className="w-4 h-4" />
                    <span className="text-2xl font-bold">{score}</span>
                  </div>
                  <p className="text-xs text-muted-foreground">Score</p>
                </Card>
                <Card className="p-4 text-center bg-card border-border">
                  <div className="flex items-center justify-center gap-2 text-foreground mb-1">
                    <Target className="w-4 h-4" />
                    <span className="text-2xl font-bold">{wordsCompleted}</span>
                  </div>
                  <p className="text-xs text-muted-foreground">Words</p>
                </Card>
                <Card className="p-4 text-center bg-card border-border">
                  <div className="flex items-center justify-center gap-2 text-orange-500 mb-1">
                    <Zap className="w-4 h-4" />
                    <span className="text-2xl font-bold">{streak}</span>
                  </div>
                  <p className="text-xs text-muted-foreground">Streak</p>
                </Card>
              </div>

              {/* Progress */}
              <Progress value={(timeLeft / 60) * 100} className="h-2" />

              {/* Word Display */}
              <Card className="p-8 md:p-12 text-center bg-gradient-to-br from-card to-secondary/20 border-border">
                <p className="text-sm text-muted-foreground mb-4">Type this word:</p>
                <div className="mb-8">
                  <span className="font-playfair text-4xl md:text-6xl font-bold text-foreground tracking-wider">
                    {currentWord.split("").map((char, i) => (
                      <span
                        key={i}
                        className={
                          i < userInput.length
                            ? userInput[i] === char
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
                
                <div className="max-w-md mx-auto space-y-4">
                  <Input
                    ref={inputRef}
                    type="text"
                    value={userInput}
                    onChange={handleInputChange}
                    placeholder="Start typing..."
                    className={`text-center text-2xl h-16 font-mono transition-colors ${
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
                  <Button onClick={skipWord} variant="ghost" size="sm" className="text-muted-foreground">
                    Skip Word (breaks streak)
                  </Button>
                </div>
              </Card>

              {/* Streak Indicator */}
              {streak >= 3 && (
                <div className="text-center animate-fade-in">
                  <span className="inline-flex items-center gap-2 px-4 py-2 bg-orange-500/20 text-orange-500 rounded-full text-sm font-semibold">
                    <Zap className="w-4 h-4" />
                    {streak} Word Streak! +{Math.floor(streak / 3) * 5} Bonus Points
                  </span>
                </div>
              )}
            </div>
          )}

          {gameState === "finished" && (
            <div className="space-y-8 animate-scale-in">
              <Card className="p-8 md:p-12 text-center bg-card border-border">
                <div className="space-y-6">
                  <div className="w-24 h-24 mx-auto bg-accent/20 rounded-full flex items-center justify-center">
                    <Trophy className="w-12 h-12 text-accent" />
                  </div>
                  
                  <div>
                    {gameMode === "daily" && (
                      <span className="inline-flex items-center gap-2 px-3 py-1 mb-3 rounded-full text-sm font-medium bg-accent/20 text-accent">
                        <Calendar className="w-4 h-4" />
                        Daily Challenge Complete
                      </span>
                    )}
                    <h2 className="font-playfair text-3xl font-bold text-foreground mb-2">
                      {getPerformanceMessage().title}
                    </h2>
                    <p className="text-muted-foreground">
                      {getPerformanceMessage().message}
                    </p>
                  </div>

                  <div className="grid grid-cols-3 gap-6 max-w-lg mx-auto py-6 border-y border-border">
                    <div>
                      <p className="text-3xl font-bold text-accent">{score}</p>
                      <p className="text-sm text-muted-foreground">Final Score</p>
                    </div>
                    <div>
                      <p className="text-3xl font-bold text-foreground">{wordsCompleted}</p>
                      <p className="text-sm text-muted-foreground">Words Typed</p>
                    </div>
                    <div>
                      <p className="text-3xl font-bold text-orange-500">{bestStreak}</p>
                      <p className="text-sm text-muted-foreground">Best Streak</p>
                    </div>
                  </div>

                  {gameMode === "daily" && dailyStats.currentStreak > 1 && (
                    <div className="inline-flex items-center gap-2 px-4 py-2 bg-orange-500/20 text-orange-500 rounded-full font-semibold">
                      <Flame className="w-4 h-4" />
                      {dailyStats.currentStreak} Day Streak! 🔥
                    </div>
                  )}

                  {gameMode === "practice" && score >= highScore && score > 0 && (
                    <div className="inline-flex items-center gap-2 px-4 py-2 bg-accent/20 text-accent rounded-full font-semibold">
                      <Sparkles className="w-4 h-4" />
                      New High Score!
                    </div>
                  )}

                  <div className="flex flex-col sm:flex-row gap-4 justify-center">
                    {gameMode === "daily" ? (
                      <Button onClick={() => startGame("practice")} variant="outline" size="lg" className="group">
                        <Target className="w-4 h-4 mr-2" />
                        Try Practice Mode
                      </Button>
                    ) : (
                      <Button onClick={() => startGame("practice")} variant="outline" size="lg" className="group">
                        <RotateCcw className="w-4 h-4 mr-2" />
                        Play Again
                      </Button>
                    )}
                    <Button variant="gold" size="lg" className="group" asChild>
                      <a href="https://wa.me/2349022282963?text=Hello%2C%20I%20just%20played%20your%20word%20challenge%20game%20and%20I%27m%20interested%20in%20your%20academic%20writing%20services!" target="_blank" rel="noopener noreferrer">
                        Get Expert Help
                        <ArrowRight className="w-4 h-4 ml-2 group-hover:translate-x-1 transition-transform" />
                      </a>
                    </Button>
                  </div>

                  {gameMode === "daily" && (
                    <p className="text-sm text-muted-foreground">
                      Next daily challenge in {formatTimeRemaining(timeUntilReset)}
                    </p>
                  )}
                </div>
              </Card>

              {/* CTA Section */}
              <Card className="p-8 bg-gradient-to-br from-primary to-primary/80 text-primary-foreground border-0">
                <div className="text-center space-y-4">
                  <h3 className="font-playfair text-2xl font-bold">
                    Ready to Master Academic Writing?
                  </h3>
                  <p className="text-primary-foreground/80 max-w-lg mx-auto">
                    While word games are fun, crafting a dissertation or thesis requires expertise. 
                    Our professional writers are here to help you succeed.
                  </p>
                  <div className="flex flex-wrap gap-4 justify-center pt-2">
                    <Button variant="secondary" size="lg" asChild>
                      <a href="/#services">View Our Services</a>
                    </Button>
                    <Button variant="outline" size="lg" className="bg-transparent border-primary-foreground/30 text-primary-foreground hover:bg-primary-foreground/10" asChild>
                      <a href="/about">About Research Ready</a>
                    </Button>
                  </div>
                </div>
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
