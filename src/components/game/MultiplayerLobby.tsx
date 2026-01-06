import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { Users, Copy, Check, Loader2, Play, Crown, UserPlus } from "lucide-react";
import { supabase } from "@/integrations/supabase/client";
import { toast } from "sonner";

interface Player {
  id: string;
  player_id: string;
  player_name: string;
  is_ready: boolean;
  score: number;
}

interface Room {
  id: string;
  room_code: string;
  host_player_id: string;
  host_player_name: string;
  status: string;
  max_players: number;
}

interface MultiplayerLobbyProps {
  onGameStart: (roomId: string, players: Player[]) => void;
  onBack: () => void;
}

const generateRoomCode = () => {
  const chars = 'ABCDEFGHJKLMNPQRSTUVWXYZ23456789';
  let code = '';
  for (let i = 0; i < 6; i++) {
    code += chars.charAt(Math.floor(Math.random() * chars.length));
  }
  return code;
};

const getPlayerId = () => {
  let id = localStorage.getItem('game_player_id');
  if (!id) {
    id = `player_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;
    localStorage.setItem('game_player_id', id);
  }
  return id;
};

export const MultiplayerLobby = ({ onGameStart, onBack }: MultiplayerLobbyProps) => {
  const [mode, setMode] = useState<"menu" | "create" | "join" | "lobby">("menu");
  const [playerName, setPlayerName] = useState(() => localStorage.getItem('game_player_name') || '');
  const [roomCode, setRoomCode] = useState('');
  const [room, setRoom] = useState<Room | null>(null);
  const [players, setPlayers] = useState<Player[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [copied, setCopied] = useState(false);
  const [isReady, setIsReady] = useState(false);
  
  const playerId = getPlayerId();

  useEffect(() => {
    if (playerName) {
      localStorage.setItem('game_player_name', playerName);
    }
  }, [playerName]);

  // Subscribe to room updates
  useEffect(() => {
    if (!room) return;

    const roomChannel = supabase
      .channel(`room_${room.id}`)
      .on(
        'postgres_changes',
        {
          event: '*',
          schema: 'public',
          table: 'game_room_players',
          filter: `room_id=eq.${room.id}`,
        },
        () => {
          fetchPlayers(room.id);
        }
      )
      .on(
        'postgres_changes',
        {
          event: 'UPDATE',
          schema: 'public',
          table: 'game_rooms',
          filter: `id=eq.${room.id}`,
        },
        (payload) => {
          const updatedRoom = payload.new as Room;
          setRoom(updatedRoom);
          if (updatedRoom.status === 'playing') {
            onGameStart(room.id, players);
          }
        }
      )
      .subscribe();

    fetchPlayers(room.id);

    return () => {
      supabase.removeChannel(roomChannel);
    };
  }, [room?.id]);

  const fetchPlayers = async (roomId: string) => {
    const { data, error } = await supabase
      .from('game_room_players')
      .select('*')
      .eq('room_id', roomId)
      .order('joined_at', { ascending: true });
    
    if (!error && data) {
      setPlayers(data as Player[]);
    }
  };

  const createRoom = async () => {
    if (!playerName.trim()) {
      toast.error('Please enter your name');
      return;
    }

    setIsLoading(true);
    try {
      const code = generateRoomCode();
      
      const { data: roomData, error: roomError } = await supabase
        .from('game_rooms')
        .insert({
          room_code: code,
          host_player_id: playerId,
          host_player_name: playerName.trim(),
          status: 'waiting',
          max_players: 4,
        })
        .select()
        .single();

      if (roomError) throw roomError;

      // Join as host
      const { error: joinError } = await supabase
        .from('game_room_players')
        .insert({
          room_id: roomData.id,
          player_id: playerId,
          player_name: playerName.trim(),
          is_ready: false,
        });

      if (joinError) throw joinError;

      setRoom(roomData as Room);
      setMode('lobby');
      toast.success('Room created!');
    } catch (error) {
      console.error('Error creating room:', error);
      toast.error('Failed to create room');
    } finally {
      setIsLoading(false);
    }
  };

  const joinRoom = async () => {
    if (!playerName.trim()) {
      toast.error('Please enter your name');
      return;
    }
    if (!roomCode.trim()) {
      toast.error('Please enter a room code');
      return;
    }

    setIsLoading(true);
    try {
      const { data: roomData, error: roomError } = await supabase
        .from('game_rooms')
        .select('*')
        .eq('room_code', roomCode.toUpperCase().trim())
        .eq('status', 'waiting')
        .single();

      if (roomError || !roomData) {
        toast.error('Room not found or game already started');
        setIsLoading(false);
        return;
      }

      // Check if room is full
      const { data: existingPlayers } = await supabase
        .from('game_room_players')
        .select('id')
        .eq('room_id', roomData.id);

      if (existingPlayers && existingPlayers.length >= roomData.max_players) {
        toast.error('Room is full');
        setIsLoading(false);
        return;
      }

      // Join room
      const { error: joinError } = await supabase
        .from('game_room_players')
        .insert({
          room_id: roomData.id,
          player_id: playerId,
          player_name: playerName.trim(),
          is_ready: false,
        });

      if (joinError) {
        if (joinError.code === '23505') {
          toast.error('You are already in this room');
        } else {
          throw joinError;
        }
        setIsLoading(false);
        return;
      }

      setRoom(roomData as Room);
      setMode('lobby');
      toast.success('Joined room!');
    } catch (error) {
      console.error('Error joining room:', error);
      toast.error('Failed to join room');
    } finally {
      setIsLoading(false);
    }
  };

  const toggleReady = async () => {
    if (!room) return;

    const newReady = !isReady;
    setIsReady(newReady);

    await supabase
      .from('game_room_players')
      .update({ is_ready: newReady })
      .eq('room_id', room.id)
      .eq('player_id', playerId);
  };

  const startGame = async () => {
    if (!room) return;
    
    const allReady = players.every(p => p.is_ready || p.player_id === room.host_player_id);
    if (!allReady) {
      toast.error('All players must be ready');
      return;
    }

    if (players.length < 2) {
      toast.error('Need at least 2 players');
      return;
    }

    await supabase
      .from('game_rooms')
      .update({ status: 'playing', started_at: new Date().toISOString() })
      .eq('id', room.id);
  };

  const leaveRoom = async () => {
    if (!room) return;

    await supabase
      .from('game_room_players')
      .delete()
      .eq('room_id', room.id)
      .eq('player_id', playerId);

    // If host leaves, delete the room
    if (room.host_player_id === playerId) {
      await supabase.from('game_rooms').delete().eq('id', room.id);
    }

    setRoom(null);
    setMode('menu');
    setIsReady(false);
  };

  const copyRoomCode = () => {
    if (room) {
      navigator.clipboard.writeText(room.room_code);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
      toast.success('Room code copied!');
    }
  };

  const isHost = room?.host_player_id === playerId;

  if (mode === 'menu') {
    return (
      <Card className="p-8 text-center bg-card border-border max-w-md mx-auto">
        <Users className="w-12 h-12 mx-auto mb-4 text-accent" />
        <h2 className="font-playfair text-2xl font-bold mb-2">Multiplayer</h2>
        <p className="text-muted-foreground mb-6">
          Compete with friends in real-time!
        </p>

        <div className="space-y-4">
          <Input
            placeholder="Enter your name"
            value={playerName}
            onChange={(e) => setPlayerName(e.target.value)}
            maxLength={20}
            className="text-center"
          />

          <Button
            onClick={() => setMode('create')}
            className="w-full"
            variant="default"
          >
            <Crown className="w-4 h-4 mr-2" />
            Create Room
          </Button>

          <Button
            onClick={() => setMode('join')}
            variant="outline"
            className="w-full"
          >
            <UserPlus className="w-4 h-4 mr-2" />
            Join Room
          </Button>

          <Button onClick={onBack} variant="ghost" className="w-full">
            Back
          </Button>
        </div>
      </Card>
    );
  }

  if (mode === 'create') {
    return (
      <Card className="p-8 text-center bg-card border-border max-w-md mx-auto">
        <Crown className="w-12 h-12 mx-auto mb-4 text-accent" />
        <h2 className="font-playfair text-2xl font-bold mb-6">Create Room</h2>

        <div className="space-y-4">
          <Input
            placeholder="Your name"
            value={playerName}
            onChange={(e) => setPlayerName(e.target.value)}
            maxLength={20}
          />

          <Button
            onClick={createRoom}
            disabled={isLoading || !playerName.trim()}
            className="w-full"
          >
            {isLoading ? (
              <Loader2 className="w-4 h-4 mr-2 animate-spin" />
            ) : (
              <Play className="w-4 h-4 mr-2" />
            )}
            Create Room
          </Button>

          <Button onClick={() => setMode('menu')} variant="ghost" className="w-full">
            Back
          </Button>
        </div>
      </Card>
    );
  }

  if (mode === 'join') {
    return (
      <Card className="p-8 text-center bg-card border-border max-w-md mx-auto">
        <UserPlus className="w-12 h-12 mx-auto mb-4 text-accent" />
        <h2 className="font-playfair text-2xl font-bold mb-6">Join Room</h2>

        <div className="space-y-4">
          <Input
            placeholder="Your name"
            value={playerName}
            onChange={(e) => setPlayerName(e.target.value)}
            maxLength={20}
          />

          <Input
            placeholder="Room code (e.g., ABC123)"
            value={roomCode}
            onChange={(e) => setRoomCode(e.target.value.toUpperCase())}
            maxLength={6}
            className="text-center font-mono text-lg tracking-widest"
          />

          <Button
            onClick={joinRoom}
            disabled={isLoading || !playerName.trim() || !roomCode.trim()}
            className="w-full"
          >
            {isLoading ? (
              <Loader2 className="w-4 h-4 mr-2 animate-spin" />
            ) : (
              <Play className="w-4 h-4 mr-2" />
            )}
            Join Room
          </Button>

          <Button onClick={() => setMode('menu')} variant="ghost" className="w-full">
            Back
          </Button>
        </div>
      </Card>
    );
  }

  return (
    <Card className="p-8 bg-card border-border max-w-md mx-auto">
      <div className="text-center mb-6">
        <h2 className="font-playfair text-2xl font-bold mb-2">Game Lobby</h2>
        <div className="flex items-center justify-center gap-2">
          <span className="font-mono text-2xl tracking-widest bg-secondary px-4 py-2 rounded">
            {room?.room_code}
          </span>
          <Button
            variant="ghost"
            size="icon"
            onClick={copyRoomCode}
          >
            {copied ? <Check className="w-4 h-4 text-green-500" /> : <Copy className="w-4 h-4" />}
          </Button>
        </div>
        <p className="text-sm text-muted-foreground mt-2">
          Share this code with friends
        </p>
      </div>

      <div className="space-y-3 mb-6">
        <p className="text-sm font-semibold text-muted-foreground">
          Players ({players.length}/{room?.max_players})
        </p>
        {players.map((player) => (
          <div
            key={player.id}
            className="flex items-center justify-between p-3 bg-secondary/50 rounded-lg"
          >
            <div className="flex items-center gap-2">
              {player.player_id === room?.host_player_id && (
                <Crown className="w-4 h-4 text-yellow-500" />
              )}
              <span className="font-medium">{player.player_name}</span>
              {player.player_id === playerId && (
                <Badge variant="outline" className="text-xs">You</Badge>
              )}
            </div>
            {player.is_ready ? (
              <Badge className="bg-green-500/20 text-green-500">Ready</Badge>
            ) : (
              <Badge variant="outline">Waiting</Badge>
            )}
          </div>
        ))}
      </div>

      <div className="space-y-3">
        {isHost ? (
          <Button
            onClick={startGame}
            disabled={players.length < 2 || !players.every(p => p.is_ready || p.player_id === room?.host_player_id)}
            className="w-full"
          >
            <Play className="w-4 h-4 mr-2" />
            Start Game
          </Button>
        ) : (
          <Button
            onClick={toggleReady}
            variant={isReady ? "outline" : "default"}
            className="w-full"
          >
            {isReady ? 'Cancel Ready' : 'Ready Up'}
          </Button>
        )}

        <Button onClick={leaveRoom} variant="ghost" className="w-full text-destructive">
          Leave Room
        </Button>
      </div>
    </Card>
  );
};
