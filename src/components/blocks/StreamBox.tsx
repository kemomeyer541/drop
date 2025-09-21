import React from 'react';

export default function StreamBox() {
  return (
    <div className="card-shell relative overflow-hidden">
      <div className="absolute top-3 left-3 flex items-center gap-2 z-10">
        <span className="px-2 py-1 text-xs font-semibold rounded bg-red-500/90 text-white animate-pulse">
          LIVE
        </span>
        <span className="px-2 py-1 text-xs font-medium rounded bg-[#00AAEF] text-white">
          73 viewers
        </span>
      </div>
      
      {/* Stream placeholder with dark gradient background */}
      <div className="h-[220px] sm:h-[280px] grid place-items-center text-white/70 bg-gradient-to-br from-gray-900 via-gray-800 to-black">
        <div className="text-center">
          <div className="w-16 h-16 bg-white/10 rounded-full grid place-items-center mb-3 mx-auto">
            <svg className="w-8 h-8" fill="currentColor" viewBox="0 0 24 24">
              <path d="M8 5v14l11-7z"/>
            </svg>
          </div>
          <span className="text-sm">Stream player placeholder</span>
        </div>
      </div>
      
      {/* Stream controls overlay */}
      <div className="absolute bottom-3 right-3 flex gap-2">
        <button className="px-2 py-1 bg-black/50 text-white/80 rounded text-xs backdrop-blur-sm">
          🔊
        </button>
        <button className="px-2 py-1 bg-black/50 text-white/80 rounded text-xs backdrop-blur-sm">
          ⚙️
        </button>
      </div>
    </div>
  );
}