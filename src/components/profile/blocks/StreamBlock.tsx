import React, { useState, useEffect } from 'react';
import { Play, Pause, Radio, Users, Eye, Heart, MessageCircle, Share } from 'lucide-react';
import { Button } from '../../ui/button';
import { Badge } from '../../ui/badge';

interface StreamBlockProps {
  title?: string;
  isLive?: boolean;
  viewerCount?: number;
  category?: string;
  thumbnail?: string;
}

export function StreamBlock({ 
  title = "Late Night Beats 🎵", 
  isLive = true,
  viewerCount = 127,
  category = "Music Creation",
  thumbnail 
}: StreamBlockProps) {
  const [isPlaying, setIsPlaying] = useState(false);
  const [liveViewers, setLiveViewers] = useState(viewerCount);

  // Simulate live viewer count fluctuation
  useEffect(() => {
    if (!isLive) return;
    
    const interval = setInterval(() => {
      setLiveViewers(prev => {
        const change = Math.floor(Math.random() * 6) - 2; // -2 to +3
        return Math.max(50, prev + change);
      });
    }, 3000);

    return () => clearInterval(interval);
  }, [isLive]);

  const handlePlayPause = () => {
    setIsPlaying(!isPlaying);
  };

  return (
    <div className="h-full flex flex-col">
      {/* Stream Preview */}
      <div className="relative flex-1 min-h-0 mb-3">
        <div 
          className="w-full h-full rounded-lg overflow-hidden relative"
          style={{
            background: thumbnail 
              ? `url(${thumbnail})` 
              : 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
            backgroundSize: 'cover',
            backgroundPosition: 'center'
          } as React.CSSProperties}
        >
          {/* Live indicator */}
          {isLive && (
            <div className="absolute top-3 left-3 flex items-center gap-2">
              <div 
                className="px-2 py-1 rounded-full flex items-center gap-1.5"
                style={{
                  backgroundColor: '#DC2626',
                  animation: 'pulse 2s ease-in-out infinite'
                } as React.CSSProperties}
              >
                <div className="w-2 h-2 bg-white rounded-full"></div>
                <span className="text-white text-xs font-semibold">LIVE</span>
              </div>
            </div>
          )}

          {/* Viewer count */}
          <div className="absolute top-3 right-3">
            <div 
              className="px-2 py-1 rounded-full backdrop-blur-md flex items-center gap-1"
              style={{
                backgroundColor: 'rgba(0, 0, 0, 0.6)',
                border: '1px solid rgba(255, 255, 255, 0.2)'
              } as React.CSSProperties}
            >
              <Eye className="w-3 h-3 text-white" />
              <span className="text-white text-xs font-medium">{liveViewers}</span>
            </div>
          </div>

          {/* Play/Pause button */}
          <div className="absolute inset-0 flex items-center justify-center">
            <Button
              onClick={handlePlayPause}
              className="w-14 h-14 rounded-full bg-black/50 hover:bg-black/70 border-2 border-white/30 backdrop-blur-sm transition-all"
              style={{
                background: isPlaying 
                  ? 'rgba(0, 0, 0, 0.3)' 
                  : 'rgba(0, 0, 0, 0.7)',
                backdropFilter: 'blur(8px)'
              } as React.CSSProperties}
            >
              {isPlaying ? (
                <Pause className="w-6 h-6 text-white fill-white" />
              ) : (
                <Play className="w-6 h-6 text-white fill-white ml-0.5" />
              )}
            </Button>
          </div>

          {/* Audio visualization bars (when playing) */}
          {isPlaying && (
            <div className="absolute bottom-3 left-3 flex items-end gap-1">
              {[...Array(8)].map((_, i) => (
                <div
                  key={i}
                  className="w-1 bg-white rounded-full"
                  style={{
                    height: `${Math.random() * 20 + 10}px`,
                    animation: `audioVisualization ${Math.random() * 0.5 + 0.5}s ease-in-out infinite alternate`,
                    opacity: 0.8
                  } as React.CSSProperties}
                />
              ))}
            </div>
          )}
        </div>
      </div>

      {/* Stream Info */}
      <div className="space-y-3">
        <div>
          <h3 className="font-semibold text-sm mb-1" style={{ color: '#E6ECF3' } as React.CSSProperties}>
            {title}
          </h3>
          <div className="flex items-center gap-2 mb-2">
            <Badge 
              style={{
                backgroundColor: 'rgba(99, 179, 255, 0.1)',
                color: '#63B3FF',
                fontSize: '10px'
              } as React.CSSProperties}
            >
              {category}
            </Badge>
            {isLive && (
              <div className="flex items-center gap-1">
                <Radio className="w-3 h-3" style={{ color: '#DC2626' } as React.CSSProperties} />
                <span className="text-xs" style={{ color: '#DC2626' } as React.CSSProperties}>
                  Live
                </span>
              </div>
            )}
          </div>
        </div>

        {/* Stream Actions */}
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <button className="p-1.5 rounded hover:bg-gray-700 transition-colors">
              <Heart className="w-4 h-4 text-gray-400 hover:text-red-400" />
            </button>
            <button className="p-1.5 rounded hover:bg-gray-700 transition-colors">
              <MessageCircle className="w-4 h-4 text-gray-400 hover:text-blue-400" />
            </button>
            <button className="p-1.5 rounded hover:bg-gray-700 transition-colors">
              <Share className="w-4 h-4 text-gray-400 hover:text-green-400" />
            </button>
          </div>

          <Button
            className="text-xs px-3 py-1.5 h-auto"
            style={{
              background: isLive 
                ? 'linear-gradient(90deg, #DC2626 0%, #EF4444 100%)'
                : 'linear-gradient(90deg, #3B82F6 0%, #1D4ED8 100%)',
              color: 'white',
              border: 'none'
            } as React.CSSProperties}
            onClick={() => console.log(isLive ? 'Join stream' : 'Watch recording')}
          >
            {isLive ? 'Join Stream' : 'Watch'}
          </Button>
        </div>
      </div>

      <style jsx>{`
        @keyframes audioVisualization {
          0% { height: 8px; }
          100% { height: 24px; }
        }
      `}</style>
    </div>
  );
}