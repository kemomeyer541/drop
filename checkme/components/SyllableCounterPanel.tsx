import React, { useState, useEffect } from 'react';
import { Card } from './ui/card';
import { Button } from './ui/button';
import { Badge } from './ui/badge';
import { ScrollArea } from './ui/scroll-area';
import { Separator } from './ui/separator';
import { BarChart, BookOpen, Hash, Type, Clock } from 'lucide-react';

export function SyllableCounterPanel() {
  const [content, setContent] = useState('');
  const [stats, setStats] = useState({
    words: 0,
    lines: 0,
    syllables: 0,
    verses: 0,
    choruses: 0,
    bridges: 0,
    readingTime: 0,
  });
  const [wordBreakdown, setWordBreakdown] = useState<{word: string, syllables: number}[]>([]);

  // Listen for content changes from the lyrics editor
  useEffect(() => {
    const interval = setInterval(() => {
      // Get content from textarea
      const textareas = document.querySelectorAll('textarea');
      if (textareas.length > 0) {
        const newContent = textareas[0].value;
        if (newContent !== content) {
          setContent(newContent);
          analyzeContent(newContent);
        }
      }
    }, 500);

    return () => clearInterval(interval);
  }, [content]);

  const countSyllables = (word: string): number => {
    if (!word || word.length === 0) return 0;
    
    // Clean the word - remove punctuation and convert to lowercase
    const cleanWord = word.toLowerCase().replace(/[^a-z]/g, '');
    if (cleanWord.length === 0) return 0;
    
    // Handle common exceptions
    const exceptions: { [key: string]: number } = {
      'the': 1, 'a': 1, 'an': 1, 'and': 1, 'or': 1, 'but': 1, 'in': 1, 'on': 1,
      'at': 1, 'to': 1, 'for': 1, 'of': 1, 'with': 1, 'by': 1, 'from': 1,
      'like': 1, 'love': 1, 'fire': 2, 'desire': 3, 'hour': 1, 'our': 1,
      'every': 3, 'family': 3, 'library': 4, 'different': 3, 'interest': 3,
      'camera': 3, 'orange': 2, 'people': 2, 'purple': 2, 'circle': 2,
      'simple': 2, 'little': 2, 'middle': 2, 'battle': 2, 'gentle': 2,
    };

    if (exceptions[cleanWord]) {
      return exceptions[cleanWord];
    }
    
    // Count vowel groups
    let count = 0;
    let previousWasVowel = false;
    const vowels = 'aeiouy';
    
    for (let i = 0; i < cleanWord.length; i++) {
      const isVowel = vowels.includes(cleanWord[i]);
      
      if (isVowel && !previousWasVowel) {
        count++;
      }
      
      previousWasVowel = isVowel;
    }
    
    // Handle silent 'e' at the end
    if (cleanWord.endsWith('e') && count > 1) {
      count--;
    }
    
    // Handle 'le' ending
    if (cleanWord.endsWith('le') && cleanWord.length > 2 && !vowels.includes(cleanWord[cleanWord.length - 3])) {
      count++;
    }
    
    // Ensure at least 1 syllable
    return Math.max(1, count);
  };

  const analyzeContent = (text: string) => {
    if (!text.trim()) {
      setStats({
        words: 0,
        lines: 0,
        syllables: 0,
        verses: 0,
        choruses: 0,
        bridges: 0,
        readingTime: 0,
      });
      setWordBreakdown([]);
      return;
    }

    const lines = text.split('\n');
    const nonEmptyLines = lines.filter(line => line.trim().length > 0);
    
    // Extract words (excluding section markers)
    const wordRegex = /\b[a-zA-Z]+(?:'[a-zA-Z]+)?\b/g;
    const allWords: string[] = [];
    const breakdown: {word: string, syllables: number}[] = [];
    
    text.replace(wordRegex, (match) => {
      // Skip section markers like [Verse], [Chorus], etc.
      const cleanText = text.replace(/\[.*?\]/g, '');
      if (cleanText.includes(match)) {
        allWords.push(match);
        const syllableCount = countSyllables(match);
        breakdown.push({ word: match.toLowerCase(), syllables: syllableCount });
      }
      return match;
    });

    // Count sections
    const verses = (text.match(/\[verse\]/gi) || []).length;
    const choruses = (text.match(/\[chorus\]/gi) || []).length;
    const bridges = (text.match(/\[bridge\]/gi) || []).length;

    // Calculate total syllables
    const totalSyllables = breakdown.reduce((total, item) => total + item.syllables, 0);
    
    // Estimate reading time (average 150 words per minute for lyrics)
    const readingTime = Math.ceil(allWords.length / 150);

    setStats({
      words: allWords.length,
      lines: nonEmptyLines.length,
      syllables: totalSyllables,
      verses,
      choruses,
      bridges,
      readingTime,
    });

    // Group words by syllable count for breakdown
    const groupedBreakdown = breakdown.reduce((acc, item) => {
      const existing = acc.find(x => x.word === item.word);
      if (existing) {
        existing.count = (existing.count || 1) + 1;
      } else {
        acc.push({ ...item, count: 1 });
      }
      return acc;
    }, [] as Array<{word: string, syllables: number, count?: number}>);

    setWordBreakdown(groupedBreakdown.sort((a, b) => b.syllables - a.syllables).slice(0, 20));
  };

  return (
    <div className="space-y-4 h-full overflow-hidden flex flex-col">
      {/* Main Stats Cards */}
      <div className="grid grid-cols-2 gap-3 flex-shrink-0">
        <Card className="p-3 bg-gray-900/50 border-gray-700 text-center">
          <div className="flex items-center justify-center gap-2 mb-1">
            <Type className="w-4 h-4 dropsource-text-secondary" />
            <span className="text-sm dropsource-text-secondary">Words</span>
          </div>
          <div className="text-2xl font-bold dropsource-text-primary dropsource-glow-cyan">
            {stats.words.toLocaleString()}
          </div>
        </Card>

        <Card className="p-3 bg-gray-900/50 border-gray-700 text-center">
          <div className="flex items-center justify-center gap-2 mb-1">
            <Hash className="w-4 h-4 dropsource-text-secondary" />
            <span className="text-sm dropsource-text-secondary">Syllables</span>
          </div>
          <div className="text-2xl font-bold dropsource-text-primary dropsource-glow-cyan">
            {stats.syllables.toLocaleString()}
          </div>
        </Card>

        <Card className="p-3 bg-gray-900/50 border-gray-700 text-center">
          <div className="flex items-center justify-center gap-2 mb-1">
            <BookOpen className="w-4 h-4 dropsource-text-secondary" />
            <span className="text-sm dropsource-text-secondary">Lines</span>
          </div>
          <div className="text-2xl font-bold dropsource-text-primary">
            {stats.lines}
          </div>
        </Card>

        <Card className="p-3 bg-gray-900/50 border-gray-700 text-center">
          <div className="flex items-center justify-center gap-2 mb-1">
            <Clock className="w-4 h-4 dropsource-text-secondary" />
            <span className="text-sm dropsource-text-secondary">Read Time</span>
          </div>
          <div className="text-2xl font-bold dropsource-text-primary">
            {stats.readingTime}m
          </div>
        </Card>
      </div>

      {/* Song Structure */}
      {(stats.verses > 0 || stats.choruses > 0 || stats.bridges > 0) && (
        <Card className="p-4 bg-gray-900/50 border-gray-700 flex-shrink-0">
          <h3 className="font-medium dropsource-text-primary mb-3 flex items-center gap-2">
            <BarChart className="w-4 h-4" />
            Song Structure
          </h3>
          <div className="flex flex-wrap gap-2">
            {stats.verses > 0 && (
              <Badge variant="outline" className="border-blue-600 text-blue-400">
                {stats.verses} Verse{stats.verses !== 1 ? 's' : ''}
              </Badge>
            )}
            {stats.choruses > 0 && (
              <Badge variant="outline" className="border-green-600 text-green-400">
                {stats.choruses} Chorus{stats.choruses !== 1 ? 'es' : ''}
              </Badge>
            )}
            {stats.bridges > 0 && (
              <Badge variant="outline" className="border-purple-600 text-purple-400">
                {stats.bridges} Bridge{stats.bridges !== 1 ? 's' : ''}
              </Badge>
            )}
          </div>
        </Card>
      )}

      {/* Word Breakdown */}
      <div className="flex-1 overflow-hidden">
        <h3 className="font-medium dropsource-text-primary mb-3">Syllable Breakdown</h3>
        
        {wordBreakdown.length > 0 ? (
          <ScrollArea className="h-full">
            <div className="space-y-2">
              {wordBreakdown.map((item, index) => (
                <div key={index} className="flex items-center justify-between p-2 bg-gray-800/30 rounded-lg">
                  <div className="flex items-center gap-3">
                    <span className="dropsource-text-primary font-medium">{item.word}</span>
                    {(item.count || 0) > 1 && (
                      <Badge variant="outline" className="text-xs">
                        ×{item.count}
                      </Badge>
                    )}
                  </div>
                  <div className="flex items-center gap-2">
                    <Badge 
                      variant="outline" 
                      className={`text-xs ${
                        item.syllables === 1 ? 'border-green-600 text-green-400' :
                        item.syllables === 2 ? 'border-blue-600 text-blue-400' :
                        item.syllables === 3 ? 'border-yellow-600 text-yellow-400' :
                        'border-red-600 text-red-400'
                      }`}
                    >
                      {item.syllables} syl
                    </Badge>
                  </div>
                </div>
              ))}
            </div>
          </ScrollArea>
        ) : (
          <div className="flex flex-col items-center justify-center h-32 dropsource-text-secondary">
            <Type className="w-8 h-8 mb-2 opacity-50" />
            <p className="text-sm text-center">Start writing to see syllable breakdown</p>
          </div>
        )}
      </div>

      {/* Quick Actions */}
      <div className="flex-shrink-0 pt-3 border-t border-gray-700">
        <div className="grid grid-cols-2 gap-2">
          <Button
            variant="outline"
            size="sm"
            onClick={() => {
              if ((window as any).insertIntoLyrics) {
                (window as any).insertIntoLyrics(`\n\n--- Stats ---\nWords: ${stats.words}\nLines: ${stats.lines}\nSyllables: ${stats.syllables}\n`);
              }
            }}
            className="border-gray-600 dropsource-text-secondary hover:text-cyan-400 hover:border-cyan-400"
          >
            Insert Stats
          </Button>
          <Button
            variant="outline"
            size="sm"
            onClick={() => {
              // Refresh analysis
              const textareas = document.querySelectorAll('textarea');
              if (textareas.length > 0) {
                analyzeContent(textareas[0].value);
              }
            }}
            className="border-gray-600 dropsource-text-secondary hover:text-cyan-400 hover:border-cyan-400"
          >
            Refresh
          </Button>
        </div>
      </div>
    </div>
  );
}