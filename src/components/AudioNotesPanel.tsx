import React, { useState } from 'react';
import { Button } from './ui/button';
import { Progress } from './ui/progress';
import { Mic, Square, Upload, Play, Pause, Trash2 } from 'lucide-react';

interface AudioClip {
  id: string;
  name: string;
  duration: number;
  isPlaying: boolean;
  progress: number;
}

export function AudioNotesPanel() {
  const [isRecording, setIsRecording] = useState(false);
  const [audioClips, setAudioClips] = useState<AudioClip[]>([
    { id: '1', name: 'Verse Melody Idea', duration: 45, isPlaying: false, progress: 0 },
    { id: '2', name: 'Chorus Hook', duration: 30, isPlaying: false, progress: 0 },
  ]);

  const toggleRecording = () => {
    setIsRecording(!isRecording);
  };

  const togglePlayback = (id: string) => {
    setAudioClips(clips => 
      clips.map(clip => 
        clip.id === id 
          ? { ...clip, isPlaying: !clip.isPlaying }
          : { ...clip, isPlaying: false }
      )
    );
  };

  const deleteClip = (id: string) => {
    setAudioClips(clips => clips.filter(clip => clip.id !== id));
  };

  return (
    <div className="pt-6">
      {/* Recording Controls */}
      <div className="flex items-center gap-4 mb-6">
        <Button
          onClick={toggleRecording}
          className={`${
            isRecording 
              ? 'bg-red-600 hover:bg-red-700 dropsource-glow-red' 
              : 'dropsource-gradient hover:dropsource-glow-blue'
          } transition-all duration-200`}
        >
          {isRecording ? <Square className="w-4 h-4 mr-2" /> : <Mic className="w-4 h-4 mr-2" />}
          {isRecording ? 'Stop Recording' : 'Record'}
        </Button>

        <Button variant="outline" className="dropsource-border-glow hover:dropsource-glow-blue">
          <Upload className="w-4 h-4 mr-2" />
          Upload Audio
        </Button>

        {isRecording && (
          <div className="flex items-center gap-2 dropsource-text-secondary">
            <div className="w-2 h-2 bg-red-500 rounded-full animate-pulse"></div>
            Recording...
          </div>
        )}
      </div>

      {/* Audio Clips */}
      <div className="space-y-3">
        {audioClips.map((clip) => (
          <div key={clip.id} className="bg-gray-900/50 rounded-lg p-4 border border-gray-700 hover:border-cyan-500/50 transition-colors group">
            <div className="flex items-center justify-between mb-3">
              <div>
                <h4 className="dropsource-text-primary font-medium">{clip.name}</h4>
                <p className="dropsource-text-secondary text-sm">{clip.duration}s</p>
              </div>
              <div className="flex items-center gap-2">
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={() => togglePlayback(clip.id)}
                  className="dropsource-text-secondary hover:dropsource-glow-cyan"
                >
                  {clip.isPlaying ? <Pause className="w-4 h-4" /> : <Play className="w-4 h-4" />}
                </Button>
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={() => deleteClip(clip.id)}
                  className="text-red-400 hover:dropsource-glow-red opacity-0 group-hover:opacity-100 transition-opacity"
                >
                  <Trash2 className="w-4 h-4" />
                </Button>
              </div>
            </div>

            {/* Waveform / Progress Bar */}
            <div className="relative">
              <Progress 
                value={clip.progress} 
                className="w-full h-2 bg-gray-800"
              />
              <div className="absolute inset-0 bg-gradient-to-r from-cyan-500/20 to-blue-500/20 rounded-full opacity-0 group-hover:opacity-100 transition-opacity dropsource-glow-cyan"></div>
            </div>
          </div>
        ))}

        {audioClips.length === 0 && (
          <div className="text-center py-8 dropsource-text-secondary">
            <Mic className="w-12 h-12 mx-auto mb-4 opacity-50" />
            <p>No audio clips yet. Record or upload your first audio note!</p>
          </div>
        )}
      </div>
    </div>
  );
}