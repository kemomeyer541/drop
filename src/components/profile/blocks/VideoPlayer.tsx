import React, { useState, useRef, useEffect, useCallback } from 'react';
import { Heart, MessageCircle, Share, Play, Pause, Volume2, VolumeX } from 'lucide-react';

interface VideoData {
  id: string;
  username: string;
  description: string;
  likes: number;
  comments: number;
  shares: number;
  backgroundColor: string;
}

const mockVideos: VideoData[] = [
  {
    id: '1',
    username: '@TestUser',
    description: 'Check out this beat! 🔥',
    likes: 2100,
    comments: 156,
    shares: 89,
    backgroundColor: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)'
  },
  {
    id: '2',
    username: '@BeatMaker',
    description: 'New track preview! What do you think? 🎵',
    likes: 1800,
    comments: 234,
    shares: 67,
    backgroundColor: 'linear-gradient(135deg, #f093fb 0%, #f5576c 100%)'
  },
  {
    id: '3',
    username: '@ProducerLife',
    description: 'Studio session vibes ✨',
    likes: 3200,
    comments: 445,
    shares: 123,
    backgroundColor: 'linear-gradient(135deg, #4facfe 0%, #00f2fe 100%)'
  },
  {
    id: '4',
    username: '@MusicCreator',
    description: 'Late night inspiration 🌙',
    likes: 2650,
    comments: 189,
    shares: 78,
    backgroundColor: 'linear-gradient(135deg, #43e97b 0%, #38f9d7 100%)'
  },
  {
    id: '5',
    username: '@SoundDesigner',
    description: 'Experimental sounds 🎛️',
    likes: 1950,
    comments: 267,
    shares: 95,
    backgroundColor: 'linear-gradient(135deg, #fa709a 0%, #fee140 100%)'
  }
];

interface VideoPlayerProps {
  width?: number;
  height?: number;
}

