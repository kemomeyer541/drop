import React, { useState, useEffect, useRef } from 'react';
import { Button } from './ui/button';
import { Input } from './ui/input';
import { Slider } from './ui/slider';
import { Card } from './ui/card';
import { Play, Pause, RotateCcw, Volume2 } from 'lucide-react';

interface MetronomePanelProps {
  currentBpm?: number;
  onBpmChange?: (bpm: number) => void;
}

export function MetronomePanel({ currentBpm = 120, onBpmChange }: MetronomePanelProps) {
  const [bpm, setBpm] = useState(currentBpm);
  const [isPlaying, setIsPlaying] = useState(false);
  const [volume, setVolume] = useState(0.7);
  const [tapTimes, setTapTimes] = useState<number[]>([]);
  const [lastTapTime, setLastTapTime] = useState(0);
  const [tapBpm, setTapBpm] = useState<number | null>(null);
  
  const audioContextRef = useRef<AudioContext | null>(null);
  const intervalRef = useRef<NodeJS.Timeout | null>(null);
  const tapTimeoutRef = useRef<NodeJS.Timeout | null>(null);

  // Initialize audio context
  useEffect(() => {
    if (typeof window !== 'undefined') {
      audioContextRef.current = new (window.AudioContext || (window as any).webkitAudioContext)();
    }
    
    return () => {
      if (audioContextRef.current) {
        audioContextRef.current.close();
      }
    };
  }, []);

  // Update BPM when currentBpm prop changes
  useEffect(() => {
    setBpm(currentBpm);
  }, [currentBpm]);

  // Metronome sound generation
  const playClick = (isAccent = false) => {
    if (!audioContextRef.current) return;

    const audioContext = audioContextRef.current;
    const oscillator = audioContext.createOscillator();
    const gainNode = audioContext.createGain();

    oscillator.connect(gainNode);
    gainNode.connect(audioContext.destination);

    // Different frequencies for accent and normal beats
    oscillator.frequency.setValueAtTime(isAccent ? 1000 : 800, audioContext.currentTime);
    oscillator.type = 'square';

    // Volume envelope
    gainNode.gain.setValueAtTime(0, audioContext.currentTime);
    gainNode.gain.linearRampToValueAtTime(volume * 0.3, audioContext.currentTime + 0.01);
    gainNode.gain.exponentialRampToValueAtTime(0.001, audioContext.currentTime + 0.1);

    oscillator.start(audioContext.currentTime);
    oscillator.stop(audioContext.currentTime + 0.1);
  };

  // Start/stop metronome
  const toggleMetronome = () => {
    if (isPlaying) {
      if (intervalRef.current) {
        clearInterval(intervalRef.current);
        intervalRef.current = null;
      }
      setIsPlaying(false);
    } else {
      const interval = 60000 / bpm; // milliseconds per beat
      let beatCount = 0;
      
      intervalRef.current = setInterval(() => {
        playClick(beatCount % 4 === 0); // Accent every 4th beat
        beatCount++;
      }, interval);
      
      setIsPlaying(true);
      playClick(true); // Play immediately
    }
  };

  // BPM change handler
  const handleBpmChange = (newBpm: number) => {
    setBpm(newBpm);
    if (onBpmChange) {
      onBpmChange(newBpm);
    }
    
    // Update project BPM in the main app
    if ((window as any).updateProjectBpm) {
      (window as any).updateProjectBpm(newBpm);
    }
    
    // If metronome is playing, restart with new BPM
    if (isPlaying) {
      if (intervalRef.current) {
        clearInterval(intervalRef.current);
      }
      
      const interval = 60000 / newBpm;
      let beatCount = 0;
      
      intervalRef.current = setInterval(() => {
        playClick(beatCount % 4 === 0);
        beatCount++;
      }, interval);
    }
  };

  // Tap tempo functionality
  const handleTap = () => {
    const now = Date.now();
    
    if (lastTapTime === 0) {
      setLastTapTime(now);
      setTapTimes([now]);
      return;
    }
    
    const timeDiff = now - lastTapTime;
    
    // Reset if too much time has passed (more than 3 seconds)
    if (timeDiff > 3000) {
      setTapTimes([now]);
      setLastTapTime(now);
      setTapBpm(null);
      return;
    }
    
    const newTapTimes = [...tapTimes, now].slice(-8); // Keep last 8 taps
    setTapTimes(newTapTimes);
    setLastTapTime(now);
    
    // Calculate BPM from tap intervals
    if (newTapTimes.length >= 2) {
      const intervals = [];
      for (let i = 1; i < newTapTimes.length; i++) {
        intervals.push(newTapTimes[i] - newTapTimes[i - 1]);
      }
      
      const averageInterval = intervals.reduce((a, b) => a + b, 0) / intervals.length;
      const calculatedBpm = Math.round(60000 / averageInterval);
      
      // Only accept reasonable BPM values
      if (calculatedBpm >= 60 && calculatedBpm <= 200) {
        setTapBpm(calculatedBpm);
      }
    }
    
    // Clear tap data after 3 seconds of inactivity
    if (tapTimeoutRef.current) {
      clearTimeout(tapTimeoutRef.current);
    }
    
    tapTimeoutRef.current = setTimeout(() => {
      setTapTimes([]);
      setLastTapTime(0);
      setTapBpm(null);
    }, 3000);
  };

  // Apply tap BPM
  const applyTapBpm = () => {
    if (tapBpm) {
      handleBpmChange(tapBpm);
      setTapTimes([]);
      setLastTapTime(0);
      setTapBpm(null);
    }
  };

  // Reset tap
  const resetTap = () => {
    setTapTimes([]);
    setLastTapTime(0);
    setTapBpm(null);
    if (tapTimeoutRef.current) {
      clearTimeout(tapTimeoutRef.current);
    }
  };

  // Cleanup on unmount
  useEffect(() => {
    return () => {
      if (intervalRef.current) {
        clearInterval(intervalRef.current);
      }
      if (tapTimeoutRef.current) {
        clearTimeout(tapTimeoutRef.current);
      }
    };
  }, []);

  return (
    <div className="space-y-4 h-full overflow-hidden flex flex-col">
      {/* BPM Display */}
      <Card className="p-4 bg-gray-900/50 border-gray-700 text-center flex-shrink-0">
        <div className="space-y-1">
          <div className="text-3xl font-bold dropsource-text-primary dropsource-glow-cyan">
            {bpm}
          </div>
          <div className="dropsource-text-secondary text-sm">BPM</div>
        </div>
      </Card>

      {/* Main Content - Scrollable */}
      <div className="flex-1 overflow-y-auto space-y-4">
        <div>
          <label className="block text-sm dropsource-text-secondary mb-2">Set BPM</label>
          <div className="flex gap-2">
            <Input
              type="number"
              value={bpm}
              onChange={(e) => handleBpmChange(Number(e.target.value))}
              min="60"
              max="200"
              className="flex-1 bg-gray-900/50 border-gray-700 dropsource-text-primary"
            />
            <Button
              variant="outline"
              onClick={() => handleBpmChange(120)}
              className="border-gray-600 dropsource-text-secondary hover:text-cyan-400"
            >
              Reset
            </Button>
          </div>
        </div>

        {/* BPM Slider */}
        <div>
          <label className="block text-sm dropsource-text-secondary mb-2">
            Quick Adjust: {bpm} BPM
          </label>
          <Slider
            value={[bpm]}
            onValueChange={(value) => handleBpmChange(value[0])}
            max={200}
            min={60}
            step={1}
            className="w-full"
          />
          <div className="flex justify-between text-xs dropsource-text-secondary mt-1">
            <span>60</span>
            <span>200</span>
          </div>
        </div>

        {/* Tap Tempo */}
        <div className="space-y-4">
          <h3 className="font-medium dropsource-text-primary">Tap Tempo</h3>
          
          <div className="flex items-center justify-between">
            <Button
              size="lg"
              onClick={handleTap}
              className="flex-1 mr-2 bg-cyan-600 hover:bg-cyan-700 text-white font-medium py-8 text-lg"
            >
              TAP
            </Button>
            <Button
              variant="outline"
              size="sm"
              onClick={resetTap}
              className="border-gray-600 dropsource-text-secondary hover:text-cyan-400"
            >
              <RotateCcw className="w-4 h-4" />
            </Button>
          </div>

          {tapBpm && (
            <Card className="p-4 bg-cyan-900/20 border-cyan-700/50">
              <div className="flex items-center justify-between">
                <div>
                  <div className="text-lg font-bold text-cyan-400">{tapBpm} BPM</div>
                  <div className="text-xs text-cyan-300">Tap detected ({tapTimes.length} taps)</div>
                </div>
                <Button
                  size="sm"
                  onClick={applyTapBpm}
                  className="bg-cyan-600 hover:bg-cyan-700 text-white"
                >
                  Apply
                </Button>
              </div>
            </Card>
          )}
        </div>

        {/* Metronome Controls */}
        <div className="space-y-4">
          <h3 className="font-medium dropsource-text-primary">Metronome</h3>
          
          <div className="flex items-center justify-between">
            <Button
              size="lg"
              onClick={toggleMetronome}
              className={`flex-1 mr-4 ${
                isPlaying 
                  ? 'bg-red-600 hover:bg-red-700 text-white' 
                  : 'bg-blue-600 hover:bg-blue-700 text-white'
              }`}
            >
              {isPlaying ? (
                <>
                  <Pause className="w-5 h-5 mr-2" />
                  Stop
                </>
              ) : (
                <>
                  <Play className="w-5 h-5 mr-2" />
                  Start
                </>
              )}
            </Button>
          </div>

          {/* Volume Control */}
          <div>
            <div className="flex items-center gap-2 mb-2">
              <Volume2 className="w-4 h-4 dropsource-text-secondary" />
              <label className="text-sm dropsource-text-secondary">
                Volume: {Math.round(volume * 100)}%
              </label>
            </div>
            <Slider
              value={[volume]}
              onValueChange={(value) => setVolume(value[0])}
              max={1}
              min={0}
              step={0.1}
              className="w-full"
            />
          </div>
        </div>

        {/* BPM Presets */}
        <div>
          <h4 className="font-medium dropsource-text-primary mb-3">Common Tempos</h4>
          <div className="grid grid-cols-2 gap-2">
            {[
              { name: 'Ballad', bpm: 80 },
              { name: 'Pop', bpm: 120 },
              { name: 'Rock', bpm: 140 },
              { name: 'Dance', bpm: 128 },
              { name: 'Hip-Hop', bpm: 95 },
              { name: 'House', bpm: 130 },
            ].map((preset) => (
              <Button
                key={preset.name}
                variant="outline"
                size="sm"
                onClick={() => handleBpmChange(preset.bpm)}
                className="border-gray-600 dropsource-text-secondary hover:text-cyan-400 hover:border-cyan-400"
              >
                {preset.name} ({preset.bpm})
              </Button>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}