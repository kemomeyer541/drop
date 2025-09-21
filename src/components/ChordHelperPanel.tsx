import React, { useState } from 'react';
import { Button } from './ui/button';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from './ui/select';
import { Card } from './ui/card';
import { Piano, Guitar } from 'lucide-react';

interface ChordNote {
  note: string;
  octave: number;
  isRoot?: boolean;
}

interface ChordData {
  name: string;
  notes: ChordNote[];
  guitarFrets: number[]; // 6 strings, -1 for muted, 0 for open
}

export function ChordHelperPanel() {
  const [selectedKey, setSelectedKey] = useState('C');
  const [selectedChord, setSelectedChord] = useState('major');
  const [displayMode, setDisplayMode] = useState<'piano' | 'guitar'>('piano');

  // Extended chord database
  const chordTypes = {
    major: { name: 'Major', intervals: [0, 4, 7] },
    minor: { name: 'Minor', intervals: [0, 3, 7] },
    dim: { name: 'Diminished', intervals: [0, 3, 6] },
    aug: { name: 'Augmented', intervals: [0, 4, 8] },
    sus2: { name: 'Sus2', intervals: [0, 2, 7] },
    sus4: { name: 'Sus4', intervals: [0, 5, 7] },
    '7': { name: 'Dominant 7th', intervals: [0, 4, 7, 10] },
    maj7: { name: 'Major 7th', intervals: [0, 4, 7, 11] },
    min7: { name: 'Minor 7th', intervals: [0, 3, 7, 10] },
    add9: { name: 'Add9', intervals: [0, 4, 7, 14] },
  };

  // All 12 keys
  const keys = ['C', 'C#', 'D', 'D#', 'E', 'F', 'F#', 'G', 'G#', 'A', 'A#', 'B'];
  const keyPositions = { C: 0, 'C#': 1, D: 2, 'D#': 3, E: 4, F: 5, 'F#': 6, G: 7, 'G#': 8, A: 9, 'A#': 10, B: 11 };

  // Guitar chord shapes (common fingerings)
  const guitarChords: { [key: string]: { [chord: string]: number[] } } = {
    C: {
      major: [0, 1, 0, 2, 3, 0],
      minor: [0, 1, 3, 3, 2, 1],
      '7': [0, 1, 0, 2, 3, 1],
      maj7: [0, 0, 0, 2, 3, 0],
    },
    D: {
      major: [-1, -1, 0, 2, 3, 2],
      minor: [-1, -1, 0, 2, 3, 1],
      '7': [-1, -1, 0, 2, 1, 2],
      maj7: [-1, -1, 0, 2, 2, 2],
    },
    E: {
      major: [0, 2, 2, 1, 0, 0],
      minor: [0, 2, 2, 0, 0, 0],
      '7': [0, 2, 0, 1, 0, 0],
      maj7: [0, 2, 1, 1, 0, 0],
    },
    F: {
      major: [1, 3, 3, 2, 1, 1],
      minor: [1, 3, 3, 1, 1, 1],
      '7': [1, 3, 1, 2, 1, 1],
      maj7: [1, 3, 2, 2, 1, 1],
    },
    G: {
      major: [3, 2, 0, 0, 3, 3],
      minor: [3, 5, 5, 3, 3, 3],
      '7': [3, 2, 0, 0, 0, 1],
      maj7: [3, 2, 0, 0, 0, 2],
    },
    A: {
      major: [-1, 0, 2, 2, 2, 0],
      minor: [-1, 0, 2, 2, 1, 0],
      '7': [-1, 0, 2, 0, 2, 0],
      maj7: [-1, 0, 2, 1, 2, 0],
    },
    B: {
      major: [-1, 2, 4, 4, 4, 2],
      minor: [-1, 2, 4, 4, 3, 2],
      '7': [-1, 2, 1, 2, 0, 2],
      maj7: [-1, 2, 3, 2, 4, 2],
    },
  };

  const getChordNotes = (key: string, chordType: string): ChordNote[] => {
    const rootPosition = keyPositions[key as keyof typeof keyPositions];
    const intervals = chordTypes[chordType as keyof typeof chordTypes]?.intervals || [0, 4, 7];
    
    return intervals.map((interval, index) => {
      const notePosition = (rootPosition + interval) % 12;
      const octave = Math.floor((rootPosition + interval) / 12) + 4;
      return {
        note: keys[notePosition],
        octave,
        isRoot: index === 0,
      };
    });
  };

  const currentChordNotes = getChordNotes(selectedKey, selectedChord);
  const currentChordName = `${selectedKey} ${chordTypes[selectedChord as keyof typeof chordTypes]?.name || 'Major'}`;

  // Piano component
  const PianoKeyboard = () => {
    const whiteKeys = ['C', 'D', 'E', 'F', 'G', 'A', 'B'];
    const blackKeys = ['C#', 'D#', '', 'F#', 'G#', 'A#', ''];
    
    const isNoteActive = (note: string) => {
      return currentChordNotes.some(chordNote => chordNote.note === note);
    };

    const isRootNote = (note: string) => {
      return currentChordNotes.some(chordNote => chordNote.note === note && chordNote.isRoot);
    };

    return (
      <div className="w-full max-w-sm mx-auto">
        <div className="relative" style={{ width: '350px', height: '140px', margin: '0 auto' }}>
          {/* White keys */}
          <div className="flex absolute bottom-0">
            {whiteKeys.map((note, index) => (
              <div
                key={note}
                className={`
                  w-12 h-24 border-2 border-gray-600 flex items-end justify-center pb-2 text-sm font-bold
                  ${isNoteActive(note) 
                    ? isRootNote(note) 
                      ? 'bg-cyan-300 text-black shadow-xl shadow-cyan-400/80 border-cyan-500' 
                      : 'bg-blue-300 text-black shadow-xl shadow-blue-400/80 border-blue-500'
                    : 'bg-white text-gray-900 hover:bg-gray-50 border-gray-400'
                  }
                  transition-all duration-200 cursor-pointer relative
                `}
                onClick={() => {
                  console.log(`Playing ${note}`);
                }}
              >
                <span className="select-none font-bold text-sm">{note}</span>
              </div>
            ))}
          </div>

          {/* Black keys */}
          <div className="flex absolute bottom-0">
            {blackKeys.map((note, index) => {
              if (!note) return <div key={index} className="w-12" />;
              
              return (
                <div
                  key={note}
                  className={`
                    w-8 h-16 -ml-4 mr-4 flex items-end justify-center pb-2 text-xs font-bold rounded-b-md
                    ${isNoteActive(note)
                      ? isRootNote(note)
                        ? 'bg-cyan-400 text-black shadow-xl shadow-cyan-400/80 border-2 border-cyan-600'
                        : 'bg-blue-400 text-black shadow-xl shadow-blue-400/80 border-2 border-blue-600'
                      : 'bg-gray-800 text-white hover:bg-gray-700 border-2 border-gray-600'
                    }
                    transition-all duration-200 cursor-pointer z-10
                  `}
                  onClick={() => {
                    console.log(`Playing ${note}`);
                  }}
                >
                  <span className="select-none font-bold text-[10px] text-center">{note}</span>
                </div>
              );
            })}
          </div>
        </div>
      </div>
    );
  };

  // Guitar fretboard component
  const GuitarFretboard = () => {
    const stringNames = ['E', 'A', 'D', 'G', 'B', 'E']; // Low to high
    const frets = guitarChords[selectedKey]?.[selectedChord] || [1, 3, 3, 2, 1, 1]; // Default to F major if not found

    return (
      <div className="w-full max-w-sm mx-auto">
        <h4 className="text-center font-medium dropsource-text-primary mb-4">Guitar Chord</h4>
        
        <div className="bg-amber-50 rounded-xl p-6 border-2 border-amber-200 shadow-lg">
          {/* String labels at top */}
          <div className="flex justify-between mb-3 px-2">
            {stringNames.map((string, index) => (
              <div key={index} className="text-center">
                <span className="text-sm font-bold text-amber-900">{string}</span>
                <div className="text-xs text-amber-700">
                  {frets[index] === -1 ? '×' : frets[index] === 0 ? 'O' : frets[index]}
                </div>
              </div>
            ))}
          </div>

          {/* Nut (thick line at top) */}
          <div className="h-1 bg-gray-800 mb-4 rounded shadow-sm" />
          
          {/* Fretboard with strings */}
          <div className="space-y-3">
            {[1, 2, 3, 4].map(fretNumber => (
              <div key={fretNumber} className="relative">
                {/* Fret wire (thin line) */}
                <div className="absolute w-full h-0.5 bg-gray-400 top-2" />
                
                {/* String positions with finger dots */}
                <div className="flex justify-between items-center h-4">
                  {frets.map((fret, stringIndex) => (
                    <div key={stringIndex} className="relative flex flex-col items-center">
                      {/* String line */}
                      <div className="w-0.5 h-4 bg-gray-600" style={{ 
                        backgroundColor: stringIndex === 0 || stringIndex === 5 ? '#8B4513' : '#C0C0C0' 
                      }} />
                      
                      {/* Finger position */}
                      {fret === fretNumber && fret > 0 && (
                        <div className="absolute top-1/2 transform -translate-y-1/2 w-4 h-4 bg-red-600 rounded-full border-2 border-white shadow-lg flex items-center justify-center">
                          <span className="text-white text-[8px] font-bold">{fret}</span>
                        </div>
                      )}
                    </div>
                  ))}
                </div>
                
                {/* Fret number */}
                <div className="absolute -right-8 top-1/2 transform -translate-y-1/2">
                  <span className="text-xs text-amber-800 font-medium">{fretNumber}</span>
                </div>
              </div>
            ))}
          </div>

          {/* Legend */}
          <div className="mt-4 pt-3 border-t border-amber-300">
            <div className="text-center text-xs text-amber-800">
              <div className="flex justify-center items-center gap-4">
                <span>× = Muted</span>
                <span>O = Open</span>
                <span>• = Fret</span>
              </div>
            </div>
          </div>
        </div>
      </div>
    );
  };

  return (
    <div className="space-y-6">
      {/* Controls */}
      <div className="space-y-4">
        <div className="grid grid-cols-2 gap-4">
          <div>
            <label className="block text-sm dropsource-text-secondary mb-2">Key</label>
            <Select value={selectedKey} onValueChange={setSelectedKey}>
              <SelectTrigger className="dropsource-border-glow bg-transparent text-white">
                <SelectValue />
              </SelectTrigger>
              <SelectContent className="dropsource-panel border-gray-700">
                {keys.map(key => (
                  <SelectItem key={key} value={key} className="text-white hover:bg-gray-700">
                    {key}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          <div>
            <label className="block text-sm dropsource-text-secondary mb-2">Chord Type</label>
            <Select value={selectedChord} onValueChange={setSelectedChord}>
              <SelectTrigger className="dropsource-border-glow bg-transparent text-white">
                <SelectValue />
              </SelectTrigger>
              <SelectContent className="dropsource-panel border-gray-700">
                {Object.entries(chordTypes).map(([key, chord]) => (
                  <SelectItem key={key} value={key} className="text-white hover:bg-gray-700">
                    {chord.name}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
        </div>

        {/* Display mode toggle */}
        <div className="flex gap-2">
          <Button
            variant={displayMode === 'piano' ? 'default' : 'outline'}
            size="sm"
            onClick={() => setDisplayMode('piano')}
            className={`flex-1 ${displayMode === 'piano' ? 'dropsource-gradient text-white' : 'border-gray-600 dropsource-text-secondary hover:text-cyan-400'}`}
          >
            <Piano className="w-4 h-4 mr-2" />
            Piano
          </Button>
          <Button
            variant={displayMode === 'guitar' ? 'default' : 'outline'}
            size="sm"
            onClick={() => setDisplayMode('guitar')}
            className={`flex-1 ${displayMode === 'guitar' ? 'dropsource-gradient text-white' : 'border-gray-600 dropsource-text-secondary hover:text-cyan-400'}`}
          >
            <Guitar className="w-4 h-4 mr-2" />
            Guitar
          </Button>
        </div>
      </div>

      {/* Current chord display */}
      <Card className="p-4 bg-gray-900/50 border-gray-700">
        <h3 className="text-lg font-medium dropsource-text-primary mb-2 text-center">
          {currentChordName}
        </h3>
        <div className="text-center dropsource-text-secondary text-sm">
          Notes: {currentChordNotes.map(note => note.note).join(' - ')}
        </div>
      </Card>

      {/* Instrument display */}
      <div className="bg-gray-900/30 rounded-lg p-6">
        {displayMode === 'piano' ? <PianoKeyboard /> : <GuitarFretboard />}
      </div>

      {/* Chord progression suggestions */}
      <div>
        <h4 className="font-medium dropsource-text-primary mb-3">Common Progressions in {selectedKey}:</h4>
        <div className="space-y-2">
          {[
            { name: 'I-V-vi-IV', chords: ['major', 'major', 'minor', 'major'], roman: ['I', 'V', 'vi', 'IV'] },
            { name: 'vi-IV-I-V', chords: ['minor', 'major', 'major', 'major'], roman: ['vi', 'IV', 'I', 'V'] },
            { name: 'I-vi-IV-V', chords: ['major', 'minor', 'major', 'major'], roman: ['I', 'vi', 'IV', 'V'] },
          ].map((progression, index) => (
            <div key={index} className="flex items-center justify-between p-3 bg-gray-800/30 rounded-lg">
              <div>
                <span className="dropsource-text-primary font-medium">{progression.name}</span>
                <div className="text-sm dropsource-text-secondary">
                  {progression.roman.join(' - ')}
                </div>
              </div>
              <Button
                variant="outline"
                size="sm"
                className="border-gray-600 dropsource-text-secondary hover:text-cyan-400 hover:border-cyan-400"
                onClick={() => {
                  // Insert chord progression into lyrics
                  if ((window as any).insertIntoLyrics) {
                    const chordText = progression.roman.map(roman => `[${roman}]`).join(' ');
                    (window as any).insertIntoLyrics(`chord-progression:${chordText}`);
                  }
                }}
              >
                Insert
              </Button>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}