export function VideoPlayer({ width = 300, height = 400 }: VideoPlayerProps) {
  const [currentIndex, setCurrentIndex] = useState(0);
  const [isPlaying, setIsPlaying] = useState(false);
  const [isMuted, setIsMuted] = useState(true);
  const [touchStart, setTouchStart] = useState(0);
  const [touchEnd, setTouchEnd] = useState(0);
  const [isTransitioning, setIsTransitioning] = useState(false);
  const [dragOffset, setDragOffset] = useState(0);
  const [isDragging, setIsDragging] = useState(false);
  const containerRef = useRef<HTMLDivElement>(null);

  const currentVideo = mockVideos[currentIndex];

  // Handle touch events for mobile swiping - Fast and immediate like TikTok
  const handleTouchStart = useCallback((e: React.TouchEvent) => {
    if (isTransitioning) return;
    
    const startY = e.targetTouches[0].clientY;
    setTouchStart(startY);
    setTouchEnd(startY);
    setIsDragging(true);
    setDragOffset(0);
  }, [isTransitioning]);

  const handleTouchMove = useCallback((e: React.TouchEvent) => {
    if (!isDragging || isTransitioning) return;
    e.preventDefault();
    
    const currentY = e.targetTouches[0].clientY;
    const offset = currentY - touchStart;
    
    // Immediate visual feedback
    let dampedOffset = offset * 0.6; // Strong visual feedback for responsiveness
    
    // Rubber band effect at edges
    if (currentIndex === 0 && offset > 0) {
      dampedOffset = offset * 0.3;
    } else if (currentIndex === mockVideos.length - 1 && offset < 0) {
      dampedOffset = offset * 0.3;
    }
    
    setDragOffset(dampedOffset);
    setTouchEnd(currentY);
  }, [touchStart, isDragging, currentIndex, isTransitioning]);

  const handleTouchEnd = useCallback(() => {
    if (!isDragging || isTransitioning) return;
    
    setIsDragging(false);
    const distance = touchStart - touchEnd;
    const velocity = Math.abs(distance);
    
    // TikTok-like immediate thresholds
    const threshold = 25; // Very low threshold for immediate response
    const velocityThreshold = 40; // Quick swipe detection
    
    const isUpSwipe = distance > threshold || (distance > 10 && velocity > velocityThreshold);
    const isDownSwipe = distance < -threshold || (distance < -10 && velocity > velocityThreshold);

    if (isUpSwipe && currentIndex < mockVideos.length - 1) {
      goToNext();
    } else if (isDownSwipe && currentIndex > 0) {
      goToPrevious();
    }
    
    // Immediate reset
    setDragOffset(0);
  }, [touchStart, touchEnd, currentIndex, isDragging, isTransitioning]);

  // Handle wheel events for desktop scrolling - Immediate and responsive like TikTok
  const handleWheel = useCallback((e: WheelEvent) => {
    e.preventDefault();
    
    if (isTransitioning) return;
    
    const deltaY = e.deltaY;
    const threshold = 50; // Low threshold for immediate response
    
    // Immediate response - no accumulation delay
    if (deltaY > threshold && currentIndex < mockVideos.length - 1) {
      goToNext();
    } else if (deltaY < -threshold && currentIndex > 0) {
      goToPrevious();
    }
  }, [currentIndex, isTransitioning]);

  const goToNext = () => {
    if (currentIndex < mockVideos.length - 1 && !isTransitioning) {
      setIsTransitioning(true);
      setDragOffset(0);
      
      // Immediate video switch like TikTok
      setCurrentIndex(prev => prev + 1);
      
      // Short transition lock for immediate feel
      setTimeout(() => setIsTransitioning(false), 150);
    }
  };

  const goToPrevious = () => {
    if (currentIndex > 0 && !isTransitioning) {
      setIsTransitioning(true);
      setDragOffset(0);
      
      // Immediate video switch like TikTok
      setCurrentIndex(prev => prev - 1);
      
      // Short transition lock for immediate feel
      setTimeout(() => setIsTransitioning(false), 150);
    }
  };

  // Add wheel event listener and cleanup
  useEffect(() => {
    const container = containerRef.current;
    if (container) {
      container.addEventListener('wheel', handleWheel, { passive: false });
      return () => {
        container.removeEventListener('wheel', handleWheel);
      };
    }
  }, [handleWheel]);

  const formatCount = (count: number) => {
    if (count >= 1000) {
      return (count / 1000).toFixed(1) + 'K';
    }
    return count.toString();
  };

  const togglePlay = () => {
    setIsPlaying(!isPlaying);
  };

  const toggleMute = () => {
    setIsMuted(!isMuted);
  };

  return (
    <div 
      ref={containerRef}
      className="relative w-full h-full bg-black rounded-lg overflow-hidden"
      onTouchStart={handleTouchStart}
      onTouchMove={handleTouchMove}
      onTouchEnd={handleTouchEnd}
      style={{
        width: `${width}px`,
        height: `${height}px`,
        touchAction: 'pan-y',
        userSelect: 'none',
        WebkitUserSelect: 'none',
        msUserSelect: 'none'
      } as React.CSSProperties}
    >
      {/* Video Content */}
      <div 
        className="absolute inset-0 ease-out"
        style={{
          background: currentVideo.backgroundColor,
          transform: `translateY(${dragOffset}px)`,
          opacity: isTransitioning ? 0.95 : 1,
          transition: isDragging ? 'none' : 'all 150ms ease-out'
        } as React.CSSProperties}
      >
        {/* Play/Pause Button */}
        <div className="absolute inset-0 flex items-center justify-center">
          <button
            onClick={togglePlay}
            className="w-14 h-14 rounded-full bg-black/30 hover:bg-black/50 border-2 border-white/50 backdrop-blur-sm transition-all flex items-center justify-center"
          >
            {isPlaying ? (
              <Pause className="w-6 h-6 text-white fill-white" />
            ) : (
              <Play className="w-6 h-6 text-white fill-white ml-0.5" />
            )}
          </button>
        </div>

        {/* Audio visualization when playing */}
        {isPlaying && (
          <div className="absolute bottom-20 left-4 flex items-end gap-1">
            {[...Array(6)].map((_, i) => (
              <div
                key={i}
                className="w-1 bg-white rounded-full opacity-80"
                style={{
                  height: `${Math.random() * 16 + 8}px`,
                  animation: `audioVisualization ${Math.random() * 0.4 + 0.6}s ease-in-out infinite alternate`
                } as React.CSSProperties}
              />
            ))}
          </div>
        )}

        {/* Volume control */}
        <button
          onClick={toggleMute}
          className="absolute top-4 right-4 w-8 h-8 bg-black/30 backdrop-blur-sm rounded-full flex items-center justify-center"
        >
          {isMuted ? (
            <VolumeX className="w-4 h-4 text-white" />
          ) : (
            <Volume2 className="w-4 h-4 text-white" />
          )}
        </button>

        {/* Video info overlay */}
        <div className="absolute bottom-0 left-0 right-0 bg-gradient-to-t from-black/80 to-transparent p-4">
          <div className="flex items-end justify-between">
            <div className="flex-1 pr-4">
              <p className="text-white font-semibold text-sm mb-1">
                {currentVideo.username}
              </p>
              <p className="text-white/90 text-sm mb-3">
                {currentVideo.description}
              </p>
              <div className="flex items-center gap-4 text-white/80 text-xs">
                <span>♥ {formatCount(currentVideo.likes)}</span>
                <span>💬 {formatCount(currentVideo.comments)}</span>
                <span>📤 {formatCount(currentVideo.shares)}</span>
              </div>
            </div>
            
            {/* Right side controls */}
            <div className="flex flex-col gap-4 items-center">
              <button className="w-10 h-10 bg-white/10 rounded-full flex items-center justify-center backdrop-blur-sm hover:bg-white/20 transition-colors">
                <Heart className="w-5 h-5 text-white" />
              </button>
              <button className="w-10 h-10 bg-white/10 rounded-full flex items-center justify-center backdrop-blur-sm hover:bg-white/20 transition-colors">
                <MessageCircle className="w-5 h-5 text-white" />
              </button>
              <button className="w-10 h-10 bg-white/10 rounded-full flex items-center justify-center backdrop-blur-sm hover:bg-white/20 transition-colors">
                <Share className="w-5 h-5 text-white" />
              </button>
            </div>
          </div>
        </div>

        {/* Swipe indicators */}
        <div className="absolute right-2 top-1/2 transform -translate-y-1/2 flex flex-col gap-1">
          {mockVideos.map((_, index) => (
            <div
              key={index}
              className={`w-1 h-6 rounded-full transition-all cursor-pointer hover:bg-white/70 ${
                index === currentIndex ? 'bg-white' : 'bg-white/40'
              }`}
              onClick={() => {
                if (!isTransitioning && index !== currentIndex) {
                  setIsTransitioning(true);
                  setCurrentIndex(index);
                  setDragOffset(0);
                  setTimeout(() => setIsTransitioning(false), 150);
                }
              }}
            />
          ))}
        </div>

        {/* Swipe hint */}
        {currentIndex === 0 && (
          <div className="absolute top-4 left-1/2 transform -translate-x-1/2 text-white/60 text-xs bg-black/30 px-2 py-1 rounded backdrop-blur-sm">
            Swipe ↕ or scroll for more videos
          </div>
        )}
      </div>

      {/* Video counter */}
      <div className="absolute top-4 left-4 bg-black/30 backdrop-blur-sm px-2 py-1 rounded text-xs text-white">
        {currentIndex + 1} / {mockVideos.length}
      </div>

      <style jsx>{`
        @keyframes audioVisualization {
          0% { height: 8px; }
          100% { height: 20px; }
        }
      `}</style>
    </div>
  );
}