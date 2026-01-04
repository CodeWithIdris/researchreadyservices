import { useState, useEffect } from "react";
import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Trophy, Medal, Award, Crown, RefreshCw, Globe } from "lucide-react";
import { supabase } from "@/integrations/supabase/client";

interface LeaderboardEntry {
  id: string;
  player_name: string;
  score: number;
  words_completed: number;
  best_streak: number;
  language: string;
  played_at: string;
}

interface LeaderboardProps {
  currentPlayerScore?: number;
  onClose?: () => void;
}

export const Leaderboard = ({ currentPlayerScore, onClose }: LeaderboardProps) => {
  const [entries, setEntries] = useState<LeaderboardEntry[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [filter, setFilter] = useState<"all" | "today">("all");

  const fetchLeaderboard = async () => {
    setIsLoading(true);
    try {
      let query = supabase
        .from("game_scores")
        .select("*")
        .order("score", { ascending: false })
        .limit(50);

      if (filter === "today") {
        const today = new Date();
        today.setHours(0, 0, 0, 0);
        query = query.gte("played_at", today.toISOString());
      }

      const { data, error } = await query;

      if (error) throw error;
      setEntries(data || []);
    } catch (error) {
      console.error("Error fetching leaderboard:", error);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchLeaderboard();

    // Subscribe to realtime updates
    const channel = supabase
      .channel("leaderboard_changes")
      .on(
        "postgres_changes",
        {
          event: "INSERT",
          schema: "public",
          table: "game_scores",
        },
        () => {
          fetchLeaderboard();
        }
      )
      .subscribe();

    return () => {
      supabase.removeChannel(channel);
    };
  }, [filter]);

  const getRankIcon = (rank: number) => {
    switch (rank) {
      case 1:
        return <Crown className="w-5 h-5 text-yellow-500" />;
      case 2:
        return <Medal className="w-5 h-5 text-gray-400" />;
      case 3:
        return <Award className="w-5 h-5 text-amber-600" />;
      default:
        return <span className="w-5 text-center text-muted-foreground font-mono">{rank}</span>;
    }
  };

  const languageFlags: Record<string, string> = {
    english: "🇬🇧",
    spanish: "🇪🇸",
    italian: "🇮🇹",
    yoruba: "🇳🇬",
    igbo: "🇳🇬",
    hausa: "🇳🇬",
    french: "🇫🇷",
    german: "🇩🇪",
    portuguese: "🇵🇹",
  };

  return (
    <Card className="p-6 bg-card border-border">
      <div className="flex items-center justify-between mb-4">
        <div className="flex items-center gap-2">
          <Globe className="w-5 h-5 text-accent" />
          <h3 className="font-playfair text-xl font-bold text-foreground">Global Leaderboard</h3>
        </div>
        <Button variant="ghost" size="icon" onClick={fetchLeaderboard} disabled={isLoading}>
          <RefreshCw className={`w-4 h-4 ${isLoading ? "animate-spin" : ""}`} />
        </Button>
      </div>

      <div className="flex gap-2 mb-4">
        <Button
          variant={filter === "all" ? "default" : "outline"}
          size="sm"
          onClick={() => setFilter("all")}
        >
          All Time
        </Button>
        <Button
          variant={filter === "today" ? "default" : "outline"}
          size="sm"
          onClick={() => setFilter("today")}
        >
          Today
        </Button>
      </div>

      <ScrollArea className="h-[400px]">
        {isLoading ? (
          <div className="flex items-center justify-center py-8">
            <RefreshCw className="w-6 h-6 animate-spin text-muted-foreground" />
          </div>
        ) : entries.length === 0 ? (
          <div className="text-center py-8 text-muted-foreground">
            <Trophy className="w-12 h-12 mx-auto mb-2 opacity-50" />
            <p>No scores yet. Be the first!</p>
          </div>
        ) : (
          <div className="space-y-2">
            {entries.map((entry, index) => (
              <div
                key={entry.id}
                className={`flex items-center gap-3 p-3 rounded-lg transition-colors ${
                  index < 3
                    ? "bg-accent/10 border border-accent/20"
                    : "bg-secondary/50 hover:bg-secondary"
                } ${
                  currentPlayerScore === entry.score ? "ring-2 ring-accent" : ""
                }`}
              >
                <div className="flex items-center justify-center w-8">
                  {getRankIcon(index + 1)}
                </div>
                <div className="flex-1 min-w-0">
                  <div className="flex items-center gap-2">
                    <p className="font-semibold text-foreground truncate">
                      {entry.player_name}
                    </p>
                    <span className="text-sm">{languageFlags[entry.language] || "🌐"}</span>
                  </div>
                  <p className="text-xs text-muted-foreground">
                    {entry.words_completed} words • {entry.best_streak} streak
                  </p>
                </div>
                <div className="text-right">
                  <p className="font-bold text-accent">{entry.score}</p>
                  <p className="text-xs text-muted-foreground">pts</p>
                </div>
              </div>
            ))}
          </div>
        )}
      </ScrollArea>
    </Card>
  );
};
