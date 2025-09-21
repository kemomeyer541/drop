import React, { useState } from 'react';
import { Textarea } from './ui/textarea';
import { Button } from './ui/button';
import { Bold, Italic, List, AlignLeft } from 'lucide-react';

export function LyricsPanel() {
  const [lyrics, setLyrics] = useState('');

  return (
    <div className="pt-6">
      {/* Toolbar */}
      <div className="flex items-center gap-2 mb-4">
        <Button variant="ghost" size="sm" className="dropsource-text-secondary hover:dropsource-glow-cyan opacity-60 hover:opacity-100">
          <Bold className="w-4 h-4" />
        </Button>
        <Button variant="ghost" size="sm" className="dropsource-text-secondary hover:dropsource-glow-cyan opacity-60 hover:opacity-100">
          <Italic className="w-4 h-4" />
        </Button>
        <Button variant="ghost" size="sm" className="dropsource-text-secondary hover:dropsource-glow-cyan opacity-60 hover:opacity-100">
          <List className="w-4 h-4" />
        </Button>
        <Button variant="ghost" size="sm" className="dropsource-text-secondary hover:dropsource-glow-cyan opacity-60 hover:opacity-100">
          <AlignLeft className="w-4 h-4" />
        </Button>
      </div>

      {/* Editor */}
      <div className="relative">
        <Textarea
          value={lyrics}
          onChange={(e) => setLyrics(e.target.value)}
          placeholder="Start writing your lyrics here...

[Verse 1]
Write your verse lyrics here...

[Chorus]
Write your chorus lyrics here...

[Verse 2]
Continue with verse 2..."
          className="min-h-[400px] bg-gray-900/50 border-gray-700 dropsource-text-primary placeholder:dropsource-text-secondary focus:dropsource-glow-cyan focus:border-cyan-500 resize-none"
          style={{
            caretColor: '#06b6d4',
          }}
        />
      </div>

      {/* Stats */}
      <div className="flex items-center gap-6 mt-4 dropsource-text-secondary text-sm">
        <span>Lines: {lyrics.split('\n').length}</span>
        <span>Words: {lyrics.trim() ? lyrics.trim().split(/\s+/).length : 0}</span>
        <span>Characters: {lyrics.length}</span>
      </div>
    </div>
  );
}