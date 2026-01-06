import { useCallback, useRef, useState } from 'react';

// Create audio context lazily
let audioContext: AudioContext | null = null;

const getAudioContext = () => {
  if (!audioContext) {
    audioContext = new (window.AudioContext || (window as any).webkitAudioContext)();
  }
  return audioContext;
};

// Sound generation functions using Web Audio API
const playTone = (frequency: number, duration: number, type: OscillatorType = 'sine', volume: number = 0.3) => {
  try {
    const ctx = getAudioContext();
    if (ctx.state === 'suspended') {
      ctx.resume();
    }
    
    const oscillator = ctx.createOscillator();
    const gainNode = ctx.createGain();
    
    oscillator.connect(gainNode);
    gainNode.connect(ctx.destination);
    
    oscillator.frequency.value = frequency;
    oscillator.type = type;
    
    gainNode.gain.setValueAtTime(volume, ctx.currentTime);
    gainNode.gain.exponentialRampToValueAtTime(0.01, ctx.currentTime + duration);
    
    oscillator.start(ctx.currentTime);
    oscillator.stop(ctx.currentTime + duration);
  } catch (error) {
    console.warn('Audio playback failed:', error);
  }
};

const playCorrectSound = () => {
  playTone(523.25, 0.1, 'sine', 0.2); // C5
  setTimeout(() => playTone(659.25, 0.1, 'sine', 0.2), 50); // E5
  setTimeout(() => playTone(783.99, 0.15, 'sine', 0.2), 100); // G5
};

const playWrongSound = () => {
  playTone(200, 0.15, 'sawtooth', 0.15);
  setTimeout(() => playTone(150, 0.2, 'sawtooth', 0.12), 100);
};

const playStreakSound = (streak: number) => {
  const baseFreq = 400 + (streak * 50);
  playTone(baseFreq, 0.1, 'sine', 0.25);
  setTimeout(() => playTone(baseFreq * 1.25, 0.1, 'sine', 0.25), 80);
  setTimeout(() => playTone(baseFreq * 1.5, 0.15, 'sine', 0.25), 160);
  setTimeout(() => playTone(baseFreq * 2, 0.2, 'sine', 0.3), 240);
};

const playGameStartSound = () => {
  const notes = [261.63, 329.63, 392.00, 523.25]; // C4, E4, G4, C5
  notes.forEach((freq, i) => {
    setTimeout(() => playTone(freq, 0.15, 'sine', 0.2), i * 100);
  });
};

const playGameEndSound = () => {
  const notes = [523.25, 659.25, 783.99, 1046.50]; // C5, E5, G5, C6
  notes.forEach((freq, i) => {
    setTimeout(() => playTone(freq, 0.2, 'triangle', 0.25), i * 150);
  });
};

const playTickSound = () => {
  playTone(800, 0.05, 'sine', 0.1);
};

const playCountdownSound = () => {
  playTone(440, 0.3, 'sine', 0.2); // A4
};

const playSkipSound = () => {
  playTone(300, 0.1, 'sine', 0.15);
  setTimeout(() => playTone(200, 0.15, 'sine', 0.12), 80);
};

export const useGameSounds = () => {
  const [soundEnabled, setSoundEnabled] = useState(() => {
    const saved = localStorage.getItem('gameSoundEnabled');
    return saved !== 'false';
  });

  const toggleSound = useCallback(() => {
    setSoundEnabled(prev => {
      const newValue = !prev;
      localStorage.setItem('gameSoundEnabled', String(newValue));
      if (newValue) {
        // Play a test sound when enabling
        playTone(440, 0.1, 'sine', 0.1);
      }
      return newValue;
    });
  }, []);

  const playCorrect = useCallback(() => {
    if (soundEnabled) playCorrectSound();
  }, [soundEnabled]);

  const playWrong = useCallback(() => {
    if (soundEnabled) playWrongSound();
  }, [soundEnabled]);

  const playStreak = useCallback((streak: number) => {
    if (soundEnabled) playStreakSound(streak);
  }, [soundEnabled]);

  const playStart = useCallback(() => {
    if (soundEnabled) playGameStartSound();
  }, [soundEnabled]);

  const playEnd = useCallback(() => {
    if (soundEnabled) playGameEndSound();
  }, [soundEnabled]);

  const playTick = useCallback(() => {
    if (soundEnabled) playTickSound();
  }, [soundEnabled]);

  const playCountdown = useCallback(() => {
    if (soundEnabled) playCountdownSound();
  }, [soundEnabled]);

  const playSkip = useCallback(() => {
    if (soundEnabled) playSkipSound();
  }, [soundEnabled]);

  return {
    soundEnabled,
    toggleSound,
    playCorrect,
    playWrong,
    playStreak,
    playStart,
    playEnd,
    playTick,
    playCountdown,
    playSkip,
  };
};
