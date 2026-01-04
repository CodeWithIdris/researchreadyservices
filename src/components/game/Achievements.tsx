import { Badge } from "@/components/ui/badge";
import { Card } from "@/components/ui/card";
import { Trophy, Flame, Target, Zap, Star, Crown, Medal, Award, Sparkles, Brain } from "lucide-react";

export interface Achievement {
  id: string;
  name: string;
  description: string;
  icon: React.ReactNode;
  unlocked: boolean;
  progress?: number;
  total?: number;
}

interface AchievementsProps {
  wordsCompleted: number;
  bestStreak: number;
  totalGamesPlayed: number;
  dailyStreak: number;
  highScore: number;
}

export const getAchievements = ({
  wordsCompleted,
  bestStreak,
  totalGamesPlayed,
  dailyStreak,
  highScore,
}: AchievementsProps): Achievement[] => {
  return [
    {
      id: "first_word",
      name: "First Steps",
      description: "Type your first word correctly",
      icon: <Star className="w-5 h-5" />,
      unlocked: wordsCompleted >= 1,
    },
    {
      id: "word_warrior",
      name: "Word Warrior",
      description: "Type 50 words correctly",
      icon: <Target className="w-5 h-5" />,
      unlocked: wordsCompleted >= 50,
      progress: Math.min(wordsCompleted, 50),
      total: 50,
    },
    {
      id: "vocabulary_master",
      name: "Vocabulary Master",
      description: "Type 200 words correctly",
      icon: <Brain className="w-5 h-5" />,
      unlocked: wordsCompleted >= 200,
      progress: Math.min(wordsCompleted, 200),
      total: 200,
    },
    {
      id: "streak_starter",
      name: "Streak Starter",
      description: "Get a 5-word streak",
      icon: <Zap className="w-5 h-5" />,
      unlocked: bestStreak >= 5,
    },
    {
      id: "on_fire",
      name: "On Fire!",
      description: "Get a 10-word streak",
      icon: <Flame className="w-5 h-5" />,
      unlocked: bestStreak >= 10,
      progress: Math.min(bestStreak, 10),
      total: 10,
    },
    {
      id: "unstoppable",
      name: "Unstoppable",
      description: "Get a 15-word streak",
      icon: <Crown className="w-5 h-5" />,
      unlocked: bestStreak >= 15,
      progress: Math.min(bestStreak, 15),
      total: 15,
    },
    {
      id: "dedicated",
      name: "Dedicated Player",
      description: "Play 10 games",
      icon: <Medal className="w-5 h-5" />,
      unlocked: totalGamesPlayed >= 10,
      progress: Math.min(totalGamesPlayed, 10),
      total: 10,
    },
    {
      id: "daily_devotee",
      name: "Daily Devotee",
      description: "Play for 7 days in a row",
      icon: <Award className="w-5 h-5" />,
      unlocked: dailyStreak >= 7,
      progress: Math.min(dailyStreak, 7),
      total: 7,
    },
    {
      id: "century_club",
      name: "Century Club",
      description: "Score 100+ points in a game",
      icon: <Trophy className="w-5 h-5" />,
      unlocked: highScore >= 100,
    },
    {
      id: "elite_scorer",
      name: "Elite Scorer",
      description: "Score 200+ points in a game",
      icon: <Sparkles className="w-5 h-5" />,
      unlocked: highScore >= 200,
    },
  ];
};

interface AchievementsBadgeDisplayProps {
  achievements: Achievement[];
  showAll?: boolean;
}

export const AchievementsBadgeDisplay = ({ achievements, showAll = false }: AchievementsBadgeDisplayProps) => {
  const displayAchievements = showAll 
    ? achievements 
    : achievements.filter(a => a.unlocked);

  if (displayAchievements.length === 0) {
    return (
      <p className="text-sm text-muted-foreground text-center py-4">
        No achievements unlocked yet. Keep playing!
      </p>
    );
  }

  return (
    <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-5 gap-3">
      {displayAchievements.map((achievement) => (
        <Card
          key={achievement.id}
          className={`p-3 text-center transition-all ${
            achievement.unlocked
              ? "bg-accent/10 border-accent/30"
              : "bg-muted/50 border-border opacity-50"
          }`}
        >
          <div
            className={`w-10 h-10 mx-auto rounded-full flex items-center justify-center mb-2 ${
              achievement.unlocked ? "bg-accent/20 text-accent" : "bg-muted text-muted-foreground"
            }`}
          >
            {achievement.icon}
          </div>
          <p className="text-xs font-semibold text-foreground truncate">{achievement.name}</p>
          {achievement.progress !== undefined && !achievement.unlocked && (
            <p className="text-xs text-muted-foreground">
              {achievement.progress}/{achievement.total}
            </p>
          )}
        </Card>
      ))}
    </div>
  );
};

interface NewAchievementToastProps {
  achievement: Achievement;
}

export const NewAchievementToast = ({ achievement }: NewAchievementToastProps) => {
  return (
    <div className="flex items-center gap-3">
      <div className="w-10 h-10 bg-accent/20 rounded-full flex items-center justify-center text-accent">
        {achievement.icon}
      </div>
      <div>
        <p className="font-semibold text-foreground">Achievement Unlocked!</p>
        <p className="text-sm text-muted-foreground">{achievement.name}</p>
      </div>
    </div>
  );
};
